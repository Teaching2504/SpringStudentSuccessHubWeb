import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus } from 'lucide-react';
import { sortSemesters } from '../../utils/semesterSort';
import EvidenceHistoryTable from './components/EvidenceHistoryTable';
import SubmitEvidenceModal from './components/SubmitEvidenceModal';

const SubmitEvidence = () => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tenHoatDong: '', diemDeXuat: 5, moTa: '', fileUrl: '', maHocKy: '' });
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
        if (sorted.length > 0) setFormData(prev => ({ ...prev, maHocKy: sorted[sorted.length - 1].maHocKy }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setError('');
    setMsg('');
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
    const file = e.target.files?.[0];
    if (!file) return;
    const fData = new FormData();
    fData.append('file', file);
    try {
      setUploading(true);
      const res = await axiosClient.post('/api/common/upload', fData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) setFormData(prev => ({ ...prev, fileUrl: res.data.data.url }));
    } catch (err) {
      setError('Lỗi tải tệp lên server');
    } finally {
      setUploading(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nộp & Quản lý Minh chứng Hoạt động Rèn luyện</h1>
          <p className="text-sm text-slate-500 mt-1">Gửi giấy xác nhận tham gia sự kiện, hoạt động tình nguyện, cuộc thi NCKH để cán bộ khoa xét cộng điểm ĐRL</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nộp Minh chứng mới
        </button>
      </div>

      <EvidenceHistoryTable evidenceList={evidenceList} loading={loading} />

      <SubmitEvidenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        msg={msg}
        error={error}
        formData={formData}
        setFormData={setFormData}
        hocKys={hocKys}
        uploading={uploading}
        onFileUpload={handleFileUpload}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SubmitEvidence;
