import React from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

export const CategoryModal = ({ isOpen, onClose, activeTab, editingItem, formData, setFormData, onSubmit, error, khoas, nganhs }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? `Cập nhật ${activeTab}` : `Thêm mới ${activeTab}`}>
      {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
      <form onSubmit={onSubmit} className="space-y-4">
        {activeTab === 'khoa' && (
          <>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Mã Khoa</label><input type="text" required disabled={!!editingItem} value={formData.maKhoa || ''} onChange={e => setFormData({ ...formData, maKhoa: e.target.value })} placeholder="VD: IT, BA" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100" /></div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Tên Khoa</label><input type="text" required value={formData.tenKhoa || ''} onChange={e => setFormData({ ...formData, tenKhoa: e.target.value })} placeholder="VD: Khoa Công nghệ Thông tin" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
          </>
        )}
        {activeTab === 'nganh' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Mã Ngành</label><input type="text" required disabled={!!editingItem} value={formData.maNganh || ''} onChange={e => setFormData({ ...formData, maNganh: e.target.value })} placeholder="VD: CS, SE" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Hệ đào tạo</label><select value={formData.heDaoTao || 'CHUAN'} onChange={e => setFormData({ ...formData, heDaoTao: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"><option value="CHUAN">Chuẩn (Đại trà)</option><option value="CHAT_LUONG_CAO">Chất lượng cao</option></select></div>
            </div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Tên Ngành</label><input type="text" required value={formData.tenNganh || ''} onChange={e => setFormData({ ...formData, tenNganh: e.target.value })} placeholder="VD: Khoa học Máy tính" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Trực thuộc Khoa</label><select value={formData.maKhoa || ''} onChange={e => setFormData({ ...formData, maKhoa: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">{khoas.map(k => <option key={k.maKhoa} value={k.maKhoa}>{k.tenKhoa} ({k.maKhoa})</option>)}</select></div>
          </>
        )}
        {activeTab === 'lop' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Mã Lớp</label><input type="text" required disabled={!!editingItem} value={formData.maLop || ''} onChange={e => setFormData({ ...formData, maLop: e.target.value })} placeholder="VD: DH23CS01" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Khóa học</label><input type="text" required value={formData.khoaHoc || ''} onChange={e => setFormData({ ...formData, khoaHoc: e.target.value })} placeholder="VD: K23 (2023-2027)" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
            </div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Tên Lớp Sinh Hoạt</label><input type="text" required value={formData.tenLop || ''} onChange={e => setFormData({ ...formData, tenLop: e.target.value })} placeholder="VD: Lớp Khoa học Máy tính 2023 - 01" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Khoa</label><select value={formData.maKhoa || ''} onChange={e => setFormData({ ...formData, maKhoa: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">{khoas.map(k => <option key={k.maKhoa} value={k.maKhoa}>{k.tenKhoa} ({k.maKhoa})</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Ngành</label><select value={formData.maNganh || ''} onChange={e => setFormData({ ...formData, maNganh: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">{nganhs.map(n => <option key={n.maNganh} value={n.maNganh}>{n.tenNganh} ({n.maNganh})</option>)}</select></div>
            </div>
          </>
        )}
        {activeTab === 'hoc-ky' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Mã Học Kỳ</label><input type="text" required disabled={!!editingItem} value={formData.maHocKy || ''} onChange={e => setFormData({ ...formData, maHocKy: e.target.value })} placeholder="VD: HK1_2025_2026" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 font-mono" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Năm Học</label><input type="text" required value={formData.namHoc || ''} onChange={e => setFormData({ ...formData, namHoc: e.target.value })} placeholder="VD: 2025-2026" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
            </div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Tên Học Kỳ</label><input type="text" required value={formData.tenHocKy || ''} onChange={e => setFormData({ ...formData, tenHocKy: e.target.value })} placeholder="VD: Học kỳ 1 Năm học 2025-2026" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
          </>
        )}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Hủy</button>
          <button type="submit" className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 transition cursor-pointer">{editingItem ? 'Lưu thay đổi' : 'Tạo mới'}</button>
        </div>
      </form>
    </Modal>
  );
};
export default CategoryModal;
