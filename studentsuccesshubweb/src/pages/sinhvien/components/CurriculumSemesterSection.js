import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

const CurriculumSemesterSection = ({ groupedBySemester }) => {
  return (
    <div className="space-y-6">
      {Object.keys(groupedBySemester).sort((a, b) => Number(a) - Number(b)).map((hkNum) => {
        const subjects = groupedBySemester[hkNum];
        const semCredits = subjects.reduce((sum, s) => sum + (s.soTinChi || 0), 0);
        const semTuition = subjects.reduce((sum, s) => sum + (Number(s.hocPhiDuKien) || 0), 0);

        return (
          <div key={hkNum} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 bg-primary-700 text-white rounded-lg flex items-center justify-center text-xs font-black">{hkNum}</span>
                <h2 className="font-bold text-slate-800 text-base">Học kỳ {hkNum} (Đề xuất)</h2>
                <span className="text-xs px-2.5 py-0.5 bg-primary-50 text-primary-700 font-bold rounded-full">{subjects.length} môn học</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <span>Tổng số: <strong className="text-slate-900">{semCredits} tín chỉ</strong></span>
                <span>•</span>
                <span>Học phí dự kiến: <strong className="text-emerald-700">{formatCurrency(semTuition)}</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-5">Mã môn</th>
                    <th className="py-3 px-5">Tên Học phần</th>
                    <th className="py-3 px-3 text-center">Số TC</th>
                    <th className="py-3 px-3 text-center">LT / TH</th>
                    <th className="py-3 px-4 text-right">Đơn giá / TC</th>
                    <th className="py-3 px-4 text-right">Học phí môn</th>
                    <th className="py-3 px-4 text-center">Loại học phần</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {subjects.map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-primary-700">{s.maMon}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800">{s.tenMon}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-900">{s.soTinChi}</td>
                      <td className="py-3.5 px-3 text-center text-xs text-slate-500 font-medium">
                        {s.soTietLyThuyet || 0} tiết / {s.soTietThucHanh || 0} tiết
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">{formatCurrency(s.donGiaTinChi)}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{formatCurrency(s.hocPhiDuKien)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">
                          {s.loaiHocPhan === 'BAT_BUOC' ? 'Bắt buộc' : 'Tự chọn'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurriculumSemesterSection;
