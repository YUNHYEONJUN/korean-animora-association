/**
 * 아니모라 백엔드 API - Cloudflare Workers
 * OpenAI API 연동을 통한 AI 성격 분석
 */

import ANIMORA_KNOWLEDGE from '../../backend/animora_knowledge.json';

// ── 아니모라 시스템 프롬프트 ──────────────────────────────────────
const ANIMORA_SYSTEM_PROMPT = `당신은 한국아니모라협회의 전문 상담사입니다.

아니모라(ANIMORA)는 음력 생일의 월(나라)과 일(동물)을 조합하여 360가지 인생 유형을 분석하는 시스템입니다.

- 월주(30%): 자라난 환경, 부모의 영향, 습성 → 12개 나라
- 일주(40%): 본성, 자신의 성격, 핵심 특성 → 30개 동물

## 12개 나라(월주) 특성

1월 - 호랑이 나라 (🐯 용맹과 리더십)
- 환경: 강인하고 리더십 있는 환경에서 성장
- 특성: 강한 의지력, 리더십과 주도성, 용맹함과 결단력, 정의감
- 약점: 강한 자존심이 관계에서 갈등 유발

2월 - 토끼 나라 (🐰 온화와 섬세함)
- 환경: 온화하고 섬세한 환경에서 성장
- 특성: 친절하고 배려심 많음, 예민한 감수성, 평화 추구, 대인관계 원만
- 약점: 지나친 눈치로 인한 자기희생

3월 - 용 나라 (🐉 카리스마와 야망)
- 환경: 카리스마 넘치고 야망이 큰 환경에서 성장
- 특성: 강한 카리스마, 큰 꿈과 비전, 자신감, 영향력
- 약점: 높은 이상으로 인한 현실과의 괴리

4월 - 뱀 나라 (🐍 지혜와 신중함)
- 환경: 지혜롭고 신중한 환경에서 성장
- 특성: 깊은 통찰력, 신중한 판단, 전략적 사고, 집중력
- 약점: 지나친 신중함으로 기회 상실

5월 - 말 나라 (🐴 열정과 자유)
- 환경: 열정적이고 자유로운 환경에서 성장
- 특성: 자유로운 영혼, 열정과 활력, 모험심, 낙관적
- 약점: 변덕스러움과 책임감 부족

6월 - 양 나라 (🐑 평화와 조화)
- 환경: 평화롭고 조화로운 환경에서 성장
- 특성: 평화주의, 예술적 감각, 공감 능력, 온순함
- 약점: 우유부단함과 의존성

7월 - 원숭이 나라 (🐵 영리함과 재치)
- 환경: 영리하고 재치 있는 환경에서 성장
- 특성: 높은 지능, 유머 감각, 적응력, 창의성
- 약점: 장난기와 불안정함으로 신뢰 손상

8월 - 닭 나라 (🐓 성실과 정확성)
- 환경: 성실하고 정확한 환경에서 성장
- 특성: 근면성실, 완벽주의, 정확성, 책임감
- 약점: 지나친 완벽주의로 인한 스트레스

9월 - 개 나라 (🐕 충성과 의리)
- 환경: 충성스럽고 의리 있는 환경에서 성장
- 특성: 충성심, 의리, 보호본능, 정직함
- 약점: 의심과 경계심으로 새로운 관계 형성 어려움

10월 - 돼지 나라 (🐷 관대함과 풍요)
- 환경: 관대하고 풍요로운 환경에서 성장
- 특성: 관대함, 낙천적, 풍부한 감정, 사교성
- 약점: 지나친 낙관주의로 현실 인식 저하

11월 - 쥐 나라 (🐭 민첩함과 적응력)
- 환경: 민첩하고 적응력 있는 환경에서 성장
- 특성: 빠른 적응력, 기회 포착, 영리함, 생존력
- 약점: 이기심과 계산적 태도

12월 - 소 나라 (🐂 인내와 성실)
- 환경: 인내심 있고 성실한 환경에서 성장
- 특성: 인내심, 끈기, 안정성, 신뢰성
- 약점: 고집과 변화 저항

## 30개 동물(일주) 본성 - 공식 아니모라 동물표
## 상(11~20일), 중(1~10일), 하(21~30일)

### 호랑이과 (1, 11, 21일)
- 1일: 호랑이 (중) - 강인한 생존력과 독립심, 균형 잡힌 힘과 판단력
- 11일: 호랑이 (상) - 강력한 카리스마와 리더십, 자존심과 용맹함
- 21일: 고양이 (하) - 독립적이고 예민한 감각, 자유로움과 선택적 애정

### 토끼과 (2, 12, 22일)
- 2일: 야생토끼 (중) - 민첩하고 경계심 강함, 생존 본능 탁월
- 12일: 오소리 (상) - 온화한 외모와 달리 강한 끈기와 투지, 집념
- 22일: 집토끼 (하) - 온순하고 안정 추구, 편안한 환경에서 능력 발휘

### 용과 (3, 13, 23일)
- 3일: 이무기 (중) - 큰 잠재력을 품고 때를 기다림, 인내와 성취욕
- 13일: 용 (상) - 강한 카리스마와 높은 이상, 비전과 영향력
- 23일: 도롱뇽 (하) - 유연하고 적응력 있음, 환경 변화에 빠르게 순응

### 뱀과 (4, 14, 24일)
- 4일: 아나콘다 (중) - 강력한 직감과 현실 감각, 한 방의 몰입력
- 14일: 구렁이 (상) - 신중하고 전략적, 깊은 통찰력
- 24일: 꽃뱀 (하) - 매력적이고 감각적, 관계 지능 높음

### 말과 (5, 15, 25일)
- 5일: 야생마 (중) - 자유로운 영혼, 열정과 속도감
- 15일: 경주마 (상) - 목표를 향해 질주하는 승부사, 경쟁 속 성취
- 25일: 명품마 (하) - 품격 있고 우아함, 인정 욕구

### 양과 (6, 16, 26일)
- 6일: 양 (중) - 평화주의, 공감 능력, 온순함
- 16일: 산양 (상) - 온화하지만 고집 있음, 독립적이고 인내심 강함
- 26일: 염소 (하) - 소박하고 실용적, 현실적 판단력

### 원숭이과 (7, 17, 27일)
- 7일: 오랑우탄 (중) - 사려 깊고 지적, 깊이 있는 사고와 관찰력
- 17일: 고릴라 (상) - 강력한 힘과 온화한 리더십, 가족과 무리 보호
- 27일: 침팬지 (하) - 적응력과 친화력, 사회성과 유연한 사고

### 닭과 (8, 18, 28일)
- 8일: 장미계 (중) - 화려하고 자신감 넘침, 자기 표현에 능함
- 18일: 수탉 (상) - 책임감 있고 성실, 시간 관념 철저, 리더의 자질
- 28일: 암탉 (하) - 따뜻하고 헌신적, 가정과 조직을 돌보는 세심함

### 개과 (9, 19, 29일)
- 9일: 들개 (중) - 생존 감각과 현실 전략, 독립적 생존력
- 19일: 늑대 (상) - 강한 리더십과 충성심, 협력과 의리
- 29일: 강아지 (하) - 순수하고 충성스러움, 사랑받고 싶은 욕구

### 돼지과 (10, 20, 30일)
- 10일: 멧돼지 (중) - 거침없는 추진력과 강한 생명력, 돌파력
- 20일: 수돼지 (상) - 풍요와 관대함, 베풀기 좋아하고 호탕한 성격
- 30일: 암돼지 (하) - 모성애와 포용력, 현실적이고 실속 있는 삶

당신의 역할:
1. **정확한 아니모라 이론 적용**: 위 12개 나라와 30개 동물의 특성을 정확히 반영
2. **나라-동물 조합 분석**: 환경(나라)과 본성(동물)의 상호작용 해석
3. **실생활 적용**: 구체적이고 실용적인 조언 제공
4. **한국 문화 반영**: 명리학과 한국 문화에 기반한 해석
5. **따뜻한 상담**: 공감적이고 긍정적인 톤 유지

답변 스타일 및 구조 (11단계 분석 프레임워크):

**개인 분석 시 다음 구조를 따르세요:**
1. **[변환안내]**: 입력된 날짜의 음력 변환 결과와 나라+동물 조합 안내
2. **[나라 해석]**: 해당 월(나라)의 환경적 특성, 성장 배경, 내면 세계 (상/중/하 등급 포함)
3. **[동물 해석]**: 해당 일(동물)의 본성, 핵심 성격, 행동 패턴
4. **[유리의 방 vs 거울의 방]**: 남들이 보는 나(유리의 방)와 진짜 내면(거울의 방)의 대비
5. **[세상과 나의 관계]**: 환경(나라)과 본성(동물)의 충돌·조화 구조, 실제 인생에서의 발현
6. **[인생 흐름 & 성장패턴]**: 20대/30대/중년 이후의 변화 곡선
7. **[직업/관계/감각 요약]**: 적합 직업, 관계 스타일, 감각적 특징
8. **[리듬요약표]**: 핵심 특성을 표 형태로 정리 (강점/약점/주의점/추천)
9. **[연애 궁합 힌트]**: 잘 맞는 조합과 주의할 조합
10. **[취향 해석]**: 음식, 공간, 활동 등 라이프스타일 성향
11. **[한줄 메시지]**: 철학적이고 기억에 남는 마무리 문장

**궁합 분석 시 추가 요소:**
- 각 사람의 나라와 동물 특성을 별도로 상세히 해석
- 연애/관계에서의 구체적 행동 패턴 제시
- "다만", "하지만"으로 약점도 솔직하게 언급
- 서로 어떻게 끌리는지, 잘 맞을 때 vs 어긋날 때의 시나리오
- 포식·보완 관계(천적/조화/무관심 역학) 분석
- 성별/역할별로 분리된 구체적 조언

**표현 원칙:**
- 🔎 🐯 🐉 💞 ✔ ⚠ 👉 ✨ 🖋 등 이모지로 가독성 향상
- 명확한 제목(1️⃣, 2️⃣)과 소제목으로 구조화
- 통찰력 있는 한 문장 요약을 각 섹션에 포함

답변 톤:
- 존댓말 사용하되 친근하고 따뜻함
- 직설적이지만 비판적이지 않음
- 깊이 있으면서도 쉬운 표현
- 개인 분석: 2500-3500자, 궁합 분석: 2000-3000자`;

