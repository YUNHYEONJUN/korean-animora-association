/**
 * 경량 에러 모니터링
 * 전역 에러를 수집하여 localStorage에 저장 (디버깅용)
 */
const AnimoraErrorMonitor = (() => {
    const MAX_ERRORS = 50;
    const STORAGE_KEY = 'animora_errors';

    function getErrors() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    }

    function saveError(errorData) {
        try {
            const errors = getErrors();
            errors.push({
                ...errorData,
                timestamp: new Date().toISOString(),
                url: location.href,
                userAgent: navigator.userAgent
            });
            // 최대 개수 유지
            while (errors.length > MAX_ERRORS) errors.shift();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(errors));
        } catch {
            // localStorage 접근 실패 시 무시
        }
    }

    // 전역 에러 핸들러
    window.addEventListener('error', (event) => {
        saveError({
            type: 'error',
            message: event.message,
            source: event.filename,
            line: event.lineno,
            col: event.colno
        });
    });

    // Promise 거부 핸들러
    window.addEventListener('unhandledrejection', (event) => {
        saveError({
            type: 'unhandledrejection',
            message: String(event.reason)
        });
    });

    return {
        getErrors,
        clear() { localStorage.removeItem(STORAGE_KEY); }
    };
})();
