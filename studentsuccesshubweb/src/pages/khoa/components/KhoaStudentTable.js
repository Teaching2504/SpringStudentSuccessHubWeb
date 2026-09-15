import React from 'react';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';

const KhoaStudentTable = ({
  search,
  setSearch,
  selectedLop,
  setSelectedLop,
  lops,
  selectedHk,
  setSelectedHk,
  hocKys,
  students,
  loading
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo MSSV, Họ và tên..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={selectedLop}
          onChange={(e) => setSelectedLop(e.target.value)}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">-- Tất cả Lớp sinh hoạt --</option>
          {lops.map(l => <option key={l.maLop} value={l.maLop}>{l.tenLop} ({l.maLop})</option>)}
        </select>
        <select
          value={selectedHk}
          onChange={(e) => setSelectedHk(e.target.value)}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">-- Tất cả Học kỳ --</option>
          {hocKys.map(h => <option key={h.maHocKy} value={h.maHocKy}>{h.tenHocKy}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">MSSV</th>
                <th className="px-5 py-3.5">Họ và Tên</th>
                <th className="px-5 py-3.5">Lớp / Ngành</th>
                <th className="px-5 py-3.5 text-center">GPA</th>
                <th className="px-5 py-3.5 text-center">ĐRL</th>
                <th className="px-5 py-3.5 text-center">Tín chỉ</th>
                <th className="px-5 py-3.5">Cảnh báo Học vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Đang tải danh sách sinh viên khoa...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Không tìm thấy sinh viên nào</td></tr>
              ) : (
                students.map((sv) => {
                  const isWarned = sv.canhBao && sv.canhBao !== 'Bình thường';
                  return (
                    <tr key={sv.mssv} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{sv.mssv}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        <div>{sv.hoTen}</div>
                        <div className="text-xs text-slate-400">{sv.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        <div className="font-semibold text-slate-800">{sv.maLop}</div>
                        <div>{sv.tenNganh}</div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">{sv.diemTrungBinh != null ? sv.diemTrungBinh.toFixed(2) : '-'}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">{sv.diemRenLuyen != null ? sv.diemRenLuyen : '-'}</td>
                      <td className="px-5 py-3.5 text-center text-xs text-slate-600">{sv.soTinChi != null ? sv.soTinChi : '-'}</td>
                      <td className="px-5 py-3.5">
                        {isWarned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> {sv.canhBao}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Bình thường
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KhoaStudentTable;
