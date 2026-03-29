#!/usr/bin/env node
/**
 * 간단한 빌드 스크립트
 * CSS/JS 파일을 dist/ 폴더에 최소화하여 복사
 * 사용: node build.js
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');

// dist 폴더 초기화
if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// 복사할 파일 목록
const files = [
    'index.html', 'analysis.html', 'education.html', '404.html',
    'styles.css', 'analysis.css', 'education.css',
    'error-monitor.js', 'sanitize.js', 'config.js', 'lunar-converter.js',
    'animora-data.js', 'animal-icons.js', 'script.js',
    'homepage-analysis.js', 'api-service.js', 'storage-service.js',
    'premium-features.js', 'analysis.js', 'ab-test.js',
    'sw.js', 'manifest.json', 'robots.txt', 'sitemap.xml',
    'president-photo.jpg'
];

let totalSaved = 0;

files.forEach(file => {
    const src = path.join(__dirname, file);
    if (!fs.existsSync(src)) return;

    let content = fs.readFileSync(src);
    const originalSize = content.length;

    // CSS 간단 최소화
    if (file.endsWith('.css')) {
        let text = content.toString('utf8');
        text = text.replace(/\/\*[\s\S]*?\*\//g, ''); // 주석 제거
        text = text.replace(/\s+/g, ' ');              // 연속 공백
        text = text.replace(/\s*([{}:;,>~+])\s*/g, '$1'); // 구분자 주변 공백
        text = text.trim();
        content = Buffer.from(text);
    }

    // JS 간단 최소화 (주석 제거, 공백 축소)
    if (file.endsWith('.js') && !file.includes('.min.')) {
        let text = content.toString('utf8');
        text = text.replace(/\/\*[\s\S]*?\*\//g, '');       // 블록 주석
        text = text.replace(/\/\/(?!:).*/g, '');              // 라인 주석 (URL 제외)
        text = text.replace(/^\s+/gm, '');                    // 줄 시작 공백
        text = text.replace(/\n{2,}/g, '\n');                 // 빈 줄 축소
        text = text.trim();
        content = Buffer.from(text);
    }

    const saved = originalSize - content.length;
    totalSaved += saved;

    fs.writeFileSync(path.join(DIST, file), content);

    if (saved > 0) {
        const pct = ((saved / originalSize) * 100).toFixed(1);
        console.log(`  ${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(content.length / 1024).toFixed(1)}KB (-${pct}%)`);
    }
});

// .github 폴더 복사
const ghSrc = path.join(__dirname, '.github');
if (fs.existsSync(ghSrc)) {
    const ghDist = path.join(DIST, '.github', 'workflows');
    fs.mkdirSync(ghDist, { recursive: true });
    const workflow = path.join(ghSrc, 'workflows', 'ci.yml');
    if (fs.existsSync(workflow)) {
        fs.copyFileSync(workflow, path.join(ghDist, 'ci.yml'));
    }
}

console.log(`\n✅ 빌드 완료: dist/ (총 ${(totalSaved / 1024).toFixed(1)}KB 절약)`);
