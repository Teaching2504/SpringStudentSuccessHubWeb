import React from 'react';
import { Edit2, Trash2, GraduationCap, Filter } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const ActionButtons = ({ onEdit, onDelete, title }) => (
  <td className="px-5 py-3.5 text-right space-x-1">
    <button onClick={onEdit} className="p-1.5 rounded-lg border border-slate-200 text-primary-700 hover:bg-primary-50 cursor-pointer transition-colors" title={`Sửa ${title}`}>
      <Edit2 className="w-4 h-4" />
    </button>
    <button onClick={onDelete} className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors" title={`Xóa ${title}`}>
      <Trash2 className="w-4 h-4" />
    </button>
  </td>
);

export const CategoryTables = ({ activeTab, khoas, nganhs, lops, hocKys, monHocs, curriculums, selectedNganh, setSelectedNganh, onEdit, onDelete }) => {
  if (activeTab === 'khoa') {
    return (
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="ou-table-header"><tr><th className="px-5 py-3.5 w-40">Mã Khoa</th><th className="px-5 py-3.5">Tên Khoa</th><th className="px-5 py-3.5 text-right w-36">Thao tác</th></tr></thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {khoas.map(k => (
            <tr key={k.maKhoa} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{k.maKhoa}</td>
              <td className="px-5 py-3.5 font-medium text-slate-800">{k.tenKhoa}</td>
              <ActionButtons onEdit={() => onEdit(k)} onDelete={() => onDelete(k.maKhoa)} title="Khoa" />
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (activeTab === 'nganh') {
    return (
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="ou-table-header"><tr><th className="px-5 py-3.5 w-36">Mã Ngành</th><th className="px-5 py-3.5">Tên Ngành Đào tạo</th><th className="px-5 py-3.5 w-36">Hệ đào tạo</th><th className="px-5 py-3.5">Trực thuộc Khoa</th><th className="px-5 py-3.5 text-right w-36">Thao tác</th></tr></thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {nganhs.map(n => (
            <tr key={n.maNganh} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{n.maNganh}</td>
              <td className="px-5 py-3.5 font-medium text-slate-800">{n.tenNganh}</td>
              <td className="px-5 py-3.5"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">{n.heDaoTao || 'CHUAN'}</span></td>
              <td className="px-5 py-3.5 text-slate-600">{n.khoa?.tenKhoa || '-'}</td>
              <ActionButtons onEdit={() => onEdit(n)} onDelete={() => onDelete(n.maNganh)} title="Ngành" />
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (activeTab === 'lop') {
    return (
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="ou-table-header"><tr><th className="px-5 py-3.5 w-36">Mã Lớp</th><th className="px-5 py-3.5">Tên Lớp Sinh Hoạt</th><th className="px-5 py-3.5 w-40">Khóa học</th><th className="px-5 py-3.5">Khoa / Ngành</th><th className="px-5 py-3.5 text-right w-36">Thao tác</th></tr></thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {lops.map(l => (
            <tr key={l.maLop} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{l.maLop}</td>
              <td className="px-5 py-3.5 font-medium text-slate-800">{l.tenLop}</td>
              <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">{l.khoaHoc}</td>
              <td className="px-5 py-3.5 text-xs text-slate-600"><div className="font-semibold text-slate-800">{l.khoa?.tenKhoa}</div><div className="text-slate-400">{l.nganh?.tenNganh}</div></td>
              <ActionButtons onEdit={() => onEdit(l)} onDelete={() => onDelete(l.maLop)} title="Lớp" />
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (activeTab === 'hoc-ky') {
    return (
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="ou-table-header"><tr><th className="px-5 py-3.5 w-48">Mã Học Kỳ</th><th className="px-5 py-3.5">Tên Học Kỳ</th><th className="px-5 py-3.5 w-40">Năm Học</th><th className="px-5 py-3.5 text-right w-36">Thao tác</th></tr></thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {hocKys.map(h => (
            <tr key={h.maHocKy} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{h.maHocKy}</td>
              <td className="px-5 py-3.5 font-medium text-slate-800">{h.tenHocKy}</td>
              <td className="px-5 py-3.5"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{h.namHoc}</span></td>
              <ActionButtons onEdit={() => onEdit(h)} onDelete={() => onDelete(h.maHocKy)} title="Học kỳ" />
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (activeTab === 'mon-hoc') {
    return (
      <div>
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center px-5">
          <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary-700" /> Danh mục Môn học theo Chương trình đào tạo Quyết định 561/QĐ-ĐHM
          </div>
          <span className="px-3 py-1 bg-primary-700 text-white rounded-full text-xs font-semibold shadow-xs">{monHocs.length} Môn học</span>
        </div>
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="ou-table-header">
            <tr><th className="px-5 py-3.5 w-32">Mã Môn</th><th className="px-5 py-3.5">Tên Môn học</th><th className="px-5 py-3.5 text-center w-28">Số Tín chỉ</th><th className="px-5 py-3.5 text-center w-28">Lý thuyết</th><th className="px-5 py-3.5 text-center w-28">Thực hành</th><th className="px-5 py-3.5 text-right w-36">Đơn giá / 1 TC</th><th className="px-5 py-3.5 w-28">Khoa quản lý</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {monHocs.map(m => (
              <tr key={m.maMon} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{m.maMon}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800">{m.tenMon}</td>
                <td className="px-5 py-3.5 text-center font-bold text-slate-800">{m.soTinChi}</td>
                <td className="px-5 py-3.5 text-center text-xs text-slate-600">{m.soTietLyThuyet ? `${m.soTietLyThuyet} tiết` : '-'}</td>
                <td className="px-5 py-3.5 text-center text-xs text-slate-600">{m.soTietThucHanh ? `${m.soTietThucHanh} tiết` : '-'}</td>
                <td className="px-5 py-3.5 text-right font-mono font-semibold text-primary-700">{formatCurrency(m.donGiaTinChi)}</td>
                <td className="px-5 py-3.5"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{m.maKhoa || '-'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'ctdt') {
    return (
      <div className="space-y-4 p-4">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm"><Filter className="w-4 h-4 text-primary-700" /> Chọn Ngành Đào tạo:</div>
          <select value={selectedNganh} onChange={(e) => setSelectedNganh(e.target.value)} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500">
            {nganhs.map(n => <option key={n.maNganh} value={n.maNganh}>{n.tenNganh} ({n.maNganh})</option>)}
          </select>
        </div>
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="ou-table-header"><tr><th className="px-4 py-3 text-center">Học kỳ</th><th className="px-4 py-3">Mã Môn</th><th className="px-4 py-3">Tên Môn học</th><th className="px-4 py-3 text-center">Tín chỉ</th><th className="px-4 py-3 text-right">Đơn giá</th><th className="px-4 py-3 text-right">Học phí môn</th><th className="px-4 py-3">Loại học phần</th></tr></thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {curriculums.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 text-center font-bold text-primary-700">{c.hocKyGoiY}</td>
                <td className="px-4 py-3 font-mono font-bold">{c.maMon}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{c.tenMon}</td>
                <td className="px-4 py-3 text-center font-bold">{c.soTinChi}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-600">{formatCurrency(c.donGiaTinChi)}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">{formatCurrency(c.hocPhiDuKien)}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{c.loaiHocPhan}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};
export default CategoryTables;
