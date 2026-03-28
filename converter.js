// 아니모라 동물 및 나라 데이터
const countries = [
    '', // 0은 사용 안함
    '호랑이 나라', '토끼 나라', '용 나라', '뱀 나라', 
    '말 나라', '양 나라', '원숭이 나라', '닭 나라', 
    '개 나라', '돼지 나라', '쥐 나라', '소 나라'
];

const animals = {
    1: { 11: '호랑이', 1: '호랑이', 21: '고양이' },
    2: { 12: '오소리', 2: '야생토끼', 22: '집토끼' },
    3: { 13: '용', 3: '이무기', 23: '도롱뇽' },
    4: { 14: '구렁이', 4: '아나콘다', 24: '꽃뱀' },
    5: { 15: '경주마', 5: '야생마', 25: '명품마' },
    6: { 16: '산양', 6: '양', 26: '염소' },
    7: { 17: '고릴라', 7: '오랑우탄', 27: '침팬지' },
    8: { 18: '수탉', 8: '장미계', 28: '암탉' },
    9: { 19: '늑대', 9: '들개', 29: '강아지' },
    10: { 20: '수돼지', 10: '멧돼지', 30: '암돼지' }
};

function getAnimal(day) {
    const dayMod = day % 10;
    const dayKey = dayMod === 0 ? 10 : dayMod;
    
    if (animals[dayKey]) {
        return animals[dayKey][day] || animals[dayKey][dayKey];
    }
    return '알 수 없음';
}

function getCountry(month) {
    if (month >= 1 && month <= 12) {
        return countries[month];
    }
    return '알 수 없음';
}

function convertDate() {
    const year = parseInt(document.getElementById('solar-year').value);
    const month = parseInt(document.getElementById('solar-month').value);
    const day = parseInt(document.getElementById('solar-day').value);
    
    const resultDiv = document.getElementById('lunar-result');
    const animoraInfo = document.getElementById('animora-info');
    
    // 입력 검증
    if (!year || !month || !day) {
        resultDiv.innerHTML = '<p class="result-error">⚠️ 년, 월, 일을 모두 입력해주세요.</p>';
        animoraInfo.style.display = 'none';
        return;
    }
    
    if (year < 1900 || year > 2100) {
        resultDiv.innerHTML = '<p class="result-error">⚠️ 1900년~2100년 사이의 날짜만 입력 가능합니다.</p>';
        animoraInfo.style.display = 'none';
        return;
    }
    
    if (month < 1 || month > 12) {
        resultDiv.innerHTML = '<p class="result-error">⚠️ 월은 1~12 사이의 값을 입력해주세요.</p>';
        animoraInfo.style.display = 'none';
        return;
    }
    
    if (day < 1 || day > 31) {
        resultDiv.innerHTML = '<p class="result-error">⚠️ 일은 1~31 사이의 값을 입력해주세요.</p>';
        animoraInfo.style.display = 'none';
        return;
    }
    
    // 변환 실행
    try {
        const lunar = solarToLunar(year, month, day);
        
        if (lunar.error) {
            resultDiv.innerHTML = `<p class="result-error">⚠️ ${lunar.error}</p>`;
            animoraInfo.style.display = 'none';
            return;
        }
        
        // 결과 표시
        const leapText = lunar.isLeapMonth ? ' <span class="leap-badge">(윤달)</span>' : '';
        resultDiv.innerHTML = `
            <div class="result-success">
                <div class="result-icon">🌙</div>
                <div class="result-dates">
                    <p class="solar-date">양력: ${year}년 ${month}월 ${day}일</p>
                    <p class="lunar-date">음력: ${lunar.year}년 ${lunar.month}월 ${lunar.day}일${leapText}</p>
                </div>
            </div>
        `;
        
        // 아니모라 정보 표시
        const country = getCountry(lunar.month);
        const animal = getAnimal(lunar.day);
        
        document.getElementById('animora-country').textContent = country;
        document.getElementById('animora-animal').textContent = animal;
        
        // 아니모라 분석 버튼 추가
        const buttons = `
            <div class="animora-buttons">
                <a href="analysis.html" class="animora-analysis-btn">
                   📊 성격 분석 & 궁합 보기
                </a>
            </div>
        `;
        
        // 버튼이 이미 있으면 제거
        const existingBtns = animoraInfo.querySelector('.animora-buttons');
        if (existingBtns) {
            existingBtns.remove();
        }
        
        animoraInfo.insertAdjacentHTML('beforeend', buttons);
        
        animoraInfo.style.display = 'block';
        
        // 애니메이션 효과
        animoraInfo.style.opacity = '0';
        animoraInfo.style.transform = 'translateY(20px)';
        setTimeout(() => {
            animoraInfo.style.transition = 'all 0.5s ease';
            animoraInfo.style.opacity = '1';
            animoraInfo.style.transform = 'translateY(0)';
        }, 100);
        
    } catch (error) {
        const errorP = document.createElement('p');
        errorP.className = 'result-error';
        errorP.textContent = '⚠️ 변환 중 오류가 발생했습니다: ' + error.message;
        resultDiv.innerHTML = '';
        resultDiv.appendChild(errorP);
        animoraInfo.style.display = 'none';
    }
}

// Enter 키로 변환 실행
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['solar-year', 'solar-month', 'solar-day'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    convertDate();
                }
            });
        }
    });
});
