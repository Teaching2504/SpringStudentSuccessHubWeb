import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

const SubmitEvidenceModal = ({
  isOpen,
  onClose,
  msg,
  error,
  formData,
  setFormData,
  hocKys,
  uploading,
  onFileUpload,
  onSubmit
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nộp Minh chứng Hoạt động Rèn luyện mới">
      {msg && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-medium"><CheckCircle className="w-4 h-4" /> {msg}</div>}
      {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium"><AlertCircle className="w-4 h-4" /> {error}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Học kỳ áp dụng</label>
          <select
            value={formData.maHocKy}
            onChange={(e) => setFormData({ ...formData, maHocKy: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
          >
            {hocKys.map((h) => <option key={h.maHocKy} value={h.maHocKy}>{h.tenHocKy}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tên hoạt động / Thành tích</label>
          <input
            type="text"
            required
            value={formData.tenHoatDong}
            onChange={(e) => setFormData({ ...formData, tenHoatDong: e.target.value })}
            placeholder="VD: Tham gia Cuộc thi Olympic Tin học Sinh viên OU 2025"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm rèn luyện đề xuất cộng</label>
          <input
            type="number"
            step="0.5"
            required
            value={formData.diemDeXuat}
            onChange={(e) => setFormData({ ...formData, diemDeXuat: parseFloat(e.target.value) })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết hoạt động</label>
          <textarea
            rows="3"
            value={formData.moTa}
            onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
            placeholder="Mô tả vai trò tham gia, giải thưởng đạt được..."
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tải lên File Giấy chứng nhận / Minh chứng (Ảnh, PDF)</label>
          <input type="file" onChange={onFileUpload} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" />
          {uploading && <p className="text-xs text-primary-600 mt-1">Đang tải file lên server...</p>}
          {formData.fileUrl && <p className="text-xs text-emerald-600 mt-1">✓ File đã sẵn sàng: {formData.fileUrl}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">
            Hủy
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 transition cursor-pointer"
          >
            Gửi Minh chứng
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmitEvidenceModal;
