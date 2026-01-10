/**
 * 로컬 스토리지 서비스
 * 분석 히스토리 저장 및 관리
 */

class StorageService {
    constructor() {
        this.config = ANIMORA_CONFIG;
        this.storageKey = this.config.storage.historyKey;
        this.isPremium = false; // 실제로는 사용자 인증에서 관리
    }
    
    /**
     * 분석 결과 저장
     * @param {Object} analysis - 분석 데이터
     * @returns {Boolean} 저장 성공 여부
     */
    saveAnalysis(analysis) {
        try {
            const history = this.getHistory();
            
            // 분석 데이터에 메타정보 추가
            const analysisWithMeta = {
                id: this._generateId(),
                timestamp: new Date().toISOString(),
                type: analysis.type, // 'personal', 'couple', 'family'
                data: analysis,
                isPremium: this.isPremium
            };
            
            // 히스토리에 추가
            history.unshift(analysisWithMeta);
            
            // 무료 사용자는 최대 개수 제한
            const maxHistory = this.isPremium 
                ? this.config.storage.maxPremiumHistory 
                : this.config.storage.maxFreeHistory;
            
            if (maxHistory > 0 && history.length > maxHistory) {
                history.splice(maxHistory);
            }
            
            // 저장
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            
            return true;
        } catch (error) {
            console.error('분석 저장 오류:', error);
            return false;
        }
    }
    
    /**
     * 전체 히스토리 조회
     * @returns {Array} 분석 히스토리 목록
     */
    getHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('히스토리 조회 오류:', error);
            return [];
        }
    }
    
    /**
     * 특정 분석 조회
     * @param {String} id - 분석 ID
     * @returns {Object|null} 분석 데이터
     */
    getAnalysisById(id) {
        const history = this.getHistory();
        return history.find(item => item.id === id) || null;
    }
    
    /**
     * 분석 삭제
     * @param {String} id - 삭제할 분석 ID
     * @returns {Boolean} 삭제 성공 여부
     */
    deleteAnalysis(id) {
        try {
            const history = this.getHistory();
            const filtered = history.filter(item => item.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('분석 삭제 오류:', error);
            return false;
        }
    }
    
    /**
     * 전체 히스토리 삭제
     * @returns {Boolean} 삭제 성공 여부
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('히스토리 삭제 오류:', error);
            return false;
        }
    }
    
    /**
     * 히스토리 개수 조회
     * @returns {Number} 저장된 분석 개수
     */
    getHistoryCount() {
        return this.getHistory().length;
    }
    
    /**
     * 저장 가능 여부 확인
     * @returns {Object} {canSave: Boolean, remaining: Number}
     */
    canSaveMore() {
        const count = this.getHistoryCount();
        const maxHistory = this.isPremium 
            ? this.config.storage.maxPremiumHistory 
            : this.config.storage.maxFreeHistory;
        
        if (maxHistory === -1) {
            return { canSave: true, remaining: -1 }; // 무제한
        }
        
        return {
            canSave: count < maxHistory,
            remaining: Math.max(0, maxHistory - count)
        };
    }
    
    /**
     * 히스토리 통계
     * @returns {Object} 통계 정보
     */
    getStatistics() {
        const history = this.getHistory();
        
        const stats = {
            total: history.length,
            byType: {
                personal: 0,
                couple: 0,
                family: 0
            },
            recent: history.slice(0, 5),
            oldestDate: history.length > 0 
                ? new Date(history[history.length - 1].timestamp) 
                : null,
            newestDate: history.length > 0 
                ? new Date(history[0].timestamp) 
                : null
        };
        
        history.forEach(item => {
            if (stats.byType[item.type] !== undefined) {
                stats.byType[item.type]++;
            }
        });
        
        return stats;
    }
    
    /**
     * 히스토리 내보내기 (JSON)
     * @returns {String} JSON 문자열
     */
    exportHistory() {
        const history = this.getHistory();
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            data: history
        };
        return JSON.stringify(exportData, null, 2);
    }
    
    /**
     * 히스토리 가져오기 (JSON)
     * @param {String} jsonString - JSON 문자열
     * @returns {Boolean} 성공 여부
     */
    importHistory(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            if (!imported.data || !Array.isArray(imported.data)) {
                throw new Error('잘못된 데이터 형식');
            }
            
            // 기존 히스토리와 병합
            const existing = this.getHistory();
            const merged = [...imported.data, ...existing];
            
            // 중복 제거 (ID 기준)
            const unique = merged.filter((item, index, self) =>
                index === self.findIndex(t => t.id === item.id)
            );
            
            // 날짜순 정렬
            unique.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            localStorage.setItem(this.storageKey, JSON.stringify(unique));
            return true;
            
        } catch (error) {
            console.error('히스토리 가져오기 오류:', error);
            return false;
        }
    }
    
    /**
     * 고유 ID 생성
     * @returns {String} 고유 ID
     */
    _generateId() {
        return `animora_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * 프리미엄 상태 설정
     * @param {Boolean} isPremium - 프리미엄 여부
     */
    setPremiumStatus(isPremium) {
        this.isPremium = isPremium;
    }
}

// 전역 인스턴스 생성
const storageService = new StorageService();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageService;
}