// ── 지식 베이스 헬퍼 ─────────────────────────────────────────────

function getMonthKnowledge(month) {
  const months = ANIMORA_KNOWLEDGE.months || {};
  const entry = months[String(month)];
  return entry ? entry.content || '' : '';
}

function getCombinationKnowledge(month, day) {
  const combos = ANIMORA_KNOWLEDGE.combinations || {};
  const key = `${month}월${day}일`;
  const entry = combos[key];
  return entry ? entry.content || '' : '';
}

function getSpecialContent(key) {
  const special = ANIMORA_KNOWLEDGE.special_content || {};
  const entry = special[key];
  return entry ? (entry.content || '') : '';
}

// ── 보안 헬퍼 ───────────────────────────────────────────────────

const MAX_BODY_SIZE = 50 * 1024; // 50KB
const MAX_PROMPT_LENGTH = 5000;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 20; // 분당 최대 요청

// 간이 인메모리 rate limiter (Worker 인스턴스별)
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return false;
  return true;
}

// 오래된 rate limit 엔트리 정리 (요청 시 lazy cleanup)
function cleanupRateLimits() {
  const now = Date.now();
  if (rateLimitMap.size > 1000) {
    for (const [ip, entry] of rateLimitMap) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) {
        rateLimitMap.delete(ip);
      }
    }
  }
}

