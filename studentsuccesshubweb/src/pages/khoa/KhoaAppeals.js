import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import AppealTable from './components/AppealTable';
import AppealResolveModal from './components/AppealResolveModal';

const KhoaAppeals = () => {
  const { user } = useAuth();
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [actionForm, setActionForm] = useState({ accept: true, phanHoi: '', diemRenLuyenMoi: '' });

  const maKhoa = user?.maKhoa || 'IT';

  useEffect(() => { fetchAppeals(); }, [maKhoa, statusFilter]);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('maKhoa', maKhoa);
      if (statusFilter) params.append('trangThai', statusFilter);
      const res = await axiosClient.get(`/api/khoa/kien-nghi?${params.toString()}`);
      if (res.data.success) setAppeals(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (appeal, accept) => {
    setSelectedAppeal(appeal);
    setActionForm({
      accept,
      phanHoi: accept
        ? 'Khoa đã tiếp nhận minh chứng bổ sung, đồng ý điều chỉnh Điểm rèn luyện và cập nhật lại hồ sơ xét học bổng cho sinh viên.'
        : 'Kiến nghị không có đủ căn cứ điều chỉnh kết quả điểm rèn luyện / học bổng.',
      diemRenLuyenMoi: appeal.diemRenLuyenHienTai != null ? appeal.diemRenLuyenHienTai : ''
    });
    setIsModalOpen(true);
  };

  const getPreviewRank = (score) => {
    const num = parseFloat(score);
    if (isNaN(num)) return null;
    if (num >= 90) return { text: 'Xuất sắc', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (num >= 80) return { text: 'Tốt', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (num >= 65) return { text: 'Khá', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (num >= 50) return { text: 'Trung bình', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    return { text: 'Yếu', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  const getScholarshipPreview = (gpa, drlScore) => {
    const numDrl = parseFloat(drlScore);
    const numGpa = parseFloat(gpa);
    if (isNaN(numDrl) || isNaN(numGpa)) return null;
    if (numGpa >= 3.60 && numDrl >= 90) return { text: '🥇 Học bổng Xuất sắc (100% Học phí)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (numGpa >= 3.20 && numDrl >= 80) return { text: '🥈 Học bổng Giỏi (70% Học phí)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (numGpa >= 2.50 && numDrl >= 65) return { text: '🥉 Học bổng Khá (50% Học phí)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { text: 'Chưa đủ điều kiện đạt Học bổng', color: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  const handleExecuteAction = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        accept: actionForm.accept,
        phanHoi: actionForm.phanHoi,
        diemRenLuyenMoi: actionForm.accept && actionForm.diemRenLuyenMoi !== '' && !isNaN(actionForm.diemRenLuyenMoi) ? Number(actionForm.diemRenLuyenMoi) : null
      };
      const res = await axiosClient.post(`/api/khoa/kien-nghi/${selectedAppeal.maKienNghi}/resolve`, payload);
      setIsModalOpen(false);
      alert(res.data.message || 'Xử lý kiến nghị thành công!');
      fetchAppeals();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xử lý kiến nghị');
    }
  };

  const previewRank = actionForm.diemRenLuyenMoi ? getPreviewRank(actionForm.diemRenLuyenMoi) : null;
  const previewHb = (actionForm.diemRenLuyenMoi && selectedAppeal?.diemTrungBinhHienTai != null)
    ? getScholarshipPreview(selectedAppeal.diemTrungBinhHienTai, actionForm.diemRenLuyenMoi)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Xử lý Khiếu nại / Kiến nghị Điểm & Học bổng</h1>
          <p className="text-sm text-slate-500 mt-1">Giải quyết khiếu nại của sinh viên và điều chỉnh Điểm Rèn Luyện (ĐRL) theo yêu cầu phúc khảo</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="CHO_XU_LY">Chờ xử lý</option>
          <option value="DA_CHAP_NHAN">Đã chấp nhận (Điều chỉnh ĐRL)</option>
          <option value="DA_TU_CHOI">Đã từ chối</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng khiếu nại', count: appeals.length, sub: 'Toàn bộ hồ sơ kiến nghị', bg: 'bg-blue-50/80 border-blue-200/80 text-blue-800', txt: 'text-slate-800', icon: <MessageSquare className="w-4 h-4" />, iconBg: 'bg-blue-100 text-blue-700' },
          { label: 'Chờ xử lý', count: appeals.filter(a => a.trangThai === 'CHO_XU_LY').length, sub: 'Cần cán bộ khoa rà soát', bg: 'bg-amber-50/80 border-amber-200/80 text-amber-800', txt: 'text-amber-900', icon: <Clock className="w-4 h-4" />, iconBg: 'bg-amber-100 text-amber-700' },
          { label: 'Đã chấp nhận', count: appeals.filter(a => a.trangThai === 'DA_CHAP_NHAN').length, sub: 'Đã cập nhật lại kết quả & ĐRL', bg: 'bg-emerald-50/80 border-emerald-200/80 text-emerald-800', txt: 'text-emerald-900', icon: <CheckCircle className="w-4 h-4" />, iconBg: 'bg-emerald-100 text-emerald-700' },
          { label: 'Đã từ chối', count: appeals.filter(a => a.trangThai === 'DA_TU_CHOI').length, sub: 'Không đủ căn cứ điều chỉnh', bg: 'bg-rose-50/80 border-rose-200/80 text-rose-800', txt: 'text-rose-900', icon: <XCircle className="w-4 h-4" />, iconBg: 'bg-rose-100 text-rose-700' },
        ].map((c, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${c.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">{c.label}</span>
              <span className={`p-2 rounded-xl ${c.iconBg}`}>{c.icon}</span>
            </div>
            <p className={`text-2xl font-black mt-2 ${c.txt}`}>{c.count}</p>
            <span className="text-[11px] font-medium opacity-80">{c.sub}</span>
          </div>
        ))}
      </div>

      <AppealTable appeals={appeals} loading={loading} onOpenModal={handleOpenModal} />

      <AppealResolveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAppeal={selectedAppeal}
        actionForm={actionForm}
        setActionForm={setActionForm}
        previewRank={previewRank}
        previewHb={previewHb}
        onSubmit={handleExecuteAction}
      />
    </div>
  );
};

export default KhoaAppeals;
