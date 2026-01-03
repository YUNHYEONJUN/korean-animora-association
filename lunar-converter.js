// 양력 → 음력 변환 라이브러리
// 간단한 음력 변환 테이블 (2020-2030년)
const lunarData = {
    2020: [2, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2],
    2021: [1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2],
    2022: [1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2],
    2023: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2],
    2024: [2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    2025: [2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    2026: [1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    2027: [2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],
    2028: [1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1],
    2029: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2],
    2030: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
};

// 음력 데이터 (1900-2100년) - 음력 1월 1일이 양력으로 언제인지
const lunarNewYear = {
    2020: new Date(2020, 0, 25),
    2021: new Date(2021, 1, 12),
    2022: new Date(2022, 1, 1),
    2023: new Date(2023, 0, 22),
    2024: new Date(2024, 1, 10),
    2025: new Date(2025, 0, 29),
    2026: new Date(2026, 1, 17),
    2027: new Date(2027, 1, 6),
    2028: new Date(2028, 0, 26),
    2029: new Date(2029, 1, 13),
    2030: new Date(2030, 1, 3)
};

// 각 달의 일수
const monthDays = {
    2020: [29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29],
    2021: [30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30],
    2022: [29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30],
    2023: [30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
    2024: [30, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29],
    2025: [30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30],
    2026: [29, 30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29],
    2027: [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30],
    2028: [29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29],
    2029: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30],
    2030: [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30]
};

/**
 * 양력 날짜를 음력으로 변환
 * @param {number} year - 양력 년도
 * @param {number} month - 양력 월 (1-12)
 * @param {number} day - 양력 일
 * @returns {object} {year, month, day, isLeapMonth}
 */
function solarToLunar(year, month, day) {
    // 지원하지 않는 년도 체크
    if (year < 2020 || year > 2030) {
        return {
            year: year,
            month: month,
            day: day,
            isLeapMonth: false,
            error: '2020년~2030년 사이의 날짜만 변환 가능합니다.'
        };
    }

    const solarDate = new Date(year, month - 1, day);
    const lunarStart = lunarNewYear[year];
    
    // 양력 날짜가 해당 년도 음력 1월 1일보다 이전이면 전년도 음력으로 계산
    if (solarDate < lunarStart) {
        year = year - 1;
        if (year < 2020) {
            return {
                year: year + 1,
                month: 1,
                day: 1,
                isLeapMonth: false,
                error: '변환할 수 없는 날짜입니다.'
            };
        }
    }

    const startDate = lunarNewYear[year];
    const daysDiff = Math.floor((solarDate - startDate) / (1000 * 60 * 60 * 24));
    
    let lunarMonth = 1;
    let lunarDay = 1;
    let remainDays = daysDiff;
    
    const months = monthDays[year];
    
    for (let i = 0; i < months.length; i++) {
        if (remainDays < months[i]) {
            lunarMonth = i + 1;
            lunarDay = remainDays + 1;
            break;
        }
        remainDays -= months[i];
    }

    return {
        year: year,
        month: lunarMonth,
        day: lunarDay,
        isLeapMonth: false
    };
}

/**
 * 날짜를 포맷팅
 */
function formatLunarDate(lunar) {
    if (lunar.error) {
        return `오류: ${lunar.error}`;
    }
    return `음력 ${lunar.year}년 ${lunar.month}월 ${lunar.day}일`;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { solarToLunar, formatLunarDate };
}
