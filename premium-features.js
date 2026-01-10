/**
 * 프리미엄 기능 관리
 * PDF 다운로드, 맞춤형 질문, 소셜 공유 등
 */

class PremiumFeatures {
    constructor() {
        this.config = ANIMORA_CONFIG;
    }
    
    /**
     * PDF 다운로드 (jsPDF 사용)
     * @param {Object} analysisData - 분석 데이터
     * @param {String} resultHTML - 결과 HTML
     */
    async downloadPDF(analysisData, resultHTML) {
        // jsPDF 라이브러리가 로드되었는지 확인
        if (typeof jspdf === 'undefined') {
            alert('PDF 다운로드 기능을 준비 중입니다.\n라이브러리를 로드하는 중...');
            await this._loadJsPDF();
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            // 한글 폰트 설정 (나눔고딕)
            doc.setFont('NanumGothic', 'normal');
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - 2 * margin;
            
            let yPosition = margin;
            
            // 제목
            doc.setFontSize(20);
            doc.setTextColor(44, 62, 137);
            doc.text('아니모라 성격 분석 결과', margin, yPosition);
            yPosition += 15;
            
            // 생성 날짜
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, margin, yPosition);
            yPosition += 10;
            
            // 구분선
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
            
            // 분석 유형별 내용 추가
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            if (analysisData.type === 'personal') {
                this._addPersonalAnalysisToPDF(doc, analysisData, margin, yPosition, contentWidth);
            } else if (analysisData.type === 'couple') {
                this._addCoupleAnalysisToPDF(doc, analysisData, margin, yPosition, contentWidth);
            } else if (analysisData.type === 'family') {
                this._addFamilyAnalysisToPDF(doc, analysisData, margin, yPosition, contentWidth);
            }
            
            // 푸터
            const footerY = pageHeight - 15;
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('© 2025 한국아니모라협회. All rights reserved.', margin, footerY);
            doc.text('https://yunhyeonjun.github.io/korean-animora-association', pageWidth - margin, footerY, { align: 'right' });
            
            // 파일명 생성
            const fileName = `아니모라_분석결과_${analysisData.name || '결과'}_${new Date().getTime()}.pdf`;
            
            // 다운로드
            doc.save(fileName);
            
            return true;
        } catch (error) {
            console.error('PDF 생성 오류:', error);
            alert('PDF 다운로드 중 오류가 발생했습니다.');
            return false;
        }
    }
    
    /**
     * jsPDF 라이브러리 동적 로드
     */
    async _loadJsPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * 개인 분석 PDF 내용 추가
     */
    _addPersonalAnalysisToPDF(doc, data, margin, yStart, width) {
        let y = yStart;
        const lineHeight = 7;
        
        // 기본 정보
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 137);
        doc.text(`${data.name}님의 아니모라 유형`, margin, y);
        y += 10;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`음력: ${data.month}월 ${data.day}일`, margin, y);
        y += lineHeight;
        doc.text(`나라: ${data.country}`, margin, y);
        y += lineHeight;
        doc.text(`동물: ${data.animal}`, margin, y);
        y += 15;
        
        // 간단한 텍스트 형태로 분석 내용 추가
        doc.setFontSize(10);
        const analysisText = this._stripHTML(data.analysisResult || '');
        const lines = doc.splitTextToSize(analysisText, width);
        
        lines.forEach(line => {
            if (y > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });
    }
    
    /**
     * 커플 분석 PDF 내용 추가
     */
    _addCoupleAnalysisToPDF(doc, data, margin, yStart, width) {
        let y = yStart;
        const lineHeight = 7;
        
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 137);
        doc.text('커플 궁합 분석', margin, y);
        y += 15;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`첫 번째: ${data.person1.name}`, margin, y);
        y += lineHeight;
        doc.text(`두 번째: ${data.person2.name}`, margin, y);
        y += lineHeight;
        doc.text(`궁합 점수: ${data.compatibilityScore || 0}점`, margin, y);
        y += 15;
        
        doc.setFontSize(10);
        const analysisText = this._stripHTML(data.analysisResult || '');
        const lines = doc.splitTextToSize(analysisText, width);
        
        lines.forEach(line => {
            if (y > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });
    }
    
    /**
     * 가족 분석 PDF 내용 추가
     */
    _addFamilyAnalysisToPDF(doc, data, margin, yStart, width) {
        let y = yStart;
        const lineHeight = 7;
        
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 137);
        doc.text('가족 관계 분석', margin, y);
        y += 15;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        data.members.forEach((member, index) => {
            doc.text(`${member.name}: ${member.country} - ${member.animal}`, margin, y);
            y += lineHeight;
        });
        y += 10;
        
        doc.setFontSize(10);
        const analysisText = this._stripHTML(data.analysisResult || '');
        const lines = doc.splitTextToSize(analysisText, width);
        
        lines.forEach(line => {
            if (y > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });
    }
    
    /**
     * HTML 태그 제거
     */
    _stripHTML(html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
    
    /**
     * 소셜 공유
     * @param {String} platform - 'kakao', 'facebook', 'twitter', 'copy'
     * @param {Object} data - 공유 데이터
     */
    share(platform, data) {
        const url = window.location.href;
        const title = '아니모라 성격 분석 결과';
        const description = `${data.name}님의 아니모라 유형: ${data.country} - ${data.animal}`;
        
        switch (platform) {
            case 'kakao':
                this._shareKakao(url, title, description);
                break;
            case 'facebook':
                this._shareFacebook(url);
                break;
            case 'twitter':
                this._shareTwitter(url, title);
                break;
            case 'copy':
                this._copyLink(url);
                break;
            default:
                alert('지원하지 않는 공유 방식입니다.');
        }
    }
    
    /**
     * 카카오톡 공유
     */
    _shareKakao(url, title, description) {
        if (typeof Kakao === 'undefined') {
            alert('카카오톡 공유 기능은 준비 중입니다.');
            return;
        }
        
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: description,
                imageUrl: 'https://yunhyeonjun.github.io/korean-animora-association/og-image.png',
                link: {
                    mobileWebUrl: url,
                    webUrl: url
                }
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url
                    }
                }
            ]
        });
    }
    
    /**
     * 페이스북 공유
     */
    _shareFacebook(url) {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    /**
     * 트위터 공유
     */
    _shareTwitter(url, title) {
        const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    /**
     * 링크 복사
     */
    _copyLink(url) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('링크가 복사되었습니다!');
            }).catch(err => {
                console.error('링크 복사 실패:', err);
                this._fallbackCopyLink(url);
            });
        } else {
            this._fallbackCopyLink(url);
        }
    }
    
    /**
     * 링크 복사 폴백
     */
    _fallbackCopyLink(url) {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            alert('링크가 복사되었습니다!');
        } catch (err) {
            alert('링크 복사에 실패했습니다. 수동으로 복사해주세요:\n' + url);
        }
        
        document.body.removeChild(textArea);
    }
    
    /**
     * 히스토리 UI 생성
     * @returns {String} HTML 문자열
     */
    generateHistoryHTML() {
        const history = storageService.getHistory();
        const stats = storageService.getStatistics();
        
        if (history.length === 0) {
            return `
                <div class="empty-history">
                    <p>📝 저장된 분석이 없습니다.</p>
                    <p>분석 후 "저장하기" 버튼을 누르면 히스토리에 저장됩니다.</p>
                </div>
            `;
        }
        
        let html = `
            <div class="history-stats">
                <div class="stat-item">
                    <span class="stat-number">${stats.total}</span>
                    <span class="stat-label">전체 분석</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.byType.personal}</span>
                    <span class="stat-label">개인 분석</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.byType.couple}</span>
                    <span class="stat-label">커플 궁합</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.byType.family}</span>
                    <span class="stat-label">가족 관계</span>
                </div>
            </div>
            
            <div class="history-list">
        `;
        
        history.forEach(item => {
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleDateString('ko-KR');
            const timeStr = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            
            const typeLabel = {
                personal: '👤 개인',
                couple: '💑 커플',
                family: '👨‍👩‍👧‍👦 가족'
            }[item.type] || '📊 분석';
            
            html += `
                <div class="history-item" data-id="${item.id}">
                    <div class="history-header">
                        <span class="history-type">${typeLabel}</span>
                        <span class="history-date">${dateStr} ${timeStr}</span>
                    </div>
                    <div class="history-content">
                        ${this._getHistoryPreview(item)}
                    </div>
                    <div class="history-actions">
                        <button class="btn-view" onclick="viewHistory('${item.id}')">보기</button>
                        <button class="btn-delete" onclick="deleteHistory('${item.id}')">삭제</button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        return html;
    }
    
    /**
     * 히스토리 미리보기 텍스트
     */
    _getHistoryPreview(item) {
        const data = item.data;
        
        if (item.type === 'personal') {
            return `${data.name} - ${data.month}월 ${data.day}일`;
        } else if (item.type === 'couple') {
            return `${data.person1.name} & ${data.person2.name}`;
        } else if (item.type === 'family') {
            return `가족 ${data.members.length}명 분석`;
        }
        
        return '분석 결과';
    }
}

// 전역 인스턴스
const premiumFeatures = new PremiumFeatures();

// 전역 함수 (HTML에서 호출)
function viewHistory(id) {
    const item = storageService.getAnalysisById(id);
    if (item) {
        // 결과를 다시 표시 (실제 구현 시 분석 결과 재생성)
        alert(`히스토리 보기 기능은 개발 중입니다.\nID: ${id}`);
    }
}

function deleteHistory(id) {
    if (confirm('이 분석을 삭제하시겠습니까?')) {
        storageService.deleteAnalysis(id);
        // 히스토리 UI 새로고침
        location.reload();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumFeatures;
}
