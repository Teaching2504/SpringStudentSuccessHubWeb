import React from 'react';
import { Edit2, Trash2, Lock, Unlock, KeyRound, Eye, EyeOff } from 'lucide-react';
import Badge from '../../../components/common/Badge';

const ROLE_BADGES = {
  ROLE_ADMIN: <Badge variant="purple">Admin</Badge>,
  ROLE_CAN_BO_TRUONG: <Badge variant="primary">Cán bộ Trường</Badge>,
  ROLE_CAN_BO_KHOA: <Badge variant="emerald">Cán bộ Khoa</Badge>,
  ROLE_SINH_VIEN: <Badge variant="amber">Sinh viên</Badge>,
};

export const UserTable = ({
  users,
  loading,
  visiblePasswords,
  togglePasswordVisibility,
  getDefaultPasswordHint,
  onResetPassword,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Người dùng</th>
              <th className="px-5 py-3.5">Tên đăng nhập</th>
              <th className="px-5 py-3.5">Email / SĐT</th>
              <th className="px-5 py-3.5">Vai trò</th>
              <th className="px-5 py-3.5">Mật khẩu khởi tạo</th>
              <th className="px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5 text-right">Thao tác & Mật khẩu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8 text-slate-400">Đang tải dữ liệu tài khoản...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-slate-400">Không tìm thấy tài khoản nào phù hợp</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">{u.hoTen?.charAt(0) || 'U'}</div>
                    <div><div className="font-semibold">{u.hoTen}</div><div className="text-[11px] text-slate-400">ID: #{u.id}</div></div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-600 font-semibold">{u.tenDangNhap}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500"><div>{u.email || '-'}</div><div>{u.soDienThoai || ''}</div></td>
                  <td className="px-5 py-3.5">{ROLE_BADGES[u.vaiTro] || <Badge>{u.vaiTro}</Badge>}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{visiblePasswords[u.id] ? getDefaultPasswordHint(u) : '••••••••'}</span>
                      <button type="button" onClick={() => togglePasswordVisibility(u.id)} title={visiblePasswords[u.id] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu mặc định'} className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition cursor-pointer">
                        {visiblePasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Badge variant={u.trangThai === 'HOAT_DONG' ? 'emerald' : 'rose'}>{u.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Bị khóa'}</Badge></td>
                  <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button onClick={() => onResetPassword(u)} title="Đặt lại mật khẩu nhanh" className="p-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs cursor-pointer transition inline-flex items-center gap-1 font-medium">
                      <KeyRound className="w-3.5 h-3.5" /><span className="hidden md:inline text-[11px]">Đổi MK</span>
                    </button>
                    <button onClick={() => onToggleStatus(u)} title={u.trangThai === 'HOAT_DONG' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'} className={`p-1.5 rounded-lg border text-xs cursor-pointer transition ${u.trangThai === 'HOAT_DONG' ? 'text-slate-500 border-slate-200 hover:bg-slate-100' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}>
                      {u.trangThai === 'HOAT_DONG' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => onEdit(u)} title="Chỉnh sửa thông tin" className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs cursor-pointer transition"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onDelete(u.id, u.tenDangNhap)} title="Xóa tài khoản" className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UserTable;
