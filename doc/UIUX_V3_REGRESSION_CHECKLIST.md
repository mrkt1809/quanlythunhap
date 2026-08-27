# UIUX V3 — REGRESSION CHECKLIST

> Chạy checklist này **sau mỗi phase** redesign. Bất kỳ mục nào lệch so với
> `UIUX_V3_BASELINE.md` là regression → dừng, sửa trước khi đi tiếp.
> Cách dùng: so số liệu với mục B/C/D của baseline; so hành vi với mục F.

## Data (so với baseline B, C, D)
- [ ] Total Thu không đổi
- [ ] Total Chi không đổi
- [ ] Total Hỗ trợ không đổi
- [ ] Net không đổi (= Thu + Hỗ trợ − Chi)
- [ ] Monthly totals không đổi (12 tháng, cả 3 loại)
- [ ] Group totals không đổi (Thu / Chi / Hỗ trợ)
- [ ] YoY không đổi
- [ ] Số giao dịch mỗi loại không đổi
- [ ] Số tháng có Thu / có Chi không đổi

## CRUD
- [ ] Add hoạt động (đủ 3 loại Thu/Chi/Hỗ trợ)
- [ ] Edit hoạt động (giữ đúng type + group cũ)
- [ ] Delete hoạt động (swipe + trong modal)
- [ ] Realtime refresh hoạt động (đổi ở thiết bị khác → tự cập nhật)

## Classification (so với baseline E)
- [ ] Auto classify đúng — 20 mẫu ra đúng group như baseline
- [ ] Manual override đúng (chạm nút nhóm ghi đè máy đoán)
- [ ] Edit transaction giữ group đúng (không tự đoán lại khi mở sửa)
- [ ] Sửa note sau khi đã chọn group tay → group KHÔNG đổi

## Navigation
- [ ] Tab Tổng quan hiện đúng
- [ ] Tab Giao dịch hiện đúng
- [ ] Tab Báo cáo hiện đúng
- [ ] Year switching (đổi năm cập nhật cả 3 màn)
- [ ] Mode switching (Thu / Chi / Thu–Chi)
- [ ] Đổi năm → bỏ lọc tháng (không kẹt lọc tháng năm cũ)

## Chart
- [ ] Tooltip đúng (desktop rê chuột / mobile chạm)
- [ ] Tooltip net hiện đúng Thu/Chi/Còn lại từng tháng (không "chưa có khoản thu" sai)
- [ ] Legend bật/tắt nhóm đúng (chỉ ảnh hưởng chart, KPI giữ nguyên)
- [ ] Touch: chạm lần 1 xem, lần 2 lọc tháng
- [ ] Month drill-down: bấm cột → sang Giao dịch lọc đúng tháng

## Report / export
- [ ] Report Thu đúng (bảng tháng × nhóm, luỹ kế, cùng kỳ)
- [ ] Report Chi đúng
- [ ] Bảng Chênh lệch đúng (Còn lại cả năm khớp Net ở Tổng quan)
- [ ] Transaction CSV đúng: cột `Ngày, Loại, Số tiền, Nhóm, Ghi chú`; Chi số âm; cũ→mới; BOM
- [ ] Report CSV đúng: 3 section THU NHẬP / CHI TIÊU / CHÊNH LỆCH

## Responsive
- [ ] Mobile: layout đúng, nav dưới đáy, KPI ẩn 2 ô phụ (trừ mode net)
- [ ] Desktop (≥1024px): sidebar trái hiện đúng, grid 2 cột, không rơi nav xuống đáy
- [ ] Modal vừa màn hình, cuộn được trên màn thấp

## Coupling giữ nguyên (kiểm bằng mắt trên code)
- [ ] `compute.js` không bị sửa
- [ ] `store.js` API giữ nguyên chữ ký
- [ ] `classify.js` + RULES/EXPENSE_RULES/TRANSFER_RULES không đổi
- [ ] `setKpiLabels` vẫn khớp cấu trúc `.kpi .l` (nếu đổi KPI card phải cập nhật cùng lúc)
- [ ] Không set `display` inline bằng JS cho login/app/nav (chỉ toggle `.authed`)
- [ ] `net = income + transfer − expense` giữ nguyên
