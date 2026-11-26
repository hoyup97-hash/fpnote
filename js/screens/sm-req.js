function vSmReq() {
  return `${smBar('1:1 상담', '내가 잡은 일정과 FP 요청')}<div class="pad">
  <div class="sec">잡힌 일정 <span>${meetings.length}건</span></div>
  ${meetings.length ? meetings.map(m => `<div class="meet">${ic('cal')}<div style="flex:1"><b>${esc(m.who)} FP · ${esc(m.when)}</b><div class="mt">주제: ${esc(m.ax)}</div></div></div>`).join('') : `<p class="mt">아직 없어요. 팀 현황에서 FP를 눌러 1:1을 잡아보세요.</p>`}
  <div class="sec">FP가 보낸 요청</div>
  ${requests.length ? requests.map((r, i) => `<div class="panel"><div style="display:flex;align-items:center;gap:8px"><span class="nm">${esc(r.who)} FP</span><span class="badge b-no">${esc(r.ax)}</span><span style="flex:1"></span><span class="mt">${esc(r.when)}</span></div>${r.memo ? `<div style="font-size:14px;margin-top:6px">${esc(r.memo)}</div>` : ''}
    ${r.st === 'new' ? `<div style="display:flex;gap:8px;margin-top:12px"><button class="mini" style="background:var(--sm);color:#fff;border:0" data-act="accept" data-v="${i}">${esc(r.when)} 확정</button><button class="chip" data-act="openReq" data-v="${esc(r.who)}">역량 분석 보기</button></div>` : `<div class="mt" style="margin-top:8px;display:flex;align-items:center;gap:4px;color:var(--teal-d)">${ic('check')}확정됨 · FP 화면에 떠요</div>`}</div>`).join('') : `<div class="empty"><b>새 요청이 없어요</b></div>`}</div>`;
}
