# UIUX V3 — BASELINE (Phase 0)

> Chốt trạng thái AS-IS của app **trước khi** redesign UI/UX V3.
> Nguồn: mã nguồn Ver 4.2 (bản production). Không sửa code trong Phase 0.
> Mục đích: sau mỗi phase đối chiếu để phát hiện regression.

---

## A. Git / Branch

- Branch ban đầu: `main`
- Branch làm việc V3: `feat/uiux-v3` (đã push lên `origin/feat/uiux-v3`)
- Commit hiện tại (HEAD): `3e1bb7b`

Xác nhận: đang làm trên nhánh riêng, chưa merge, chưa deploy production.

---

## B. Baseline số liệu — NĂM 2026 (từ report CSV thật)

Nguồn: file `bao-cao-2026.csv` bạn xuất từ app. Các con số tính lại từ chính file này.

> **Phát hiện quan trọng:** Năm 2026 hiện **CHỈ CÓ THU, chưa có Chi và Hỗ trợ nào.**
> File report không có section "CHI TIÊU" (nghĩa là chưa có khoản chi), và trong bảng
> Chênh lệch cả cột Chi lẫn Hỗ trợ đều = 0. Vì vậy baseline Chi/Hỗ trợ/Net dưới đây
> phản ánh đúng thực tế: Chi = 0, Hỗ trợ = 0, Net = Thu.

| Chỉ số | Giá trị | Nguồn |
|---|--:|---|
| Tổng Thu | **507.075.341** | TỔNG NĂM, cột Tổng tháng |
| Tổng Chi | **0** | không có section CHI TIÊU |
| Tổng Hỗ trợ | **0** | cột Hỗ trợ = 0 |
| Còn lại / Net | **507.075.341** | = Thu (vì Chi=Hỗ trợ=0) |
| Số giao dịch Thu | **48** | Transaction CSV, đếm dòng Loại=Thu |
| Số giao dịch Chi | **0** | không có dòng Loại=Chi |
| Số giao dịch Hỗ trợ | **0** | không có dòng Loại=Hỗ trợ |
| Số tháng có Thu | **8** | T1–T8 có phát sinh |
| Số tháng có Chi | **0** | — |
| TB tháng (Thu) | **63.384.418** | 507.075.341 ÷ 8 |
| Tháng cao nhất (Thu) | **Tháng 2** | — |
| Giá trị tháng cao nhất | **113.790.892** | — |
| YoY (Thu, so cùng kỳ 2025) | **+39,5%** | chỉ cộng 8 tháng năm nay có thu |

> **Nguồn kép đã đối chiếu:** Số liệu trên xác nhận bằng CẢ HAI file — Report CSV
> (`bao-cao-2026.csv`) và Transaction CSV (`giao-dich-2026.csv`, 48 dòng). Tổng, monthly
> T1–T8, và cả 8 nhóm khớp tuyệt đối giữa hai file (không chênh lệch nào).
>
> **Lưu ý phân biệt dễ nhầm:** Trong danh sách có 1 giao dịch nhóm **"Hỗ trợ/Phúc lợi"**
> (3.000.000, ngày 28/05) — đây là **nhóm THU** (type=`in`), KHÔNG phải loại **Hỗ trợ**
> (type=`transfer`). Vì vậy "Tổng Hỗ trợ = 0" (không có giao dịch type=transfer) là ĐÚNG,
> dù có một nhóm thu tên gần giống. Đây chính là ca dễ nhầm mà báo cáo AS-IS đã cảnh báo.

---

## C. Monthly baseline — ⚠️ CẦN DỮ LIỆU THẬT

Nguồn: report CSV 2026. Net = Thu + Hỗ trợ − Chi (Chi=Hỗ trợ=0 nên Net=Thu).

| Tháng | Thu | Chi | Hỗ trợ | Net |
|---|--:|--:|--:|--:|
| T1 | 53.692.782 | 0 | 0 | 53.692.782 |
| T2 | 113.790.892 | 0 | 0 | 113.790.892 |
| T3 | 111.027.210 | 0 | 0 | 111.027.210 |
| T4 | 42.195.928 | 0 | 0 | 42.195.928 |
| T5 | 39.506.195 | 0 | 0 | 39.506.195 |
| T6 | 81.360.369 | 0 | 0 | 81.360.369 |
| T7 | 24.634.333 | 0 | 0 | 24.634.333 |
| T8 | 40.867.632 | 0 | 0 | 40.867.632 |
| T9 | 0 | 0 | 0 | 0 |
| T10 | 0 | 0 | 0 | 0 |
| T11 | 0 | 0 | 0 | 0 |
| T12 | 0 | 0 | 0 | 0 |
| **Cả năm** | **507.075.341** | **0** | **0** | **507.075.341** |