/**
 * 프롬프트 인젝션 방지: 사용자 입력에서 위험한 지시문 제거
 */
function sanitizeUserInput(str) {
  if (typeof str !== 'string') return '';
  // 시스템 프롬프트 오버라이드 시도 차단
  return str
    .replace(/\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, '[필터됨]')
    .replace(/\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|new\s+instructions?)\b/gi, '[필터됨]')
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .slice(0, 200); // 사용자 이름/필드는 200자 제한
}

// ── CORS ─────────────────────────────────────────────────────────

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
  // 개발 시 localhost 허용 (환경변수 ALLOW_LOCALHOST=true 설정 필요)
  const allowLocalhost = env.ALLOW_LOCALHOST === 'true';
  const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  const isAllowed = allowed.includes(origin) ||
    (allowLocalhost && localhostPattern.test(origin));

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function handleOptions(request, env) {
  return new Response(null, { status: 204, headers: corsHeaders(request, env) });
}

// ── 프롬프트 생성 ────────────────────────────────────────────────

function generatePersonalPrompt(data, questionType) {
  const name = sanitizeUserInput(data.name) || '고객';
  const gender = data.gender === 'male' ? '남성' : '여성';
  const month = Math.max(1, Math.min(12, Number(data.month) || 1));
  const day = Math.max(1, Math.min(30, Number(data.day) || 1));
  const country = sanitizeUserInput(data.country) || '알 수 없음';
  const animal = sanitizeUserInput(data.animal) || '알 수 없음';

  const monthKnowledge = getMonthKnowledge(month);
  const comboKnowledge = getCombinationKnowledge(month, day);

  let prompt = `[개인 성격 분석 요청]\n\n이름: ${name} (${gender})\n음력 생일: ${month}월 ${day}일\n나라(환경): ${country}\n동물(본성): ${animal}\n`;

  if (monthKnowledge) {
    prompt += `\n## 📚 ${country} 상세 특성 (PDF 원문)\n${monthKnowledge.slice(0, 1500)}\n`;
  }
  if (comboKnowledge) {
    prompt += `\n## 🎯 ${month}월 ${day}일 조합 분석 (PDF 원문)\n${comboKnowledge.slice(0, 1500)}\n`;
  }

  prompt += `\n위 원문 내용을 **반드시 참고**하여 다음 11단계 구조로 분석해주세요:

1. **[변환안내]**: 음력 ${month}월 ${day}일 → ${country} + ${animal} 조합 안내
2. **[나라: ${country}]**: 자라난 환경의 특성, 성장 배경이 성격에 미친 영향
3. **[동물: ${animal}]**: 타고난 본성, 핵심 성격, 행동 패턴, 강점과 약점
4. **[유리의 방 vs 거울의 방]**: 남들이 보는 모습(유리의 방)과 진짜 내면(거울의 방)의 대비
5. **[세상과 나의 관계]**: 환경(나라)과 본성(동물)의 충돌·조화, 인생에서의 실제 발현 패턴
6. **[인생 흐름 & 성장패턴]**: 20대/30대/중년 이후의 변화 곡선
7. **[직업/관계/감각 요약]**: 적합 직업, 관계 스타일, 감각적 특징
8. **[리듬요약표]**: 핵심 특성을 항목별로 정리 (강점/약점/주의점/추천)
9. **[연애 궁합 힌트]**: 잘 맞는 조합과 주의할 조합
10. **[취향 해석]**: 음식, 공간, 활동 등 라이프스타일 성향
11. **[한줄 메시지]**: 철학적이고 기억에 남는 마무리 문장

**중요**: 원문의 표현과 통찰을 최대한 살리고, 따뜻하고 공감적인 톤으로 작성해주세요. ${gender}의 특성도 반영해주세요.`;

  if (questionType === 'detailed') {
    prompt += '\n\n특히 더 깊이 있고 상세한 분석을 제공해주세요. 심리학적 관점과 구체적인 사례를 포함해주세요.';
  }
  return prompt;
}

