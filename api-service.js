/**
 * API 서비스 레이어
 * OpenAI API 및 백엔드 서버와의 통신 처리
 */

class AnimoraAPIService {
    constructor() {
        this.config = ANIMORA_CONFIG;
        this._pendingRequests = new Map();
        // AnimoraAuth 준비되면 구독
        if (typeof AnimoraAuth !== 'undefined') {
            AnimoraAuth.onChange(() => { /* 상태 변경 시 자동 반영 */ });
        }
    }

    get isPremiumUser() {
        return typeof AnimoraAuth !== 'undefined' ? AnimoraAuth.isPremium() : false;
    }

    /**
     * 재시도 로직이 포함된 fetch 래퍼 (JWT 자동 주입)
     */
    async _fetchWithRetry(url, options, retries = 2) {
        // Authorization 헤더 자동 주입
        let token = null;
        if (typeof AnimoraAuth !== 'undefined') {
            token = await AnimoraAuth.ensureValidToken().catch(() => null);
        }
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const mergedOptions = {
            ...options,
            headers: { ...(options.headers || {}), ...authHeaders },
        };

        for (let attempt = 0; attempt <= retries; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            try {
                const response = await fetch(url, { ...mergedOptions, signal: controller.signal });
                clearTimeout(timeoutId);
                if (response.ok || attempt === retries) return response;
                if (response.status < 500) return response;
            } catch (err) {
                clearTimeout(timeoutId);
                if (attempt === retries) throw err;
            }
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
    }

    /**
     * 디바운스된 요청 (동일 키로 중복 요청 방지)
     * @param {string} key - 요청 식별 키
     * @param {Function} fn - 실행할 비동기 함수
     * @returns {Promise}
     */
    async _deduplicateRequest(key, fn) {
        if (this._pendingRequests.has(key)) {
            return this._pendingRequests.get(key);
        }
        const promise = fn().finally(() => this._pendingRequests.delete(key));
        this._pendingRequests.set(key, promise);
        return promise;
    }
    
    /**
     * OpenAI API를 통한 AI 분석 생성
     * @param {Object} analysisData - 분석 데이터
     * @param {String} questionType - 질문 유형
     * @returns {Promise<String>} AI 생성 응답
     */
    async generateAIAnalysis(analysisData, questionType = 'basic') {
        if (!this.config.api.openai.enabled) {
            return this._getMockAIResponse(analysisData, questionType);
        }
        
        const requestKey = `analysis_${JSON.stringify(analysisData)}_${questionType}`;

        try {
            return await this._deduplicateRequest(requestKey, async () => {
                const apiUrl = this.config.api.backend.baseUrl + this.config.api.backend.endpoints.analysis;

                const response = await this._fetchWithRetry(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        analysisData,
                        questionType,
                        timestamp: new Date().toISOString()
                    }),
                    mode: 'cors',
                    credentials: 'omit',
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }

                const data = await response.json();

                if (data.success && data.analysis) {
                    return data.analysis;
                } else {
                    throw new Error('분석 데이터 없음');
                }
            });
        } catch (error) {
            return this._getMockAIResponse(analysisData, questionType);
        }
    }
    
    /**
     * 맞춤형 질문 처리
     * @param {Object} data - 질문 데이터
     * @returns {Promise<String>} AI 생성 응답
     */
    async askCustomQuestion(data) {
        let prompt;
        let templateId = data.questionType;
        let template = null;

        // 자유 질문인 경우
        if (data.questionType === 'free_form') {
            const context = data.variables.context || '';
            const question = data.variables.question || '';
            prompt = `${context}\n\n질문: ${question}\n\n위의 아니모라 성격 분석 정보를 바탕으로 질문에 대해 전문적이고 구체적인 답변을 한국어로 제공해주세요.`;
        } else {
            // 템플릿 질문인 경우
            template = this.config.customQuestionTemplates.find(
                t => t.id === data.questionType
            );

            if (!template) {
                throw new Error('지원하지 않는 질문 유형입니다.');
            }

            // 프롬프트 생성 (키를 정규식 안전하게 이스케이프)
            prompt = template.prompt;
            Object.keys(data.variables).forEach(key => {
                const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                prompt = prompt.replace(new RegExp('\\{\\{' + safeKey + '\\}\\}', 'g'), data.variables[key] || '');
            });
        }

        if (!this.config.api.openai.enabled) {
            if (data.questionType === 'free_form') {
                return '<div class="custom-answer"><h4>직접 질문 (미리보기)</h4><p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p><p>질문을 접수했습니다. API 연동 시 맞춤형 답변을 받으실 수 있습니다.</p></div>';
            }
            return this._getMockCustomResponse(templateId, data);
        }
        
        const requestKey = `custom_${templateId}_${JSON.stringify(data.variables)}`;

        try {
            return await this._deduplicateRequest(requestKey, async () => {
                const apiUrl = this.config.api.backend.baseUrl + this.config.api.backend.endpoints.customQuestion;

                const response = await this._fetchWithRetry(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        templateId: templateId,
                        data,
                        timestamp: new Date().toISOString()
                    }),
                    mode: 'cors',
                    credentials: 'omit',
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error('맞춤 질문 요청 실패');
                }

                const result = await response.json();

                if (result.success && result.answer) {
                    return result.answer;
                } else {
                    throw new Error('응답 데이터 없음');
                }
            });
        } catch (error) {
            if (data.questionType === 'free_form') {
                throw error;
            }
            return this._getMockCustomResponse(templateId, data);
        }
    }
    
    /**
     * 토스페이먼츠 결제 확인
     * 클라이언트에서 토스 SDK로 결제 위젯을 띄운 뒤 성공 콜백으로 받은 값을 전달
     * @param {string} paymentKey - 토스에서 반환한 paymentKey
     * @param {string} orderId    - 주문 ID
     * @param {number} amount     - 결제 금액
     */
    async processPayment({ paymentKey, orderId, amount }) {
        if (!paymentKey || !orderId || !amount) throw new Error('결제 정보가 부족합니다.');
        if (typeof AnimoraAuth === 'undefined' || !AnimoraAuth.isLoggedIn()) {
            throw new Error('결제하려면 로그인이 필요합니다.');
        }
        return AnimoraAuth.confirmPayment(paymentKey, orderId, amount);
    }

    /**
     * 토스페이먼츠 결제 위젯 초기화
     * ANIMORA_CONFIG.payment.tossClientKey 설정 후 사용
     */
    initTossPayment(amount, orderId, orderName) {
        const clientKey = this.config.payment && this.config.payment.tossClientKey;
        if (!clientKey) {
            console.warn('토스페이먼츠 클라이언트 키가 설정되지 않았습니다. (config.payment.tossClientKey)');
            return null;
        }
        // TossPayments SDK가 로드된 경우
        if (typeof TossPayments === 'undefined') {
            console.warn('토스페이먼츠 SDK가 로드되지 않았습니다.');
            return null;
        }
        const toss = TossPayments(clientKey);
        return toss.requestPayment('카드', {
            amount,
            orderId,
            orderName,
            customerName: AnimoraAuth.getCachedUser()?.name || '고객',
            customerEmail: AnimoraAuth.getCachedUser()?.email || '',
            successUrl: `${location.origin}${location.pathname}?payment=success`,
            failUrl: `${location.origin}${location.pathname}?payment=fail`,
        });
    }
    
    /**
     * Mock AI 응답 생성 (API 미연동 시)
     */
    _getMockAIResponse(analysisData, questionType) {
        const responses = {
            basic: `
                <div class="ai-analysis-section">
                    <h4>🤖 AI 상세 분석 (미리보기)</h4>
                    <p><strong>⚠️ 이 기능은 API 연동 후 사용 가능합니다.</strong></p>
                    <p>API 연동 시 제공될 내용:</p>
                    <ul>
                        <li>✓ 개인화된 심층 성격 분석</li>
                        <li>✓ 구체적인 상황별 조언</li>
                        <li>✓ 실생활 적용 전략</li>
                        <li>✓ 장단점 극복 방법</li>
                    </ul>
                </div>
            `,
            detailed: `
                <div class="ai-analysis-section">
                    <h4>🌟 AI 프리미엄 분석 (미리보기)</h4>
                    <p><strong>⚠️ 프리미엄 기능은 API 연동 후 제공됩니다.</strong></p>
                    <p>프리미엄 분석 내용:</p>
                    <ul>
                        <li>✓ 5페이지 분량의 상세 분석</li>
                        <li>✓ 과거-현재-미래 흐름 분석</li>
                        <li>✓ 인생 전환점 예측</li>
                        <li>✓ 맞춤형 자기계발 로드맵</li>
                    </ul>
                </div>
            `
        };
        
        return responses[questionType] || responses.basic;
    }
    
    /**
     * Mock 맞춤 질문 응답
     */
    _getMockCustomResponse(templateId, data) {
        const v = data.variables || {};
        const personName = v.person || v.person1 || '사용자';

        const mockResponses = {
            conflict_resolution: `
                <div class="custom-answer">
                    <h4>화해 방법 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>API 연동 시 제공될 내용:</p>
                    <ol>
                        <li><strong>타이밍:</strong> 각 유형에 맞는 화해 시점 분석</li>
                        <li><strong>대화 방식:</strong> 구체적인 상황과 감정을 표현하는 방법</li>
                        <li><strong>화해 제스처:</strong> 각 유형에 맞는 효과적인 화해 방법</li>
                    </ol>
                </div>
            `,
            gift_suggestion: `
                <div class="custom-answer">
                    <h4>선물 추천 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>${personName}님의 유형에 맞는 선물 추천:</p>
                    <ul>
                        <li>1. 유형 특성에 맞는 경험형 선물</li>
                        <li>2. 감성을 자극하는 실용적 아이템</li>
                        <li>3. 취미와 관련된 프리미엄 용품</li>
                    </ul>
                </div>
            `,
            teen_communication: `
                <div class="custom-answer">
                    <h4>사춘기 대화법 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>API 연동 시 제공될 구체적 대화 전략:</p>
                    <ol>
                        <li>자녀의 유형별 감정 표현 방식 이해</li>
                        <li>효과적인 경청 및 공감 방법</li>
                        <li>갈등 상황별 대응 스크립트</li>
                    </ol>
                </div>
            `,
            career_advice: `
                <div class="custom-answer">
                    <h4>진로 조언 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>${personName}님의 유형에 맞는 직업 추천과 커리어 전략을 받아보세요.</p>
                </div>
            `,
            health_wellness: `
                <div class="custom-answer">
                    <h4>건강 조언 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>${personName}님의 유형에 맞는 건강 관리법을 받아보세요.</p>
                </div>
            `,
            financial_habits: `
                <div class="custom-answer">
                    <h4>재테크 조언 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>${personName}님의 유형에 맞는 재테크 전략을 받아보세요.</p>
                </div>
            `,
            study_method: `
                <div class="custom-answer">
                    <h4>학습법 조언 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>${personName}님의 유형에 맞는 학습 전략을 받아보세요.</p>
                </div>
            `,
            stress_management: `
                <div class="custom-answer">
                    <h4>스트레스 관리 (미리보기)</h4>
                    <p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>${personName}님의 유형에 맞는 스트레스 해소법을 받아보세요.</p>
                </div>
            `
        };

        return mockResponses[templateId] || `<div class="custom-answer"><h4>맞춤 분석 (미리보기)</h4><p><strong>실제 AI 분석은 API 연동 후 제공됩니다.</strong></p></div>`;
    }
}

// 전역 인스턴스 생성
const animoraAPI = new AnimoraAPIService();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimoraAPIService;
}
