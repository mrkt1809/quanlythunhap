/* ============================================================
   ui/chart.js — Biểu đồ cột xếp chồng theo tháng
   Ver 3.2: thêm trục Y, tooltip khi rê/chạm, bật-tắt nhóm ở legend.
   ============================================================ */
import { groupStyle } from "../config.js";
import { chartData } from "../compute.js";
import { fmtVND, fmtShort, esc } from "../format.js";

const $ = id => document.getElementById(id);

/* Nhóm đang bị ẩn — giữ nguyên khi đổi năm để không phải bấm lại */
const hidden = new Set();
export const getHidden = () => hidden;

/* Ngữ cảnh lần vẽ gần nhất, để tooltip tra cứu mà không tính lại */
let ctx = { byMG:[], cur:[], prev:[], year:0, hasCompare:false };

/* ---------------- vẽ biểu đồ ---------------- */
export function renderChart(txs, year){
  const d = chartData(txs, year, hidden);
  ctx = { byMG:d.byMG, cur:d.cur, prev:d.prev, year, hasCompare:d.hasCompare };

  $('cmpHint').textContent = d.hasCompare ? `mờ = ${year-1}` : '';

  /* --- trục Y: mốc tròn + đường kẻ ngang --- */
  const { ticks, top } = d.axis;
  const desc = ticks.slice().reverse();
  $('yaxis').innerHTML = desc
    .map(v => `<div class="ytick"><span>${v === 0 ? '0' : fmtShort(v)}</span></div>`)
    .join('');
  $('grid').innerHTML = desc.map(() => `<div class="gline"></div>`).join('');

  /* --- các cột --- */
  $('bars').innerHTML = d.cur.map((v, i) => {
    const segs = Object.entries(d.byMG[i])
      .sort((a,b) => b[1] - a[1])
      .map(([g, val]) =>
        `<div class="seg" style="height:${val / Math.max(v,1) * 100}%;background:${groupStyle(g).c}"></div>`
      ).join('');

    const ghost = d.prev[i] > 0
      ? `<div class="stack cmpbar" style="height:${d.prev[i] / top * 100}%"></div>`
      : '';

    return `<div class="bcol" data-mo="${i}" tabindex="0">
      <div class="colbox">
        ${ghost}
        <div class="stack" style="width:${d.hasCompare ? '52%' : '100%'};height:${v / top * 100}%">${segs}</div>
      </div>
      <div class="mo">${i+1}</div>
    </div>`;
  }).join('');
}

/* ---------------- legend bật/tắt ---------------- */
export function renderLegend(sorted){
  $('barLegend').innerHTML = sorted
    .map(([g]) => {
      const off = hidden.has(g);
      return `<button class="lg${off ? ' off' : ''}" data-g="${esc(g)}" aria-pressed="${!off}">
        <i style="background:${groupStyle(g).c}"></i>${esc(g)}
      </button>`;
    }).join('');
}

/* ---------------- tooltip ---------------- */
function tipHTML(i){
  const total = ctx.cur[i];

  if(!total && !ctx.prev[i]){
    return `<div class="tt-h">Tháng ${i+1}/${ctx.year}</div>
            <div class="tt-empty">Chưa có khoản thu</div>`;
  }

  const rows = Object.entries(ctx.byMG[i])
    .sort((a,b) => b[1] - a[1])
    .map(([g, v]) =>
      `<div class="tt-r">
         <span class="tt-n"><i style="background:${groupStyle(g).c}"></i>${esc(g)}</span>
         <span class="tt-v">${fmtVND(v)}</span>
       </div>`).join('');

  /* so sánh cùng tháng năm trước */
  let cmp = '';
  if(ctx.hasCompare && ctx.prev[i] > 0){
    const diff = total - ctx.prev[i];
    const pct  = Math.abs(diff / ctx.prev[i] * 100).toFixed(1);
    const up   = diff >= 0;
    cmp = `<div class="tt-cmp ${up ? 'up' : 'down'}">
             ${up ? '▲' : '▼'} ${pct}% so T${i+1}/${ctx.year-1}
             <span class="tt-prev">(${fmtVND(ctx.prev[i])})</span>
           </div>`;
  }

  /* trên cảm ứng: nhắc chạm lần nữa để xem chi tiết giao dịch */
  const hint = touchMode ? `<div class="tt-hint">Chạm lần nữa để xem giao dịch</div>` : '';

  return `<div class="tt-h">Tháng ${i+1}/${ctx.year}</div>
          ${rows}
          <div class="tt-tot"><span>Tổng</span><span>${fmtVND(total)}</span></div>
          ${cmp}${hint}`;
}

