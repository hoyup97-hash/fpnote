/* 2. 고객 */
const STG = {all:['전체', () => true], today:['오늘 연락', dueToday], new:['연락 전', c => !last(c) || last(c).s === 0], ing:['진행 중', c => last(c) && last(c).s > 0 && last(c).s < 5 && last(c).r !== 'no'], won:['청약', c => c.max >= 5 && !isNo(c)], no:['거절', c => isNo(c)]};
function vCust() {
  const list = customers.filter(STG[S.cf][1]).filter(c => !S.q || c.name.includes(S.q)).sort((a, b) => (dueToday(b) - dueToday(a)) || ((daysAt(b) ?? -1) - (daysAt(a) ?? -1)));
  const db = customers.filter(c => c.mon === 11 && !c.own), done = db.filter(c => last(c) && last(c).s > 0).length;
  return `${appBar('내 고객', `${customers.length}명 · 11월 관리 고객 30명 중 ${done}명 연락`)}<div class="pad" style="padding-top:12px">
  <div style="display:flex;gap:8px"><input type="text" id="q" placeholder="고객 이름 검색" value="${esc(S.q)}" aria-label="고객 이름 검색" style="flex:1"><button class="btn sec2" style="margin:0;width:auto;padding:0 14px;min-height:46px;font-size:14.5px" data-act="addSheet">${ic('plus')}추가</button></div>
  <div class="chips onerow">${Object.entries(STG).map(([k, [n, fn]]) => `<button class="chip ${S.cf === k ? 'on' : ''}" data-act="cf" data-v="${k}">${n} <span class="num">${customers.filter(fn).length}</span></button>`).join('')}</div>
  ${list.length ? `<ul class="list">${list.map(c => `<li class="it"><button class="rowb" data-act="pickC" data-v="${c.id}"><span class="av">${esc(c.name[0])}</span><span style="flex:1"><span class="nm">${esc(c.name)}</span>${dueToday(c) ? ' <span class="hot">오늘 연락</span>' : ''}<br><span class="mt">${esc(c.why)}${last(c) && last(c).s > 0 ? ` · ${fmt(last(c).d)}` : ''}</span><br>${stBadge(c)}</span></button>${callBtn(c)}${recBtn(c)}</li>`).join('')}</ul>` : `<div class="empty"><b>해당하는 고객이 없어요</b>'전체'를 눌러 다시 찾아보세요.</div>`}</div>`;
}
