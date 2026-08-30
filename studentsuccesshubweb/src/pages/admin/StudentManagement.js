import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { UserPlus, Upload, Search, Filter, Edit2, Trash2, AlertTriangle, CheckCircle, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { sortSemesters } from '../../utils/semesterSort';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [khoas, setKhoas] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [lops, setLops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedKhoa, setSelectedKhoa] = useState('');
  const [selectedLop, setSelectedLop] = useState('');
  const [selectedHk, setSelectedHk] = useState('HK1_2025_2026');
  const [search, setSearch] = useState('');

  // Modal Student CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    mssv: '',
    cccd: '',
    hoTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '2005-01-01',
    gioiTinh: 'Nam',
    diaChi: 'TP. Hồ Chí Minh',
    maLop: '',
    trangThaiHoc: 'DANG_HOC'
  });
  const [error, setError] = useState('');

  // Modal Excel Import
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedKhoa, selectedLop, selectedHk, search]);

  const fetchMetadata = async () => {
    try {
      const [rKhoa, rLop, rHk] = await Promise.all([
        axiosClient.get('/api/common/danh-muc/khoa'),
        axiosClient.get('/api/common/danh-muc/lop'),
        axiosClient.get('/api/common/danh-muc/hoc-ky')
      ]);
      if (rKhoa.data.success) setKhoas(rKhoa.data.data);
      if (rLop.data.success) setLops(rLop.data.data);
      if (rHk.data.success) setHocKys(sortSemesters(rHk.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedKhoa) params.append('maKhoa', selectedKhoa);
      if (selectedLop) params.append('maLop', selectedLop);
      if (selectedHk) params.append('maHocKy', selectedHk);
      if (search) params.append('search', search);

      const res = await axiosClient.get(`/api/admin/students?${params.toString()}`);
      if (res.data.success) {
        setStudents(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = (sv = null) => {
    setError('');
    if (sv) {
      setEditingStudent(sv);
      setFormData({
        mssv: sv.mssv,
        cccd: sv.cccd || '',
        hoTen: sv.hoTen || '',
        email: sv.email || '',
        soDienThoai: sv.soDienThoai || '',
        ngaySinh: sv.ngaySinh || '2005-01-01',
        gioiTinh: sv.gioiTinh || 'Nam',
        diaChi: sv.diaChi || '',
        maLop: sv.maLop || lops[0]?.maLop || '',
        trangThaiHoc: sv.trangThaiHoc || 'DANG_HOC'
      });
    } else {
      setEditingStudent(null);
      setFormData({
        mssv: '',
        cccd: '',
        hoTen: '',
        email: '',
        soDienThoai: '',
        ngaySinh: '2005-01-01',
        gioiTinh: 'Nam',
        diaChi: 'TP. Hồ Chí Minh',
        maLop: lops[0]?.maLop || '',
        trangThaiHoc: 'DANG_HOC'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingStudent) {
        await axiosClient.put(`/api/admin/students/${editingStudent.mssv}`, formData);
      } else {
        await axiosClient.post('/api/admin/students', formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin sinh viên');
    }
  };

  const handleDelete = async (mssv) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên MSSV ${mssv}?`)) {
      try {
        await axiosClient.delete(`/api/admin/students/${mssv}`);
        fetchStudents();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể xóa sinh viên');
      }
    }
  };

  const handleImportExcel = async (e) => {
    e.preventDefault();
    if (!importFile) {
      alert('Vui lòng chọn file Excel');
      return;
    }

    const data = new FormData();
    data.append('file', importFile);
    if (selectedHk) data.append('maHocKy', selectedHk);

    try {
      setImportLoading(true);
      setImportResult(null);
      const res = await axiosClient.post('/api/admin/students/import-excel', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportLoading(false);
      if (res.data.success) {
        setImportResult(res.data.data);
        fetchStudents();
      }
    } catch (err) {
      setImportLoading(false);
      alert(err.response?.data?.message || 'Lỗi khi nhập Excel');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Hồ sơ & Kết quả Sinh viên</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tra cứu đa tiêu chí, theo dõi điểm GPA / ĐRL, cảnh báo học vụ và đồng bộ dữ liệu Excel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setImportResult(null);
              setIsImportModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Nhập Excel Điểm
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Thêm Sinh viên
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo MSSV, Họ tên..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <select
            value={selectedKhoa}
            onChange={(e) => setSelectedKhoa(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Tất cả Khoa --</option>
            {khoas.map((k) => (
              <option key={k.maKhoa} value={k.maKhoa}>
                {k.tenKhoa} ({k.maKhoa})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedLop}
            onChange={(e) => setSelectedLop(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Tất cả Lớp --</option>
            {lops.map((l) => (
              <option key={l.maLop} value={l.maLop}>
                {l.tenLop} ({l.maLop})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedHk}
            onChange={(e) => setSelectedHk(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Tất cả Học kỳ --</option>
            {hocKys.map((h) => (
              <option key={h.maHocKy} value={h.maHocKy}>
                {h.tenHocKy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3.5">MSSV</th>
                <th className="px-4 py-3.5">Họ và Tên</th>
                <th className="px-4 py-3.5">Lớp / Khoa</th>
                <th className="px-4 py-3.5 text-center">GPA</th>
                <th className="px-4 py-3.5 text-center">ĐRL</th>
                <th className="px-4 py-3.5 text-center">Tín chỉ</th>
                <th className="px-4 py-3.5">Cảnh báo Học vụ</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">
                    Đang tải danh sách sinh viên...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">
                    Không tìm thấy sinh viên nào
                  </td>
                </tr>
              ) : (
                students.map((sv) => {
                  const isWarned = sv.canhBao && sv.canhBao !== 'Bình thường';
                  return (
                    <tr key={sv.mssv} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-primary-700">{sv.mssv}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        <div>{sv.hoTen}</div>
                        <div className="text-xs text-slate-400">{sv.email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="font-semibold text-slate-700">{sv.maLop}</div>
                        <div className="text-slate-500">{sv.tenKhoa}</div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                        {sv.diemTrungBinh != null ? sv.diemTrungBinh.toFixed(2) : '-'}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                        {sv.diemRenLuyen != null ? sv.diemRenLuyen : '-'}
                      </td>
                      <td className="px-4 py-3.5 text-center text-xs text-slate-600">
                        {sv.soTinChi != null ? sv.soTinChi : '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        {isWarned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> {sv.canhBao}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Bình thường
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(sv)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sv.mssv)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Cập nhật sinh viên MSSV: ${editingStudent.mssv}` : 'Thêm hồ sơ sinh viên mới'}
      >
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mã số SV (MSSV)</label>
              <input
                type="text"
                required
                disabled={!!editingStudent}
                value={formData.mssv}
                onChange={(e) => setFormData({ ...formData, mssv: e.target.value })}
                placeholder="VD: 2351010216"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CCCD (Mật khẩu mặc định)</label>
              <input
                type="text"
                required
                value={formData.cccd}
                onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                placeholder="12 số CCCD"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và Tên</label>
            <input
              type="text"
              required
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
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
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={formData.soDienThoai}
                onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp sinh hoạt</label>
              <select
                value={formData.maLop}
                onChange={(e) => setFormData({ ...formData, maLop: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              >
                {lops.map((l) => (
                  <option key={l.maLop} value={l.maLop}>
                    {l.tenLop} ({l.maLop})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
              <select
                value={formData.gioiTinh}
                onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              value={formData.diaChi}
              onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
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
              {editingStudent ? 'Lưu cập nhật' : 'Thêm sinh viên'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Import Excel Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Nhập dữ liệu Sinh viên & Điểm từ file Excel (.xlsx)"
      >
        <form onSubmit={handleImportExcel} className="space-y-4">
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
            <p className="font-bold">Định dạng các cột mẫu file Excel:</p>
            <p>1. MSSV | 2. Họ Tên | 3. Email | 4. SĐT | 5. Mã Lớp | 6. Giới tính | 7. GPA | 8. ĐRL | 9. Số TC | 10. Rớt môn (true/false)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn Học kỳ áp dụng điểm</label>
            <select
              value={selectedHk}
              onChange={(e) => setSelectedHk(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
            >
              {hocKys.map((h) => (
                <option key={h.maHocKy} value={h.maHocKy}>
                  {h.tenHocKy}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn file Excel</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setImportFile(e.target.files[0])}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          {importResult && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Nhập dữ liệu thành công!
              </p>
              <p>• Thêm mới: {importResult.importedCount} sinh viên</p>
              <p>• Cập nhật điểm: {importResult.updatedCount} sinh viên</p>
              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-2 text-rose-600">
                  <p className="font-semibold">Cảnh báo dòng lỗi:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={importLoading}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-medium shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-60"
            >
              {importLoading ? 'Đang đọc file...' : 'Tiến hành Nhập & Đồng bộ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentManagement;
