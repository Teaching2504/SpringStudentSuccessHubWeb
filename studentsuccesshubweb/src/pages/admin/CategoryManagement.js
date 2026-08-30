import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Building, BookOpen, Layers, Calendar, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { sortSemesters } from '../../utils/semesterSort';

const CategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('khoa'); // khoa, nganh, lop, hoc-ky
  const [khoas, setKhoas] = useState([]);
  const [nganhs, setNganhs] = useState([]);
  const [lops, setLops] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [rKhoa, rNganh, rLop, rHk] = await Promise.all([
        axiosClient.get('/api/common/danh-muc/khoa'),
        axiosClient.get('/api/common/danh-muc/nganh'),
        axiosClient.get('/api/common/danh-muc/lop'),
        axiosClient.get('/api/common/danh-muc/hoc-ky')
      ]);

      if (rKhoa.data.success) setKhoas(rKhoa.data.data);
      if (rNganh.data.success) setNganhs(rNganh.data.data);
      if (rLop.data.success) setLops(rLop.data.data);
      if (rHk.data.success) setHocKys(sortSemesters(rHk.data.data));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Danh mục Đào tạo</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản trị các đơn vị Khoa, Ngành học, Lớp sinh hoạt và Niên khóa / Học kỳ
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Thêm mới {activeTab.toUpperCase()}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('khoa')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
            activeTab === 'khoa'
              ? 'border-primary-600 text-primary-700 bg-white rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building className="w-4 h-4" /> Khoa ({khoas.length})
        </button>

        <button
          onClick={() => setActiveTab('nganh')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
            activeTab === 'nganh'
              ? 'border-primary-600 text-primary-700 bg-white rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Ngành học ({nganhs.length})
        </button>

        <button
          onClick={() => setActiveTab('lop')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
            activeTab === 'lop'
              ? 'border-primary-600 text-primary-700 bg-white rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" /> Lớp sinh hoạt ({lops.length})
        </button>

        <button
          onClick={() => setActiveTab('hoc-ky')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
            activeTab === 'hoc-ky'
              ? 'border-primary-600 text-primary-700 bg-white rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" /> Học kỳ / Niên khóa ({hocKys.length})
        </button>
      </div>

      {/* Content Tables */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'khoa' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Mã Khoa</th>
                  <th className="px-5 py-3.5">Tên Khoa</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {khoas.map((k) => (
                  <tr key={k.maKhoa} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{k.maKhoa}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{k.tenKhoa}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(k)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(k.maKhoa)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'nganh' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Mã Ngành</th>
                  <th className="px-5 py-3.5">Tên Ngành</th>
                  <th className="px-5 py-3.5">Trực thuộc Khoa</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {nganhs.map((n) => (
                  <tr key={n.maNganh} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{n.maNganh}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{n.tenNganh}</td>
                    <td className="px-5 py-3.5 text-slate-600">{n.khoa?.tenKhoa || '-'}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(n)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(n.maNganh)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'lop' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Mã Lớp</th>
                  <th className="px-5 py-3.5">Tên Lớp Sinh Hoạt</th>
                  <th className="px-5 py-3.5">Khóa học</th>
                  <th className="px-5 py-3.5">Khoa / Ngành</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {lops.map((l) => (
                  <tr key={l.maLop} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{l.maLop}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{l.tenLop}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{l.khoaHoc}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <div>{l.khoa?.tenKhoa}</div>
                      <div className="text-slate-400">{l.nganh?.tenNganh}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(l)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(l.maLop)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'hoc-ky' && (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Mã Học Kỳ</th>
                  <th className="px-5 py-3.5">Tên Học Kỳ</th>
                  <th className="px-5 py-3.5">Năm Học</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {hocKys.map((h) => (
                  <tr key={h.maHocKy} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{h.maHocKy}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{h.tenHocKy}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 font-semibold">{h.namHoc}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(h)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(h.maHocKy)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Khoa</label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={formData.maKhoa || ''}
                  onChange={(e) => setFormData({ ...formData, maKhoa: e.target.value })}
                  placeholder="VD: CNTT, QTKD"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Ngành</label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={formData.maNganh || ''}
                  onChange={(e) => setFormData({ ...formData, maNganh: e.target.value })}
                  placeholder="VD: KHMT, KTPM"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Ngành</label>
                <input
                  type="text"
                  required
                  value={formData.tenNganh || ''}
                  onChange={(e) => setFormData({ ...formData, tenNganh: e.target.value })}
                  placeholder="VD: Kỹ thuật Phần mềm"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
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
                  placeholder="VD: DH23IT01"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Lớp</label>
                <input
                  type="text"
                  required
                  value={formData.tenLop || ''}
                  onChange={(e) => setFormData({ ...formData, tenLop: e.target.value })}
                  placeholder="VD: Đại học CNTT 2023 - Lớp 1"
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
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100"
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
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
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
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-medium shadow-md shadow-primary-700/20 transition cursor-pointer"
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
