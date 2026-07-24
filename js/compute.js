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

/* Chia trục Y thành các mốc "tròn" dễ đọc.
   VD: đỉnh 109tr → [0, 30tr, 60tr, 90tr, 120tr] thay vì 0/27.25/54.5/...
   Trả về { ticks:[...], top: giá_trị_cao_nhất_của_trục } */
export function axisTicks(peak, count = 4){
  if(!(peak > 0)) return { ticks:[0], top:1 };
  const raw  = peak / count;
  const mag  = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  // chọn bước nhảy tròn gần nhất
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const top  = Math.ceil(peak / step) * step;
  const ticks = [];
  for(let v = 0; v <= top + step/2; v += step) ticks.push(v);
  return { ticks, top };
}

/* Số liệu biểu đồ SAU KHI lọc bớt nhóm (dùng cho legend bật/tắt).
   hidden: Set tên nhóm đang bị ẩn. Rỗng = hiện tất cả.
   Lưu ý: chỉ biểu đồ bị lọc. Các ô KPI phía trên luôn giữ số liệu đầy đủ. */
export function chartData(txs, y, hidden = new Set()){
  const keep = t => !hidden.has(groupOf(t));

  const cur  = Array(12).fill(0);
  const prev = Array(12).fill(0);
  const byMG = Array.from({length:12}, () => ({}));

  yearTx(txs, y).filter(keep).forEach(t => {
    const mi = new Date(t.date).getMonth(), g = groupOf(t);
    cur[mi]    += t.amount;
    byMG[mi][g] = (byMG[mi][g] || 0) + t.amount;
  });

  yearTx(txs, y-1).filter(keep).forEach(t => {
    prev[new Date(t.date).getMonth()] += t.amount;
  });

  const hasCompare = prev.some(x => x > 0);
  const peak = Math.max(...cur, ...prev, 1);
  return { cur, prev, byMG, hasCompare, peak, axis: axisTicks(peak) };
}
/* Bảng báo cáo: 12 tháng × các nhóm, kèm luỹ kế và so cùng kỳ.
   Trả về { groups, rows, totalByGroup, grandTotal }
   - groups : tên nhóm có phát sinh trong năm, sắp theo tổng giảm dần
   - rows[i]: { month, byGroup{}, total, cum, prev, diff, pct } cho tháng i+1 */
export function reportMatrix(txs, y){
  const groups = byGroup(txs, y).map(([g]) => g);
  const byMG   = monthlyByGroup(txs, y);
  const cur    = monthly(txs, y);
  const prev   = monthly(txs, y-1);

  let cum = 0;
  const rows = cur.map((total, i) => {
    cum += total;
    const p    = prev[i];
    const diff = total - p;
    return {
      month  : i + 1,
      byGroup: byMG[i],
      total, cum,
      prev   : p,
      diff,
      pct    : p > 0 ? diff / p : null
    };
  });

  const totalByGroup = {};
  groups.forEach(g => {
    totalByGroup[g] = rows.reduce((s, r) => s + (r.byGroup[g] || 0), 0);
  });

  return { groups, rows, totalByGroup, grandTotal: cum, hasPrev: prev.some(x => x > 0) };
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
