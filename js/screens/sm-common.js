/* ---------- SM 관리자 앱 ---------- */
const smBar = (title, sub, back) => `<div class="app sm">${back ? `<button class="ib" data-act="${back}" aria-label="뒤로">${ic('back')}</button>` : ''}<h2>${title}${sub ? `<small>${sub}</small>` : ''}</h2>${back ? '' : `<span class="role">관리자</span><button class="ib" data-act="menu" aria-label="내 계정">${ic('user')}</button>`}</div>`;
const newReq = () => requests.filter(r => r.st === 'new').length;
const smTabs = () => `<nav class="tabs sm" style="grid-template-columns:repeat(3,1fr)">${[['team','팀 현황','team'],['req','1:1 상담','inbox'],['tana','팀 분석','hex']].map(([k, n, icn]) => `<button data-act="smgo" data-v="${k}" class="${S.smView === k ? 'on' : ''}">${ic(icn)}${n}${k === 'req' && newReq() ? `<span class="cnt">${newReq()}</span>` : ''}</button>`).join('')}</nav>`;
const members = () => [{n:'김푸니', t:'14개월 차', r:agg(3).raw, low:agg(3).low, rec:agg(1).raw.cons, sig:''}, ...TEAM.map(p => ({...p, low:{}, rec:p.r.cons}))];

function radarSvg(mine, br) {
  const cx = 170, cy = 156, R = 104;
  const pt = (i, v) => {const a = (-90 + i * 60) * Math.PI / 180; return [cx + Math.cos(a) * R * v / 100, cy + Math.sin(a) * R * v / 100];};
  const poly = sc => AXES.map((a, i) => pt(i, sc[a.k]).map(n => n.toFixed(1)).join(',')).join(' ');
  const rings = [25, 50, 75, 100].map(v => `<polygon points="${AXES.map((_, i) => pt(i, v).join(',')).join(' ')}" fill="none" stroke="var(--line)"/>`).join('');
  const spokes = AXES.map((_, i) => `<line x1="${cx}" y1="${cy}" x2="${pt(i, 100)[0]}" y2="${pt(i, 100)[1]}" stroke="var(--line)"/>`).join('');
  const labels = AXES.map((a, i) => {const [x, y] = pt(i, 124); const anc = Math.abs(x - cx) < 5 ? 'middle' : x > cx ? 'start' : 'end'; return `<text x="${x}" y="${y + 4}" text-anchor="${anc}" font-size="13" font-weight="600" fill="var(--ink)">${a.n}</text><text x="${x}" y="${y + 20}" text-anchor="${anc}" font-size="13" fill="var(--teal-d)" font-weight="800">${mine[a.k]}</text>`;}).join('');
  return `<svg class="radar" viewBox="-34 0 408 318" role="img" aria-label="6각형 역량 차트">${rings}${spokes}<polygon points="${poly(br)}" fill="none" stroke="var(--sub)" stroke-width="1.5" stroke-dasharray="4 4"/><polygon points="${poly(mine)}" fill="var(--teal)" fill-opacity=".22" stroke="var(--teal-d)" stroke-width="2"/>${AXES.map((a, i) => {const [x, y] = pt(i, mine[a.k]); return `<circle cx="${x}" cy="${y}" r="3.5" fill="var(--teal-d)"/>`;}).join('')}${labels}</svg>`;
}
function analysis(raw, low, who) {
  const mine = scores(raw), weak = weakOf(raw, low), strong = AXES.filter(a => !low[a.k]).sort((a, b) => mine[b.k] - mine[a.k])[0];
  const mx = Math.max(...AXES.map(a => Math.max(raw[a.k], BR[a.k])));
  return {weak, html:`<section class="hero5"><div class="h5-top"><div><span class="mt">${esc(who)} 종합 점수</span><div class="h5-score num">${Math.round(AX5.reduce((t, x) => t + mine[x[0]], 0) / AX5.length)}<small>점</small></div></div><div class="h5-cmp"><span class="mt">지점 평균 ${Math.round(AX5.reduce((t, x) => t + scores(BR)[x[0]], 0) / AX5.length)}점</span></div></div>${radar5(mine, scores(BR), weak.k)}<div class="lg" style="justify-content:center"><span><i></i>${esc(who)}</span><span><i class="g"></i>지점 평균</span></div></section><div class="sw" style="margin-top:16px"><div><span class="tag" style="color:var(--teal-d)">잘하는 곳</span><b>${strong.p}</b><span class="mt">${strong.d}</span></div><div><span class="tag" style="color:var(--no)">보완할 곳</span><b>${weak.p}</b><span class="mt">${weak.d}</span></div></div>
  <div class="panel"><h3>추천 코칭 · ${weak.p}</h3><div style="font-size:14.5px">${weak.tip}</div></div>
  <div class="sec">지점 평균과 비교</div><div class="lg"><span><i></i>${esc(who)}</span><span><i class="b"></i>지점 평균</span></div>
  ${AXES.map(a => `<div class="cmp"><div class="cmp-h"><span>${a.p}</span><b class="${level(raw, a.k)[1]}">${low[a.k] ? '데이터 부족' : pct(raw[a.k])}</b></div><div class="bar2"><i style="width:${raw[a.k] / mx * 100}%" class="${a === weak ? 'lo' : ''}"></i></div><div class="bar2 br"><i style="width:${BR[a.k] / mx * 100}%"></i></div><small>${a.rx} · 지점 평균 ${pct(BR[a.k])}</small></div>`).join('')}`};
}
