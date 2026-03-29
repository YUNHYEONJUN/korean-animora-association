/**
 * A/B 테스트 유틸리티
 * 사용자를 실험 그룹에 무작위 배정하고 결과를 일관되게 유지
 */
const AnimoraABTest = (() => {
    const STORAGE_KEY = 'animora_ab_assignments';

    function getAssignments() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch {
            return {};
        }
    }

    function saveAssignments(assignments) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
        } catch {
            // localStorage 접근 불가 시 무시
        }
    }

    /**
     * 실험 그룹 가져오기 (이미 배정된 경우 동일 그룹 반환)
     * @param {string} experimentId - 실험 ID
     * @returns {string|null} 배정된 variant 또는 null (실험 미정의)
     */
    function getVariant(experimentId) {
        const experiments = (typeof ANIMORA_CONFIG !== 'undefined' && ANIMORA_CONFIG.experiments) || {};
        const experiment = experiments[experimentId];
        if (!experiment || !Array.isArray(experiment.variants) || experiment.variants.length === 0) return null;

        const assignments = getAssignments();
        if (assignments[experimentId]) {
            // 이미 배정된 경우 (variant가 아직 유효한지 확인)
            if (experiment.variants.includes(assignments[experimentId])) {
                return assignments[experimentId];
            }
        }

        // 가중치 기반 무작위 배정
        let weights = experiment.weight;
        if (!Array.isArray(weights) || weights.length !== experiment.variants.length) {
            weights = experiment.variants.map(() => 1 / experiment.variants.length);
        }
        // 가중치 합계 정규화
        const weightSum = weights.reduce((a, b) => a + b, 0);
        const normalizedWeights = weightSum > 0 ? weights.map(w => w / weightSum) : weights;

        const rand = Math.random();
        let cumulative = 0;
        let selected = experiment.variants[experiment.variants.length - 1]; // 기본값: 마지막 variant
        for (let i = 0; i < normalizedWeights.length; i++) {
            cumulative += normalizedWeights[i];
            if (rand < cumulative) {
                selected = experiment.variants[i];
                break;
            }
        }

        assignments[experimentId] = selected;
        saveAssignments(assignments);
        return selected;
    }

    return { getVariant };
})();
