import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, User, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.vaiTro === 'ROLE_ADMIN') navigate('/admin', { replace: true });
      else if (user.vaiTro === 'ROLE_CAN_BO_TRUONG') navigate('/truong', { replace: true });
      else if (user.vaiTro === 'ROLE_CAN_BO_KHOA') navigate('/khoa', { replace: true });
      else navigate('/sinh-vien', { replace: true });
    }
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-lg flex flex-col items-center">
        <div className="bg-white p-2.5 rounded-2xl shadow-md mb-3 border border-slate-200">
          <img
            src="/logo.png"
            alt="Trường Đại học Mở TP.HCM"
            className="h-24 w-auto object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          TRƯỜNG ĐẠI HỌC MỞ TP. HỒ CHÍ MINH
        </h1>
        <p className="text-primary-700 font-semibold text-sm sm:text-base mt-1">
          HỆ THỐNG QUẢN LÝ KẾT QUẢ HỌC TẬP - RÈN LUYỆN VÀ XÉT DUYỆT HỌC BỔNG (OU-SSH)
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 p-8">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
          <Shield className="w-6 h-6 text-primary-700" />
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="Nhập số CCCD (SV) hoặc Mật khẩu"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-primary-700" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 ou-btn-primary"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Đăng nhập hệ thống'
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-8 w-full max-w-2xl px-5 py-3 ou-footer rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shadow-md">
        <div className="flex items-center gap-2 font-medium">
          <span className="ou-footer-icon-circle text-white">
            <User className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-white">2351010216 - Nguyễn Thị Tuyết Trinh</span>
        </div>
        <div className="ou-footer-badge flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Đồ án tốt nghiệp</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
