const TODAY = new Date('2026-11-24T09:00:00');
const STAGES = ['가망 발굴','고객 접촉','상담 약속','니즈 파악','설계 제안','청약','소개'];
const SHORT = ['발굴','접촉','약속','니즈','제안','청약','소개'];
const AXES = [
  {k:'act',n:'TA 접촉률',p:'TA 접촉률',d:'배정 DB 중 TA 된 고객',rx:'TA ÷ 배정 DB',tip:'일일 연락 목표를 정하고 배정 고객 유형을 SM과 점검',say:'배정 고객에게 연락이 덜 닿고 있어요.',todo:'하루 연락 목표를 SM과 함께 정해보세요.'},
  {k:'appt',n:'AP 전환율',p:'AP 전환율',d:'TA가 AP로',rx:'AP ÷ TA',tip:'첫 연락 문구와 연락 시간대 교육',say:'연락은 잘 되는데, 만남 약속으로 잘 안 이어져요.',todo:'첫 통화 문구와 연락 시간대를 바꿔보세요.'},
  {k:'need',n:'FF·N 파악률',p:'FF·N 파악률',d:'AP에서 FF·N까지',rx:'FF·N ÷ AP',tip:'보장분석 체크리스트, 질문 화법 카드',say:'만나도 고객의 보장 고민을 끌어내기가 어려워요.',todo:'보장분석 체크리스트를 들고 만나보세요.'},
  {k:'pc',n:'PC 제안율',p:'PC 제안율',d:'FF·N이 PC로',rx:'PC ÷ FF·N',tip:'니즈 들은 자리에서 설계안 일정 잡기 화법',say:'고민은 들었는데 설계안까지 이어지지 않아요.',todo:'고민 들은 자리에서 설계안 보여줄 날을 잡아 보세요.'},
  {k:'close',n:'PD 체결률',p:'PD 체결률',d:'PC가 PD로',rx:'PD ÷ PC',tip:'상품군 판매 키트 재학습과 멘토 FP 동행 상담',say:'약속까지는 잘 가는데, 설계안을 보여준 뒤 계약으로 잘 안 넘어가요.',todo:'멘토 FP와 동행 상담을 한 번 해보세요.'},
  {k:'ref',n:'R 소개율',p:'R 소개율',d:'PD 고객의 R',rx:'R ÷ PD',tip:'계약 후 관리 루틴, 소개 요청 화법',say:'계약 고객에게서 소개가 잘 안 나와요.',todo:'계약 한 달 뒤 안부 연락 때 소개를 부탁해보세요.'},
  {k:'cons',n:'기록률',p:'기록률',d:'영업일 중 기록한 날',rx:'기록일 ÷ 영업일',tip:'SM 주간 체크인, 매일 저녁 내일 계획 쓰기',say:'기록이 띄엄띄엄해서 흐름을 보기 어려워요.',todo:'퇴근 전에 내일 연락할 고객만 골라두세요.'}];
const CO = {act:.62,appt:.38,need:.70,pc:.74,close:.30,ref:.25,cons:.60};
const BR = {act:.66,appt:.40,need:.72,pc:.78,close:.33,ref:.28,cons:.66};

/* FP는 행동만 고르고, 단계·결과는 뒤에서 저장.
   본사 DB = 기존 계약자 유지관리 콜("담당 FP입니다, 요즘 어떠세요?") → 니즈가 나오면 보장 점검·추가 계약으로 이어짐.
   to: 성공이면 어느 단계까지 마쳤는지 · keep: 단계는 그대로 두고 기록만(서비스 요청·약속 확인)
   appt: 약속 날짜를 받는 보기 · hot: '니즈 있음' 표시 · stop: 연락 거부
   청약 완료는 청약 시스템에서 자동으로 들어오므로 FP 보기에 없음 */
