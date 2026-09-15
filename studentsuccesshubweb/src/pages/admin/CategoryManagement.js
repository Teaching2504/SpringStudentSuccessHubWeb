import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Building, BookOpen, Layers, Calendar, Plus, GraduationCap, Network } from 'lucide-react';
import { sortSemesters } from '../../utils/semesterSort';
import CategoryTables from './components/CategoryTables';
import CategoryModal from './components/CategoryModal';

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('khoa');
  const [khoas, setKhoas] = useState([]);
  const [nganhs, setNganhs] = useState([]);
  const [lops, setLops] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [selectedNganh, setSelectedNganh] = useState('CS');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurriculum = async (maNganh) => {
    try {
      const res = await axiosClient.get(`/api/common/danh-muc/curriculum/${maNganh}`);
      if (res.data.success) setCurriculums(res.data.data);
    } catch (err) {
      console.error('Lỗi tải CTĐT', err);
    }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { if (activeTab === 'ctdt') fetchCurriculum(selectedNganh); }, [selectedNganh, activeTab]);

  const handleOpenModal = (item = null) => {
    setError('');
    setEditingItem(item);
    if (activeTab === 'khoa') {
      setFormData({ maKhoa: item?.maKhoa || '', tenKhoa: item?.tenKhoa || '' });
    } else if (activeTab === 'nganh') {
      setFormData({ maNganh: item?.maNganh || '', tenNganh: item?.tenNganh || '', heDaoTao: item?.heDaoTao || 'CHUAN', maKhoa: item?.khoa?.maKhoa || khoas[0]?.maKhoa || '' });
    } else if (activeTab === 'lop') {
      setFormData({ maLop: item?.maLop || '', tenLop: item?.tenLop || '', khoaHoc: item?.khoaHoc || 'K23 (2023-2027)', maKhoa: item?.khoa?.maKhoa || khoas[0]?.maKhoa || '', maNganh: item?.nganh?.maNganh || nganhs[0]?.maNganh || '' });
    } else if (activeTab === 'hoc-ky') {
      setFormData({ maHocKy: item?.maHocKy || '', namHoc: item?.namHoc || '2025-2026', tenHocKy: item?.tenHocKy || '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (activeTab === 'khoa') {
        editingItem ? await axiosClient.put(`/api/common/danh-muc/khoa/${editingItem.maKhoa}`, formData) : await axiosClient.post('/api/common/danh-muc/khoa', formData);
      } else if (activeTab === 'nganh') {
        editingItem ? await axiosClient.put(`/api/common/danh-muc/nganh/${editingItem.maNganh}`, formData) : await axiosClient.post(`/api/common/danh-muc/nganh?maKhoa=${formData.maKhoa}`, formData);
      } else if (activeTab === 'lop') {
        editingItem ? await axiosClient.put(`/api/common/danh-muc/lop/${editingItem.maLop}`, formData) : await axiosClient.post(`/api/common/danh-muc/lop?maKhoa=${formData.maKhoa}&maNganh=${formData.maNganh}`, formData);
      } else if (activeTab === 'hoc-ky') {
        editingItem ? await axiosClient.put(`/api/common/danh-muc/hoc-ky/${editingItem.maHocKy}`, formData) : await axiosClient.post('/api/common/danh-muc/hoc-ky', formData);
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

  const tabs = [
    { id: 'khoa', label: `Khoa (${khoas.length})`, icon: Building },
    { id: 'nganh', label: `Ngành học (${nganhs.length})`, icon: BookOpen },
    { id: 'lop', label: `Lớp sinh hoạt (${lops.length})`, icon: Layers },
    { id: 'hoc-ky', label: `Học kỳ / Niên khóa (${hocKys.length})`, icon: Calendar },
    { id: 'mon-hoc', label: `Danh mục Môn học (${monHocs.length})`, icon: GraduationCap },
    { id: 'ctdt', label: 'Khung CTĐT Chuẩn (QĐ 561)', icon: Network },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Danh mục Đào tạo</h1>
          <p className="text-sm text-slate-500 mt-1">Cơ cấu tổ chức Khoa, Ngành học, Lớp sinh hoạt và Niên khóa / Học kỳ (Đồng bộ chuẩn Thymeleaf)</p>
        </div>
        {!['mon-hoc', 'ctdt'].includes(activeTab) && (
          <button onClick={() => handleOpenModal()} className="ou-btn-primary text-sm shadow-md">
            <Plus className="w-4 h-4" /> Thêm mới {activeTab === 'khoa' ? 'Khoa' : activeTab === 'nganh' ? 'Ngành' : activeTab === 'lop' ? 'Lớp' : 'Học kỳ'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${active ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <CategoryTables
          activeTab={activeTab}
          khoas={khoas}
          nganhs={nganhs}
          lops={lops}
          hocKys={hocKys}
          monHocs={monHocs}
          curriculums={curriculums}
          selectedNganh={selectedNganh}
          setSelectedNganh={setSelectedNganh}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        error={error}
        khoas={khoas}
        nganhs={nganhs}
      />
    </div>
  );
};
export default CategoryManagement;
