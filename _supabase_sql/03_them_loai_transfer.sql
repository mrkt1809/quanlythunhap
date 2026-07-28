-- ============================================================
-- CHẶNG 1 (Ver 4.0): Cho cột type nhận thêm giá trị 'transfer'
-- Chạy trong Supabase → SQL Editor → Run
--
-- Bảng cũ chỉ cho type in ('in','out'). Giờ nới thành
-- ('in','out','transfer') để ghi nhận khoản HỖ TRỢ / CHUYỂN GIAO
-- (tiền đi qua túi, không phải thu nhập — vd vợ chuyển góp trả nợ).
-- ============================================================

-- Bỏ ràng buộc cũ (tên do Postgres tự đặt khi tạo bảng)
alter table public.transactions
  drop constraint if exists transactions_type_check;

-- Thêm ràng buộc mới, nhận cả 3 loại
alter table public.transactions
  add constraint transactions_type_check
  check (type in ('in','out','transfer'));

-- Dữ liệu cũ vẫn là 'in' (thu) — không đụng gì tới.
-- Xong. Từ giờ app ghi được cả khoản chi và khoản hỗ trợ.
