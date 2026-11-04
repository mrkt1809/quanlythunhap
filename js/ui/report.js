/* ============================================================
   ui/report.js — Trang Báo cáo
   Ver 4.2: 3 khối — bảng THU, bảng CHI, và bảng CHÊNH LỆCH tháng.
   Mỗi bảng nhóm dùng chung một hàm, chỉ khác danh sách đầu vào
   (đã lọc theo loại) và bộ màu nhóm.
   ============================================================ */
import { groupStyleFor } from "../config.js";
import { reportMatrix, ofType, monthly } from "../compute.js";
import { fmtVND, fmtShort, esc } from "../format.js";

const $ = id => document.getElementById(id);

/* ô số: 0 thì để dấu gạch cho đỡ rối mắt */
const num = v => v ? fmtVND(v) : '<span class="z">–</span>';

/* Dựng 1 bảng nhóm (12 tháng × nhóm) cho một loại giao dịch */
function matrixTable(R, type, year, word){
  const head = `<tr>
    <th class="sticky-c">Tháng</th>
    ${R.groups.map(g => `<th><span class="hdot" style="background:${groupStyleFor(type,g).c}"></span>${esc(g)}</th>`).join('')}
    <th class="strong">Tổng</th>
    <th>Luỹ kế</th>
    ${R.hasPrev ? `<th>Cùng kỳ ${year-1}</th><th>Tăng/Giảm</th>` : ''}
  </tr>`;

  const body = R.rows.map(r => {
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

  return `<div class="tbl-scroll rtbl-wrap">
    <table class="rtbl">
      <thead>${head}</thead><tbody>${body}</tbody><tfoot>${foot}</tfoot>
    </table>
  </div>`;
}

/* Phiên bản ACCORDION của bảng nhóm — cho mobile, thay bảng vuốt ngang.
   Mỗi tháng là một khối bấm mở; mở ra thấy các nhóm có phát sinh + luỹ kế
   + so cùng kỳ. Dữ liệu y hệt matrixTable, chỉ khác cách trình bày. */
function matrixAccordion(R, type, year){
  const months = R.rows.filter(r => r.total > 0);   // chỉ tháng có số
  const items = months.map(r => {
    const groups = R.groups
      .filter(g => (r.byGroup[g] || 0) > 0)
      .map(g => {
        const G = groupStyleFor(type, g);
        return `<div class="racc-g">
          <span class="racc-gn"><span class="hdot" style="background:${G.c}"></span>${esc(g)}</span>
          <span class="racc-gv">${fmtVND(r.byGroup[g])}</span>
        </div>`;
      }).join('');

    const cmp = (R.hasPrev && r.pct !== null)
      ? `<div class="racc-cmp ${r.diff >= 0 ? 'up' : 'down'}">
           ${r.diff >= 0 ? '▲' : '▼'} ${Math.abs(r.pct*100).toFixed(1)}% so cùng kỳ ${year-1}
         </div>`
      : '';

    return `<details class="racc-item">
      <summary class="racc-sum">
        <span class="racc-mo">Tháng ${r.month}</span>
        <span class="racc-tot">${fmtVND(r.total)}</span>
        <span class="racc-caret" aria-hidden="true">⌄</span>
      </summary>
      <div class="racc-body">
        ${groups}
        <div class="racc-meta">Luỹ kế: ${fmtVND(r.cum)}</div>
        ${cmp}
      </div>
    </details>`;
  }).join('');

  return `<div class="racc">
    ${items}
    <div class="racc-grand"><span>Tổng năm</span><span>${fmtVND(R.grandTotal)}</span></div>
  </div>`;
}

/* Bảng chênh lệch: mỗi tháng Thu − Chi (+ hỗ trợ) = Còn lại */
function diffTable(txs, year){
  const inc = monthly(ofType(txs,'in'), year);
  const exp = monthly(ofType(txs,'out'), year);
  const tra = monthly(ofType(txs,'transfer'), year);
  const hasTransfer = tra.some(v => v > 0);

  let tI=0, tE=0, tT=0;
  const rows = inc.map((v,i) => {
    const net = inc[i] + tra[i] - exp[i];
    tI += inc[i]; tE += exp[i]; tT += tra[i];
    if(!inc[i] && !exp[i] && !tra[i]) return '';
    const cls = net >= 0 ? 'pos' : 'neg';
    const sign = net < 0 ? '−' : '';
    return `<tr>
      <td>T${i+1}</td>
      <td>${num(inc[i])}</td>
      ${hasTransfer ? `<td>${num(tra[i])}</td>` : ''}
      <td>${num(exp[i])}</td>
      <td class="${cls}">${sign}${fmtVND(Math.abs(net))}</td>
    </tr>`;
  }).join('');

  const totNet = tI + tT - tE;
  const tcls = totNet >= 0 ? 'pos' : 'neg';
  const tsign = totNet < 0 ? '−' : '';

  return `<table class="difftbl">
    <thead><tr>
      <th>Tháng</th><th>Thu</th>${hasTransfer ? '<th>Hỗ trợ</th>' : ''}<th>Chi</th><th>Còn lại</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td>Cả năm</td><td>${num(tI)}</td>${hasTransfer ? `<td>${num(tT)}</td>` : ''}<td>${num(tE)}</td>
      <td class="${tcls}">${tsign}${fmtVND(Math.abs(totNet))}</td>
    </tr></tfoot>
  </table>`;
}

export function renderReport(txs, year){
  if(year == null) return;
  const el = $('rpt');

  const income  = ofType(txs, 'in');
  const expense = ofType(txs, 'out');
  const Rin  = reportMatrix(income, year);
  const Rout = reportMatrix(expense, year);

  if(!Rin.grandTotal && !Rout.grandTotal){
    el.innerHTML = `<div class="empty"><div class="em">📊</div>Chưa có dữ liệu năm ${year}</div>`;
    $('rptTitle').textContent = `Báo cáo ${year}`;
    $('rptSub').textContent = '';
    return;
  }

  const blocks = [];

  /* 1. Bảng THU — bảng (desktop) + accordion (mobile), CSS chọn hiện cái nào */
  if(Rin.grandTotal){
    blocks.push(`<div class="rpt-block">
      <h4>📥 Thu nhập <span class="rb-tot in">${fmtShort(Rin.grandTotal)}</span></h4>
      ${matrixTable(Rin, 'in', year, 'thu')}
      ${matrixAccordion(Rin, 'in', year)}
    </div>`);
  }

  /* 2. Bảng CHI */
  if(Rout.grandTotal){
    blocks.push(`<div class="rpt-block">
      <h4>📤 Chi tiêu <span class="rb-tot out">${fmtShort(Rout.grandTotal)}</span></h4>
      ${matrixTable(Rout, 'out', year, 'chi')}
      ${matrixAccordion(Rout, 'out', year)}
    </div>`);
  }

  /* 3. Bảng CHÊNH LỆCH tháng */
  blocks.push(`<div class="rpt-block">
    <h4>⚖️ Chênh lệch từng tháng</h4>
    ${diffTable(txs, year)}
  </div>`);

  el.innerHTML = blocks.join('') +
    `<div class="tbl-hint">Bấm từng tháng để xem chi tiết · số liệu tính bằng đồng</div>`;

  const net = Rin.grandTotal - Rout.grandTotal;
  $('rptTitle').textContent = `Báo cáo ${year}`;
  $('rptSub').textContent   =
    `Thu ${fmtShort(Rin.grandTotal)} · Chi ${fmtShort(Rout.grandTotal)} · Còn ${net<0?'−':''}${fmtShort(Math.abs(net))}`;
}
