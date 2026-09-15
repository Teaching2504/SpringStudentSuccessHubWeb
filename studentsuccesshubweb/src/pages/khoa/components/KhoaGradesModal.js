import React from 'react';
import Modal from '../../../components/common/Modal';
import { formatCurrency } from '../../../utils/formatters';

const KhoaGradesModal = ({ isOpen, onClose, loadingGrades, studentGrades }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bảng điểm Học phần & Học phí Chi tiết" maxWidth="max-w-4xl">
      {loadingGrades ? (
        <div className="py-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !studentGrades || !studentGrades.danhSachDiemMonHoc?.length ? (
        <div className="py-8 text-center text-slate-500">
          <p className="font-semibold">Chưa có bảng điểm chi tiết môn học trong kỳ của sinh viên này.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div><span className="text-slate-500 block font-semibold">Sinh viên:</span><span className="font-bold text-slate-800 text-sm">{studentGrades.hoTen}</span></div>
            <div><span className="text-slate-500 block font-semibold">MSSV / Lớp:</span><span className="font-mono font-bold text-primary-700">{studentGrades.mssv}</span> - {studentGrades.tenLop}</div>
            <div><span className="text-slate-500 block font-semibold">Tổng tín chỉ:</span><span className="font-bold text-slate-800 text-sm">{studentGrades.tongSoTinChi} TC</span></div>
            <div><span className="text-slate-500 block font-semibold">Tổng học phí kỳ:</span><span className="font-bold text-emerald-700 text-sm">{formatCurrency(studentGrades.tongHocPhiHocKy)}</span></div>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3">Mã môn</th>
                  <th className="py-2.5 px-3">Tên môn học</th>
                  <th className="py-2.5 px-2 text-center">TC</th>
                  <th className="py-2.5 px-2 text-right">Học phí</th>
                  <th className="py-2.5 px-2 text-center">CC (10%)</th>
                  <th className="py-2.5 px-2 text-center">GK (30%)</th>
                  <th className="py-2.5 px-2 text-center">CK (60%)</th>
                  <th className="py-2.5 px-2 text-center font-black">Điểm 10</th>
                  <th className="py-2.5 px-2 text-center font-black">Hệ 4</th>
                  <th className="py-2.5 px-2 text-center">Điểm chữ</th>
                  <th className="py-2.5 px-3 text-center">Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentGrades.danhSachDiemMonHoc.map((m, i) => (
                  <tr key={m.id || i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-primary-700">{m.maMon}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{m.tenMon}</td>
                    <td className="py-2.5 px-2 text-center font-bold">{m.soTinChi}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-700">{formatCurrency(m.hocPhiMon)}</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">{m.diemChuyenCan != null ? Number(m.diemChuyenCan).toFixed(1) : '-'}</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">{m.diemGiuaKy != null ? Number(m.diemGiuaKy).toFixed(1) : '-'}</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">{m.diemCuoiKy != null ? Number(m.diemCuoiKy).toFixed(1) : '-'}</td>
                    <td className="py-2.5 px-2 text-center font-black text-slate-900 bg-slate-50">{m.diemTongKet10 != null ? Number(m.diemTongKet10).toFixed(2) : '-'}</td>
                    <td className="py-2.5 px-2 text-center font-black text-amber-700 bg-amber-50">{m.diemHe4 != null ? Number(m.diemHe4).toFixed(2) : '-'}</td>
                    <td className="py-2.5 px-2 text-center font-bold">{m.diemChu}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${m.dat ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                        {m.dat ? 'Đạt' : 'Rớt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer">
              Đóng
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default KhoaGradesModal;
