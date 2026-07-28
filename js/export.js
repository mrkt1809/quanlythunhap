/* ============================================================
   export.js — Xuất dữ liệu ra file CSV
   ============================================================ */
import { groupOf, yearTx, reportMatrix, ofType, monthly, typeOf } from "./compute.js";
import { fmtDate } from "./format.js";
import { typeInfo } from "./config.js";

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
  const rows = [['Ngày','Loại','Số tiền','Nhóm','Ghi chú']];
  yearTx(txs, year)
    .slice()
    .sort((a,b) => a.date < b.date ? -1 : 1)   // cũ → mới, tiện xem theo thời gian
    .forEach(t => {
      const ty = typeOf(t);
      /* số tiền có dấu: chi để số âm cho đúng dòng tiền khi mở bằng Excel */
      const signed = ty === 'out' ? -t.amount : t.amount;
      rows.push([fmtDate(t.date), typeInfo(ty).label, signed, groupOf(t), t.note || '']);
    });

  download(`giao-dich-${year}.csv`, toCSV(rows));
  return rows.length - 1;
}

/* ---------- 2. Báo cáo: thu + chi + chênh lệch ---------- */
function matrixBlock(R, year, title){
  const head = ['Tháng', ...R.groups, 'Tổng tháng', 'Luỹ kế'];
  if(R.hasPrev) head.push(`Cùng kỳ ${year-1}`, 'Tăng/Giảm', '%');
  const rows = [[title], head];

  R.rows.forEach(r => {
    const line = [`Tháng ${r.month}`, ...R.groups.map(g => r.byGroup[g] || 0), r.total, r.cum];
    if(R.hasPrev) line.push(r.prev, r.diff, r.pct === null ? '' : (r.pct*100).toFixed(1) + '%');
    rows.push(line);
  });

  const last = R.rows[R.rows.length - 1];
  const totalLine = ['TỔNG NĂM', ...R.groups.map(g => R.totalByGroup[g]), R.grandTotal, last.cum];
  if(R.hasPrev) totalLine.push('', '', '');
  rows.push(totalLine);
  return rows;
}

export function exportReport(txs, year){
  const income  = ofType(txs, 'in');
  const expense = ofType(txs, 'out');
  const Rin  = reportMatrix(income, year);
  const Rout = reportMatrix(expense, year);

  let rows = [];

  if(Rin.grandTotal){
    rows = rows.concat(matrixBlock(Rin, year, 'THU NHẬP'));
    rows.push([]);   // dòng trống ngăn cách
  }
  if(Rout.grandTotal){
    rows = rows.concat(matrixBlock(Rout, year, 'CHI TIÊU'));
    rows.push([]);
  }

  /* bảng chênh lệch từng tháng */
  const inc = monthly(income, year);
  const exp = monthly(expense, year);
  const tra = monthly(ofType(txs,'transfer'), year);
  rows.push(['CHÊNH LỆCH']);
  rows.push(['Tháng','Thu','Hỗ trợ','Chi','Còn lại']);
  let tI=0,tE=0,tT=0;
  inc.forEach((_,i) => {
    tI+=inc[i]; tE+=exp[i]; tT+=tra[i];
    if(inc[i]||exp[i]||tra[i])
      rows.push([`Tháng ${i+1}`, inc[i], tra[i], exp[i], inc[i]+tra[i]-exp[i]]);
  });
  rows.push(['CẢ NĂM', tI, tT, tE, tI+tT-tE]);

  download(`bao-cao-${year}.csv`, toCSV(rows));
  return Rin.rows.filter(r => r.total > 0).length;
}
