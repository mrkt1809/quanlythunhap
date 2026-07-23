/* ============================================================
   ui/dash.js — Màn hình Tổng quan
   Chỉ lấy số từ compute.js rồi đổ ra DOM, không tự tính toán.
   ============================================================ */
import { groupStyle } from "../config.js";
import { stats, byGroup, years } from "../compute.js";
import { fmtVND, fmtShort } from "../format.js";
import { renderChart, renderLegend } from "./chart.js";
import { setYear } from "../store.js";

const $ = id => document.getElementById(id);

/* ---- pill chọn năm ---- */
function renderYears(txs, year){
  const ys = years(txs);
  if(!ys.length) ys.push(new Date().getFullYear());
  $('years').innerHTML = ys.map(y =>
    `<button class="year-pill ${y === year ? 'on' : ''}" data-year="${y}">${y}</button>`
  ).join('');
}

/* Uỷ quyền sự kiện: gắn 1 lần, không cần gắn lại sau mỗi lần render */
export function bindYears(){
  $('years').addEventListener('click', e => {
    const btn = e.target.closest('.year-pill');
    if(btn) setYear(+btn.dataset.year);
  });
}

/* ---- cơ cấu nguồn thu ---- */
function renderCat(sorted, total){
  $('cat').innerHTML = sorted.length
    ? sorted.map(([g, v]) => {
        const G = groupStyle(g), pct = total ? v / total * 100 : 0;
        return `<div class="cat-row">
          <div class="top">
            <span class="nm"><span class="swatch" style="background:${G.c}"></span>${G.e} ${g}</span>
            <span class="amt">${fmtVND(v)} · ${pct.toFixed(1)}%</span>
          </div>
          <div class="track"><div class="fill" style="width:${pct}%;background:${G.c}"></div></div>
        </div>`;
      }).join('')
    : `<div class="empty">Chưa có dữ liệu năm này</div>`;
}

/* ---- điểm vào chính ---- */
export function renderDash(txs, year){
  if(year == null) return;
  const st = stats(txs, year);

  renderYears(txs, year);

  $('hYear').textContent  = year;
  $('hTotal').textContent = fmtVND(st.total) + ' đ';
  $('hCount').textContent = `${st.txCount} giao dịch · ${st.activeMonths} tháng có thu`;

  $('hYoy').innerHTML = st.yoy
    ? `<span class="yoy ${st.yoy.up ? 'up' : 'down'}">${st.yoy.up ? '▲' : '▼'} ${(Math.abs(st.yoy.growth)*100).toFixed(1)}% so cùng kỳ ${year-1}</span>`
    : '';

  $('kAvg').textContent  = st.activeMonths ? fmtShort(st.avgMonth) : '—';
  $('kMax').textContent  = st.maxValue > 0 ? fmtShort(st.maxValue) : '—';
  $('kMaxM').textContent = st.maxMonth ? `Tháng ${st.maxMonth}` : '';

  /* 2 ô KPI chỉ hiện trên desktop — vẫn cập nhật bình thường ở mobile,
     CSS lo phần ẩn/hiện nên JS không cần biết đang ở kích thước nào. */
  $('kCount').textContent  = st.txCount;
  $('kCountM').textContent = `${st.activeMonths} tháng có thu`;

  if(st.yoy){
    const pct = (Math.abs(st.yoy.growth) * 100).toFixed(1);
    $('kYoy').textContent  = `${st.yoy.up ? '▲' : '▼'} ${pct}%`;
    $('kYoy').style.color  = st.yoy.up ? 'var(--green)' : 'var(--red)';
    $('kYoyM').textContent = `cùng kỳ ${year - 1}`;
  } else {
    $('kYoy').textContent  = '—';
    $('kYoy').style.color  = '';
    $('kYoyM').textContent = 'chưa có năm trước';
  }

  renderChart(txs, year, st);

  const sorted = byGroup(txs, year);
  renderCat(sorted, st.total);
  renderLegend(sorted);
}
