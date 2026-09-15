import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import EvidenceTable from './components/EvidenceTable';
import EvidenceReviewModal from './components/EvidenceReviewModal';

const EvidenceReview = () => {
  const { user } = useAuth();
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [reviewAction, setReviewAction] = useState({ approve: true, lyDo: '' });

  const maKhoa = user?.maKhoa || 'IT';

  useEffect(() => { fetchEvidence(); }, [maKhoa, statusFilter]);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('maKhoa', maKhoa);
      if (statusFilter) params.append('trangThai', statusFilter);
      const res = await axiosClient.get(`/api/khoa/minh-chung?${params.toString()}`);
      if (res.data.success) setEvidenceList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (mc, approve) => {
    setSelectedEvidence(mc);
    setReviewAction({
      approve,
      lyDo: approve ? `Minh chứng hợp lệ, cộng ${mc.diemDeXuat || 5} điểm Rèn luyện` : 'Không đủ minh chứng hợp lệ'
    });
    setIsModalOpen(true);
  };

  const handleExecuteReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post(`/api/khoa/minh-chung/${selectedEvidence.maMinhChung}/review`, {
        approve: reviewAction.approve,
        lyDo: reviewAction.lyDo
      });
      setIsModalOpen(false);
      alert(res.data.message);
      fetchEvidence();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xử lý minh chứng');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Phê duyệt Minh chứng Rèn luyện Sinh viên</h1>
          <p className="text-sm text-slate-500 mt-1">Xem xét tài liệu hoạt động ngoại khóa, NCKH, phong trào tình nguyện và duyệt cộng điểm ĐRL</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="CHO_DUYET">Chờ phê duyệt</option>
          <option value="DA_DUYET">Đã duyệt (Đã cộng điểm)</option>
          <option value="TU_CHOI">Đã từ chối</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng minh chứng', count: evidenceList.length, sub: 'Toàn bộ hồ sơ hoạt động', bg: 'bg-blue-50/80 border-blue-200/80 text-blue-800', txt: 'text-slate-800', icon: <FileText className="w-4 h-4" />, iconBg: 'bg-blue-100 text-blue-700' },
          { label: 'Chờ phê duyệt', count: evidenceList.filter(m => m.trangThai === 'CHO_DUYET').length, sub: 'Cần thẩm định & cộng điểm', bg: 'bg-amber-50/80 border-amber-200/80 text-amber-800', txt: 'text-amber-900', icon: <Clock className="w-4 h-4" />, iconBg: 'bg-amber-100 text-amber-700' },
          { label: 'Đã phê duyệt', count: evidenceList.filter(m => m.trangThai === 'DA_DUYET').length, sub: 'Đã cộng vào điểm ĐRL kỳ', bg: 'bg-emerald-50/80 border-emerald-200/80 text-emerald-800', txt: 'text-emerald-900', icon: <CheckCircle className="w-4 h-4" />, iconBg: 'bg-emerald-100 text-emerald-700' },
          { label: 'Đã từ chối', count: evidenceList.filter(m => m.trangThai === 'TU_CHOI').length, sub: 'Không đủ điều kiện minh chứng', bg: 'bg-rose-50/80 border-rose-200/80 text-rose-800', txt: 'text-rose-900', icon: <XCircle className="w-4 h-4" />, iconBg: 'bg-rose-100 text-rose-700' },
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

      <EvidenceTable evidenceList={evidenceList} loading={loading} onOpenReviewModal={handleOpenReviewModal} />

      <EvidenceReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEvidence={selectedEvidence}
        reviewAction={reviewAction}
        setReviewAction={setReviewAction}
        onSubmit={handleExecuteReview}
      />
    </div>
  );
};

export default EvidenceReview;
