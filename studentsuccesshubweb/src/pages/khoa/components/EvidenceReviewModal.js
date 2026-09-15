import React from 'react';
import Modal from '../../../components/common/Modal';

const EvidenceReviewModal = ({
  isOpen,
  onClose,
  selectedEvidence,
  reviewAction,
  setReviewAction,
  onSubmit
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reviewAction.approve ? 'Phê duyệt Minh chứng Rèn luyện' : 'Từ chối Minh chứng'}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <p>Sinh viên: <strong>{selectedEvidence?.hoTenSinhVien}</strong> (MSSV: {selectedEvidence?.mssv})</p>
          <p>Hoạt động: <strong>{selectedEvidence?.tenHoatDong}</strong></p>
          <p>Điểm đề xuất cộng: <strong className="text-emerald-700">+{selectedEvidence?.diemDeXuat} điểm</strong></p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {reviewAction.approve ? 'Lời nhắn / Ghi chú phê duyệt' : 'Lý do từ chối (bắt buộc)'}
          </label>
          <textarea
            rows="3"
            required
            value={reviewAction.lyDo}
            onChange={(e) => setReviewAction({ ...reviewAction, lyDo: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">Hủy</button>
          <button type="submit" className={`px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer ${reviewAction.approve ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'}`}>
            {reviewAction.approve ? 'Xác nhận Duyệt & Cộng điểm' : 'Xác nhận Từ chối'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EvidenceReviewModal;
