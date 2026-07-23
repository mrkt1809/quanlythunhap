/* ============================================================
   ui/modal.js — Form thêm / sửa khoản thu
   Nguyên tắc từ Ver 2 giữ nguyên:
   - đóng popup NGAY, không chờ Firestore (tránh treo trên mạng chậm)
   - khoá nút Lưu bằng cờ saving để không tạo bản ghi trùng
   ============================================================ */
import { groupStyle } from "../config.js";
import { classify } from "../classify.js";
import { fmtVND } from "../format.js";
import { getTxs, saveTx as storeSave, removeTx, isSaving } from "../store.js";
import { toast } from "./toast.js";

const $ = id => document.getElementById(id);
let editId = null;

/* ---------- mở form ---------- */
export function openAdd(){
  editId = null;
  $('mTitle').textContent = 'Thêm khoản thu';
  $('mAmount').value = '';
  $('mNote').value   = '';
  $('mDate').value   = new Date().toISOString().slice(0,10);
  $('mDel').style.display = 'none';
  $('predict').style.display = 'none';
  $('modal').classList.add('on');
}

export function openEdit(id){
  const t = getTxs().find(x => x.id === id);
  if(!t) return;
  editId = id;
  $('mTitle').textContent = 'Sửa khoản thu';
  $('mAmount').value = fmtVND(t.amount);
  $('mNote').value   = t.note || '';
  $('mDate').value   = t.date;
  $('mDel').style.display = 'block';
  $('modal').classList.add('on');
  showPredict();
}

export const closeModal = () => $('modal').classList.remove('on');

/* ---------- tiện ích trong form ---------- */
function fmtAmount(el){
  const v = el.value.replace(/[^\d]/g, '');
  el.value = v ? fmtVND(+v) : '';
}

function showPredict(){
  const note = $('mNote').value;
  const p = $('predict');
  if(!note.trim()){ p.style.display = 'none'; return; }
  const g = classify(note), G = groupStyle(g);
  p.style.display = 'flex';
  p.innerHTML = `<span class="pc" style="background:${G.c}"></span>Tự phân loại: ${G.e} ${g}`;
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

  const data = { amount, date, note, group: classify(note), ts: Date.now() };
  const isEdit = !!editId;

  const r = await storeSave(data, editId);

  btn.disabled = false; btn.textContent = 'Lưu';
  closeModal();   // luôn đóng, dù thành công hay lỗi
  toast(r.ok ? (isEdit ? 'Đã cập nhật' : 'Đã thêm khoản thu') : '⚠️ Lỗi lưu: ' + r.msg);
}

async function handleDelete(){
  if(!editId || isSaving()) return;
  if(!confirm('Xoá khoản thu này?')) return;
  const r = await removeTx(editId);
  closeModal();
  toast(r.ok ? 'Đã xoá' : '⚠️ Lỗi xoá: ' + r.msg);
}

/* ---------- gắn sự kiện 1 lần ---------- */
export function bindModal(){
  $('mAmount').addEventListener('input', e => fmtAmount(e.target));
  $('mNote').addEventListener('input', showPredict);
  $('mSave').addEventListener('click', handleSave);
  $('mDel').addEventListener('click', handleDelete);
  $('mCancel').addEventListener('click', closeModal);

  /* bấm ra ngoài để đóng */
  $('modal').addEventListener('click', e => { if(e.target.id === 'modal') closeModal(); });
}
