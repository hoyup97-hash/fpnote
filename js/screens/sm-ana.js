function vSmAna() {
  const all = members(), avg = Object.fromEntries(AXES.map(a => [a.k, all.reduce((t, p) => t + p.r[a.k], 0) / all.length]));
  const an = analysis(avg, {}, '우리 팀 평균');
  const cnt = AXES.map(a => ({a, n:all.filter(p => weakOf(p.r, p.low).k === a.k).length})).filter(x => x.n).sort((x, y) => y.n - x.n);
  return `${smBar('팀 분석', '최근 3개월 · 분기 리포트에 반영')}<div class="pad">${an.html}
  <div class="sec">팀원별 가장 약한 곳</div>
  ${cnt.map(x => `<div class="ax"><span>${x.a.p}</span><div class="meter"><i style="width:${x.n / all.length * 100}%;background:var(--sm)"></i></div><b>${x.n}명</b></div>`).join('')}</div>`;
}
