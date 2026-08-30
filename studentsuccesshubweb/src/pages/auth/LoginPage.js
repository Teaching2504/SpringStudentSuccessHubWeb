import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, User, AlertCircle, Shield } from 'lucide-react';

const LoginPage = () => {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(tenDangNhap, matKhau);
    setLoading(false);

    if (res.success) {
      const user = res.user;
      if (user.vaiTro === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (user.vaiTro === 'ROLE_CAN_BO_TRUONG') {
        navigate('/truong');
      } else if (user.vaiTro === 'ROLE_CAN_BO_KHOA') {
        navigate('/khoa');
      } else {
        navigate('/sinh-vien');
      }
    } else {
      setError(res.message || 'Đăng nhập không thành công');
    }
  };

  const fillQuickLogin = (u, p) => {
    setTenDangNhap(u);
    setMatKhau(p);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-lg flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Trường Đại học Mở TP.HCM"
          className="h-28 w-auto object-contain mb-3 drop-shadow"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          TRƯỜNG ĐẠI HỌC MỞ TP. HỒ CHÍ MINH
        </h1>
        <p className="text-primary-700 font-semibold text-base sm:text-lg mt-1">
          HỆ THỐNG QUẢN LÝ KẾT QUẢ HỌC TẬP - RÈN LUYỆN VÀ XÉT DUYỆT HỌC BỔNG (OU-SSH)
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Đề tài Đồ án tốt nghiệp - Sinh viên: Nguyễn Thị Tuyết Trinh (2351010216)
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Shield className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-slate-800">Đăng nhập tài khoản</h2>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tên đăng nhập / MSSV / Mã NV
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                placeholder="Nhập MSSV hoặc Tên đăng nhập"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mật khẩu (Mặc định SV là CCCD 12 số)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="Nhập số CCCD (SV) hoặc Mật khẩu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-primary-700 hover:bg-primary-800 text-white font-medium rounded-xl shadow-lg shadow-primary-700/25 transition duration-150 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Đăng nhập hệ thống'
            )}
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
            Tài khoản mẫu kiểm thử nhanh:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuickLogin('admin', 'admin123')}
              className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium text-left border border-purple-200/60 transition cursor-pointer"
            >
              👑 <strong>Admin</strong>: admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('captruong', 'truong123')}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium text-left border border-blue-200/60 transition cursor-pointer"
            >
              🏛️ <strong>Cấp Trường</strong>: captruong
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('cbk_it', 'khoa123')}
              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-left border border-emerald-200/60 transition cursor-pointer"
            >
              🏢 <strong>Khoa IT</strong>: cbk_it
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('2351010216', '092305006276')}
              className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium text-left border border-amber-200/60 transition cursor-pointer"
            >
              🎓 <strong>Sinh viên</strong>: Tuyết Trinh
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400">
        © 2025 - 2026 Trường Đại học Mở Thành phố Hồ Chí Minh. Bảo lưu mọi quyền.
      </footer>
    </div>
  );
};

export default LoginPage;