let hotCol = null;

/* Trạng thái cho thao tác chạm (xem chú thích ở bindChart) */
let touchMode = false;   // lần tương tác gần nhất là chạm hay chuột
let armedCol  = null;    // cột đã chạm lần 1, chờ chạm lần 2 để lọc

function showTip(col){
  const tp = $('tip');
  /* đang hiện đúng cột này rồi thì thôi (tránh vẽ lại liên tục khi rê chuột) */
  if(col === hotCol && tp.classList.contains('on')) return;

  tp.innerHTML = tipHTML(+col.dataset.mo);
  tp.classList.add('on');

  /* đặt vị trí trong khung biểu đồ, tự lật khi sát mép */
  const host = $('chartBox').getBoundingClientRect();
  const c    = col.getBoundingClientRect();
  const w    = tp.offsetWidth;

  let x = c.left - host.left + c.width/2 - w/2;
  x = Math.max(6, Math.min(x, host.width - w - 6));

  tp.style.left = x + 'px';
  tp.style.top  = Math.max(4, c.top - host.top - tp.offsetHeight - 10) + 'px';

  if(hotCol) hotCol.classList.remove('hot');
  col.classList.add('hot');
  hotCol = col;
}

function hideTip(){
  $('tip').classList.remove('on');
  if(hotCol){ hotCol.classList.remove('hot'); hotCol = null; }
}

/* ---------------- gắn sự kiện 1 lần ---------------- */
export function bindChart(onFilterChange, onMonthClick){
  const bars = $('bars');

  /* Bấm vào cột → mở danh sách giao dịch tháng đó.
     Desktop: rê chuột = xem tooltip, bấm = lọc → hai thao tác tách bạch.
     Cảm ứng: chỉ có một thao tác chạm, nên chạm lần 1 hiện tooltip,
     chạm lần 2 vào ĐÚNG cột đó mới lọc. Nếu lọc ngay từ lần đầu thì
     tooltip vừa hiện đã bị chuyển tab, không kịp đọc. */
  bars.addEventListener('click', e => {
    const col = e.target.closest('.bcol');
    if(!col || !onMonthClick) return;

    if(touchMode){
      if(armedCol !== col){ armedCol = col; return; }   // lần chạm đầu: chỉ xem
      armedCol = null;
    }
    onMonthClick(+col.dataset.mo);
  });
  bars.addEventListener('keydown', e => {
    if(e.key !== 'Enter' && e.key !== ' ') return;
    const col = e.target.closest('.bcol');
    if(col && onMonthClick){ e.preventDefault(); onMonthClick(+col.dataset.mo); }
  });

  /* Dùng Pointer Events và lọc theo pointerType.
     Lý do: trên thiết bị cảm ứng, sau touchend trình duyệt còn phát sinh
     một chuỗi mouseleave/mousemove giả để tương thích chuột — nếu nghe
     mouseleave thì tooltip vừa chạm hiện xong sẽ bị tắt ngay. */
  bars.addEventListener('pointermove', e => {
    if(e.pointerType !== 'mouse') return;
    const col = e.target.closest('.bcol');
    col ? showTip(col) : hideTip();
  });
  bars.addEventListener('pointerleave', e => {
    if(e.pointerType === 'mouse') hideTip();
  });

  /* Chạm: chạm vào cột để xem, chạm chỗ khác để tắt.
     Một listener duy nhất trên document — tách làm hai sẽ bị bubbling
     khiến cái tắt chạy sau cái bật. */
  document.addEventListener('pointerdown', e => {
    if(e.pointerType === 'mouse'){ touchMode = false; return; }
    touchMode = true;
    const col = e.target.closest('#bars .bcol');
    if(col){
      showTip(col);
    }else{
      hideTip();
      armedCol = null;   // chạm ra ngoài thì huỷ trạng thái chờ
    }
  }, { passive:true });

  /* bàn phím (Tab để duyệt từng tháng) */
  bars.addEventListener('focusin',  e => { const c = e.target.closest('.bcol'); if(c) showTip(c); });
  bars.addEventListener('focusout', e => {
    /* chỉ tắt khi rời hẳn biểu đồ, không tắt khi Tab sang cột kế bên */
    if(!bars.contains(e.relatedTarget)) hideTip();
  });

  /* legend: bấm để ẩn/hiện nhóm */
  $('barLegend').addEventListener('click', e => {
    const btn = e.target.closest('.lg');
    if(!btn) return;
    const g = btn.dataset.g;
    hidden.has(g) ? hidden.delete(g) : hidden.add(g);
    hideTip();
    onFilterChange();
  });
}
