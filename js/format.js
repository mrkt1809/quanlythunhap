/* ============================================================
   format.js — Định dạng số tiền & ngày tháng
   ============================================================ */

/* 1234567 → "1.234.567" */
export const fmtVND = n => new Intl.NumberFormat('vi-VN').format(Math.round(n));

/* Rút gọn: 1.234.567.890 → "1.23 tỷ" · 45.800.000 → "45.8 tr" */
export const fmtShort = n =>
  n >= 1e9 ? (n/1e9).toFixed(2).replace(/\.?0+$/,'') + ' tỷ'
: n >= 1e6 ? (n/1e6).toFixed(1).replace(/\.0$/,'')  + ' tr'
: fmtVND(n);

/* "2026-03-15" → "15/03/2026" */
export function fmtDate(dateStr){
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

/* Chặn XSS khi nhét chuỗi người dùng vào innerHTML */
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
