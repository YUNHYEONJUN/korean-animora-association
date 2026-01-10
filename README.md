# 한국아니모라협회 - Korean Animora Association

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-success)](https://yunhyeonjun.github.io/korean-animora-association/)

## 🌟 프로젝트 소개

아니모라(ANIMORA)는 음력 생일로 풀어보는 360가지 인생 유형 분석 시스템입니다.
- **Anima (영혼)** + **Ora (말하다)** = 내면의 목소리
- 12개 나라 × 30개 동물 = 360가지 인생 유형

## 🚀 주요 기능

### 1. 아니모라 소개
- 360가지 유형 시스템 설명
- 명리학 기반 월주·일주 해석
- 사주팔자와의 차별점

### 2. 양력→음력 변환기
- **1900년~2100년** 정확한 변환
- 윤달 자동 감지
- 아니모라 유형 자동 표시
- ChatGPT 아니모라 AI 연동

### 3. 성격 분석 & 궁합 해석
- **개인 성격 분석**: 음력 생일로 본성과 환경 해석
- **커플 궁합 분석**: 두 사람의 관계 조화 및 주의점
- **가족 관계 분석**: 가족 구성원 역학 관계 해석
- 12개 나라 × 30개 동물 조합 상세 분석
- 관계 개선 조언 및 궁합 점수

### 4. 프리미엄 기능 🌟 NEW
#### 무료 기능
- ✅ 기본 성격 분석 및 궁합 점수
- ✅ 분석 결과 보기
- ✅ 외부 AI 링크 연동

#### 프리미엄 기능 (API 연동 후)
- 🤖 **AI 상세 분석**: ChatGPT 기반 맞춤형 해석
- 🤝 **맞춤형 질문 8가지**
  - 화해 방법 (싸웠을 때 대처법)
  - 선물 추천 (유형에 맞는 선물)
  - 자녀 대화법 (사춘기 소통법)
  - 진로 조언 (적합한 직업 추천)
  - 건강 관리 (운동, 식습관)
  - 재테크 성향 (금전 관리)
  - 학습 방법 (효과적인 공부법)
  - 스트레스 관리 (힐링 활동)
- 📄 **PDF 다운로드**: 분석 결과를 PDF로 저장
- 💾 **히스토리 관리**: 무제한 분석 이력 저장
- 🔗 **소셜 공유**: 카카오톡, 페이스북, 트위터

#### 가격 정책
- **건당 결제**
  - 기본 AI 분석: 3,000원
  - 상세 AI 분석: 5,000원
  - 맞춤형 질문: 2,000원/개
- **구독 모델**
  - 월간: 9,900원 (월 30회)
  - 연간: 99,000원 (무제한)

### 5. 교육과정
- 2박3일 전문 상담사 양성 프로그램
- 상세 커리큘럼
- 수료 후 혜택

### 6. 협회장 소개
- 임선민 회장 프로필
- 퍼스널컬러·이미지 컨설턴트
- CS 전문가

## 🌐 배포

**GitHub Pages 배포**

- 메인 페이지: [https://yunhyeonjun.github.io/korean-animora-association/](https://yunhyeonjun.github.io/korean-animora-association/)
- 성격 분석 & 궁합: [https://yunhyeonjun.github.io/korean-animora-association/analysis.html](https://yunhyeonjun.github.io/korean-animora-association/analysis.html)
- 교육과정: [https://yunhyeonjun.github.io/korean-animora-association/education.html](https://yunhyeonjun.github.io/korean-animora-association/education.html)

## 📱 반응형 디자인

- ✅ 데스크톱
- ✅ 태블릿
- ✅ 모바일

## 🛠 기술 스택

### Frontend
- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript (ES6+ 클래스 기반)
- Lunar-JavaScript (음력 변환)
- jsPDF (PDF 생성)
- LocalStorage API (히스토리 관리)

### Backend (준비 중)
- OpenAI GPT-4 / GPT-3.5 Turbo API
- Flask 또는 FastAPI (Python)
- PG 결제 연동 (토스페이먼츠/카카오페이)

## 📂 파일 구조

```
korean-animora-association/
├── index.html              # 메인 페이지
├── analysis.html           # 성격 분석 & 궁합 페이지
├── education.html          # 교육과정 페이지
├── styles.css              # 공통 스타일
├── analysis.css            # 분석 페이지 스타일
├── education.css           # 교육과정 스타일
├── script.js               # 메인 JavaScript
├── analysis.js             # 분석 페이지 로직
├── config.js               # 시스템 설정 (API, 가격 정책) 🌟 NEW
├── api-service.js          # API 통신 레이어 🌟 NEW
├── storage-service.js      # 로컬 스토리지 관리 🌟 NEW
├── premium-features.js     # 프리미엄 기능 (PDF, 공유) 🌟 NEW
├── lunar-converter.js      # 음력 변환 라이브러리
├── converter.js            # 변환기 UI
├── president-photo.jpg     # 협회장 사진
└── README.md              # 프로젝트 문서
```

## 🚀 향후 개발 계획

### Phase 1: API 통합 (준비 완료 ✅)
- [x] OpenAI API 설정 구조
- [x] 백엔드 엔드포인트 설계
- [x] Mock 응답 시스템
- [ ] 실제 API 연동

### Phase 2: 백엔드 구축
- [ ] Flask/FastAPI 서버 구축
- [ ] API 키 보안 처리
- [ ] 사용량 제한 및 관리
- [ ] 사용자 인증 시스템

### Phase 3: 결제 시스템
- [ ] PG사 연동 (토스페이먼츠/카카오페이)
- [ ] 구독 관리 시스템
- [ ] 결제 이력 관리
- [ ] 환불 처리

### Phase 4: 고급 기능
- [ ] 데이터 분석 대시보드
- [ ] 사용자 커뮤니티
- [ ] 상담사 매칭 시스템
- [ ] 모바일 앱 개발

## 📄 라이선스

© 2025 한국아니모라협회 Korean Animora Association. All rights reserved.

## 📞 문의

- 이메일: animora@example.com
- 카카오톡: @아니모라협회
- GitHub: https://github.com/YUNHYEONJUN/korean-animora-association

---

**Made with ❤️ by Korean Animora Association**

**현재 버전**: v2.0.0 (API 연동 준비 완료)
