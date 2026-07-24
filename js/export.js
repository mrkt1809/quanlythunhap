/* ============================================================
   export.js — Xuất dữ liệu ra file CSV
   ============================================================ */
import { groupOf, yearTx, reportMatrix } from "./compute.js";
import { fmtDate } from "./format.js";

/* Bọc 1 ô CSV: có dấu phẩy / nháy kép / xuống dòng thì phải bọc nháy kép,
   và nháy kép bên trong phải nhân đôi. */
function cell(v){
  const s = String(v ?? '');
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const toCSV = rows => rows.map(r => r.map(cell).join(',')).join('\r\n');

/* Tải file xuống máy.
   ⚠️ BOM "\uFEFF" ở đầu là BẮT BUỘC: thiếu nó Excel trên Windows đọc CSV
   theo bảng mã mặc định và toàn bộ dấu tiếng Việt sẽ vỡ thành ký tự lạ. */
function download(filename, text){
  const blob = new Blob(['\uFEFF' + text], { type:'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- 1. Danh sách giao dịch ---------- */
export function exportTransactions(txs, year){
  const rows = [['Ngày','Số tiền','Nhóm','Ghi chú']];
  yearTx(txs, year)
    .slice()
    .sort((a,b) => a.date < b.date ? -1 : 1)   // cũ → mới, tiện xem theo thời gian
    .forEach(t => rows.push([fmtDate(t.date), t.amount, groupOf(t), t.note || '']));

  download(`giao-dich-${year}.csv`, toCSV(rows));
  return rows.length - 1;
}

/* ---------- 2. Bảng báo cáo tháng × nhóm ---------- */
export function exportReport(txs, year){
  const R = reportMatrix(txs, year);

  const head = ['Tháng', ...R.groups, 'Tổng tháng', 'Luỹ kế'];
  if(R.hasPrev) head.push(`Cùng kỳ ${year-1}`, 'Tăng/Giảm', '%');
  const rows = [head];

  R.rows.forEach(r => {
    const line = [
      `Tháng ${r.month}`,
      ...R.groups.map(g => r.byGroup[g] || 0),
      r.total,
      r.cum
    ];
    if(R.hasPrev){
      line.push(r.prev, r.diff, r.pct === null ? '' : (r.pct * 100).toFixed(1) + '%');
    }
    rows.push(line);
  });

  /* dòng tổng cuối bảng */
  const last = R.rows[R.rows.length - 1];
  const totalLine = ['TỔNG NĂM', ...R.groups.map(g => R.totalByGroup[g]), R.grandTotal, last.cum];
  if(R.hasPrev) totalLine.push('', '', '');
  rows.push(totalLine);

  download(`bao-cao-thu-nhap-${year}.csv`, toCSV(rows));
  return R.rows.filter(r => r.total > 0).length;
}
