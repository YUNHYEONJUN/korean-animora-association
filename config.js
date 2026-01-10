/**
 * 아니모라 시스템 설정 파일
 * API 키 및 프리미엄 기능 설정
 */

const ANIMORA_CONFIG = {
    // API 설정
    api: {
        // OpenAI API 설정 (향후 연동)
        openai: {
            enabled: false, // API 사용 여부
            endpoint: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-4', // 또는 'gpt-3.5-turbo'
            // API 키는 서버 사이드에서 관리 (보안상 클라이언트에 노출 금지)
        },
        
        // 백엔드 API 엔드포인트 (향후 구축)
        backend: {
            enabled: false,
            baseUrl: '/api', // 또는 실제 서버 URL
            endpoints: {
                analysis: '/analysis',
                premium: '/premium-analysis',
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
            prompt: '{{person1}}과 {{person2}}의 아니모라 유형을 고려하여, 싸움 후 효과적인 화해 방법을 구체적으로 제시해주세요.'
        },
        {
            id: 'gift_suggestion',
            title: '적합한 선물 추천',
            icon: '🎁',
            description: '아니모라 유형에 맞는 선물 아이디어',
            prompt: '{{person}}의 아니모라 유형({{country}} - {{animal}})을 고려하여, 그들이 진심으로 기뻐할 선물 5가지를 추천해주세요.'
        },
        {
            id: 'teen_communication',
            title: '사춘기 자녀 대화법',
            icon: '👨‍👧',
            description: '사춘기 자녀와의 효과적인 소통 방법',
            prompt: '사춘기 {{child}}의 아니모라 유형을 고려하여, 부모가 어떻게 대화하고 소통해야 하는지 구체적인 방법을 알려주세요.'
        },
        {
            id: 'career_advice',
            title: '직업 및 진로 조언',
            icon: '💼',
            description: '아니모라 유형에 맞는 직업 추천',
            prompt: '{{person}}의 아니모라 유형에 가장 적합한 직업군과 커리어 발전 방향을 제시해주세요.'
        },
        {
            id: 'health_wellness',
            title: '건강 및 웰빙 조언',
            icon: '🏃',
            description: '유형별 건강 관리 방법',
            prompt: '{{person}}의 아니모라 유형에 맞는 운동, 식습관, 스트레스 관리 방법을 알려주세요.'
        },
        {
            id: 'financial_habits',
            title: '재테크 성향 분석',
            icon: '💰',
            description: '아니모라 유형별 금전 관리 조언',
            prompt: '{{person}}의 아니모라 유형에 따른 금전 관리 습관과 재테크 전략을 분석해주세요.'
        },
        {
            id: 'study_method',
            title: '효과적인 학습 방법',
            icon: '📚',
            description: '유형에 맞는 공부 전략',
            prompt: '{{person}}의 아니모라 유형에 가장 효과적인 학습 스타일과 공부 방법을 제시해주세요.'
        },
        {
            id: 'stress_management',
            title: '스트레스 해소 방법',
            icon: '🧘',
            description: '유형별 스트레스 관리 전략',
            prompt: '{{person}}의 아니모라 유형에 맞는 스트레스 해소 방법과 힐링 활동을 추천해주세요.'
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
