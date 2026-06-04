/**
 * 프리미엄 기능 관리
 * PDF 다운로드, 맞춤형 질문, 소셜 공유 등
 */

class PremiumFeatures {
    constructor() {
        this.config = ANIMORA_CONFIG;
    }

    /**
     * PDF 다운로드 — html2canvas + jsPDF 방식 (한글 완전 지원)
     * DOM을 그대로 이미지로 캡처하므로 폰트/이모지 모두 정상 출력
     */
    async downloadPDF(analysisData, resultHTML) {
        const btn = document.querySelector('.pdf-btn');
        const originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '⏳ PDF 생성 중...'; btn.disabled = true; }

        try {
            // 라이브러리 로드 (없으면 동적 로드)
            if (typeof html2canvas === 'undefined') await this._loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', 'sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==');
            if (typeof jspdf === 'undefined') await this._loadJsPDF();

            const { jsPDF } = window.jspdf;

            // result-content 요소를 캡처
            const target = document.getElementById('result-content');
            if (!target) throw new Error('결과 영역을 찾을 수 없습니다.');

            const canvas = await html2canvas(target, {
                scale: 2,        // 고해상도 (레티나 대응)
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentW = pageW - margin * 2;
            const imgH = (canvas.height / canvas.width) * contentW;

            let y = margin;
            let remainH = imgH;

            // 여러 페이지에 걸쳐 출력
            while (remainH > 0) {
                const printH = Math.min(pageH - margin * 2, remainH);
                const srcY = (imgH - remainH) / imgH * canvas.height;
                const srcH = printH / imgH * canvas.height;

                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                pageCanvas.height = srcH;
                pageCanvas.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
                pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, y, contentW, printH);

                remainH -= printH;
                if (remainH > 0) { pdf.addPage(); y = margin; }
            }

            // 푸터 (마지막 페이지)
            pdf.setFontSize(7);
            pdf.setTextColor(150);
            pdf.text('© 2025 한국아니모라협회  |  animora.kr', margin, pageH - 5);

            const safeName = (analysisData.name || '결과').replace(/[/\\?%*:|"<>]/g, '_');
            pdf.save(`아니모라_분석결과_${safeName}_${Date.now()}.pdf`);
            return true;

        } catch (error) {
            alert('PDF 생성 중 오류가 발생했습니다.\n' + (error.message || ''));
            return false;
        } finally {
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }

    // 구버전 jsPDF 방식 (텍스트 기반, 한글 미지원) — 내부 폴백용으로 보존
    async _downloadPDF_legacy(analysisData, resultHTML) {
        if (typeof jspdf === 'undefined') {
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
            
            // HTML에서 텍스트 추출 (AI 분석 결과 포함) — DOMParser로 안전 파싱
            const parser = new DOMParser();
            const tempDoc = parser.parseFromString(resultHTML, 'text/html');
            const tempDiv = tempDoc.body;
            
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
     * 외부 스크립트 동적 로드 (캐시 방지 없음)
     */
    _loadScript(src, integrity) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const s = document.createElement('script');
            s.src = src;
            if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
            s.onload = resolve;
            s.onerror = () => reject(new Error(`스크립트 로드 실패: ${src}`));
            document.head.appendChild(s);
        });
    }

    /**
     * jsPDF 라이브러리 동적 로드
     */
    _loadJsPDF() {
        return this._loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
            'sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNTlrdUmTzrDgektczlKNRRhy5X5AAOnx5S09ydFYWWNSfcEqDTTHLQQ=='
        );
    }
    

    
    /**
     * HTML 태그 제거
     */
    _stripHTML(html) {
        // 안전하게 태그만 제거 (innerHTML 파싱 대신 정규식 사용)
        if (typeof html !== 'string') return '';
        return html.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');
    }
    
    /**
     * 분석 결과 딥링크 URL 생성
     * 공유받은 사람이 URL 열면 동일 분석이 자동 실행됨
     */
    buildShareUrl(data) {
        const base = window.location.origin + window.location.pathname;
        const p = new URLSearchParams();
        if (data.type === 'personal') {
            p.set('t', 'p');
            p.set('m', data.month);
            p.set('d', data.day);
            p.set('g', data.gender === 'male' ? 'm' : 'f');
            if (data.name) p.set('n', data.name);
        } else if (data.type === 'couple') {
            p.set('t', 'c');
            const p1 = data.person1 || {};
            const p2 = data.person2 || {};
            p.set('m1', p1.month); p.set('d1', p1.day);
            p.set('g1', p1.gender === 'male' ? 'm' : 'f');
            if (p1.name) p.set('n1', p1.name);
            p.set('m2', p2.month); p.set('d2', p2.day);
            p.set('g2', p2.gender === 'male' ? 'm' : 'f');
            if (p2.name) p.set('n2', p2.name);
        }
        return `${base}?${p.toString()}`;
    }

    /**
     * 소셜 공유
     * @param {String} platform - 'native', 'kakao', 'facebook', 'twitter', 'copy'
     * @param {Object} data - 공유 데이터
     */
    share(platform, data) {
        const shareUrl = this.buildShareUrl(data);
        const name = data.name || (data.person1 && data.person1.name) || '';
        const country = data.country || (data.person1 && data.person1.country) || '';
        const animal = data.animal || (data.person1 && data.person1.animal) || '';
        const title = '아니모라 성격 분석';
        const text = name
            ? `${name}님의 아니모라: ${country} × ${animal} — 내 유형도 확인해보세요!`
            : `아니모라로 내 유형을 확인해보세요! (${country} × ${animal})`;

        switch (platform) {
            case 'native':
                this._shareNative(shareUrl, title, text);
                break;
            case 'kakao':
                this._shareKakao(shareUrl, title, text);
                break;
            case 'facebook':
                this._shareFacebook(shareUrl);
                break;
            case 'twitter':
                this._shareTwitter(shareUrl, text);
                break;
            case 'copy':
                this._copyLink(shareUrl);
                break;
            default:
                this._copyLink(shareUrl);
        }
    }

    /**
     * Web Share API (모바일 네이티브 공유)
     */
    async _shareNative(url, title, text) {
        if (!navigator.share) {
            this._copyLink(url);
            return;
        }
        try {
            await navigator.share({ title, text, url });
        } catch (err) {
            if (err.name !== 'AbortError') this._copyLink(url);
        }
    }

    /**
     * 카카오톡 공유 — SDK 있으면 피드, 없으면 Web Share 또는 링크 복사
     */
    _shareKakao(url, title, description) {
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized && Kakao.isInitialized()) {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title,
                    description,
                    imageUrl: 'https://yunhyeonjun.github.io/korean-animora-association/og-image.png',
                    link: { mobileWebUrl: url, webUrl: url }
                },
                buttons: [{ title: '결과 보기', link: { mobileWebUrl: url, webUrl: url } }]
            });
            return;
        }
        // SDK 미로드: Web Share → 링크 복사 순 fallback
        if (navigator.share) {
            navigator.share({ title, text: description, url }).catch(() => this._copyLink(url));
        } else {
            this._copyLink(url);
        }
    }

    /**
     * 페이스북 공유
     */
    _shareFacebook(url) {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank', 'width=600,height=400,noopener,noreferrer'
        );
    }

    /**
     * 트위터/X 공유
     */
    _shareTwitter(url, text) {
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            '_blank', 'width=600,height=400,noopener,noreferrer'
        );
    }

    /**
     * 링크 복사
     */
    _copyLink(url) {
        const done = () => {
            // alert 대신 토스트 메시지
            const toast = document.createElement('div');
            toast.textContent = '링크가 복사되었습니다! 📋';
            toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#2c3e89;color:white;padding:12px 24px;border-radius:24px;font-weight:600;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,.2);';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        };
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(done).catch(() => this._fallbackCopyLink(url, done));
        } else {
            this._fallbackCopyLink(url, done);
        }
    }
    
    /**
     * 링크 복사 폴백
     */
    _fallbackCopyLink(url, onSuccess) {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            if (onSuccess) onSuccess();
        } catch {
            prompt('아래 링크를 직접 복사해주세요:', url);
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
                        <button class="btn-view" onclick="viewHistory('${(item.id || '').replace(/'/g, "\\'")}')">보기</button>
                        <button class="btn-delete" onclick="deleteHistory('${(item.id || '').replace(/'/g, "\\'")}')">삭제</button>
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
        const data = item.data || {};

        if (item.type === 'personal') {
            return `${data.name || '이름없음'} - ${data.month || '?'}월 ${data.day || '?'}일`;
        } else if (item.type === 'couple') {
            const p1 = data.person1 || {};
            const p2 = data.person2 || {};
            return `${p1.name || '사람1'} & ${p2.name || '사람2'}`;
        } else if (item.type === 'family') {
            const members = data.members || [];
            return `가족 ${members.length}명 분석`;
        }

        return '분석 결과';
    }
}

// 전역 인스턴스
const premiumFeatures = new PremiumFeatures();

// 전역 함수 (HTML에서 호출)
function viewHistory(id) {
    const item = storageService.getAnalysisById(id);
    if (!item || !item.data) {
        alert('분석 데이터를 불러올 수 없습니다.');
        return;
    }

    const data = item.data;
    let html;

    if (data.type === 'personal') {
        html = generatePersonalAnalysis(data.name, data.month, data.day);
    } else if (data.type === 'couple') {
        html = generateCoupleAnalysis(data.person1, data.person2);
    } else if (data.type === 'family') {
        html = generateFamilyAnalysis(data.members);
    }

    if (!html) return;

    closeHistoryModal();
    switchAnalysisType(data.type);
    displayResult(html, data);
    setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function deleteHistory(id) {
    if (confirm('이 분석을 삭제하시겠습니까?')) {
        storageService.deleteAnalysis(id);
        // 히스토리 UI 갱신
        const historyContainer = document.querySelector('.history-list')?.parentElement;
        if (historyContainer) {
            historyContainer.innerHTML = premiumFeatures.generateHistoryHTML();
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumFeatures;
}
