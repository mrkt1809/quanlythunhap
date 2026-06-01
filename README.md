# 💰 Thu Nhập — BIDV Income Tracker

Web app (PWA) theo dõi & phân tích nguồn thu nhập, đồng bộ tức thì giữa **điện thoại và máy tính** qua Firebase. Cài được lên màn hình chính như app thật.

## Tính năng
- Nhập liệu nhanh trên mobile (form lớn, dễ bấm, tự định dạng số tiền)
- **Tự phân loại nguồn thu** từ ghi chú: Lương, Thưởng KPI, Quỹ thu nhập, Phụ cấp dự án, Thưởng lễ/Tết, v.v. (xử lý được cả chữ có dấu lẫn không dấu)
- Dashboard: tổng năm, tăng trưởng so cùng kỳ, TB/tháng, tháng cao nhất
- Biểu đồ thu nhập theo tháng (xếp chồng theo nhóm + so sánh năm trước) và cơ cấu nguồn thu
- Đăng nhập Google, dữ liệu riêng tư chỉ mình bạn truy cập
- Hoạt động offline (xem lại dữ liệu đã tải)

---

## ⚙️ Thiết lập (làm 1 lần, ~10 phút)

### Bước 1 — Tạo project Firebase
1. Vào https://console.firebase.google.com → **Add project** → đặt tên (vd: `thu-nhap`) → tạo.
2. Trong project: **Build → Authentication → Get started → Sign-in method → Google → Enable → Save**.
3. **Build → Firestore Database → Create database** → chọn **Production mode** → chọn location gần (asia-southeast1) → Enable.

### Bước 2 — Lấy cấu hình & dán vào code
1. **Project settings** (bánh răng) → kéo xuống **Your apps** → bấm biểu tượng web `</>` → đặt nickname → **Register app**.
2. Copy đoạn `firebaseConfig = { ... }`.
3. Dán đè vào **`index.html`** (chỗ có `PASTE_...`) **và** **`import.html`** (y hệt).

> 🔒 **An toàn:** firebaseConfig KHÔNG phải bí mật — Google thiết kế để công khai. Cái bảo vệ dữ liệu là Security Rules ở bước 3 + đăng nhập Google. Cứ đẩy lên GitHub public thoải mái.

### Bước 3 — Dán Security Rules (QUAN TRỌNG)
1. **Firestore Database → Rules**.
2. Xoá hết, dán toàn bộ nội dung file **`firestore.rules`** → **Publish**.
3. Rule này đảm bảo: chỉ tài khoản của bạn đọc/ghi được dữ liệu của bạn.

### Bước 4 — Cho phép domain đăng nhập
**Authentication → Settings → Authorized domains → Add domain** → thêm domain bạn sẽ deploy:
- `<tên-bạn>.github.io` (nếu dùng GitHub Pages)
- hoặc `<project>.web.app` (nếu dùng Firebase Hosting)
- `localhost` đã có sẵn để test máy.

---

## 🚀 Deploy lên GitHub Pages
1. Tạo repo mới trên GitHub, upload toàn bộ thư mục này (index.html, manifest.json, sw.js, import.html, seed.json, các icon...).
2. Repo → **Settings → Pages → Source: Deploy from a branch → main → /(root) → Save**.
3. Đợi 1–2 phút, GitHub cho link dạng `https://<tên-bạn>.github.io/<repo>/`.
4. Nhớ thêm domain đó vào Authorized domains (Bước 4).

> Hoặc dùng **Firebase Hosting** (cùng hệ sinh thái): cài `npm i -g firebase-tools` → `firebase login` → `firebase init hosting` (public dir = thư mục này) → `firebase deploy`.

---

## 📥 Nạp dữ liệu cũ (89 giao dịch từ Sheet)
1. Mở `https://.../import.html` trên **máy tính**.
2. Đăng nhập đúng tài khoản Google.
3. Bấm **Bắt đầu Import** — chỉ **một lần duy nhất** (chạy 2 lần sẽ trùng dữ liệu).
4. Xong thì mở `index.html` để dùng. Có thể xoá/để ẩn `import.html` sau đó.

---

## 📱 Cài lên điện thoại
- **iPhone (Safari):** mở link → nút Share → **Add to Home Screen**.
- **Android (Chrome):** mở link → menu ⋮ → **Cài đặt ứng dụng / Add to Home screen**.
Mở từ icon sẽ chạy toàn màn hình như app thật.

---

## 🧩 Tuỳ chỉnh phân loại
Sửa mảng `RULES` trong `index.html`. Mỗi dòng `["TỪ KHOÁ","Nhóm"]`, từ khoá viết HOA không dấu, đặt từ cụ thể lên trước (dò từ trên xuống). Nếu đổi, nên cập nhật cùng logic trong file import (đã phân loại sẵn vào seed.json).

## Lưu ý
- Gói Firebase **Spark (miễn phí)** thừa sức cho nhu cầu cá nhân (50K đọc/ngày).
- App không chứa token bí mật nào. Nếu trước đây bạn từng để lộ Telegram bot token, hãy thu hồi qua BotFather.
