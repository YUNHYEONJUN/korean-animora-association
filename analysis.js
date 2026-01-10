/**
 * 아니모라 성격 분석 & 궁합 해석 JavaScript
 */

// 12개 나라 데이터
const countries = {
    1: { name: '호랑이 나라', emoji: '🐯', keyword: '용맹과 리더십' },
    2: { name: '토끼 나라', emoji: '🐰', keyword: '온화와 섬세함' },
    3: { name: '용 나라', emoji: '🐉', keyword: '카리스마와 야망' },
    4: { name: '뱀 나라', emoji: '🐍', keyword: '지혜와 신중함' },
    5: { name: '말 나라', emoji: '🐴', keyword: '열정과 자유' },
    6: { name: '양 나라', emoji: '🐑', keyword: '평화와 조화' },
    7: { name: '원숭이 나라', emoji: '🐵', keyword: '영리함과 재치' },
    8: { name: '닭 나라', emoji: '🐓', keyword: '성실과 정확성' },
    9: { name: '개 나라', emoji: '🐕', keyword: '충성과 의리' },
    10: { name: '돼지 나라', emoji: '🐷', keyword: '관대함과 풍요' },
    11: { name: '쥐 나라', emoji: '🐭', keyword: '민첩함과 적응력' },
    12: { name: '소 나라', emoji: '🐂', keyword: '인내와 성실' }
};

// 30개 동물 데이터
const animals = {
    1: { name: '독수리', emoji: '🦅', type: '상' },
    2: { name: '매', emoji: '🦅', type: '중' },
    3: { name: '까마귀', emoji: '🦅', type: '하' },
    4: { name: '표범', emoji: '🐆', type: '상' },
    5: { name: '재규어', emoji: '🐆', type: '중' },
    6: { name: '살쾡이', emoji: '🐆', type: '하' },
    7: { name: '사자', emoji: '🦁', type: '상' },
    8: { name: '호랑이', emoji: '🐯', type: '중' },
    9: { name: '치타', emoji: '🐯', type: '하' },
    10: { name: '코끼리', emoji: '🐘', type: '상' },
    11: { name: '하마', emoji: '🦛', type: '중' },
    12: { name: '코뿔소', emoji: '🦏', type: '하' },
    13: { name: '독사', emoji: '🐍', type: '상' },
    14: { name: '아나콘다', emoji: '🐍', type: '중' },
    15: { name: '뱀', emoji: '🐍', type: '하' },
    16: { name: '늑대', emoji: '🐺', type: '상' },
    17: { name: '여우', emoji: '🦊', type: '중' },
    18: { name: '승냥이', emoji: '🐺', type: '하' },
    19: { name: '곰', emoji: '🐻', type: '상' },
    20: { name: '판다', emoji: '🐼', type: '중' },
    21: { name: '고양이', emoji: '🐱', type: '하' },
    22: { name: '사슴', emoji: '🦌', type: '상' },
    23: { name: '노루', emoji: '🦌', type: '중' },
    24: { name: '토끼', emoji: '🐰', type: '하' },
    25: { name: '원숭이', emoji: '🐵', type: '상' },
    26: { name: '침팬지', emoji: '🦍', type: '중' },
    27: { name: '다람쥐', emoji: '🐿️', type: '하' },
    28: { name: '금계', emoji: '🐓', type: '상' },
    29: { name: '은계', emoji: '🐓', type: '중' },
    30: { name: '동계', emoji: '🐓', type: '하' }
};

