/* ============================================================
   ui/list.js — Danh sách giao dịch + vuốt sang trái để xoá
   Dùng event delegation: gắn listener 1 LẦN lên #list,
   không cần bindSwipe() lại sau mỗi lần render.
   ============================================================ */
import { groupStyle, groupStyleFor, typeInfo } from "../config.js";
import { yearTx, groupOf, typeOf } from "../compute.js";
import { stripVN } from "../classify.js";
import { fmtVND, fmtDate, esc } from "../format.js";
import { getTxs, getYear, removeTx, isSaving } from "../store.js";
import { toast } from "./toast.js";
import { openEdit } from "./modal.js";

const $ = id => document.getElementById(id);
const SWIPE_OPEN = -88;   // độ mở khi để lộ nút Xoá
const SWIPE_MAX  = -110;  // kéo tối đa
const SWIPE_TRIG = -44;   // ngưỡng để chốt mở

/* Lọc theo tháng khi bấm vào cột biểu đồ. null = xem cả năm. */
let moFilter = null;
export const setMonthFilter = m => { moFilter = m; renderList(); };
export const clearMonthFilter = () => { moFilter = null; };

/* Lọc theo loại giao dịch. null = tất cả loại. */
let tyFilter = null;

/* Hàng chip lọc loại, kèm số khoản mỗi loại trong năm */
function renderTypeFilter(txs, year){
  const box = $('tyFilter');
  if(!box) return;
  const inYear = yearTx(txs, year);
  const cnt = { all:inYear.length, in:0, out:0, transfer:0 };
  inYear.forEach(t => { cnt[typeOf(t)] = (cnt[typeOf(t)]||0) + 1; });

  const chips = [
    ['all','Tất cả', cnt.all],
    ['in','Thu', cnt.in],
    ['out','Chi', cnt.out],
    ['transfer','Hỗ trợ', cnt.transfer]
  ];
  box.innerHTML = chips.map(([v,label,n]) => {
    const on = (tyFilter === null && v === 'all') || tyFilter === v;
    return `<button class="tyf tyf-${v} ${on?'on':''}" data-ty="${v}">${label}<span class="tyf-n">${n}</span></button>`;
  }).join('');
}

/* Empty state theo ngữ cảnh: icon + tiêu đề + gợi ý hành động.
   Phân biệt: đang tìm kiếm / lọc tháng / lọc loại cụ thể / rỗng cả năm. */
function emptyState(q){
  const TY = { in:['📥','khoản thu'], out:['📤','khoản chi'], transfer:['🤝','khoản hỗ trợ'] };
  let icon = '🗂', title = '', hint = '';

  if(q){
    icon = '🔍';
    title = 'Không tìm thấy giao dịch nào';
    hint  = 'Thử từ khoá khác, hoặc xoá ô tìm kiếm để xem tất cả.';
  } else if(moFilter !== null){
    const [ic] = tyFilter ? TY[tyFilter] : ['🗓'];
    icon = ic;
    title = `Tháng ${moFilter+1} chưa có giao dịch`;
    hint  = 'Bấm × ở thẻ phía trên để bỏ lọc tháng.';
  } else if(tyFilter && TY[tyFilter]){
    const [ic, noun] = TY[tyFilter];
    icon = ic;
    title = `Chưa có ${noun} nào năm nay`;
    hint  = `Bấm “+ Thêm” ở trên để ghi ${noun} đầu tiên.`;
  } else {
    title = `Chưa có giao dịch năm này`;
    hint  = 'Bấm “+ Thêm” để ghi giao dịch đầu tiên.';
  }

  return `<div class="empty">
    <div class="em">${icon}</div>
    <div class="empty-t">${title}</div>
    <div class="empty-h">${hint}</div>
  </div>`;
}