function generateCouplePrompt(data) {
  const p1 = data.person1 || {};
  const p2 = data.person2 || {};
  const score = Number(data.compatibilityScore) || 0;

  const p1Name = sanitizeUserInput(p1.name) || '사람1';
  const p2Name = sanitizeUserInput(p2.name) || '사람2';
  const p1Country = sanitizeUserInput(p1.country);
  const p2Country = sanitizeUserInput(p2.country);
  const p1Animal = sanitizeUserInput(p1.animal);
  const p2Animal = sanitizeUserInput(p2.animal);

  const p1mk = getMonthKnowledge(p1.month);
  const p2mk = getMonthKnowledge(p2.month);
  const p1ck = getCombinationKnowledge(p1.month, p1.day);
  const p2ck = getCombinationKnowledge(p2.month, p2.day);

  let prompt = `[커플 궁합 분석 요청]

👤 첫 번째 사람: ${p1Name} (${p1.gender === 'male' ? '남성' : '여성'})
   - 음력 생일: ${p1.month}월 ${p1.day}일
   - 나라: ${p1Country}
   - 동물: ${p1Animal}

👤 두 번째 사람: ${p2Name} (${p2.gender === 'male' ? '남성' : '여성'})
   - 음력 생일: ${p2.month}월 ${p2.day}일
   - 나라: ${p2Country}
   - 동물: ${p2Animal}

💯 궁합 점수: ${score}점\n`;

  if (p1mk) prompt += `\n## 📚 ${p1Name}의 나라 (${p1Country}) 특성\n${p1mk.slice(0, 800)}\n`;
  if (p2mk) prompt += `\n## 📚 ${p2Name}의 나라 (${p2Country}) 특성\n${p2mk.slice(0, 800)}\n`;
  if (p1ck) prompt += `\n## 🎯 ${p1Name}의 조합 분석\n${p1ck.slice(0, 800)}\n`;
  if (p2ck) prompt += `\n## 🎯 ${p2Name}의 조합 분석\n${p2ck.slice(0, 800)}\n`;

  prompt += `\n위 PDF 원문을 **반드시 참고**하여, 이모지와 구조화된 형식으로 분석해주세요:

1️⃣ **두 사람의 개별 특성**
   - 각 사람의 나라와 동물이 만들어내는 고유한 성격
   - 강점과 약점

2️⃣ **관계 역학**
   - 서로 어떻게 끌리는가?
   - 포식-보완 관계는?
   - 잘 맞을 때 vs 어긋날 때의 구체적 시나리오

3️⃣ **실천 조언**
   - 성별/역할별 구체적 조언
   - 화해 방법, 소통 팁

💬 **한 문장 요약**: 이 관계를 한 문장으로 표현

🖋 **마무리**: 철학적이고 기억에 남는 시그니처 문장

**스타일**: PDF 원문의 은유와 표현을 살려서, 2000-3000자 분량으로 작성해주세요.`;

  return prompt;
}

