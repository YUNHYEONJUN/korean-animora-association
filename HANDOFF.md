# 아니모라 협회 작업 인수인계

> 새 Claude Code 창에서 이 파일을 먼저 읽고 작업을 이어가세요.

## 프로젝트 개요

- **사이트**: 한국아니모라협회 — 음력 생일로 360가지 인생 유형 분석
- **프런트**: GitHub Pages (정적 HTML/CSS/JS)
- **백엔드**: Cloudflare Workers (`cloudflare-worker/src/index.js`) — 운영
- **AI**: OpenAI API (gpt-4o), Cloudflare Worker 경유
- **레거시 백엔드**: `backend/server.py` (Flask) — 로컬 개발 전용

---

## 완료된 작업 목록

### 보안 (모두 완료)
| 파일 | 수정 내용 |
|------|-----------|
| `backend/server.py` | CORS `*`→화이트리스트, Rate Limit(threading), 입력 sanitize, 에러 마스킹, MAX_CONTENT_LENGTH 50KB, host 127.0.0.1 기본값 |
| `cloudflare-worker/src/index.js` | XFF 제거→CF-Connecting-IP 전용, KV Rate Limit(인메모리 fallback 포함) |
| `cloudflare-worker/wrangler.toml` | ALLOW_LOCALHOST 추가, KV 네임스페이스 설정 가이드 주석 |
| `index/analysis/education.html` | CSP `script-src`에서 `unsafe-inline` 제거 |

### 코드 품질
| 파일 | 수정 내용 |
|------|-----------|
| `backend/server.py` | Dead code 40줄 제거, 전체 구조 정리 |
| `config.js` | ANIMORA_ENV — localhost/127.0.0.1 기반 감지로 교체 (커스텀 도메인 production 처리) |
| `sw.js` | CACHE_VERSION 상수화, BASE 변수화, init.js 추가 |

### 기능 완성
| 파일 | 수정 내용 |
|------|-----------|
| `init.js` (신규) | GA 조건부 로드 + SW 등록 — inline script 제거용 외부 파일 |
| `cloudflare-worker/src/index.js` | AI 응답 KV 캐싱 (개인분석 월+일+성별+질문유형 key, 7일 TTL, 이름 placeholder 복원) |
| `premium-features.js` | `buildShareUrl()` 딥링크 URL 생성, Web Share API 네이티브 공유, 카카오 fallback, 링크 복사 토스트, PDF → html2canvas+jsPDF 한글 완전 지원 |
| `analysis.js` | `_handleUrlParams()` URL 파라미터 딥링크 자동 실행, 공유 모달 UI 개선 |

---

## 완료된 작업 (2026-06-04 전체, 2회차 포함)

| 항목 | 상태 | 비고 |
|------|------|------|
| KV 네임스페이스 생성 + 배포 | ✅ | RATE_LIMIT_KV / ANALYSIS_CACHE_KV / AUTH_KV 3개 바인딩 |
| 관리자 대시보드 | ✅ | `admin.html` + `/api/admin/stats` (가입자·프리미엄 카드 포함) |
| ADMIN_SECRET 설정 | ✅ | wrangler secret 등록 완료 |
| CI 개선 | ✅ | `|| true` 제거, JS 문법 검사 + Worker dry-run + 자동 배포 |
| **회원 인증 시스템** | ✅ | JWT HS256 + PBKDF2 / register·login·me·refresh·logout |
| **`isPremiumUser` 서버 검증** | ✅ | `api-service.js` getter → `AnimoraAuth.isPremium()` 연결 |
| **로그인 페이지** | ✅ | `login.html` — 탭형 로그인/회원가입, 프리미엄 혜택 안내 |
| **JWT 자동 주입** | ✅ | `api-service.js` `_fetchWithRetry`에서 토큰 자동 만료갱신+주입 |
| **토스페이먼츠 결제 코드** | ✅ | `/api/payment/confirm` 엔드포인트 구현 (env-gated) |
| **Kakao SDK 연동** | ✅ | `analysis.html` 조건부 로드 (`config.kakao.enabled: true`로 활성화) |
| **네비게이션 로그인 링크** | ✅ | `index.html`, `analysis.html` 모두 로그인 상태 동적 반영 |
| **SW 개선** | ✅ | BASE 자동 감지, `login.html`·`auth-service.js` 캐시 목록 추가, v4 |
| **CSP 업데이트** | ✅ | Kakao·Toss CDN 허용, `unsafe-inline` 인라인 스크립트 허용 |
| AUTH_SECRET 설정 | ✅ | wrangler secret 등록 완료 |
| **Worker 프리미엄 게이팅** | ✅ | detailed 분석·커스텀 질문 → 401/403 반환 |
| **로그인 Brute Force 방어** | ✅ | IP당 분당 5회 초과 → 429 차단 |
| **analysis.js 로그인 확인** | ✅ | 미로그인/비프리미엄 시 confirm → 로그인 페이지 |
| **storage-service.js 연동** | ✅ | `isPremium` getter → `AnimoraAuth.isPremium()` |
| **education.html 업데이트** | ✅ | auth-service 로드, 로그인 링크, 동적 nav |
| **sitemap.xml** | ✅ | login.html 추가, 날짜 갱신 |
| **robots.txt** | ✅ | admin.html, 테스트 파일 크롤링 차단 |
| **CI Account ID 보안** | ✅ | 하드코딩 제거 → GitHub Secret 참조 |

