/* ============================================================
   store.js — Nơi duy nhất giữ dữ liệu + kết nối Firebase
   Các module UI chỉ cần subscribe(), không tự đọc Firestore.
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, CONFIGURED } from "./config.js";

/* ---------- state nội bộ ---------- */
let db = null, auth = null, col = null, unsub = null;
let txs = [];
let selYear = null;
let saving = false;

const dataSubs = [];   // gọi khi txs / selYear đổi
const authSubs = [];   // gọi khi đăng nhập / đăng xuất

/* ---------- đọc state ---------- */
export const getTxs     = () => txs;
export const getYear    = () => selYear;
export const isSaving   = () => saving;
export const isReady    = () => CONFIGURED;

/* ---------- đăng ký lắng nghe ---------- */
/* subscribe(fn): fn được gọi ngay 1 lần với dữ liệu hiện tại, rồi mỗi khi có thay đổi */
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

/* ---------- khởi động ---------- */
export function init(){
  if(!CONFIGURED) return false;
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
  onAuthStateChanged(auth, u => u ? handleLogin(u) : handleLogout());
  return true;
}

export const login  = () => signInWithPopup(auth, new GoogleAuthProvider());
export const logout = () => signOut(auth);

function handleLogin(u){
  col = collection(db, "users", u.uid, "income");
  if(unsub) unsub();
  unsub = onSnapshot(query(col), snap => {
    txs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    txs.sort((a,b) => (a.date < b.date ? 1 : -1));   // mới nhất trước
    if(!selYear){
      selYear = txs.length ? new Date(txs[0].date).getFullYear() : new Date().getFullYear();
    }
    notify();
  }, err => notifyAuth({ error: err.code }));
  notifyAuth(u);
}

function handleLogout(){
  if(unsub){ unsub(); unsub = null; }
  txs = []; selYear = null; col = null;
  notifyAuth(null);
}

/* ---------- ghi dữ liệu ----------
   Trả về { ok:true } hoặc { ok:false, msg }. UI tự quyết hiển thị toast gì. */
export async function saveTx(data, editId){
  if(saving) return { ok:false, msg:'Đang xử lý…' };
  saving = true;
  try{
    if(editId) await updateDoc(doc(col, editId), data);
    else       await addDoc(col, data);
    selYear = new Date(data.date).getFullYear();
    return { ok:true };
  }catch(e){
    return { ok:false, msg: e.code || e.message };
  }finally{
    saving = false;
  }
}

export async function removeTx(id){
  if(saving) return { ok:false, msg:'Đang xử lý…' };
  saving = true;
  try{
    await deleteDoc(doc(col, id));
    return { ok:true };
  }catch(e){
    return { ok:false, msg: e.code || e.message };
  }finally{
    saving = false;
  }
}
