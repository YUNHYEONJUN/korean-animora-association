/**
 * 한국아니모라협회 웹사이트 종합 검증 테스트
 */
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
let pass = 0, fail = 0, total = 0;

function test(name, fn) {
    total++;
    try {
        fn();
        pass++;
        console.log(`  ✅ ${name}`);
    } catch (e) {
        fail++;
        console.log(`  ❌ ${name}`);
        console.log(`     → ${e.message}`);
    }
}

function assert(cond, msg) {
    if (!cond) throw new Error(msg || 'Assertion failed');
}

function readFile(name) {
    return fs.readFileSync(path.join(BASE, name), 'utf-8');
}

// ========== 파일 존재 확인 ==========
console.log('\n📁 파일 존재 확인');
const requiredFiles = [
    'index.html', 'analysis.html', 'education.html', '404.html',
    'styles.css', 'analysis.css', 'education.css',
    'script.js', 'analysis.js', 'api-service.js', 'config.js',
    'lunar-converter.js', 'storage-service.js', 'premium-features.js',
    'robots.txt', 'sitemap.xml'
];
requiredFiles.forEach(f => {
    test(`${f} 존재`, () => assert(fs.existsSync(path.join(BASE, f)), `${f} 없음`));
});

// ========== HTML 페이지별 공통 검증 ==========
const pages = ['index.html', 'analysis.html', 'education.html'];

console.log('\n🔗 네비게이션 일관성');
pages.forEach(page => {
    const html = readFile(page);
    test(`${page}: 네비게이션 8개 메뉴`, () => {
        const navSection = html.match(/<ul class="nav-menu">([\s\S]*?)<\/ul>/);
        assert(navSection, 'nav-menu 영역 없음');
        const navItems = navSection[1].match(/<li>/g);
        assert(navItems && navItems.length === 8, `메뉴 ${navItems ? navItems.length : 0}개 (8개 필요)`);
    });
    test(`${page}: 홈 링크 존재`, () => {
        assert(html.includes('href="index.html">홈</a>'), '홈 링크 없음');
    });
    test(`${page}: hamburger 메뉴 존재`, () => {
        assert(html.includes('class="hamburger"'), 'hamburger 없음');
    });
});

console.log('\n♿ 접근성');
pages.forEach(page => {
    const html = readFile(page);
    test(`${page}: skip-link 존재`, () => {
        assert(html.includes('class="skip-link"'), 'skip-link 없음');
    });
    test(`${page}: hamburger aria-label`, () => {
        assert(html.includes('aria-label="메뉴"'), 'hamburger aria-label 없음');
    });
    test(`${page}: main-content id 존재`, () => {
        assert(html.includes('id="main-content"'), 'main-content id 없음');
    });
});

test('analysis.html: 타입 버튼 aria-label', () => {
    const html = readFile('analysis.html');
    assert(html.includes('aria-label="개인 성격 분석"'), '개인 분석 aria-label 없음');
    assert(html.includes('aria-label="커플 궁합 분석"'), '커플 분석 aria-label 없음');
    assert(html.includes('aria-hidden="true"'), 'aria-hidden 없음');
});

console.log('\n🔍 SEO');
pages.forEach(page => {
    const html = readFile(page);
    test(`${page}: meta description`, () => {
        assert(html.includes('<meta name="description"'), 'meta description 없음');
    });
    test(`${page}: og:title`, () => {
        assert(html.includes('og:title'), 'og:title 없음');
    });
    test(`${page}: og:image`, () => {
        assert(html.includes('og:image'), 'og:image 없음');
    });
    test(`${page}: canonical 태그`, () => {
        assert(html.includes('rel="canonical"'), 'canonical 없음');
    });
});

test('index.html: JSON-LD 구조화 데이터', () => {
    const html = readFile('index.html');
    assert(html.includes('application/ld+json'), 'JSON-LD 없음');
    assert(html.includes('"@type": "Organization"'), 'Organization 스키마 없음');
});

test('robots.txt: sitemap 참조', () => {
    const txt = readFile('robots.txt');
    assert(txt.includes('Sitemap:'), 'Sitemap 참조 없음');
});

test('sitemap.xml: 3개 페이지 포함', () => {
    const xml = readFile('sitemap.xml');
    assert(xml.includes('index.html') || xml.includes('korean-animora-association/'), 'index 페이지 없음');
    assert(xml.includes('analysis.html'), 'analysis 페이지 없음');
    assert(xml.includes('education.html'), 'education 페이지 없음');
});

console.log('\n🎨 CSS 검증');
const css = readFile('styles.css');

test('--gradient-primary 올바른 정의 (순환참조 없음)', () => {
    assert(css.includes('--gradient-primary: linear-gradient('), '순환참조 또는 잘못된 정의');
    assert(!css.includes('--gradient-primary: var(--gradient-primary)'), '순환참조 발견');
});

test('skip-link 스타일 존재', () => {
    assert(css.includes('.skip-link'), 'skip-link CSS 없음');
});

test('menu-backdrop 스타일 존재', () => {
    assert(css.includes('.menu-backdrop'), 'menu-backdrop CSS 없음');
});

test('scroll-top-btn 스타일 존재', () => {
    assert(css.includes('.scroll-top-btn'), 'scroll-top-btn CSS 없음');
});