## 남은 작업 (우선순위순)

### 즉시 실행 가능 (값만 입력)
1. **GA4 연동** — `config.js` `analytics.gaId: ''`에 측정 ID 입력 → `enabled: true`
2. **Kakao SDK 활성화** — `config.js` `kakao.appKey: ''`에 JavaScript 키 입력 → `enabled: true`
3. **GitHub Secrets 등록** — CI 자동 배포를 위해 GitHub 리포지토리 Settings → Secrets에 추가
   - `CLOUDFLARE_API_TOKEN`: Cloudflare 대시보드 → 내 프로필 → API 토큰 생성
   - `CLOUDFLARE_ACCOUNT_ID`: `2479d336da8c6ae925621fda66df9a3c`

### 외부 승인 대기
4. **토스페이먼츠 실결제 활성화** — 승인 오면 3단계:
   - `npx wrangler secret put TOSS_SECRET_KEY` → 시크릿 키 등록
   - `config.js` `payment.tossClientKey: ''`에 클라이언트 키 입력 → `enabled: true`
   - `analysis.html`에 토스 SDK 스크립트 추가: `<script src="https://js.tosspayments.com/v1/payment"></script>`
   - 참고 메모리: `project_toss_review_revert.md`

---

## 주요 파일 경로

```
korean-animora-association-main/
├── index.html              # 홈 (분석 입력 포함)
├── analysis.html           # 분석 페이지 (개인/커플/가족)
├── education.html          # 교육 페이지
├── config.js               # 전역 설정 (API URL, 가격, GA)
├── init.js                 # GA + SW 초기화
├── analysis.js             # 분석 로직 + 결과 표시 + 공유 + URL 딥링크
├── premium-features.js     # PDF 다운로드 + 공유 기능
├── api-service.js          # CF Worker 호출 래퍼
├── animora-data.js         # 12나라 + 30동물 데이터
├── lunar-converter.js      # 양력→음력 변환 (1900-2100)
├── backend/server.py       # Flask (로컬 개발 전용)
└── cloudflare-worker/
    ├── src/index.js        # 운영 백엔드 (보안 + 캐싱 완비)
    └── wrangler.toml       # KV 설정 가이드 주석 포함
```

---

## 기술 메모

- **공유 URL 형식**: `analysis.html?t=p&m=8&d=19&g=f&n=이름` (개인) / `?t=c&m1=...&m2=...` (커플)
- **캐시 키 형식**: `ac:p:{월}:{일}:{m|f}:{basic|detailed}`
- **통계 키 형식**: `stats:total:{req|hit|api}`, `stats:d:YYYY-MM-DD:{req|hit|api}` (90일 보존)
- **Rate Limit 키**: `rl:{IP}` (KV TTL 120초)
- **wrangler secret**: `OPENAI_API_KEY` — `npx wrangler secret put OPENAI_API_KEY`
- **ADMIN_SECRET**: wrangler secret으로 등록됨 — `admin.html`에서 Bearer 토큰으로 사용
- **관리자 대시보드**: `admin.html` (로컬 또는 GitHub Pages에서 접근) → `/api/admin/stats`
- **KV 네임스페이스 ID**:
  - RATE_LIMIT_KV: `31211ccaf5944661946a8b86ec2e9174`
  - ANALYSIS_CACHE_KV: `db548558ceca43efae029da6b17ddbf6`
  - AUTH_KV: `5b8727266fa94f829e8253c0e8c8b4fd`
- **Auth KV 스키마**: `user:{email}` → `{email,name,passwordHash,passwordSalt,isPremium,createdAt}`, `rt:{uuid}` → `{userId}` (TTL 30일)
- **JWT**: HS256, accessToken 1시간 / refreshToken 30일 (KV 저장)
- **PBKDF2**: SHA-256, 10k iterations (CF Workers CPU 한도 고려)
- **wrangler secrets**: `OPENAI_API_KEY`, `ADMIN_SECRET`, `AUTH_SECRET` — 이미 등록됨
  - 토스 활성화 시: `TOSS_SECRET_KEY` 추가 필요
- **새 파일**: `auth-service.js` (클라이언트 auth), `login.html` (로그인/회원가입)
