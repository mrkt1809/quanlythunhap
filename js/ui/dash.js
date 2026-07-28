/* ============================================================
   ui/dash.js — Màn hình Tổng quan
   Ver 4.1: công tắc Thu / Chi / Thu–Chi.
   - Thu / Chi: dùng CHUNG toàn bộ giao diện cũ, chỉ khác danh sách
     đầu vào đã lọc theo loại (ofType).
   - Thu–Chi: khối hiển thị riêng (thẻ 3 số + biểu đồ so sánh).
   ============================================================ */
import { typeInfo, groupStyleFor } from "../config.js";
import { stats, byGroup, years, ofType, totalsByType, monthly } from "../compute.js";
import { fmtVND, fmtShort } from "../format.js";
import { renderChart, renderLegend, bindChart } from "./chart.js";
import { setYear } from "../store.js";

const $ = id => document.getElementById(id);

/* Chế độ xem hiện tại: 'in' (thu) · 'out' (chi) · 'net' (thu–chi) */
let mode = 'in';
export const getMode = () => mode;

/* ---- pill chọn năm ---- */
function renderYears(txs, year){
  const ys = years(txs);
  if(!ys.length) ys.push(new Date().getFullYear());
  $('years').innerHTML = ys.map(y =>
    `<button class="year-pill ${y === year ? 'on' : ''}" data-year="${y}">${y}</button>`
  ).join('');
}

export function bindYears(){
  $('years').addEventListener('click', e => {
    const btn = e.target.closest('.year-pill');
    if(btn) setYear(+btn.dataset.year);
  });
}

/* ---- công tắc Thu / Chi / Thu–Chi ---- */
function renderModeTabs(){
  const tabs = [['in','Thu'],['out','Chi'],['net','Thu–Chi']];
  $('modeTabs').innerHTML = tabs.map(([m,label]) =>
    `<button class="mode-tab ${m===mode?'on':''}" data-mode="${m}">${label}</button>`
  ).join('');
}

/* Store lại txs/year gần nhất để đổi mode mà không cần chờ dữ liệu mới */
let lastTxs = [], lastYear = null;

export function bindModeTabs(){
  $('modeTabs').addEventListener('click', e => {
    const b = e.target.closest('.mode-tab');
    if(!b || b.dataset.mode === mode) return;
    mode = b.dataset.mode;
    renderDash(lastTxs, lastYear);
  });
}

