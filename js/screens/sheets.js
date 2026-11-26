function sheetAdd() {
  const f = S.sheet.add;
  return `<div class="ov" data-act="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="가망고객 추가"><div class="grab"></div>
  <div class="nm" style="font-size:18px">가망고객 추가</div><p class="mt" style="margin:2px 0 4px">본사 DB 말고 내가 직접 찾은 고객을 등록해요. '가망 발굴' 단계로 들어가요.</p>
  <label class="f" for="npName">이름</label><input type="text" id="npName" value="${esc(f.name || '')}" placeholder="예: 홍길동">
  <label class="f" for="npTel">연락처 <span class="mt">(선택)</span></label><input type="text" id="npTel" inputmode="tel" value="${esc(f.tel || '')}" placeholder="010-0000-0000">
  <p class="q">어떻게 알게 됐나요?</p><div class="chips">${['지인','고객 소개','기존 고객 가족','개척','기타'].map(x => `<button class="chip ${f.src === x ? 'on' : ''}" data-act="npSrc" data-v="${x}">${x}</button>`).join('')}</div>
  <p class="q">연령대 <span class="mt">(선택)</span></p><div class="chips">${['20대','30대','40대','50대','60대 이상'].map(x => `<button class="chip ${f.age === x ? 'on' : ''}" data-act="npAge" data-v="${x}">${x}</button>`).join('')}</div>
  <button class="ck-row ${f.agree ? 'on' : ''}" data-act="npAgree" aria-pressed="${!!f.agree}" style="border:0;margin-top:8px"><span class="ck-box">${f.agree ? ic('check') : ''}</span><span style="flex:1;font-size:14.5px">고객에게 정보 등록과 연락 동의를 받았어요</span></button>
  <button class="ck-row ${f.tmr ? 'on' : ''}" data-act="npTmr" aria-pressed="${!!f.tmr}" style="border:0"><span class="ck-box">${f.tmr ? ic('check') : ''}</span><span style="flex:1;font-size:14.5px">내일 '오늘 연락'에 넣기</span></button>
  ${f.err ? `<div class="err" role="alert">${esc(f.err)}</div>` : ''}
  <button class="btn" data-act="npSave">가망고객 등록</button></div></div>`;
}
function sheetMenu() {
  const fp = S.user === 'fp';
  return `<div class="ov" data-act="close"><div class="sheet" role="dialog" aria-modal="true" aria-label="내 계정"><div class="grab"></div>
  <div style="display:flex;align-items:center;gap:12px;padding:6px 0 4px"><span class="av ${fp ? '' : 'g'}">${fp ? '박' : '이'}</span><div><div class="nm">${fp ? '박지윤 FP' : '이정민 SM'}</div><div class="mt">${fp ? 'FP2041 · 강남 경력전환지점' : 'SM0907 · 관리자 권한'}</div></div></div>
  <button class="btn sec2" data-act="logout">${ic('out')}로그아웃</button></div></div>`;
}
