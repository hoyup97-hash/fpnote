function vSmFp() {
  const p = members()[S.smFp], an = analysis(p.r, p.low, p.n), m = meetings.find(x => x.who === p.n);
  return `${smBar(esc(p.n) + ' FP', esc(p.t) + ' · 최근 3개월', 'smback')}<div class="pad">${an.html}
  <div class="sec">1:1 잡기</div>
  ${m ? `<div class="meet">${ic('cal')}<div><b>${esc(m.when)} 확정</b><div class="mt">주제: ${esc(m.ax)} · FP 화면에 떠요</div></div></div>` : `<div class="chips">${['내일 오전','내일 오후','목 오후','금 오전'].map(x => `<button class="chip ${(S.smWhen || '목 오후') === x ? 'on' : ''}" data-act="smwhen" data-v="${x}">${x}</button>`).join('')}</div>
  <button class="btn dark" data-act="meet">${ic('cal')}${esc(S.smWhen || '목 오후')} 1:1 잡기 · 주제 ${esc(an.weak.p)}</button>`}
  <label class="f" for="smNote">코칭 메모 <span class="mt">FP와 교육팀에 공유돼요</span></label><textarea id="smNote" placeholder="예: 멘토 이보니 FP와 이번 주 동행 2회">${esc(S.smNote)}</textarea>
  <button class="btn sec2" data-act="smsave">코칭 메모 저장</button>
  <p class="mt" style="margin-top:14px">SM 화면에서는 고객 이름이 가려져요 (예: ${esc(mask(customers[2].name))}).</p></div>`;
}
