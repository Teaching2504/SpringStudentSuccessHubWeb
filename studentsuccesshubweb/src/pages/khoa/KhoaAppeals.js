import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { MessageSquare, CheckCircle, XCircle, ExternalLink, Clock, Star } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Sinh viên</th>
                <th className="px-5 py-3.5">Nội dung kiến nghị</th>
                <th className="px-5 py-3.5 text-center">GPA / ĐRL hiện tại</th>
                <th className="px-5 py-3.5">Minh chứng</th>
                <th className="px-5 py-3.5 text-center">Trạng thái</th>
                <th className="px-5 py-3.5">Kết quả phản hồi</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Đang tải danh sách kiến nghị...</td></tr>
              ) : appeals.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Không có kiến nghị nào cần xử lý</td></tr>
              ) : (
                appeals.map((kn) => (
                  <tr key={kn.maKienNghi} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div className="font-bold">{kn.hoTenSinhVien}</div>
                      <div className="text-xs font-mono text-primary-700">{kn.mssv} {kn.maLop ? `(${kn.maLop})` : ''}</div>
                      <div className="text-[11px] text-slate-400">{kn.tenDot || kn.maHocKy}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-sm">
                      <p className="text-slate-800 text-xs font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">{kn.noiDung}</p>
                      <span className="text-[11px] text-slate-400 font-mono mt-1 block">Ngày gửi: {kn.ngayGui}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="font-bold text-primary-700">GPA: {kn.diemTrungBinhHienTai != null ? Number(kn.diemTrungBinhHienTai).toFixed(2) : '-'}</div>
                      <div className="text-xs font-semibold text-purple-700 mt-0.5">ĐRL: {kn.diemRenLuyenHienTai != null ? kn.diemRenLuyenHienTai : '-'} đ</div>
                    </td>
                    <td className="px-5 py-3.5">
                      {kn.tepMinhChung ? (
                        <a href={kn.tepMinhChung} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 underline">
                          <ExternalLink className="w-3.5 h-3.5" /> Xem file
                        </a>
                      ) : <span className="text-xs text-slate-400">Không đính kèm</span>}
                    </td>
                    <td className="px-5 py-3.5 text-center"><Badge status={kn.trangThai} /></td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs">
                      {kn.phanHoi ? (
                        <div>
                          <p className="line-clamp-2">{kn.phanHoi}</p>
                          {kn.hoTenNhanVien && <span className="text-[10px] text-slate-400 block mt-0.5">Bởi: {kn.hoTenNhanVien}</span>}
                        </div>
                      ) : <span className="text-slate-400 italic">Chưa phản hồi</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                      {kn.trangThai === 'CHO_XU_LY' ? (
                        <>
                          <button onClick={() => handleOpenModal(kn, true)} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer inline-flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Chấp nhận & Chỉnh ĐRL
                          </button>
                          <button onClick={() => handleOpenModal(kn, false)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Từ chối
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleOpenModal(kn, true)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer">
                          Cập nhật lại
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={actionForm.accept ? 'Xử lý Khiếu nại: Chấp nhận & Cập nhật Điểm Rèn Luyện' : 'Từ chối khiếu nại của sinh viên'} maxWidth="max-w-xl">
        <form onSubmit={handleExecuteAction} className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400">Sinh viên: </span>
                <strong className="text-slate-800 text-sm">{selectedAppeal?.hoTenSinhVien}</strong>
                <span className="font-mono text-primary-700 ml-1">({selectedAppeal?.mssv})</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Lớp: </span>
                <strong className="text-slate-700">{selectedAppeal?.maLop}</strong>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span>ĐRL hiện tại: <strong className="text-purple-700 text-sm">{selectedAppeal?.diemRenLuyenHienTai != null ? selectedAppeal.diemRenLuyenHienTai : '-'} đ</strong></span>
              <span>GPA hiện tại: <strong className="text-primary-700 text-sm">{selectedAppeal?.diemTrungBinhHienTai != null ? Number(selectedAppeal.diemTrungBinhHienTai).toFixed(2) : '-'}</strong></span>
              <span>Học kỳ: <strong className="text-slate-700">{selectedAppeal?.maHocKy || 'HK1_2025_2026'}</strong></span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-semibold block mb-0.5">Nội dung khiếu nại:</span>
              <p className="text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200">"{selectedAppeal?.noiDung}"</p>
            </div>
          </div>

          {actionForm.accept && (
            <div className="p-4 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                  Điểm Rèn Luyện (ĐRL) mới điều chỉnh (0 - 100)
                </label>
                {previewRank && <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${previewRank.color}`}>Xếp loại ĐRL: {previewRank.text}</span>}
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                required
                value={actionForm.diemRenLuyenMoi}
                onChange={(e) => setActionForm({ ...actionForm, diemRenLuyenMoi: e.target.value })}
                placeholder="Nhập điểm rèn luyện mới (0 - 100)..."
                className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              {previewHb && (
                <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200/90 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600 font-semibold">Dự kiến Học bổng sau điều chỉnh:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${previewHb.color}`}>{previewHb.text}</span>
                </div>
              )}
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                * Với <strong>GPA: {selectedAppeal?.diemTrungBinhHienTai != null ? Number(selectedAppeal.diemTrungBinhHienTai).toFixed(2) : '-'}</strong> và <strong>ĐRL: {actionForm.diemRenLuyenMoi || 0}</strong>, sinh viên đạt chuẩn xét học bổng tự động.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phản hồi chính thức đến Sinh viên (bắt buộc)</label>
            <textarea
              rows="3"
              required
              value={actionForm.phanHoi}
              onChange={(e) => setActionForm({ ...actionForm, phanHoi: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-50 cursor-pointer">
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer flex items-center gap-1.5 ${actionForm.accept ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20' : 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/20'}`}
            >
              {actionForm.accept ? <><CheckCircle className="w-4 h-4" /> Xác nhận Chấp nhận & Cập nhật ĐRL</> : <><XCircle className="w-4 h-4" /> Xác nhận Từ chối</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KhoaAppeals;
