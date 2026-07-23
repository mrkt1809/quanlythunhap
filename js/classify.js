/* ============================================================
   classify.js — Bỏ dấu tiếng Việt + tự nhận diện nhóm thu nhập
   ============================================================ */
import { RULES } from "./config.js";

/* Bỏ dấu + đưa về CHỮ HOA để so khớp.
   Lưu ý: chữ "đ" không nằm trong dải \u0300-\u036f nên phải thay riêng. */
export const stripVN = s =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toUpperCase();

/* Trả về tên nhóm từ nội dung ghi chú */
export function classify(note){
  const n = stripVN(note);
  for(const [kw, g] of RULES){
    if(n.includes(kw)) return g;
  }
  return "Khác";
}
