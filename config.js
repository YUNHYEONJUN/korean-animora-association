/**
 * 아니모라 시스템 설정 파일
 * API 키 및 프리미엄 기능 설정
 */

const ANIMORA_CONFIG = {
    // API 설정
    api: {
        // OpenAI API 설정 (✅ 연동 완료)
        openai: {
            enabled: true, // API 사용 활성화
            endpoint: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-4',
            // API 키는 서버 사이드에서 관리 (보안상 클라이언트에 노출 금지)
        },
        
        // 백엔드 API 엔드포인트 (✅ 연동 완료)
        backend: {
            enabled: true,
            baseUrl: 'https://5000-ixqb0zibgw9tuywj5fxfb-2e1b9533.sandbox.novita.ai/api', // Flask 백엔드 서버
            endpoints: {
                analysis: '/ai-analysis',
                customQuestion: '/custom-question',
                payment: '/payment',
                history: '/history'
            }
        }
    },
    
    // 기능 설정
    features: {
        // 무료 기능
        free: {
            basicAnalysis: true,          // 기본 성격 분석
            compatibilityScore: true,      // 궁합 점수
            familyAnalysis: true,          // 가족 관계 분석
            resultView: true,              // 결과 보기
            aiLinkRedirect: true          // 외부 AI 링크
        },
        
        // 프리미엄 기능 (유료)
        premium: {
            detailedAiAnalysis: true,      // AI 상세 분석
            customQuestions: true,         // 맞춤형 질문 (화해 방법, 선물 추천 등)
            pdfDownload: true,             // PDF 다운로드
            historyStorage: true,          // 무제한 히스토리 저장
            prioritySupport: true,         // 우선 지원
            advancedInsights: true         // 고급 인사이트
        }
    },
    
    // 가격 정책
    pricing: {
        // 건당 결제
        perAnalysis: {
            basicAi: 3000,           // 기본 AI 분석 (원)
            detailedAi: 5000,        // 상세 AI 분석 (원)
            customQuestion: 2000     // 맞춤형 질문 1개 (원)
        },
        
        // 구독 모델
        subscription: {
            monthly: {
                price: 9900,         // 월 구독 (원)
                analyses: 30,        // 월 30회 분석
                customQuestions: 10  // 월 10개 맞춤 질문
            },
            yearly: {
                price: 99000,        // 연 구독 (원) - 2개월 무료
                analyses: -1,        // 무제한
                customQuestions: -1  // 무제한
            }
        }
    },
    
    // 맞춤형 질문 템플릿
    customQuestionTemplates: [
        {
            id: 'conflict_resolution',
            title: '싸웠을 때 화해 방법',
            icon: '🤝',
            description: '두 사람의 아니모라 유형에 맞는 화해 전략',
            prompt: `[화해 방법 맞춤 분석]

첫 번째 사람: {{person1}} ({{gender1}})
- 음력: {{month1}}월 {{day1}}일
- 나라(환경): {{country1}}
- 동물(본성): {{animal1}}

두 번째 사람: {{person2}} ({{gender2}})
- 음력: {{month2}}월 {{day2}}일
- 나라(환경): {{country2}}
- 동물(본성): {{animal2}}

위 두 분의 아니모라 유형(나라와 동물)을 깊이 분석하여, 갈등 후 효과적인 화해 방법을 다음과 같이 제시해주세요:

1. **{{person1}}님의 화해 접근법**
   - {{country1}}에서 자란 환경적 특성을 고려한 화해 방식
   - {{animal1}} 본성을 가진 분이 화해할 때 필요한 태도
   - 구체적인 행동 예시 3가지

2. **{{person2}}님의 화해 접근법**
   - {{country2}}에서 자란 환경적 특성을 고려한 화해 방식
   - {{animal2}} 본성을 가진 분이 화해할 때 필요한 태도
   - 구체적인 행동 예시 3가지

3. **두 분의 화해 시너지**
   - {{country1}}과 {{country2}}의 환경 차이를 어떻게 조율할지
   - {{animal1}}과 {{animal2}}의 본성 차이를 어떻게 이해할지
   - 갈등이 생겼을 때 피해야 할 말과 행동

4. **실전 화해 시나리오**
   - 두 분의 유형에 맞는 화해 대화 예시
   - 24시간 내 실천할 수 있는 구체적 행동

따뜻하고 실용적인 조언으로, 두 분이 바로 실천할 수 있는 방법을 제시해주세요.`
        },
        {
            id: 'gift_suggestion',
            title: '적합한 선물 추천',
            icon: '🎁',
            description: '아니모라 유형에 맞는 선물 아이디어',
            prompt: `[맞춤 선물 추천]

대상: {{person}} ({{gender}})
- 음력: {{month}}월 {{day}}일
- 나라(환경): {{country}}
- 동물(본성): {{animal}}

위 아니모라 유형을 깊이 분석하여, {{person}}님이 진심으로 기뻐할 선물을 추천해주세요:

1. **환경 특성을 고려한 선물** ({{country}} 출신)
   - {{country}}의 가치관과 취향을 반영한 선물 2가지
   - 각 선물이 왜 적합한지 이유 설명

2. **본성을 고려한 선물** ({{animal}} 본성)
   - {{animal}} 특성을 가진 분이 좋아하는 선물 2가지
   - 실용적이고 감성적인 균형

3. **종합 추천 베스트 1**
   - {{country}}와 {{animal}}의 조합을 완벽하게 만족시키는 최고의 선물
   - 구체적인 상품명이나 경험 제안

각 선물에 대해 구매처나 경험 방법도 함께 알려주세요.`
        },
        {
            id: 'teen_communication',
            title: '사춘기 자녀 대화법',
            icon: '👨‍👧',
            description: '사춘기 자녀와의 효과적인 소통 방법',
            prompt: `[사춘기 자녀 소통법]

자녀: {{child}} ({{gender}})
- 음력: {{month}}월 {{day}}일
- 나라(환경): {{country}}
- 동물(본성): {{animal}}

위 아니모라 유형을 바탕으로, 사춘기 자녀와의 효과적인 대화법을 제시해주세요:

1. **{{country}} 환경의 자녀 이해하기**
   - 이 환경에서 자란 자녀의 심리적 특성
   - 부모가 피해야 할 말과 행동

2. **{{animal}} 본성에 맞는 소통법**
   - 이 본성을 가진 자녀가 선호하는 대화 방식
   - 효과적인 칭찬과 훈육 방법

3. **실전 대화 시나리오**
   - 갈등 상황별 대화 예시 3가지
   - 24시간 내 실천할 수 있는 구체적 행동

따뜻하고 실용적인 조언으로 제시해주세요.`
        },
        {
            id: 'career_advice',
            title: '직업 및 진로 조언',
            icon: '💼',
            description: '아니모라 유형에 맞는 직업 추천',
            prompt: `[진로 및 직업 맞춤 분석]

대상: {{person}} ({{gender}})
- 음력: {{month}}월 {{day}}일
- 나라(환경): {{country}}
- 동물(본성): {{animal}}

위 아니모라 유형을 깊이 분석하여, 최적의 직업과 커리어 방향을 제시해주세요:

1. **환경 특성 기반 직업군** ({{country}})
   - {{country}}에서 자란 분에게 잘 맞는 직업 3가지
   - 각 직업이 적합한 이유

2. **본성 기반 직업 스타일** ({{animal}})
   - {{animal}} 본성을 가진 분의 업무 스타일
   - 강점을 살릴 수 있는 직무 특성

3. **커리어 발전 전략**
   - 단기(1년), 중기(3년), 장기(5년) 목표
   - 주의할 함정과 극복 방법

구체적이고 실행 가능한 조언을 제공해주세요.`
        },
        {
            id: 'health_wellness',
            title: '건강 및 웰빙 조언',
            icon: '🏃',
            description: '유형별 건강 관리 방법',
            prompt: `[건강 및 웰빙 맞춤 플랜]

대상: {{person}} ({{gender}})
- 음력: {{month}}월 {{day}}일
- 나라(환경): {{country}}
- 동물(본성): {{animal}}

위 아니모라 유형에 최적화된 건강 관리 방법을 제시해주세요:

1. **환경 특성 기반 건강법** ({{country}})
   - {{country}} 유형에 맞는 운동 방식
   - 선호하는 건강 활동 스타일

2. **본성 기반 웰빙 전략** ({{animal}})
   - {{animal}} 본성에 맞는 식습관
   - 스트레스 관리 및 휴식 방법

3. **실천 가능한 건강 루틴**
   - 아침/점심/저녁 건강 습관
   - 주간/월간 웰빙 체크리스트

{{gender}}의 특성도 고려하여, 실생활에서 바로 적용할 수 있는 조언을 주세요.`
        },
        {
            id: 'financial_habits',
            title: '재테크 성향 분석',
            icon: '💰',
            description: '아니모라 유형별 금전 관리 조언',
            prompt: `[재테크 성향 맞춤 분석]

대상: {{person}} ({{gender}})
- 음력: {{month}}월 {{day}}일
- 나라(환경): {{country}}
- 동물(본성): {{animal}}

위 아니모라 유형을 바탕으로, 금전 관리 습관과 재테크 전략을 분석해주세요:

1. **환경 기반 금전 성향** ({{country}})
   - {{country}} 유형의 소비 패턴
   - 돈 관리 시 강점과 약점

2. **본성 기반 투자 스타일** ({{animal}})
   - {{animal}} 본성에 맞는 투자 방법
   - 피해야 할 재테크 함정

3. **맞춤 재테크 전략**
   - 단기 저축 목표 (6개월)
   - 중장기 투자 계획 (1~3년)
   - 구체적인 포트폴리오 제안

실용적이고 안전한 재테크 조언을 제공해주세요.`
        },
        {
            id: 'study_method',
            title: '효과적인 학습 방법',
            icon: '📚',
            description: '유형에 맞는 공부 전략',
            prompt: `[맞춤 학습 전략]

대상: {{person}} ({{gender}})
- 음력: {{month}}월 {{day}}일
- 나라(환경): {{country}}
- 동물(본성): {{animal}}

위 아니모라 유형에 최적화된 학습 방법을 제시해주세요:

1. **환경 기반 학습 스타일** ({{country}})
   - {{country}} 유형이 선호하는 학습 환경
   - 집중력을 높이는 공부 장소와 시간대

2. **본성 기반 공부 방법** ({{animal}})
   - {{animal}} 본성에 맞는 학습 기법
   - 기억력과 이해력을 높이는 방법

3. **실전 학습 플랜**
   - 시험 준비 4주 계획
   - 과목별 맞춤 학습법
   - 슬럼프 극복 전략

구체적이고 실행 가능한 학습 조언을 제공해주세요.`
        },
        {
            id: 'stress_management',
            title: '스트레스 해소 방법',
            icon: '🧘',
            description: '유형별 스트레스 관리 전략',
            prompt: `[맞춤 스트레스 관리법]

대상: {{person}} ({{gender}})
- 음력: {{month}}월 {{day}}일
- 나라(환경): {{country}}
- 동물(본성): {{animal}}

위 아니모라 유형에 최적화된 스트레스 해소법을 제시해주세요:

1. **환경 특성 기반 힐링** ({{country}})
   - {{country}} 유형이 편안함을 느끼는 장소
   - 스트레스 받을 때 나타나는 신호

2. **본성 기반 회복 방법** ({{animal}})
   - {{animal}} 본성에 맞는 스트레스 해소 활동
   - 즉시 실천 가능한 이완 기법

3. **일상 속 스트레스 관리**
   - 출퇴근길 힐링 루틴
   - 주말 회복 플랜
   - 긴급 상황 대처법

{{gender}}의 특성도 고려하여, 실생활에서 바로 적용할 수 있는 방법을 알려주세요.`
        }
    ],
    
    // 로컬 스토리지 설정
    storage: {
        historyKey: 'animora_analysis_history',
        maxFreeHistory: 5,          // 무료 사용자 최대 저장 개수
        maxPremiumHistory: -1       // 프리미엄 사용자 무제한
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANIMORA_CONFIG;
}
