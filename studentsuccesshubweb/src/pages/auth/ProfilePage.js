import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Lock, Mail, Shield, Building, Award, CheckCircle, AlertCircle, Camera, Upload, Loader2, X } from 'lucide-react';
import Badge from '../../components/common/Badge';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  // Password state
  const [matKhauCu, setMatKhauCu] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMk, setXacNhanMk] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState('');
  const [avatarErr, setAvatarErr] = useState('');

  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (5MB max)
    if (!file.type.startsWith('image/')) {
      setAvatarErr('Vui lòng chọn file hình ảnh (JPG, PNG, WEBP, GIF)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarErr('Kích thước ảnh tối đa là 5MB');
      return;
    }

    setAvatarErr('');
    setAvatarMsg('');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarErr('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    setUploadingAvatar(true);
    setAvatarErr('');
    setAvatarMsg('');

    try {
      const formData = new FormData();
      formData.append('file', avatarFile);

      const res = await axiosClient.post('/api/auth/avatar', formData);
      setUploadingAvatar(false);

      if (res.data?.success) {
        setAvatarMsg('Cập nhật ảnh đại diện thành công!');
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        await refreshUser();
      } else {
        setAvatarErr(res.data?.message || 'Không thể cập nhật ảnh đại diện');
      }
    } catch (err) {
      setUploadingAvatar(false);
      setAvatarErr(err.response?.data?.message || 'Lỗi khi tải ảnh lên máy chủ Cloudinary');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (matKhauMoi !== xacNhanMk) {
      setError('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post('/api/auth/change-password', {
        matKhauCu,
        matKhauMoi
      });
      setLoading(false);
      if (res.data.success) {
        setMessage('Đổi mật khẩu thành công!');
        setMatKhauCu('');
        setMatKhauMoi('');
        setXacNhanMk('');
      } else {
        setError(res.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <Badge variant="purple">Quản trị viên Hệ thống</Badge>;
      case 'ROLE_CAN_BO_TRUONG':
        return <Badge variant="primary">Cán bộ Cấp Trường</Badge>;
      case 'ROLE_CAN_BO_KHOA':
        return <Badge variant="emerald">Cán bộ Cấp Khoa</Badge>;
      case 'ROLE_SINH_VIEN':
        return <Badge variant="amber">Sinh viên</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const currentAvatarSrc = avatarPreview || user?.avatar;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Thông tin Tài khoản & Bảo mật</h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý thông tin cá nhân, ảnh đại diện và thiết lập mật khẩu bảo mật tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card with Avatar Upload */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar Circle with Camera Overlay */}
            <div className="relative group mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500 shadow-md flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-3xl">
                {currentAvatarSrc ? (
                  <img
                    src={currentAvatarSrc}
                    alt={user?.hoTen || 'Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Thay đổi ảnh đại diện"
                className="absolute bottom-0 right-0 p-2 bg-primary-700 text-white rounded-full shadow-lg hover:bg-primary-800 transition transform hover:scale-105 cursor-pointer border-2 border-white"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileSelect}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
            </div>

            {/* Avatar Action buttons when file selected */}
            {avatarFile && (
              <div className="mb-3 p-3 bg-primary-50 border border-primary-200 rounded-xl space-y-2 w-full">
                <p className="text-xs text-primary-800 font-medium truncate">
                  Ảnh đã chọn: <span className="font-bold">{avatarFile.name}</span>
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleUploadAvatar}
                    disabled={uploadingAvatar}
                    className="px-3 py-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        Lưu ảnh
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAvatar}
                    disabled={uploadingAvatar}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {avatarMsg && (
              <div className="mb-3 w-full p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{avatarMsg}</span>
              </div>
            )}

            {avatarErr && (
              <div className="mb-3 w-full p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{avatarErr}</span>
              </div>
            )}

            <h2 className="text-lg font-bold text-slate-800">{user?.hoTen || 'Người dùng'}</h2>
            <p className="text-sm text-slate-500 font-mono">@{user?.tenDangNhap}</p>
            <div className="mt-3">{getRoleBadge(user?.vaiTro)}</div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-500">
                <Mail className="w-4 h-4" /> Email:
              </span>
              <span className="font-medium text-slate-800">{user?.email || 'Chưa cập nhật'}</span>
            </div>

            {user?.maDinhDanh && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-500">
                  <Shield className="w-4 h-4" /> Mã định danh:
                </span>
                <span className="font-semibold font-mono text-primary-700">{user.maDinhDanh}</span>
              </div>
            )}

            {user?.tenKhoa && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-500">
                  <Building className="w-4 h-4" /> Đơn vị / Khoa:
                </span>
                <span className="font-medium text-slate-800">{user.tenKhoa}</span>
              </div>
            )}

            {user?.maLop && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-500">
                  <Award className="w-4 h-4" /> Lớp sinh hoạt:
                </span>
                <span className="font-medium text-slate-800">{user.maLop}</span>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-800">Đổi mật khẩu tài khoản</h2>
          </div>

          {message && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                required
                value={matKhauCu}
                onChange={(e) => setMatKhauCu(e.target.value)}
                placeholder="Nhập mật khẩu đang dùng"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={matKhauMoi}
                onChange={(e) => setMatKhauMoi(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={xacNhanMk}
                onChange={(e) => setXacNhanMk(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-5 bg-primary-700 hover:bg-primary-800 text-white font-medium rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer disabled:opacity-70 text-sm"
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
