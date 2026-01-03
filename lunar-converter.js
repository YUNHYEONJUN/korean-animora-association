/**
 * 정확한 양력-음력 변환 라이브러리 (1900-2100년)
 * lunar-javascript 기반
 */

// 음력 데이터 테이블 (1900-2100)
// 각 년도는 12개월(또는 윤달 포함 13개월)의 일수를 비트로 인코딩
// 마지막 4비트는 윤달의 위치를 나타냄
const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
    0x0d520
];

// 양력 기준일: 1900년 1월 31일 = 음력 1900년 1월 1일
const baseDate = new Date(1900, 0, 31);

/**
 * 윤년 여부 확인
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 해당 년도의 윤달 정보 가져오기
 */
function leapMonth(year) {
    return lunarInfo[year - 1900] & 0xf;
}

/**
 * 해당 년도의 윤달 일수
 */
function leapDays(year) {
    if (leapMonth(year)) {
        return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
}

/**
 * 해당 년도의 총 음력 일수
 */
function yearDays(year) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
        sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(year);
}

/**
 * 음력 특정 월의 일수
 */
function monthDays(year, month) {
    return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 양력을 음력으로 변환
 * @param {number} year - 양력 년도 (1900-2100)
 * @param {number} month - 양력 월 (1-12)
 * @param {number} day - 양력 일
 * @returns {object} {year, month, day, isLeapMonth}
 */
function solarToLunar(year, month, day) {
    // 입력 검증
    if (year < 1900 || year > 2100) {
        return {
            year: year,
            month: month,
            day: day,
            isLeapMonth: false,
            error: '1900년~2100년 사이의 날짜만 변환 가능합니다.'
        };
    }

    // 양력 날짜와 기준일 사이의 일수 계산
    const solarDate = new Date(year, month - 1, day);
    let offset = Math.floor((solarDate - baseDate) / 86400000);

    let lunarYear, lunarMonth, lunarDay;
    let isLeapMonth = false;
    
    // 음력 년도 찾기
    for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
        const yearDay = yearDays(lunarYear);
        offset -= yearDay;
    }
    
    if (offset < 0) {
        offset += yearDays(lunarYear - 1);
        lunarYear--;
    }

    // 음력 월 찾기
    const leap = leapMonth(lunarYear);
    for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
        let monthDay;
        
        // 윤달 처리
        if (leap > 0 && lunarMonth === (leap + 1) && !isLeapMonth) {
            lunarMonth--;
            isLeapMonth = true;
            monthDay = leapDays(lunarYear);
        } else {
            monthDay = monthDays(lunarYear, lunarMonth);
        }
        
        offset -= monthDay;
        
        // 윤달 해제
        if (isLeapMonth && lunarMonth === (leap + 1)) {
            isLeapMonth = false;
        }
    }
    
    if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
        if (isLeapMonth) {
            isLeapMonth = false;
        } else {
            isLeapMonth = true;
            lunarMonth--;
        }
    }
    
    if (offset < 0) {
        offset += monthDays(lunarYear, lunarMonth - 1);
        lunarMonth--;
    }
    
    lunarDay = offset + 1;

    return {
        year: lunarYear,
        month: lunarMonth,
        day: lunarDay,
        isLeapMonth: isLeapMonth
    };
}

/**
 * 날짜를 포맷팅
 */
function formatLunarDate(lunar) {
    if (lunar.error) {
        return `오류: ${lunar.error}`;
    }
    const leapText = lunar.isLeapMonth ? ' (윤달)' : '';
    return `음력 ${lunar.year}년 ${lunar.month}월 ${lunar.day}일${leapText}`;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { solarToLunar, formatLunarDate };
}
