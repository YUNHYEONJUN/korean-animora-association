/**
 * 홈페이지 원스텝 분석 - 양력 입력 → 음력 변환 → 즉시 결과
 */

function runHomeAnalysis() {
    const year = parseInt(document.getElementById('solar-year').value);
    const month = parseInt(document.getElementById('solar-month').value);
    const day = parseInt(document.getElementById('solar-day').value);
    const name = document.getElementById('analyzer-name').value.trim() || '방문자';
    const resultDiv = document.getElementById('home-result');

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
            resultDiv.innerHTML = '<p class="result-error">' + lunar.error + '</p>';
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

        // 분석 결과 생성
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
        resultDiv.innerHTML = '<p class="result-error">변환 중 오류가 발생했습니다: ' + error.message + '</p>';
        resultDiv.style.display = 'block';
    }
}

// 12 나라 카드 토글
function toggleCountry(card) {
    card.classList.toggle('expanded');
    const toggle = card.querySelector('.country-toggle');
    toggle.textContent = card.classList.contains('expanded') ? '−' : '+';
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

// Enter 키로 분석 실행
document.addEventListener('DOMContentLoaded', function() {
    initAnimalIcons();
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
});
