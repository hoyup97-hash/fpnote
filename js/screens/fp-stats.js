/* 3. 내 성과 */
const FLOW = [
  {n:'TA 접촉률', br:.66, say:'배정 고객에게 연락이 덜 닿고 있어요.', todo:'월초에 30명 연락을 먼저 끝내 보세요.'},
  {n:'AP 전환율', br:.40, say:'연락은 닿는데 만남 약속으로 잘 안 이어져요.', todo:'통화 끝에 보장 점검 날짜를 먼저 제안해 보세요.'},
  {n:'FF·N 파악률', br:.72, say:'만나도 고객의 보장 고민을 끌어내기가 어려워요.', todo:'보장분석 체크리스트를 들고 만나 보세요.'},
  {n:'PC 제안율', br:.78, say:'고민은 들었는데 설계안까지 이어지지 않아요.', todo:'고민 들은 자리에서 설계안 보여줄 날을 잡아 보세요.'},
  {n:'PD 체결률', br:.33, say:'설계안을 보여준 뒤 청약으로 잘 안 넘어가요.', todo:'멘토 FP와 동행 상담을 한 번 해 보세요.'},
  {n:'R 소개율', br:.28, say:'청약 고객에게서 소개가 잘 안 나와요.', todo:'청약 한 달 뒤 안부 연락 때 소개를 부탁해 보세요.'}];
