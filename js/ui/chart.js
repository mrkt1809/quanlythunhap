/* ============================================================
   ui/chart.js — Biểu đồ cột xếp chồng theo tháng
   (Ver 3.2 sẽ nâng cấp trục Y / tooltip / lọc legend TẠI ĐÂY)
   ============================================================ */
import { groupStyle } from "../config.js";
import { monthlyByGroup } from "../compute.js";

export function renderChart(txs, year, st){
  const byMG = monthlyByGroup(txs, year);
  const { monthly: m, prevMonthly: prev, peak, hasCompare } = st;

  document.getElementById('cmpHint').textContent = hasCompare ? `mờ = ${year-1}` : '';

  document.getElementById('bars').innerHTML = m.map((v, i) => {
    const segs = Object.entries(byMG[i])
      .sort((a,b) => b[1] - a[1])
      .map(([g, val]) =>
        `<div class="seg" style="height:${val / Math.max(v,1) * 100}%;background:${groupStyle(g).c}"></div>`
      ).join('');

    const ghost = prev[i] > 0
      ? `<div class="stack cmpbar" style="height:${prev[i] / peak * 100}%"></div>`
      : '';

    return `<div class="bcol">
      <div class="colbox">
        ${ghost}
        <div class="stack" style="width:${hasCompare ? '52%' : '100%'};height:${v / peak * 100}%">${segs}</div>
      </div>
      <div class="mo">${i+1}</div>
    </div>`;
  }).join('');
}

export function renderLegend(sorted){
  document.getElementById('barLegend').innerHTML = sorted.slice(0,6)
    .map(([g]) => `<span><i style="background:${groupStyle(g).c}"></i>${g}</span>`)
    .join('');
}