const SVC = {l:'도와드릴 일이 생겼어요',r:'ok',keep:1,svc:1};
const NOANS = {l:'안 받으셨어요',r:'hold',why:'부재'};
/* 통화 직후: '통화됐어요'를 고른 다음 보여주는 보기 */
const CALL = {
  1:[{l:'인사드리고 근황 들었어요',r:'ok',to:1},{l:'보장 고민이 있대요',r:'ok',to:1,hot:1},{l:'보장 점검 약속 잡았어요',r:'ok',to:2,appt:1},{l:'다음에 통화하재요',r:'hold',why:'다시 연락 요청'},{l:'연락 원치 않으세요',r:'no',why:'연락 거부',stop:1}],
  2:[{l:'보장 점검 약속 잡았어요',r:'ok',to:2,appt:1},{l:'보장 고민이 있대요',r:'ok',keep:1,hot:1},{l:'다음에 통화하재요',r:'hold',why:'다시 연락 요청'},{l:'만나기는 어렵대요',r:'no',why:'관심 없음'}],
  3:[{l:'약속 확인했어요',r:'ok',keep:1,keepAppt:1},{l:'약속 날짜를 바꿨어요',r:'hold',why:'약속 연기',appt:1},{l:'통화로 고민을 들었어요',r:'ok',to:3},{l:'약속을 취소하재요',r:'hold',why:'약속 취소'}],
  4:[{l:'통화로 설계안을 설명했어요',r:'ok',to:4},{l:'설계안 보여줄 약속 잡았어요',r:'hold',why:'설계안 미팅',appt:1},{l:'자료를 더 원해요',r:'hold',why:'고민 중'},{l:'관심 없대요',r:'no',why:'관심 없음'}],
  5:[{l:'청약 날짜를 잡았어요',r:'hold',why:'청약 예정',appt:1},{l:'가족과 상의 중이에요',r:'hold',why:'가족과 상의'},{l:'보험료가 부담된대요',r:'hold',why:'보험료 부담'},{l:'안 하기로 했어요',r:'no',why:'보험료 부담'}],
  6:[{l:'소개를 받았어요',r:'ok',to:6},{l:'안부 전했어요',r:'hold',why:'다시 연락 요청'}]};
const CALL_OWN1 = [{l:'통화했어요',r:'ok',to:1},{l:'통화하고 약속까지 잡았어요',r:'ok',to:2,appt:1},{l:'나중에 다시 달래요',r:'hold',why:'다시 연락 요청'},{l:'관심 없대요',r:'no',why:'관심 없음'}];
/* 만남 후 · 고객 상세에서 기록할 때 */
const MEET = {
  1:[{l:'인사드리고 근황 들었어요',r:'ok',to:1},{l:'보장 점검 약속 잡았어요',r:'ok',to:2,appt:1},{l:'연락이 안 돼요',r:'hold',why:'부재'},{l:'다음에 연락하재요',r:'hold',why:'다시 연락 요청'},{l:'연락 원치 않으세요',r:'no',why:'연락 거부',stop:1}],
  2:[{l:'만날 약속 잡았어요',r:'ok',to:2,appt:1},{l:'다시 연락하기로 했어요',r:'hold',why:'다시 연락 요청'},{l:'연락이 안 돼요',r:'hold',why:'부재'},{l:'만나기는 어렵대요',r:'no',why:'관심 없음'}],
  3:[{l:'만나서 고민을 들었어요',r:'ok',to:3},{l:'고민 듣고 설계안까지 보여줬어요',r:'ok',to:4},{l:'약속이 미뤄졌어요',r:'hold',why:'약속 연기',appt:1},{l:'보험이 충분하대요',r:'no',why:'보험 충분'}],
  4:[{l:'설계안을 보여줬어요',r:'ok',to:4},{l:'자료를 더 원해요',r:'hold',why:'고민 중'},{l:'관심 없대요',r:'no',why:'관심 없음'}],
  5:CALL[5],
  6:[{l:'소개를 받았어요',r:'ok',to:6},{l:'안부 전했어요',r:'hold',why:'다시 연락 요청'}]};
