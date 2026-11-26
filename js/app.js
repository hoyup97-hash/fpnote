/* ---------- 렌더 ---------- */
const phone = document.getElementById('phone');
function render(keep) {
  const scr = phone.querySelector('.scr'), top = keep && scr ? scr.scrollTop : 0;
  let body, nav = '';
  if (!S.user) body = vLogin();
  else if (S.user === 'fp') {body = {rec:vRec, cust:vCust, stats:vStats}[S.view](); nav = fpTabs();}
  else {body = S.smFp !== null ? vSmFp() : {team:vSmTeam, req:vSmReq, tana:vSmAna}[S.smView](); nav = smTabs();}
  const sh = S.sheet ? (S.sheet.menu ? sheetMenu() : sheetAdd()) : '';
  const call = S.call !== null ? `<div class="call" role="dialog" aria-label="통화 중"><span class="av">${esc(customers[S.call].name[0])}</span><b>${esc(customers[S.call].name)}</b><span>통화 중 · 00:42</span><button data-act="hang" aria-label="통화 종료">${ic('hang')}</button><span style="margin-top:10px;font-size:13px">시안: 실제 앱에서는 휴대폰 전화로 연결돼요</span></div>` : '';
  phone.innerHTML = S.user ? `<div class="scr">${body}</div>${nav}${sh}${call}${S.toast ? `<div class="toast" role="status">${ic('check')}${esc(S.toast)}</div>` : ''}` : body;
  const n = phone.querySelector('.scr'); if (n) n.scrollTop = top;
}
let tt;
const toast = m => {S.toast = m; render(true); clearTimeout(tt); tt = setTimeout(() => {S.toast = ''; render(true);}, 2400);};
const firstUp = () => {const d = pickOrder().find(c => dueToday(c) && !TODAYLOG.some(x => x.cid === c.id)); return (d || pickOrder()[0]).id;};
const newForm = cid => {if (cid === null) cid = firstUp(); return {cid, s:defStage(customers[cid]), r:null, why:'', nx:'', memo:'', open:false, q:''};};
const login = u => {Object.assign(S, {user:u, view:'rec', smView:'team', smFp:null, sheet:null, call:null, err:'', f:newForm(null)}); render();};
const NX = {'내일':1,'3일 후':3,'1주 후':7};
const openRec = id => {S.view = 'rec'; S.f = newForm(id); S.sheet = null; render();};

