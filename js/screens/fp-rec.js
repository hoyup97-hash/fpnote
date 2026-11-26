/* 1. 기록 */
function vRec() {
  const f = S.f, c = customers[f.cid];
  const ready = f.s && f.r && (f.r === 'ok' || f.why);
  const hint = !f.r ? '결과를 선택해주세요' : f.r !== 'ok' && !f.why ? '사유를 선택해주세요' : '';
  return `${appBar('활동 기록', '11월 24일 화요일 · 박지윤 FP')}<div class="pad">
  <div class="who ${f.open ? 'open' : ''}"><button class="whob" data-act="chooseC" aria-expanded="${!!f.open}"><span class="av">${esc(c.name[0])}</span><span style="flex:1;text-align:left"><span class="nm">${esc(c.name)} 고객</span> <span class="mt">${esc(c.why)}</span><br>${stBadge(c)}</span><span class="chev"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></button>${callBtn(c)}</div>
  ${f.open ? `<div class="drop"><input type="text" id="pq" placeholder="이름으로 찾기" value="${esc(f.q || '')}" aria-label="이름으로 찾기">${pickList(f.q || '')}</div>` : ''}
  ${!f.open ? `
  <p class="q">영업 단계</p>
  <div class="chips stg">${STAGES.map((s, i) => i ? `<button class="chip ${f.s === i ? 'on' : ''}" data-act="fs" data-v="${i}"><b>${CODE[i]}</b><small>${s}</small></button>` : '').join('')}</div>
  <p class="q">결과</p>
  <div class="res">${['ok','hold','no'].map(k => `<button class="${k} ${f.r === k ? 'on' : ''}" data-act="fr" data-v="${k}" aria-pressed="${f.r === k}">${RLABEL[k]}</button>`).join('')}</div>
  ${f.r && f.r !== 'ok' ? `<p class="q">사유</p><div class="chips">${REASONS[f.r].map(w => `<button class="chip ${f.why === w ? 'on' : ''}" data-act="fw" data-v="${w}">${w}</button>`).join('')}</div>` : ''}
  <p class="q">다음 연락 <span class="mt">(선택)</span></p>
  <div class="chips">${['내일','3일 후','1주 후','없음'].map(w => `<button class="chip ${f.nx === w ? 'on' : ''}" data-act="fn" data-v="${w}">${w}</button>`).join('')}</div>
  <label class="q" for="memo" style="display:block">메모 <span class="mt">(선택)</span></label>
  <input type="text" id="memo" placeholder="예: 남편과 상의 후 금요일에 연락 주기로" value="${esc(f.memo || '')}">
  <button class="btn" data-act="save" ${ready ? '' : 'disabled'}>${ready ? '저장' : hint}</button>
  ${c.hist.length ? `<div class="sec">이 고객 지난 기록</div><div class="tl">${c.hist.slice(-3).reverse().map(h => `<div><span class="mt num">${fmt(h.d)}</span> <b style="font-size:14.5px">${SC(h.s)}</b> <span class="mt">${STAGES[h.s]}</span> <span class="badge ${h.r === 'ok' ? 'b-ok' : h.r === 'hold' ? 'b-hold' : 'b-no'}">${RLABEL[h.r]}</span>${h.why ? ` <span class="mt">${esc(h.why)}</span>` : ''}${h.memo ? `<div class="mt" style="padding-top:2px">${esc(h.memo)}</div>` : ''}</div>`).join('')}</div>` : ''}` : ''}
  <div class="sec">오늘 남긴 기록 <span>${TODAYLOG.length}건</span></div>
  ${TODAYLOG.length ? `<ul class="list">${TODAYLOG.slice().reverse().map((x, i) => `<li class="it"><span style="flex:1"><span class="nm">${esc(customers[x.cid].name)}</span><br><span class="mt">${SC(x.h.s)} ${STAGES[x.h.s]} · ${RLABEL[x.h.r]}${x.h.why ? ' · ' + esc(x.h.why) : ''}</span></span>${i === 0 ? `<button class="undo" data-act="undo">${ic('undo', 'width:16px;height:16px')}되돌리기</button>` : ''}</li>`).join('')}</ul>` : `<p class="mt">아직 없어요. 고객을 고르고 기록을 남겨보세요.</p>`}</div>`;
}