const MEET_OWN1 = [{l:'통화했어요',r:'ok',to:1},{l:'통화하고 약속까지 잡았어요',r:'ok',to:2,appt:1},{l:'연락이 안 돼요',r:'hold',why:'부재'},{l:'나중에 다시 달래요',r:'hold',why:'다시 연락 요청'},{l:'관심 없대요',r:'no',why:'관심 없음'}];
const OKL = {0:'가망고객으로 등록',1:'인사드리고 근황 들었어요',2:'보장 점검 약속 잡았어요',3:'만나서 고민을 들었어요',4:'설계안을 보여줬어요',5:'청약 완료',6:'소개를 받았어요'};

const I = {
  back:'<path d="M15 5l-7 7 7 7"/>', next:'<path d="M9 5l7 7-7 7"/>', down:'<path d="M12 5v14M6 13l6 6 6-6"/>', chev:'<path d="M6 9l6 6 6-6"/>',
  alert:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>', check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  user:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>', out:'<path d="M14 5h4a1 1 0 011 1v12a1 1 0 01-1 1h-4M10 16l-4-4 4-4M6 12h10"/>',
  today:'<path d="M4 6h16v14H4zM4 10h16M9 3v5M15 3v5"/>', db:'<circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.4 3-5 6-5s5.4 1.6 6 5M16 5.5a3 3 0 010 5.6M18 14c1.6.6 2.6 2.2 3 5"/>',
  stats:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>', phone:'<path d="M6 3h3l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v3a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z"/>',
  hang:'<path d="M3 14c5-4.5 13-4.5 18 0l-2 3-4-1.5v-2.5a10 10 0 00-6 0v2.5L5 17z"/>', pen:'<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  team:'<circle cx="8" cy="9" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M14 14.6c2.6-.4 5 1 5.6 4.4"/>',
  inbox:'<path d="M4 13l2.5-8h11L20 13v6H4zM4 13h5l1 2h4l1-2h5"/>', hex:'<path d="M12 3l8 4.6v8.8L12 21l-8-4.6V7.6z"/><path d="M12 8l4 2.3v4.4L12 17l-4-2.3v-4.4z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>', cal:'<path d="M4 6h16v14H4zM4 10h16M9 3v5M15 3v5"/>',
  undo:'<path d="M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-2"/>', sync:'<path d="M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5"/>'};
const ic = (k, st) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"${st ? ` style="${st}"` : ''}>${I[k]}</svg>`;

let seed = 7;
const rnd = () => {seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;};
const pick = a => a[Math.floor(rnd() * a.length)];
const D = (m, d, y = 2026) => new Date(y, m - 1, d, 9);
const day = n => D(11, n);
const addDays = n => new Date(TODAY.getTime() + n * 864e5);
const same = (a, b) => !!a && !!b && a.toDateString() === b.toDateString();
const WD = '일월화수목금토';
const fmt = d => `${d.getMonth() + 1}.${d.getDate()}`;
const fmtW = d => `${fmt(d)}(${WD[d.getDay()]})`;
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct = v => Math.round(v * 100) + '%';
const mask = n => n[0] + 'O' + n.slice(2);

