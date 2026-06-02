# 💰 Quản Lý Thu Nhập — Tổng Kết Dự Án

> Web app (PWA) theo dõi & phân tích nguồn thu nhập cá nhân, đồng bộ đa thiết bị qua Firebase, host trên GitHub Pages.
> Cập nhật lần cuối: 02/06/2026 · Phiên bản chuẩn bị deploy: **Ver 2**

---

## 1. Mục tiêu dự án

- Theo dõi các khoản thu nhập (lương, thưởng, phụ cấp...) một cách tập trung
- Quản lý tổng thu nhập theo **tháng** và **năm**
- **So sánh cùng kỳ** giữa các năm có dữ liệu
- **Tự động phân loại** nguồn thu để biết cơ cấu (lương cứng / thưởng / quỹ thu nhập...)
- Dùng được trên **cả điện thoại và máy tính**, nhập liệu nhanh trên mobile

---

## 2. Lịch sử phiên bản (đánh số theo bản LÊN PRODUCTION)

> Quy ước: chỉ tính version theo bản thực sự được deploy lên môi trường thật (GitHub Pages),
> để tránh "hổng" version chỉ tồn tại trên máy mà chưa đẩy lên.

- **Ver 1** *(đã deploy — bản đang chạy thật trước hôm nay)*
  - Web app PWA đầu tiên: dashboard, danh sách giao dịch, form nhập, tự phân loại nguồn thu
  - Nút thêm dạng nổi (FAB) ở góc
  - Đóng popup sau khi Firestore ghi xong (phụ thuộc tốc độ mạng)

- **Ver 2** *(bản final hôm nay — chuẩn bị deploy)*
  - Chuyển nút "Thêm" vào giữa thanh nav (bỏ FAB nổi che nội dung)
  - Đóng popup tức thì khi Lưu/Xoá + khóa nút chống tạo bản ghi trùng
  - Phân biệt rõ lưu thành công / lỗi thật (toast cảnh báo)
  - Thêm vuốt sang trái để xoá (swipe-to-delete kiểu iOS)
  - Service worker network-first + cache `thunhap-v2`
  - ⚠️ Các mốc "v2/v3" nhắc tới trong lúc làm trước đây là đếm theo từng lần sửa trên máy
    (chưa deploy) — nay quy chuẩn lại: **bản production kế tiếp = Ver 2**

### Bối cảnh trước đó (tiền thân, không tính là version app)
- Google Sheet + Apps Script: tổng hợp theo tháng, báo cáo Telegram
- Excel template: công thức + tự phân loại nguồn thu (không cần code)

---

## 3. Kiến trúc & công nghệ

- **Frontend:** 1 file `index.html` (HTML + CSS + JavaScript thuần, không framework)
- **Database:** Firebase Firestore (đồng bộ realtime đa thiết bị)
- **Xác thực:** Firebase Authentication (đăng nhập Google)
- **Hosting:** GitHub Pages (repo `mrkt1809/quanlythunhap`)
- **PWA:** `manifest.json` + `sw.js` (service worker) → cài lên màn hình chính, chạy offline

---

## 4. Cấu trúc file trong project

- `index.html` — toàn bộ app (dashboard, danh sách giao dịch, form nhập)
- `import.html` — công cụ nạp dữ liệu cũ vào Firebase (dùng 1 lần)
- `seed.json` — 89 giao dịch lịch sử 2025–2026 đã phân loại sẵn
- `firestore.rules` — luật bảo mật Firestore (chỉ chủ tài khoản truy cập)
- `manifest.json` — cấu hình PWA
- `sw.js` — service worker (cache + cập nhật) — phiên bản cache hiện tại: **v2**
- `icon-192.png`, `icon-512.png` — icon app
- `README.md` — hướng dẫn thiết lập Firebase & deploy

---

## 5. Tính năng đã hoàn thành

