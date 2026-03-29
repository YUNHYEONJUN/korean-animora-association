/**
 * Service Worker - 아니모라 PWA 캐싱
 */
const CACHE_NAME = 'animora-v2';
const STATIC_ASSETS = [
    '/korean-animora-association/',
    '/korean-animora-association/index.html',
    '/korean-animora-association/analysis.html',
    '/korean-animora-association/education.html',
    '/korean-animora-association/styles.css',
    '/korean-animora-association/analysis.css',
    '/korean-animora-association/education.css',
    '/korean-animora-association/error-monitor.js',
    '/korean-animora-association/sanitize.js',
    '/korean-animora-association/config.js',
    '/korean-animora-association/lunar-converter.js',
    '/korean-animora-association/animora-data.js',
    '/korean-animora-association/animal-icons.js',
    '/korean-animora-association/script.js',
    '/korean-animora-association/homepage-analysis.js',
    '/korean-animora-association/api-service.js',
    '/korean-animora-association/storage-service.js',
    '/korean-animora-association/premium-features.js',
    '/korean-animora-association/analysis.js',
    '/korean-animora-association/manifest.json'
];

// Install: 정적 파일 프리캐싱
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: 오래된 캐시 삭제 + 클라이언트 알림
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            // 새 버전 활성화 시 클라이언트에 알림
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
                });
            });
        })
    );
    self.clients.claim();
});

// Fetch: Network-first (API), Cache-first (정적 파일)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // API 요청은 네트워크 우선
    if (url.hostname.includes('workers.dev') || url.hostname.includes('openai.com')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({
                    error: '네트워크 연결을 확인해주세요.',
                    offline: true
                }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Google Fonts 등 외부 리소스는 캐시 우선
    if (url.hostname !== location.hostname) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                return cached || fetch(event.request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
                    }
                    return response;
                });
            })
        );
        return;
    }

    // 정적 파일: 캐시 우선, 네트워크 폴백 + 백그라운드 업데이트
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetchPromise = fetch(event.request).then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
                }
                return response;
            }).catch(() => {
                // 캐시에 있으면 반환, 없으면 오프라인 폴백
                if (cached) return cached;
                // HTML 페이지 요청의 경우 캐시된 index.html로 폴백
                if (event.request.mode === 'navigate') {
                    return caches.match('/korean-animora-association/index.html');
                }
                return new Response('오프라인 상태입니다.', { status: 503 });
            });

            return cached || fetchPromise;
        })
    );
});
