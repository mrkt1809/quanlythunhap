/* ============================================================
   ui/report.js — Trang Báo cáo: bảng 12 tháng × nhóm thu nhập
   ============================================================ */
import { groupStyle } from "../config.js";
import { reportMatrix } from "../compute.js";
import { fmtVND, fmtShort, esc } from "../format.js";

const $ = id => document.getElementById(id);

/* ô số: 0 thì để dấu gạch cho đỡ rối mắt */
const num = v => v ? fmtVND(v) : '<span class="z">–</span>';

export function renderReport(txs, year){
  if(year == null) return;
  const R = reportMatrix(txs, year);
  const el = $('rpt');

  if(!R.grandTotal){
    el.innerHTML = `<div class="empty"><div class="em">📊</div>Chưa có dữ liệu năm ${year}</div>`;
    return;
  }

  const head = `<tr>
    <th class="sticky-c">Tháng</th>
    ${R.groups.map(g => `<th><span class="hdot" style="background:${groupStyle(g).c}"></span>${esc(g)}</th>`).join('')}
    <th class="strong">Tổng</th>
    <th>Luỹ kế</th>
    ${R.hasPrev ? `<th>Cùng kỳ ${year-1}</th><th>Tăng/Giảm</th>` : ''}
  </tr>`;

  const body = R.rows.map(r => {
    /* tháng chưa có thu: làm mờ cả dòng */
    const dim = r.total ? '' : ' dim';
    const cmp = R.hasPrev
      ? `<td>${num(r.prev)}</td>
         <td class="${r.pct === null ? '' : (r.diff >= 0 ? 'up' : 'down')}">
           ${r.pct === null ? '<span class="z">–</span>'
             : `${r.diff >= 0 ? '▲' : '▼'} ${Math.abs(r.pct*100).toFixed(1)}%`}
         </td>`
      : '';
    return `<tr class="${dim}">
      <td class="sticky-c">T${r.month}</td>
      ${R.groups.map(g => `<td>${num(r.byGroup[g] || 0)}</td>`).join('')}
      <td class="strong">${num(r.total)}</td>
      <td class="cum">${num(r.cum)}</td>
      ${cmp}
    </tr>`;
  }).join('');

  const foot = `<tr class="tot">
    <td class="sticky-c">Tổng</td>
    ${R.groups.map(g => `<td>${num(R.totalByGroup[g])}</td>`).join('')}
    <td class="strong">${num(R.grandTotal)}</td>
    <td></td>
    ${R.hasPrev ? '<td></td><td></td>' : ''}
  </tr>`;

  el.innerHTML = `<div class="tbl-scroll">
    <table class="rtbl">
      <thead>${head}</thead>
      <tbody>${body}</tbody>
      <tfoot>${foot}</tfoot>
    </table>
  </div>
  <div class="tbl-hint">Vuốt ngang để xem thêm cột · số liệu tính bằng đồng</div>`;

  $('rptTitle').textContent = `Báo cáo ${year}`;
  $('rptSub').textContent   = `${fmtShort(R.grandTotal)} · ${R.rows.filter(r => r.total > 0).length} tháng có thu`;
}