---

## D. Group baseline — ⚠️ CẦN DỮ LIỆU THẬT

Nguồn: dòng TỔNG NĂM trong report CSV; % = giá trị nhóm ÷ tổng Thu.

### Thu (tổng 507.075.341)
| Group | Amount | % |
|---|--:|--:|
| Lương | 187.615.516 | 37,0% |
| Quỹ thu nhập | 154.666.218 | 30,5% |
| Thưởng lễ/Tết | 43.187.392 | 8,5% |
| Thưởng KPI | 39.670.734 | 7,8% |
| Phụ cấp dự án | 39.317.481 | 7,8% |
| Thưởng khác | 26.850.000 | 5,3% |
| Khác | 12.768.000 | 2,5% |
| Hỗ trợ/Phúc lợi | 3.000.000 | 0,6% |

### Chi
*Không có dữ liệu (chưa có khoản chi nào trong 2026).*

### Hỗ trợ
*Không có dữ liệu (chưa có khoản hỗ trợ nào trong 2026).*

---

## E. Classifier regression samples — ✅ ĐÃ SINH TỪ CODE THẬT

Bảng dưới sinh bằng cách gọi trực tiếp `classifyFor(type, note)` của `classify.js`
với `RULES / EXPENSE_RULES / TRANSFER_RULES` hiện tại. **Sau khi redesign modal,
cùng các note này phải ra CÙNG group.** Không sửa rule trong V3.

| Note | Type | Group tự nhận diện |
|---|---|---|
| LƯƠNG GIỮA KỲ THÁNG 06/2026 | Thu | Lương |
| Truy lĩnh lương | Thu | Lương |
| QUỸ THU NHẬP quý 2 | Thu | Quỹ thu nhập |
| Thưởng KPI quý 1 | Thu | Thưởng KPI |
| Phụ cấp dự án SmartBanking | Thu | Phụ cấp dự án |
| Thưởng Tết Nguyên đán | Thu | Thưởng lễ/Tết |
| Thưởng 30.4 | Thu | Thưởng lễ/Tết |
| Khen thưởng HTNV | Thu | Thưởng khác |
| Hỗ trợ trang phục | Thu | Hỗ trợ/Phúc lợi |
| abc xyz khong khop gi | Thu | Khác |
| ăn trưa quán cơm | Chi | Ăn uống |
| Đóng học phí con tháng 9 | Chi | Học phí con |
| Đổ xăng xe | Chi | Đi lại |
| Thanh toán EVN tiền điện | Chi | Hoá đơn |
| Mua đồ Shopee | Chi | Mua sắm |
| Khám bệnh viện | Chi | Sức khoẻ |
| Trả nợ vay ngân hàng | Chi | Trả nợ & Thẻ tín dụng |
| Thanh toán thẻ tín dụng | Chi | Trả nợ & Thẻ tín dụng |
| Vợ chuyển góp trả nợ | Hỗ trợ | Vợ hỗ trợ |
| Bố mẹ hỗ trợ | Hỗ trợ | Người thân hỗ trợ |

**Ghi chú quan trọng về thứ tự rule:** "Thưởng KPI quý 1" ra `Thưởng KPI` (không phải
`Thưởng khác`) vì rule `THUONG KPI` đứng TRƯỚC `THUONG` trong mảng. Cơ chế:
rule đầu tiên khớp thắng (vòng `for` trả về ngay). Giữ nguyên thứ tự này.

---

## F. Behavior baseline (đọc từ code)

### Tổng quan (`ui/dash.js`, `ui/chart.js`)
- **Công tắc Thu/Chi/Thu–Chi**: state `mode` ('in'/'out'/'net'). Thu & Chi dùng chung
  `renderSingle`; Thu–Chi dùng `renderNet`. Đổi mode → `renderDash(lastTxs, lastYear)`.
- **Đổi năm**: pill `#years` → `setYear()` trong store → notify → vẽ lại. Đổi năm thì
  `clearMonthFilter()` (bỏ lọc tháng của năm cũ).
