import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export const StudentTable = ({ students, loading, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3.5">MSSV</th>
              <th className="px-4 py-3.5">Họ và Tên</th>
              <th className="px-4 py-3.5">Lớp / Khoa</th>
              <th className="px-4 py-3.5 text-center">GPA</th>
              <th className="px-4 py-3.5 text-center">ĐRL</th>
              <th className="px-4 py-3.5 text-center">Tín chỉ</th>
              <th className="px-4 py-3.5">Cảnh báo Học vụ</th>
              <th className="px-4 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {loading ? (
              <tr><td colSpan="8" className="text-center py-8 text-slate-400">Đang tải danh sách sinh viên...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-8 text-slate-400">Không tìm thấy sinh viên nào</td></tr>
            ) : (
              students.map(sv => {
                const isWarned = sv.canhBao && sv.canhBao !== 'Bình thường';
                return (
                  <tr key={sv.mssv} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-primary-700">{sv.mssv}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-800"><div>{sv.hoTen}</div><div className="text-xs text-slate-400">{sv.email}</div></td>
                    <td className="px-4 py-3.5 text-xs"><div className="font-semibold text-slate-700">{sv.maLop}</div><div className="text-slate-500">{sv.tenKhoa}</div></td>
                    <td className="px-4 py-3.5 text-center font-bold text-slate-800">{sv.diemTrungBinh != null ? sv.diemTrungBinh.toFixed(2) : '-'}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-slate-800">{sv.diemRenLuyen != null ? sv.diemRenLuyen : '-'}</td>
                    <td className="px-4 py-3.5 text-center text-xs text-slate-600">{sv.soTinChi != null ? sv.soTinChi : '-'}</td>
                    <td className="px-4 py-3.5">
                      {isWarned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> {sv.canhBao}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Bình thường
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button onClick={() => onEdit(sv)} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(sv.mssv)} className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentTable;