/* 11월 배정 DB 30명 + 10월부터 이어진 고객 */
const SUR = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권','황'];
const GIV = ['민지','서연','지훈','현우','수아','영호','은지','하늘','도윤','유진','진영','혜원','준호','경미','미숙','소영','상철','정희'];
const WHY = ['건강보험','종신보험','연금보험','실손보험','자녀보험','암보험'];
const PROB = [1,.72,.48,.36,.27,.08,.03];
const H = (d, s, r, l, why = '', memo = '', auto = false) => ({d, s, r, l, why, memo, auto});
const customers = [], used = new Set(['김은희','이서연','최현우','박미숙','이상철','강지훈','정하늘']);
const uniq = () => {let n; do n = pick(SUR) + pick(GIV); while (used.has(n)); used.add(n); return n;};
for (let i = 0; i < 30; i++) {
  const c = {id:i, mon:11, name:uniq(), age:pick(['30대','30대','40대','40대','50대','60대']), sex:pick(['여','남']), why:'보유 ' + pick(WHY), have:1 + Math.floor(rnd() * 2), hist:[], max:0, next:null, appt:null, missed:false};
  let m = 0; for (let s = 1; s < 7; s++) {if (rnd() < PROB[s] / PROB[s - 1]) m = s; else break;}
  let d = 3 + Math.floor(rnd() * 5);
  if (rnd() < .3 || m > 0) c.hist.push(m >= 1 ? H(day(d), 1, 'ok', OKL[1]) : H(day(d), 1, 'hold', '안 받으셨어요', '부재'));
  for (let s = 2; s <= m; s++) {d = Math.min(23, d + 1 + Math.floor(rnd() * 4)); c.hist.push(H(day(d), s, 'ok', OKL[s], '', s === 3 ? '자녀 보험 관심, 배우자 건강보험 비교 원함' : '', s === 5));}
  if (m >= 1 && m < 5 && rnd() < .45) {const r = rnd() < .65 ? 'hold' : 'no'; d = Math.min(23, d + 1 + Math.floor(rnd() * 3)); const o = MEET[m + 1].find(x => x.r === r && !x.appt && !x.stop) || MEET[m + 1].find(x => x.r !== 'ok' && !x.stop); c.hist.push(H(day(d), m + 1, o.r, o.l, o.why));}
  c.max = m;
  const last = c.hist.at(-1);
  if (last && last.r !== 'no' && m < 5 && rnd() < .3) c.next = day(24);
  customers.push(c);
}
Object.assign(customers[2], {name:'김은희', age:'40대', sex:'여', why:'보유 자녀보험', max:4, next:day(24), appt:null, hist:[
  H(day(6), 1, 'ok', '보장 고민이 있대요', '', '초등 2학년 자녀, 본인 건강보장이 걱정. 오후 4시 이후 통화 선호'), H(day(10), 2, 'ok', OKL[2]),
  H(day(13), 3, 'ok', OKL[3], '', '자녀 보험 있음, 본인 여성 건강 보장 부족'), H(day(17), 4, 'ok', OKL[4], '', '건강보험 2안 제안'),
  H(day(21), 5, 'hold', '가족과 상의 중이에요', '가족과 상의', '남편과 상의 후 연락 주기로')]});
Object.assign(customers[5], {name:'이서연', age:'30대', sex:'여', why:'보유 실손보험', max:2, next:null, appt:{d:day(24), t:'14:00'}, hist:[
  H(day(18), 1, 'ok', OKL[1]), H(day(18), 2, 'ok', OKL[2], '', '실손 개편 문의 · 회사 근처 카페에서 점심 이후')]});
Object.assign(customers[8], {name:'최현우', age:'40대', sex:'남', why:'보유 종신보험', max:4, next:null, appt:{d:day(26), t:'10:00'}, hist:[
  H(day(12), 1, 'ok', OKL[1]), H(day(16), 2, 'ok', OKL[2]), H(day(20), 3, 'ok', OKL[3]), H(day(20), 4, 'ok', '고민 듣고 설계안까지 보여줬어요', '', '종신 대신 정기+건강 조합 선호'),
  H(day(23), 5, 'hold', '청약 날짜를 잡았어요', '청약 예정')]});
