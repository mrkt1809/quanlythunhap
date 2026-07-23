/* ============================================================
   ui/toast.js — Thông báo ngắn ở đáy màn hình
   ============================================================ */
let timer;

export function toast(msg){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('on'), 2200);
}