test('!important 미사용 (footer 링크)', () => {
    const footerSection = css.substring(css.indexOf('.footer-column a'));
    const footerEnd = footerSection.substring(0, footerSection.indexOf('\n\n/* '));
    assert(!footerEnd.includes('!important'), 'footer 링크에 !important 발견');
});

test('.photo-placeholder 제거됨', () => {
    assert(!css.includes('.photo-placeholder'), '.photo-placeholder 미삭제');
});

test('hero fallback background-color 존재', () => {
    assert(css.includes('background-color: #2c3e89'), 'hero fallback 색상 없음');
});

test('중복 @media 768px 병합 확인', () => {
    const matches = css.match(/@media \(max-width: 768px\)/g);
    // 하나는 메인, 하나는 table scroll hint = 2개만 있어야 함
    assert(matches && matches.length <= 2, `@media 768px ${matches ? matches.length : 0}개 (2개 이하 필요)`);
});

const analysisCss = readFile('analysis.css');
test('analysis.css: hero fallback 색상', () => {
    assert(analysisCss.includes('background-color: #1a2a5e'), 'analysis hero fallback 없음');
});

console.log('\n📜 JavaScript 검증');
const scriptJs = readFile('script.js');

test('script.js: menu-backdrop 생성', () => {
    assert(scriptJs.includes('menu-backdrop'), 'backdrop 코드 없음');
});

test('script.js: closeMenu 함수', () => {
    assert(scriptJs.includes('function closeMenu'), 'closeMenu 함수 없음');
});

test('script.js: backdrop 클릭 이벤트', () => {
    assert(scriptJs.includes("menuBackdrop.addEventListener('click'"), 'backdrop 클릭 핸들러 없음');
});

const apiJs = readFile('api-service.js');
test('api-service.js: alert() 제거됨', () => {
    assert(!apiJs.includes('alert('), 'alert() 아직 존재');
});

test('api-service.js: AbortController timeout', () => {
    assert(apiJs.includes('AbortController'), 'AbortController 없음');
    assert(apiJs.includes('setTimeout'), 'timeout 설정 없음');
});

const analysisJs = readFile('analysis.js');
test('analysis.js: requestAIAnalysis alert 제거', () => {
    const funcStart = analysisJs.indexOf('async function requestAIAnalysis');
    const funcEnd = analysisJs.indexOf('async function', funcStart + 1);
    const func = analysisJs.substring(funcStart, funcEnd > -1 ? funcEnd : funcStart + 2000);
    assert(!func.includes('alert('), 'requestAIAnalysis에 alert 아직 존재');
});

test('analysis.js: 인라인 에러 메시지', () => {
    assert(analysisJs.includes('AI 분석을 불러오지 못했습니다'), '인라인 에러 메시지 없음');
});

console.log('\n📅 교육과정 날짜');
const eduHtml = readFile('education.html');
test('교육과정: 2026년 날짜', () => {
    assert(eduHtml.includes('2026.05'), '2026년 5월 일정 없음');
    assert(eduHtml.includes('2026.06'), '2026년 6월 일정 없음');
    assert(eduHtml.includes('2026.07'), '2026년 7월 일정 없음');
    assert(eduHtml.includes('2026.08'), '2026년 8월 일정 없음');
});

test('교육과정: 2025년 과거 날짜 제거', () => {
    assert(!eduHtml.includes('2025.02.14'), '과거 날짜 남아있음');
    assert(!eduHtml.includes('2025.03.14'), '과거 날짜 남아있음');
});

console.log('\n🏗️ 구조 일관성');
pages.forEach(page => {
    const html = readFile(page);
    test(`${page}: scroll-top 버튼`, () => {
        assert(html.includes('id="scroll-top"'), 'scroll-top 버튼 없음');
    });
    test(`${page}: favicon A 로고`, () => {
        assert(html.includes("font-family='serif'>A</text>"), 'A 로고 favicon 없음');
    });
});

test('index.html: preconnect 힌트', () => {
    const html = readFile('index.html');
    assert(html.includes('rel="preconnect" href="https://fonts.googleapis.com"'), 'preconnect 없음');
    assert(html.includes('rel="preconnect" href="https://fonts.gstatic.com"'), 'gstatic preconnect 없음');
});

console.log('\n🔧 폰트 통일');
pages.forEach(page => {
    const html = readFile(page);
    test(`${page}: font-weight 600 포함`, () => {
        assert(html.includes('wght@400;500;600;700;900'), '600 weight 누락');
    });
});

console.log('\n📄 404 페이지');
const page404 = readFile('404.html');
test('404.html: 에러 코드 표시', () => {
    assert(page404.includes('404'), '404 텍스트 없음');
});
test('404.html: 홈 링크', () => {
    assert(page404.includes('href="index.html"'), '홈 링크 없음');
});

// ========== 결과 출력 ==========
console.log('\n' + '='.repeat(50));
console.log(`📊 테스트 결과: ${pass}/${total} 통과, ${fail} 실패`);
if (fail === 0) {
    console.log('🎉 모든 테스트 통과!');
} else {
    console.log('⚠️ 실패한 테스트가 있습니다.');
}
console.log('='.repeat(50));

process.exit(fail > 0 ? 1 : 0);