[
  {name:'박미숙', age:'50대', sex:'여', why:'보유 연금보험', max:3, next:day(24), hist:[H(D(10, 8), 1, 'ok', OKL[1]), H(D(10, 15), 2, 'ok', OKL[2]), H(D(10, 22), 3, 'ok', OKL[3]), H(day(10), 4, 'hold', '자료를 더 원해요', '고민 중', '실손 전환 비교표 요청')]},
  {name:'이상철', age:'60대', sex:'남', why:'보유 암보험', max:1, next:day(27), hist:[H(D(10, 20), 1, 'ok', OKL[1]), H(D(10, 27), 2, 'hold', '다음에 통화하재요', '다시 연락 요청')]},
  {name:'강지훈', age:'40대', sex:'남', why:'보유 실손보험', max:5, next:null, hist:[H(D(10, 6), 1, 'ok', OKL[1]), H(D(10, 9), 2, 'ok', OKL[2]), H(D(10, 14), 3, 'ok', OKL[3]), H(D(10, 14), 4, 'ok', '고민 듣고 설계안까지 보여줬어요'), H(day(18), 5, 'ok', OKL[5], '', '건강보험 월 8.2만 원', true)]},
  {name:'정하늘', age:'30대', sex:'여', why:'보유 건강보험', max:2, next:null, hist:[H(D(10, 25), 1, 'ok', OKL[1]), H(day(3), 2, 'ok', OKL[2]), H(day(9), 3, 'hold', '약속이 미뤄졌어요', '약속 연기')]}
].forEach(o => customers.push({id:customers.length, mon:10, have:1, appt:null, missed:false, ...o}));

/* 지난 11개월 + 이번 달 */
const MONTHS = [];
for (let i = 11; i >= 1; i--) {
  const g = 1 - i * .02, a = 30;
  const ct = Math.round(a * (.62 + rnd() * .14) * g), ap = Math.round(ct * (.42 + rnd() * .1)), nd = Math.round(ap * (.7 + rnd() * .12)), pr = Math.round(nd * (.72 + rnd() * .1)), cl = Math.max(1, Math.round(pr * (.12 + rnd() * .1))), rf = Math.round(cl * (rnd() * .5));
  MONTHS.push({m:new Date(2026, 10 - i, 1).getMonth() + 1, f:[a, ct, ap, nd, pr, cl, rf], rec:Math.round(12 + rnd() * 7), work:21});
}
const fpDay = d => customers.some(c => c.hist.some(h => !h.auto && same(h.d, d)));
const cur = {m:11, f:[], rec:14, work:17};
const syncCur = () => {const mine = customers.filter(c => c.mon === 11); cur.f = STAGES.map((_, s) => mine.filter(c => s === 0 || c.max >= s).length); cur.rec = 14 + (fpDay(TODAY) ? 1 : 0);};
syncCur(); MONTHS.push(cur);

/* 일정: 지점·본사 교육, 지점 일정, 개인 일정 (고객 면담은 고객의 약속에서, SM 1:1은 SM이 잡은 일정에서 가져옴) */
const EVENTS = [
  {d:day(23), t:'08:30', ty:'br', ti:'아침 조회'}, {d:day(24), t:'08:30', ty:'br', ti:'아침 조회'},
  {d:day(24), t:'10:00', ty:'edu', ti:'신상품 교육 · 간병보험', sub:'본사 줌'},
  {d:day(25), t:'08:30', ty:'br', ti:'아침 조회'}, {d:day(26), t:'08:30', ty:'br', ti:'아침 조회'},
  {d:day(26), t:'13:00', ty:'edu', ti:'판매 키트 실습 · 자녀·가족 보장', sub:'지점 교육장'},
  {d:day(27), t:'08:30', ty:'br', ti:'아침 조회'}, {d:day(27), t:'17:00', ty:'br', ti:'주간 마감 회의'}];
