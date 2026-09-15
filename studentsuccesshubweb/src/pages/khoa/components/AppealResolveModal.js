import React from 'react';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const AppealResolveModal = ({
  isOpen,
  onClose,
  selectedAppeal,
  actionForm,
  setActionForm,
  previewRank,
  previewHb,
  onSubmit
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={actionForm.accept ? 'Xử lý Khiếu nại: Chấp nhận & Cập nhật Điểm Rèn Luyện' : 'Từ chối khiếu nại của sinh viên'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400">Sinh viên: </span>
              <strong className="text-slate-800 text-sm">{selectedAppeal?.hoTenSinhVien}</strong>
              <span className="font-mono text-primary-700 ml-1">({selectedAppeal?.mssv})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Lớp: </span>
              <strong className="text-slate-700">{selectedAppeal?.maLop}</strong>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span>ĐRL hiện tại: <strong className="text-purple-700 text-sm">{selectedAppeal?.diemRenLuyenHienTai != null ? selectedAppeal.diemRenLuyenHienTai : '-'} đ</strong></span>
            <span>GPA hiện tại: <strong className="text-primary-700 text-sm">{selectedAppeal?.diemTrungBinhHienTai != null ? Number(selectedAppeal.diemTrungBinhHienTai).toFixed(2) : '-'}</strong></span>
            <span>Học kỳ: <strong className="text-slate-700">{selectedAppeal?.maHocKy || 'HK1_2025_2026'}</strong></span>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-semibold block mb-0.5">Nội dung khiếu nại:</span>
            <p className="text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200">"{selectedAppeal?.noiDung}"</p>
          </div>
        </div>

        {actionForm.accept && (
          <div className="p-4 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                Điểm Rèn Luyện (ĐRL) mới điều chỉnh (0 - 100)
              </label>
              {previewRank && <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${previewRank.color}`}>Xếp loại ĐRL: {previewRank.text}</span>}
            </div>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              required
              value={actionForm.diemRenLuyenMoi}
              onChange={(e) => setActionForm({ ...actionForm, diemRenLuyenMoi: e.target.value })}
              placeholder="Nhập điểm rèn luyện mới (0 - 100)..."
              className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
            {previewHb && (
              <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200/90 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-600 font-semibold">Dự kiến Học bổng sau điều chỉnh:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${previewHb.color}`}>{previewHb.text}</span>
              </div>
            )}
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              * Với <strong>GPA: {selectedAppeal?.diemTrungBinhHienTai != null ? Number(selectedAppeal.diemTrungBinhHienTai).toFixed(2) : '-'}</strong> và <strong>ĐRL: {actionForm.diemRenLuyenMoi || 0}</strong>, sinh viên đạt chuẩn xét học bổng tự động.
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phản hồi chính thức đến Sinh viên (bắt buộc)</label>
          <textarea
            rows="3"
            required
            value={actionForm.phanHoi}
            onChange={(e) => setActionForm({ ...actionForm, phanHoi: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-50 cursor-pointer">
            Hủy
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer flex items-center gap-1.5 ${actionForm.accept ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20' : 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/20'}`}
          >
            {actionForm.accept ? <><CheckCircle className="w-4 h-4" /> Xác nhận Chấp nhận & Cập nhật ĐRL</> : <><XCircle className="w-4 h-4" /> Xác nhận Từ chối</>}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AppealResolveModal;
