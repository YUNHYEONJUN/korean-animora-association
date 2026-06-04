/**
 * 아니모라 인증 서비스
 * Cloudflare Workers JWT 기반 회원 인증
 */

const AnimoraAuth = (() => {
    const STORAGE = {
        ACCESS_TOKEN: 'animora_at',
        REFRESH_TOKEN: 'animora_rt',
        USER: 'animora_user',
    };

    function _apiBase() {
        return (typeof ANIMORA_CONFIG !== 'undefined' && ANIMORA_CONFIG.api.backend.baseUrl)
            || 'https://animora-api.yoonhj79.workers.dev/api';
    }

    async function _post(path, body) {
        const res = await fetch(`${_apiBase()}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'omit',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
    }

    async function _get(path) {
        const token = getAccessToken();
        const res = await fetch(`${_apiBase()}${path}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            credentials: 'omit',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
    }

    function _saveSession(data) {
        localStorage.setItem(STORAGE.ACCESS_TOKEN, data.accessToken);
        if (data.refreshToken) localStorage.setItem(STORAGE.REFRESH_TOKEN, data.refreshToken);
        if (data.user) localStorage.setItem(STORAGE.USER, JSON.stringify(data.user));
    }

    function _clearSession() {
        Object.values(STORAGE).forEach(k => localStorage.removeItem(k));
    }

    function _parseJWT(token) {
        try {
            const payload = token.split('.')[1];
            const padded = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(
                payload.length + (4 - payload.length % 4) % 4, '='
            );
            return JSON.parse(atob(padded));
        } catch {
            return null;
        }
    }

    // ── 공개 API ─────────────────────────────────────────────────

    function getAccessToken() {
        return localStorage.getItem(STORAGE.ACCESS_TOKEN);
    }

    function getRefreshToken() {
        return localStorage.getItem(STORAGE.REFRESH_TOKEN);
    }

    function getCachedUser() {
        try {
            const raw = localStorage.getItem(STORAGE.USER);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    function isLoggedIn() {
        const token = getAccessToken();
        if (!token) return false;
        const payload = _parseJWT(token);
        if (!payload) return false;
        return payload.exp > Math.floor(Date.now() / 1000);
    }

    function isPremium() {
        if (!isLoggedIn()) return false;
        const payload = _parseJWT(getAccessToken());
        return !!(payload && payload.isPremium);
    }

    async function register(email, password, name) {
        const data = await _post('/auth/register', { email, password, name });
        _saveSession(data);
        _notifyChange();
        return data.user;
    }

    async function login(email, password) {
        const data = await _post('/auth/login', { email, password });
        _saveSession(data);
        _notifyChange();
        return data.user;
    }

    async function logout() {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            await _post('/auth/logout', { refreshToken }).catch(() => {});
        }
        _clearSession();
        _notifyChange();
    }

    async function getMe() {
        if (!isLoggedIn()) return null;
        try {
            const user = await _get('/auth/me');
            localStorage.setItem(STORAGE.USER, JSON.stringify(user));
            _notifyChange();
            return user;
        } catch {
            return getCachedUser();
        }
    }

    async function refreshToken() {
        const rt = getRefreshToken();
        if (!rt) throw new Error('리프레시 토큰이 없습니다.');
        const data = await _post('/auth/refresh', { refreshToken: rt });
        localStorage.setItem(STORAGE.ACCESS_TOKEN, data.accessToken);
        // 갱신된 isPremium 상태를 캐시에 반영
        const payload = _parseJWT(data.accessToken);
        if (payload) {
            const cached = getCachedUser() || {};
            cached.isPremium = payload.isPremium;
            localStorage.setItem(STORAGE.USER, JSON.stringify(cached));
        }
        _notifyChange();
        return data.accessToken;
    }

    // 만료 60초 전에 자동 갱신
    async function ensureValidToken() {
        const token = getAccessToken();
        if (!token) return null;
        const payload = _parseJWT(token);
        if (!payload) return null;
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp - now > 60) return token;
        try {
            return await refreshToken();
        } catch {
            _clearSession();
            _notifyChange();
            return null;
        }
    }

    async function confirmPayment(paymentKey, orderId, amount) {
        const token = await ensureValidToken();
        if (!token) throw new Error('로그인이 필요합니다.');
        const res = await fetch(`${_apiBase()}/payment/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ paymentKey, orderId, amount }),
            credentials: 'omit',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || '결제 확인 실패');
        // 새 accessToken에 isPremium=true 반영
        if (data.accessToken) {
            localStorage.setItem(STORAGE.ACCESS_TOKEN, data.accessToken);
            const cached = getCachedUser() || {};
            cached.isPremium = true;
            localStorage.setItem(STORAGE.USER, JSON.stringify(cached));
            _notifyChange();
        }
        return data;
    }

    // 로그인 상태 변경 시 구독자에게 알림
    const _listeners = [];
    function onChange(fn) { _listeners.push(fn); }
    function _notifyChange() { _listeners.forEach(fn => { try { fn(isLoggedIn(), getCachedUser()); } catch {} }); }

    // 페이지 로드 시 토큰 유효성 확인
    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', async () => {
            if (isLoggedIn()) {
                await ensureValidToken().catch(() => {});
                await getMe().catch(() => {});
            }
            _notifyChange();
        });
    }

    return { register, login, logout, getMe, refreshToken, ensureValidToken, confirmPayment, onChange, isLoggedIn, isPremium, getAccessToken, getCachedUser };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = AnimoraAuth;
