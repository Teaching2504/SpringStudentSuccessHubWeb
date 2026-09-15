import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { UserPlus, Search, FileSpreadsheet, Download } from 'lucide-react';
import { sortSemesters } from '../../utils/semesterSort';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import ImportExcelModal from './components/ImportExcelModal';

const INIT_FORM = {
  mssv: '', cccd: '', hoTen: '', email: '', soDienThoai: '',
  ngaySinh: '2005-01-01', gioiTinh: 'Nam', diaChi: 'TP. Hồ Chí Minh', maLop: '', trangThaiHoc: 'DANG_HOC'
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [khoas, setKhoas] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [lops, setLops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKhoa, setSelectedKhoa] = useState('');
  const [selectedLop, setSelectedLop] = useState('');
  const [selectedHk, setSelectedHk] = useState('HK1_2025_2026');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState(INIT_FORM);
  const [error, setError] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    Promise.all([
      axiosClient.get('/api/common/danh-muc/khoa'),
      axiosClient.get('/api/common/danh-muc/lop'),
      axiosClient.get('/api/common/danh-muc/hoc-ky')
    ]).then(([rKhoa, rLop, rHk]) => {
      if (rKhoa.data.success) setKhoas(rKhoa.data.data);
      if (rLop.data.success) setLops(rLop.data.data);
      if (rHk.data.success) setHocKys(sortSemesters(rHk.data.data));
    }).catch(console.error);
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedKhoa) params.append('maKhoa', selectedKhoa);
      if (selectedLop) params.append('maLop', selectedLop);
      if (selectedHk) params.append('maHocKy', selectedHk);
      if (search) params.append('search', search);
      const res = await axiosClient.get(`/api/admin/students?${params.toString()}`);
      if (res.data.success) setStudents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [selectedKhoa, selectedLop, selectedHk, search]);

  const handleOpenModal = (sv = null) => {
    setError('');
    setEditingStudent(sv);
    setFormData(sv ? {
      mssv: sv.mssv, cccd: sv.cccd || '', hoTen: sv.hoTen || '', email: sv.email || '', soDienThoai: sv.soDienThoai || '',
      ngaySinh: sv.ngaySinh || '2005-01-01', gioiTinh: sv.gioiTinh || 'Nam', diaChi: sv.diaChi || '',
      maLop: sv.maLop || lops[0]?.maLop || '', trangThaiHoc: sv.trangThaiHoc || 'DANG_HOC'
    } : { ...INIT_FORM, maLop: lops[0]?.maLop || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      editingStudent ? await axiosClient.put(`/api/admin/students/${editingStudent.mssv}`, formData) : await axiosClient.post('/api/admin/students', formData);
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
    if (!importFile) return alert('Vui lòng chọn file Excel');
    const data = new FormData();
    data.append('file', importFile);
    if (selectedHk) data.append('maHocKy', selectedHk);
    try {
      setImportLoading(true);
      setImportResult(null);
      const res = await axiosClient.post('/api/admin/students/import-excel', data);
      if (res.data.success) {
        setImportResult(res.data.data);
        fetchStudents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi nhập Excel');
    } finally {
      setImportLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await axiosClient.get('/api/admin/students/template-excel', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Mau_Nhap_SinhVien_Diem.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Không thể tải file mẫu Excel: ' + (err.response?.data?.message || err.message || 'Lỗi kết nối'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Hồ sơ & Kết quả Sinh viên</h1>
          <p className="text-sm text-slate-500 mt-1">Tra cứu đa tiêu chí, theo dõi điểm GPA / ĐRL, cảnh báo học vụ và đồng bộ dữ liệu Excel</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownloadTemplate} className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer">
            <Download className="w-4 h-4 text-emerald-700" /> Tải Mẫu Excel
          </button>
          <button onClick={() => { setImportResult(null); setIsImportModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> Nhập Excel Điểm
          </button>
          <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer">
            <UserPlus className="w-4 h-4" /> Thêm Sinh viên
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo MSSV, Họ tên..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={selectedKhoa} onChange={e => setSelectedKhoa(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700">
          <option value="">-- Tất cả Khoa --</option>
          {khoas.map(k => <option key={k.maKhoa} value={k.maKhoa}>{k.tenKhoa} ({k.maKhoa})</option>)}
        </select>
        <select value={selectedLop} onChange={e => setSelectedLop(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700">
          <option value="">-- Tất cả Lớp --</option>
          {lops.map(l => <option key={l.maLop} value={l.maLop}>{l.tenLop} ({l.maLop})</option>)}
        </select>
        <select value={selectedHk} onChange={e => setSelectedHk(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700">
          <option value="">-- Tất cả Học kỳ --</option>
          {hocKys.map(h => <option key={h.maHocKy} value={h.maHocKy}>{h.tenHocKy}</option>)}
        </select>
      </div>

      <StudentTable students={students} loading={loading} onEdit={handleOpenModal} onDelete={handleDelete} />
      <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editingStudent={editingStudent} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} error={error} lops={lops} />
      <ImportExcelModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onSubmit={handleImportExcel} importFile={importFile} setImportFile={setImportFile} importLoading={importLoading} importResult={importResult} />
    </div>
  );
};
export default StudentManagement;
