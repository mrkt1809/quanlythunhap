/* ============================================================
   app.js — Điểm khởi động: nối các module lại với nhau
   ============================================================ */
import { CONFIGURED } from "./config.js";
import * as store from "./store.js";
import { renderDash, refreshChart, bindYears, bindChart } from "./ui/dash.js";
import { renderList, bindList, setMonthFilter, clearMonthFilter } from "./ui/list.js";
import { renderReport } from "./ui/report.js";
import { openAdd, bindModal } from "./ui/modal.js";
import { toast } from "./ui/toast.js";
import { exportTransactions, exportReport } from "./export.js";

const $ = id => document.getElementById(id);

/* ---------- điều hướng giữa các màn hình ---------- */
function go(v){
  document.querySelectorAll('.view').forEach(e => e.classList.remove('on'));
  $('v-' + v).classList.add('on');
  document.querySelectorAll('nav.tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  window.scrollTo({ top:0 });
}

/* ---------- hiện / ẩn khung app ----------
   Chỉ gắn/gỡ class trên <body>, KHÔNG đặt style trực tiếp.
   Lý do: inline style thắng mọi quy tắc CSS, nên nếu gán display ở đây thì
   grid-area của sidebar trên desktop sẽ bị vô hiệu và nav rơi xuống cuối trang. */
function showApp(on){
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

/* Biểu đồ có 2 tương tác:
   - bấm legend → vẽ lại biểu đồ (KPI giữ nguyên)
   - bấm cột    → sang tab Giao dịch, lọc đúng tháng đó */
bindChart(
  () => refreshChart(store.getTxs(), store.getYear()),
  mo => { setMonthFilter(mo); go('list'); }
);

async function doLogin(){
  const email = $('email').value.trim();
  const pw    = $('password').value;
  const err   = $('loginErr');
  err.textContent = '';
  if(!email || !pw){ err.textContent = 'Nhập email và mật khẩu'; return; }

  const btn = $('btnLogin');
  btn.disabled = true; btn.textContent = 'Đang đăng nhập…';
  try{
    await store.login(email, pw);
  }catch(e){
    /* Supabase trả "Invalid login credentials" khi sai HOẶC chưa có tài khoản.
       App chỉ mình bạn dùng nên thử tạo tài khoản luôn nếu đăng nhập thất bại. */
    try{
      await store.signup(email, pw);
      await store.login(email, pw);
    }catch(e2){
      err.textContent = 'Lỗi: ' + (e2.message || e.message);
    }
  }finally{
    btn.disabled = false; btn.textContent = 'Đăng nhập';
  }
}

$('btnLogin').addEventListener('click', doLogin);
$('password').addEventListener('keydown', e => { if(e.key === 'Enter') doLogin(); });
$('btnLogout').addEventListener('click', () => store.logout());
$('btnAdd').addEventListener('click', () => openAdd('in'));

document.querySelectorAll('nav.tabs button[data-v]').forEach(b => {
  b.addEventListener('click', () => go(b.dataset.v));
});

/* ---------- xuất CSV ---------- */
$('expTx').addEventListener('click', () => {
  const n = exportTransactions(store.getTxs(), store.getYear());
  toast(n ? `Đã xuất ${n} giao dịch` : 'Không có dữ liệu để xuất');
});
$('expRpt').addEventListener('click', () => {
  const n = exportReport(store.getTxs(), store.getYear());
  toast(n ? `Đã xuất báo cáo ${store.getYear()}` : 'Không có dữ liệu để xuất');
});

/* phản ứng khi đăng nhập / đăng xuất */
store.onAuth(u => {
  if(u && u.error){ toast('Lỗi đọc dữ liệu: ' + u.error); return; }
  if(u){ $('password').value = ''; showApp(true); }
  else  { showApp(false); }
});

/* phản ứng khi dữ liệu đổi — mỗi màn hình tự vẽ lại phần của mình */
let lastYear = null;
store.subscribe((txs, year) => {
  /* đổi năm thì bỏ lọc tháng, tránh lọc tháng của năm cũ */
  if(year !== lastYear){ clearMonthFilter(); lastYear = year; }
  renderDash(txs, year);
  renderList();
  renderReport(txs, year);
});

/* ---------- PWA ---------- */
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
