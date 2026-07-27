/* ============================================================
   config.js — Cấu hình Firebase + định nghĩa nhóm thu nhập
   ============================================================ */

/* Cấu hình Supabase.
   Hai giá trị này lấy ở: Supabase → Project Settings → API
   - SUPABASE_URL: mục "Project URL"
   - SUPABASE_ANON_KEY: mục "Project API keys" → "anon public"
   Khoá anon công khai được (giống firebaseConfig trước đây) — bảo vệ thật
   nằm ở Row Level Security, không phải ở việc giấu khoá này. */
export const SUPABASE_URL      = "https://tmuyefhixhgbjjoefjkq.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdXllZmhpeGhnYmpqb2VmamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjMyMTUsImV4cCI6MjEwMDczOTIxNX0.bVMeTrD-dl-rzld-T2klECHU7xONWevL_44hPacXYwg";

export const CONFIGURED = !SUPABASE_URL.startsWith("PASTE");

/* Luật phân loại — port từ bản Excel.
   Thứ tự QUAN TRỌNG: khớp từ trên xuống, cái cụ thể đặt trước cái tổng quát. */
export const RULES = [
  ["LUONG GIUA KY","Lương"],["LUONG CUOI KY","Lương"],["TRUY LINH LUONG","Lương"],["LUONG NANG SUAT","Lương"],["LUONG","Lương"],
  ["THUONG KPI","Thưởng KPI"],["QUYET TOAN KPI","Thưởng KPI"],
  ["QUY THU NHAP","Quỹ thu nhập"],["QTN","Quỹ thu nhập"],
  ["PHU CAP","Phụ cấp dự án"],["LTG DA","Phụ cấp dự án"],["LTG KIEM THU","Phụ cấp dự án"],["LTG","Phụ cấp dự án"],["IBANK","Phụ cấp dự án"],["SMARTBANKING","Phụ cấp dự án"],["DIRECT","Phụ cấp dự án"],
  ["TET","Thưởng lễ/Tết"],["DONG VIEN","Thưởng lễ/Tết"],["CHUC MUNG NAM MOI","Thưởng lễ/Tết"],["CMNM","Thưởng lễ/Tết"],["KY NIEM","Thưởng lễ/Tết"],["QUOC KHANH","Thưởng lễ/Tết"],["30.4","Thưởng lễ/Tết"],["SINH NHAT","Thưởng lễ/Tết"],
  ["THUONG HOAN THANH","Thưởng khác"],["THUONG HTNV","Thưởng khác"],["HTNV","Thưởng khác"],["LAO DONG TIEN TIEN","Thưởng khác"],["KHEN THUONG","Thưởng khác"],["KTHUONG","Thưởng khác"],["THUONG","Thưởng khác"],
  ["TRANG PHUC","Hỗ trợ/Phúc lợi"],["HO TRO","Hỗ trợ/Phúc lợi"]
];

/* Màu (c) và biểu tượng (e) của từng nhóm */
export const GROUPS = {
  "Lương":{c:"#12305c",e:"💼"},"Thưởng KPI":{c:"#2f9e8f",e:"🎯"},
  "Quỹ thu nhập":{c:"#c79a3b",e:"🏦"},"Phụ cấp dự án":{c:"#6c5b9e",e:"🛠"},
  "Thưởng lễ/Tết":{c:"#c4585f",e:"🎁"},"Thưởng khác":{c:"#5a8f4f",e:"⭐"},
  "Hỗ trợ/Phúc lợi":{c:"#b5852c",e:"🤝"},"Khác":{c:"#9aa0a6",e:"💰"}
};

/* Lấy màu/icon an toàn, không bao giờ undefined */
export const groupStyle = g => GROUPS[g] || GROUPS["Khác"];
