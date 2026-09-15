import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { UserPlus, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import ResetPasswordModal from './components/ResetPasswordModal';

const DEFAULT_FORM = {
  tenDangNhap: '', matKhau: '123456', hoTen: '', email: '', soDienThoai: '', vaiTro: 'ROLE_SINH_VIEN', trangThai: 'HOAT_DONG'
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [newResetPassword, setNewResetPassword] = useState('123456');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (id) => setVisiblePasswords(p => ({ ...p, [id]: !p[id] }));

  const getDefaultPasswordHint = (u) => {
    if (u.matKhauHienThi) return u.matKhauHienThi;
    if (u.cccd) return u.cccd;
    if (u.vaiTro === 'ROLE_SINH_VIEN') return u.tenDangNhap === '2351010216' ? '092305006276' : '079205001111';
    if (u.tenDangNhap === 'admin') return 'admin123';
    if (u.tenDangNhap?.startsWith('captruong')) return 'truong123';
    if (u.tenDangNhap?.startsWith('cbk_')) return 'khoa123';
    return '123456';
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setPageError('');
      const res = await axiosClient.get('/api/admin/users');
      if (res.data?.success) setUsers(res.data.data);
      else if (Array.isArray(res.data)) setUsers(res.data);
    } catch (err) {
      setPageError(err.response?.data?.message || 'Không thể tải danh sách tài khoản từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenModal = (user = null) => {
    setError('');
    setShowPassword(false);
    setEditingUser(user);
    setFormData(user ? { tenDangNhap: user.tenDangNhap, matKhau: '', hoTen: user.hoTen, email: user.email || '', soDienThoai: user.soDienThoai || '', vaiTro: user.vaiTro, trangThai: user.trangThai } : DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const handleOpenResetModal = (user) => {
    setSelectedUserForReset(user);
    setNewResetPassword('123456');
    setResetError('');
    setResetSuccess('');
    setIsResetModalOpen(true);
  };

  const handleExecuteResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/api/admin/users/${selectedUserForReset.id}/reset-password`, { matKhau: newResetPassword });
      setResetSuccess(`Đã đặt lại mật khẩu cho tài khoản "${selectedUserForReset.tenDangNhap}" thành công!`);
      setTimeout(() => { setIsResetModalOpen(false); setResetSuccess(''); }, 1500);
      fetchUsers();
    } catch (err) {
      setResetError(err.response?.data?.message || 'Không thể đặt lại mật khẩu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axiosClient.put(`/api/admin/users/${editingUser.id}`, formData);
        setSuccessMsg(`Cập nhật tài khoản "${formData.tenDangNhap}" thành công!`);
      } else {
        await axiosClient.post('/api/admin/users', formData);
        setSuccessMsg(`Tạo mới tài khoản "${formData.tenDangNhap}" thành công!`);
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu người dùng');
    }
  };

  const handleToggleStatus = async (user) => {
    const isLocking = user.trangThai === 'HOAT_DONG';
    if (window.confirm(`Bạn có chắc chắn muốn ${isLocking ? 'KHÓA' : 'MỞ KHÓA'} tài khoản "${user.tenDangNhap}" không?`)) {
      try {
        await axiosClient.patch(`/api/admin/users/${user.id}/toggle-status`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể đổi trạng thái');
      }
    }
  };

  const handleDelete = async (id, username) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) {
      try {
        await axiosClient.delete(`/api/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể xóa tài khoản');
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = u.tenDangNhap?.toLowerCase().includes(s) || u.hoTen?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s);
    return matchSearch && (!roleFilter || u.vaiTro === roleFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Tài khoản & Phân quyền</h1>
          <p className="text-sm text-slate-500 mt-1">Quản trị danh sách người dùng, cấp quyền hệ thống, thiết lập & tự động đồng bộ mật khẩu bảo mật</p>
        </div>
        <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer">
          <UserPlus className="w-4 h-4" /> Thêm tài khoản mới
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /><span className="font-medium">{successMsg}</span>
        </div>
      )}

      {pageError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-800 text-sm shadow-sm animate-fade-in">
          <div className="flex items-center gap-3"><AlertCircle className="w-5 h-5 text-rose-600 shrink-0" /><span className="font-medium">{pageError}</span></div>
          <button onClick={fetchUsers} className="px-3 py-1 bg-white border border-rose-300 hover:bg-rose-100 rounded-lg text-xs font-semibold text-rose-700 cursor-pointer">Thử lại</button>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, username, email..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Tất cả vai trò</option>
          <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
          <option value="ROLE_CAN_BO_TRUONG">Cán bộ Cấp Trường</option>
          <option value="ROLE_CAN_BO_KHOA">Cán bộ Cấp Khoa</option>
          <option value="ROLE_SINH_VIEN">Sinh viên</option>
        </select>
      </div>

      <UserTable
        users={filteredUsers}
        loading={loading}
        visiblePasswords={visiblePasswords}
        togglePasswordVisibility={togglePasswordVisibility}
        getDefaultPasswordHint={getDefaultPasswordHint}
        onResetPassword={handleOpenResetModal}
        onToggleStatus={handleToggleStatus}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        error={error}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        selectedUser={selectedUserForReset}
        newPassword={newResetPassword}
        setNewPassword={setNewResetPassword}
        onSubmit={handleExecuteResetPassword}
        error={resetError}
        success={resetSuccess}
      />
    </div>
  );
};
export default UserManagement;
