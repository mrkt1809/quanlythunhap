/* ============================================================
   classify.js — Bỏ dấu tiếng Việt + tự nhận diện nhóm
   ============================================================ */
import { RULES, typeInfo } from "./config.js";

/* Bỏ dấu + đưa về CHỮ HOA để so khớp.
   Lưu ý: chữ "đ" không nằm trong dải \u0300-\u036f nên phải thay riêng. */
export const stripVN = s =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toUpperCase();

/* Đoán nhóm theo ĐÚNG loại giao dịch (in/out/transfer).
   Mỗi loại có bộ luật riêng trong config. */
export function classifyFor(type, note){
  const info = typeInfo(type);
  const n = stripVN(note);
  for(const [kw, g] of info.rules){
    if(n.includes(kw)) return g;
  }
  return info.fallback;
}

/* Giữ hàm cũ cho phần THU (code cũ gọi classify(note) mặc định là thu) */
export function classify(note){
  const n = stripVN(note);
  for(const [kw, g] of RULES){
    if(n.includes(kw)) return g;
  }
  return "Khác";
}
