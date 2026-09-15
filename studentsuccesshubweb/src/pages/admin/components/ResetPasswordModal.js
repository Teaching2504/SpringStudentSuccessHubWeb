import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../../../components/common/Modal';

export const ResetPasswordModal = ({
  isOpen,
  onClose,
  selectedUser,
  newPassword,
  setNewPassword,
  onSubmit,
  error,
  success
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cấp lại / Đặt lại mật khẩu nhanh" maxWidth="max-w-md">
      {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{success}</span></div>}
      {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div>Người dùng: <strong className="text-slate-800">{selectedUser?.hoTen}</strong></div>
          <div>Tài khoản: <strong className="font-mono text-primary-700">{selectedUser?.tenDangNhap}</strong></div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
          <input type="text" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nhập mật khẩu mới..." className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Hủy</button>
          <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-600/20 transition cursor-pointer">Xác nhận đổi MK</button>
        </div>
      </form>
    </Modal>
  );
};
export default ResetPasswordModal;
