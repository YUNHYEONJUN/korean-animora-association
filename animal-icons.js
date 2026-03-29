/**
 * 아니모라 12종 동물 SVG 라인아트 아이콘
 * stroke="currentColor", fill="none", stroke-width="2"
 * 24x24 viewBox 기준 미니멀 스타일
 */

const ANIMORA_ICONS = {
    tiger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><path d="M4 4l2 4M20 4l-2 4"/><circle cx="12" cy="13" r="7"/><circle cx="9.5" cy="11.5" r="1"/><circle cx="14.5" cy="11.5" r="1"/><path d="M10 15.5c.5.5 1 .7 2 .7s1.5-.2 2-.7"/><path d="M12 13v2"/><path d="M8 8l1.5 1M16 8l-1.5 1"/><path d="M6.5 14h-1M17.5 14h1"/></svg>`,

    rabbit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><ellipse cx="12" cy="15" rx="6" ry="5"/><path d="M9 10c-.5-4-1-7.5-2.5-8.5C5.5.8 5.5 3 6 5.5c.3 1.5.8 3 1.5 4.5"/><path d="M15 10c.5-4 1-7.5 2.5-8.5 1-.7 1 1.5.5 4-.3 1.5-.8 3-1.5 4.5"/><circle cx="10" cy="14" r=".8"/><circle cx="14" cy="14" r=".8"/><path d="M11 16.5c.3.3.6.5 1 .5s.7-.2 1-.5"/><path d="M12 15v1.5"/></svg>`,

    dragon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><path d="M6 12c0-4 3-8 6-8s6 4 6 8"/><path d="M6 12c-1 2 0 5 2 7h8c2-2 3-5 2-7"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M10 15c.7.7 1.3 1 2 1s1.3-.3 2-1"/><path d="M8 4l-2-2M16 4l2-2"/><path d="M5 9c-1.5-.5-3 0-3.5 1M19 9c1.5-.5 3 0 3.5 1"/><path d="M9 6l.5-1.5M15 6l-.5-1.5M12 5v-2"/></svg>`,

    snake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><path d="M4 18c0-2 2-3 4-3s3 1.5 4 1.5 2-.5 3-1.5c1.5-1.5 2-3.5 2-5.5 0-2.5-1-4.5-3-5.5"/><circle cx="12.5" cy="4.5" r="2.5"/><circle cx="11.5" cy="4" r=".5" fill="currentColor"/><circle cx="13.5" cy="4" r=".5" fill="currentColor"/><path d="M11.5 6c.3.2.6.3 1 .3s.7-.1 1-.3"/><path d="M2 20c1-1 2-2 4-2"/></svg>`,

    horse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><path d="M17 3c1 1 2 3 2 5v3c0 2-1 4-3 5l-1 4h-2l1-4"/><path d="M8 20l1-4c-2-1-3-3-3-5V8c0-2 1-4 3-5"/><path d="M9 3c-1 0-2 .5-2.5 1.5"/><path d="M17 3c.5 0 1.5.5 2 2"/><circle cx="11" cy="8" r=".8"/><path d="M9 11.5c.5.5 1 .7 1.5.7"/><path d="M14 3v-1.5M16 3.5l1-1.5"/><path d="M8 20h2M13 20h2"/></svg>`,

    sheep: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><ellipse cx="12" cy="14" rx="7" ry="5"/><circle cx="12" cy="8" r="4"/><circle cx="10.5" cy="7.5" r=".7"/><circle cx="13.5" cy="7.5" r=".7"/><path d="M11 10c.3.3.6.4 1 .4s.7-.1 1-.4"/><path d="M8 5c-1-1.5-2.5-2-3-1M16 5c1-1.5 2.5-2 3-1"/><path d="M7 18v2M17 18v2"/><circle cx="7" cy="11" r="1.5"/><circle cx="17" cy="11" r="1.5"/><circle cx="9" cy="9.5" r="1"/><circle cx="15" cy="9.5" r="1"/></svg>`,

    monkey: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><circle cx="12" cy="12" r="7"/><circle cx="4" cy="11" r="2.5"/><circle cx="20" cy="11" r="2.5"/><circle cx="10" cy="10.5" r="1"/><circle cx="14" cy="10.5" r="1"/><ellipse cx="12" cy="14.5" rx="3" ry="2"/><path d="M11 14c.3.3.6.4 1 .4s.7-.1 1-.4"/><path d="M12 13v1"/></svg>`,

    rooster: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><ellipse cx="12" cy="14" rx="5" ry="6"/><circle cx="12" cy="7" r="3.5"/><circle cx="11" cy="6.5" r=".7"/><path d="M10 9c.5.4 1 .6 1.5.6"/><path d="M12 3.5c-.5-1.5 0-2.5 1-2.5s1.5 1 1 2.5"/><path d="M14.5 3c.5-1 1.5-1 2-.2"/><path d="M15 7.5c1 .3 2 0 2.5-.8"/><path d="M9 19l-1 3M15 19l1 3"/><path d="M8 20h2M14 20h2"/></svg>`,

    dog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><ellipse cx="12" cy="14" rx="6" ry="5.5"/><circle cx="12" cy="8" r="4"/><path d="M8 5l-3-3.5"/><path d="M16 5l3-3.5"/><circle cx="10.5" cy="7.5" r=".8"/><circle cx="13.5" cy="7.5" r=".8"/><ellipse cx="12" cy="10" rx="1.5" ry="1" fill="currentColor"/><path d="M10.5 10.5c.4.4.9.6 1.5.6s1.1-.2 1.5-.6"/><path d="M18 15c1.5 1 2.5 1.5 3 .5"/></svg>`,

    pig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><ellipse cx="12" cy="13" rx="7" ry="6"/><ellipse cx="12" cy="14" rx="3" ry="2.2"/><circle cx="11" cy="13.5" r=".5" fill="currentColor"/><circle cx="13" cy="13.5" r=".5" fill="currentColor"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M7 7c-1-1.5-.5-3 .5-3"/><path d="M17 7c1-1.5.5-3-.5-3"/><path d="M18 16c1 .5 1.5-.5 1-1.5"/></svg>`,

    rat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><ellipse cx="12" cy="14" rx="6" ry="5"/><circle cx="12" cy="9" r="4"/><circle cx="10" cy="8.5" r=".7"/><circle cx="14" cy="8.5" r=".7"/><path d="M11 11c.3.3.6.4 1 .4s.7-.1 1-.4"/><circle cx="12" cy="10.5" rx=".8" ry=".5" fill="currentColor"/><path d="M8 6c-2-2-4-1.5-4 0s2 2 3.5 1.5"/><path d="M16 6c2-2 4-1.5 4 0s-2 2-3.5 1.5"/><path d="M6.5 16c-1 2-2 3.5-3.5 3"/><path d="M15 11h2M17 10h1.5"/><path d="M9 11h-2M7 10h-1.5"/></svg>`,

    ox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="animora-icon"><ellipse cx="12" cy="14" rx="6" ry="5.5"/><circle cx="12" cy="8.5" r="4"/><circle cx="10" cy="8" r=".8"/><circle cx="14" cy="8" r=".8"/><ellipse cx="12" cy="10.5" rx="2" ry="1.2"/><path d="M11 10.5c.3.2.6.3 1 .3s.7-.1 1-.3"/><path d="M7 5.5c-2-1.5-3.5-.5-3 1"/><path d="M17 5.5c2-1.5 3.5-.5 3 1"/><path d="M8 19v2M16 19v2"/></svg>`
};

// 나라번호 → 동물 아이콘 매핑 (12개월)
const COUNTRY_ICON_MAP = {
    1: 'tiger',
    2: 'rabbit',
    3: 'dragon',
    4: 'snake',
    5: 'horse',
    6: 'sheep',
    7: 'monkey',
    8: 'rooster',
    9: 'dog',
    10: 'pig',
    11: 'rat',
    12: 'ox'
};

// SVG 아이콘 가져오기
function getAnimalIcon(key) {
    return ANIMORA_ICONS[key] || '';
}

// 나라 번호로 아이콘 가져오기
function getCountryIcon(monthNum) {
    const iconKey = COUNTRY_ICON_MAP[monthNum];
    return iconKey ? ANIMORA_ICONS[iconKey] : '';
}