/* ---- cơ cấu nguồn (thu hoặc chi) ---- */
function renderCat(sorted, total, type){
  $('cat').innerHTML = sorted.length
    ? sorted.map(([g, v]) => {
        const G = groupStyleFor(type, g), pct = total ? v / total * 100 : 0;
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

/* ============================================================
   Chế độ Thu hoặc Chi — cùng giao diện, khác danh sách đầu vào
   ============================================================ */
function renderSingle(txs, year, type){
  const info = typeInfo(type);
  const filtered = ofType(txs, type);   // ← chỉ giao dịch đúng loại
  const st = stats(filtered, year);

  const noun = type === 'in' ? 'có thu' : 'có chi';
  const word = type === 'in' ? 'thu nhập' : 'chi tiêu';

  $('heroLabel').textContent = `Tổng ${word} năm`;
  $('hYear').textContent  = year;
  $('hTotal').textContent = fmtVND(st.total) + ' đ';
  $('hCount').textContent = `${st.txCount} giao dịch · ${st.activeMonths} tháng ${noun}`;

  $('hYoy').innerHTML = st.yoy
    ? `<span class="yoy ${st.yoy.up ? 'up' : 'down'}">${st.yoy.up ? '▲' : '▼'} ${(Math.abs(st.yoy.growth)*100).toFixed(1)}% so cùng kỳ ${year-1}</span>`
    : '';

  $('kAvg').textContent  = st.activeMonths ? fmtShort(st.avgMonth) : '—';
  $('kMax').textContent  = st.maxValue > 0 ? fmtShort(st.maxValue) : '—';
  $('kMaxM').textContent = st.maxMonth ? `Tháng ${st.maxMonth}` : '';
  $('kCount').textContent  = st.txCount;
  $('kCountM').textContent = `${st.activeMonths} tháng ${noun}`;

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

  $('chartTitle').textContent = type === 'in' ? 'Thu nhập theo tháng' : 'Chi tiêu theo tháng';
  $('catTitle').textContent   = type === 'in' ? 'Cơ cấu nguồn thu'    : 'Cơ cấu khoản chi';

  const sorted = byGroup(filtered, year);
  renderChart(filtered, year, type);
  renderLegend(sorted, type);
  renderCat(sorted, st.total, type);
}

/* ============================================================
   Chế độ Thu–Chi — thẻ 3 số + biểu đồ thu/chi cạnh nhau
   ============================================================ */
function renderNet(txs, year){
  const t = totalsByType(txs, year);

  /* thẻ tổng đổi thành 3 số */
  $('heroLabel').textContent = `Dòng tiền năm`;
  $('hYear').textContent  = year;
  $('hTotal').textContent = fmtVND(t.net) + ' đ';
  $('hCount').textContent = t.net >= 0 ? 'Dương — thu nhiều hơn chi' : 'Âm — chi nhiều hơn thu';
  $('hYoy').innerHTML = '';

  /* 4 KPI: Thu · Chi · Hỗ trợ · Còn lại */
  $('heroLabel').textContent = 'Dòng tiền ròng năm';
  $('kAvg').textContent  = fmtShort(t.income);
  $('kMax').textContent  = fmtShort(t.expense);
  $('kMaxM').textContent = '';
  $('kCount').textContent  = fmtShort(t.transfer);
  $('kCountM').textContent = '';
  $('kYoy').textContent  = fmtShort(t.net);
  $('kYoy').style.color  = t.net >= 0 ? 'var(--green)' : 'var(--red)';
  $('kYoyM').textContent = '';

  /* nhãn 4 KPI đổi theo chế độ net */
  setKpiLabels(['Thu nhập','Chi tiêu','Hỗ trợ nhận','Còn lại']);

  $('chartTitle').textContent = 'Thu vs Chi theo tháng';
  $('catTitle').textContent   = 'Cơ cấu khoản chi';

  /* legend Thu/Chi tĩnh — đặt đồng bộ, không để trong renderNetChart
     vì hàm đó dùng dynamic import chạy sau, dễ bị ghi đè */
  $('barLegend').innerHTML =
    `<span class="lg-static"><i style="background:var(--green)"></i>Thu</span>
     <span class="lg-static"><i style="background:var(--red)"></i>Chi</span>`;
  $('cmpHint').textContent = '';

  /* biểu đồ so sánh: cột thu (xanh) và chi (đỏ) cạnh nhau mỗi tháng */
  renderNetChart(txs, year);

  /* phần cơ cấu bên dưới: hiện cơ cấu CHI (tiền đi đâu).
     Không gọi renderLegend ở đây — legend đã là Thu/Chi tĩnh cho biểu đồ net. */
  const expense = ofType(txs, 'out');
  const sorted = byGroup(expense, year);
  const totalExp = sorted.reduce((s,[,v]) => s+v, 0);
  renderCat(sorted, totalExp, 'out');
}

/* Biểu đồ Thu vs Chi — 2 cột mỗi tháng */
function renderNetChart(txs, year){
  const inc = monthly(ofType(txs,'in'), year);
  const exp = monthly(ofType(txs,'out'), year);
  const peak = Math.max(...inc, ...exp, 1);

  /* trục Y + gridline (dùng lại cấu trúc cũ) */
  import("../compute.js").then(({ axisTicks }) => {
    const { ticks, top } = axisTicks(peak);
    const desc = ticks.slice().reverse();
    $('yaxis').innerHTML = desc.map(v => `<div class="ytick"><span>${v===0?'0':fmtShort(v)}</span></div>`).join('');
    $('grid').innerHTML  = desc.map(() => `<div class="gline"></div>`).join('');

    $('bars').innerHTML = inc.map((iv, i) => {
      const ev = exp[i];
      return `<div class="bcol netcol" data-mo="${i}">
        <div class="colbox netbox">
          <div class="nbar nin"  style="height:${iv/top*100}%" title="Thu ${fmtVND(iv)}"></div>
          <div class="nbar nout" style="height:${ev/top*100}%" title="Chi ${fmtVND(ev)}"></div>
        </div>
        <div class="mo">${i+1}</div>
      </div>`;
    }).join('');
  });

  $('cmpHint').textContent = '';
}

/* ---- nhãn 4 KPI (đổi theo chế độ) ---- */
function setKpiLabels(labels){
  const els = document.querySelectorAll('.kpi .l');
  labels.forEach((t,i) => { if(els[i]) els[i].textContent = t; });
}
const DEFAULT_KPI = ['TB mỗi tháng','Tháng cao nhất','Số giao dịch','So cùng kỳ'];

/* ---- điểm vào chính ---- */
export function renderDash(txs, year){
  if(year == null) return;
  lastTxs = txs; lastYear = year;

  renderYears(txs, year);
  renderModeTabs();

  /* bật/tắt lớp giao diện net (CSS đổi cách hiện biểu đồ) */
  document.body.classList.toggle('mode-net', mode === 'net');

  if(mode === 'net'){
    renderNet(txs, year);
  }else{
    setKpiLabels(DEFAULT_KPI);
    renderSingle(txs, year, mode);
  }
}

/* Vẽ lại riêng biểu đồ khi bật/tắt nhóm ở legend (chỉ ở chế độ Thu/Chi) */
export function refreshChart(txs, year){
  if(year == null || mode === 'net') return;
  const filtered = ofType(txs, mode);
  renderChart(filtered, year, mode);
  renderLegend(byGroup(filtered, year), mode);
}

export { bindChart };
