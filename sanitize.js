/**
 * XSS 방어 유틸리티
 * innerHTML에 삽입되는 모든 사용자 입력을 새니타이징
 */
const AnimoraSanitizer = {
    /**
     * HTML 엔티티 이스케이프 - 사용자 입력을 안전하게 변환
     * @param {string} str - 이스케이프할 문자열
     * @returns {string} 이스케이프된 문자열
     */
    escapeHTML(str) {
        if (typeof str !== 'string') return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, c => map[c]);
    },

    /**
     * 숫자만 허용
     * @param {*} val
     * @returns {number}
     */
    sanitizeNumber(val) {
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num;
    },

    /**
     * 에러 메시지 새니타이징 - 스택 트레이스 제거
     * @param {string} msg
     * @returns {string}
     */
    sanitizeError(msg) {
        if (typeof msg !== 'string') return '알 수 없는 오류가 발생했습니다.';
        // 스택 트레이스, 파일 경로 등 제거
        return this.escapeHTML(msg.split('\n')[0].substring(0, 200));
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimoraSanitizer;
}