export function renderList(){
  const txs = getTxs(), year = getYear();
  if(year == null) return;

  const q = stripVN($('search').value || '');
  let rows = yearTx(txs, year);
  if(moFilter !== null) rows = rows.filter(t => new Date(t.date).getMonth() === moFilter);
  if(tyFilter !== null) rows = rows.filter(t => typeOf(t) === tyFilter);
  if(q) rows = rows.filter(t => stripVN(t.note || '').includes(q));

  /* hàng chip lọc loại: Tất cả · Thu · Chi · Hỗ trợ */
  renderTypeFilter(txs, year);

  /* chip hiện bộ lọc tháng đang áp dụng */
  const chip = $('moChip');
  if(moFilter === null){
    chip.style.display = 'none';
  }else{
    /* Tổng gộp mọi loại sẽ sai (cộng cả chi vào như thu).
       Hiện dòng tiền ròng = thu + hỗ trợ − chi cho đúng nghĩa. */
    const net = rows.reduce((s,t) => {
      const ty = typeOf(t);
      return s + (ty === 'out' ? -t.amount : t.amount);
    }, 0);
    const netStr = (net < 0 ? '−' : '+') + fmtVND(Math.abs(net));
    chip.style.display = 'flex';
    chip.innerHTML = `<span class="ch-t">Tháng ${moFilter+1}/${year}</span>
      <span class="ch-s">${rows.length} khoản · ${netStr}</span>
      <button class="ch-x" id="moChipX" aria-label="Bỏ lọc tháng">×</button>`;
  }

  const el = $('list');
  if(!rows.length){
    el.innerHTML = emptyState(q);
    return;
  }

  el.innerHTML = rows.map(t => {
    const type = typeOf(t);
    const g = groupOf(t), G = groupStyleFor(type, g);
    /* Dấu + màu theo loại để liếc là biết Thu/Chi/Hỗ trợ:
       Thu +  (xanh) · Chi −  (đỏ) · Hỗ trợ ↔ (vàng) */
    const sign  = type === 'out' ? '−' : (type === 'transfer' ? '↔ ' : '+');
    /* nhãn chữ ngắn để phân biệt kể cả khi không nhìn màu */
    const tag   = type === 'out' ? 'CHI' : (type === 'transfer' ? 'HỖ TRỢ' : 'THU');
    return `<div class="tx-wrap">
      <div class="del-bg" data-del="${t.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>Xoá
      </div>
      <div class="tx tx-${type}" data-id="${t.id}">
        <div class="tag" style="background:${G.c}">${G.e}</div>
        <div class="mid">
          <div class="n">${esc(t.note || '(không ghi chú)')}</div>
          <div class="d"><span class="tbadge tb-${type}">${tag}</span>${fmtDate(t.date)} · ${g}</div>
        </div>
        <div class="amt amt-${type}">${sign}${fmtVND(t.amount)}</div>
      </div>
    </div>`;
  }).join('');
}

/* ---------- vuốt để xoá (gắn 1 lần) ---------- */
function closeSwiped(except){
  document.querySelectorAll('.tx.swiped').forEach(c => { if(c !== except) c.classList.remove('swiped'); });
}

export function bindList(){
  const el = $('list');

  /* tìm kiếm */
  $('search').addEventListener('input', renderList);

  /* bỏ lọc tháng (nút × trên chip — chip được vẽ lại nên phải uỷ quyền) */
  $('moChip').addEventListener('click', e => {
    if(e.target.closest('#moChipX')){ moFilter = null; renderList(); }
  });

  /* chip lọc loại: Tất cả / Thu / Chi / Hỗ trợ */
  const tyBox = $('tyFilter');
  if(tyBox) tyBox.addEventListener('click', e => {
    const b = e.target.closest('.tyf');
    if(!b) return;
    tyFilter = b.dataset.ty === 'all' ? null : b.dataset.ty;
    renderList();
  });

  /* trạng thái kéo — dùng chung cho cả chuột và cảm ứng */
  let card = null, x0 = 0, y0 = 0, dx = 0, decided = false, horiz = false;

  const start = (target, x, y) => {
    card = target.closest('.tx');
    if(!card) return;
    x0 = x; y0 = y; dx = 0; decided = false; horiz = false;
    card.classList.add('dragging');
  };

  const move = (x, y) => {
    if(!card) return false;
    const mx = x - x0, my = y - y0;
    if(!decided && (Math.abs(mx) > 8 || Math.abs(my) > 8)){
      decided = true;
      horiz = Math.abs(mx) > Math.abs(my);
    }
    if(!horiz) return false;
    dx = mx + (card.classList.contains('swiped') ? SWIPE_OPEN : 0);
    if(dx > 0) dx = 0;
    if(dx < SWIPE_MAX) dx = SWIPE_MAX;
    card.style.transform = `translateX(${dx}px)`;
    return true;
  };

  const end = () => {
    if(!card) return;
    const c = card; card = null;
    c.classList.remove('dragging');
    c.style.transform = '';
    if(!horiz){
      /* chạm nhẹ, không kéo → mở form sửa */
      if(!decided){ closeSwiped(null); openEdit(c.dataset.id); }
      return;
    }
    if(dx < SWIPE_TRIG){ closeSwiped(c); c.classList.add('swiped'); }
    else c.classList.remove('swiped');
  };

  /* cảm ứng */
  el.addEventListener('touchstart', e => start(e.target, e.touches[0].clientX, e.touches[0].clientY), { passive:true });
  el.addEventListener('touchmove',  e => { if(move(e.touches[0].clientX, e.touches[0].clientY)) e.preventDefault(); }, { passive:false });
  el.addEventListener('touchend', end);
  el.addEventListener('touchcancel', end);

  /* chuột */
  el.addEventListener('mousedown', e => { if(e.target.closest('.del-bg')) return; start(e.target, e.clientX, e.clientY); e.preventDefault(); });
  el.addEventListener('mousemove', e => move(e.clientX, e.clientY));
  el.addEventListener('mouseup', end);
  el.addEventListener('mouseleave', end);

  /* nút Xoá lộ ra sau khi vuốt */
  el.addEventListener('click', async e => {
    const btn = e.target.closest('.del-bg');
    if(!btn) return;
    const id = btn.dataset.del;
    if(!id || isSaving()) return;
    if(!confirm('Xoá khoản thu này?')){ closeSwiped(null); return; }
    const r = await removeTx(id);
    toast(r.ok ? 'Đã xoá' : '⚠️ Lỗi xoá: ' + r.msg);
  });
}