const AX5 = [['act','TA','접촉률',0],['appt','AP','전환율',1],['need','FF·N','파악률',2],['pc','PC','제안율',3],['close','PD','체결률',4],['ref','R','소개율',5]];
function radar5(me, br, wk) {
  const cx = 180, cy = 152, R = 86;
  const pt = (i, v) => {const a = (-90 + i * 60) * Math.PI / 180; return [cx + Math.cos(a) * R * v / 100, cy + Math.sin(a) * R * v / 100];};
  const poly = sc => AX5.map((x, i) => pt(i, sc[x[0]]).map(v => v.toFixed(1)).join(',')).join(' ');
  const rings = [20, 40, 60, 80, 100].map((v, k) => `<polygon points="${AX5.map((_, i) => pt(i, v).join(',')).join(' ')}" fill="${k === 4 ? 'var(--soft)' : 'none'}" stroke="var(--line)" ${k === 4 ? 'stroke-width="1.5"' : ''}/>`).reverse().join('');
  const spokes = AX5.map((_, i) => `<line x1="${cx}" y1="${cy}" x2="${pt(i, 100)[0]}" y2="${pt(i, 100)[1]}" stroke="var(--line)"/>`).join('');
  const labels = AX5.map(([k, c, nm], i) => {const [x, y0] = pt(i, i === 0 ? 128 : 122), y = i === 0 ? y0 - 8 : i === 3 ? y0 + 12 : y0, anc = 'middle', lo = k === wk;
    return `<text x="${x}" y="${y - 4}" text-anchor="${anc}" font-size="15" font-weight="500" fill="var(--sub)">${c} ${nm}</text><text x="${x}" y="${y + 19}" text-anchor="${anc}" font-size="21" font-weight="800" fill="${lo ? 'var(--no)' : 'var(--teal-d)'}">${me[k]}<tspan font-size="14" font-weight="500" fill="var(--sub)"> 지점 ${br[k]}</tspan></text>`;}).join('');
  const dots = AX5.map(([k], i) => {const [x, y] = pt(i, me[k]); return `<circle cx="${x}" cy="${y}" r="${k === wk ? 5 : 3.5}" fill="${k === wk ? 'var(--no)' : 'var(--teal-d)'}" ${k === wk ? 'stroke="#fff" stroke-width="2"' : ''}/>`;}).join('');
  return `<svg class="radar5" viewBox="0 0 360 318" role="img" aria-label="6각형 역량 차트: ${AX5.map(x => `${x[2]} ${me[x[0]]}점`).join(', ')}">${rings}${spokes}<polygon points="${poly(br)}" fill="none" stroke="#8B95A1" stroke-width="1.5" stroke-dasharray="5 4"/><g class="grow" style="transform-origin:${cx}px ${cy}px"><polygon points="${poly(me)}" fill="var(--teal)" fill-opacity=".28" stroke="var(--teal-d)" stroke-width="2.2" stroke-linejoin="round"/>${dots}</g>${labels}</svg>`;
}
function vStats() {
  const B = agg(S.period), f = B.f, conv = f.slice(1).map((v, i) => v / Math.max(1, f[i]));
  const me = scores(B.raw), br = scores(BR);
  const wk = AX5.filter(x => !(B.low[x[0]])).sort((a, b) => me[a[0]] - me[b[0]])[0], w = AXES.find(a => a.k === wk[0]), wi = wk[3];
  const best = AX5.slice().sort((a, b) => me[b[0]] - me[a[0]])[0];
  const avg = k => Math.round(AX5.reduce((t, x) => t + k[x[0]], 0) / AX5.length), tot = avg(me), btot = avg(br);
  const ghost = [f[0]]; FLOW.forEach((x, i) => ghost.push(ghost[i] * x.br));
  const mt = meetings.find(m => m.who === '박지윤'), top = f[0];
  const per = {1:'최근 1개월', 3:'최근 3개월', 6:'최근 6개월', 12:'최근 1년'}[S.period];
  return `${appBar('내 성과', `${per} · 지점 평균과 비교`)}<div class="pad">
  <div class="seg" role="tablist" aria-label="기간">${[[1,'1개월'],[3,'3개월'],[6,'6개월'],[12,'1년']].map(([p, n]) => `<button role="tab" aria-selected="${S.period === p}" class="${S.period === p ? 'on' : ''}" data-act="per" data-v="${p}">${n}</button>`).join('')}</div>
  <section class="hero5">
    <div class="h5-top"><div><span class="mt">종합 점수</span><div class="h5-score num">${tot}<small>점</small></div></div><div class="h5-cmp"><span class="${Math.abs(tot - btot) <= 2 ? 'eq' : tot > btot ? 'up' : 'dn'}">${Math.abs(tot - btot) <= 2 ? '지점 평균과 비슷해요' : `지점 평균보다 ${Math.abs(tot - btot)}점 ${tot > btot ? '높아요' : '낮아요'}`}</span><span class="mt">지점 평균 ${btot}점</span></div></div>
    ${radar5(me, br, wk[0])}
    <div class="lg" style="justify-content:center"><span><i></i>나</span><span><i class="g"></i>지점 평균</span></div>
    <div class="h5-sw"><div><span class="mt">가장 잘하는 곳</span><b>${best[1]} ${best[2]}</b></div><div class="lo"><span class="mt">가장 약한 곳</span><b>${wk[1]} ${wk[2]}</b></div></div>
  </section>
  <div class="diag"><p>${w.say}</p><div class="tip">${ic('bulb', 'color:var(--hold)')}<span>${w.todo}</span></div></div>
  <div class="sec">단계별 고객 수 <span>${per}</span></div>
  <div class="lg"><span><i></i>나</span><span><i class="g"></i>지점 평균 속도였다면</span></div>
  <div class="flow">${f.map((v, s) => {
    const row = `<div class="fl-row"><span class="fl-n">${CODE[s] ? `<b>${CODE[s]}</b> ` : ''}${STAGES[s]}</span><span class="fl-t"><i class="fl-b" style="width:${Math.max(1.5, v / top * 100)}%"></i><i class="fl-g" style="width:${Math.min(100, ghost[s] / top * 100)}%"></i></span><b class="num">${v}</b></div>`;
    if (s === f.length - 1) return row;
    const c = conv[s], brr = FLOW[s].br, cls = s === wi ? 'lo' : c >= brr * 1.1 ? 'hi' : '';
    return row + `<div class="fl-c ${cls}">${ic('down')}<span><b class="num">${pct(c)}</b> ${FLOW[s].n}</span><em>지점 ${pct(brr)}</em>${s === wi ? '<strong>가장 약한 곳</strong>' : ''}</div>`;
  }).join('')}</div>
  <div class="meet">${ic('cal')}<div style="flex:1">${mt ? `<b>이정민 SM과 1:1 · ${esc(mt.when)}</b><div class="mt">이야기할 주제: ${esc(mt.ax)}</div>` : `<b>다음 SM 1:1에서 이야기할 것</b><div class="mt">${wk[1]} ${wk[2]}</div>`}</div></div></div>`;
}
