-- ============================================================
-- FILE 1: Tạo bảng giao dịch + bảo mật hàng (RLS)
-- Chạy file này TRƯỚC, trong Supabase → SQL Editor → New query → Run
-- ============================================================

-- Bảng lưu mọi giao dịch (giờ là thu, sau sẽ có cả chi)
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,                       -- ngày nhận tiền
  amount      bigint not null check (amount > 0),  -- số tiền (đồng), luôn dương
  note        text default '',                     -- nội dung / ghi chú
  "group"     text not null default 'Khác',        -- nhóm (group là từ khoá SQL nên phải để trong ngoặc kép)
  type        text not null default 'in'           -- 'in' = thu, 'out' = chi (sẵn cho Ver 4.0)
              check (type in ('in','out')),
  created_at  timestamptz not null default now()   -- thay cho 'ts' cũ, tự động
);

-- Chỉ mục giúp lọc theo người dùng + thời gian nhanh hơn
create index if not exists idx_tx_user_date
  on public.transactions (user_id, date desc);

-- ============================================================
-- Row Level Security: MỖI NGƯỜI CHỈ THẤY DỮ LIỆU CỦA CHÍNH MÌNH
-- Đây là lớp bảo vệ thật, thay cho Firestore Security Rules cũ.
-- ============================================================
alter table public.transactions enable row level security;

-- Xoá policy cũ nếu chạy lại file (cho an toàn)
drop policy if exists "chi doc cua minh"  on public.transactions;
drop policy if exists "chi them cua minh" on public.transactions;
drop policy if exists "chi sua cua minh"  on public.transactions;
drop policy if exists "chi xoa cua minh"  on public.transactions;

-- ĐỌC: chỉ những hàng có user_id = chính mình
create policy "chi doc cua minh" on public.transactions
  for select using (auth.uid() = user_id);

-- THÊM: chỉ được thêm hàng mang user_id của chính mình
create policy "chi them cua minh" on public.transactions
  for insert with check (auth.uid() = user_id);

-- SỬA: chỉ sửa hàng của mình
create policy "chi sua cua minh" on public.transactions
  for update using (auth.uid() = user_id);

-- XOÁ: chỉ xoá hàng của mình
create policy "chi xoa cua minh" on public.transactions
  for delete using (auth.uid() = user_id);