- **Chart**: cột xếp chồng theo nhóm (Thu/Chi); ở net là 2 cột thu/chi cạnh nhau.
- **Tooltip**: rê chuột (desktop) hoặc chạm (mobile). Ở net đọc `netCtx` riêng.
- **Legend**: bấm để ẩn/hiện nhóm (`hidden` Set); chỉ ảnh hưởng chart, KPI giữ nguyên.
- **Tap/click chart**: desktop bấm cột = lọc tháng; mobile chạm lần 1 xem tooltip,
  lần 2 mới lọc. Lọc → chuyển sang tab Giao dịch với `setMonthFilter`.

### Giao dịch (`ui/list.js`)
- **Sort**: theo `date` giảm dần (mới nhất trước) — kế thừa từ `store.loadAll()`.
- **Search**: trên `note`, bỏ dấu 2 phía (`stripVN`).
- **Filter type**: chip Tất cả/Thu/Chi/Hỗ trợ (`tyFilter`), có đếm số khoản.
- **Month filter**: `moFilter` (từ chart). Hiện chip tháng + dòng tiền ròng của tháng.
- **Tap để edit**: chạm dòng → `openEdit`.
- **Swipe delete**: vuốt trái lộ nút Xoá → `removeTx` (có confirm).
- **Delete trong modal**: nút 🗑 → `handleDelete` (có confirm).

### Thêm/Sửa (`ui/modal.js`)
- **Default type**: 'in' (nút Thêm gọi `openAdd('in')`).
- **Default date**: hôm nay (`toISOString().slice(0,10)`).
- **Validation**: bắt buộc amount + date; note optional.
- **Auto classify**: gõ note → `classifyFor(curType, note)` đoán nhóm (khi chưa chọn tay).
- **Manual override group**: chạm nút nhóm → set `curGroup`, ghi đè máy đoán.
- **Sửa note sau khi đã chọn group tay**: KHÔNG đoán lại (`if(!curGroup)` chặn). Group giữ nguyên.
- **Create**: `editId=null` → `insert`.
- **Edit**: nạp giá trị cũ, `curGroup` = group đã lưu, hiện nút Xoá → `update` theo id.
- **Delete**: nút trong modal → confirm → `removeTx`.

### Báo cáo (`ui/report.js`)
- **Report Thu**: bảng 12 tháng × nhóm thu, cột sinh động theo `byGroup`, có luỹ kế + cùng kỳ.
- **Report Chi**: bảng tương tự cho chi.
- **Chênh lệch**: bảng Tháng/Thu/[Hỗ trợ]/Chi/Còn lại; Còn lại = thu+hỗ trợ−chi; dòng Cả năm.
- **CSV transaction & report**: xem mục G.

---

## G. CSV baseline (đọc từ `export.js`)

### Transaction CSV (`exportTransactions`)
- Tên file: `giao-dich-{year}.csv`
- **Cột (đúng thứ tự)**: `Ngày, Loại, Số tiền, Nhóm, Ghi chú`
- **Dấu +/−**: cột Số tiền — **Chi để số ÂM** (`-amount`); Thu và Hỗ trợ để dương.
- **Thứ tự giao dịch**: cũ → mới (`sort` theo date tăng dần).
- BOM UTF-8 ở đầu file (để Excel Windows đọc đúng dấu tiếng Việt).
- Phân cách: dấu phẩy; xuống dòng CRLF (`\r\n`).

### Report CSV (`exportReport`)
- Tên file: `bao-cao-{year}.csv`
- **Các section (theo thứ tự)**:
  1. `THU NHẬP` — bảng tháng × nhóm thu + dòng TỔNG NĂM
  2. (dòng trống)
  3. `CHI TIÊU` — bảng tháng × nhóm chi + dòng TỔNG NĂM
  4. (dòng trống)
  5. `CHÊNH LỆCH` — cột Tháng/Thu/Hỗ trợ/Chi/Còn lại + dòng CẢ NĂM
- Chỉ xuất section có dữ liệu (Thu/Chi rỗng thì bỏ qua section đó).

> Nên lưu một file CSV export mẫu (cả 2 loại) làm "vật chứng" regression sau này.

---

## H. Coupling / Risk points (KHÔNG sửa trong Phase 0 — chỉ ghi nhận)

### `chart.js`
- **KHÔNG dùng canvas/context** — biểu đồ là **DOM thuần** (div `.bcol`, `.seg`, `.nbar`).
  Đây là điểm tốt: không phụ thuộc Canvas API. Nhưng render bằng `innerHTML` chuỗi lớn.
