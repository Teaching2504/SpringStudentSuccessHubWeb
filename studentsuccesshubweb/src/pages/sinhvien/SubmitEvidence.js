import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Upload, CheckCircle, Clock, ExternalLink, AlertCircle, Plus, FileText } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { sortSemesters } from '../../utils/semesterSort';

const SubmitEvidence = () => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenHoatDong: '',
    diemDeXuat: 5,
    moTa: '',
    fileUrl: '',
    maHocKy: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rMc, rHk] = await Promise.all([
        axiosClient.get('/api/sinhvien/minh-chung'),
        axiosClient.get('/api/common/danh-muc/hoc-ky')
      ]);

      if (rMc.data.success) setEvidenceList(rMc.data.data);
      if (rHk.data.success) {
        const sorted = sortSemesters(rHk.data.data);
        setHocKys(sorted);
        if (sorted.length > 0) {
          setFormData((prev) => ({ ...prev, maHocKy: sorted[sorted.length - 1].maHocKy }));
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setError('');
    setMsg('');
    setSelectedFile(null);
    setFormData({
      tenHoatDong: '',
      diemDeXuat: 5,
      moTa: '',
      fileUrl: '',
      maHocKy: hocKys[0]?.maHocKy || 'HK1_2025_2026'
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    const fData = new FormData();
    fData.append('file', file);

    try {
      setUploading(true);
      const res = await axiosClient.post('/api/common/upload', fData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploading(false);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, fileUrl: res.data.data.url }));
      }
    } catch (err) {
      setUploading(false);
      setError('Lỗi tải tệp lên server');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      const res = await axiosClient.post('/api/sinhvien/minh-chung', formData);
      if (res.data.success) {
        setMsg('Nộp minh chứng rèn luyện thành công!');
        fetchData();
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi nộp minh chứng');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Nộp & Quản lý Minh chứng Hoạt động Rèn luyện
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gửi giấy xác nhận tham gia sự kiện, hoạt động tình nguyện, cuộc thi NCKH để cán bộ khoa xét cộng điểm ĐRL
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nộp Minh chứng mới
        </button>
      </div>

      {/* Table of submitted evidence */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Học kỳ</th>
                <th className="px-5 py-3.5">Tên hoạt động / Hoạt cảnh</th>
                <th className="px-5 py-3.5 text-center">Điểm đề xuất</th>
                <th className="px-5 py-3.5">Tệp đính kèm</th>
                <th className="px-5 py-3.5">Ngày nộp</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5">Phản hồi của Khoa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Đang tải danh sách minh chứng...
                  </td>
                </tr>
              ) : evidenceList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Bạn chưa nộp minh chứng rèn luyện nào
                  </td>
                </tr>
              ) : (
                evidenceList.map((mc) => (
                  <tr key={mc.maMinhChung} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-xs text-primary-700 font-mono">
                      {mc.maHocKy}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-semibold text-slate-800">{mc.tenHoatDong}</div>
                      <div className="text-xs text-slate-500 truncate">{mc.moTa}</div>
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-emerald-700">
                      +{mc.diemDeXuat || 0} đ
                    </td>
                    <td className="px-5 py-3.5">
                      {mc.fileUrl ? (
                        <a
                          href={mc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Xem file
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Không có file</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{mc.ngayTao}</td>
                    <td className="px-5 py-3.5">
                      {mc.trangThai === 'CHO_DUYET' && <Badge variant="amber">Chờ duyệt</Badge>}
                      {mc.trangThai === 'DA_DUYET' && <Badge variant="emerald">Đã duyệt (+ĐRL)</Badge>}
                      {mc.trangThai === 'TU_CHOI' && <Badge variant="rose">Từ chối</Badge>}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                      {mc.lyDoPhanHoi || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Submit Evidence */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nộp Minh chứng Hoạt động Rèn luyện mới"
      >
        {msg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-medium">
            <CheckCircle className="w-4 h-4" /> {msg}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Học kỳ áp dụng</label>
            <select
              value={formData.maHocKy}
              onChange={(e) => setFormData({ ...formData, maHocKy: e.target.value })}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên hoạt động / Thành tích</label>
            <input
              type="text"
              required
              value={formData.tenHoatDong}
              onChange={(e) => setFormData({ ...formData, tenHoatDong: e.target.value })}
              placeholder="VD: Tham gia Cuộc thi Olympic Tin học Sinh viên OU 2025"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm rèn luyện đề xuất cộng</label>
            <input
              type="number"
              step="0.5"
              required
              value={formData.diemDeXuat}
              onChange={(e) => setFormData({ ...formData, diemDeXuat: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết hoạt động</label>
            <textarea
              rows="3"
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
              placeholder="Mô tả vai trò tham gia, giải thưởng đạt được..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tải lên File Giấy chứng nhận / Minh chứng (Ảnh, PDF)
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
            {uploading && <p className="text-xs text-primary-600 mt-1">Đang tải file lên server...</p>}
            {formData.fileUrl && (
              <p className="text-xs text-emerald-600 mt-1">
                ✓ File đã sẵn sàng: {formData.fileUrl}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 transition cursor-pointer"
            >
              Gửi Minh chứng
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubmitEvidence;
