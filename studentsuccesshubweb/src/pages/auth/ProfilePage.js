import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Lock, Mail, Shield, Building, Award, CheckCircle, AlertCircle, Camera, Upload, Loader2, X } from 'lucide-react';
import Badge from '../../components/common/Badge';

const ROLE_BADGES = {
  ROLE_ADMIN: <Badge variant="purple">Quản trị viên Hệ thống</Badge>,
  ROLE_CAN_BO_TRUONG: <Badge variant="primary">Cán bộ Cấp Trường</Badge>,
  ROLE_CAN_BO_KHOA: <Badge variant="emerald">Cán bộ Cấp Khoa</Badge>,
  ROLE_SINH_VIEN: <Badge variant="amber">Sinh viên</Badge>,
};

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [passForm, setPassForm] = useState({ matKhauCu: '', matKhauMoi: '', xacNhanMk: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', err: '' });
  const [avatarState, setAvatarState] = useState({ file: null, preview: null, uploading: false, msg: '', err: '' });

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setAvatarState(p => ({ ...p, err: 'Vui lòng chọn file hình ảnh (JPG, PNG, WEBP, GIF)' }));
    if (file.size > 5 * 1024 * 1024) return setAvatarState(p => ({ ...p, err: 'Kích thước ảnh tối đa là 5MB' }));
    setAvatarState(p => ({ ...p, err: '', msg: '', file, preview: URL.createObjectURL(file) }));
  };

  const handleCancelAvatar = () => {
    setAvatarState(p => ({ ...p, file: null, preview: null, err: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadAvatar = async () => {
    if (!avatarState.file) return;
    setAvatarState(p => ({ ...p, uploading: true, err: '', msg: '' }));
    try {
      const formData = new FormData();
      formData.append('file', avatarState.file);
      const res = await axiosClient.post('/api/auth/avatar', formData);
      if (res.data?.success) {
        setAvatarState(p => ({ ...p, uploading: false, msg: 'Cập nhật ảnh đại diện thành công!', file: null, preview: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';
        await refreshUser();
      } else {
        setAvatarState(p => ({ ...p, uploading: false, err: res.data?.message || 'Không thể cập nhật ảnh đại diện' }));
      }
    } catch (err) {
      setAvatarState(p => ({ ...p, uploading: false, err: err.response?.data?.message || 'Lỗi khi tải ảnh lên máy chủ Cloudinary' }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus({ msg: '', err: '' });
    if (passForm.matKhauMoi !== passForm.xacNhanMk) {
      return setStatus({ msg: '', err: 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp!' });
    }
    try {
      setLoading(true);
      const res = await axiosClient.post('/api/auth/change-password', {
        matKhauCu: passForm.matKhauCu,
        matKhauMoi: passForm.matKhauMoi
      });
      setLoading(false);
      if (res.data.success) {
        setStatus({ msg: 'Đổi mật khẩu thành công!', err: '' });
        setPassForm({ matKhauCu: '', matKhauMoi: '', xacNhanMk: '' });
      } else {
        setStatus({ msg: '', err: res.data.message || 'Đổi mật khẩu thất bại' });
      }
    } catch (err) {
      setLoading(false);
      setStatus({ msg: '', err: err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu' });
    }
  };

  const currentAvatarSrc = avatarState.preview || user?.avatar;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Thông tin Tài khoản & Bảo mật</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin cá nhân, ảnh đại diện và thiết lập mật khẩu bảo mật tài khoản</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500 shadow-md flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-3xl">
                {currentAvatarSrc ? <img src={currentAvatarSrc} alt={user?.hoTen || 'Avatar'} className="w-full h-full object-cover" /> : <span>{user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : 'U'}</span>}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} title="Thay đổi ảnh đại diện" className="absolute bottom-0 right-0 p-2 bg-primary-700 text-white rounded-full shadow-lg hover:bg-primary-800 transition transform hover:scale-105 cursor-pointer border-2 border-white">
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarSelect} accept="image/png, image/jpeg, image/jpg, image/webp" className="hidden" />
            </div>

            {avatarState.file && (
              <div className="mb-3 p-3 bg-primary-50 border border-primary-200 rounded-xl space-y-2 w-full">
                <p className="text-xs text-primary-800 font-medium truncate">Ảnh đã chọn: <span className="font-bold">{avatarState.file.name}</span></p>
                <div className="flex items-center justify-center gap-2">
                  <button type="button" onClick={handleUploadAvatar} disabled={avatarState.uploading} className="px-3 py-1.5 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer">
                    {avatarState.uploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải lên...</> : <><Upload className="w-3.5 h-3.5" /> Lưu ảnh</>}
                  </button>
                  <button type="button" onClick={handleCancelAvatar} disabled={avatarState.uploading} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition disabled:opacity-50 cursor-pointer">
                    <X className="w-3.5 h-3.5" /> Hủy
                  </button>
                </div>
              </div>
            )}

            {avatarState.msg && <div className="mb-3 w-full p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2"><CheckCircle className="w-4 h-4 shrink-0" /><span>{avatarState.msg}</span></div>}
            {avatarState.err && <div className="mb-3 w-full p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{avatarState.err}</span></div>}

            <h2 className="text-lg font-bold text-slate-800">{user?.hoTen || 'Người dùng'}</h2>
            <p className="text-sm text-slate-500 font-mono">@{user?.tenDangNhap}</p>
            <div className="mt-3">{ROLE_BADGES[user?.vaiTro] || <Badge>{user?.vaiTro}</Badge>}</div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-500"><Mail className="w-4 h-4" /> Email:</span>
              <span className="font-medium text-slate-800">{user?.email || 'Chưa cập nhật'}</span>
            </div>
            {user?.maDinhDanh && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-500"><Shield className="w-4 h-4" /> Mã định danh:</span>
                <span className="font-semibold font-mono text-primary-700">{user.maDinhDanh}</span>
              </div>
            )}
            {user?.tenKhoa && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-500"><Building className="w-4 h-4" /> Đơn vị / Khoa:</span>
                <span className="font-medium text-slate-800">{user.tenKhoa}</span>
              </div>
            )}
            {user?.maLop && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2 text-slate-500"><Award className="w-4 h-4" /> Lớp sinh hoạt:</span>
                <span className="font-medium text-slate-800">{user.maLop}</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-800">Đổi mật khẩu tài khoản</h2>
          </div>

          {status.msg && <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-sm"><CheckCircle className="w-5 h-5 shrink-0" /><span>{status.msg}</span></div>}
          {status.err && <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm"><AlertCircle className="w-5 h-5 shrink-0" /><span>{status.err}</span></div>}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            {[
              { id: 'matKhauCu', label: 'Mật khẩu hiện tại', placeholder: 'Nhập mật khẩu đang dùng' },
              { id: 'matKhauMoi', label: 'Mật khẩu mới', placeholder: 'Nhập mật khẩu mới' },
              { id: 'xacNhanMk', label: 'Xác nhận mật khẩu mới', placeholder: 'Nhập lại mật khẩu mới' },
            ].map(field => (
              <div key={field.id}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                <input
                  type="password"
                  required
                  value={passForm[field.id]}
                  onChange={(e) => setPassForm({ ...passForm, [field.id]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            ))}

            <button type="submit" disabled={loading} className="py-2.5 px-5 bg-primary-700 hover:bg-primary-800 text-white font-medium rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer disabled:opacity-70 text-sm">
              {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
