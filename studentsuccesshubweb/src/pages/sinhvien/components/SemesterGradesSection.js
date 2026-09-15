import React from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Filter, Layers, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const SemesterGradesSection = ({
  allSemesters,
  displayedSemesters,
  selectedSemester,
  setSelectedSemester,
  navigateSemester
}) => {
  if (!allSemesters || allSemesters.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-800">Bảng điểm Chi tiết các Học phần (CTĐT Chuẩn)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Theo Chương trình đào tạo Quyết định 561/QĐ-ĐHM - Khoa Công nghệ Thông tin</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => navigateSemester(-1)}
              title="Học kỳ trước"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kỳ trước</span>
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <button
              type="button"
              onClick={() => navigateSemester(1)}
              title="Học kỳ sau"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">Kỳ sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center">
            <Filter className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="ALL">Tất cả các học kỳ ({allSemesters.length} kỳ)</option>
              {allSemesters.map((hk, i) => (
                <option key={i} value={hk.maHocKy}>
                  {hk.tenHocKy || hk.maHocKy} (GPA: {hk.gpaHe4 != null ? Number(hk.gpaHe4).toFixed(2) : '-'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedSemester('ALL')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            selectedSemester === 'ALL' ? 'bg-primary-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Tất cả ({allSemesters.length} kỳ)
        </button>
        {allSemesters.map((hk, i) => {
          const isSelected = selectedSemester === hk.maHocKy;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedSemester(hk.maHocKy)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                isSelected ? 'bg-primary-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{hk.tenHocKy || hk.maHocKy}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isSelected ? 'bg-primary-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {hk.gpaHe4 != null ? Number(hk.gpaHe4).toFixed(2) : '-'}
              </span>
            </button>
          );
        })}
      </div>

      {displayedSemesters.map((hkScore, idx) => (
        <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">{hkScore.tenHocKy || hkScore.maHocKy}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 font-semibold">
                {hkScore.heDaoTao === 'CHAT_LUONG_CAO' ? 'Chất lượng cao' : 'Chương trình Chuẩn'}
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <span>Tổng tín chỉ: <strong className="text-slate-800">{hkScore.tongSoTinChi || 0} TC</strong></span>
              <span>Tổng học phí: <strong className="text-primary-700">{formatCurrency(hkScore.tongHocPhiHocKy)}</strong></span>
              <span>GPA Học kỳ: <strong className="text-emerald-700 font-bold">{hkScore.gpaHe4 != null ? Number(hkScore.gpaHe4).toFixed(2) : '-'} (Hệ 4)</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-white border-b border-slate-100 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-2.5">Mã MH</th>
                  <th className="px-4 py-2.5">Tên Môn học</th>
                  <th className="px-4 py-2.5 text-center">Tín chỉ</th>
                  <th className="px-4 py-2.5 text-center">Chuyên cần (10%)</th>
                  <th className="px-4 py-2.5 text-center">Giữa kỳ (30%)</th>
                  <th className="px-4 py-2.5 text-center">Cuối kỳ (60%)</th>
                  <th className="px-4 py-2.5 text-center">Tổng kết 10</th>
                  <th className="px-4 py-2.5 text-center">Hệ 4</th>
                  <th className="px-4 py-2.5 text-center">Điểm chữ</th>
                  <th className="px-4 py-2.5 text-right">Học phí môn</th>
                  <th className="px-4 py-2.5 text-center">Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {hkScore.danhSachDiemMonHoc?.map((mon, mIdx) => (
                  <tr key={mIdx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-bold text-slate-700">{mon.maMon}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{mon.tenMon}</td>
                    <td className="px-4 py-2.5 text-center font-semibold">{mon.soTinChi}</td>
                    <td className="px-4 py-2.5 text-center">{mon.diemChuyenCan != null ? Number(mon.diemChuyenCan).toFixed(1) : '-'}</td>
                    <td className="px-4 py-2.5 text-center">{mon.diemGiuaKy != null ? Number(mon.diemGiuaKy).toFixed(1) : '-'}</td>
                    <td className="px-4 py-2.5 text-center">{mon.diemCuoiKy != null ? Number(mon.diemCuoiKy).toFixed(1) : '-'}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-slate-900">{mon.diemTongKet10 != null ? Number(mon.diemTongKet10).toFixed(1) : '-'}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-primary-700">{mon.diemHe4 != null ? Number(mon.diemHe4).toFixed(2) : '-'}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        ['A+', 'A'].includes(mon.diemChu) ? 'bg-emerald-100 text-emerald-800' :
                        ['B+', 'B'].includes(mon.diemChu) ? 'bg-blue-100 text-blue-800' :
                        ['C+', 'C'].includes(mon.diemChu) ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {mon.diemChu || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-600">{formatCurrency(mon.hocPhiMon)}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`font-semibold flex items-center justify-center gap-1 ${mon.dat ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {mon.dat ? <><CheckCircle className="w-3.5 h-3.5" /> Đạt</> : <><AlertTriangle className="w-3.5 h-3.5" /> Học lại</>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SemesterGradesSection;
