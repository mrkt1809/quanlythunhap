/* ============================================================
   app.js — Điểm khởi động: nối các module lại với nhau
   ============================================================ */
import { CONFIGURED } from "./config.js";
import * as store from "./store.js";
import { renderDash, bindYears } from "./ui/dash.js";
import { renderList, bindList } from "./ui/list.js";
import { openAdd, bindModal } from "./ui/modal.js";
import { toast } from "./ui/toast.js";

const $ = id => document.getElementById(id);

/* ---------- điều hướng giữa 2 màn hình ---------- */
function go(v){
  document.querySelectorAll('.view').forEach(e => e.classList.remove('on'));
  $('v-' + v).classList.add('on');
  document.querySelectorAll('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
}

/* ---------- hiện / ẩn khung app ---------- */
function showApp(on){
  $('login').style.display = on ? 'none' : 'flex';
  $('app').style.display   = on ? 'flex' : 'none';
  $('nav').style.display   = on ? 'flex' : 'none';
  /* .authed để desktop.css biết khi nào bật layout 2 cột */
  document.body.classList.toggle('authed', on);
}

/* ---------- khởi động ---------- */
if(!CONFIGURED){
  $('cfgWarn').style.display = 'block';
} else {
  store.init();
}

/* gắn sự kiện tĩnh (chỉ 1 lần, không phụ thuộc dữ liệu) */
bindYears();
bindList();
bindModal();

$('btnLogin').addEventListener('click', async () => {
  try{ await store.login(); }
  catch(e){ toast('Đăng nhập lỗi: ' + e.code); }
});
$('btnLogout').addEventListener('click', () => store.logout());
$('btnAdd').addEventListener('click', openAdd);

document.querySelectorAll('nav.tabs button[data-v]').forEach(b => {
  b.addEventListener('click', () => go(b.dataset.v));
});

/* phản ứng khi đăng nhập / đăng xuất */
store.onAuth(u => {
  if(u && u.error){ toast('Lỗi đọc dữ liệu: ' + u.error); return; }
  if(u){ $('uimg').src = u.photoURL || ''; showApp(true); }
  else  { showApp(false); }
});

/* phản ứng khi dữ liệu đổi — mỗi màn hình tự vẽ lại phần của mình */
store.subscribe((txs, year) => {
  renderDash(txs, year);
  renderList();
});

/* ---------- PWA ---------- */
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
