import React from 'react';
import Modal from '../../../components/common/Modal';
import { formatCurrency } from '../../../utils/formatters';

const StudentGradesModal = ({ isOpen, onClose, selectedStudent, studentGrades, loadingGrades }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Bảng điểm chi tiết: ${selectedStudent?.hoTen || ''} (${selectedStudent?.mssv || ''})`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {loadingGrades ? (
          <div className="py-8 text-center text-slate-400"><div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div><p className="mt-2 text-xs">Đang tải bảng điểm chi tiết...</p></div>
        ) : studentGrades?.danhSachDiemMonHoc?.length > 0 ? (
          <div>
            <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between text-xs">
              <span>Tổng số tín chỉ: <strong>{studentGrades.tongSoTinChi} TC</strong></span>
              <span>Học phí học kỳ: <strong className="text-primary-700">{formatCurrency(studentGrades.tongHocPhiHocKy)}</strong></span>
              <span>GPA Học kỳ: <strong className="text-emerald-700">{studentGrades.gpaHe4 != null ? Number(studentGrades.gpaHe4).toFixed(2) : '-'} (Hệ 4)</strong></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-500 uppercase">
                  <tr><th className="px-3 py-2">Mã MH</th><th className="px-3 py-2">Tên Môn</th><th className="px-3 py-2 text-center">TC</th><th className="px-3 py-2 text-center">CC (10%)</th><th className="px-3 py-2 text-center">GK (30%)</th><th className="px-3 py-2 text-center">CK (60%)</th><th className="px-3 py-2 text-center">Tổng kết 10</th><th className="px-3 py-2 text-center">Hệ 4</th><th className="px-3 py-2 text-center">Điểm chữ</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.danhSachDiemMonHoc.map((m, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 font-mono font-bold text-slate-700">{m.maMon}</td><td className="px-3 py-2">{m.tenMon}</td><td className="px-3 py-2 text-center">{m.soTinChi}</td>
                      <td className="px-3 py-2 text-center">{m.diemChuyenCan != null ? Number(m.diemChuyenCan).toFixed(1) : '-'}</td>
                      <td className="px-3 py-2 text-center">{m.diemGiuaKy != null ? Number(m.diemGiuaKy).toFixed(1) : '-'}</td>
                      <td className="px-3 py-2 text-center">{m.diemCuoiKy != null ? Number(m.diemCuoiKy).toFixed(1) : '-'}</td>
                      <td className="px-3 py-2 text-center font-bold">{m.diemTongKet10 != null ? Number(m.diemTongKet10).toFixed(1) : '-'}</td>
                      <td className="px-3 py-2 text-center font-bold text-primary-700">{m.diemHe4 != null ? Number(m.diemHe4).toFixed(2) : '-'}</td>
                      <td className="px-3 py-2 text-center font-bold">{m.diemChu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">Chưa có bảng điểm chi tiết cho học kỳ này</p>
        )}
      </div>
    </Modal>
  );
};

export default StudentGradesModal;
