/* ============================================================
   ui/list.js — Danh sách giao dịch + vuốt sang trái để xoá
   Dùng event delegation: gắn listener 1 LẦN lên #list,
   không cần bindSwipe() lại sau mỗi lần render.
   ============================================================ */
import { groupStyle } from "../config.js";
import { yearTx, groupOf } from "../compute.js";
import { stripVN } from "../classify.js";
import { fmtVND, fmtDate, esc } from "../format.js";
import { getTxs, getYear, removeTx, isSaving } from "../store.js";
import { toast } from "./toast.js";
import { openEdit } from "./modal.js";

const $ = id => document.getElementById(id);
const SWIPE_OPEN = -88;   // độ mở khi để lộ nút Xoá
const SWIPE_MAX  = -110;  // kéo tối đa
const SWIPE_TRIG = -44;   // ngưỡng để chốt mở

export function renderList(){
  const txs = getTxs(), year = getYear();
  if(year == null) return;

  const q = stripVN($('search').value || '');
  let rows = yearTx(txs, year);
  if(q) rows = rows.filter(t => stripVN(t.note || '').includes(q));

  const el = $('list');
  if(!rows.length){
    el.innerHTML = `<div class="empty"><div class="em">🗂</div>Chưa có giao dịch${q ? ' khớp tìm kiếm' : ' năm ' + year}</div>`;
    return;
  }

  el.innerHTML = rows.map(t => {
    const g = groupOf(t), G = groupStyle(g);
    return `<div class="tx-wrap">
      <div class="del-bg" data-del="${t.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>Xoá
      </div>
      <div class="tx" data-id="${t.id}">
        <div class="tag" style="background:${G.c}">${G.e}</div>
        <div class="mid">
          <div class="n">${esc(t.note || '(không ghi chú)')}</div>
          <div class="d">${fmtDate(t.date)} · ${g}</div>
        </div>
        <div class="amt">+${fmtVND(t.amount)}</div>
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
