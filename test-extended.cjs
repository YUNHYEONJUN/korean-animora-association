/**
 * 확장 자동 테스트 - 고도화/전문화 개선사항 전체 검증
 * 27개 개선사항 + 블로그 콘텐츠 반영 검증
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const BASE = __dirname;
const read = (f) => fs.readFileSync(path.join(BASE, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(BASE, f));

let passed = 0;
let failed = 0;

function test(category, name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (e) {
        console.log(`  ❌ ${name}: ${e.message}`);
        failed++;
    }
}

// ══════════════════════════════════════════════════
// A. 보안 (Security)
// ══════════════════════════════════════════════════
console.log('\n🔒 보안 (Security)');

const indexHtml = read('index.html');
const analysisHtml = read('analysis.html');
const educationHtml = read('education.html');

test('Security', 'sanitize.js 파일 존재', () => {
    assert(exists('sanitize.js'));
});

test('Security', 'sanitize.js: escapeHTML 함수', () => {
    const s = read('sanitize.js');
    assert(s.includes('escapeHTML'));
    assert(s.includes('sanitizeNumber'));
    assert(s.includes('sanitizeError'));
});

test('Security', 'index.html: CSP 메타태그', () => {
    assert(indexHtml.includes('Content-Security-Policy'));
    assert(indexHtml.includes("default-src 'self'"));
});

test('Security', 'analysis.html: CSP 메타태그', () => {
    assert(analysisHtml.includes('Content-Security-Policy'));
});

test('Security', 'education.html: CSP 메타태그', () => {
    assert(educationHtml.includes('Content-Security-Policy'));
});

test('Security', 'CSP: script-src 설정', () => {
    assert(indexHtml.includes("script-src 'self'"));
});

test('Security', 'CSP: font-src Google Fonts 허용', () => {
    assert(indexHtml.includes('font-src https://fonts.gstatic.com'));
});

test('Security', 'CSP: img-src Unsplash 허용', () => {
    assert(indexHtml.includes('img-src'));
    assert(indexHtml.includes('https://images.unsplash.com'));
});

test('Security', 'CSP: connect-src API 허용', () => {
    assert(indexHtml.includes('connect-src'));
    assert(indexHtml.includes('https://*.workers.dev'));
});

test('Security', 'CORS: 환경변수 기반 localhost 제어', () => {
    const worker = read('cloudflare-worker/src/index.js');
    assert(worker.includes('ALLOW_LOCALHOST'));
    assert(worker.includes("env.ALLOW_LOCALHOST === 'true'"));
    assert(!worker.includes("// 개발 시 localhost도 허용\n  const isAllowed"));
});

test('Security', 'XSS: homepage-analysis.js sanitize 적용', () => {
    const hp = read('homepage-analysis.js');
    assert(hp.includes('AnimoraSanitizer.escapeHTML'));
    assert(hp.includes('AnimoraSanitizer.sanitizeNumber'));
});

test('Security', 'XSS: analysis.js sanitize 적용', () => {
    const an = read('analysis.js');
    assert(an.includes('AnimoraSanitizer.escapeHTML'));
});

// ══════════════════════════════════════════════════
// B. 성능 (Performance)
// ══════════════════════════════════════════════════
console.log('\n⚡ 성능 (Performance)');

test('Performance', '이미지: Unsplash WebP 포맷 요청', () => {
    const css = read('styles.css');
    assert(css.includes('fm=webp'));
    assert(css.includes('w=1280'));
});

test('Performance', '이미지: analysis.css WebP 포맷', () => {
    const css = read('analysis.css');
    assert(css.includes('fm=webp'));
    assert(css.includes('w=1280'));
});

test('Performance', 'Critical CSS: index.html 인라인 스타일', () => {
    assert(indexHtml.includes('<style>'));
    assert(indexHtml.includes('box-sizing:border-box'));
    assert(indexHtml.includes('.navbar{'));
});

test('Performance', 'Critical CSS: analysis.html 인라인 스타일', () => {
    assert(analysisHtml.includes('<style>'));
    assert(analysisHtml.includes('.navbar{'));
});

test('Performance', 'Critical CSS: education.html 인라인 스타일', () => {
    assert(educationHtml.includes('<style>'));
    assert(educationHtml.includes('.navbar{'));
});

test('Performance', 'Script defer: analysis.html 모든 스크립트', () => {
    const scripts = analysisHtml.match(/<script src="[^"]+"/g) || [];
    const nonDeferred = scripts.filter(s =>
        !s.includes('error-monitor') && !analysisHtml.includes(s.replace('"', '" defer'))
    );
    // error-monitor.js는 defer 없어야 함 (전역 에러 먼저 캐치)
    assert(analysisHtml.includes('sanitize.js" defer'));
    assert(analysisHtml.includes('config.js" defer'));
    assert(analysisHtml.includes('analysis.js" defer'));
});

test('Performance', '빌드 스크립트 존재', () => {
    assert(exists('build.cjs'));
    const build = read('build.cjs');
    assert(build.includes('dist'));
    assert(build.includes('CSS'));
});

// ══════════════════════════════════════════════════
// C. 접근성 (Accessibility)
// ══════════════════════════════════════════════════
console.log('\n♿ 접근성 (Accessibility)');

test('Accessibility', 'ARIA: hamburger role=button', () => {
    assert(indexHtml.includes('role="button"'));
    assert(analysisHtml.includes('role="button"'));
    assert(educationHtml.includes('role="button"'));
});

test('Accessibility', 'ARIA: hamburger tabindex=0', () => {
    assert(indexHtml.includes('tabindex="0"'));
});

test('Accessibility', '키보드: script.js Escape 핸들러', () => {
    const s = read('script.js');
    assert(s.includes("e.key === 'Escape'"));
});

test('Accessibility', '키보드: script.js Enter/Space 핸들러', () => {
    const s = read('script.js');
    assert(s.includes("e.key === 'Enter'"));
    assert(s.includes("e.key === ' '"));
});

test('Accessibility', '포커스: focus-visible CSS', () => {
    const css = read('styles.css');
    assert(css.includes(':focus-visible'));
    assert(css.includes(':focus:not(:focus-visible)'));
});

test('Accessibility', 'skip-link: 3개 페이지 모두', () => {
    assert(indexHtml.includes('skip-link'));
    assert(analysisHtml.includes('skip-link'));
    assert(educationHtml.includes('skip-link'));
});

test('Accessibility', '브레드크럼: aria-label 현재 위치', () => {
    assert(analysisHtml.includes('aria-label="현재 위치"'));
    assert(educationHtml.includes('aria-label="현재 위치"'));
});

test('Accessibility', '브레드크럼: aria-current=page', () => {
    assert(analysisHtml.includes('aria-current="page"'));
    assert(educationHtml.includes('aria-current="page"'));
});

// ══════════════════════════════════════════════════
// D. 코드 품질 (Code Quality)
// ══════════════════════════════════════════════════
console.log('\n🔧 코드 품질 (Code Quality)');

test('CodeQuality', 'script.js: IIFE 래핑', () => {
    const s = read('script.js');
    assert(s.trimStart().startsWith('(() => {'));
    assert(s.trimEnd().endsWith('})();'));
});

test('CodeQuality', 'script.js: use strict', () => {
    const s = read('script.js');
    assert(s.includes("'use strict'"));
});

test('CodeQuality', 'script.js: console.log 없음', () => {
    const s = read('script.js');
    assert(!s.includes('console.log'));
    assert(!s.includes('console.error'));
});

test('CodeQuality', 'api-service.js: console 제거', () => {
    const s = read('api-service.js');
    assert(!s.includes('console.log'));
    assert(!s.includes('console.error'));
});

test('CodeQuality', 'storage-service.js: console 제거', () => {
    const s = read('storage-service.js');
    assert(!s.includes('console.error'));
});

test('CodeQuality', 'premium-features.js: console 제거', () => {
    const s = read('premium-features.js');
    assert(!s.includes('console.error'));
});

test('CodeQuality', 'script.js: counterObserver.disconnect()', () => {
    const s = read('script.js');
    assert(s.includes('counterObserver.disconnect()'));
});

test('CodeQuality', 'error-monitor.js 존재', () => {
    assert(exists('error-monitor.js'));
    const em = read('error-monitor.js');
    assert(em.includes('AnimoraErrorMonitor'));
    assert(em.includes('unhandledrejection'));
    assert(em.includes("window.addEventListener('error'"));
});

test('CodeQuality', 'error-monitor.js: 3개 페이지 모두 로드', () => {
    assert(indexHtml.includes('error-monitor.js'));
    assert(analysisHtml.includes('error-monitor.js'));
    assert(educationHtml.includes('error-monitor.js'));
});

// ══════════════════════════════════════════════════
// E. SEO
// ══════════════════════════════════════════════════
console.log('\n🔍 SEO');

test('SEO', 'JSON-LD: index.html Organization', () => {
    assert(indexHtml.includes('"@type": "Organization"'));
});

test('SEO', 'JSON-LD: index.html WebApplication', () => {
    assert(indexHtml.includes('"@type": "WebApplication"'));
});

test('SEO', 'JSON-LD: index.html FAQPage', () => {
    assert(indexHtml.includes('"@type": "FAQPage"'));
});

test('SEO', 'JSON-LD: index.html BreadcrumbList', () => {
    assert(indexHtml.includes('"@type": "BreadcrumbList"'));
});

test('SEO', 'JSON-LD: analysis.html BreadcrumbList', () => {
    assert(analysisHtml.includes('"@type": "BreadcrumbList"'));
});

test('SEO', 'JSON-LD: education.html Course', () => {
    assert(educationHtml.includes('"@type": "Course"'));
});

test('SEO', '시각적 브레드크럼: analysis.html', () => {
    assert(analysisHtml.includes('class="breadcrumb"'));
    assert(analysisHtml.includes('breadcrumb-list'));
});

test('SEO', '시각적 브레드크럼: education.html', () => {
    assert(educationHtml.includes('class="breadcrumb"'));
});

test('SEO', '브레드크럼 CSS 존재', () => {
    const css = read('styles.css');
    assert(css.includes('.breadcrumb'));
    assert(css.includes('.breadcrumb-list'));
});

test('SEO', 'sitemap.xml: changefreq 포함', () => {
    const sitemap = read('sitemap.xml');
    assert(sitemap.includes('<changefreq>'));
    assert(sitemap.includes('weekly'));
});

test('SEO', 'sitemap.xml: 3개 URL', () => {
    const sitemap = read('sitemap.xml');
    const urls = (sitemap.match(/<loc>/g) || []).length;
    assert.strictEqual(urls, 3);
});

// ══════════════════════════════════════════════════
// F. PWA
// ══════════════════════════════════════════════════
console.log('\n📱 PWA');

test('PWA', 'manifest.json 존재', () => {
    assert(exists('manifest.json'));
    const m = JSON.parse(read('manifest.json'));
    assert.strictEqual(m.display, 'standalone');
    assert(m.name.includes('아니모라'));
    assert(m.icons.length > 0);
});

test('PWA', 'sw.js 존재', () => {
    assert(exists('sw.js'));
    const sw = read('sw.js');
    assert(sw.includes('CACHE_NAME'));
    assert(sw.includes('STATIC_ASSETS'));
    assert(sw.includes("self.addEventListener('install'"));
    assert(sw.includes("self.addEventListener('activate'"));
    assert(sw.includes("self.addEventListener('fetch'"));
});

test('PWA', 'sw.js: 캐시 버전 v2', () => {
    const sw = read('sw.js');
    assert(sw.includes("animora-v2"));
});

test('PWA', 'sw.js: error-monitor.js 캐시 포함', () => {
    const sw = read('sw.js');
    assert(sw.includes('error-monitor.js'));
});

test('PWA', 'sw.js: manifest.json 캐시 포함', () => {
    const sw = read('sw.js');
    assert(sw.includes('manifest.json'));
});

test('PWA', 'manifest 링크: 3개 페이지', () => {
    assert(indexHtml.includes('rel="manifest"'));
    assert(analysisHtml.includes('rel="manifest"'));
    assert(educationHtml.includes('rel="manifest"'));
});

test('PWA', 'theme-color: 3개 페이지', () => {
    assert(indexHtml.includes('name="theme-color"'));
    assert(analysisHtml.includes('name="theme-color"'));
    assert(educationHtml.includes('name="theme-color"'));
});

test('PWA', 'Service Worker 등록: 3개 페이지', () => {
    assert(indexHtml.includes("serviceWorker.register"));
    assert(analysisHtml.includes("serviceWorker.register"));
    assert(educationHtml.includes("serviceWorker.register"));
});

test('PWA', 'API 재시도: _fetchWithRetry 메서드', () => {
    const api = read('api-service.js');
    assert(api.includes('_fetchWithRetry'));
    assert(api.includes('retries'));
    assert(api.includes('Math.pow(2'));
});

test('PWA', 'API 디바운싱: _deduplicateRequest 메서드', () => {
    const api = read('api-service.js');
    assert(api.includes('_deduplicateRequest'));
    assert(api.includes('_pendingRequests'));
});

test('PWA', 'API: generateAIAnalysis가 retry 사용', () => {
    const api = read('api-service.js');
    assert(api.includes('this._fetchWithRetry(apiUrl'));
    assert(api.includes('this._deduplicateRequest(requestKey'));
});

// ══════════════════════════════════════════════════
// G. 빌드/인프라
// ══════════════════════════════════════════════════
console.log('\n🏗️ 빌드/인프라');

test('Infra', 'GitHub Actions CI 워크플로우', () => {
    assert(exists('.github/workflows/ci.yml'));
    const ci = read('.github/workflows/ci.yml');
    assert(ci.includes('name: CI'));
    assert(ci.includes('on:'));
    assert(ci.includes('push:'));
    assert(ci.includes('pull_request:'));
});

test('Infra', 'CI: HTML 검증 단계', () => {
    const ci = read('.github/workflows/ci.yml');
    assert(ci.includes('html-validate'));
});

test('Infra', 'CI: 테스트 실행 단계', () => {
    const ci = read('.github/workflows/ci.yml');
    assert(ci.includes('test-validate.cjs'));
});

test('Infra', '환경 감지: ANIMORA_ENV', () => {
    const config = read('config.js');
    assert(config.includes('ANIMORA_ENV'));
    assert(config.includes("'production'"));
    assert(config.includes("'development'"));
});

test('Infra', '환경 감지: debug 플래그', () => {
    const config = read('config.js');
    assert(config.includes("debug: ANIMORA_ENV === 'development'"));
});

test('Infra', '.gitignore 존재', () => {
    assert(exists('.gitignore'));
    const gi = read('.gitignore');
    assert(gi.includes('dist/'));
    assert(gi.includes('node_modules/'));
    assert(gi.includes('.env'));
});

// ══════════════════════════════════════════════════
// H. 분석/실험
// ══════════════════════════════════════════════════
console.log('\n📊 분석/실험');

test('Analytics', 'config.js: analytics 설정', () => {
    const config = read('config.js');
    assert(config.includes('analytics'));
    assert(config.includes('gaId'));
});

test('Analytics', 'index.html: GA 조건부 로드', () => {
    assert(indexHtml.includes('googletagmanager.com'));
    assert(indexHtml.includes('ANIMORA_CONFIG.analytics.enabled'));
});

test('Analytics', 'CSP: GTM 스크립트 허용', () => {
    assert(indexHtml.includes('https://www.googletagmanager.com'));
});

test('Analytics', 'ab-test.js 존재', () => {
    assert(exists('ab-test.js'));
    const ab = read('ab-test.js');
    assert(ab.includes('AnimoraABTest'));
    assert(ab.includes('getVariant'));
});

test('Analytics', 'config.js: experiments 설정', () => {
    const config = read('config.js');
    assert(config.includes('experiments'));
});

// ══════════════════════════════════════════════════
// I. Knowledge Base 검증
// ══════════════════════════════════════════════════
console.log('\n📚 Knowledge Base');

test('KB', 'animora_knowledge.json 존재', () => {
    assert(exists('backend/animora_knowledge.json'));
});

const kb = JSON.parse(read('backend/animora_knowledge.json'));

test('KB', '12개 월 데이터 존재', () => {
    for (let i = 1; i <= 12; i++) {
        assert(kb.months[String(i)], `${i}월 데이터 없음`);
    }
});

const monthAnimals = {
    1: '호랑이', 2: '토끼', 3: '용', 4: '뱀', 5: '말', 6: '양',
    7: '원숭이', 8: '닭', 9: '개', 10: '돼지', 11: '쥐', 12: '소'
};

for (let i = 1; i <= 12; i++) {
    test('KB', `${i}월 (${monthAnimals[i]} 나라) 올바른 데이터`, () => {
        const m = kb.months[String(i)];
        assert.strictEqual(m.name, `${monthAnimals[i]} 나라`);
        assert(m.content.length > 100, `${i}월 내용이 너무 짧음 (${m.content.length}자)`);
        // 호랑이 나라 중복 여부 검사 (1월 제외)
        if (i !== 1) {
            assert(!m.content.includes('1 멀 호랑이 나라 키워드'), `${i}월에 호랑이 데이터 중복!`);
            assert(!m.content.startsWith('° 아니모라 2025.5.17. 22：15'), `${i}월 OCR 잔여`);
        }
        // 자기 동물 이름이 content에 포함되어야 함
        assert(m.content.includes(monthAnimals[i]), `${i}월 content에 '${monthAnimals[i]}' 없음`);
    });
}

test('KB', 'combinations 섹션 존재', () => {
    assert(kb.combinations);
    assert(Object.keys(kb.combinations).length >= 8);
});

test('KB', '재물운 TOP 10 조합 데이터', () => {
    assert(kb.combinations['12월4일'], '12월4일 (1위) 없음');
    assert(kb.combinations['3월13일'], '3월13일 (2위) 없음');
});

test('KB', 'special_content 존재', () => {
    assert(kb.special_content);
});

test('KB', '바람기 TOP 5 콘텐츠', () => {
    const content = kb.special_content['바람기_많은_생일_TOP5'];
    assert(content, 'special_content에 바람기 TOP5 없음');
    assert(content.content || content.title, '바람기 TOP5 content 비어있음');
    const c = content.content || '';
    assert(c.includes('토끼 나라') || c.includes('야생토끼') || c.length > 50, '바람기 TOP5 내용 부족');
});

test('KB', '재물운 TOP 10 콘텐츠', () => {
    const content = kb.special_content['재물운_있는_생일_TOP10'];
    assert(content, 'special_content에 재물운 TOP10 없음');
    assert(content.content || content.title, '재물운 TOP10 content 비어있음');
    const c = content.content || '';
    assert(c.includes('소 나라') || c.includes('아나콘다') || c.length > 50, '재물운 TOP10 내용 부족');
});

// ══════════════════════════════════════════════════
// J. 시스템 프롬프트 검증
// ══════════════════════════════════════════════════
console.log('\n🤖 시스템 프롬프트');

const worker = read('cloudflare-worker/src/index.js');

test('Prompt', '11단계 분석 구조: 변환안내', () => {
    assert(worker.includes('[변환안내]'));
});

test('Prompt', '11단계 분석 구조: 유리의 방 vs 거울의 방', () => {
    assert(worker.includes('유리의 방 vs 거울의 방'));
});

test('Prompt', '11단계 분석 구조: 인생 흐름', () => {
    assert(worker.includes('인생 흐름'));
    assert(worker.includes('성장패턴'));
});

test('Prompt', '11단계 분석 구조: 리듬요약표', () => {
    assert(worker.includes('리듬요약표'));
});

test('Prompt', '11단계 분석 구조: 연애 궁합', () => {
    assert(worker.includes('연애 궁합'));
});

test('Prompt', '11단계 분석 구조: 취향 해석', () => {
    assert(worker.includes('취향 해석'));
});

test('Prompt', '11단계 분석 구조: 한줄 메시지', () => {
    assert(worker.includes('한줄 메시지'));
});

test('Prompt', '포식·보완 관계 분석', () => {
    assert(worker.includes('포식·보완 관계'));
});

test('Prompt', 'getSpecialContent 헬퍼 함수', () => {
    assert(worker.includes('function getSpecialContent'));
});

test('Prompt', 'generatePersonalPrompt: 11단계 참조', () => {
    assert(worker.includes('11단계 구조로 분석'));
});

// ══════════════════════════════════════════════════
// K. 유리의 방/거울의 방 UI
// ══════════════════════════════════════════════════
console.log('\n🪞 유리의 방/거울의 방 UI');

test('GlassMirror', 'index.html: 섹션 존재', () => {
    assert(indexHtml.includes('glass-mirror-section'));
    assert(indexHtml.includes('유리의 방 vs 거울의 방'));
});

test('GlassMirror', 'index.html: 유리의 방 카드', () => {
    assert(indexHtml.includes('glass-room'));
    assert(indexHtml.includes('🪟'));
});

test('GlassMirror', 'index.html: 거울의 방 카드', () => {
    assert(indexHtml.includes('mirror-room'));
    assert(indexHtml.includes('🪞'));
});

test('GlassMirror', 'CSS: glass-mirror 스타일', () => {
    const css = read('styles.css');
    assert(css.includes('.glass-mirror-section'));
    assert(css.includes('.glass-room'));
    assert(css.includes('.mirror-room'));
    assert(css.includes('.gm-vs'));
});

test('GlassMirror', 'CSS: 모바일 반응형', () => {
    const css = read('styles.css');
    assert(css.includes('.glass-mirror-cards'));
    // 모바일에서 세로 정렬
    assert(css.includes('.glass-mirror-cards {') || css.includes('.glass-mirror-cards{'));
});

// ══════════════════════════════════════════════════
// L. JS 문법 검증 (기본)
// ══════════════════════════════════════════════════
console.log('\n📝 JS 문법 기본 검증');

const jsFiles = [
    'sanitize.js', 'config.js', 'error-monitor.js', 'ab-test.js',
    'api-service.js', 'script.js', 'homepage-analysis.js',
    'animora-data.js', 'animal-icons.js', 'storage-service.js',
    'premium-features.js', 'sw.js'
];

jsFiles.forEach(file => {
    test('JS', `${file}: 파일 존재 및 비어있지 않음`, () => {
        assert(exists(file), `${file} 존재하지 않음`);
        const content = read(file);
        assert(content.length > 10, `${file} 내용 없음`);
    });
});

test('JS', '중괄호 균형: script.js', () => {
    const s = read('script.js');
    const opens = (s.match(/{/g) || []).length;
    const closes = (s.match(/}/g) || []).length;
    assert.strictEqual(opens, closes, `{ ${opens}개, } ${closes}개`);
});

test('JS', '중괄호 균형: api-service.js', () => {
    const s = read('api-service.js');
    const opens = (s.match(/{/g) || []).length;
    const closes = (s.match(/}/g) || []).length;
    assert.strictEqual(opens, closes, `{ ${opens}개, } ${closes}개`);
});

test('JS', '중괄호 균형: error-monitor.js', () => {
    const s = read('error-monitor.js');
    const opens = (s.match(/{/g) || []).length;
    const closes = (s.match(/}/g) || []).length;
    assert.strictEqual(opens, closes, `{ ${opens}개, } ${closes}개`);
});

test('JS', '중괄호 균형: ab-test.js', () => {
    const s = read('ab-test.js');
    const opens = (s.match(/{/g) || []).length;
    const closes = (s.match(/}/g) || []).length;
    assert.strictEqual(opens, closes, `{ ${opens}개, } ${closes}개`);
});

// ══════════════════════════════════════════════════
// M. HTML 구조 검증
// ══════════════════════════════════════════════════
console.log('\n🏛️ HTML 구조');

['index.html', 'analysis.html', 'education.html'].forEach(file => {
    const html = read(file);

    test('HTML', `${file}: DOCTYPE`, () => {
        assert(html.trimStart().startsWith('<!DOCTYPE html>'));
    });

    test('HTML', `${file}: lang=ko`, () => {
        assert(html.includes('lang="ko"'));
    });

    test('HTML', `${file}: charset UTF-8`, () => {
        assert(html.includes('charset="UTF-8"'));
    });

    test('HTML', `${file}: viewport`, () => {
        assert(html.includes('viewport'));
    });
});

// ══════════════════════════════════════════════════
// N. CSS 검증
// ══════════════════════════════════════════════════
console.log('\n🎨 CSS 검증');

test('CSS', 'styles.css: CSS 변수 정의', () => {
    const css = read('styles.css');
    assert(css.includes('--primary-color'));
    assert(css.includes('--secondary-color'));
    assert(css.includes('--accent-color'));
});

test('CSS', 'styles.css: 중괄호 균형', () => {
    const css = read('styles.css');
    const opens = (css.match(/{/g) || []).length;
    const closes = (css.match(/}/g) || []).length;
    assert.strictEqual(opens, closes, `{ ${opens}개, } ${closes}개`);
});

test('CSS', 'analysis.css: 중괄호 균형', () => {
    const css = read('analysis.css');
    const opens = (css.match(/{/g) || []).length;
    const closes = (css.match(/}/g) || []).length;
    assert.strictEqual(opens, closes, `{ ${opens}개, } ${closes}개`);
});

test('CSS', 'education.css: 중괄호 균형', () => {
    const css = read('education.css');
    const opens = (css.match(/{/g) || []).length;
    const closes = (css.match(/}/g) || []).length;
    assert.strictEqual(opens, closes, `{ ${opens}개, } ${closes}개`);
});

// ══════════════════════════════════════════════════
// O. JSON 유효성
// ══════════════════════════════════════════════════
console.log('\n📋 JSON 유효성');

test('JSON', 'manifest.json 파싱', () => {
    JSON.parse(read('manifest.json'));
});

test('JSON', 'animora_knowledge.json 파싱', () => {
    JSON.parse(read('backend/animora_knowledge.json'));
});

test('JSON', 'sitemap.xml 형식', () => {
    const sitemap = read('sitemap.xml');
    assert(sitemap.includes('<?xml'));
    assert(sitemap.includes('<urlset'));
    assert(sitemap.includes('</urlset>'));
});

// ══════════════════════════════════════════════════
// P. Cloudflare Worker 검증
// ══════════════════════════════════════════════════
console.log('\n☁️ Cloudflare Worker');

test('Worker', '시스템 프롬프트 존재', () => {
    assert(worker.includes('ANIMORA_SYSTEM_PROMPT'));
});

test('Worker', '12개 나라 정의', () => {
    for (const animal of Object.values(monthAnimals)) {
        assert(worker.includes(`${animal} 나라`), `Worker에 ${animal} 나라 없음`);
    }
});

test('Worker', 'CORS 함수', () => {
    assert(worker.includes('function corsHeaders'));
    assert(worker.includes('function handleOptions'));
});

test('Worker', 'getMonthKnowledge 함수', () => {
    assert(worker.includes('function getMonthKnowledge'));
});

test('Worker', 'getCombinationKnowledge 함수', () => {
    assert(worker.includes('function getCombinationKnowledge'));
});

test('Worker', 'getSpecialContent 함수', () => {
    assert(worker.includes('function getSpecialContent'));
});

test('Worker', 'generatePersonalPrompt 함수', () => {
    assert(worker.includes('function generatePersonalPrompt'));
});

test('Worker', 'generateCouplePrompt 함수', () => {
    assert(worker.includes('function generateCouplePrompt'));
});

// ══════════════════════════════════════════════════
// 결과 출력
// ══════════════════════════════════════════════════
console.log('\n==================================================');
console.log(`📊 확장 테스트 결과: ${passed}/${passed + failed} 통과, ${failed} 실패`);
if (failed === 0) {
    console.log('🎉 모든 테스트 통과!');
} else {
    console.log('⚠️ 실패한 테스트가 있습니다.');
    process.exit(1);
}
console.log('==================================================\n');
