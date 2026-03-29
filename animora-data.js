/**
 * 아니모라 공유 데이터 모듈
 * 모든 페이지에서 사용하는 나라/동물 데이터
 */

// 12개 나라 데이터
const ANIMORA_COUNTRIES = {
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
const ANIMORA_ANIMALS = {
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
const ANIMORA_COUNTRY_TRAITS = {
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
const ANIMORA_ANIMAL_TRAITS = {
    1: { nature: '호랑이', desc: '호랑이의 본성을 가진 당신은 강인한 생존력과 독립심을 갖추고 있습니다. 중(中) 호랑이로서 균형 잡힌 힘과 판단력이 돋보입니다.', keywords: ['독립심', '강인함', '균형감'] },
    11: { nature: '호랑이', desc: '상(上) 호랑이로서 강력한 카리스마와 리더십을 타고났습니다. 자존심이 높고 용맹하며, 주변을 이끄는 왕의 기질을 가지고 있습니다.', keywords: ['카리스마', '리더십', '자존심'] },
    21: { nature: '고양이', desc: '호랑이과의 하(下)인 고양이는 독립적이고 예민한 감각의 소유자입니다. 선택적 애정을 주며 자유로운 영혼을 가지고 있습니다.', keywords: ['독립성', '예민한 감각', '자유로움'] },
    2: { nature: '야생토끼', desc: '야생토끼의 본성을 가진 당신은 민첩하고 경계심이 강합니다. 생존 본능이 탁월하며 위기 상황에서 빠른 판단력을 발휘합니다.', keywords: ['민첩함', '경계심', '생존력'] },
    12: { nature: '오소리', desc: '상(上) 토끼과인 오소리는 온화한 외모와 달리 강한 끈기와 투지를 가지고 있습니다. 한번 파고들면 끝까지 해내는 집념이 있습니다.', keywords: ['끈기', '투지', '집념'] },
    22: { nature: '집토끼', desc: '집토끼의 본성을 가진 당신은 온순하고 안정을 추구합니다. 편안한 환경에서 능력을 발휘하며, 주변 사람들에게 평화를 줍니다.', keywords: ['온순함', '안정 추구', '평화로움'] },
    3: { nature: '이무기', desc: '용이 되기 전의 이무기처럼, 큰 잠재력을 품고 때를 기다리는 사람입니다. 인내와 노력으로 결국 큰 성취를 이루어냅니다.', keywords: ['잠재력', '인내', '성취욕'] },
    13: { nature: '용', desc: '상(上) 용과의 용은 하늘을 나는 최상위 존재입니다. 강한 카리스마와 높은 이상을 가지고 있으며, 큰 비전으로 주변을 이끕니다.', keywords: ['카리스마', '비전', '영향력'] },
    23: { nature: '도롱뇽', desc: '도롱뇽의 본성을 가진 당신은 유연하고 적응력이 뛰어납니다. 환경 변화에 빠르게 순응하며, 조용히 자신의 자리를 찾아갑니다.', keywords: ['유연함', '적응력', '순응'] },
    4: { nature: '아나콘다', desc: '아나콘다의 본성을 가진 당신은 강력한 직감과 현실 감각을 겸비했습니다. 한 번의 기회에 전력을 다하는 몰입력이 뛰어납니다.', keywords: ['직감', '현실 감각', '몰입력'] },
    14: { nature: '구렁이', desc: '상(上) 뱀과인 구렁이는 신중하고 전략적인 사고의 소유자입니다. 깊은 통찰력으로 상황을 꿰뚫어보며 때를 기다릴 줄 압니다.', keywords: ['신중함', '전략', '통찰력'] },
    24: { nature: '꽃뱀', desc: '꽃뱀의 본성을 가진 당신은 매력적이고 감각적인 사람입니다. 관계 지능이 높아 사람들의 마음을 읽고 사로잡는 능력이 있습니다.', keywords: ['매력', '감각', '관계 지능'] },
    5: { nature: '야생마', desc: '야생마의 본성을 가진 당신은 자유로운 영혼의 소유자입니다. 구속을 싫어하고 열정적으로 달려가며, 속도감 있는 삶을 추구합니다.', keywords: ['자유', '열정', '속도감'] },
    15: { nature: '경주마', desc: '상(上) 말과인 경주마는 목표를 향해 질주하는 승부사입니다. 경쟁 속에서 능력을 발휘하며 성취감을 통해 성장합니다.', keywords: ['승부욕', '목표 지향', '성취감'] },
    25: { nature: '명품마', desc: '명품마의 본성을 가진 당신은 품격 있고 우아한 사람입니다. 인정받고 싶은 욕구가 강하며, 외모와 태도에 신경을 많이 씁니다.', keywords: ['품격', '우아함', '인정 욕구'] },
    6: { nature: '양', desc: '양의 본성을 가진 당신은 평화를 사랑하고 공감 능력이 뛰어납니다. 온순한 성격으로 주변에 편안함을 주며, 조화를 추구합니다.', keywords: ['평화', '공감 능력', '온순함'] },
    16: { nature: '산양', desc: '상(上) 양과인 산양은 온화하지만 내면에 강한 고집과 독립심을 가지고 있습니다. 험한 환경에서도 꿋꿋이 자기 길을 갑니다.', keywords: ['독립심', '고집', '인내'] },
    26: { nature: '염소', desc: '염소의 본성을 가진 당신은 소박하고 실용적인 사람입니다. 현실적인 판단력이 뛰어나며, 주어진 환경에서 최선을 다합니다.', keywords: ['소박함', '실용성', '현실감'] },
    7: { nature: '오랑우탄', desc: '오랑우탄의 본성을 가진 당신은 사려 깊고 지적인 사람입니다. 혼자만의 시간을 즐기며, 깊이 있는 사고와 관찰력이 뛰어납니다.', keywords: ['사려 깊음', '지성', '관찰력'] },
    17: { nature: '고릴라', desc: '상(上) 원숭이과인 고릴라는 강력한 힘과 온화한 리더십을 겸비했습니다. 가족과 무리를 보호하며 묵묵히 이끄는 힘이 있습니다.', keywords: ['힘', '온화한 리더십', '보호본능'] },
    27: { nature: '침팬지', desc: '침팬지의 본성을 가진 당신은 적응력과 친화력이 뛰어납니다. 사회성이 좋아 어디서든 잘 어울리며, 유연한 사고를 합니다.', keywords: ['적응력', '친화력', '사회성'] },
    8: { nature: '장미계', desc: '장미계(장미닭)의 본성을 가진 당신은 화려하고 자신감 넘치는 사람입니다. 자기 표현에 능하며, 주변의 시선을 사로잡는 매력이 있습니다.', keywords: ['화려함', '자신감', '자기 표현'] },
    18: { nature: '수탉', desc: '상(上) 닭과인 수탉은 책임감 있고 시간 관념이 철저합니다. 리더의 자리에서 빛나며, 정확하고 성실한 태도로 신뢰를 얻습니다.', keywords: ['책임감', '성실함', '신뢰'] },
    28: { nature: '암탉', desc: '암탉의 본성을 가진 당신은 따뜻하고 헌신적인 사람입니다. 가정과 조직을 돌보는 데 탁월하며, 꼼꼼하고 세심한 배려가 돋보입니다.', keywords: ['헌신', '돌봄', '세심함'] },
    9: { nature: '들개', desc: '들개의 본성을 가진 당신은 독립적 생존력과 현실 전략에 능합니다. 야생의 감각으로 기회를 포착하며 자신만의 방식으로 살아갑니다.', keywords: ['생존력', '현실 감각', '독립성'] },
    19: { nature: '늑대', desc: '상(上) 개과인 늑대는 강한 리더십과 깊은 충성심을 겸비했습니다. 무리를 이끌며 의리를 중시하고, 협력 속에서 힘을 발휘합니다.', keywords: ['리더십', '충성심', '의리'] },
    29: { nature: '강아지', desc: '강아지의 본성을 가진 당신은 순수하고 충성스러운 사람입니다. 사랑받고 싶은 욕구가 강하며, 주변 사람들에게 기쁨을 줍니다.', keywords: ['순수함', '충성', '애교'] },
    10: { nature: '멧돼지', desc: '멧돼지의 본성을 가진 당신은 거침없는 추진력과 강한 생명력을 가지고 있습니다. 목표를 정하면 돌진하며, 어떤 장애물도 뚫고 나갑니다.', keywords: ['추진력', '생명력', '돌파력'] },
    20: { nature: '수돼지', desc: '상(上) 돼지과인 수돼지는 풍요와 관대함을 상징합니다. 베풀기를 좋아하고 호탕한 성격으로, 주변에 사람이 모이는 매력이 있습니다.', keywords: ['풍요', '관대함', '호탕함'] },
    30: { nature: '암돼지', desc: '암돼지의 본성을 가진 당신은 모성애와 포용력이 뛰어난 사람입니다. 가족과 주변을 따뜻하게 돌보며, 현실적이고 실속 있는 삶을 추구합니다.', keywords: ['포용력', '모성애', '실속'] }
};

// 개인 분석 결과 생성
function generatePersonalAnalysisHTML(name, month, day) {
    const country = ANIMORA_COUNTRIES[month];
    const animal = ANIMORA_ANIMALS[day];
    const countryTrait = ANIMORA_COUNTRY_TRAITS[month];
    const animalTrait = ANIMORA_ANIMAL_TRAITS[day] || {
        nature: animal.name,
        desc: animal.emoji + ' ' + animal.name + '의 본성을 가진 당신은 독특한 매력을 가지고 있습니다.',
        keywords: ['독특함', '개성', '매력']
    };

    return `
        <div class="result-card">
            <div class="result-header">
                <h2>개인 성격 분석 결과</h2>
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
                <h3>자라난 환경 (${month}월 - ${country.name})</h3>
                <div class="analysis-content">
                    <p><strong>${countryTrait.environment}</strong></p>
                    <ul class="analysis-list">
                        ${countryTrait.characteristics.map(c => '<li>' + c + '</li>').join('')}
                    </ul>
                    <p class="analysis-warning">주의점: ${countryTrait.challenges}</p>
                </div>
            </div>

            <div class="analysis-section">
                <h3>내면의 본성 (${day}일 - ${animal.name})</h3>
                <div class="analysis-content">
                    <p><strong>${animalTrait.desc}</strong></p>
                    <ul class="analysis-list">
                        ${animalTrait.keywords.map(k => '<li>' + k + '</li>').join('')}
                    </ul>
                </div>
            </div>

            <div class="analysis-section">
                <h3>종합 해석</h3>
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

// 궁합 점수 계산
function calculateAnimoraCompatibility(month1, day1, month2, day2) {
    const monthDiff = Math.abs(month1 - month2);
    const dayDiff = Math.abs(day1 - day2);
    let score = 85;
    score -= monthDiff * 2;
    score -= Math.floor(dayDiff / 5);
    if (month1 === month2) score += 10;
    if (day1 === day2) score += 5;
    return Math.max(60, Math.min(100, score));
}

// 유틸: 음력일로 동물 이름 가져오기
function getAnimoraAnimal(day) {
    return ANIMORA_ANIMALS[day] ? ANIMORA_ANIMALS[day].name : '알 수 없음';
}

// 유틸: 음력월로 나라 이름 가져오기
function getAnimoraCountry(month) {
    return ANIMORA_COUNTRIES[month] ? ANIMORA_COUNTRIES[month].name : '알 수 없음';
}
