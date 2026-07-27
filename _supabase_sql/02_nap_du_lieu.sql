-- ============================================================
-- FILE 2: Nạp 99 giao dịch lịch sử từ Firebase
-- ⚠️ CHẠY FILE NÀY SAU KHI ĐÃ ĐĂNG NHẬP APP LẦN ĐẦU trên Supabase
--    (cần có tài khoản thì mới biết user_id để gán cho dữ liệu)
--
-- Cách chạy: Supabase → SQL Editor → dán toàn bộ file này → Run
-- Nó tự tìm user_id của bạn qua email bạn đăng nhập.
-- ============================================================

-- 👉 SỬA email dưới đây thành email bạn dùng để đăng nhập app:
do $$
declare
  uid uuid;
begin
  select id into uid from auth.users
  where email = 'THAY_EMAIL_CUA_BAN@gmail.com'   -- ⚠️ SỬA DÒNG NÀY
  limit 1;

  if uid is null then
    raise exception 'Không tìm thấy user với email đó. Đăng nhập app 1 lần rồi chạy lại, và kiểm tra email đã gõ đúng chưa.';
  end if;

  -- Tránh nạp trùng nếu lỡ chạy 2 lần
  delete from public.transactions where user_id = uid;

  insert into public.transactions (user_id, date, amount, note, "group", type) values
    (uid, '2025-10-20', 4190476, 'PHU CAP CBTT DA IBANK 2.0 T6-9/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2026-05-15', 11432571, 'LƯƠNG GIỮA KỲ THÁNG 05/2026', 'Lương', 'in'),
    (uid, '2026-04-24', 10660000, 'BIDV TSC CHI DONG VIEN NHAN DIP KY NIEM 69 NAM THANH LAP BIDV', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-12-23', 12869783, 'CHI LUONG CUOI KY THANG 12/2025', 'Lương', 'in'),
    (uid, '2026-02-11', 11324000, 'LƯƠNG GIỮA KỲ THÁNG 02/2026', 'Lương', 'in'),
    (uid, '2026-02-05', 9405000, 'Thưởng KPI - Quý 04 Năm 2025', 'Thưởng KPI', 'in'),
    (uid, '2025-11-30', 12329800, 'CHI LUONG CUOI KY THANG 11/2025', 'Lương', 'in'),
    (uid, '2026-03-30', 14960545, 'LƯƠNG CUỐI KỲ THÁNG 03/2026', 'Lương', 'in'),
    (uid, '2025-09-30', 11672890, 'CHI LUONG CUOI KY THANG 09/2025', 'Lương', 'in'),
    (uid, '2026-05-29', 12844624, 'LƯƠNG CUỐI KỲ THÁNG 05/2026', 'Lương', 'in'),
    (uid, '2026-06-08', 12768000, 'TRUY THU TRUY LINH KPI QUY 1.2026 THEO XEP LOAI KPI', 'Khác', 'in'),
    (uid, '2025-06-26', 11430000, 'CHI BO SUNG THU NHAP DONG VIEN NLD THEO CV SO 4524/BIDV-TC N26.06.2025', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-06-27', 11947461, 'CHI LUONG CUOI KY THANG 06/2025', 'Lương', 'in'),
    (uid, '2026-05-29', 1000000, 'CHI DONG VIEN NHAN DIP QUOC TE THIEU NHI 1/6/2026', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-10-21', 2041071, 'LTG DA Ibank 2.0 T8/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2026-03-04', 17497734, 'BIDV TSC CHI QUYET TOAN KPI NAM 2025', 'Thưởng KPI', 'in'),
    (uid, '2025-04-18', 2090000, 'PHU CAP CBTT DA IBANK2.0 T3/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-03-14', 8524119, 'CHI LUONG GIUA KY THANG 03/2025', 'Lương', 'in'),
    (uid, '2025-06-13', 2095238, 'PHU CAP CBTT DA IBANK2.0 T5/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-07-31', 12052761, 'CHI LUONG CUOI KY THANG 07/2025', 'Lương', 'in'),
    (uid, '2026-03-16', 3368182, 'LTG DA Ibank2.0 moi T1/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2026-03-16', 6156000, 'PHU CAP CBTT DA IBANK2.0 MOI T12/2025 VA T1-2/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2025-10-15', 7777370, 'CHI LUONG GIUA KY THANG10/2025', 'Lương', 'in'),
    (uid, '2025-12-13', 9308348, 'CHI LUONG GIUA KY THANG 12/2025', 'Lương', 'in'),
    (uid, '2026-03-13', 52594361, 'BIDV TSC TAM QUYET TOAN QTN NAM 2025', 'Quỹ thu nhập', 'in'),
    (uid, '2025-02-19', 2200000, 'PHU CAP CBTT DA IBANK2.0 T1/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2026-04-29', 5000000, 'BIDV TSC CHI DONG VIEN NHAN DIP 30.4.26 VA 1.5.26', 'Thưởng lễ/Tết', 'in'),
    (uid, '2026-06-12', 11324000, 'LƯƠNG GIỮA KỲ THÁNG 06/2026', 'Lương', 'in'),
    (uid, '2025-03-24', 4524375, 'LTG DA iBank 2.0 T2/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-08-25', 2200000, 'PHU CAP CBTT DA IBANK2.0 T7/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2026-04-07', 1500000, 'BIDV TSC CHI THUONG DANH HIEU LAO DONG TIEN TIEN NAM 2025', 'Thưởng khác', 'in'),
    (uid, '2025-05-15', 9038167, 'CHI LUONG GIUA KY THANG 05/2025', 'Lương', 'in'),
    (uid, '2026-01-30', 13767592, 'LƯƠNG CUỐI KỲ THÁNG 01/2026', 'Lương', 'in'),
    (uid, '2026-02-10', 46904000, 'BIDV TSC CHI BS QUY THU NHAP N2025 THEO XL HTNV N2025', 'Quỹ thu nhập', 'in'),
    (uid, '2025-07-15', 8568819, 'CHI LUONG GIUA KY THANG 07/2025', 'Lương', 'in'),
    (uid, '2025-04-15', 9461500, 'CHI LUONG GIUA KY THANG 04/2025', 'Lương', 'in'),
    (uid, '2025-02-21', 8905875, 'Thưởng KPI - Quý 04 Năm 2024', 'Thưởng KPI', 'in'),
    (uid, '2026-02-27', 13330500, 'LƯƠNG CUỐI KỲ THÁNG 02/2026', 'Lương', 'in'),
    (uid, '2025-03-25', 14596382, 'QUYET TOAN KPI N2024', 'Thưởng KPI', 'in'),
    (uid, '2025-01-15', 8568819, 'CHI LUONG GIUA KY THANG 01/2025', 'Lương', 'in'),
    (uid, '2026-03-06', 3957600, 'BIDV TSC TRUY LINH LUONG NANG SUAT 6 THANG CUOI NAM 2025', 'Lương', 'in'),
    (uid, '2026-02-12', 5000000, 'BIDV TSC CHUC MUNG NAM MOI 2026', 'Thưởng lễ/Tết', 'in'),
    (uid, '2026-06-29', 26650000, 'BIDV TSC QUYET TOAN QTN 2025', 'Quỹ thu nhập', 'in'),
    (uid, '2025-02-15', 9461500, 'CHI LUONG GIUA KY THANG 02/2025', 'Lương', 'in'),
    (uid, '2025-08-30', 8454836, 'CHI LUONG CUOI KY THANG 08/2025', 'Lương', 'in'),
    (uid, '2026-04-29', 13711928, 'LƯƠNG CUỐI KỲ THÁNG 04/2026', 'Lương', 'in'),
    (uid, '2025-10-21', 3313044, 'LTG DA Ibank 2.0 T7/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2026-03-16', 2850000, 'LTG DA Ibank2.0 moi T2/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2026-01-15', 10817333, 'LƯƠNG GIỮA KỲ THÁNG 01/2026', 'Lương', 'in'),
    (uid, '2025-04-26', 11538432, 'CHI LUONG CUOI KY THANG 04/2025', 'Lương', 'in'),
    (uid, '2025-08-21', 18000000, 'HDQT KTHUONG CA NHAN CO TTXS DA XDUNG HT NGAN HANG DTU CHO KHTC - QD 886', 'Thưởng khác', 'in'),
    (uid, '2025-11-15', 9804000, 'CHI LUONG GIUA KY THANG 11/2025', 'Lương', 'in'),
    (uid, '2025-01-23', 10160667, 'CHI LUONG CUOI KY THANG 01/2025', 'Lương', 'in'),
    (uid, '2025-05-16', 4113068, 'LTG DA Ibank2.0 T4/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-12-23', 4446000, 'PHU CAP CBTT DA IBANK 2.0 T8-11/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-08-21', 1500000, 'KHEN THUONG CON CB DAT THANH TICH HT TOT N2024-2025', 'Thưởng khác', 'in'),
    (uid, '2026-02-06', 6300000, 'BIDV TSC CHI THUONG HTNV NAM 2025', 'Thưởng khác', 'in'),
    (uid, '2025-01-29', 2025000, 'BIDV HO CHUC MUNG NAM MOI 2025: VUNG BUOC CHUYEN MINH, BUT PHA VUON XA', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-06-13', 8947452, 'CHI LUONG GIUA KY THANG 06/2025', 'Lương', 'in'),
    (uid, '2026-06-29', 2052000, 'PHU CAP DA BIDV DIRECT T5/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2026-06-29', 4071429, 'LTG DA Bidv Direct T5/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2025-08-28', 9000000, 'BIDV CHI DONG VIEN 80 NAM NGAY QUOC KHANH 2/9/2025 THEO CV 6763/BIDV-TC N25/8/25', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-12-29', 5000000, 'CHI DONG VIEN TET DUONG LICH N2026 THEO 11301/TB-BIDV', 'Thưởng lễ/Tết', 'in'),
    (uid, '2026-05-26', 3756818, 'LTG DA Bidv Direct T4/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2025-09-18', 3000000, 'Chi sinh nhật', 'Thưởng lễ/Tết', 'in'),
    (uid, '2026-01-07', 11250000, 'THUONG HOAN THANH NHIEM VU KHKD N2025 THEO SO 43/TB-BIDV', 'Thưởng khác', 'in'),
    (uid, '2025-06-27', 22669500, 'QUYET TOAN QUY THU NHAP N2024', 'Quỹ thu nhập', 'in'),
    (uid, '2025-05-30', 11500000, 'CHI LUONG CUOI KY THANG 05/2025', 'Lương', 'in'),
    (uid, '2026-05-22', 4104000, 'PHU CAP CBTT DA BIDV DIRECT T3-4/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2025-03-24', 3520109, 'LTG DA iBank 2.0 T1/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-07-17', 2095238, 'PHU CAP CBTT DA IBANK2.0 T6/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2026-06-29', 10660000, 'CHI DONG VIEN NHAN DIP QUYET TOAN QTN N2025 THEO CV SO 4926/BIDV-KH', 'Quỹ thu nhập', 'in'),
    (uid, '2025-08-29', 5000000, 'TRU SO CHINH BIDV CHI DONG VIEN 80 NAM NGAY QUOC KHANH 2/9/2025', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-09-15', 9461500, 'CHI LUONG GIUA KY THANG 09/2025', 'Lương', 'in'),
    (uid, '2026-05-26', 3368182, 'LTG DA Bidv Direct T3/2026', 'Phụ cấp dự án', 'in'),
    (uid, '2025-10-30', 13683335, 'CHI LUONG CUOI KY THANG 10/2025', 'Lương', 'in'),
    (uid, '2026-06-29', 13834940, 'LƯƠNG CUỐI KỲ THÁNG 06/2026', 'Lương', 'in'),
    (uid, '2026-05-28', 3000000, 'CHI HO TRO NGUOI THAN CB OM DAU N2026', 'Hỗ trợ/Phúc lợi', 'in'),
    (uid, '2025-03-28', 60223835, 'TAM QUYET TOAN QUY THU NHAP N2024 THEO KQXLHTNV', 'Quỹ thu nhập', 'in'),
    (uid, '2026-02-17', 2026000, 'BIDV HO CMNM 2026: Mung Xuan Doan ket, Chuc Tet An vui', 'Thưởng lễ/Tết', 'in'),
    (uid, '2026-04-15', 11324000, 'LƯƠNG GIỮA KỲ THÁNG 04/2026', 'Lương', 'in'),
    (uid, '2025-09-12', 4800600, 'TRUY LĨNH LƯƠNG NĂNG SUẤT 6 THÁNG ĐẦU NĂM 2025', 'Lương', 'in'),
    (uid, '2025-03-11', 2400300, 'TRUY LINH LUONG NS 6T CUOI NAM 2024 THEO KQXL HTNV', 'Lương', 'in'),
    (uid, '2025-01-24', 5000000, 'CHI DONG VIEN NHAN DIP TET NGUYEN DAN', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-08-15', 9975548, 'CHI LUONG GIUA KY THANG 08/2025', 'Lương', 'in'),
    (uid, '2025-04-14', 1209523, 'LTG kiem thu, nghiem thu HT Smartbanking T3/2025_TTTVH', 'Phụ cấp dự án', 'in'),
    (uid, '2025-03-21', 4643852, 'CHI TRANG PHUC N2024 BANG TM', 'Hỗ trợ/Phúc lợi', 'in'),
    (uid, '2025-11-25', 8905875, 'Thưởng KPI - Quý 03 Năm 2025', 'Thưởng KPI', 'in'),
    (uid, '2025-05-16', 3401786, 'LTG DA Ibank2.0 T3/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-05-19', 2200000, 'PHU CAP CBTT DA IBANK2.0 T4/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2026-03-13', 9642788, 'LƯƠNG GIỮA KỲ THÁNG 03/2026', 'Lương', 'in'),
    (uid, '2025-02-28', 12061000, 'CHI LUONG CUOI KY THANG 02/2025', 'Lương', 'in'),
    (uid, '2025-03-24', 2200000, 'PHU CAP CBTT DA IBANK2.0 T2/2025', 'Phụ cấp dự án', 'in'),
    (uid, '2025-09-10', 6300000, 'Chi HTNV 6 thang dau nam 2025', 'Thưởng khác', 'in'),
    (uid, '2025-02-19', 4500000, 'THUONG HTNV N2025 (TSC)', 'Thưởng khác', 'in'),
    (uid, '2026-01-01', 17857857, 'CHI BO SUNG QUY THU NHAP', 'Quỹ thu nhập', 'in'),
    (uid, '2026-07-15', 10255594, 'LƯƠNG GIỮA KỲ THÁNG 07/2026', 'Lương', 'in'),
    (uid, '2026-02-04', 19501392, 'BIDV CHI DONG VIEN NHAN DIP TET NGUYEN DAN BINH NGO 2026 - 852/BIDV-KH N4/2/2026', 'Thưởng lễ/Tết', 'in'),
    (uid, '2025-03-29', 11538432, 'CHI LUONG CUOI KY THANG 03/2025', 'Lương', 'in');

  raise notice 'Đã nạp xong % giao dịch cho user %', (select count(*) from public.transactions where user_id=uid), uid;
end $$;