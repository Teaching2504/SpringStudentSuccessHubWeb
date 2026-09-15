import React from 'react';
import { Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const AcademicGradesTable = ({ gradeData, getGradeBadge }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 text-base">Danh sách Học phần trong Kỳ ({gradeData.danhSachDiemMonHoc.length} môn)</h2>
        <span className="text-xs text-slate-500 font-medium">Tỷ lệ đánh giá: Chuyên cần 10% | Giữa kỳ 30% | Cuối kỳ 60%</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Mã môn</th>
              <th className="py-3.5 px-4">Tên Học phần</th>
              <th className="py-3.5 px-3 text-center">Số TC</th>
              <th className="py-3.5 px-3 text-right">Học phí môn</th>
              <th className="py-3.5 px-3 text-center">CC (10%)</th>
              <th className="py-3.5 px-3 text-center">GK (30%)</th>
              <th className="py-3.5 px-3 text-center">CK (60%)</th>
              <th className="py-3.5 px-3 text-center font-black text-slate-900">Điểm 10</th>
              <th className="py-3.5 px-3 text-center font-black text-slate-900">Hệ 4</th>
              <th className="py-3.5 px-3 text-center">Điểm chữ</th>
              <th className="py-3.5 px-4 text-center">Kết quả</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {gradeData.danhSachDiemMonHoc.map((m, idx) => (
              <tr key={m.id || idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-primary-700">{m.maMon}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{m.tenMon}</td>
                <td className="py-3.5 px-3 text-center font-bold">{m.soTinChi}</td>
                <td className="py-3.5 px-3 text-right font-semibold text-slate-700">{formatCurrency(m.hocPhiMon)}</td>
                <td className="py-3.5 px-3 text-center text-slate-600">{m.diemChuyenCan != null ? Number(m.diemChuyenCan).toFixed(1) : '-'}</td>
                <td className="py-3.5 px-3 text-center text-slate-600">{m.diemGiuaKy != null ? Number(m.diemGiuaKy).toFixed(1) : '-'}</td>
                <td className="py-3.5 px-3 text-center text-slate-600">{m.diemCuoiKy != null ? Number(m.diemCuoiKy).toFixed(1) : '-'}</td>
                <td className="py-3.5 px-3 text-center font-black text-slate-900 bg-slate-50/60">{m.diemTongKet10 != null ? Number(m.diemTongKet10).toFixed(2) : '-'}</td>
                <td className="py-3.5 px-3 text-center font-black text-amber-700 bg-amber-50/40">{m.diemHe4 != null ? Number(m.diemHe4).toFixed(2) : '-'}</td>
                <td className="py-3.5 px-3 text-center">{getGradeBadge(m.diemChu)}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${m.dat ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                    {m.dat ? <><CheckCircle2 className="w-3.5 h-3.5" /> Đạt</> : <><AlertCircle className="w-3.5 h-3.5" /> Rớt</>}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 bg-gradient-to-r from-primary-50 via-slate-50 to-primary-50 border-t border-slate-200">
        <h3 className="text-sm font-bold text-primary-900 mb-2.5 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary-600" />
          Mức Học bổng Khuyến khích Học tập áp dụng cho Học kỳ này:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-primary-200/80 shadow-xs">
            <span className="font-bold text-emerald-800 block mb-1">🥇 Học bổng Xuất sắc (100% Học phí):</span>
            <span className="text-base font-black text-emerald-700">{formatCurrency(gradeData.tongHocPhiHocKy)}</span>
            <span className="text-slate-500 block mt-0.5">Yêu cầu: GPA ≥ 3.60 & ĐRL ≥ 90</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-primary-200/80 shadow-xs">
            <span className="font-bold text-blue-800 block mb-1">🥈 Học bổng Giỏi (70% Học phí):</span>
            <span className="text-base font-black text-blue-700">{formatCurrency(gradeData.tongHocPhiHocKy ? gradeData.tongHocPhiHocKy * 0.7 : 0)}</span>
            <span className="text-slate-500 block mt-0.5">Yêu cầu: GPA ≥ 3.20 & ĐRL ≥ 80</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-primary-200/80 shadow-xs">
            <span className="font-bold text-amber-800 block mb-1">🥉 Học bổng Khá (50% Học phí):</span>
            <span className="text-base font-black text-amber-700">{formatCurrency(gradeData.tongHocPhiHocKy ? gradeData.tongHocPhiHocKy * 0.5 : 0)}</span>
            <span className="text-slate-500 block mt-0.5">Yêu cầu: GPA ≥ 2.50 & ĐRL ≥ 65</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicGradesTable;