// 나라별 환경 특성
const countryTraits = {
    1: {
        environment: '호랑이 나라에서 자란 당신은 강인하고 리더십 있는 환경에서 성장했습니다.',
        characteristics: ['강한 의지력', '리더십과 주도성', '용맹함과 결단력', '정의감'],
        challenges: '때로는 너무 강한 자존심이 관계에서 갈등을 만들 수 있습니다.'
    },
    2: {
        environment: '토끼 나라에서 자란 당신은 온화하고 섬세한 환경에서 성장했습니다.',
        characteristics: ['친절하고 배려심 많음', '예민한 감수성', '평화를 추구', '대인관계 원만'],
        challenges: '지나친 눈치로 인해 스스로를 희생할 수 있습니다.'
    },
    3: {
        environment: '용 나라에서 자란 당신은 카리스마 넘치고 야망이 큰 환경에서 성장했습니다.',
        characteristics: ['강한 카리스마', '큰 꿈과 비전', '자신감', '영향력'],
        challenges: '높은 이상으로 인해 현실과의 괴리를 경험할 수 있습니다.'
    },
    4: {
        environment: '뱀 나라에서 자란 당신은 지혜롭고 신중한 환경에서 성장했습니다.',
        characteristics: ['깊은 통찰력', '신중한 판단', '전략적 사고', '집중력'],
        challenges: '지나친 신중함이 기회를 놓치게 할 수 있습니다.'
    },
    5: {
        environment: '말 나라에서 자란 당신은 열정적이고 자유로운 환경에서 성장했습니다.',
        characteristics: ['자유로운 영혼', '열정과 활력', '모험심', '낙관적'],
        challenges: '변덕스러움과 책임감 부족으로 보일 수 있습니다.'
    },
    6: {
        environment: '양 나라에서 자란 당신은 평화롭고 조화로운 환경에서 성장했습니다.',
        characteristics: ['평화주의', '예술적 감각', '공감 능력', '온순함'],
        challenges: '우유부단함과 의존성이 문제가 될 수 있습니다.'
    },
    7: {
        environment: '원숭이 나라에서 자란 당신은 영리하고 재치 있는 환경에서 성장했습니다.',
        characteristics: ['높은 지능', '유머 감각', '적응력', '창의성'],
        challenges: '장난기와 불안정함이 신뢰를 해칠 수 있습니다.'
    },
    8: {
        environment: '닭 나라에서 자란 당신은 성실하고 정확한 환경에서 성장했습니다.',
        characteristics: ['근면성실', '완벽주의', '정확성', '책임감'],
        challenges: '지나친 완벽주의가 스트레스를 유발할 수 있습니다.'
    },
    9: {
        environment: '개 나라에서 자란 당신은 충성스럽고 의리 있는 환경에서 성장했습니다.',
        characteristics: ['충성심', '의리', '보호본능', '정직함'],
        challenges: '의심과 경계심이 새로운 관계를 어렵게 할 수 있습니다.'
    },
    10: {
        environment: '돼지 나라에서 자란 당신은 관대하고 풍요로운 환경에서 성장했습니다.',
        characteristics: ['관대함', '낙천적', '풍부한 감정', '사교성'],
        challenges: '지나친 낙관주의가 현실 인식을 흐릴 수 있습니다.'
    },
    11: {
        environment: '쥐 나라에서 자란 당신은 민첩하고 적응력 있는 환경에서 성장했습니다.',
        characteristics: ['빠른 적응력', '기회 포착', '영리함', '생존력'],
        challenges: '이기심과 계산적 태도가 관계를 해칠 수 있습니다.'
    },
    12: {
        environment: '소 나라에서 자란 당신은 인내심 있고 성실한 환경에서 성장했습니다.',
        characteristics: ['인내심', '끈기', '안정성', '신뢰성'],
        challenges: '고집과 변화에 대한 저항이 발전을 막을 수 있습니다.'
    }
};

