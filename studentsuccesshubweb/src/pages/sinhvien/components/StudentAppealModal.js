import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const StudentAppealModal = ({
  isOpen,
  onClose,
  selectedHb,
  appealForm,
  setAppealForm,
  msg,
  error,
  onSubmit
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gửi Kiến nghị / Khiếu nại Học bổng">
      {msg && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-medium"><CheckCircle className="w-4 h-4" /> {msg}</div>}
      {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium"><AlertCircle className="w-4 h-4" /> {error}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <p>Đợt xét: <strong>{selectedHb?.tenDot}</strong></p>
          <p>Điểm hiện tại: GPA {selectedHb?.diemTrungBinh?.toFixed(2)} | ĐRL {selectedHb?.diemRenLuyen}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung kiến nghị / thắc mắc chi tiết (bắt buộc)</label>
          <textarea
            rows="4"
            required
            value={appealForm.noiDung}
            onChange={(e) => setAppealForm({ ...appealForm, noiDung: e.target.value })}
            placeholder="VD: Em xin khiếu nại về điểm rèn luyện chưa được cộng điểm hoạt động NCKH hoặc thắc mắc điểm GPA môn..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Link file / hình ảnh minh chứng bổ sung (nếu có)</label>
          <input
            type="text"
            value={appealForm.tepMinhChung}
            onChange={(e) => setAppealForm({ ...appealForm, tepMinhChung: e.target.value })}
            placeholder="https://drive.google.com/..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
          />
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">
            Hủy
          </button>
          <button type="submit" className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 transition cursor-pointer">
            Gửi Đơn Kiến Nghị
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentAppealModal;
