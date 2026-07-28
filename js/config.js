/* ============================================================
   config.js — Cấu hình Firebase + định nghĩa nhóm thu nhập
   ============================================================ */

/* Cấu hình Supabase.
   Hai giá trị này lấy ở: Supabase → Project Settings → API
   - SUPABASE_URL: mục "Project URL"
   - SUPABASE_ANON_KEY: mục "Project API keys" → "anon public"
   Khoá anon công khai được (giống firebaseConfig trước đây) — bảo vệ thật
   nằm ở Row Level Security, không phải ở việc giấu khoá này. */
export const SUPABASE_URL      = "PASTE_SUPABASE_URL";
export const SUPABASE_ANON_KEY = "PASTE_SUPABASE_ANON_KEY";

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

/* Màu (c) và biểu tượng (e) của từng nhóm THU */
export const GROUPS = {
  "Lương":{c:"#12305c",e:"💼"},"Thưởng KPI":{c:"#2f9e8f",e:"🎯"},
  "Quỹ thu nhập":{c:"#c79a3b",e:"🏦"},"Phụ cấp dự án":{c:"#6c5b9e",e:"🛠"},
  "Thưởng lễ/Tết":{c:"#c4585f",e:"🎁"},"Thưởng khác":{c:"#5a8f4f",e:"⭐"},
  "Hỗ trợ/Phúc lợi":{c:"#b5852c",e:"🤝"},"Khác":{c:"#9aa0a6",e:"💰"}
};

/* ============================================================
   CHI (type = 'out') — nhóm + luật đoán từ khoá
   Tạm để trong code như nhóm thu. Chặng 4 sẽ chuyển sang Supabase
   để sửa/thêm trên app; khi đó cấu trúc này thành "nhóm mặc định".
   ============================================================ */
export const EXPENSE_GROUPS = {
  "Ăn uống":{c:"#e07a5f",e:"🍜"},
  "Học phí con":{c:"#3d7ea6",e:"🎓"},
  "Đi lại":{c:"#5a8f4f",e:"🚗"},
  "Hoá đơn":{c:"#c79a3b",e:"🧾"},
  "Mua sắm":{c:"#9c6ba3",e:"🛍"},
  "Sức khoẻ":{c:"#4aa5a0",e:"💊"},
  "Trả nợ & Thẻ tín dụng":{c:"#b23b48",e:"🏦"},
  "Khác":{c:"#9aa0a6",e:"💸"}
};

export const EXPENSE_RULES = [
  ["AN UONG","Ăn uống"],["AN SANG","Ăn uống"],["AN TRUA","Ăn uống"],["AN TOI","Ăn uống"],["CAFE","Ăn uống"],["CA PHE","Ăn uống"],["COFFEE","Ăn uống"],["HIGHLANDS","Ăn uống"],["NHA HANG","Ăn uống"],["QUAN AN","Ăn uống"],["GRAB FOOD","Ăn uống"],["GRABFOOD","Ăn uống"],["SHOPEE FOOD","Ăn uống"],["BAEMIN","Ăn uống"],["COM","Ăn uống"],
  ["HOC PHI","Học phí con"],["TIEN HOC","Học phí con"],["DONG HOC","Học phí con"],["TRUONG","Học phí con"],["MAM NON","Học phí con"],["HOC THEM","Học phí con"],
  ["XANG","Đi lại"],["GRAB","Đi lại"],["TAXI","Đi lại"],["BE ","Đi lại"],["GUI XE","Đi lại"],["GUIXE","Đi lại"],["VE MAY BAY","Đi lại"],["VE XE","Đi lại"],["VE TAU","Đi lại"],["PARKING","Đi lại"],
  ["DIEN","Hoá đơn"],["NUOC","Hoá đơn"],["INTERNET","Hoá đơn"],["WIFI","Hoá đơn"],["EVN","Hoá đơn"],["FPT","Hoá đơn"],["VIETTEL","Hoá đơn"],["TRUYEN HINH","Hoá đơn"],["HOA DON","Hoá đơn"],["CUOC","Hoá đơn"],
  ["SHOPEE","Mua sắm"],["LAZADA","Mua sắm"],["TIKI","Mua sắm"],["SIEU THI","Mua sắm"],["BACH HOA","Mua sắm"],["WINMART","Mua sắm"],["BACHHOAXANH","Mua sắm"],["QUAN AO","Mua sắm"],["DIEN MAY","Mua sắm"],
  ["THUOC","Sức khoẻ"],["NHA THUOC","Sức khoẻ"],["BENH VIEN","Sức khoẻ"],["KHAM","Sức khoẻ"],["PHONG KHAM","Sức khoẻ"],["NHA SI","Sức khoẻ"],["Y TE","Sức khoẻ"],["BAO HIEM","Sức khoẻ"],
  ["TRA NO","Trả nợ & Thẻ tín dụng"],["TRANO","Trả nợ & Thẻ tín dụng"],["VAY","Trả nợ & Thẻ tín dụng"],["THE TIN DUNG","Trả nợ & Thẻ tín dụng"],["TIN DUNG","Trả nợ & Thẻ tín dụng"],["CREDIT","Trả nợ & Thẻ tín dụng"],["THANH TOAN THE","Trả nợ & Thẻ tín dụng"],["GOC VAY","Trả nợ & Thẻ tín dụng"],["LAI VAY","Trả nợ & Thẻ tín dụng"],["TRA GOP","Trả nợ & Thẻ tín dụng"]
];

/* ============================================================
   HỖ TRỢ / CHUYỂN GIAO (type = 'transfer')
   Tiền đi qua túi, KHÔNG phải thu nhập. VD: vợ chuyển góp trả nợ.
   ============================================================ */
export const TRANSFER_GROUPS = {
  "Vợ hỗ trợ":{c:"#d98fae",e:"💝"},
  "Người thân hỗ trợ":{c:"#c79a3b",e:"🤲"},
  "Khác":{c:"#9aa0a6",e:"↔"}
};

export const TRANSFER_RULES = [
  ["VO CHUYEN","Vợ hỗ trợ"],["VO GOP","Vợ hỗ trợ"],["VO HO TRO","Vợ hỗ trợ"],
  ["BO ME","Người thân hỗ trợ"],["GIA DINH","Người thân hỗ trợ"],["NGUOI THAN","Người thân hỗ trợ"]
];

/* ============================================================
   Tra cứu theo loại — cho phần còn lại của app dùng chung một cửa.
   type: 'in' | 'out' | 'transfer'
   ============================================================ */
export const TYPES = {
  in:       { label:"Thu",    groups:GROUPS,          rules:RULES,          fallback:"Khác", sign:"+", color:"#2f7d52" },
  out:      { label:"Chi",    groups:EXPENSE_GROUPS,  rules:EXPENSE_RULES,  fallback:"Khác", sign:"−", color:"#b23b48" },
  transfer: { label:"Hỗ trợ", groups:TRANSFER_GROUPS, rules:TRANSFER_RULES, fallback:"Khác", sign:"↔", color:"#b5852c" }
};

export const typeInfo = t => TYPES[t] || TYPES.in;

/* Lấy màu/icon an toàn cho 1 nhóm, theo đúng loại của nó */
export function groupStyleFor(type, g){
  const info = typeInfo(type);
  return info.groups[g] || info.groups[info.fallback];
}

/* Lấy màu/icon an toàn (giữ cho code cũ chỉ biết nhóm THU) */
export const groupStyle = g => GROUPS[g] || GROUPS["Khác"];
