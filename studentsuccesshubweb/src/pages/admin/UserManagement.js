import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { UserPlus, Search, Edit2, Trash2, Lock, Unlock, Shield, AlertCircle, KeyRound, Eye, EyeOff, CheckCircle2, RotateCcw } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    hoTen: '',
    email: '',
    soDienThoai: '',
    vaiTro: 'ROLE_SINH_VIEN',
    trangThai: 'HOAT_DONG'
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State for Quick Reset Password
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [newResetPassword, setNewResetPassword] = useState('123456');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // State to toggle view password per row
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getDefaultPasswordHint = (user) => {
    if (user.matKhauHienThi) return user.matKhauHienThi;
    if (user.cccd) return user.cccd;
    if (user.vaiTro === 'ROLE_SINH_VIEN') return user.tenDangNhap === '2351010216' ? '092305006276' : '079205001111';
    if (user.tenDangNhap === 'admin') return 'admin123';
    if (user.tenDangNhap === 'captruong' || user.tenDangNhap === 'captruong_tuan') return 'truong123';
    if (user.tenDangNhap?.startsWith('cbk_')) return 'khoa123';
    return '123456';
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    setError('');
    setShowPassword(false);
    if (user) {
      setEditingUser(user);
      setFormData({
        tenDangNhap: user.tenDangNhap,
        matKhau: '',
        hoTen: user.hoTen,
        email: user.email || '',
        soDienThoai: user.soDienThoai || '',
        vaiTro: user.vaiTro,
        trangThai: user.trangThai
      });
    } else {
      setEditingUser(null);
      setFormData({
        tenDangNhap: '',
        matKhau: '123456',
        hoTen: '',
        email: '',
        soDienThoai: '',
        vaiTro: 'ROLE_SINH_VIEN',
        trangThai: 'HOAT_DONG'
      });
    }
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
    setResetError('');
    setResetSuccess('');

    try {
      await axiosClient.post(`/api/admin/users/${selectedUserForReset.id}/reset-password`, {
        matKhau: newResetPassword
      });
      setResetSuccess(`Đã đặt lại mật khẩu cho tài khoản "${selectedUserForReset.tenDangNhap}" thành công!`);
      setTimeout(() => {
        setIsResetModalOpen(false);
        setResetSuccess('');
      }, 1500);
      fetchUsers();
    } catch (err) {
      setResetError(err.response?.data?.message || 'Không thể đặt lại mật khẩu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    const confirmMessage = isLocking
      ? `Bạn có chắc chắn muốn KHÓA tài khoản "${user.tenDangNhap}" (${user.hoTen}) không?\n\nSau khi khóa, người dùng này sẽ không thể đăng nhập vào hệ thống.`
      : `Bạn có muốn MỞ KHÓA cho tài khoản "${user.tenDangNhap}" (${user.hoTen}) để người dùng có thể đăng nhập lại không?`;

    if (window.confirm(confirmMessage)) {
      try {
        await axiosClient.patch(`/api/admin/users/${user.id}/toggle-status`);
        setSuccessMsg(`Đã ${isLocking ? 'khóa' : 'mở khóa'} tài khoản "${user.tenDangNhap}" thành công!`);
        setTimeout(() => setSuccessMsg(''), 4000);
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

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <Badge variant="purple">Admin</Badge>;
      case 'ROLE_CAN_BO_TRUONG':
        return <Badge variant="primary">Cán bộ Trường</Badge>;
      case 'ROLE_CAN_BO_KHOA':
        return <Badge variant="emerald">Cán bộ Khoa</Badge>;
      case 'ROLE_SINH_VIEN':
        return <Badge variant="amber">Sinh viên</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.tenDangNhap?.toLowerCase().includes(search.toLowerCase()) ||
      u.hoTen?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.vaiTro === roleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Tài khoản & Phân quyền</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản trị danh sách người dùng, cấp quyền hệ thống, thiết lập & tự động đồng bộ mật khẩu bảo mật
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Thêm tài khoản mới
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, username, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
            <option value="ROLE_CAN_BO_TRUONG">Cán bộ Cấp Trường</option>
            <option value="ROLE_CAN_BO_KHOA">Cán bộ Cấp Khoa</option>
            <option value="ROLE_SINH_VIEN">Sinh viên</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Đang tải dữ liệu tài khoản...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Không tìm thấy tài khoản nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                        {u.hoTen?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold">{u.hoTen}</div>
                        <div className="text-[11px] text-slate-400">ID: #{u.id}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600 font-semibold">{u.tenDangNhap}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      <div>{u.email || '-'}</div>
                      <div>{u.soDienThoai || ''}</div>
                    </td>
                    <td className="px-5 py-3.5">{getRoleBadge(u.vaiTro)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                          {visiblePasswords[u.id] ? getDefaultPasswordHint(u) : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          title={visiblePasswords[u.id] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu mặc định'}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition cursor-pointer"
                        >
                          {visiblePasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.trangThai === 'HOAT_DONG' ? (
                        <Badge variant="emerald">Hoạt động</Badge>
                      ) : (
                        <Badge variant="rose">Bị khóa</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* Reset Password Button */}
                      <button
                        onClick={() => handleOpenResetModal(u)}
                        title="Đặt lại mật khẩu nhanh"
                        className="p-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs cursor-pointer transition inline-flex items-center gap-1 font-medium"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span className="hidden md:inline text-[11px]">Đổi MK</span>
                      </button>

                      {/* Lock / Unlock */}
                      <button
                        onClick={() => handleToggleStatus(u)}
                        title={u.trangThai === 'HOAT_DONG' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition ${
                          u.trangThai === 'HOAT_DONG'
                            ? 'text-slate-500 border-slate-200 hover:bg-slate-100'
                            : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {u.trangThai === 'HOAT_DONG' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenModal(u)}
                        title="Chỉnh sửa thông tin"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs cursor-pointer transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(u.id, u.tenDangNhap)}
                        title="Xóa tài khoản"
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Cập nhật thông tin tài khoản (${editingUser.tenDangNhap})` : 'Tạo mới tài khoản người dùng'}
      >
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              required
              disabled={!!editingUser}
              value={formData.tenDangNhap}
              onChange={(e) => setFormData({ ...formData, tenDangNhap: e.target.value })}
              placeholder="VD: nv_cntt, 2351010001, admin2"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 disabled:text-slate-500 font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                {editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu khởi tạo'}
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, matKhau: '123456' })}
                className="text-[11px] text-primary-600 hover:underline cursor-pointer"
              >
                Đặt mặc định (123456)
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.matKhau}
                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                placeholder={editingUser ? '••••••••' : 'Mặc định: 123456'}
                className="w-full px-3.5 py-2 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * Mật khẩu sẽ tự động mã hóa chuẩn BCrypt và cập nhật ngay lập tức khi lưu hoặc khi người dùng tự đổi mật khẩu.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
            <input
              type="text"
              required
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
              placeholder="VD: Nguyễn Văn A"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@ou.edu.vn"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={formData.soDienThoai}
                onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                placeholder="0901234567"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vai trò hệ thống</label>
              <select
                value={formData.vaiTro}
                onChange={(e) => setFormData({ ...formData, vaiTro: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              >
                <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
                <option value="ROLE_CAN_BO_TRUONG">Cán bộ Cấp Trường</option>
                <option value="ROLE_CAN_BO_KHOA">Cán bộ Cấp Khoa</option>
                <option value="ROLE_SINH_VIEN">Sinh viên</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái</label>
              <select
                value={formData.trangThai}
                onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              >
                <option value="HOAT_DONG">Hoạt động</option>
                <option value="BI_KHOA">Bị khóa</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-medium shadow-md shadow-primary-700/20 transition cursor-pointer"
            >
              {editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Reset Password Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={`Đặt lại mật khẩu cho "${selectedUserForReset?.tenDangNhap}"`}
      >
        {resetSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {resetError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{resetError}</span>
          </div>
        )}

        <form onSubmit={handleExecuteResetPassword} className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
            <p><strong>Họ tên:</strong> {selectedUserForReset?.hoTen}</p>
            <p><strong>Tên đăng nhập:</strong> <span className="font-mono">{selectedUserForReset?.tenDangNhap}</span></p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
            <input
              type="text"
              required
              value={newResetPassword}
              onChange={(e) => setNewResetPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setNewResetPassword('123456')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer"
              >
                123456
              </button>
              <button
                type="button"
                onClick={() => setNewResetPassword('Admin@123456')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer"
              >
                Admin@123456
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium shadow-md shadow-amber-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" /> Xác nhận đổi mật khẩu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
