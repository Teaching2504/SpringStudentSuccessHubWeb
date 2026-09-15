import React from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

export const StudentModal = ({ isOpen, onClose, editingStudent, formData, setFormData, onSubmit, error, lops }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingStudent ? `Cập nhật sinh viên MSSV: ${editingStudent.mssv}` : 'Thêm hồ sơ sinh viên mới'}>
      {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Mã số SV (MSSV)</label><input type="text" required disabled={!!editingStudent} value={formData.mssv} onChange={e => setFormData({ ...formData, mssv: e.target.value })} placeholder="VD: 2351010216" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100" /></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">CCCD (Mật khẩu mặc định)</label><input type="text" required value={formData.cccd} onChange={e => setFormData({ ...formData, cccd: e.target.value })} placeholder="12 số CCCD" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
        </div>
        <div><label className="block text-xs font-semibold text-slate-700 mb-1">Họ và Tên</label><input type="text" required value={formData.hoTen} onChange={e => setFormData({ ...formData, hoTen: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label><input type="text" value={formData.soDienThoai} onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Lớp sinh hoạt</label><select value={formData.maLop} onChange={e => setFormData({ ...formData, maLop: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">{lops.map(l => <option key={l.maLop} value={l.maLop}>{l.tenLop} ({l.maLop})</option>)}</select></div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label><select value={formData.gioiTinh} onChange={e => setFormData({ ...formData, gioiTinh: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"><option value="Nam">Nam</option><option value="Nữ">Nữ</option></select></div>
        </div>
        <div><label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ</label><input type="text" value={formData.diaChi} onChange={e => setFormData({ ...formData, diaChi: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Hủy</button>
          <button type="submit" className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-medium shadow-md shadow-primary-700/20 transition cursor-pointer">{editingStudent ? 'Lưu cập nhật' : 'Thêm sinh viên'}</button>
        </div>
      </form>
    </Modal>
  );
};
export default StudentModal;
