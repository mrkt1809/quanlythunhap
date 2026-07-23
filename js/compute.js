/* ============================================================
   compute.js — TOÀN BỘ phép tính số liệu
   ⚠️ QUY TẮC: file này KHÔNG được đụng tới DOM (document, window...).
   Mọi màn hình (dashboard, báo cáo, export) đều gọi các hàm ở đây
   → số liệu không bao giờ lệch nhau giữa các nơi.
   ============================================================ */
import { classify } from "./classify.js";

/* Nhóm của 1 giao dịch: ưu tiên nhóm đã lưu, không có thì đoán từ ghi chú */
export const groupOf = t => t.group || classify(t.note);

/* Danh sách các năm có dữ liệu, mới nhất trước */
export function years(txs){
  return [...new Set(txs.map(t => new Date(t.date).getFullYear()))].sort((a,b) => b-a);
}

/* Lọc giao dịch theo năm */
export const yearTx = (txs, y) => txs.filter(t => new Date(t.date).getFullYear() === y);

/* Mảng 12 phần tử: tổng thu nhập từng tháng của năm y */
export function monthly(txs, y){
  const m = Array(12).fill(0);
  yearTx(txs, y).forEach(t => { m[new Date(t.date).getMonth()] += t.amount; });
  return m;
}

/* Mảng 12 object: {tênNhóm: tổngTiền} cho từng tháng */
export function monthlyByGroup(txs, y){
  const out = Array.from({length:12}, () => ({}));
  yearTx(txs, y).forEach(t => {
    const mi = new Date(t.date).getMonth(), g = groupOf(t);
    out[mi][g] = (out[mi][g] || 0) + t.amount;
  });
  return out;
}

/* [[tênNhóm, tổngTiền], ...] đã sắp xếp giảm dần */
export function byGroup(txs, y){
  const acc = {};
  yearTx(txs, y).forEach(t => {
    const g = groupOf(t);
    acc[g] = (acc[g] || 0) + t.amount;
  });
  return Object.entries(acc).sort((a,b) => b[1] - a[1]);
}

/* So sánh CÙNG KỲ: chỉ cộng những tháng mà năm nay đã có thu.
   Tránh trường hợp tháng 7 mà so với cả 12 tháng năm ngoái → âm giả. */
export function yoy(txs, y){
  const cur = monthly(txs, y), prev = monthly(txs, y-1);
  const activeIdx = cur.map((v,i) => v>0 ? i : -1).filter(i => i>=0);
  const curSP  = activeIdx.reduce((s,i) => s + cur[i], 0);
  const prevSP = activeIdx.reduce((s,i) => s + prev[i], 0);
  if(prevSP <= 0) return null;
  const growth = (curSP - prevSP) / prevSP;
  return { curSP, prevSP, growth, up: growth >= 0 };
}

/* Gói chỉ số tổng hợp cho dashboard */
export function stats(txs, y){
  const cur   = yearTx(txs, y);
  const m     = monthly(txs, y);
  const prev  = monthly(txs, y-1);
  const total = cur.reduce((s,t) => s + t.amount, 0);
  const active = m.filter(x => x>0);
  const max    = Math.max(...m, 0);
  return {
    txCount   : cur.length,
    total,
    monthly   : m,
    prevMonthly: prev,
    activeMonths: active.length,
    avgMonth  : active.length ? total / active.length : 0,
    maxValue  : max,
    maxMonth  : max > 0 ? m.indexOf(max) + 1 : null,   // 1–12
    peak      : Math.max(max, ...prev, 1),             // trần biểu đồ
    hasCompare: prev.some(x => x>0),
    yoy       : yoy(txs, y)
  };
}