// 동물별 본성 특성
const animalTraits = {
    1: { nature: '독수리', desc: '높은 곳을 향해 비상하는 당신은 큰 꿈과 비전을 가지고 있습니다.', keywords: ['비전', '자유', '독립성'] },
    4: { nature: '표범', desc: '우아하고 강력한 당신은 목표를 향해 조용히 그러나 확실하게 나아갑니다.', keywords: ['우아함', '집중력', '강인함'] },
    7: { nature: '사자', desc: '왕의 기질을 타고난 당신은 자연스러운 리더십을 발휘합니다.', keywords: ['리더십', '카리스마', '자신감'] },
    10: { nature: '코끼리', desc: '지혜롭고 온화한 당신은 강력하지만 공격적이지 않습니다.', keywords: ['지혜', '온화함', '힘'] },
    13: { nature: '독사', desc: '신중하고 전략적인 당신은 때를 기다릴 줄 압니다.', keywords: ['전략', '신중함', '집중력'] },
    16: { nature: '늑대', desc: '무리를 이끄는 당신은 충성심과 리더십을 겸비했습니다.', keywords: ['충성', '리더십', '협력'] },
    19: { nature: '곰', desc: '강인하고 보호본능이 강한 당신은 가족을 지킵니다.', keywords: ['보호본능', '강인함', '온정'] },
    21: { nature: '고양이', desc: '독립적이고 자유로운 당신은 자신만의 길을 갑니다.', keywords: ['독립성', '자유', '감각적'] },
    22: { nature: '사슴', desc: '우아하고 민첩한 당신은 평화를 사랑합니다.', keywords: ['우아함', '평화', '민첩성'] },
    25: { nature: '원숭이', desc: '영리하고 재치 있는 당신은 빠르게 배우고 적응합니다.', keywords: ['지능', '재치', '적응력'] },
    28: { nature: '금계', desc: '화려하고 당당한 당신은 주목받는 것을 즐깁니다.', keywords: ['화려함', '자신감', '표현력'] }
};

// DOM 요소
let currentAnalysisType = 'personal';

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initTypeTabs();
    initForms();
    populateDaySelects();
});

// 탭 초기화
function initTypeTabs() {
    const typeBtns = document.querySelectorAll('.type-btn');
    
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            switchAnalysisType(type);
        });
    });
}

// 분석 타입 전환
function switchAnalysisType(type) {
    currentAnalysisType = type;
    
    // 버튼 활성화
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // 폼 전환
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${type}-form`).classList.add('active');
    
    // 결과 숨기기
    document.getElementById('result-section').style.display = 'none';
}

// 폼 초기화
function initForms() {
    // 개인 분석 폼
    document.getElementById('personalForm').addEventListener('submit', handlePersonalSubmit);
    
    // 커플 분석 폼
    document.getElementById('coupleForm').addEventListener('submit', handleCoupleSubmit);
    
    // 가족 분석 폼
    document.getElementById('familyForm').addEventListener('submit', handleFamilySubmit);
    document.getElementById('add-member-btn').addEventListener('click', addFamilyMember);
    
    // 초기 가족 구성원 2명 추가
    addFamilyMember();
    addFamilyMember();
}

// 일(day) 선택 옵션 채우기
function populateDaySelects() {
    const daySelects = document.querySelectorAll('select[id$="-day"]');
    
    daySelects.forEach(select => {
        for (let i = 1; i <= 30; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}일 (${animals[i].name} ${animals[i].emoji})`;
            select.appendChild(option);
        }
    });
}

