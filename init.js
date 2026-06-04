/**
 * 페이지 초기화 — GA 조건부 로드 + Service Worker 등록
 * inline script 없이 외부 파일로 분리하여 CSP unsafe-inline 의존 제거
 */
(function () {
    'use strict';

    // ── Google Analytics 조건부 로드 ────────────────────────────
    if (typeof ANIMORA_CONFIG !== 'undefined' &&
        ANIMORA_CONFIG.analytics &&
        ANIMORA_CONFIG.analytics.enabled &&
        ANIMORA_CONFIG.analytics.gaId) {

        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANIMORA_CONFIG.analytics.gaId;
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', ANIMORA_CONFIG.analytics.gaId);
    }

    // ── Service Worker 등록 ──────────────────────────────────────
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker
                .register('/korean-animora-association/sw.js')
                .catch(function () { /* 등록 실패 시 조용히 무시 */ });
        });
    }
})();
