/* ---------- 로그인 ---------- */
function vLogin() {
  return `<div class="login">
  <div class="logo">${ic('hex', 'color:#fff;width:26px;height:26px')}</div>
  <h2>FP 활동노트</h2><p>오늘 만난 고객을 한 번에 기록하세요</p>
  <form class="box" id="loginForm" novalidate>
    <label class="f" for="uid">사번</label><input type="text" id="uid" autocomplete="off" placeholder="예: FP2041 또는 SM0907">
    <label class="f" for="pw">비밀번호</label><input type="password" id="pw" autocomplete="off" placeholder="시안이라 아무 값이나 괜찮아요">
    ${S.err ? `<div class="err" role="alert">${esc(S.err)}</div>` : ''}
    <button class="btn" type="submit">로그인</button>
  </form>
  <div class="demo"><p>시연용 계정으로 바로 들어가기</p>
    <button data-act="as" data-v="fp"><span class="av">김</span><span><b>김푸니 FP</b><span>FP2041 · 강남 경력전환지점</span></span></button>
    <button data-act="as" data-v="sm"><span class="av g">이</span><span><b>이호엽 SM · 관리자</b><span>SM0907 · 팀원 6명</span></span></button>
  </div></div>`;
}
