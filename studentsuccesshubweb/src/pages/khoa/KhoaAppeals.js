import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { MessageSquare, CheckCircle, XCircle, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const KhoaAppeals = () => {
  const { user } = useAuth();
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Modal Resolve Appeal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [actionForm, setActionForm] = useState({ accept: true, phanHoi: '' });

  const maKhoa = user?.maKhoa || 'IT';

  useEffect(() => {
    fetchAppeals();
  }, [maKhoa, statusFilter]);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('maKhoa', maKhoa);
      if (statusFilter) params.append('trangThai', statusFilter);

      const res = await axiosClient.get(`/api/khoa/kien-nghi?${params.toString()}`);
      if (res.data.success) {
        setAppeals(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = (appeal, accept) => {
    setSelectedAppeal(appeal);
    setActionForm({
      accept,
      phanHoi: accept ? 'Khoa đã tiếp nhận và cập nhật lại điểm/xếp hạng cho sinh viên.' : 'Kiến nghị không có cơ sở thay đổi kết quả.'
    });
    setIsModalOpen(true);
  };

  const handleExecuteAction = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post(`/api/khoa/kien-nghi/${selectedAppeal.maKienNghi}/resolve`, actionForm);
      setIsModalOpen(false);
      alert(res.data.message);
      fetchAppeals();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xử lý kiến nghị');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Xử lý Khiếu nại / Kiến nghị Điểm & Học bổng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Giải quyết khiếu nại của sinh viên trong thời hạn công bố danh sách dự kiến
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option value="">-- Tất cả trạng thái --</option>
            <option value="CHO_XU_LY">Chờ xử lý</option>
            <option value="DA_CHAP_NHAN">Đã chấp nhận (Điều chỉnh)</option>
            <option value="DA_TU_CHOI">Đã từ chối</option>
          </select>
        </div>
      </div>

      {/* Appeals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Sinh viên</th>
                <th className="px-5 py-3.5">Nội dung kiến nghị</th>
                <th className="px-5 py-3.5">Minh chứng đính kèm</th>
                <th className="px-5 py-3.5">Ngày gửi</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5">Kết quả phản hồi</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Đang tải danh sách kiến nghị...
                  </td>
                </tr>
              ) : appeals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Không có kiến nghị nào cần xử lý
                  </td>
                </tr>
              ) : (
                appeals.map((kn) => (
                  <tr key={kn.maKienNghi} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div>{kn.hoTenSinhVien}</div>
                      <div className="text-xs font-mono text-primary-700">{kn.mssv} - {kn.maLop}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-sm">
                      <p className="text-slate-800 text-xs">{kn.noiDung}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {kn.tepMinhChung ? (
                        <a
                          href={kn.tepMinhChung}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Xem minh chứng
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Không đính kèm</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{kn.ngayGui}</td>
                    <td className="px-5 py-3.5">
                      {kn.trangThai === 'CHO_XU_LY' && (
                        <Badge variant="amber">
                          <Clock className="w-3 h-3 inline mr-1" /> Chờ xử lý
                        </Badge>
                      )}
                      {kn.trangThai === 'DA_CHAP_NHAN' && <Badge variant="emerald">Chấp nhận</Badge>}
                      {kn.trangThai === 'DA_TU_CHOI' && <Badge variant="rose">Từ chối</Badge>}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                      {kn.phanHoi || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {kn.trangThai === 'CHO_XU_LY' ? (
                        <>
                          <button
                            onClick={() => handleOpenModal(kn, true)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                          >
                            Chấp nhận
                          </button>
                          <button
                            onClick={() => handleOpenModal(kn, false)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Từ chối
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Đã trả lời</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={actionForm.accept ? 'Chấp nhận kiến nghị & Giải quyết' : 'Từ chối kiến nghị của sinh viên'}
      >
        <form onSubmit={handleExecuteAction} className="space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p>
              Sinh viên: <strong>{selectedAppeal?.hoTenSinhVien}</strong> (MSSV: {selectedAppeal?.mssv})
            </p>
            <p>
              Nội dung khiếu nại: <em>"{selectedAppeal?.noiDung}"</em>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phản hồi chính thức của Khoa đến Sinh viên (bắt buộc)
            </label>
            <textarea
              rows="4"
              required
              value={actionForm.phanHoi}
              onChange={(e) => setActionForm({ ...actionForm, phanHoi: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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
              className={`px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer ${
                actionForm.accept
                  ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                  : 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/20'
              }`}
            >
              {actionForm.accept ? 'Xác nhận Chấp nhận' : 'Xác nhận Từ chối'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KhoaAppeals;
