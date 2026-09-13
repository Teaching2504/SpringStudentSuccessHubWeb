import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import {
  Building,
  BookOpen,
  Layers,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  GraduationCap,
  Network,
  Filter,
  CheckCircle2
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { sortSemesters } from '../../utils/semesterSort';

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('khoa'); // khoa, nganh, lop, hoc-ky, mon-hoc, ctdt
  const [khoas, setKhoas] = useState([]);
  const [nganhs, setNganhs] = useState([]);
  const [lops, setLops] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [selectedNganh, setSelectedNganh] = useState('CS');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (activeTab === 'ctdt') {
      fetchCurriculum(selectedNganh);
    }
  }, [selectedNganh, activeTab]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [rKhoa, rNganh, rLop, rHk, rMon] = await Promise.all([
        axiosClient.get('/api/common/danh-muc/khoa'),
        axiosClient.get('/api/common/danh-muc/nganh'),
        axiosClient.get('/api/common/danh-muc/lop'),
        axiosClient.get('/api/common/danh-muc/hoc-ky'),
        axiosClient.get('/api/common/danh-muc/mon-hoc')
      ]);

      if (rKhoa.data.success) setKhoas(rKhoa.data.data);
      if (rNganh.data.success) setNganhs(rNganh.data.data);
      if (rLop.data.success) setLops(rLop.data.data);
      if (rHk.data.success) setHocKys(sortSemesters(rHk.data.data));
      if (rMon.data.success) setMonHocs(rMon.data.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCurriculum = async (maNganh) => {
    try {
      const res = await axiosClient.get(`/api/common/danh-muc/curriculum/${maNganh}`);
      if (res.data.success) {
        setCurriculums(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi tải CTĐT', err);
    }
  };

  const handleOpenModal = (item = null) => {
    setError('');
    setEditingItem(item);
    if (activeTab === 'khoa') {
      setFormData({
        maKhoa: item?.maKhoa || '',
        tenKhoa: item?.tenKhoa || ''
      });
    } else if (activeTab === 'nganh') {
      setFormData({
        maNganh: item?.maNganh || '',
        tenNganh: item?.tenNganh || '',
        heDaoTao: item?.heDaoTao || 'CHUAN',
        maKhoa: item?.khoa?.maKhoa || khoas[0]?.maKhoa || ''
      });
    } else if (activeTab === 'lop') {
      setFormData({
        maLop: item?.maLop || '',
        tenLop: item?.tenLop || '',
        khoaHoc: item?.khoaHoc || 'K23 (2023-2027)',
        maKhoa: item?.khoa?.maKhoa || khoas[0]?.maKhoa || '',
        maNganh: item?.nganh?.maNganh || nganhs[0]?.maNganh || ''
      });
    } else if (activeTab === 'hoc-ky') {
      setFormData({
        maHocKy: item?.maHocKy || '',
        namHoc: item?.namHoc || '2025-2026',
        tenHocKy: item?.tenHocKy || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (activeTab === 'khoa') {
        if (editingItem) {
          await axiosClient.put(`/api/common/danh-muc/khoa/${editingItem.maKhoa}`, formData);
        } else {
          await axiosClient.post('/api/common/danh-muc/khoa', formData);
        }
      } else if (activeTab === 'nganh') {
        if (editingItem) {
          await axiosClient.put(`/api/common/danh-muc/nganh/${editingItem.maNganh}`, formData);
        } else {
          await axiosClient.post(`/api/common/danh-muc/nganh?maKhoa=${formData.maKhoa}`, formData);
        }
      } else if (activeTab === 'lop') {
        if (editingItem) {
          await axiosClient.put(`/api/common/danh-muc/lop/${editingItem.maLop}`, formData);
        } else {
          await axiosClient.post(`/api/common/danh-muc/lop?maKhoa=${formData.maKhoa}&maNganh=${formData.maNganh}`, formData);
        }
      } else if (activeTab === 'hoc-ky') {
        if (editingItem) {
          await axiosClient.put(`/api/common/danh-muc/hoc-ky/${editingItem.maHocKy}`, formData);
        } else {
          await axiosClient.post('/api/common/danh-muc/hoc-ky', formData);
        }
      }
      setIsModalOpen(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      try {
        await axiosClient.delete(`/api/common/danh-muc/${activeTab}/${id}`);
        fetchAll();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể xóa mục');
      }
    }
  };

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '-';
    return Number(val).toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Danh mục Đào tạo</h1>
          <p className="text-sm text-slate-500 mt-1">
            Cơ cấu tổ chức Khoa, Ngành học, Lớp sinh hoạt và Niên khóa / Học kỳ (Đồng bộ chuẩn Thymeleaf)
          </p>
        </div>
        {activeTab !== 'mon-hoc' && activeTab !== 'ctdt' && (
          <button
            onClick={() => handleOpenModal()}
            className="ou-btn-primary text-sm shadow-md"
          >
            <Plus className="w-4 h-4" /> Thêm mới {activeTab === 'khoa' ? 'Khoa' : activeTab === 'nganh' ? 'Ngành' : activeTab === 'lop' ? 'Lớp' : 'Học kỳ'}
          </button>
        )}
      </div>

      {/* 6 Tabs in Exact Thymeleaf Order with Pill Design */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('khoa')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
            activeTab === 'khoa'
              ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4" /> Khoa ({khoas.length})
        </button>

        <button
          onClick={() => setActiveTab('nganh')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
            activeTab === 'nganh'
              ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Ngành học ({nganhs.length})
        </button>

        <button
          onClick={() => setActiveTab('lop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
            activeTab === 'lop'
              ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" /> Lớp sinh hoạt ({lops.length})
        </button>

        <button
          onClick={() => setActiveTab('hoc-ky')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
            activeTab === 'hoc-ky'
              ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" /> Học kỳ / Niên khóa ({hocKys.length})
        </button>

        <button
          onClick={() => setActiveTab('mon-hoc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
            activeTab === 'mon-hoc'
              ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Danh mục Môn học ({monHocs.length})
        </button>

        <button
          onClick={() => setActiveTab('ctdt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
            activeTab === 'ctdt'
              ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Network className="w-4 h-4" /> Khung CTĐT Chuẩn (QĐ 561)
        </button>
      </div>

      {/* Content Tables */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* Tab 1: Khoa */}
          {activeTab === 'khoa' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="ou-table-header">
                <tr>
                  <th className="px-5 py-3.5 w-40">Mã Khoa</th>
                  <th className="px-5 py-3.5">Tên Khoa</th>
                  <th className="px-5 py-3.5 text-right w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {khoas.map((k) => (
                  <tr key={k.maKhoa} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{k.maKhoa}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{k.tenKhoa}</td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenModal(k)}
                        className="p-1.5 rounded-lg border border-slate-200 text-primary-700 hover:bg-primary-50 cursor-pointer transition-colors"
                        title="Sửa Khoa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(k.maKhoa)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Xóa Khoa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Tab 2: Nganh */}
          {activeTab === 'nganh' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="ou-table-header">
                <tr>
                  <th className="px-5 py-3.5 w-36">Mã Ngành</th>
                  <th className="px-5 py-3.5">Tên Ngành Đào tạo</th>
                  <th className="px-5 py-3.5 w-36">Hệ đào tạo</th>
                  <th className="px-5 py-3.5">Trực thuộc Khoa</th>
                  <th className="px-5 py-3.5 text-right w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {nganhs.map((n) => (
                  <tr key={n.maNganh} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{n.maNganh}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{n.tenNganh}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {n.heDaoTao || 'CHUAN'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{n.khoa?.tenKhoa || '-'}</td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenModal(n)}
                        className="p-1.5 rounded-lg border border-slate-200 text-primary-700 hover:bg-primary-50 cursor-pointer transition-colors"
                        title="Sửa Ngành"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(n.maNganh)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Xóa Ngành"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Tab 3: Lop */}
          {activeTab === 'lop' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="ou-table-header">
                <tr>
                  <th className="px-5 py-3.5 w-36">Mã Lớp</th>
                  <th className="px-5 py-3.5">Tên Lớp Sinh Hoạt</th>
                  <th className="px-5 py-3.5 w-40">Khóa học</th>
                  <th className="px-5 py-3.5">Khoa / Ngành</th>
                  <th className="px-5 py-3.5 text-right w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {lops.map((l) => (
                  <tr key={l.maLop} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{l.maLop}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{l.tenLop}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">{l.khoaHoc}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">{l.khoa?.tenKhoa}</div>
                      <div className="text-slate-400">{l.nganh?.tenNganh}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenModal(l)}
                        className="p-1.5 rounded-lg border border-slate-200 text-primary-700 hover:bg-primary-50 cursor-pointer transition-colors"
                        title="Sửa Lớp"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(l.maLop)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Xóa Lớp"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Tab 4: Hoc Ky */}
          {activeTab === 'hoc-ky' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="ou-table-header">
                <tr>
                  <th className="px-5 py-3.5 w-48">Mã Học Kỳ</th>
                  <th className="px-5 py-3.5">Tên Học Kỳ</th>
                  <th className="px-5 py-3.5 w-40">Năm Học</th>
                  <th className="px-5 py-3.5 text-right w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {hocKys.map((h) => (
                  <tr key={h.maHocKy} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{h.maHocKy}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{h.tenHocKy}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {h.namHoc}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenModal(h)}
                        className="p-1.5 rounded-lg border border-slate-200 text-primary-700 hover:bg-primary-50 cursor-pointer transition-colors"
                        title="Sửa Học kỳ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(h.maHocKy)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Xóa Học kỳ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Tab 5: Mon Hoc */}
          {activeTab === 'mon-hoc' && (
            <div>
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center px-5">
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary-700" />
                  Danh mục Môn học theo Chương trình đào tạo Quyết định 561/QĐ-ĐHM
                </div>
                <span className="px-3 py-1 bg-primary-700 text-white rounded-full text-xs font-semibold shadow-xs">
                  {monHocs.length} Môn học
                </span>
              </div>
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="ou-table-header">
                  <tr>
                    <th className="px-5 py-3.5 w-32">Mã Môn</th>
                    <th className="px-5 py-3.5">Tên Môn học</th>
                    <th className="px-5 py-3.5 text-center w-28">Số Tín chỉ</th>
                    <th className="px-5 py-3.5 text-center w-28">Lý thuyết</th>
                    <th className="px-5 py-3.5 text-center w-28">Thực hành</th>
                    <th className="px-5 py-3.5 text-right w-36">Đơn giá / 1 TC</th>
                    <th className="px-5 py-3.5 w-28">Khoa quản lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {monHocs.map((m) => (
                    <tr key={m.maMon} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{m.maMon}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">{m.tenMon}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">{m.soTinChi}</td>
                      <td className="px-5 py-3.5 text-center text-xs text-slate-600">{m.soTietLyThuyet ? `${m.soTietLyThuyet} tiết` : '-'}</td>
                      <td className="px-5 py-3.5 text-center text-xs text-slate-600">{m.soTietThucHanh ? `${m.soTietThucHanh} tiết` : '-'}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold text-primary-700">{formatCurrency(m.donGiaTinChi)}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {m.maKhoa || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 6: CTDT */}
          {activeTab === 'ctdt' && (
            <div className="space-y-4 p-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                  <Filter className="w-4 h-4 text-primary-700" /> Chọn Ngành Đào tạo:
                </div>
                <select
                  value={selectedNganh}
                  onChange={(e) => setSelectedNganh(e.target.value)}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500"
                >
                  {nganhs.map((n) => (
                    <option key={n.maNganh} value={n.maNganh}>
                      {n.tenNganh} ({n.maNganh})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 font-medium ml-auto">
                  Khung Kế hoạch Đào tạo Chuẩn 11 Học kỳ - Quyết định 561/QĐ-ĐHM
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="ou-table-header">
                    <tr>
                      <th className="px-5 py-3.5 text-center w-36">Học kỳ Gợi ý</th>
                      <th className="px-5 py-3.5 w-32">Mã Môn</th>
                      <th className="px-5 py-3.5">Tên Môn học</th>
                      <th className="px-5 py-3.5 text-center w-24">Tín chỉ</th>
                      <th className="px-5 py-3.5 w-32">Loại Học phần</th>
                      <th className="px-5 py-3.5 w-32">Hệ Đào tạo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {curriculums.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 text-center font-bold text-primary-700 font-mono">
                          Học kỳ {c.hocKyGoiY}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-800">{c.maMon}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-800">{c.tenMon}</td>
                        <td className="px-5 py-3.5 text-center font-bold text-slate-800">{c.soTinChi}</td>
                        <td className="px-5 py-3.5">
                          {c.loaiHocPhan === 'BAT_BUOC' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Bắt buộc
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              Tự chọn
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {c.heDaoTao || 'CHUAN'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal CRUD */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Chỉnh sửa ${activeTab.toUpperCase()}` : `Thêm mới ${activeTab.toUpperCase()}`}
      >
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'khoa' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Khoa (Viết tắt/Tiếng Anh)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={formData.maKhoa || ''}
                  onChange={(e) => setFormData({ ...formData, maKhoa: e.target.value })}
                  placeholder="VD: IT, BA, ACC"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 font-mono text-uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Khoa</label>
                <input
                  type="text"
                  required
                  value={formData.tenKhoa || ''}
                  onChange={(e) => setFormData({ ...formData, tenKhoa: e.target.value })}
                  placeholder="VD: Khoa Công nghệ Thông tin"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </>
          )}

          {activeTab === 'nganh' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trực thuộc Khoa</label>
                <select
                  value={formData.maKhoa || ''}
                  onChange={(e) => setFormData({ ...formData, maKhoa: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  {khoas.map((k) => (
                    <option key={k.maKhoa} value={k.maKhoa}>
                      {k.tenKhoa} ({k.maKhoa})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Ngành (Viết tắt/Tiếng Anh)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={formData.maNganh || ''}
                  onChange={(e) => setFormData({ ...formData, maNganh: e.target.value })}
                  placeholder="VD: CS, SE, IT, BA"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 font-mono text-uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Ngành Đào tạo</label>
                <input
                  type="text"
                  required
                  value={formData.tenNganh || ''}
                  onChange={(e) => setFormData({ ...formData, tenNganh: e.target.value })}
                  placeholder="VD: Khoa học Máy tính"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hệ đào tạo</label>
                <select
                  value={formData.heDaoTao || 'CHUAN'}
                  onChange={(e) => setFormData({ ...formData, heDaoTao: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                >
                  <option value="CHUAN">Chuẩn (Đại trà)</option>
                  <option value="CHAT_LUONG_CAO">Chất lượng cao</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'lop' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khoa</label>
                  <select
                    value={formData.maKhoa || ''}
                    onChange={(e) => setFormData({ ...formData, maKhoa: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  >
                    {khoas.map((k) => (
                      <option key={k.maKhoa} value={k.maKhoa}>
                        {k.tenKhoa}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngành</label>
                  <select
                    value={formData.maNganh || ''}
                    onChange={(e) => setFormData({ ...formData, maNganh: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                  >
                    {nganhs.map((n) => (
                      <option key={n.maNganh} value={n.maNganh}>
                        {n.tenNganh}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Lớp</label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={formData.maLop || ''}
                  onChange={(e) => setFormData({ ...formData, maLop: e.target.value })}
                  placeholder="VD: DH23CS01, DH23IT02"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 font-mono text-uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Lớp Sinh Hoạt</label>
                <input
                  type="text"
                  required
                  value={formData.tenLop || ''}
                  onChange={(e) => setFormData({ ...formData, tenLop: e.target.value })}
                  placeholder="VD: ĐH Khoa học Máy tính 2023 - Lớp 01"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khóa học</label>
                <input
                  type="text"
                  value={formData.khoaHoc || ''}
                  onChange={(e) => setFormData({ ...formData, khoaHoc: e.target.value })}
                  placeholder="VD: K23 (2023-2027)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </>
          )}

          {activeTab === 'hoc-ky' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Học Kỳ</label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={formData.maHocKy || ''}
                  onChange={(e) => setFormData({ ...formData, maHocKy: e.target.value })}
                  placeholder="VD: HK1_2025_2026"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100 font-mono text-uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Học Kỳ</label>
                <input
                  type="text"
                  required
                  value={formData.tenHocKy || ''}
                  onChange={(e) => setFormData({ ...formData, tenHocKy: e.target.value })}
                  placeholder="VD: Học kỳ 1 (2025-2026)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Năm Học</label>
                <input
                  type="text"
                  required
                  value={formData.namHoc || ''}
                  onChange={(e) => setFormData({ ...formData, namHoc: e.target.value })}
                  placeholder="VD: 2025-2026"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>
            </>
          )}

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
              className="ou-btn-primary text-sm shadow-md"
            >
              {editingItem ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