- **Tooltip**: `tipHTML(i)` đọc `ctx` (chart nhóm) HOẶC `netCtx` (chart net). Vị trí tính
  bằng `getBoundingClientRect` trong `#chartBox`, tự lật khi sát mép. Đây là nơi từng có
  bug "chưa có khoản thu" — nếu redesign chart phải giữ đúng cơ chế set/clear `netCtx`.
- **Touch vs mouse**: dùng Pointer Events + lọc `pointerType`. Có state `touchMode` và
  `armedCol` (chạm lần 1 xem, lần 2 lọc). Rất dễ vỡ nếu đổi luồng sự kiện.
- **Legend**: `hidden` Set (module-level), giữ nguyên khi đổi năm. Bấm legend → `onFilterChange`.
- **Net chart**: `renderNetChart(inc, exp, year, axis)` set `netCtx`; `renderChart` clear `netCtx`.
  Thứ tự gọi quan trọng (net legend set đồng bộ TRƯỚC, tránh bị async ghi đè).

### KPI trong `dash.js`
- `setKpiLabels(labels)` chọn `document.querySelectorAll('.kpi .l')` và **ghi đè text theo
  THỨ TỰ DOM** (index 0→3). Tức là logic PHỤ THUỘC vào việc có đúng 4 `.kpi` với `.l` con,
  đúng thứ tự trong `index.html`. Nếu redesign đổi cấu trúc KPI card (đổi class, đổi số ô,
  đổi thứ tự) → nhãn sẽ gán sai ô. **Đây là coupling ngầm HTML↔JS cần bảo vệ.**
- `DEFAULT_KPI = ['TB mỗi tháng','Tháng cao nhất','Số giao dịch','So cùng kỳ']` (chế độ Thu/Chi);
  chế độ net đổi thành `['Thu nhập','Chi tiêu','Hỗ trợ nhận','Còn lại']`. Cùng 4 ô DOM, khác nhãn.
- Ô KPI thứ 3–4 có class `only-desk` (ẩn ở mobile), nhưng `body.mode-net` cho hiện lại ở mobile
  (vì "Còn lại" quan trọng). Quy tắc ở `desktop.css`.

### Navigation / header
- **`.authed`**: class trên `<body>`. `app.js:showApp()` CHỈ toggle class này, **không đặt
  `display` inline**. Lý do (ghi trong `layout.css`): inline style thắng media query, sẽ phá
  `grid-area` sidebar desktop, làm nav rơi xuống cuối trang. **Tuyệt đối không set display bằng JS.**
- **`nav.tabs`**: ở mobile là bottom nav; ở desktop (`≥1024px`) **cùng element này** biến thành
  sidebar trái qua `grid-area:side`. Redesign nav phải tôn trọng việc 1 element đóng 2 vai.
- **Desktop grid**: `.wrap` thành `grid-template-columns:248px 1fr` khi `.authed`. Khi chưa
  đăng nhập `body:not(.authed) .wrap{display:flex}`. Đổi layout khung phải giữ cặp quy tắc này.

---

## I. Regression checklist

Xem file riêng: `UIUX_V3_REGRESSION_CHECKLIST.md`.

---

## J. Files changed trong Phase 0

- ✅ Tạo mới: `UIUX_V3_BASELINE.md` (file này) — đã điền đầy đủ Git + số liệu 2026,
  đối chiếu kép Report CSV + Transaction CSV, không còn TBD về dữ liệu 2026.
- ✅ Tạo mới: `UIUX_V3_REGRESSION_CHECKLIST.md`
- ❌ Không sửa bất kỳ file code nào (js/css/html/sql).

### Ghi chú
- Baseline Chi / Hỗ trợ hiện = 0 vì 2026 thực tế chưa có giao dịch chi/hỗ trợ nào
  (đã xác nhận qua cả 2 CSV). Khi bắt đầu nhập chi thật thì cập nhật lại các mục này.
  Đây KHÔNG phải TBD do thiếu dữ liệu — mà là giá trị thật (= 0) tại thời điểm baseline.

---

## K. Confirmation

**Không có business logic, database schema, hay UI production behavior nào bị thay đổi
trong Phase 0.** Chỉ tạo 2 file tài liệu markdown. Branch (nếu tạo) do bạn chạy ở máy;
không merge, không deploy.