function generateFamilyPrompt(data) {
  const members = data.members || [];
  const labels = {
    family: '가족', friend: '친구', colleague: '동료',
    partner: '연인', business: '비즈니스 파트너', team: '팀원', other: '기타'
  };

  let prompt = '[다중 관계 분석 요청]\n\n구성원 정보:\n';

  members.forEach((m, i) => {
    const rel = labels[m.relation] || '기타';
    const gender = m.gender === 'male' ? '남성' : '여성';
    const mName = sanitizeUserInput(m.name) || `구성원${i + 1}`;
    const mCountry = sanitizeUserInput(m.country);
    const mAnimal = sanitizeUserInput(m.animal);
    prompt += `\n${i + 1}. ${mName} (${rel}, ${gender})\n   - 음력: ${m.month}월 ${m.day}일\n   - 나라: ${mCountry}\n   - 동물: ${mAnimal}\n`;
  });

  prompt += `\n이 그룹의 관계를 종합적으로 분석해주세요:

1. **구성원 역학** - 각 구성원의 역할과 특성, 관계 유형을 고려한 상호작용 패턴
2. **조화 포인트** - 그룹이 잘 어울리는 부분, 서로를 이해하는 방법
3. **갈등 포인트** - 마찰이 생길 수 있는 영역, 각 구성원이 주의할 점
4. **관계 개선 조언** - 더 나은 관계를 위한 방법, 구체적인 소통 전략`;

  return prompt;
}

function generatePrompt(analysisData, questionType) {
  const type = analysisData.type || 'personal';
  if (type === 'personal') return generatePersonalPrompt(analysisData, questionType);
  if (type === 'couple') return generateCouplePrompt(analysisData);
  if (type === 'family') return generateFamilyPrompt(analysisData);
  return '알 수 없는 분석 유형입니다.';
}