// 가족 구성원 추가
let memberCount = 0;
function addFamilyMember() {
    memberCount++;
    const container = document.getElementById('family-members');
    
    const memberCard = document.createElement('div');
    memberCard.className = 'member-card';
    memberCard.dataset.member = memberCount;
    
    memberCard.innerHTML = `
        <button type="button" class="remove-member-btn" onclick="removeFamilyMember(${memberCount})">×</button>
        <h4>가족 구성원 ${memberCount}</h4>
        
        <div class="form-group">
            <label for="family-name-${memberCount}">호칭/닉네임 (예: 엄마, 첫째 딸)</label>
            <input type="text" id="family-name-${memberCount}" placeholder="예: 엄마, 씩씩한딸" required>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="family-month-${memberCount}">음력 월</label>
                <select id="family-month-${memberCount}" required>
                    <option value="">선택</option>
                    ${Object.entries(countries).map(([key, value]) => 
                        `<option value="${key}">${key}월 (${value.name})</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="family-day-${memberCount}">음력 일</label>
                <select id="family-day-${memberCount}" required>
                    <option value="">선택</option>
                    ${Object.entries(animals).map(([key, value]) => 
                        `<option value="${key}">${key}일 (${value.name} ${value.emoji})</option>`
                    ).join('')}
                </select>
            </div>
        </div>
    `;
    
    container.appendChild(memberCard);
}

// 가족 구성원 제거
function removeFamilyMember(memberId) {
    const memberCard = document.querySelector(`.member-card[data-member="${memberId}"]`);
    if (memberCard) {
        memberCard.remove();
    }
}

// 개인 분석 제출
function handlePersonalSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('personal-name').value;
    const month = parseInt(document.getElementById('personal-month').value);
    const day = parseInt(document.getElementById('personal-day').value);
    
    const result = generatePersonalAnalysis(name, month, day);
    displayResult(result);
}

// 커플 분석 제출
function handleCoupleSubmit(e) {
    e.preventDefault();
    
    const person1 = {
        name: document.getElementById('couple-name1').value,
        month: parseInt(document.getElementById('couple-month1').value),
        day: parseInt(document.getElementById('couple-day1').value)
    };
    
    const person2 = {
        name: document.getElementById('couple-name2').value,
        month: parseInt(document.getElementById('couple-month2').value),
        day: parseInt(document.getElementById('couple-day2').value)
    };
    
    const result = generateCoupleAnalysis(person1, person2);
    displayResult(result);
}

// 가족 분석 제출
function handleFamilySubmit(e) {
    e.preventDefault();
    
    const members = [];
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        const memberId = card.dataset.member;
        const name = document.getElementById(`family-name-${memberId}`).value;
        const month = parseInt(document.getElementById(`family-month-${memberId}`).value);
        const day = parseInt(document.getElementById(`family-day-${memberId}`).value);
        
        members.push({ name, month, day });
    });
    
    const result = generateFamilyAnalysis(members);
    displayResult(result);
}

// 개인 분석 생성
function generatePersonalAnalysis(name, month, day) {
    const country = countries[month];
    const animal = animals[day];
    const countryTrait = countryTraits[month];
    const animalTrait = animalTraits[day] || { 
        nature: animal.name, 
        desc: `${animal.emoji} ${animal.name}의 본성을 가진 당신은 독특한 매력을 가지고 있습니다.`,
        keywords: ['독특함', '개성', '매력']
    };
    
    return `
        <div class="result-card">
            <div class="result-header">
                <h2>✨ 개인 성격 분석 결과</h2>
                <p class="subtitle">${name}님의 아니모라 해석</p>
            </div>
            
            <div class="profile-card">
                <div class="profile-name">${name}</div>
                <div class="profile-birth">음력 ${month}월 ${day}일생</div>
                <div class="animora-type">
                    <h3>아니모라 유형</h3>
                    <div class="animora-badge">${country.emoji} ${country.name}</div>
                    <div class="animora-badge">${animal.emoji} ${animal.name}</div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>🌍 자라난 환경 (${month}월 - ${country.name})</h3>
                <div class="analysis-content">
                    <p><strong>${countryTrait.environment}</strong></p>
                    <ul class="analysis-list">
                        ${countryTrait.characteristics.map(c => `<li>✓ ${c}</li>`).join('')}
                    </ul>
                    <p style="color: #e84118; font-weight: 600;">⚠️ 주의점: ${countryTrait.challenges}</p>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>🦁 내면의 본성 (${day}일 - ${animal.name})</h3>
                <div class="analysis-content">
                    <p><strong>${animalTrait.desc}</strong></p>
                    <ul class="analysis-list">
                        ${animalTrait.keywords.map(k => `<li>✓ ${k}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>💡 종합 해석</h3>
                <div class="analysis-content">
                    <p>${name}님은 <strong>${country.name}</strong>의 환경(30%)과 <strong>${animal.name}</strong>의 본성(40%)이 조화를 이루어 
                    독특한 성격을 형성했습니다. ${country.keyword}의 환경에서 자란 당신은 ${animalTrait.keywords[0]}와(과) ${animalTrait.keywords[1]}을(를) 
                    바탕으로 자신만의 길을 개척해나갑니다.</p>
                    
                    <p>이러한 조합은 당신이 사회에서 ${countryTrait.characteristics[0]}면서도 ${animalTrait.keywords[0]} 특성을 발휘할 수 있게 합니다. 
                    다만, ${countryTrait.challenges.toLowerCase()}</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="https://chatgpt.com/g/g-6805285f91a08191927f5e111e1f44dd-animora-naemyeonyi-dongmuli-malhan" 
                   target="_blank" 
                   class="ai-link-btn">
                    🤖 아니모라 AI로 더 상세한 해석 받기
                </a>
            </div>
        </div>
    `;
}

// 커플 궁합 분석 생성
function generateCoupleAnalysis(person1, person2) {
    const country1 = countries[person1.month];
    const animal1 = animals[person1.day];
    const country2 = countries[person2.month];
    const animal2 = animals[person2.day];
    
    // 궁합 점수 계산 (임의)
    const compatibilityScore = calculateCompatibility(person1.month, person1.day, person2.month, person2.day);
    
    return `
        <div class="result-card">
            <div class="result-header">
                <h2>💑 커플 궁합 분석 결과</h2>
                <p class="subtitle">${person1.name}님 & ${person2.name}님의 관계 해석</p>
            </div>
            
            <div class="compatibility-score">
                <div class="score-circle">
                    <div class="score-number">${compatibilityScore}</div>
                </div>
                <div class="score-label">궁합 점수</div>
            </div>
            
            <div class="relationship-grid">
                <div class="relationship-item">
                    <h4>${person1.name}님</h4>
                    <div class="animora-badge" style="margin: 10px 0;">${country1.emoji} ${country1.name}</div>
                    <div class="animora-badge" style="margin: 10px 0;">${animal1.emoji} ${animal1.name}</div>
                    <p>음력 ${person1.month}월 ${person1.day}일생</p>
                </div>
                
                <div class="relationship-item">
                    <h4>${person2.name}님</h4>
                    <div class="animora-badge" style="margin: 10px 0;">${country2.emoji} ${country2.name}</div>
                    <div class="animora-badge" style="margin: 10px 0;">${animal2.emoji} ${animal2.name}</div>
                    <p>음력 ${person2.month}월 ${person2.day}일생</p>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>💞 관계의 강점</h3>
                <div class="analysis-content">
                    <ul class="analysis-list">
                        <li>✓ ${person1.name}님의 ${country1.keyword}와 ${person2.name}님의 ${country2.keyword}가 서로를 보완합니다</li>
                        <li>✓ ${animal1.name}과 ${animal2.name}의 조합은 독특한 시너지를 만들어냅니다</li>
                        <li>✓ 두 분 모두 상대방의 차이를 존중할 때 관계가 발전합니다</li>
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>⚠️ 주의할 점</h3>
                <div class="analysis-content">
                    <ul class="analysis-list">
                        <li>⚠ ${person1.name}님은 ${country1.name}의 특성상 ${countryTraits[person1.month].challenges.toLowerCase()}</li>
                        <li>⚠ ${person2.name}님은 ${country2.name}의 특성상 ${countryTraits[person2.month].challenges.toLowerCase()}</li>
                        <li>⚠ 서로의 다른 점을 이해하고 대화로 풀어가는 것이 중요합니다</li>
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>💡 관계 개선 조언</h3>
                <div class="analysis-content">
                    <p><strong>${person1.name}님께:</strong> ${person2.name}님의 ${country2.name} 특성을 이해하고, ${animal2.name}의 본성을 존중해주세요. 
                    상대방이 ${country2.keyword}를 추구한다는 것을 기억하세요.</p>
                    
                    <p><strong>${person2.name}님께:</strong> ${person1.name}님의 ${country1.name} 특성을 이해하고, ${animal1.name}의 본성을 존중해주세요. 
                    상대방이 ${country1.keyword}를 추구한다는 것을 기억하세요.</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="https://chatgpt.com/g/g-6805285f91a08191927f5e111e1f44dd-animora-naemyeonyi-dongmuli-malhan" 
                   target="_blank" 
                   class="ai-link-btn">
                    🤖 아니모라 AI로 더 상세한 궁합 해석 받기
                </a>
            </div>
        </div>
    `;
}

// 가족 관계 분석 생성
function generateFamilyAnalysis(members) {
    const memberProfiles = members.map(m => {
        const country = countries[m.month];
        const animal = animals[m.day];
        return {
            ...m,
            country,
            animal
        };
    });
    
    return `
        <div class="result-card">
            <div class="result-header">
                <h2>👨‍👩‍👧‍👦 가족 관계 분석 결과</h2>
                <p class="subtitle">가족 구성원들의 아니모라 해석</p>
            </div>
            
            <div class="relationship-grid">
                ${memberProfiles.map(m => `
                    <div class="relationship-item">
                        <h4>${m.name}</h4>
                        <div class="animora-badge" style="margin: 10px 0;">${m.country.emoji} ${m.country.name}</div>
                        <div class="animora-badge" style="margin: 10px 0;">${m.animal.emoji} ${m.animal.name}</div>
                        <p>음력 ${m.month}월 ${m.day}일생</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="analysis-section">
                <h3>🏡 가족 역학 분석</h3>
                <div class="analysis-content">
                    ${memberProfiles.map((m, i) => `
                        <p><strong>${m.name}:</strong> ${m.country.name}에서 자라 ${m.animal.name}의 본성을 가졌습니다. 
                        ${countryTraits[m.month].characteristics[0]}하며, ${m.country.keyword}를 추구합니다.</p>
                    `).join('')}
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>💞 가족 조화 포인트</h3>
                <div class="analysis-content">
                    <ul class="analysis-list">
                        <li>✓ 각 구성원의 서로 다른 나라와 동물 조합이 가족에 다양성을 제공합니다</li>
                        <li>✓ ${memberProfiles[0].name}의 ${memberProfiles[0].country.keyword}와 ${memberProfiles[1]?.name || '다른 구성원'}의 ${memberProfiles[1]?.country.keyword || '특성'}이 균형을 이룹니다</li>
                        <li>✓ 서로의 차이를 존중하고 이해할 때 가족 관계가 더욱 돈독해집니다</li>
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>⚠️ 갈등 포인트</h3>
                <div class="analysis-content">
                    <ul class="analysis-list">
                        ${memberProfiles.map(m => `
                            <li>⚠ ${m.name}: ${countryTraits[m.month].challenges}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>💡 가족 관계 개선 조언</h3>
                <div class="analysis-content">
                    <p>가족 구성원들이 서로 다른 나라에서 자라고 다른 동물의 본성을 가지고 있다는 것을 인정하세요. 
                    각자의 특성을 이해하고 존중할 때 가족 관계가 더욱 화목해집니다.</p>
                    
                    <p>정기적으로 가족 대화 시간을 가지고, 각자의 입장과 감정을 표현하는 기회를 만드세요. 
                    아니모라 해석을 통해 서로를 이해하는 시간을 가져보는 것도 좋습니다.</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="https://chatgpt.com/g/g-6805285f91a08191927f5e111e1f44dd-animora-naemyeonyi-dongmuli-malhan" 
                   target="_blank" 
                   class="ai-link-btn">
                    🤖 아니모라 AI로 더 상세한 가족 관계 해석 받기
                </a>
            </div>
        </div>
    `;
}

// 궁합 점수 계산 (임의)
function calculateCompatibility(month1, day1, month2, day2) {
    // 간단한 알고리즘: 월과 일의 차이를 기반으로 점수 계산
    const monthDiff = Math.abs(month1 - month2);
    const dayDiff = Math.abs(day1 - day2);
    
    let score = 85; // 기본 점수
    
    // 월 차이가 적을수록 좋음
    score -= monthDiff * 2;
    
    // 일 차이 고려
    score -= Math.floor(dayDiff / 5);
    
    // 같은 월이면 보너스
    if (month1 === month2) score += 10;
    
    // 같은 일이면 보너스
    if (day1 === day2) score += 5;
    
    // 점수 범위 제한
    return Math.max(60, Math.min(100, score));
}

// 결과 표시
function displayResult(htmlContent) {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    
    resultContent.innerHTML = htmlContent;
    resultSection.style.display = 'block';
    
    // 결과 섹션으로 스크롤
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