phone.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('uid').value.trim().toUpperCase();
  if (/^FP\d+/.test(id)) login('fp'); else if (/^SM\d+/.test(id)) login('sm');
  else {S.err = id ? '사번은 FP 또는 SM으로 시작해요. 예: FP2041' : '사번을 입력해주세요.'; render();}
});
phone.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act, v = t.dataset.v;
  if (a === 'close' && e.target !== t) return;
  const memo = document.getElementById('memo'); if (memo && S.f) S.f.memo = memo.value;
  if (a === 'as') login(v);
  else if (a === 'menu') {S.sheet = {menu:true}; render(true);}
  else if (a === 'logout') {Object.assign(S, {user:null, sheet:null}); render();}
  else if (a === 'go') {S.view = v; render();}
  else if (a === 'close') {S.sheet = null; render(true);}
  /* 기록 */
  else if (a === 'chooseC') {S.f.open = !S.f.open; S.f.q = ''; render(true);}
  else if (a === 'pickC') openRec(+v);
  else if (a === 'fs') {S.f.s = +v; render(true);}
  else if (a === 'fr') {S.f.r = v; S.f.why = ''; render(true);}
  else if (a === 'fw') {S.f.why = v; render(true);}
  else if (a === 'fn') {S.f.nx = S.f.nx === v ? '' : v; render(true);}
  else if (a === 'save') {
    const f = S.f, c = customers[f.cid]; if (!f.s || !f.r || (f.r !== 'ok' && !f.why)) return;
    const h = H(new Date(TODAY), f.s, f.r, `${STAGES[f.s]} ${RLABEL[f.r]}`, f.r === 'ok' ? '' : f.why, f.memo || '');
    TODAYLOG.push({cid:c.id, h, prev:{max:c.max, next:c.next}});
    c.hist.push(h); c.max = maxOf(c);
    if (f.nx) c.next = f.nx === '없음' ? null : addDays(NX[f.nx]); else if (same(c.next, TODAY)) c.next = null;
    syncCur(); S.f = newForm(null); toast(`${c.name} 고객 · ${SC(h.s)} ${RLABEL[h.r]} 저장했어요`);
  }
  else if (a === 'undo') {const x = TODAYLOG.pop(), c = customers[x.cid]; c.hist.splice(c.hist.indexOf(x.h), 1); c.max = x.prev.max; c.next = x.prev.next; syncCur(); toast('방금 기록을 되돌렸어요');}
  /* 전화 */
  else if (a === 'call') {S.call = +v; render(true);}
  else if (a === 'hang') {const id = S.call; S.call = null; openRec(id); toast('통화 결과를 입력해주세요');}
  /* 고객 */
  else if (a === 'cf') {S.cf = v; render(true);}
  else if (a === 'addSheet') {S.sheet = {add:{src:'지인', tmr:true}}; render(true);}
  else if (['npSrc','npAge','npAgree','npTmr','npSave'].includes(a)) {
    const f = S.sheet.add; f.name = document.getElementById('npName').value.trim(); f.tel = document.getElementById('npTel').value.trim();
    if (a === 'npSrc') f.src = v; else if (a === 'npAge') f.age = f.age === v ? null : v; else if (a === 'npAgree') f.agree = !f.agree; else if (a === 'npTmr') f.tmr = !f.tmr;
    else {
      if (!f.name) {f.err = '이름을 넣어주세요.'; render(true); return;}
      if (!f.agree) {f.err = '정보 등록 동의를 받은 고객만 등록할 수 있어요.'; render(true); return;}
      const c = {id:customers.length, mon:11, own:true, name:f.name, age:f.age || '연령 미입력', sex:'', why:'직접 추가 · ' + f.src, have:0, max:0, next:f.tmr ? addDays(1) : null, appt:null, hist:[H(new Date(TODAY), 0, 'ok', OKL[0], '', f.tel ? '연락처 등록됨' : '')]};
      customers.push(c); syncCur(); S.sheet = null;
      toast(`${c.name} 님을 가망고객으로 등록했어요`); return;
    }
    f.err = ''; render(true);
  }
  /* 내 성과 */
  else if (a === 'per') {S.period = +v; render(true);}
  /* SM */
  else if (a === 'smgo') {S.smView = v; S.smFp = null; render();}
  else if (a === 'smfp') {S.smFp = +v; S.smNote = ''; S.smWhen = null; render();}
  else if (a === 'openReq') {S.smFp = members().findIndex(p => p.n === v); S.smNote = ''; render();}
  else if (a === 'smback') {S.smFp = null; render();}
  else if (a === 'smwhen') {S.smWhen = v; render(true);}
  else if (a === 'meet') {const p = members()[S.smFp]; meetings.push({who:p.n, when:S.smWhen || '목 오후', ax:weakOf(p.r, p.low).p}); toast(`${p.n} FP와 1:1을 잡았어요 · FP 화면에 떠요`);}
  else if (a === 'accept') {const r = requests[+v]; r.st = 'ok'; meetings.push({who:r.who, when:r.when, ax:r.ax}); toast(`${r.who} FP와 ${r.when} 1:1 확정`);}
  else if (a === 'smsave') {S.smNote = document.getElementById('smNote').value; toast('코칭 메모를 저장했어요 · FP와 교육팀에 공유');}
});
phone.addEventListener('input', e => {
  const id = e.target.id;
  if (id === 'q' || id === 'pq') {
    if (id === 'q') S.q = e.target.value.trim(); else S.f.q = e.target.value.trim();
    const pos = e.target.selectionStart; render(true); const el = document.getElementById(id); el.focus(); el.setSelectionRange(pos, pos);
  }
  if (id === 'memo' && S.f) S.f.memo = e.target.value;
});
document.addEventListener('keydown', e => {if (e.key !== 'Escape' || S.call !== null) return; if (S.sheet) {S.sheet = null; render(true);} else if (S.f && S.f.open) {S.f.open = false; render(true);}});
render();
