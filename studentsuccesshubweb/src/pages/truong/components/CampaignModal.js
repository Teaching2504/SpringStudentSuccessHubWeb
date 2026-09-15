import React from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

export const CampaignModal = ({ isOpen, onClose, editingCamp, campForm, setCampForm, onSubmit, error, hocKys }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingCamp ? 'Cập nhật đợt xét học bổng' : 'Khởi tạo đợt xét học bổng mới'}>
      {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div><label className="block text-xs font-semibold text-slate-700 mb-1">Mã đợt xét</label><input type="text" required disabled={!!editingCamp} value={campForm.maDot} onChange={e => setCampForm({ ...campForm, maDot: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100" /></div>
        <div><label className="block text-xs font-semibold text-slate-700 mb-1">Tên đợt xét học bổng</label><input type="text" required value={campForm.tenDot} onChange={e => setCampForm({ ...campForm, tenDot: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
        <div><label className="block text-xs font-semibold text-slate-700 mb-1">Học kỳ xét điểm</label><select value={campForm.maHocKy} onChange={e => setCampForm({ ...campForm, maHocKy: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">{hocKys.map(h => <option key={h.maHocKy} value={h.maHocKy}>{h.tenHocKy}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Ngày bắt đầu</label><input type="date" required value={campForm.ngayBatDau} onChange={e => setCampForm({ ...campForm, ngayBatDau: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Ngày kết thúc</label><input type="date" required value={campForm.ngayKetThuc} onChange={e => setCampForm({ ...campForm, ngayKetThuc: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Hủy</button>
          <button type="submit" className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-medium shadow-md shadow-primary-700/20 transition cursor-pointer">{editingCamp ? 'Lưu thay đổi' : 'Khởi tạo'}</button>
        </div>
      </form>
    </Modal>
  );
};
export default CampaignModal;
