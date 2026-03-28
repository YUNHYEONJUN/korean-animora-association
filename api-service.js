/**
 * API 서비스 레이어
 * OpenAI API 및 백엔드 서버와의 통신 처리
 */

class AnimoraAPIService {
    constructor() {
        this.config = ANIMORA_CONFIG;
        this.isPremiumUser = false; // 실제로는 사용자 인증 시스템에서 관리
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
        
        try {
            // 실제 API 호출은 백엔드를 통해 진행 (보안)
            const apiUrl = this.config.api.backend.baseUrl + this.config.api.backend.endpoints.analysis;

            console.log('API 호출 중:', apiUrl);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    analysisData,
                    questionType,
                    timestamp: new Date().toISOString()
                }),
                mode: 'cors',
                credentials: 'omit',
                cache: 'no-cache',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API 응답 오류:', errorText);
                throw new Error('API 요청 실패');
            }
            
            const data = await response.json();
            console.log('API 응답 성공:', data);
            
            if (data.success && data.analysis) {
                return data.analysis;
            } else {
                throw new Error('분석 데이터 없음');
            }
            
        } catch (error) {
            console.error('❌ AI 분석 생성 오류:', error);
            console.error('오류 상세:', error.message);
            console.error('오류 스택:', error.stack);
            // 오류 시 기본 분석 반환
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
        
        // 자유 질문인 경우
        if (data.questionType === 'free_form') {
            const context = data.variables.context || '';
            const question = data.variables.question || '';
            prompt = `${context}\n\n질문: ${question}\n\n위의 아니모라 성격 분석 정보를 바탕으로 질문에 대해 전문적이고 구체적인 답변을 한국어로 제공해주세요.`;
        } else {
            // 템플릿 질문인 경우
            const template = this.config.customQuestionTemplates.find(
                t => t.id === data.questionType
            );
            
            if (!template) {
                throw new Error('지원하지 않는 질문 유형입니다.');
            }
            
            // 프롬프트 생성
            prompt = template.prompt;
            Object.keys(data.variables).forEach(key => {
                prompt = prompt.replace(`{{${key}}}`, data.variables[key]);
            });
        }
        
        if (!this.config.api.openai.enabled) {
            return this._getMockCustomResponse(template.id, data);
        }
        
        try {
            const apiUrl = this.config.api.backend.baseUrl + this.config.api.backend.endpoints.customQuestion;

            console.log('맞춤 질문 API 호출:', apiUrl);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    templateId: templateId,
                    data,
                    timestamp: new Date().toISOString()
                }),
                mode: 'cors',
                credentials: 'omit',
                cache: 'no-cache',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('맞춤 질문 API 오류:', errorText);
                throw new Error('맞춤 질문 요청 실패');
            }
            
            const result = await response.json();
            console.log('맞춤 질문 응답 성공:', result);
            
            if (result.success && result.answer) {
                return result.answer;
            } else {
                throw new Error('응답 데이터 없음');
            }
            
        } catch (error) {
            console.error('맞춤 질문 처리 오류:', error);
            // 자유 질문의 경우 mock 응답 없음
            if (data.questionType === 'free_form') {
                throw error;
            }
            return this._getMockCustomResponse(templateId, data);
        }
    }
    
    /**
     * 결제 처리 (향후 구현)
     * @param {Object} paymentData - 결제 정보
     * @returns {Promise<Object>} 결제 결과
     */
    async processPayment(paymentData) {
        // 실제로는 PG사 연동 (토스페이먼츠, 카카오페이 등)
        console.log('결제 처리:', paymentData);
        
        return {
            success: false,
            message: '결제 시스템은 곧 오픈됩니다.',
            mockMode: true
        };
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
        const mockResponses = {
            conflict_resolution: `
                <div class="custom-answer">
                    <h4>🤝 화해 방법 (미리보기)</h4>
                    <p><strong>⚠️ 실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>API 연동 시 제공될 내용 예시:</p>
                    <ol>
                        <li><strong>타이밍:</strong> ${data.variables.person1}의 유형은 즉시 대화를 선호하지만, 
                        ${data.variables.person2}는 시간을 두고 정리하는 것이 좋습니다.</li>
                        <li><strong>대화 방식:</strong> 구체적인 상황과 감정을 표현하는 방법</li>
                        <li><strong>화해 제스처:</strong> 각 유형에 맞는 효과적인 화해 방법</li>
                    </ol>
                </div>
            `,
            gift_suggestion: `
                <div class="custom-answer">
                    <h4>🎁 선물 추천 (미리보기)</h4>
                    <p><strong>⚠️ 실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>API 연동 시 5가지 맞춤 선물 추천 예시:</p>
                    <ul>
                        <li>1. 유형 특성에 맞는 경험형 선물</li>
                        <li>2. 감성을 자극하는 실용적 아이템</li>
                        <li>3. 취미와 관련된 프리미엄 용품</li>
                        <li>4. 개인 성장을 돕는 선물</li>
                        <li>5. 관계를 돈독하게 하는 추억 선물</li>
                    </ul>
                </div>
            `,
            teen_communication: `
                <div class="custom-answer">
                    <h4>👨‍👧 사춘기 대화법 (미리보기)</h4>
                    <p><strong>⚠️ 실제 AI 분석은 API 연동 후 제공됩니다.</strong></p>
                    <p>API 연동 시 제공될 구체적 대화 전략:</p>
                    <ol>
                        <li>자녀의 유형별 감정 표현 방식 이해</li>
                        <li>효과적인 경청 및 공감 방법</li>
                        <li>갈등 상황별 대응 스크립트</li>
                        <li>신뢰 구축을 위한 일상 대화 팁</li>
                    </ol>
                </div>
            `
        };
        
        return mockResponses[templateId] || mockResponses.conflict_resolution;
    }
}

// 전역 인스턴스 생성
const animoraAPI = new AnimoraAPIService();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimoraAPIService;
}
