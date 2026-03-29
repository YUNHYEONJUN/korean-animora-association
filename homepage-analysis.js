/**
 * 홈페이지 원스텝 분석 - 양력 입력 → 음력 변환 → 즉시 결과
 */

function runHomeAnalysis() {
    const yearEl = document.getElementById('solar-year');
    const monthEl = document.getElementById('solar-month');
    const dayEl = document.getElementById('solar-day');
    const nameEl = document.getElementById('analyzer-name');
    const resultDiv = document.getElementById('home-result');

    if (!resultDiv) return;

    const year = AnimoraSanitizer.sanitizeNumber(yearEl ? yearEl.value : '');
    const month = AnimoraSanitizer.sanitizeNumber(monthEl ? monthEl.value : '');
    const day = AnimoraSanitizer.sanitizeNumber(dayEl ? dayEl.value : '');
    const rawName = nameEl ? nameEl.value.trim() : '';
    const name = AnimoraSanitizer.escapeHTML(rawName) || '방문자';

    // 입력 검증
    if (!year || !month || !day) {
        resultDiv.innerHTML = '<p class="result-error">년, 월, 일을 모두 입력해주세요.</p>';
        resultDiv.style.display = 'block';
        return;
    }

    if (year < 1900 || year > 2100) {
        resultDiv.innerHTML = '<p class="result-error">1900년~2100년 사이의 날짜만 입력 가능합니다.</p>';
        resultDiv.style.display = 'block';
        return;
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) {
        resultDiv.innerHTML = '<p class="result-error">올바른 월(1~12), 일(1~31)을 입력해주세요.</p>';
        resultDiv.style.display = 'block';
        return;
    }

    try {
        // 양력→음력 변환
        const lunar = solarToLunar(year, month, day);

        if (lunar.error) {
            resultDiv.innerHTML = '<p class="result-error">' + AnimoraSanitizer.sanitizeError(lunar.error) + '</p>';
            resultDiv.style.display = 'block';
            return;
        }

        const lunarMonth = lunar.month;
        const lunarDay = lunar.day;
        const leapText = lunar.isLeapMonth ? ' (윤달)' : '';

        // 아니모라 데이터 조회
        const country = ANIMORA_COUNTRIES[lunarMonth];
        const animal = ANIMORA_ANIMALS[lunarDay];

        if (!country || !animal) {
            resultDiv.innerHTML = '<p class="result-error">해당 음력 날짜에 대한 아니모라 정보를 찾을 수 없습니다.</p>';
            resultDiv.style.display = 'block';
            return;
        }

        // 분석 결과 생성 (name은 이미 이스케이프됨)
        const analysisHTML = generatePersonalAnalysisHTML(name, lunarMonth, lunarDay);

        resultDiv.innerHTML = `
            <div class="home-result-header">
                <div class="lunar-info">
                    <span class="lunar-label">양력 ${year}. ${month}. ${day}</span>
                    <span class="lunar-arrow">→</span>
                    <span class="lunar-label">음력 ${lunar.year}. ${lunarMonth}. ${lunarDay}${leapText}</span>
                </div>
            </div>
            ${analysisHTML}
            <div class="home-result-actions">
                <a href="analysis.html" class="cta-btn cta-btn-secondary">커플 궁합 분석하러 가기</a>
                <a href="analysis.html" class="cta-btn cta-btn-secondary">AI 상세 분석 받기</a>
            </div>
        `;
        resultDiv.style.display = 'block';

        // 결과로 스크롤
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        resultDiv.innerHTML = '<p class="result-error">변환 중 오류가 발생했습니다: ' + AnimoraSanitizer.sanitizeError(error.message || '알 수 없는 오류') + '</p>';
        resultDiv.style.display = 'block';
    }
}

// 12 나라 카드 토글 (키보드 접근성 지원)
function toggleCountry(card) {
    card.classList.toggle('expanded');
    const toggle = card.querySelector('.country-toggle');
    if (toggle) toggle.textContent = card.classList.contains('expanded') ? '−' : '+';
}

// SVG 아이콘 삽입
function initAnimalIcons() {
    if (typeof ANIMORA_ICONS === 'undefined') return;
    var icons = document.querySelectorAll('.country-icon[data-icon]');
    icons.forEach(function(el) {
        var key = el.getAttribute('data-icon');
        if (ANIMORA_ICONS[key]) {
            el.innerHTML = ANIMORA_ICONS[key];
        }
    });
}

// Enter 키로 분석 실행 + 키보드 접근성 초기화
document.addEventListener('DOMContentLoaded', function() {
    initAnimalIcons();

    // 분석 입력 필드 Enter 키 핸들러
    var inputs = ['solar-year', 'solar-month', 'solar-day', 'analyzer-name'];
    inputs.forEach(function(id) {
        var input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    runHomeAnalysis();
                }
            });
        }
    });

    // 나라 카드 키보드 접근성 (Enter/Space)
    var countryCards = document.querySelectorAll('.country-compact-card');
    countryCards.forEach(function(card) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCountry(card);
                card.setAttribute('aria-expanded', card.classList.contains('expanded'));
            }
        });
        // 클릭 시에도 aria-expanded 업데이트
        card.addEventListener('click', function() {
            card.setAttribute('aria-expanded', card.classList.contains('expanded'));
        });
    });
});
