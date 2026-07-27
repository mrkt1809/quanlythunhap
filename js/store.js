/* ============================================================
   store.js — Nơi duy nhất giữ dữ liệu + kết nối Supabase
   Các module UI chỉ cần subscribe(), không tự đọc database.

   ⚠️ Giữ NGUYÊN "hình dạng" API như bản Firebase cũ:
   getTxs, getYear, isSaving, subscribe, onAuth, setYear,
   init, login, logout, saveTx, removeTx.
   Nhờ vậy các file UI không phải sửa gì khi đổi nền database.
   ============================================================ */
import { createClient }
  from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, CONFIGURED } from "./config.js";

const TABLE = "transactions";

/* ---------- state nội bộ ---------- */
let sb = null;          // client Supabase
let channel = null;     // kênh realtime
let uid = null;         // id người dùng đang đăng nhập
let txs = [];
let selYear = null;
let saving = false;

const dataSubs = [];
const authSubs = [];

/* ---------- đọc state ---------- */
export const getTxs   = () => txs;
export const getYear  = () => selYear;
export const isSaving = () => saving;
export const isReady  = () => CONFIGURED;

/* ---------- đăng ký lắng nghe ---------- */
export function subscribe(fn){
  dataSubs.push(fn);
  fn(txs, selYear);
  return () => dataSubs.splice(dataSubs.indexOf(fn), 1);
}
export function onAuth(fn){ authSubs.push(fn); }

const notify     = () => dataSubs.forEach(fn => fn(txs, selYear));
const notifyAuth = u  => authSubs.forEach(fn => fn(u));

/* ---------- chọn năm ---------- */
export function setYear(y){ selYear = y; notify(); }

/* ---------- ánh xạ hàng DB ↔ object app ----------
   DB dùng cột "group" (từ khoá SQL) + created_at.
   App quen dùng {id, date, amount, note, group}. Chuyển qua lại ở đây
   để phần còn lại của app không phải biết gì về cấu trúc bảng. */
const rowToTx = r => ({
  id: r.id, date: r.date, amount: r.amount,
  note: r.note || "", group: r.group, type: r.type
});

/* ---------- khởi động ---------- */
export function init(){
  if(!CONFIGURED) return false;
  sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /* theo dõi đăng nhập/đăng xuất — thay cho onAuthStateChanged của Firebase */
  sb.auth.onAuthStateChange((_event, session) => {
    const user = session?.user || null;
    if(user && user.id !== uid) handleLogin(user);
    else if(!user && uid)       handleLogout();
  });

  /* lấy phiên hiện có (đã đăng nhập từ lần trước) */
  sb.auth.getSession().then(({ data }) => {
    if(data.session?.user) handleLogin(data.session.user);
    else notifyAuth(null);
  });
  return true;
}

/* ---------- đăng nhập / đăng xuất ----------
   Dùng email + mật khẩu. Trả về lỗi cho UI hiển thị, không tự ném. */
export async function login(email, password){
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if(error) throw error;
}
export async function signup(email, password){
  const { error } = await sb.auth.signUp({ email, password });
  if(error) throw error;
}
export const logout = () => sb.auth.signOut();

/* ---------- nạp dữ liệu + realtime ---------- */
async function handleLogin(user){
  uid = user.id;

  await loadAll();          // tải toàn bộ 1 lần
  subscribeRealtime();      // rồi lắng nghe thay đổi để đồng bộ đa thiết bị

  notifyAuth(user);
}

async function loadAll(){
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false });

  if(error){ notifyAuth({ error: error.message }); return; }

  txs = data.map(rowToTx);
  if(!selYear){
    selYear = txs.length ? new Date(txs[0].date).getFullYear() : new Date().getFullYear();
  }
  notify();
}

/* Realtime: nghe INSERT/UPDATE/DELETE trên bảng, chỉ của mình (RLS lọc sẵn).
   Cách đơn giản và chắc chắn: có bất kỳ thay đổi nào thì tải lại toàn bộ.
   Dữ liệu nhỏ (vài trăm dòng) nên tải lại không tốn gì, mà tránh được
   mọi rắc rối gộp/sắp xếp thủ công. */
function subscribeRealtime(){
  if(channel) sb.removeChannel(channel);
  channel = sb
    .channel("tx-changes")
    .on("postgres_changes",
        { event: "*", schema: "public", table: TABLE },
        () => loadAll())
    .subscribe();
}

function handleLogout(){
  if(channel){ sb.removeChannel(channel); channel = null; }
  uid = null; txs = []; selYear = null;
  notifyAuth(null);
}

/* ---------- ghi dữ liệu ----------
   Giữ nguyên chữ ký saveTx(data, editId) / removeTx(id) như bản Firebase.
   data = { amount, date, note, group, type } (type mặc định 'in' nếu thiếu).
   Trả về { ok:true } hoặc { ok:false, msg }.

   Sau khi ghi, gọi loadAll() ngay để UI cập nhật tức thì, không đợi realtime
   (realtime có độ trễ nhỏ; tải lại luôn cho cảm giác mượt). */
export async function saveTx(data, editId){
  if(saving) return { ok:false, msg:'Đang xử lý…' };
  saving = true;
  try{
    const row = {
      date:   data.date,
      amount: data.amount,
      note:   data.note || "",
      group:  data.group,
      type:   data.type || "in",
      user_id: uid
    };
    let error;
    if(editId){
      ({ error } = await sb.from(TABLE).update(row).eq("id", editId));
    }else{
      ({ error } = await sb.from(TABLE).insert(row));
    }
    if(error) return { ok:false, msg: error.message };

    selYear = new Date(data.date).getFullYear();
    await loadAll();
    return { ok:true };
  }catch(e){
    return { ok:false, msg: e.message };
  }finally{
    saving = false;
  }
}

export async function removeTx(id){
  if(saving) return { ok:false, msg:'Đang xử lý…' };
  saving = true;
  try{
    const { error } = await sb.from(TABLE).delete().eq("id", id);
    if(error) return { ok:false, msg: error.message };
    await loadAll();
    return { ok:true };
  }catch(e){
    return { ok:false, msg: e.message };
  }finally{
    saving = false;
  }
}
