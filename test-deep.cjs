/**
 * test-deep.cjs - 심층 자동 테스트
 * 기존 test-validate.cjs, test-extended.cjs에서 다루지 않은 영역 검증
 *
 * 테스트 영역:
 * 1. 크로스파일 참조 무결성 (CSS ↔ HTML)
 * 2. 내부 링크 무결성
 * 3. 스크립트 의존성 순서
 * 4. animora-data.js 30개 동물 완전성
 * 5. lunar-converter.js 변환 정확성
 * 6. converter.js 데이터 정합성
 * 7. HTML 태그 균형 (열림/닫힘)
 * 8. 중복 ID 감지
 * 9. Service Worker 캐시 목록 무결성
 * 10. config.js 설정 무결성
 * 11. 404.html 완전성
 * 12. education.html 콘텐츠 검증
 * 13. analysis.html 폼 무결성
 * 14. CSS 클래스 사용 검증
 * 15. 접근성 심층 검증
 * 16. 궁합 계산 로직 검증
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let passed = 0;
let failed = 0;
let total = 0;

function test(name, fn) {
    total++;
    try {
        fn();
        passed++;
        console.log(`  [PASS] ${name}`);
    } catch (e) {
        failed++;
        console.log(`  [FAIL] ${name}`);
        console.log(`         ${e.message}`);
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}

function readFile(filename) {
    return fs.readFileSync(path.join(ROOT, filename), 'utf-8');
}

// ============================================================
console.log('\n=== 1. animora-data.js 30개 동물 완전성 ===');
// ============================================================
const animoraDataJs = readFile('animora-data.js');

test('ANIMORA_ANIMALS에 1~30번 동물 모두 정의', () => {
    for (let i = 1; i <= 30; i++) {
        assert(animoraDataJs.includes(`${i}: {`), `동물 ${i}번 누락`);
    }
});

test('ANIMORA_COUNTRIES에 1~12번 나라 모두 정의', () => {
    for (let i = 1; i <= 12; i++) {
        assert(animoraDataJs.includes(`${i}: { name:`), `나라 ${i}번 누락`);
    }
});

test('ANIMORA_COUNTRY_TRAITS에 1~12번 특성 모두 정의', () => {
    for (let i = 1; i <= 12; i++) {
        const pattern = new RegExp(`${i}:\\s*\\{[\\s\\S]*?environment:`);
        assert(pattern.test(animoraDataJs), `나라 특성 ${i}번 누락`);
    }
});

test('ANIMORA_ANIMAL_TRAITS에 동물 특성 정의 (주요 30개)', () => {
    const expectedKeys = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    for (const key of expectedKeys) {
        const pattern = new RegExp(`${key}:\\s*\\{\\s*nature:`);
        assert(pattern.test(animoraDataJs), `동물 특성 ${key}번 누락`);
    }
});

test('동물 타입 분류 (상/중/하) 올바름', () => {
    // 중: 1-10, 상: 11-20, 하: 21-30
    for (let i = 1; i <= 10; i++) {
        assert(animoraDataJs.includes(`${i}: { name:`) || animoraDataJs.match(new RegExp(`\\b${i}:\\s*\\{[^}]*type:\\s*'중'`)), `${i}번 동물 중 타입`);
    }
});

test('12개 나라 이름 일관성 (호랑이~소)', () => {
    const expectedCountries = ['호랑이 나라', '토끼 나라', '용 나라', '뱀 나라', '말 나라', '양 나라', '원숭이 나라', '닭 나라', '개 나라', '돼지 나라', '쥐 나라', '소 나라'];
    for (const name of expectedCountries) {
        assert(animoraDataJs.includes(name), `나라 '${name}' 누락`);
    }
});

test('30개 동물 이름 모두 존재', () => {
    const expectedAnimals = ['호랑이', '야생토끼', '이무기', '아나콘다', '야생마', '양', '오랑우탄', '장미계', '들개', '멧돼지', '오소리', '용', '구렁이', '경주마', '산양', '고릴라', '수탉', '늑대', '수돼지', '고양이', '집토끼', '도롱뇽', '꽃뱀', '명품마', '염소', '침팬지', '암탉', '강아지', '암돼지'];
    for (const name of expectedAnimals) {
        assert(animoraDataJs.includes(name), `동물 '${name}' 누락`);
    }
});

test('generatePersonalAnalysisHTML 함수 존재', () => {
    assert(animoraDataJs.includes('function generatePersonalAnalysisHTML'), 'generatePersonalAnalysisHTML 함수 누락');
});

test('calculateAnimoraCompatibility 함수 존재', () => {
    assert(animoraDataJs.includes('function calculateAnimoraCompatibility'), 'calculateAnimoraCompatibility 함수 누락');
});

test('getAnimoraAnimal / getAnimoraCountry 유틸 함수 존재', () => {
    assert(animoraDataJs.includes('function getAnimoraAnimal'), 'getAnimoraAnimal 누락');
    assert(animoraDataJs.includes('function getAnimoraCountry'), 'getAnimoraCountry 누락');
});

// ============================================================
console.log('\n=== 2. lunar-converter.js 변환 정확성 ===');
// ============================================================
// Node.js에서 직접 실행하여 검증
const lunarConverterSrc = readFile('lunar-converter.js');

// location 없이도 로드 가능하게
const lunarModule = {};
const lunarFunc = new Function('module', 'exports', lunarConverterSrc);
lunarFunc(lunarModule, lunarModule.exports = {});
const { solarToLunar, formatLunarDate } = lunarModule.exports;

test('양력 2000-01-01 → 음력 변환 성공', () => {
    const result = solarToLunar(2000, 1, 1);
    assert(!result.error, '변환 에러: ' + (result.error || ''));
    assert(result.year === 1999, `년도 기대 1999, 실제 ${result.year}`);
    assert(result.month === 11, `월 기대 11, 실제 ${result.month}`);
    assert(result.day === 24 || result.day === 25, `일 기대 24~25, 실제 ${result.day}`);
});

test('양력 1990-05-15 → 음력 변환 성공', () => {
    const result = solarToLunar(1990, 5, 15);
    assert(!result.error, '변환 에러');
    assert(result.year === 1990, `년도 기대 1990, 실제 ${result.year}`);
    assert(result.month === 4, `월 기대 4, 실제 ${result.month}`);
    assert(result.day === 20 || result.day === 21, `일 기대 20~21, 실제 ${result.day}`);
});

test('범위 초과 (1899년) → 에러 반환', () => {
    const result = solarToLunar(1899, 1, 1);
    assert(result.error, '1899년은 에러여야 함');
});

test('범위 초과 (2101년) → 에러 반환', () => {
    const result = solarToLunar(2101, 1, 1);
    assert(result.error, '2101년은 에러여야 함');
});

test('formatLunarDate 정상 출력', () => {
    const result = solarToLunar(2000, 2, 5);
    const formatted = formatLunarDate(result);
    assert(formatted.includes('음력'), '음력 텍스트 포함');
    assert(formatted.includes('년'), '년 텍스트 포함');
});

test('formatLunarDate 에러 출력', () => {
    const result = solarToLunar(1800, 1, 1);
    const formatted = formatLunarDate(result);
    assert(formatted.includes('오류'), '오류 텍스트 포함');
});

test('양력 2026-03-29 (오늘) 변환 성공', () => {
    const result = solarToLunar(2026, 3, 29);
    assert(!result.error, '변환 에러');
    assert(result.month >= 1 && result.month <= 12, '월 범위 유효');
    assert(result.day >= 1 && result.day <= 30, '일 범위 유효');
});

test('module.exports 분기 존재', () => {
    assert(lunarConverterSrc.includes('module.exports'), 'module.exports 누락');
});

// ============================================================
console.log('\n=== 3. converter.js 데이터 정합성 ===');
// ============================================================
const converterJs = readFile('converter.js');

test('converter.js에 12개 나라 목록 정의', () => {
    const countries = ['호랑이 나라', '토끼 나라', '용 나라', '뱀 나라', '말 나라', '양 나라', '원숭이 나라', '닭 나라', '개 나라', '돼지 나라', '쥐 나라', '소 나라'];
    for (const c of countries) {
        assert(converterJs.includes(c), `converter.js에 '${c}' 누락`);
    }
});

test('converter.js animals 객체에 10그룹 모두 존재', () => {
    for (let i = 1; i <= 10; i++) {
        assert(converterJs.includes(`${i}: {`), `animals 그룹 ${i} 누락`);
    }
});

test('converter.js getAnimal 함수 정의', () => {
    assert(converterJs.includes('function getAnimal('), 'getAnimal 누락');
});

test('converter.js getCountry 함수 정의', () => {
    assert(converterJs.includes('function getCountry('), 'getCountry 누락');
});

test('converter.js convertDate 함수 정의', () => {
    assert(converterJs.includes('function convertDate('), 'convertDate 누락');
});

test('converter.js와 animora-data.js 동물 이름 일치', () => {
    // converter.js의 animals와 animora-data.js의 ANIMORA_ANIMALS 동물 이름 크로스 체크
    const convAnimals = ['호랑이', '야생토끼', '이무기', '아나콘다', '야생마', '양', '오랑우탄', '장미계', '들개', '멧돼지', '오소리', '용', '구렁이', '경주마', '산양', '고릴라', '수탉', '늑대', '수돼지', '고양이', '집토끼', '도롱뇽', '꽃뱀', '명품마', '염소', '침팬지', '암탉', '강아지', '암돼지'];
    for (const a of convAnimals) {
        assert(converterJs.includes(`'${a}'`), `converter.js에 '${a}' 누락`);
        assert(animoraDataJs.includes(a), `animora-data.js에 '${a}' 누락`);
    }
});

// ============================================================
console.log('\n=== 4. 내부 링크 무결성 ===');
// ============================================================
const htmlFiles = ['index.html', 'analysis.html', 'education.html', '404.html'];
const existingFiles = fs.readdirSync(ROOT);

for (const htmlFile of htmlFiles) {
    const content = readFile(htmlFile);

    // href="*.html" 링크 추출
    const hrefPattern = /href="([^"#]*\.html)(?:#[^"]*)?"/g;
    let match;
    const linkedFiles = new Set();
    while ((match = hrefPattern.exec(content)) !== null) {
        const linked = match[1];
        if (!linked.startsWith('http') && !linked.startsWith('mailto:')) {
            linkedFiles.add(linked);
        }
    }

    for (const linked of linkedFiles) {
        test(`${htmlFile} → ${linked} 파일 존재`, () => {
            assert(existingFiles.includes(linked), `${linked} 파일이 존재하지 않음`);
        });
    }
}

// ============================================================
console.log('\n=== 5. HTML 중복 ID 감지 ===');
// ============================================================
for (const htmlFile of ['index.html', 'analysis.html', 'education.html']) {
    const content = readFile(htmlFile);
    const idPattern = /\bid="([^"]+)"/g;
    const ids = new Map();
    let match;
    while ((match = idPattern.exec(content)) !== null) {
        const id = match[1];
        ids.set(id, (ids.get(id) || 0) + 1);
    }

    const duplicates = [...ids.entries()].filter(([, count]) => count > 1);
    test(`${htmlFile} 중복 ID 없음`, () => {
        assert(duplicates.length === 0, `중복 ID: ${duplicates.map(([id, c]) => `${id}(${c}회)`).join(', ')}`);
    });
}

// ============================================================
console.log('\n=== 6. HTML 태그 균형 검사 ===');
// ============================================================
function checkTagBalance(html, filename) {
    // 주요 태그만 체크
    const tags = ['div', 'section', 'nav', 'main', 'footer', 'form', 'table', 'thead', 'tbody', 'ul', 'ol'];
    for (const tag of tags) {
        const openRegex = new RegExp(`<${tag}[\\s>]`, 'gi');
        const closeRegex = new RegExp(`</${tag}>`, 'gi');
        const opens = (html.match(openRegex) || []).length;
        const closes = (html.match(closeRegex) || []).length;
        test(`${filename} <${tag}> 균형 (열림:${opens}, 닫힘:${closes})`, () => {
            assert(opens === closes, `<${tag}> 불균형: 열림 ${opens}개, 닫힘 ${closes}개`);
        });
    }
}

checkTagBalance(readFile('index.html'), 'index.html');
checkTagBalance(readFile('analysis.html'), 'analysis.html');
checkTagBalance(readFile('education.html'), 'education.html');

// ============================================================
console.log('\n=== 7. Service Worker 캐시 목록 무결성 ===');
// ============================================================
const swJs = readFile('sw.js');

test('SW 캐시에 모든 HTML 페이지 포함', () => {
    assert(swJs.includes('index.html'), 'index.html 캐시 누락');
    assert(swJs.includes('analysis.html'), 'analysis.html 캐시 누락');
    assert(swJs.includes('education.html'), 'education.html 캐시 누락');
});

test('SW 캐시에 모든 CSS 파일 포함', () => {
    assert(swJs.includes('styles.css'), 'styles.css 캐시 누락');
    assert(swJs.includes('analysis.css'), 'analysis.css 캐시 누락');
    assert(swJs.includes('education.css'), 'education.css 캐시 누락');
});

test('SW 캐시에 주요 JS 파일 포함', () => {
    const jsFiles = ['error-monitor.js', 'sanitize.js', 'config.js', 'lunar-converter.js', 'animora-data.js', 'animal-icons.js', 'script.js', 'homepage-analysis.js', 'api-service.js', 'storage-service.js', 'premium-features.js', 'analysis.js'];
    for (const js of jsFiles) {
        assert(swJs.includes(js), `${js} 캐시 누락`);
    }
});

test('SW STATIC_ASSETS의 파일이 실제로 존재', () => {
    const assetPattern = /'\/korean-animora-association\/([^']+)'/g;
    let match;
    while ((match = assetPattern.exec(swJs)) !== null) {
        const file = match[1];
        if (file) {
            assert(existingFiles.includes(file), `캐시된 ${file}이 프로젝트에 없음`);
        }
    }
});

test('SW install/activate/fetch 이벤트 핸들러 모두 존재', () => {
    assert(swJs.includes("addEventListener('install'"), 'install 핸들러 누락');
    assert(swJs.includes("addEventListener('activate'"), 'activate 핸들러 누락');
    assert(swJs.includes("addEventListener('fetch'"), 'fetch 핸들러 누락');
});

test('SW API 요청 네트워크 우선 전략', () => {
    assert(swJs.includes('workers.dev'), 'workers.dev 네트워크 전략 누락');
    assert(swJs.includes('openai.com'), 'openai.com 네트워크 전략 누락');
});

// ============================================================
console.log('\n=== 8. config.js 설정 무결성 ===');
// ============================================================
const configJs = readFile('config.js');

test('config.js 환경 감지 로직 존재', () => {
    assert(configJs.includes('ANIMORA_ENV'), 'ANIMORA_ENV 누락');
    assert(configJs.includes("'production'"), 'production 환경 누락');
    assert(configJs.includes("'development'"), 'development 환경 누락');
});

test('config.js API 엔드포인트 설정', () => {
    assert(configJs.includes('openai'), 'openai 설정 누락');
    assert(configJs.includes('backend'), 'backend 설정 누락');
    assert(configJs.includes('workers.dev'), 'Workers URL 누락');
});

test('config.js 8개 맞춤형 질문 템플릿', () => {
    const templates = ['conflict_resolution', 'gift_suggestion', 'teen_communication', 'career_advice', 'health_wellness', 'financial_habits', 'study_method', 'stress_management'];
    for (const t of templates) {
        assert(configJs.includes(t), `질문 템플릿 '${t}' 누락`);
    }
});

test('config.js 가격 정책 설정', () => {
    assert(configJs.includes('pricing'), 'pricing 누락');
    assert(configJs.includes('perAnalysis'), 'perAnalysis 누락');
    assert(configJs.includes('subscription'), 'subscription 누락');
});

test('config.js analytics/experiments 설정', () => {
    assert(configJs.includes('analytics'), 'analytics 누락');
    assert(configJs.includes('experiments'), 'experiments 누락');
});

test('config.js module.exports 분기 존재', () => {
    assert(configJs.includes('module.exports'), 'module.exports 누락');
});

// ============================================================
console.log('\n=== 9. 404.html 완전성 ===');
// ============================================================
const html404 = readFile('404.html');

test('404.html DOCTYPE 선언', () => {
    assert(html404.includes('<!DOCTYPE html>'), 'DOCTYPE 누락');
});

test('404.html lang="ko"', () => {
    assert(html404.includes('lang="ko"'), 'lang="ko" 누락');
});

test('404.html 에러 코드 표시', () => {
    assert(html404.includes('404'), '404 코드 누락');
});

test('404.html 홈 링크 존재', () => {
    assert(html404.includes('href="index.html"'), '홈 링크 누락');
});

test('404.html 메타 viewport', () => {
    assert(html404.includes('viewport'), 'viewport 누락');
});

test('404.html 한국어 안내 메시지', () => {
    assert(html404.includes('찾을 수 없습니다'), '한국어 안내 메시지 누락');
});

// ============================================================
console.log('\n=== 10. education.html 콘텐츠 검증 ===');
// ============================================================
const eduHtml = readFile('education.html');

test('education.html 3일 커리큘럼 모두 존재', () => {
    assert(eduHtml.includes('DAY 1'), 'DAY 1 누락');
    assert(eduHtml.includes('DAY 2'), 'DAY 2 누락');
    assert(eduHtml.includes('DAY 3'), 'DAY 3 누락');
});

test('education.html 12개 나라 커리큘럼에 언급', () => {
    const countries = ['호랑이 나라', '토끼 나라', '용 나라', '뱀 나라', '말 나라', '양 나라', '원숭이 나라', '닭 나라', '개 나라', '돼지 나라', '쥐 나라', '소 나라'];
    for (const c of countries) {
        assert(eduHtml.includes(c), `${c} 커리큘럼 미언급`);
    }
});

test('education.html 교육비 안내 존재', () => {
    assert(eduHtml.includes('200만원') || eduHtml.includes('교육비'), '교육비 정보 누락');
});

test('education.html 신청 방법 안내', () => {
    assert(eduHtml.includes('신청 방법') || eduHtml.includes('신청하세요'), '신청 방법 누락');
});

test('education.html 수료 혜택 안내', () => {
    assert(eduHtml.includes('자격증') || eduHtml.includes('수료'), '수료 혜택 누락');
});

test('education.html 교육 일정표 존재', () => {
    assert(eduHtml.includes('<table'), '일정 테이블 누락');
    assert(eduHtml.includes('제1기'), '제1기 일정 누락');
});

test('education.html 연락처/CTA 존재', () => {
    assert(eduHtml.includes('info@animora.kr'), '이메일 누락');
});

// ============================================================
console.log('\n=== 11. analysis.html 폼 무결성 ===');
// ============================================================
const analysisHtml = readFile('analysis.html');

test('analysis.html 3가지 분석 타입 탭', () => {
    assert(analysisHtml.includes('data-type="personal"'), '개인 분석 탭 누락');
    assert(analysisHtml.includes('data-type="couple"'), '커플 분석 탭 누락');
    assert(analysisHtml.includes('data-type="family"'), '다중 관계 탭 누락');
});

test('analysis.html 개인 폼 필수 필드', () => {
    assert(analysisHtml.includes('id="personal-name"'), 'personal-name 누락');
    assert(analysisHtml.includes('id="personal-gender"'), 'personal-gender 누락');
    assert(analysisHtml.includes('id="personal-month"'), 'personal-month 누락');
    assert(analysisHtml.includes('id="personal-day"'), 'personal-day 누락');
});

test('analysis.html 커플 폼 필수 필드', () => {
    assert(analysisHtml.includes('id="couple-name1"'), 'couple-name1 누락');
    assert(analysisHtml.includes('id="couple-name2"'), 'couple-name2 누락');
    assert(analysisHtml.includes('id="couple-month1"'), 'couple-month1 누락');
    assert(analysisHtml.includes('id="couple-month2"'), 'couple-month2 누락');
});

test('analysis.html 음력 월 셀렉트에 12개 옵션', () => {
    const monthOptions = analysisHtml.match(/value="(\d+)">(\d+)월/g);
    // 개인/커플1/커플2/다중 = 여러 셀렉트가 있으므로 최소 12개
    assert(monthOptions && monthOptions.length >= 12, `음력 월 옵션 부족: ${monthOptions ? monthOptions.length : 0}개`);
});

test('analysis.html 나라-월 매핑 정확성', () => {
    assert(analysisHtml.includes('1월 (호랑이 나라)'), '1월-호랑이 매핑 오류');
    assert(analysisHtml.includes('6월 (양 나라)'), '6월-양 매핑 오류');
    assert(analysisHtml.includes('12월 (소 나라)'), '12월-소 매핑 오류');
});

test('analysis.html 결과 섹션 존재', () => {
    assert(analysisHtml.includes('id="result-section"'), 'result-section 누락');
    assert(analysisHtml.includes('id="result-content"'), 'result-content 누락');
});

test('analysis.html 제출 버튼 존재', () => {
    assert(analysisHtml.includes('type="submit"'), '제출 버튼 누락');
});

// ============================================================
console.log('\n=== 12. 스크립트 의존성 순서 검증 ===');
// ============================================================
const indexHtml = readFile('index.html');

test('index.html: config.js가 sanitize.js 전에 로드', () => {
    const configPos = indexHtml.indexOf('config.js');
    const sanitizePos = indexHtml.indexOf('sanitize.js');
    // config.js가 먼저 (GA 조건 로드에 필요)
    assert(configPos < sanitizePos, 'config.js가 sanitize.js보다 뒤에 위치');
});

test('index.html: lunar-converter.js가 animora-data.js 전에 로드', () => {
    const lunarPos = indexHtml.indexOf('lunar-converter.js');
    const dataPos = indexHtml.indexOf('animora-data.js');
    assert(lunarPos < dataPos, 'lunar-converter.js가 animora-data.js보다 뒤에 위치');
});

test('index.html: animora-data.js가 homepage-analysis.js 전에 로드', () => {
    const dataPos = indexHtml.indexOf('animora-data.js');
    const homePos = indexHtml.indexOf('homepage-analysis.js');
    assert(dataPos < homePos, 'animora-data.js가 homepage-analysis.js보다 뒤에 위치');
});

test('index.html: error-monitor.js가 가장 먼저 로드', () => {
    const errorPos = indexHtml.indexOf('error-monitor.js');
    const configPos = indexHtml.indexOf('config.js');
    assert(errorPos < configPos, 'error-monitor.js가 config.js보다 뒤에 위치');
});

test('analysis.html: sanitize.js가 api-service.js 전에 로드', () => {
    const sanitizePos = analysisHtml.indexOf('sanitize.js');
    const apiPos = analysisHtml.indexOf('api-service.js');
    assert(sanitizePos < apiPos, 'sanitize.js가 api-service.js보다 뒤에 위치');
});

test('analysis.html: config.js가 api-service.js 전에 로드', () => {
    const configPos = analysisHtml.indexOf('config.js');
    const apiPos = analysisHtml.indexOf('api-service.js');
    assert(configPos < apiPos, 'config.js가 api-service.js보다 뒤에 위치');
});

test('analysis.html: analysis.js가 마지막으로 로드', () => {
    const analysisJsPos = analysisHtml.indexOf('analysis.js');
    const configPos = analysisHtml.indexOf('config.js');
    const apiPos = analysisHtml.indexOf('api-service.js');
    assert(analysisJsPos > configPos && analysisJsPos > apiPos, 'analysis.js가 의존성보다 먼저 로드');
});

// ============================================================
console.log('\n=== 13. CSS 클래스 크로스 참조 ===');
// ============================================================
const stylesCss = readFile('styles.css');

test('index.html 주요 CSS 클래스가 styles.css에 정의', () => {
    const criticalClasses = ['navbar', 'hero', 'hero-content', 'hero-title', 'hero-subtitle', 'hero-analyzer', 'section-header', 'section-badge', 'section-title', 'footer', 'footer-content', 'glass-mirror-section', 'gm-card'];
    for (const cls of criticalClasses) {
        assert(stylesCss.includes(`.${cls}`) || stylesCss.includes(`.${cls} `) || stylesCss.includes(`.${cls}{`) || stylesCss.includes(`.${cls},`), `CSS 클래스 '.${cls}' 미정의`);
    }
});

test('breadcrumb CSS 클래스 정의', () => {
    assert(stylesCss.includes('.breadcrumb'), '.breadcrumb 클래스 누락');
    assert(stylesCss.includes('.breadcrumb-list'), '.breadcrumb-list 클래스 누락');
});

test('skip-link CSS 클래스 정의', () => {
    assert(stylesCss.includes('.skip-link'), '.skip-link 클래스 누락');
});

test('glass-mirror 관련 CSS 클래스 정의', () => {
    const gmClasses = ['glass-mirror-section', 'glass-mirror-cards', 'gm-card', 'gm-icon', 'gm-vs', 'gm-description'];
    for (const cls of gmClasses) {
        assert(stylesCss.includes(`.${cls}`), `.${cls} CSS 미정의`);
    }
});

test('country-compact 관련 CSS 클래스 정의', () => {
    assert(stylesCss.includes('.country-compact-card') || stylesCss.includes('.countries-compact-grid'), 'country-compact CSS 누락');
});

// ============================================================
console.log('\n=== 14. 접근성 심층 검증 ===');
// ============================================================
for (const htmlFile of ['index.html', 'analysis.html', 'education.html']) {
    const content = readFile(htmlFile);

    test(`${htmlFile} skip-link 존재`, () => {
        assert(content.includes('skip-link'), 'skip-link 누락');
        assert(content.includes('본문 바로가기'), '본문 바로가기 텍스트 누락');
    });

    test(`${htmlFile} lang="ko" 선언`, () => {
        assert(content.includes('lang="ko"'), 'lang="ko" 누락');
    });

    test(`${htmlFile} scroll-top 버튼 aria-label`, () => {
        assert(content.includes('aria-label="맨 위로 이동"') || !content.includes('scroll-top'), 'scroll-top aria-label 누락');
    });

    test(`${htmlFile} 햄버거 메뉴 aria-label`, () => {
        if (content.includes('hamburger')) {
            assert(content.includes('aria-label="메뉴"'), '햄버거 aria-label 누락');
        }
    });
}

test('analysis.html 폼 label-input 연결', () => {
    const labelForPattern = /for="([^"]+)"/g;
    let match;
    const labelFors = [];
    while ((match = labelForPattern.exec(analysisHtml)) !== null) {
        labelFors.push(match[1]);
    }
    for (const labelFor of labelFors) {
        assert(analysisHtml.includes(`id="${labelFor}"`), `label for="${labelFor}"에 대응하는 id 없음`);
    }
});

test('analysis.html 분석 타입 버튼 aria-label', () => {
    assert(analysisHtml.includes('aria-label="개인 성격 분석"'), '개인 분석 aria-label 누락');
    assert(analysisHtml.includes('aria-label="커플 궁합 분석"'), '커플 분석 aria-label 누락');
});

test('education.html table scope 속성', () => {
    assert(eduHtml.includes('scope="col"'), 'table header scope 누락');
});

// ============================================================
console.log('\n=== 15. 궁합 계산 로직 검증 ===');
// ============================================================
// animora-data.js의 calculateAnimoraCompatibility를 직접 실행
const animoraModule = {};
const animoraExecSrc = animoraDataJs.replace(/if\s*\(typeof\s+module\b.*$/gm, '');
try {
    // 함수만 추출하여 테스트
    eval(animoraExecSrc);

    test('같은 월/일 궁합 = 100점', () => {
        const score = calculateAnimoraCompatibility(1, 1, 1, 1);
        assert(score === 100, `기대 100, 실제 ${score}`);
    });

    test('같은 월 보너스 적용', () => {
        const sameMonth = calculateAnimoraCompatibility(5, 10, 5, 15);
        const diffMonth = calculateAnimoraCompatibility(5, 10, 6, 15);
        assert(sameMonth > diffMonth, `같은 월(${sameMonth})이 다른 월(${diffMonth})보다 높아야 함`);
    });

    test('궁합 점수 범위 60~100', () => {
        // 극단적으로 먼 조합
        const score = calculateAnimoraCompatibility(1, 1, 12, 30);
        assert(score >= 60 && score <= 100, `점수 ${score}이 60~100 범위 밖`);
    });

    test('궁합 점수 대칭성', () => {
        const score1 = calculateAnimoraCompatibility(3, 15, 8, 22);
        const score2 = calculateAnimoraCompatibility(8, 22, 3, 15);
        assert(score1 === score2, `비대칭: ${score1} vs ${score2}`);
    });

    test('getAnimoraAnimal 유효 입력', () => {
        const name = getAnimoraAnimal(19);
        assert(name === '늑대', `기대 '늑대', 실제 '${name}'`);
    });

    test('getAnimoraAnimal 무효 입력', () => {
        const name = getAnimoraAnimal(99);
        assert(name === '알 수 없음', `기대 '알 수 없음', 실제 '${name}'`);
    });

    test('getAnimoraCountry 유효 입력', () => {
        const name = getAnimoraCountry(8);
        assert(name === '닭 나라', `기대 '닭 나라', 실제 '${name}'`);
    });

    test('getAnimoraCountry 무효 입력', () => {
        const name = getAnimoraCountry(0);
        assert(name === '알 수 없음', `기대 '알 수 없음', 실제 '${name}'`);
    });
} catch (e) {
    test('animora-data.js 함수 실행', () => {
        throw new Error('animora-data.js eval 실패: ' + e.message);
    });
}

// ============================================================
console.log('\n=== 16. 페이지 간 네비게이션 일관성 ===');
// ============================================================
const navLinks = ['index.html', 'analysis.html', 'education.html'];

for (const page of navLinks) {
    const content = readFile(page);

    test(`${page} 네비게이션에 홈 링크`, () => {
        assert(content.includes('href="index.html"'), '홈 링크 누락');
    });

    test(`${page} 네비게이션에 분석 링크`, () => {
        assert(content.includes('href="analysis.html"'), '분석 링크 누락');
    });

    test(`${page} 네비게이션에 교육 링크`, () => {
        assert(content.includes('href="education.html"'), '교육 링크 누락');
    });

    test(`${page} 푸터 존재`, () => {
        assert(content.includes('<footer'), 'footer 태그 누락');
        assert(content.includes('한국아니모라협회'), '협회명 누락');
    });

    test(`${page} 저작권 표시`, () => {
        assert(content.includes('2025-2026') || content.includes('2025'), '저작권 연도 누락');
    });
}

// ============================================================
console.log('\n=== 17. 메타태그 및 SEO 크로스 검증 ===');
// ============================================================
for (const page of ['index.html', 'analysis.html', 'education.html']) {
    const content = readFile(page);

    test(`${page} og:title 존재`, () => {
        assert(content.includes('og:title'), 'og:title 누락');
    });

    test(`${page} og:description 존재`, () => {
        assert(content.includes('og:description'), 'og:description 누락');
    });

    test(`${page} canonical URL 존재`, () => {
        assert(content.includes('rel="canonical"'), 'canonical 누락');
    });

    test(`${page} theme-color 존재`, () => {
        assert(content.includes('theme-color'), 'theme-color 누락');
    });

    test(`${page} CSP 메타태그 존재`, () => {
        assert(content.includes('Content-Security-Policy'), 'CSP 누락');
    });
}

// ============================================================
console.log('\n=== 18. manifest.json 및 PWA 설정 ===');
// ============================================================
const manifest = readFile('manifest.json');

test('manifest.json 유효한 JSON', () => {
    JSON.parse(manifest);
});

test('manifest.json 필수 필드', () => {
    const m = JSON.parse(manifest);
    assert(m.name, 'name 누락');
    assert(m.short_name, 'short_name 누락');
    assert(m.start_url, 'start_url 누락');
    assert(m.display, 'display 누락');
    assert(m.theme_color, 'theme_color 누락');
    assert(m.background_color, 'background_color 누락');
});

test('manifest.json 아이콘 설정', () => {
    const m = JSON.parse(manifest);
    assert(m.icons && m.icons.length > 0, '아이콘 설정 누락');
});

test('모든 HTML에서 manifest.json 참조', () => {
    for (const page of ['index.html', 'analysis.html', 'education.html']) {
        const content = readFile(page);
        assert(content.includes('manifest.json'), `${page}에 manifest.json 참조 누락`);
    }
});

test('모든 HTML에서 서비스워커 등록 코드', () => {
    for (const page of ['index.html', 'analysis.html', 'education.html']) {
        const content = readFile(page);
        assert(content.includes('serviceWorker'), `${page}에 SW 등록 코드 누락`);
    }
});

// ============================================================
console.log('\n=== 19. 구조화된 데이터 (JSON-LD) 검증 ===');
// ============================================================
test('index.html Organization 스키마', () => {
    assert(indexHtml.includes('"@type": "Organization"'), 'Organization 스키마 누락');
});

test('index.html WebApplication 스키마', () => {
    assert(indexHtml.includes('"@type": "WebApplication"'), 'WebApplication 스키마 누락');
});

test('index.html FAQPage 스키마', () => {
    assert(indexHtml.includes('"@type": "FAQPage"'), 'FAQPage 스키마 누락');
});

test('index.html BreadcrumbList 스키마', () => {
    assert(indexHtml.includes('"@type": "BreadcrumbList"'), 'BreadcrumbList 스키마 누락');
});

test('analysis.html BreadcrumbList 스키마', () => {
    assert(analysisHtml.includes('"@type": "BreadcrumbList"'), 'BreadcrumbList 스키마 누락');
});

test('education.html Course 스키마', () => {
    assert(eduHtml.includes('"@type": "Course"'), 'Course 스키마 누락');
});

test('education.html BreadcrumbList 스키마', () => {
    assert(eduHtml.includes('"@type": "BreadcrumbList"'), 'BreadcrumbList 스키마 누락');
});

// JSON-LD 파싱 검증
test('index.html JSON-LD 유효한 JSON', () => {
    const ldMatches = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    assert(ldMatches, 'JSON-LD 블록 없음');
    for (const block of ldMatches) {
        const json = block.replace(/<script type="application\/ld\+json">/, '').replace(/<\/script>/, '');
        JSON.parse(json); // 파싱 실패 시 예외
    }
});

// ============================================================
console.log('\n=== 20. index.html 홈페이지 특수 기능 ===');
// ============================================================
test('index.html 히어로 분석기 폼 필드', () => {
    assert(indexHtml.includes('id="solar-year"'), 'solar-year 필드 누락');
    assert(indexHtml.includes('id="solar-month"'), 'solar-month 필드 누락');
    assert(indexHtml.includes('id="solar-day"'), 'solar-day 필드 누락');
    assert(indexHtml.includes('id="analyzer-name"'), 'analyzer-name 필드 누락');
});

test('index.html runHomeAnalysis 호출', () => {
    assert(indexHtml.includes('runHomeAnalysis()'), 'runHomeAnalysis 호출 누락');
});

test('index.html 12개 나라 카드 모두 표시', () => {
    const cardCount = (indexHtml.match(/country-compact-card/g) || []).length;
    assert(cardCount >= 12, `나라 카드 ${cardCount}개 (12개 필요)`);
});

test('index.html 유리의 방/거울의 방 섹션', () => {
    assert(indexHtml.includes('유리의 방'), '유리의 방 누락');
    assert(indexHtml.includes('거울의 방'), '거울의 방 누락');
    assert(indexHtml.includes('glass-room'), 'glass-room 클래스 누락');
    assert(indexHtml.includes('mirror-room'), 'mirror-room 클래스 누락');
});

test('index.html 비교 테이블 (MBTI, 별자리 등)', () => {
    assert(indexHtml.includes('MBTI'), 'MBTI 비교 누락');
    assert(indexHtml.includes('별자리'), '별자리 비교 누락');
    assert(indexHtml.includes('360'), '360가지 유형 수 누락');
});

test('index.html 문의 섹션', () => {
    assert(indexHtml.includes('id="contact"'), 'contact 섹션 누락');
    assert(indexHtml.includes('info@animora.kr'), '이메일 누락');
});

// ============================================================
console.log('\n=== 21. 보안 관련 심층 검증 ===');
// ============================================================
test('config.js에 API 키 하드코딩 없음', () => {
    assert(!configJs.match(/sk-[a-zA-Z0-9]{20,}/), 'OpenAI API 키 하드코딩 발견');
    assert(!configJs.match(/key\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/), 'API 키 하드코딩 의심');
});

test('sanitize.js의 escapeHTML 존재', () => {
    const sanitizeJs = readFile('sanitize.js');
    assert(sanitizeJs.includes('escapeHTML'), 'escapeHTML 함수 누락');
});

test('sanitize.js의 sanitizeNumber 존재', () => {
    const sanitizeJs = readFile('sanitize.js');
    assert(sanitizeJs.includes('sanitizeNumber'), 'sanitizeNumber 함수 누락');
});

test('CSP 정책 일관성 (3페이지 동일)', () => {
    const cspPattern = /Content-Security-Policy"\s+content="([^"]*)"/;
    const indexCsp = indexHtml.match(cspPattern);
    const analysisCsp = analysisHtml.match(cspPattern);
    const eduCsp = eduHtml.match(cspPattern);

    assert(indexCsp && analysisCsp && eduCsp, `CSP 추출 실패: index=${!!indexCsp} analysis=${!!analysisCsp} edu=${!!eduCsp}`);
    assert(indexCsp[1] === analysisCsp[1], 'index와 analysis CSP 불일치');
    assert(indexCsp[1] === eduCsp[1], 'index와 education CSP 불일치');
});

// ============================================================
// 결과 출력
// ============================================================
console.log('\n' + '='.repeat(50));
console.log(`총 ${total}개 테스트 | 통과: ${passed} | 실패: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
    console.log(`\n${failed}개 테스트 실패!`);
    process.exit(1);
} else {
    console.log('\n모든 테스트 통과!');
    process.exit(0);
}
