# UIUX V3 — BASELINE (Phase 0)

> Chốt trạng thái AS-IS của app **trước khi** redesign UI/UX V3.
> Nguồn: mã nguồn Ver 4.2 (bản production). Không sửa code trong Phase 0.
> Mục đích: sau mỗi phase đối chiếu để phát hiện regression.

---

## A. Git / Branch

*(Phần này do bạn điền sau khi chạy lệnh Git ở máy — tôi không truy cập được repo.)*

- Branch ban đầu: `__________` (dự kiến `main`)
- Branch làm việc V3: `feat/uiux-v3`
- Commit hiện tại (HEAD): `__________`

Lệnh lấy thông tin:
```
git branch --show-current
git rev-parse --short HEAD
git log --oneline -1
```

---

## B. Baseline số liệu — ⚠️ CẦN DỮ LIỆU THẬT TỪ BẠN

Các con số này phải lấy từ **Supabase production** (dữ liệu thật của bạn), không phải
từ dữ liệu demo và không chép tay từ hội thoại. Tôi không nối được vào Supabase của bạn
từ môi trường này, nên cần bạn cung cấp một trong hai:

1. **Xuất CSV** từ app (nút CSV ở tab Giao dịch cho năm chính) rồi gửi file — tôi sẽ
   chạy qua `compute.js` để điền bảng dưới, đảm bảo con số do CODE sinh ra.
2. Hoặc chụp màn hình Tổng quan (cả 3 chế độ Thu/Chi/Thu–Chi) + Báo cáo cho năm chính.

Bảng cần điền (năm chính đang có dữ liệu — dự kiến **2026**):

| Chỉ số | Giá trị | Nguồn tính (hàm) |
|---|---|---|
| Tổng Thu | `____` | `stats(ofType(txs,'in'), y).total` |
| Tổng Chi | `____` | `stats(ofType(txs,'out'), y).total` |
| Tổng Hỗ trợ | `____` | `totalsByType(txs,y).transfer` |
| Còn lại / Net | `____` | `totalsByType(txs,y).net` = thu+hỗ trợ−chi |
| Số giao dịch Thu | `____` | `ofType(txs,'in')` trong năm, đếm |
| Số giao dịch Chi | `____` | `ofType(txs,'out')` trong năm, đếm |
| Số giao dịch Hỗ trợ | `____` | `ofType(txs,'transfer')` trong năm, đếm |
| Số tháng có Thu | `____` | `stats(...'in').activeMonths` |
| Số tháng có Chi | `____` | `stats(...'out').activeMonths` |
| TB tháng (Thu) | `____` | `stats(...'in').avgMonth` |
| Tháng cao nhất (Thu) | `____` | `stats(...'in').maxMonth` |
| Giá trị tháng cao nhất (Thu) | `____` | `stats(...'in').maxValue` |
| YoY (Thu, so 2025) | `____` | `yoy(ofType(txs,'in'), y)` |

> Ghi chú: mọi chỉ số "TB tháng / Tháng cao nhất / YoY" trên màn Tổng quan hiện
> **tính cho chế độ đang xem** (Thu hoặc Chi), không phải gộp. Baseline nên ghi cho
> chế độ **Thu** (mặc định) để nhất quán.

---

## C. Monthly baseline — ⚠️ CẦN DỮ LIỆU THẬT

Điền sau khi có dữ liệu. Mỗi ô lấy từ `monthly(ofType(txs, type), y)`.
Net mỗi tháng = Thu + Hỗ trợ − Chi.

| Tháng | Thu | Chi | Hỗ trợ | Net |
|---|--:|--:|--:|--:|
| T1 | | | | |
| T2 | | | | |
| T3 | | | | |
| T4 | | | | |
| T5 | | | | |
| T6 | | | | |
| T7 | | | | |
| T8 | | | | |
| T9 | | | | |
| T10 | | | | |
| T11 | | | | |
| T12 | | | | |
| **Cả năm** | | | | |

---

## D. Group baseline — ⚠️ CẦN DỮ LIỆU THẬT

Nguồn: `byGroup(ofType(txs, type), y)`; % = giá trị nhóm ÷ tổng của type đó.

### Thu
| Group | Amount | % |
|---|--:|--:|
| | | |

### Chi
| Group | Amount | % |
|---|--:|--:|
| | | |

### Hỗ trợ
| Group | Amount | % |
|---|--:|--:|
| | | |

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

- ✅ Tạo mới: `UIUX_V3_BASELINE.md` (file này)
- ✅ Tạo mới: `UIUX_V3_REGRESSION_CHECKLIST.md`
- ❌ Không sửa bất kỳ file code nào (js/css/html/sql).

---

## K. Confirmation

**Không có business logic, database schema, hay UI production behavior nào bị thay đổi
trong Phase 0.** Chỉ tạo 2 file tài liệu markdown. Branch (nếu tạo) do bạn chạy ở máy;
không merge, không deploy.
