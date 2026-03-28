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

// 30개 동물 데이터 (공식 아니모라 동물표 기준)
// 상(11~20일), 중(1~10일), 하(21~30일)
const animals = {
    1: { name: '호랑이', emoji: '🐯', type: '중', group: '호랑이과' },
    2: { name: '야생토끼', emoji: '🐰', type: '중', group: '토끼과' },
    3: { name: '이무기', emoji: '🐉', type: '중', group: '용과' },
    4: { name: '아나콘다', emoji: '🐍', type: '중', group: '뱀과' },
    5: { name: '야생마', emoji: '🐴', type: '중', group: '말과' },
    6: { name: '양', emoji: '🐑', type: '중', group: '양과' },
    7: { name: '오랑우탄', emoji: '🦧', type: '중', group: '원숭이과' },
    8: { name: '장미계', emoji: '🐓', type: '중', group: '닭과' },
    9: { name: '들개', emoji: '🐕', type: '중', group: '개과' },
    10: { name: '멧돼지', emoji: '🐗', type: '중', group: '돼지과' },
    11: { name: '호랑이', emoji: '🐯', type: '상', group: '호랑이과' },
    12: { name: '오소리', emoji: '🦡', type: '상', group: '토끼과' },
    13: { name: '용', emoji: '🐉', type: '상', group: '용과' },
    14: { name: '구렁이', emoji: '🐍', type: '상', group: '뱀과' },
    15: { name: '경주마', emoji: '🏇', type: '상', group: '말과' },
    16: { name: '산양', emoji: '🐐', type: '상', group: '양과' },
    17: { name: '고릴라', emoji: '🦍', type: '상', group: '원숭이과' },
    18: { name: '수탉', emoji: '🐓', type: '상', group: '닭과' },
    19: { name: '늑대', emoji: '🐺', type: '상', group: '개과' },
    20: { name: '수돼지', emoji: '🐗', type: '상', group: '돼지과' },
    21: { name: '고양이', emoji: '🐱', type: '하', group: '호랑이과' },
    22: { name: '집토끼', emoji: '🐰', type: '하', group: '토끼과' },
    23: { name: '도롱뇽', emoji: '🦎', type: '하', group: '용과' },
    24: { name: '꽃뱀', emoji: '🐍', type: '하', group: '뱀과' },
    25: { name: '명품마', emoji: '🐴', type: '하', group: '말과' },
    26: { name: '염소', emoji: '🐐', type: '하', group: '양과' },
    27: { name: '침팬지', emoji: '🐵', type: '하', group: '원숭이과' },
    28: { name: '암탉', emoji: '🐔', type: '하', group: '닭과' },
    29: { name: '강아지', emoji: '🐕', type: '하', group: '개과' },
    30: { name: '암돼지', emoji: '🐷', type: '하', group: '돼지과' }
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

// 동물별 본성 특성 (공식 아니모라 동물표 30개 전체)
const animalTraits = {
    // 호랑이과 (1, 11, 21일)
    1: { nature: '호랑이', desc: '호랑이의 본성을 가진 당신은 강인한 생존력과 독립심을 갖추고 있습니다. 중(中) 호랑이로서 균형 잡힌 힘과 판단력이 돋보입니다.', keywords: ['독립심', '강인함', '균형감'] },
    11: { nature: '호랑이', desc: '상(上) 호랑이로서 강력한 카리스마와 리더십을 타고났습니다. 자존심이 높고 용맹하며, 주변을 이끄는 왕의 기질을 가지고 있습니다.', keywords: ['카리스마', '리더십', '자존심'] },
    21: { nature: '고양이', desc: '호랑이과의 하(下)인 고양이는 독립적이고 예민한 감각의 소유자입니다. 선택적 애정을 주며 자유로운 영혼을 가지고 있습니다.', keywords: ['독립성', '예민한 감각', '자유로움'] },

    // 토끼과 (2, 12, 22일)
    2: { nature: '야생토끼', desc: '야생토끼의 본성을 가진 당신은 민첩하고 경계심이 강합니다. 생존 본능이 탁월하며 위기 상황에서 빠른 판단력을 발휘합니다.', keywords: ['민첩함', '경계심', '생존력'] },
    12: { nature: '오소리', desc: '상(上) 토끼과인 오소리는 온화한 외모와 달리 강한 끈기와 투지를 가지고 있습니다. 한번 파고들면 끝까지 해내는 집념이 있습니다.', keywords: ['끈기', '투지', '집념'] },
    22: { nature: '집토끼', desc: '집토끼의 본성을 가진 당신은 온순하고 안정을 추구합니다. 편안한 환경에서 능력을 발휘하며, 주변 사람들에게 평화를 줍니다.', keywords: ['온순함', '안정 추구', '평화로움'] },

    // 용과 (3, 13, 23일)
    3: { nature: '이무기', desc: '용이 되기 전의 이무기처럼, 큰 잠재력을 품고 때를 기다리는 사람입니다. 인내와 노력으로 결국 큰 성취를 이루어냅니다.', keywords: ['잠재력', '인내', '성취욕'] },
    13: { nature: '용', desc: '상(上) 용과의 용은 하늘을 나는 최상위 존재입니다. 강한 카리스마와 높은 이상을 가지고 있으며, 큰 비전으로 주변을 이끕니다.', keywords: ['카리스마', '비전', '영향력'] },
    23: { nature: '도롱뇽', desc: '도롱뇽의 본성을 가진 당신은 유연하고 적응력이 뛰어납니다. 환경 변화에 빠르게 순응하며, 조용히 자신의 자리를 찾아갑니다.', keywords: ['유연함', '적응력', '순응'] },

    // 뱀과 (4, 14, 24일)
    4: { nature: '아나콘다', desc: '아나콘다의 본성을 가진 당신은 강력한 직감과 현실 감각을 겸비했습니다. 한 번의 기회에 전력을 다하는 몰입력이 뛰어납니다.', keywords: ['직감', '현실 감각', '몰입력'] },
    14: { nature: '구렁이', desc: '상(上) 뱀과인 구렁이는 신중하고 전략적인 사고의 소유자입니다. 깊은 통찰력으로 상황을 꿰뚫어보며 때를 기다릴 줄 압니다.', keywords: ['신중함', '전략', '통찰력'] },
    24: { nature: '꽃뱀', desc: '꽃뱀의 본성을 가진 당신은 매력적이고 감각적인 사람입니다. 관계 지능이 높아 사람들의 마음을 읽고 사로잡는 능력이 있습니다.', keywords: ['매력', '감각', '관계 지능'] },

    // 말과 (5, 15, 25일)
    5: { nature: '야생마', desc: '야생마의 본성을 가진 당신은 자유로운 영혼의 소유자입니다. 구속을 싫어하고 열정적으로 달려가며, 속도감 있는 삶을 추구합니다.', keywords: ['자유', '열정', '속도감'] },
    15: { nature: '경주마', desc: '상(上) 말과인 경주마는 목표를 향해 질주하는 승부사입니다. 경쟁 속에서 능력을 발휘하며 성취감을 통해 성장합니다.', keywords: ['승부욕', '목표 지향', '성취감'] },
    25: { nature: '명품마', desc: '명품마의 본성을 가진 당신은 품격 있고 우아한 사람입니다. 인정받고 싶은 욕구가 강하며, 외모와 태도에 신경을 많이 씁니다.', keywords: ['품격', '우아함', '인정 욕구'] },

    // 양과 (6, 16, 26일)
    6: { nature: '양', desc: '양의 본성을 가진 당신은 평화를 사랑하고 공감 능력이 뛰어납니다. 온순한 성격으로 주변에 편안함을 주며, 조화를 추구합니다.', keywords: ['평화', '공감 능력', '온순함'] },
    16: { nature: '산양', desc: '상(上) 양과인 산양은 온화하지만 내면에 강한 고집과 독립심을 가지고 있습니다. 험한 환경에서도 꿋꿋이 자기 길을 갑니다.', keywords: ['독립심', '고집', '인내'] },
    26: { nature: '염소', desc: '염소의 본성을 가진 당신은 소박하고 실용적인 사람입니다. 현실적인 판단력이 뛰어나며, 주어진 환경에서 최선을 다합니다.', keywords: ['소박함', '실용성', '현실감'] },

    // 원숭이과 (7, 17, 27일)
    7: { nature: '오랑우탄', desc: '오랑우탄의 본성을 가진 당신은 사려 깊고 지적인 사람입니다. 혼자만의 시간을 즐기며, 깊이 있는 사고와 관찰력이 뛰어납니다.', keywords: ['사려 깊음', '지성', '관찰력'] },
    17: { nature: '고릴라', desc: '상(上) 원숭이과인 고릴라는 강력한 힘과 온화한 리더십을 겸비했습니다. 가족과 무리를 보호하며 묵묵히 이끄는 힘이 있습니다.', keywords: ['힘', '온화한 리더십', '보호본능'] },
    27: { nature: '침팬지', desc: '침팬지의 본성을 가진 당신은 적응력과 친화력이 뛰어납니다. 사회성이 좋아 어디서든 잘 어울리며, 유연한 사고를 합니다.', keywords: ['적응력', '친화력', '사회성'] },

    // 닭과 (8, 18, 28일)
    8: { nature: '장미계', desc: '장미계(장미닭)의 본성을 가진 당신은 화려하고 자신감 넘치는 사람입니다. 자기 표현에 능하며, 주변의 시선을 사로잡는 매력이 있습니다.', keywords: ['화려함', '자신감', '자기 표현'] },
    18: { nature: '수탉', desc: '상(上) 닭과인 수탉은 책임감 있고 시간 관념이 철저합니다. 리더의 자리에서 빛나며, 정확하고 성실한 태도로 신뢰를 얻습니다.', keywords: ['책임감', '성실함', '신뢰'] },
    28: { nature: '암탉', desc: '암탉의 본성을 가진 당신은 따뜻하고 헌신적인 사람입니다. 가정과 조직을 돌보는 데 탁월하며, 꼼꼼하고 세심한 배려가 돋보입니다.', keywords: ['헌신', '돌봄', '세심함'] },

    // 개과 (9, 19, 29일)
    9: { nature: '들개', desc: '들개의 본성을 가진 당신은 독립적 생존력과 현실 전략에 능합니다. 야생의 감각으로 기회를 포착하며 자신만의 방식으로 살아갑니다.', keywords: ['생존력', '현실 감각', '독립성'] },
    19: { nature: '늑대', desc: '상(上) 개과인 늑대는 강한 리더십과 깊은 충성심을 겸비했습니다. 무리를 이끌며 의리를 중시하고, 협력 속에서 힘을 발휘합니다.', keywords: ['리더십', '충성심', '의리'] },
    29: { nature: '강아지', desc: '강아지의 본성을 가진 당신은 순수하고 충성스러운 사람입니다. 사랑받고 싶은 욕구가 강하며, 주변 사람들에게 기쁨을 줍니다.', keywords: ['순수함', '충성', '애교'] },

    // 돼지과 (10, 20, 30일)
    10: { nature: '멧돼지', desc: '멧돼지의 본성을 가진 당신은 거침없는 추진력과 강한 생명력을 가지고 있습니다. 목표를 정하면 돌진하며, 어떤 장애물도 뚫고 나갑니다.', keywords: ['추진력', '생명력', '돌파력'] },
    20: { nature: '수돼지', desc: '상(上) 돼지과인 수돼지는 풍요와 관대함을 상징합니다. 베풀기를 좋아하고 호탕한 성격으로, 주변에 사람이 모이는 매력이 있습니다.', keywords: ['풍요', '관대함', '호탕함'] },
    30: { nature: '암돼지', desc: '암돼지의 본성을 가진 당신은 모성애와 포용력이 뛰어난 사람입니다. 가족과 주변을 따뜻하게 돌보며, 현실적이고 실속 있는 삶을 추구합니다.', keywords: ['포용력', '모성애', '실속'] }
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
    
    // 전환된 폼의 드롭다운 채우기
    populateDaySelects();
    
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
    // 모든 day 드롭다운 찾기 (personal, couple1, couple2)
    const selectIds = [
        'personal-day',
        'couple-day1', 
        'couple-day2'
    ];
    
    selectIds.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) {
            console.warn(`${selectId} 요소를 찾을 수 없습니다`);
            return;
        }
        
        // 이미 옵션이 30개 이상이면 스킵 (이미 채워짐)
        if (select.options.length > 30) {
            console.log(`${selectId} 이미 채워져 있음`);
            return;
        }
        
        console.log(`${selectId} 드롭다운 채우는 중...`);
        
        // 기존 옵션 제거 (선택 옵션 제외)
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        for (let i = 1; i <= 30; i++) {
            if (!animals[i]) {
                console.warn(`animals[${i}] 없음`);
                continue;
            }
            
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}일 (${animals[i].name} ${animals[i].emoji})`;
            select.appendChild(option);
        }
        
        console.log(`${selectId} 완료: ${select.options.length - 1}개 옵션 추가됨`);
    });
    
    // 가족 구성원의 day 드롭다운도 채우기
    const familyDaySelects = document.querySelectorAll('select[id^="family-day-"]');
    familyDaySelects.forEach(select => {
        // 이미 옵션이 있으면 스킵 (HTML 템플릿에서 이미 생성됨)
        if (select.options.length > 1) {
            return;
        }
        
        for (let i = 1; i <= 30; i++) {
            if (!animals[i]) continue;
            
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
        <h4>사람 ${memberCount}</h4>
        
        <div class="form-row">
            <div class="form-group">
                <label for="family-name-${memberCount}">호칭/닉네임</label>
                <input type="text" id="family-name-${memberCount}" placeholder="예: 엄마, 친구, 동료, 팀장" required>
            </div>
            
            <div class="form-group">
                <label for="family-relation-${memberCount}">관계</label>
                <select id="family-relation-${memberCount}" required>
                    <option value="">선택</option>
                    <option value="family">가족</option>
                    <option value="friend">친구</option>
                    <option value="colleague">동료</option>
                    <option value="partner">연인</option>
                    <option value="business">비즈니스 파트너</option>
                    <option value="team">팀원</option>
                    <option value="other">기타</option>
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="family-gender-${memberCount}">성별</label>
                <select id="family-gender-${memberCount}" required>
                    <option value="">선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
            </div>
            
            <div class="form-group" style="visibility: hidden;">
                <label>&nbsp;</label>
                <select disabled>
                    <option></option>
                </select>
            </div>
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
    const gender = document.getElementById('personal-gender').value;
    const month = parseInt(document.getElementById('personal-month').value);
    const day = parseInt(document.getElementById('personal-day').value);
    
    const country = countries[month];
    const animal = animals[day];
    
    const analysisData = {
        type: 'personal',
        name: name,
        gender: gender,
        month: month,
        day: day,
        country: country.name,
        animal: animal.name
    };
    
    const result = generatePersonalAnalysis(name, month, day);
    displayResult(result, analysisData);
}

// 커플 분석 제출
function handleCoupleSubmit(e) {
    e.preventDefault();
    
    const person1 = {
        name: document.getElementById('couple-name1').value,
        gender: document.getElementById('couple-gender1').value,
        month: parseInt(document.getElementById('couple-month1').value),
        day: parseInt(document.getElementById('couple-day1').value)
    };
    
    const person2 = {
        name: document.getElementById('couple-name2').value,
        gender: document.getElementById('couple-gender2').value,
        month: parseInt(document.getElementById('couple-month2').value),
        day: parseInt(document.getElementById('couple-day2').value)
    };
    
    const country1 = countries[person1.month];
    const animal1 = animals[person1.day];
    const country2 = countries[person2.month];
    const animal2 = animals[person2.day];
    
    const compatibilityScore = calculateCompatibility(person1.month, person1.day, person2.month, person2.day);
    
    const analysisData = {
        type: 'couple',
        person1: {
            ...person1,
            country: country1.name,
            animal: animal1.name
        },
        person2: {
            ...person2,
            country: country2.name,
            animal: animal2.name
        },
        compatibilityScore: compatibilityScore
    };
    
    const result = generateCoupleAnalysis(person1, person2);
    displayResult(result, analysisData);
}

// 가족 분석 제출
function handleFamilySubmit(e) {
    e.preventDefault();
    
    const members = [];
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        const memberId = card.dataset.member;
        const name = document.getElementById(`family-name-${memberId}`).value;
        const relation = document.getElementById(`family-relation-${memberId}`).value;
        const gender = document.getElementById(`family-gender-${memberId}`).value;
        const month = parseInt(document.getElementById(`family-month-${memberId}`).value);
        const day = parseInt(document.getElementById(`family-day-${memberId}`).value);
        
        const country = countries[month];
        const animal = animals[day];
        
        members.push({ 
            name,
            relation,
            gender,
            month, 
            day,
            country: country.name,
            animal: animal.name
        });
    });
    
    const analysisData = {
        type: 'family',
        members: members
    };
    
    const result = generateFamilyAnalysis(members);
    displayResult(result, analysisData);
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
            

        </div>
    `;
}

