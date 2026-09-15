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
    <header className="ou-navbar h-16 sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="ou-navbar-logo-badge">
          <img
            src="/logo.png"
            alt="Trường Đại học Mở TP.HCM"
            className="h-9 w-auto object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white tracking-tight leading-tight">OU-SSH HUB</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-white/20 text-white rounded border border-white/25">
              Đại học Mở TP.HCM
            </span>
          </div>
          <p className="text-xs text-blue-100/90 font-medium">Hệ thống quản lý kết quả học tập và rèn luyện hỗ trợ xét học bổng sinh viên</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span className="ou-navbar-role-pill hidden md:inline-flex">
          {getRoleLabel()}
        </span>

        <div className="flex items-center gap-3 pl-3 border-l border-white/20">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors text-left"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.hoTen}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white text-primary-700 flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{user?.hoTen}</p>
              <p className="text-[11px] text-blue-200 font-medium">@{user?.tenDangNhap}</p>
            </div>
          </Link>

          <button
            onClick={logout}
            title="Đăng xuất"
            className="ou-navbar-btn-logout cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
