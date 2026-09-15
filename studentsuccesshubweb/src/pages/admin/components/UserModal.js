import React from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import Modal from '../../../components/common/Modal';

export const UserModal = ({ isOpen, onClose, editingUser, formData, setFormData, onSubmit, error, showPassword, setShowPassword }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingUser ? `Cập nhật thông tin tài khoản (${editingUser.tenDangNhap})` : 'Tạo mới tài khoản người dùng'}>
      {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đăng nhập</label>
          <input type="text" required disabled={!!editingUser} value={formData.tenDangNhap} onChange={e => setFormData({ ...formData, tenDangNhap: e.target.value })} placeholder="VD: nv_cntt, 2351010001, admin2" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 disabled:text-slate-500 font-mono" />
        </div>
        {!editingUser && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu khởi tạo</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={formData.matKhau} onChange={e => setFormData({ ...formData, matKhau: e.target.value })} placeholder="Mặc định: 123456" className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và Tên</label>
          <input type="text" required value={formData.hoTen} onChange={e => setFormData({ ...formData, hoTen: e.target.value })} placeholder="VD: Nguyễn Văn A" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@ou.edu.vn" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
            <input type="text" value={formData.soDienThoai} onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })} placeholder="0901234567" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vai trò hệ thống</label>
            <select value={formData.vaiTro} onChange={e => setFormData({ ...formData, vaiTro: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">
              <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
              <option value="ROLE_CAN_BO_TRUONG">Cán bộ Cấp Trường</option>
              <option value="ROLE_CAN_BO_KHOA">Cán bộ Cấp Khoa</option>
              <option value="ROLE_SINH_VIEN">Sinh viên</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái tài khoản</label>
            <select value={formData.trangThai} onChange={e => setFormData({ ...formData, trangThai: e.target.value })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium">
              <option value="HOAT_DONG">Hoạt động</option>
              <option value="BI_KHOA">Bị khóa</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Hủy</button>
          <button type="submit" className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 transition cursor-pointer">{editingUser ? 'Lưu thay đổi' : 'Tạo người dùng'}</button>
        </div>
      </form>
    </Modal>
  );
};
export default UserModal;
