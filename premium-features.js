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
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pageWidth - 2 * margin;
            const lineHeight = 7;
            
            let yPosition = margin;
            
            // 페이지 넘김 체크 함수
            const checkPageBreak = (additionalSpace = 10) => {
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = margin;
                    return true;
                }
                return false;
            };
            
            // 제목
            doc.setFontSize(18);
            doc.setTextColor(44, 62, 137);
            doc.text('아니모라 분석 결과', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 12;
            
            // 생성 날짜
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;
            
            // 구분선
            doc.setDrawColor(212, 175, 55);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 8;
            
            // HTML에서 텍스트 추출 (AI 분석 결과 포함)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = resultHTML;
            
            // 모든 result-card 추출 (기본 분석 + AI 분석 + 맞춤형 질문)
            const resultCards = tempDiv.querySelectorAll('.result-card');
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            
            resultCards.forEach((card, index) => {
                // 카드 제목
                const cardTitle = card.querySelector('h2, h3');
                if (cardTitle) {
                    checkPageBreak(15);
                    doc.setFontSize(13);
                    doc.setTextColor(44, 62, 137);
                    const titleText = this._stripHTML(cardTitle.textContent);
                    doc.text(titleText, margin, yPosition);
                    yPosition += 10;
                }
                
                // 카드 내용
                const cardContent = card.querySelector('.analysis-content, .result-content, div[style*="white-space"]');
                if (cardContent) {
                    doc.setFontSize(10);
                    doc.setTextColor(0, 0, 0);
                    
                    const contentText = this._stripHTML(cardContent.textContent);
                    const lines = doc.splitTextToSize(contentText, contentWidth);
                    
                    lines.forEach(line => {
                        checkPageBreak();
                        doc.text(line, margin, yPosition);
                        yPosition += lineHeight;
                    });
                    
                    yPosition += 5; // 카드 간 여백
                }
            });
            
            // 기본 정보 추가 (맨 마지막에)
            checkPageBreak(20);
            yPosition += 10;
            doc.setFontSize(11);
            doc.setTextColor(44, 62, 137);
            doc.text('기본 정보', margin, yPosition);
            yPosition += 8;
            
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            
            if (analysisData.type === 'personal') {
                doc.text(`이름: ${analysisData.name}`, margin, yPosition);
                yPosition += 6;
                doc.text(`성별: ${analysisData.gender === 'male' ? '남성' : '여성'}`, margin, yPosition);
                yPosition += 6;
                doc.text(`음력: ${analysisData.month}월 ${analysisData.day}일`, margin, yPosition);
                yPosition += 6;
                doc.text(`나라: ${analysisData.country}`, margin, yPosition);
                yPosition += 6;
                doc.text(`동물: ${analysisData.animal}`, margin, yPosition);
            } else if (analysisData.type === 'couple') {
                const p1 = analysisData.person1 || {};
                const p2 = analysisData.person2 || {};
                
                doc.text(`첫 번째: ${p1.name} (${p1.gender === 'male' ? '남성' : '여성'})`, margin, yPosition);
                yPosition += 6;
                doc.text(`  - 음력: ${p1.month}월 ${p1.day}일, ${p1.country}, ${p1.animal}`, margin, yPosition);
                yPosition += 8;
                
                doc.text(`두 번째: ${p2.name} (${p2.gender === 'male' ? '남성' : '여성'})`, margin, yPosition);
                yPosition += 6;
                doc.text(`  - 음력: ${p2.month}월 ${p2.day}일, ${p2.country}, ${p2.animal}`, margin, yPosition);
            }
            
            // 푸터 (모든 페이지에)
            const totalPages = doc.internal.pages.length - 1;
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                const footerY = pageHeight - 10;
                doc.setFontSize(7);
                doc.setTextColor(150, 150, 150);
                doc.text('© 2025 한국아니모라협회', margin, footerY);
                doc.text(`${i} / ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });
                doc.text('https://yunhyeonjun.github.io/korean-animora-association', pageWidth - margin, footerY, { align: 'right' });
            }
            
            // 파일명 생성
            const fileName = `아니모라_분석결과_${analysisData.name || '결과'}_${new Date().getTime()}.pdf`;
            
            // 다운로드
            doc.save(fileName);
            
            return true;
        } catch (error) {
            alert('PDF 다운로드 중 오류가 발생했습니다.\n오류: ' + error.message);
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