// 가족 관계 분석 생성
function generateFamilyAnalysis(members) {
    const relationLabels = {
        'family': '가족',
        'friend': '친구',
        'colleague': '동료',
        'partner': '연인',
        'business': '비즈니스 파트너',
        'team': '팀원',
        'other': '기타'
    };
    
    const memberProfiles = members.map(m => {
        const country = countries[m.month];
        const animal = animals[m.day];
        return {
            ...m,
            country,
            animal,
            relationLabel: relationLabels[m.relation] || m.relation
        };
    });
    
    // 관계 유형별 그룹핑
    const relationTypes = [...new Set(members.map(m => m.relation))];
    const groupTitle = relationTypes.length === 1 && relationTypes[0] === 'family' 
        ? '가족 관계' 
        : '다중 관계';
    
    return `
        <div class="result-card">
            <div class="result-header">
                <h2>👥 ${groupTitle} 분석 결과</h2>
                <p class="subtitle">${members.length}명의 구성원 아니모라 해석</p>
            </div>
            
            <div class="relationship-grid">
                ${memberProfiles.map(m => `
                    <div class="relationship-item">
                        <h4>${m.name}</h4>
                        <div class="animora-badge" style="margin: 10px 0; background: #e3f2fd; color: #1976d2;">${m.relationLabel}</div>
                        <div class="animora-badge" style="margin: 10px 0;">${m.country.emoji} ${m.country.name}</div>
                        <div class="animora-badge" style="margin: 10px 0;">${m.animal.emoji} ${m.animal.name}</div>
                        <p>음력 ${m.month}월 ${m.day}일생</p>
                        <p style="font-size: 0.9rem; color: #666;">${m.gender === 'male' ? '남성' : '여성'}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="analysis-section">
                <h3>🏡 구성원 역학 분석</h3>
                <div class="analysis-content">
                    ${memberProfiles.map((m, i) => `
                        <p><strong>${m.name} (${m.relationLabel}, ${m.gender === 'male' ? '남성' : '여성'}):</strong> ${m.country.name}에서 자라 ${m.animal.name}의 본성을 가졌습니다. 
                        ${countryTraits[m.month].characteristics[0]}하며, ${m.country.keyword}를 추구합니다.</p>
                    `).join('')}
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>💞 관계 조화 포인트</h3>
                <div class="analysis-content">
                    <ul class="analysis-list">
                        <li>✓ 각 구성원의 서로 다른 나라와 동물 조합이 그룹에 다양성을 제공합니다</li>
                        <li>✓ ${memberProfiles[0].name} (${memberProfiles[0].relationLabel})의 ${memberProfiles[0].country.keyword}와 ${memberProfiles[1]?.name || '다른 구성원'} (${memberProfiles[1]?.relationLabel || ''})의 ${memberProfiles[1]?.country.keyword || '특성'}이 균형을 이룹니다</li>
                        <li>✓ ${relationTypes.map(r => relationLabels[r]).join(', ')} 관계에서 서로의 차이를 존중하고 이해할 때 더욱 돈독해집니다</li>
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>⚠️ 갈등 포인트</h3>
                <div class="analysis-content">
                    <ul class="analysis-list">
                        ${memberProfiles.map(m => `
                            <li>⚠ ${m.name} (${m.relationLabel}): ${countryTraits[m.month].challenges}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="analysis-section">
                <h3>💡 관계 개선 조언</h3>
                <div class="analysis-content">
                    <p>구성원들이 서로 다른 나라에서 자라고 다른 동물의 본성을 가지고 있다는 것을 인정하세요. 
                    각자의 특성과 관계 유형(${relationTypes.map(r => relationLabels[r]).join(', ')})을 이해하고 존중할 때 관계가 더욱 화목해집니다.</p>
                    
                    <p>정기적으로 대화 시간을 가지고, 각자의 입장과 감정을 표현하는 기회를 만드세요. 
                    아니모라 해석을 통해 서로를 이해하는 시간을 가져보는 것도 좋습니다.</p>
                </div>
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
function displayResult(htmlContent, analysisData = null) {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    
    resultContent.innerHTML = htmlContent;
    
    // 프리미엄 기능 버튼 추가
    if (analysisData) {
        addPremiumButtons(resultContent, analysisData);
    }
    
    resultSection.style.display = 'block';
    
    // 결과 섹션으로 스크롤
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 프리미엄 기능 버튼 추가
function addPremiumButtons(container, analysisData) {
    const buttonsHTML = `
        <div class="premium-actions" style="margin-top: 40px; text-align: center;">
            <h3 style="margin-bottom: 20px; color: #2c3e89;">📊 추가 기능</h3>
            
            <div class="action-buttons" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="action-btn save-btn" onclick="saveAnalysisToHistory()" style="background: linear-gradient(135deg, #4a5fc1, #2c3e89); color: white; padding: 12px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    💾 결과 저장하기
                </button>
                
                <button class="action-btn pdf-btn" onclick="downloadAnalysisPDF()" style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 12px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    📄 PDF 다운로드
                </button>
                
                <button class="action-btn share-btn" onclick="shareAnalysis()" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 12px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    🔗 공유하기
                </button>
            </div>
            
            <div class="premium-upgrade" style="margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #f8f9fc 0%, #e8eaf6 100%); border-radius: 15px; border: 2px dashed #4a5fc1;">
                <h4 style="color: #2c3e89; margin-bottom: 15px;">✨ 프리미엄 기능으로 더 자세한 분석</h4>
                <p style="color: #666; margin-bottom: 20px;">AI가 당신의 상황에 맞춘 구체적인 조언을 제공합니다</p>
                
                <div class="premium-features-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div class="feature-item" style="text-align: left; padding: 15px; background: white; border-radius: 10px;">
                        <div style="font-size: 1.5rem; margin-bottom: 5px;">🤝</div>
                        <div style="font-weight: 600; color: #2c3e89;">화해 방법</div>
                        <div style="font-size: 0.9rem; color: #666;">싸웠을 때 대처법</div>
                    </div>
                    
                    <div class="feature-item" style="text-align: left; padding: 15px; background: white; border-radius: 10px;">
                        <div style="font-size: 1.5rem; margin-bottom: 5px;">🎁</div>
                        <div style="font-weight: 600; color: #2c3e89;">선물 추천</div>
                        <div style="font-size: 0.9rem; color: #666;">유형에 맞는 선물</div>
                    </div>
                    
                    <div class="feature-item" style="text-align: left; padding: 15px; background: white; border-radius: 10px;">
                        <div style="font-size: 1.5rem; margin-bottom: 5px;">👨‍👧</div>
                        <div style="font-weight: 600; color: #2c3e89;">자녀 대화법</div>
                        <div style="font-size: 0.9rem; color: #666;">사춘기 소통법</div>
                    </div>
                    
                    <div class="feature-item" style="text-align: left; padding: 15px; background: white; border-radius: 10px;">
                        <div style="font-size: 1.5rem; margin-bottom: 5px;">💼</div>
                        <div style="font-weight: 600; color: #2c3e89;">진로 조언</div>
                        <div style="font-size: 0.9rem; color: #666;">적합한 직업 추천</div>
                    </div>
                </div>
                
                <button class="premium-upgrade-btn" onclick="requestAIAnalysis()" style="background: linear-gradient(135deg, #d4af37, #f4d03f); color: white; padding: 15px 40px; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); transition: all 0.3s ease;">
                    🤖 AI 상세 분석 받기 (무료 체험)
                </button>
                
                <p style="margin-top: 15px; font-size: 0.9rem; color: #2c3e89; font-weight: 600;">
                    ✅ API 연동 완료! 실시간 AI 분석 가능
                </p>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', buttonsHTML);
    
    // 현재 분석 데이터를 전역 변수에 저장 (버튼 함수에서 사용)
    window.currentAnalysisData = analysisData;
}

// 분석 저장
function saveAnalysisToHistory() {
    if (!window.currentAnalysisData) {
        alert('저장할 분석 데이터가 없습니다.');
        return;
    }
    
    const saved = storageService.saveAnalysis(window.currentAnalysisData);
    
    if (saved) {
        const stats = storageService.getStatistics();
        alert(`✅ 분석이 저장되었습니다!\n저장된 분석: ${stats.total}개`);
    } else {
        alert('❌ 저장 중 오류가 발생했습니다.');
    }
}

// PDF 다운로드
function downloadAnalysisPDF() {
    if (!window.currentAnalysisData) {
        alert('다운로드할 분석 데이터가 없습니다.');
        return;
    }
    
    const resultHTML = document.getElementById('result-content').innerHTML;
    premiumFeatures.downloadPDF(window.currentAnalysisData, resultHTML);
}

// 공유하기
function shareAnalysis() {
    const shareOptions = `
        <div class="share-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
            <div class="share-content" style="background: white; padding: 30px; border-radius: 20px; max-width: 400px;">
                <h3 style="margin-bottom: 20px; color: #2c3e89;">🔗 분석 결과 공유하기</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="shareVia('kakao')" style="padding: 12px; background: #FEE500; color: #3C1E1E; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">카카오톡 공유</button>
                    <button onclick="shareVia('facebook')" style="padding: 12px; background: #1877F2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">페이스북 공유</button>
                    <button onclick="shareVia('twitter')" style="padding: 12px; background: #1DA1F2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">트위터 공유</button>
                    <button onclick="shareVia('copy')" style="padding: 12px; background: #4a5fc1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">링크 복사</button>
                    <button onclick="closeShareModal()" style="padding: 12px; background: #ddd; color: #333; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 10px;">닫기</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', shareOptions);
}

function shareVia(platform) {
    if (window.currentAnalysisData) {
        premiumFeatures.share(platform, window.currentAnalysisData);
    }
    closeShareModal();
}

function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
    }
}

// AI 상세 분석 요청
async function requestAIAnalysis() {
    if (!window.currentAnalysisData) {
        alert('분석 데이터가 없습니다. 먼저 기본 분석을 진행해주세요.');
        return;
    }
    
    // 로딩 표시
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ AI 분석 중... (약 10초 소요)';
    btn.disabled = true;
    
    try {
        // API 활성화 확인
        if (!ANIMORA_CONFIG.api.openai.enabled) {
            throw new Error('API가 비활성화되어 있습니다');
        }
        
        console.log('AI 분석 요청 시작:', window.currentAnalysisData);
        
        // AI 분석 생성
        const aiAnalysis = await animoraAPI.generateAIAnalysis(
            window.currentAnalysisData, 
            'detailed'
        );
        
        // 결과 표시
        displayAIAnalysisResult(aiAnalysis);
        
    } catch (error) {
        console.error('AI 분석 오류:', error);
        alert('❌ AI 분석 중 오류가 발생했습니다.\n' + error.message + '\n\n기본 분석은 이미 제공되었습니다.');
    } finally {
        // 버튼 복구
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// AI 분석 결과 표시
function displayAIAnalysisResult(aiAnalysis) {
    const resultContent = document.getElementById('result-content');
    
    const aiResultHTML = `
        <div class="result-card" style="margin-top: 40px; background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%); border: 3px solid #d4af37;">
            <div class="result-header">
                <h2 style="color: #d4af37;">🤖 AI 프리미엄 상세 분석</h2>
                <p class="subtitle">GPT-4가 생성한 맞춤형 해석</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px; white-space: pre-wrap; line-height: 1.8; color: #333;">
                ${aiAnalysis}
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(212, 175, 55, 0.1); border-radius: 10px;">
                <p style="font-weight: 600; color: #2c3e89; margin-bottom: 10px;">💡 더 궁금한 점이 있으신가요?</p>
                <button onclick="showCustomQuestions()" style="background: #4a5fc1; color: white; padding: 12px 30px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 5px;">
                    맞춤형 질문하기
                </button>
            </div>
        </div>
    `;
    
    resultContent.insertAdjacentHTML('beforeend', aiResultHTML);
    
    // 스크롤 이동
    resultContent.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 맞춤형 질문 선택 모달
function showCustomQuestions() {
    const templates = ANIMORA_CONFIG.customQuestionTemplates;
    
    let modalHTML = `
        <div class="custom-question-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
            <div class="modal-content" style="background: white; padding: 40px; border-radius: 20px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <h3 style="color: #2c3e89; margin-bottom: 20px; text-align: center;">🎯 맞춤형 질문 선택</h3>
                <p style="text-align: center; color: #666; margin-bottom: 30px;">원하시는 주제를 선택해주세요</p>
                <div style="display: grid; gap: 15px;">
    `;
    
    templates.forEach(template => {
        modalHTML += `
            <button onclick="askCustomQuestion('${template.id}')" style="text-align: left; padding: 20px; background: #f8f9fc; border: 2px solid #e0e4f0; border-radius: 12px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.borderColor='#4a5fc1'; this.style.background='#fff'" onmouseout="this.style.borderColor='#e0e4f0'; this.style.background='#f8f9fc'">
                <div style="font-size: 1.5rem; margin-bottom: 8px;">${template.icon}</div>
                <div style="font-weight: 600; color: #2c3e89; margin-bottom: 5px;">${template.title}</div>
                <div style="font-size: 0.9rem; color: #666;">${template.description}</div>
            </button>
        `;
    });
    
    modalHTML += `
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: #f0f4ff; border-radius: 12px; border: 2px dashed #4a5fc1;">
                    <h4 style="color: #2c3e89; margin-bottom: 15px; text-align: center;">💬 직접 질문하기</h4>
                    <p style="text-align: center; color: #666; font-size: 0.9rem; margin-bottom: 15px;">위 템플릿 외에 궁금한 것을 자유롭게 물어보세요</p>
                    <textarea id="custom-question-input" placeholder="예: 제 성격에 맞는 이상적인 직업은 무엇인가요?&#10;예: 저와 파트너가 갈등을 효과적으로 해결하려면 어떻게 해야 하나요?" style="width: 100%; padding: 15px; border: 2px solid #e0e4f0; border-radius: 8px; font-size: 1rem; resize: vertical; min-height: 100px;" rows="4"></textarea>
                    <button onclick="askFreeFormQuestion()" style="width: 100%; margin-top: 10px; padding: 12px; background: #4a5fc1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='#3949a1'" onmouseout="this.style.background='#4a5fc1'">🚀 질문하기</button>
                </div>
                
                <button onclick="closeCustomQuestionModal()" style="width: 100%; margin-top: 20px; padding: 12px; background: #ddd; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">닫기</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 맞춤형 질문 처리
async function askCustomQuestion(templateId) {
    closeCustomQuestionModal();
    
    if (!window.currentAnalysisData) {
        alert('분석 데이터가 없습니다.');
        return;
    }
    
    // 로딩 표시
    const loadingHTML = `
        <div id="ai-loading" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 9999; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px;">🤖</div>
            <div style="font-weight: 600; color: #2c3e89; margin-bottom: 10px;">AI가 답변을 생성하는 중...</div>
            <div style="color: #666;">약 10초 소요됩니다</div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    
    try {
        const template = ANIMORA_CONFIG.customQuestionTemplates.find(t => t.id === templateId);
        
        // 변수 대체 (분석 타입에 따라 다르게 처리)
        const variables = {};
        
        if (window.currentAnalysisData.type === 'personal') {
            variables.person = window.currentAnalysisData.name || '고객';
            variables.gender = window.currentAnalysisData.gender || 'male';
            variables.month = window.currentAnalysisData.month || '';
            variables.day = window.currentAnalysisData.day || '';
            variables.country = window.currentAnalysisData.country || '';
            variables.animal = window.currentAnalysisData.animal || '';
            variables.child = window.currentAnalysisData.name || '자녀';
        } else if (window.currentAnalysisData.type === 'couple') {
            const p1 = window.currentAnalysisData.person1 || {};
            const p2 = window.currentAnalysisData.person2 || {};
            
            variables.person1 = p1.name || '첫 번째 사람';
            variables.gender1 = p1.gender || 'male';
            variables.month1 = p1.month || '';
            variables.day1 = p1.day || '';
            variables.country1 = p1.country || '';
            variables.animal1 = p1.animal || '';
            
            variables.person2 = p2.name || '두 번째 사람';
            variables.gender2 = p2.gender || 'female';
            variables.month2 = p2.month || '';
            variables.day2 = p2.day || '';
            variables.country2 = p2.country || '';
            variables.animal2 = p2.animal || '';
        } else if (window.currentAnalysisData.type === 'family') {
            // 가족/다중 관계의 경우 첫 번째 멤버 정보 사용
            const members = window.currentAnalysisData.members || [];
            if (members.length > 0) {
                variables.person = members[0].name || '구성원';
                variables.gender = members[0].gender || 'male';
                variables.month = members[0].month || '';
                variables.day = members[0].day || '';
                variables.country = members[0].country || '';
                variables.animal = members[0].animal || '';
            }
        }
        
        const answer = await animoraAPI.askCustomQuestion({
            questionType: templateId,
            variables: variables
        });
        
        // 결과 표시
        displayCustomAnswer(template, answer);
        
    } catch (error) {
        console.error('맞춤 질문 오류:', error);
        alert('❌ 답변 생성 중 오류가 발생했습니다.\n' + error.message);
    } finally {
        // 로딩 제거
        const loading = document.getElementById('ai-loading');
        if (loading) loading.remove();
    }
}

// 자유 질문 처리
async function askFreeFormQuestion() {
    const questionInput = document.getElementById('custom-question-input');
    const question = questionInput.value.trim();
    
    if (!question) {
        alert('질문을 입력해주세요.');
        return;
    }
    
    if (!window.currentAnalysisData) {
        alert('분석 데이터가 없습니다.');
        return;
    }
    
    closeCustomQuestionModal();
    
    // 로딩 표시
    const loadingHTML = `
        <div id="ai-loading" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 9999; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px;">🤖</div>
            <div style="font-weight: 600; color: #2c3e89; margin-bottom: 10px;">AI가 답변을 생성하는 중...</div>
            <div style="color: #666;">약 20-30초 소요됩니다</div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    
    try {
        // 분석 데이터를 기반으로 컨텍스트 생성
        let context = '';
        if (window.currentAnalysisData.type === 'personal') {
            context = `${window.currentAnalysisData.name}님(${window.currentAnalysisData.gender === 'male' ? '남성' : '여성'})은 ${window.currentAnalysisData.country} 출신이며 ${window.currentAnalysisData.animal} 동물을 가지고 있습니다.`;
        } else if (window.currentAnalysisData.type === 'couple') {
            const p1 = window.currentAnalysisData.person1;
            const p2 = window.currentAnalysisData.person2;
            context = `${p1.name}님(${p1.gender === 'male' ? '남성' : '여성'}, ${p1.country}, ${p1.animal})과 ${p2.name}님(${p2.gender === 'male' ? '남성' : '여성'}, ${p2.country}, ${p2.animal})의 커플입니다.`;
        } else if (window.currentAnalysisData.type === 'family') {
            const memberDescriptions = window.currentAnalysisData.members.map(m => 
                `${m.name}님(${m.gender === 'male' ? '남성' : '여성'}, ${m.country}, ${m.animal})`
            ).join(', ');
            context = `가족 구성원: ${memberDescriptions}`;
        }
        
        const fullPrompt = `${context}\n\n질문: ${question}`;
        
        // API 호출 (백엔드에서 처리)
        const answer = await animoraAPI.askCustomQuestion({
            questionType: 'free_form',
            variables: {
                context: context,
                question: question
            }
        });
        
        // 결과 표시
        displayFreeFormAnswer(question, answer);
        
    } catch (error) {
        console.error('자유 질문 오류:', error);
        alert('❌ 답변 생성 중 오류가 발생했습니다.\n' + error.message);
    } finally {
        // 로딩 제거
        const loading = document.getElementById('ai-loading');
        if (loading) loading.remove();
    }
}

// 자유 질문 답변 표시
function displayFreeFormAnswer(question, answer) {
    const resultContent = document.getElementById('result-content');
    
    const answerHTML = `
        <div class="result-card" style="margin-top: 40px; background: linear-gradient(135deg, #fff8e1 0%, #ffe9b3 100%); border: 3px solid #ff9800;">
            <div class="result-header">
                <h2 style="color: #f57c00;">💬 직접 질문 답변</h2>
                <p class="subtitle" style="font-weight: 600; color: #2c3e89;">Q: ${question}</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px; white-space: pre-wrap; line-height: 1.8; color: #333;">
                ${answer}
            </div>
        </div>
    `;
    
    resultContent.insertAdjacentHTML('beforeend', answerHTML);
    
    // 결과 섹션으로 스크롤
    resultContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 맞춤 답변 표시
function displayCustomAnswer(template, answer) {
    const resultContent = document.getElementById('result-content');
    
    const answerHTML = `
        <div class="result-card" style="margin-top: 40px; background: linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%); border: 3px solid #4a5fc1;">
            <div class="result-header">
                <h2 style="color: #2c3e89;">${template.icon} ${template.title}</h2>
                <p class="subtitle">${template.description}</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px; white-space: pre-wrap; line-height: 1.8; color: #333;">
                ${answer}
            </div>
        </div>
    `;
    
    resultContent.insertAdjacentHTML('beforeend', answerHTML);
    
    // 스크롤 이동
    resultContent.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 모달 닫기
function closeCustomQuestionModal() {
    const modal = document.querySelector('.custom-question-modal');
    if (modal) modal.remove();
}