// ── OpenAI 호출 ──────────────────────────────────────────────────

async function callOpenAI(env, messages) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
  }

  const model = env.OPENAI_MODEL || 'gpt-4o';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000); // 25초 타임아웃

  let res;
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 4000,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`OpenAI API 오류 (${res.status})`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI 응답에서 콘텐츠를 추출할 수 없습니다.');
  }
  return content;
}

// ── 라우터 ───────────────────────────────────────────────────────

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return handleOptions(request, env);
  }

  const requestId = crypto.randomUUID();
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Request-Id': requestId,
    ...corsHeaders(request, env),
  };

  // Rate limiting (POST 요청만)
  if (request.method === 'POST') {
    const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
    cleanupRateLimits();
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' }), {
        status: 429,
        headers: { ...headers, 'Retry-After': '60' },
      });
    }

    // Body size check
    const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (contentLength > MAX_BODY_SIZE) {
      return new Response(JSON.stringify({ error: '요청 크기가 너무 큽니다.' }), { status: 413, headers });
    }
  }

  // Health check
  if (path === '/' || path === '/api/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      service: '아니모라 백엔드 API (Cloudflare Workers)',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    }), { headers });
  }

  // AI 분석
  if (path === '/api/ai-analysis' && request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ error: '잘못된 JSON 형식입니다.' }), { status: 400, headers });
    }
    try {
      const analysisData = body.analysisData || {};
      const questionType = body.questionType || 'basic';

      if (!analysisData || Object.keys(analysisData).length === 0) {
        return new Response(JSON.stringify({ error: '분석 데이터가 필요합니다' }), { status: 400, headers });
      }

      // type 검증
      const validTypes = ['personal', 'couple', 'family'];
      if (analysisData.type && !validTypes.includes(analysisData.type)) {
        return new Response(JSON.stringify({ error: '지원하지 않는 분석 유형입니다.' }), { status: 400, headers });
      }

      // family 멤버 수 제한
      if (analysisData.type === 'family' && Array.isArray(analysisData.members) && analysisData.members.length > 10) {
        return new Response(JSON.stringify({ error: '구성원은 최대 10명까지 지원합니다.' }), { status: 400, headers });
      }

      const userPrompt = generatePrompt(analysisData, questionType);
      const analysis = await callOpenAI(env, [
        { role: 'system', content: ANIMORA_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ]);

      return new Response(JSON.stringify({
        success: true,
        analysis,
        model: env.OPENAI_MODEL || 'gpt-4o',
        timestamp: new Date().toISOString(),
      }), { headers });

    } catch (err) {
      console.error('[ai-analysis]', err.message || err);
      return new Response(JSON.stringify({
        success: false,
        error: '분석 처리 중 오류가 발생했습니다.',
      }), { status: 500, headers });
    }
  }

  // 맞춤형 질문
  if (path === '/api/custom-question' && request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ error: '잘못된 JSON 형식입니다.' }), { status: 400, headers });
    }
    try {
      const prompt = body.prompt;

      if (!prompt) {
        return new Response(JSON.stringify({ error: '프롬프트가 필요합니다' }), { status: 400, headers });
      }

      if (typeof prompt !== 'string' || prompt.length > MAX_PROMPT_LENGTH) {
        return new Response(JSON.stringify({ error: '프롬프트가 너무 깁니다.' }), { status: 400, headers });
      }

      const answer = await callOpenAI(env, [
        { role: 'system', content: ANIMORA_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ]);

      return new Response(JSON.stringify({
        success: true,
        answer,
        templateId: body.templateId || null,
        timestamp: new Date().toISOString(),
      }), { headers });

    } catch (err) {
      console.error('[custom-question]', err.message || err);
      return new Response(JSON.stringify({
        success: false,
        error: '질문 처리 중 오류가 발생했습니다.',
      }), { status: 500, headers });
    }
  }

  // 404
  return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers });
}

// ── Worker export ────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};
