/* ---------- FP 앱: 기록 · 고객 · 내 성과 ---------- */
const RLABEL = {ok:'성공', hold:'보류', no:'거절'};
const CODE = ['','TA','AP','FF·N','PC','PD','R'];
const SC = i => CODE[i] || STAGES[i];
const REASONS = {hold:['연락 안 닿음','다시 연락 요청','고민 중','가족과 상의'], no:['보험 충분','보험료 부담','관심 없음','타사 가입']};
const appBar = (title, sub) => `<div class="app"><h2>${title}${sub ? `<small>${sub}</small>` : ''}</h2><button class="me" data-act="menu" aria-label="내 정보 · 로그아웃">김</button></div>`;
const fpTabs = () => `<nav class="tabs" style="grid-template-columns:repeat(3,1fr)">${[['rec','기록','pen'],['cust','고객','db'],['stats','내 성과','stats']].map(([k, n, icn]) => `<button data-act="go" data-v="${k}" class="${S.view === k ? 'on' : ''}" ${S.view === k ? 'aria-current="page"' : ''}>${ic(icn)}${n}</button>`).join('')}</nav>`;
const status = c => {const l = last(c); if (!l || l.s === 0) return {t:c.own ? '가망 발굴' : '연락 전', k:''}; return {t:`${SC(l.s)} ${STAGES[l.s]} · ${RLABEL[l.r]}`, k:l.r};};
const stBadge = c => {const s = status(c); return `<span class="st st-${s.k || 'none'}">${s.t}</span>`;};
const dueToday = c => same(c.next, TODAY);
const defStage = c => {const l = last(c); return l && l.r !== 'ok' && l.s > 0 ? l.s : Math.min(6, c.max + 1);};
const callBtn = c => `<button class="ic-btn" data-act="call" data-v="${c.id}" aria-label="${esc(c.name)} 고객에게 전화">${ic('phone')}</button>`;
const recBtn = c => `<button class="ic-btn" data-act="pickC" data-v="${c.id}" aria-label="${esc(c.name)} 고객 기록하기">${ic('pen')}</button>`;
const TODAYLOG = [];

/* 고객 고르기 드롭다운 */
const pickOrder = () => customers.slice().sort((a, b) => (dueToday(b) - dueToday(a)) || ((daysAt(b) ?? -1) - (daysAt(a) ?? -1)));
const pickList = q => {const list = pickOrder().filter(c => !q || c.name.includes(q));
  return list.length ? `<div class="drop-l">${list.map(c => `<button class="ck-row ${c.id === S.f.cid ? 'cur' : ''}" data-act="pickC" data-v="${c.id}"><span class="av">${esc(c.name[0])}</span><span style="flex:1"><span class="nm">${esc(c.name)}</span>${dueToday(c) ? ' <span class="hot">오늘 연락</span>' : ''}<br>${stBadge(c)}</span></button>`).join('')}</div>` : '<p class="mt" style="padding:10px 2px">찾는 고객이 없어요.</p>';};
