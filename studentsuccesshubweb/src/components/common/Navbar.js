import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell, GraduationCap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleLabel = () => {
    switch (user?.vaiTro) {
      case 'ROLE_ADMIN': return 'Quản Trị Viên';
      case 'ROLE_CAN_BO_TRUONG': return 'Cán Bộ Cấp Trường';
      case 'ROLE_CAN_BO_KHOA': return `Cán Bộ ${user?.tenKhoa || 'Khoa'}`;
      case 'ROLE_SINH_VIEN': return `Sinh Viên (${user?.maDinhDanh || ''})`;
      default: return 'Người Dùng';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Trường Đại học Mở TP.HCM"
          className="h-11 w-auto object-contain"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-800 tracking-tight leading-tight">OU-SSH</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-primary-50 text-primary-700 border border-primary-200 rounded">
              Đại học Mở TP.HCM
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Hệ Thống Quản Lý Kết Quả Học Tập & Xét Học Bổng</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
              {user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.hoTen}</p>
              <p className="text-[11px] text-primary-600 font-medium">{getRoleLabel()}</p>
            </div>
          </Link>

          <button
            onClick={logout}
            title="Đăng xuất"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