const WHEN = {'내일 오전':[1, '10:00'], '내일 오후':[1, '15:00'], '목 오후':[2, '15:00'], '금 오전':[3, '10:00']};
/* 월초에 잡아둔 이번 주 면담 몇 건 */
customers.filter((c, i) => i !== 2 && i !== 5 && i !== 8 && c.max === 1 && c.hist.at(-1).r === 'ok').slice(0, 5).forEach((c, k) => {
  c.hist.push(H(day(19 + k % 3), 2, 'ok', OKL[2])); c.max = 2; c.next = null;
  c.appt = [{d:day(23), t:'15:00'}, {d:day(24), t:'16:30'}, {d:day(25), t:'11:00'}, {d:day(25), t:'15:00'}, {d:day(27), t:'14:00'}][k];
});
syncCur();
const TEAM = [
  {n:'최윤진',t:'8개월 차',r:{act:.70,appt:.30,need:.68,pc:.80,close:.35,ref:.22,cons:.72},sig:''},
  {n:'한민수',t:'3개월 차 · 1기',r:{act:.40,appt:.36,need:.70,pc:.74,close:.28,ref:.10,cons:.32},sig:'2주 연속 기록 없음'},
  {n:'오정미',t:'26개월 차 · 멘토',r:{act:.74,appt:.46,need:.80,pc:.86,close:.42,ref:.40,cons:.85},sig:''},
  {n:'정우훈',t:'5개월 차 · 1기',r:{act:.66,appt:.44,need:.74,pc:.52,close:.12,ref:.15,cons:.60},sig:'PC 단계 4주 정체'},
  {n:'윤서아',t:'11개월 차',r:{act:.45,appt:.39,need:.71,pc:.77,close:.31,ref:.25,cons:.55},sig:'TA 급감'}];
const requests = [{who:'정우훈',ax:'PD 체결률',when:'목 오후',memo:'PC까지는 가는데 PD가 안 나와요',st:'new'}];
const meetings = [];

const S = {wk:0, user:null, view:'rec', f:null, cust:null, period:3, cf:'all', src:'all', q:'', sheet:null, call:null, toast:'', sent:false, smFp:null, smNote:'', err:'', from:'cust', more:false, del:null};

/* 계산 */
const last = c => c.hist.at(-1);
const isNo = c => !!last(c) && last(c).r === 'no';
const maxOf = c => Math.max(0, ...c.hist.filter(h => h.r === 'ok').map(h => h.s));
const daysAt = c => last(c) ? Math.round((TODAY - last(c).d) / 864e5) : null;
const where = c => {const l = last(c); if (c.stop) return '연락 거부'; if (l && l.r === 'no') return '거절'; return STAGES[c.max];};
const nextAct = c => {const l = last(c); if (c.stop) return '연락 거부'; if (l && l.r === 'no') return '거절'; if (c.max === 0) return c.own ? '첫 연락하기' : '연락 전';
  return ['', c.hot ? '약속 잡기' : '약속 잡기', '면담하기', '설계안 보여주기', l.s === 5 ? '청약 기다리는 중' : '청약 받기', '소개 부탁하기', '관리하기'][c.max];};
const rail = c => {const l = last(c); return `<span class="rail" aria-hidden="true">${STAGES.map((_, i) => `<i class="${l && i === l.s && l.r !== 'ok' ? l.r : i <= c.max ? 'f' : ''}"></i>`).join('')}</span>`;};
const stageOf = c => Math.min(6, c.max + 1);
const apptTxt = a => `${same(a.d, TODAY) ? '오늘' : fmtW(a.d)} ${a.t}`;
const agg = period => {
  const ms = MONTHS.slice(-period), f = STAGES.map((_, s) => ms.reduce((t, m) => t + m.f[s], 0));
  const rec = ms.reduce((t, m) => t + m.rec, 0), work = ms.reduce((t, m) => t + m.work, 0);
  return {f, raw:{act:f[1] / f[0], appt:f[2] / f[1], need:f[3] / f[2], pc:f[4] / f[3], close:f[5] / f[4], ref:f[6] / Math.max(1, f[5]), cons:rec / work}, low:{close:f[4] < 5, ref:f[5] < 3}};
};
const score = (v, k) => Math.max(4, Math.min(98, Math.round(50 + 45 * Math.tanh((v / CO[k] - 1) * 1.6))));
const scores = raw => Object.fromEntries(AXES.map(a => [a.k, score(raw[a.k], a.k)]));
const weakOf = (raw, low = {}) => {const sc = scores(raw); return AXES.filter(a => !low[a.k]).sort((a, b) => sc[a.k] - sc[b.k])[0];};
const level = (raw, k) => {const r = raw[k] / BR[k]; return r < .9 ? ['낮음','p-lo'] : r > 1.1 ? ['높음','p-hi'] : ['비슷','p-mid'];};