- **Dashboard:** tổng thu nhập năm, tăng trưởng so cùng kỳ, TB/tháng, tháng cao nhất
- **Biểu đồ theo tháng:** xếp chồng theo nhóm + so sánh năm trước (dạng mờ)
- **Cơ cấu nguồn thu:** thanh tỷ lệ % từng nhóm
- **Chọn năm:** pill chuyển nhanh giữa các năm có dữ liệu
- **Tự phân loại nguồn thu** từ ghi chú (xử lý cả chữ có dấu lẫn không dấu):
  Lương · Thưởng KPI · Quỹ thu nhập · Phụ cấp dự án · Thưởng lễ/Tết · Thưởng khác · Hỗ trợ/Phúc lợi
- **Nhập liệu mobile:** form lớn, tự định dạng số tiền, hiện nhóm dự đoán ngay khi gõ
- **Nút "Thêm" ở giữa thanh nav** (không che nội dung — đã bỏ nút nổi FAB)
- **Đóng popup tức thì** khi Lưu/Xoá + **khóa chống tạo bản ghi trùng**
- **Vuốt sang trái để xoá** (swipe-to-delete kiểu iOS) + xác nhận trước khi xoá
- **Tìm kiếm** giao dịch theo ghi chú
- **Đăng nhập Google**, dữ liệu riêng tư từng tài khoản
- **Hoạt động offline** (xem lại dữ liệu đã tải)

---

## 6. Bảo mật

- `firebaseConfig` công khai được (Google thiết kế vậy) — KHÔNG phải lỗ hổng
- Bảo vệ thật nằm ở **Firestore Security Rules** + **đăng nhập Google**
- Không nhúng khóa bí mật nào trong code client
- ⚠️ Telegram bot token ở bản Apps Script cũ đã lộ → cần thu hồi qua BotFather

---

## 7. Quản lý mã nguồn với Git

Tất cả project đặt chung tại `C:\Projects`, mỗi project là 1 thư mục con có git riêng.

### Quy trình cập nhật hằng ngày
```cmd
cd C:\Projects\quanlythunhap
git pull
:: chép file mới đè vào đây, rồi:
git add .
git commit -m "Mo ta ro rang thay doi"
git push
```
> GitHub Pages tự build lại sau 1–2 phút. Trên điện thoại, gỡ/thêm lại app khi đổi service worker.

### Xem lịch sử phiên bản
```cmd
git log --oneline
```

### Rollback khi bản mới lỗi
- **Hủy bản mới nhất (an toàn nhất):**
  ```cmd
  git revert HEAD
  git push
  ```
- **Về một bản cũ cụ thể:**
  ```cmd
  git revert --no-commit <ma_commit>..HEAD
  git commit -m "Rollback ve <ma_commit>"
  git push
  ```
- **Chỉ khôi phục 1 file:**
  ```cmd
  git checkout <ma_commit> -- index.html
  git add . && git commit -m "Khoi phuc index.html" && git push
  ```

> Quy tắc: dùng `revert` (tiến về phía trước, không mất lịch sử), TRÁNH `reset --hard` (xóa lịch sử, nguy hiểm).
> Lịch sử git thay thế hoàn toàn cho folder Archive — không cần lưu bản cũ thủ công.

---

## 8. Lưu ý vận hành

- Đầu phiên làm việc: `git pull` — Cuối phiên: `git push`
- Viết commit message rõ ràng để dễ rollback sau này
- Mỗi project trong `C:\Projects` độc lập — `cd` vào đúng thư mục trước khi chạy lệnh
- Gói Firebase miễn phí (Spark) thừa cho nhu cầu cá nhân

---

## 9. Hướng phát triển có thể làm tiếp (tùy chọn)

- Lọc/nhóm danh sách giao dịch theo nguồn thu
- Xuất báo cáo (PDF/Excel) từ app
- Đặt mục tiêu thu nhập năm & theo dõi tiến độ
- Gắn lại thông báo Telegram (với token mới, lưu an toàn)
- Nhập nhanh bằng cách dán nội dung sao kê BIDV
