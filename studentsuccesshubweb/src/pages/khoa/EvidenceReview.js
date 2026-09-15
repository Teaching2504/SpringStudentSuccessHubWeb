import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { FileText, CheckCircle, XCircle, ExternalLink, Clock } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Sinh viên</th>
                <th className="px-5 py-3.5">Tên hoạt động / Hoạt cảnh</th>
                <th className="px-5 py-3.5 text-center">Điểm đề xuất</th>
                <th className="px-5 py-3.5">Tệp đính kèm</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5">Phản hồi</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Đang tải danh sách minh chứng...</td></tr>
              ) : evidenceList.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Không có minh chứng rèn luyện nào</td></tr>
              ) : (
                evidenceList.map((mc) => (
                  <tr key={mc.maMinhChung} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div>{mc.hoTenSinhVien}</div>
                      <div className="text-xs font-mono text-primary-700">{mc.mssv} - {mc.maLop}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-semibold text-slate-800">{mc.tenHoatDong}</div>
                      <div className="text-xs text-slate-500 truncate">{mc.moTa}</div>
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-emerald-700">+{mc.diemDeXuat || 0} đ</td>
                    <td className="px-5 py-3.5">
                      {mc.fileUrl ? (
                        <a href={mc.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 underline">
                          <ExternalLink className="w-3.5 h-3.5" /> Xem tài liệu
                        </a>
                      ) : <span className="text-xs text-slate-400">Không có file</span>}
                    </td>
                    <td className="px-5 py-3.5"><Badge status={mc.trangThai} /></td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">{mc.lyDoPhanHoi || '-'}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {mc.trangThai === 'CHO_DUYET' ? (
                        <>
                          <button onClick={() => handleOpenReviewModal(mc, true)} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer">
                            Duyệt (+Điểm)
                          </button>
                          <button onClick={() => handleOpenReviewModal(mc, false)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer">
                            Từ chối
                          </button>
                        </>
                      ) : <span className="text-xs text-slate-400">Đã xử lý</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={reviewAction.approve ? 'Phê duyệt Minh chứng Rèn luyện' : 'Từ chối Minh chứng'}>
        <form onSubmit={handleExecuteReview} className="space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p>Sinh viên: <strong>{selectedEvidence?.hoTenSinhVien}</strong> (MSSV: {selectedEvidence?.mssv})</p>
            <p>Hoạt động: <strong>{selectedEvidence?.tenHoatDong}</strong></p>
            <p>Điểm đề xuất cộng: <strong className="text-emerald-700">+{selectedEvidence?.diemDeXuat} điểm</strong></p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {reviewAction.approve ? 'Lời nhắn / Ghi chú phê duyệt' : 'Lý do từ chối (bắt buộc)'}
            </label>
            <textarea
              rows="3"
              required
              value={reviewAction.lyDo}
              onChange={(e) => setReviewAction({ ...reviewAction, lyDo: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">Hủy</button>
            <button type="submit" className={`px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer ${reviewAction.approve ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'}`}>
              {reviewAction.approve ? 'Xác nhận Duyệt & Cộng điểm' : 'Xác nhận Từ chối'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EvidenceReview;
