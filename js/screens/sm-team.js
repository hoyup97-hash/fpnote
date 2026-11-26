function vSmTeam() {
  const all = members(), risk = all.filter(p => p.sig).length;
  return `${smBar('우리 팀', '이호엽 SM · 강남 경력전환지점')}<div class="pad">
  <div class="strip" style="grid-template-columns:repeat(3,1fr)"><div><b>${all.length}명</b><span>팀원</span></div><div><b style="color:var(--no)">${risk}명</b><span>정착 위험</span></div><div><b>${newReq()}건</b><span>새 1:1 요청</span></div></div>
  <div class="sec">FP별 현황 <span>위험 신호 먼저</span></div>
  <ul class="list">${all.map((p, i) => ({p, i})).sort((a, b) => !!b.p.sig - !!a.p.sig).map(({p, i}) => `<li><button class="it" data-act="smfp" data-v="${i}"><span class="av g">${esc(p.n[0])}</span><span style="flex:1"><span class="nm">${esc(p.n)}</span> <span class="mt">${esc(p.t)}</span><br><span class="mt">기록률 ${pct(p.rec)} · 약한 곳 ${weakOf(p.r, p.low).p}</span>${p.sig ? `<br><span class="warn">${ic('alert')}${esc(p.sig)}</span>` : ''}</span>${ic('next')}</button></li>`).join('')}</ul></div>`;
}
