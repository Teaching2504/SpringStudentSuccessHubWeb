import React from 'react';
import Modal from '../../../components/common/Modal';
import { formatCurrency } from '../../../utils/formatters';

export const QuotaModal = ({ isOpen, onClose, selectedSubCamp, quotaForm, setQuotaForm, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Điều chỉnh Chỉ tiêu & Ngân sách: ${selectedSubCamp?.tenKhoa || selectedSubCamp?.khoa?.tenKhoa}`}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Chỉ tiêu số suất học bổng tối đa</label>
          <input type="number" min="1" required value={quotaForm.chiTieu} onChange={e => setQuotaForm({ ...quotaForm, chiTieu: parseInt(e.target.value) || 0 })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hạn mức Ngân sách Khoa (VNĐ)</label>
          <input type="number" min="0" step="1000000" required value={quotaForm.nganSach} onChange={e => setQuotaForm({ ...quotaForm, nganSach: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-emerald-700" />
          <p className="text-[11px] text-slate-500 mt-1">Định dạng hiển thị: {formatCurrency(quotaForm.nganSach)}</p>
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Hủy</button>
          <button type="submit" className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 transition cursor-pointer">Lưu phân bổ</button>
        </div>
      </form>
    </Modal>
  );
};

export const ReviewDecisionModal = ({ isOpen, onClose, selectedSubCamp, reviewAction, setReviewAction, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reviewAction.approve ? 'Phê duyệt Danh sách Học bổng của Khoa' : 'Yêu cầu Khoa điều chỉnh lại danh sách'}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div>Khoa: <strong>{selectedSubCamp?.tenKhoa}</strong></div>
          <div>Đợt xét: <strong>{selectedSubCamp?.tenDot}</strong></div>
          <div>Số lượng đề xuất: <strong>{selectedSubCamp?.soLuongSinhVienDuocCap} SV</strong></div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{reviewAction.approve ? 'Ghi chú phê duyệt (tùy chọn)' : 'Lý do trả về yêu cầu sửa (bắt buộc)'}</label>
          <textarea rows="3" required={!reviewAction.approve} value={reviewAction.lyDo} onChange={e => setReviewAction({ ...reviewAction, lyDo: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" />
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Hủy</button>
          <button type="submit" className={`px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer ${reviewAction.approve ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'}`}>
            {reviewAction.approve ? 'Xác nhận Phê duyệt' : 'Xác nhận Trả về'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const GradesDetailModal = ({ isOpen, onClose, loadingGrades, studentGrades }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bảng điểm Học phần & Học phí Chi tiết" maxWidth="max-w-4xl">
      {loadingGrades ? (
        <div className="py-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !studentGrades || !studentGrades.danhSachDiemMonHoc?.length ? (
        <div className="py-8 text-center text-slate-500"><p className="font-semibold">Chưa có bảng điểm chi tiết môn học trong kỳ của sinh viên này.</p></div>
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
            <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer">Đóng</button>
          </div>
        </div>
      )}
    </Modal>
  );
};
