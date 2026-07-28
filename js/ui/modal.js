/* ============================================================
   ui/modal.js — Form thêm / sửa giao dịch (Thu / Chi / Hỗ trợ)
   Nguyên tắc giữ nguyên:
   - đóng popup NGAY, không chờ mạng
   - khoá nút Lưu bằng cờ saving để không tạo bản ghi trùng
   Ver 4.0 thêm:
   - chọn 1 trong 3 loại: in (thu) / out (chi) / transfer (hỗ trợ)
   - "đoán trước – sửa sau": máy gợi ý nhóm, chạm nút để đổi tay
   ============================================================ */
import { typeInfo, groupStyleFor } from "../config.js";
import { classifyFor } from "../classify.js";
import { fmtVND, esc } from "../format.js";
import { getTxs, saveTx as storeSave, removeTx, isSaving } from "../store.js";
import { toast } from "./toast.js";

const $ = id => document.getElementById(id);

let editId   = null;
let curType  = 'in';      // loại đang chọn
let curGroup = null;      // nhóm đang chọn (null = để máy đoán theo ghi chú)

/* ---------- mở form ---------- */
export function openAdd(type = 'in'){
  editId = null;
  curType = type;
  curGroup = null;
  $('mTitle').textContent = 'Thêm giao dịch';
  $('mAmount').value = '';
  $('mNote').value   = '';
  $('mDate').value   = new Date().toISOString().slice(0,10);
  $('mDel').style.display = 'none';
  renderTypeTabs();
  renderGroupPicker();
  $('modal').classList.add('on');
}

export function openEdit(id){
  const t = getTxs().find(x => x.id === id);
  if(!t) return;
  editId = id;
  curType = t.type || 'in';
  curGroup = t.group || null;    // giữ đúng nhóm đã lưu
  $('mTitle').textContent = 'Sửa giao dịch';
  $('mAmount').value = fmtVND(t.amount);
  $('mNote').value   = t.note || '';
  $('mDate').value   = t.date;
  $('mDel').style.display = 'block';
  renderTypeTabs();
  renderGroupPicker();
  $('modal').classList.add('on');
}

export const closeModal = () => $('modal').classList.remove('on');

/* ---------- chọn loại (Thu / Chi / Hỗ trợ) ---------- */
function renderTypeTabs(){
  $('mTypeTabs').innerHTML = ['in','out','transfer'].map(t => {
    const info = typeInfo(t);
    return `<button class="mtype ${t===curType?'on':''}" data-type="${t}"
              style="${t===curType?`--tc:${info.color}`:''}">${info.label}</button>`;
  }).join('');
}

function setType(t){
  if(t === curType) return;
  curType = t;
  curGroup = null;          // đổi loại thì bỏ chọn nhóm cũ, để đoán lại
  renderTypeTabs();
  renderGroupPicker();
}

/* ---------- nhóm: gợi ý + chọn tay ----------
   Nhóm hiện tại = nhóm người dùng đã chạm (curGroup),
   hoặc nếu chưa chạm thì máy đoán từ ghi chú. */
function effectiveGroup(){
  if(curGroup) return curGroup;
  return classifyFor(curType, $('mNote').value);
}

function renderGroupPicker(){
  const info = typeInfo(curType);
  const active = effectiveGroup();

  /* dòng gợi ý */
  const G = groupStyleFor(curType, active);
  $('predict').style.display = 'flex';
  $('predict').innerHTML = curGroup
    ? `<span class="pc" style="background:${G.c}"></span>Nhóm đã chọn: ${G.e} ${esc(active)}`
    : `<span class="pc" style="background:${G.c}"></span>Tự đoán: ${G.e} ${esc(active)} <span class="pc-hint">· chạm nút bên dưới để đổi</span>`;

  /* hàng nút chọn nhóm — chạm 1 cái là đổi */
  $('mGroups').innerHTML = Object.keys(info.groups).map(g => {
    const gs = info.groups[g];
    return `<button class="gchip ${g===active?'on':''}" data-g="${esc(g)}"
              style="${g===active?`--gc:${gs.c}`:''}">${gs.e} ${esc(g)}</button>`;
  }).join('');
}

/* ---------- tiện ích ---------- */
function fmtAmount(el){
  const v = el.value.replace(/[^\d]/g, '');
  el.value = v ? fmtVND(+v) : '';
}

/* ---------- lưu / xoá ---------- */
async function handleSave(){
  if(isSaving()) return;

  const amount = +$('mAmount').value.replace(/[^\d]/g, '');
  const date   = $('mDate').value;
  const note   = $('mNote').value.trim();
  if(!amount || !date){ toast('Nhập số tiền và ngày'); return; }

  const btn = $('mSave');
  btn.disabled = true; btn.textContent = 'Đang lưu…';

  const data = {
    amount, date, note,
    type:  curType,
    group: effectiveGroup()
  };
  const isEdit = !!editId;

  const r = await storeSave(data, editId);

  btn.disabled = false; btn.textContent = 'Lưu';
  closeModal();
  const label = typeInfo(curType).label.toLowerCase();
  toast(r.ok ? (isEdit ? 'Đã cập nhật' : `Đã thêm khoản ${label}`) : '⚠️ Lỗi lưu: ' + r.msg);
}

async function handleDelete(){
  if(!editId || isSaving()) return;
  if(!confirm('Xoá giao dịch này?')) return;
  const r = await removeTx(editId);
  closeModal();
  toast(r.ok ? 'Đã xoá' : '⚠️ Lỗi xoá: ' + r.msg);
}

/* ---------- gắn sự kiện 1 lần ---------- */
export function bindModal(){
  $('mAmount').addEventListener('input', e => fmtAmount(e.target));

  /* gõ ghi chú → đoán lại (chỉ khi chưa chọn tay) */
  $('mNote').addEventListener('input', () => { if(!curGroup) renderGroupPicker(); });

  /* chọn loại */
  $('mTypeTabs').addEventListener('click', e => {
    const b = e.target.closest('.mtype'); if(b) setType(b.dataset.type);
  });

  /* chọn nhóm tay */
  $('mGroups').addEventListener('click', e => {
    const b = e.target.closest('.gchip');
    if(!b) return;
    curGroup = b.dataset.g;
    renderGroupPicker();
  });

  $('mSave').addEventListener('click', handleSave);
  $('mDel').addEventListener('click', handleDelete);
  $('mCancel').addEventListener('click', closeModal);
  $('modal').addEventListener('click', e => { if(e.target.id === 'modal') closeModal(); });
}
