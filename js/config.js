/* ============================================================
   config.js — Cấu hình Firebase + định nghĩa nhóm thu nhập
   ============================================================ */

export const firebaseConfig = {
  apiKey: "AIzaSyCo1lM5JvWqeYrURQ_sQQ54FixnsFfoxYI",
  authDomain: "thu-nhap-efad5.firebaseapp.com",
  projectId: "thu-nhap-efad5",
  storageBucket: "thu-nhap-efad5.firebasestorage.app",
  messagingSenderId: "969160788754",
  appId: "1:969160788754:web:b5889107919794f86941cb"
};

export const CONFIGURED = !firebaseConfig.apiKey.startsWith("PASTE");

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
