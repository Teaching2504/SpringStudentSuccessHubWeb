import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Plus, Sliders, History, Calendar, DollarSign, Users, Award, CheckCircle, AlertCircle, Edit2, Trash2, TrendingUp } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { sortSemesters } from '../../utils/semesterSort';

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Campaign
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);
  const [campForm, setCampForm] = useState({
    maDot: '',
    tenDot: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    maHocKy: ''
  });

  // Modal Dynamic Rule Engine (UC06)
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedCampForRules, setSelectedCampForRules] = useState(null);
  const [ruleHistory, setRuleHistory] = useState([]);
  const [ruleForm, setRuleForm] = useState({
    diemTbDuoiThieu: 2.5,
    diemRlToiThieu: 65,
    soTinChiToiThieu: 14,
    khongNoMon: true,
    mucHocBongXuatSac: 10000000,
    mucHocBongGioi: 7000000,
    mucHocBongKha: 5000000,
    ghiChu: ''
  });

  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchCampaigns();
    fetchHocKys();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/truong/campaigns');
      if (res.data.success) {
        setCampaigns(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchHocKys = async () => {
    try {
      const res = await axiosClient.get('/api/common/danh-muc/hoc-ky');
      if (res.data.success) setHocKys(sortSemesters(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCampModal = (c = null) => {
    setError('');
    if (c) {
      setEditingCamp(c);
      setCampForm({
        maDot: c.maDot,
        tenDot: c.tenDot,
        ngayBatDau: c.ngayBatDau || '',
        ngayKetThuc: c.ngayKetThuc || '',
        maHocKy: c.maHocKy || hocKys[0]?.maHocKy || ''
      });
    } else {
      setEditingCamp(null);
      const today = new Date().toISOString().split('T')[0];
      setCampForm({
        maDot: 'HB_' + Date.now().toString().slice(-6),
        tenDot: 'Học bổng Khuyến khích Học tập Kỳ Mới',
        ngayBatDau: today,
        ngayKetThuc: today,
        maHocKy: hocKys[0]?.maHocKy || ''
      });
    }
    setIsCampModalOpen(true);
  };

  const handleSaveCamp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingCamp) {
        await axiosClient.put(`/api/truong/campaigns/${editingCamp.maDot}`, campForm);
      } else {
        await axiosClient.post('/api/truong/campaigns', campForm);
      }
      setIsCampModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteCamp = async (maDot) => {
    if (window.confirm('Bạn có chắc muốn xóa đợt xét này?')) {
      try {
        await axiosClient.delete(`/api/truong/campaigns/${maDot}`);
        fetchCampaigns();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  // Open Dynamic Rule Engine Modal
  const handleOpenRuleModal = async (c) => {
    setSelectedCampForRules(c);
    setError('');
    setMsg('');

    try {
      const res = await axiosClient.get(`/api/truong/campaigns/${c.maDot}/rules`);
      if (res.data.success) {
        setRuleHistory(res.data.data);
        const latest = res.data.data[0];
        if (latest) {
          setRuleForm({
            diemTbDuoiThieu: latest.diemTbDuoiThieu || 2.5,
            diemRlToiThieu: latest.diemRlToiThieu || 65,
            soTinChiToiThieu: latest.soTinChiToiThieu || 14,
            khongNoMon: latest.khongNoMon ?? true,
            mucHocBongXuatSac: latest.mucHocBongXuatSac || 10000000,
            mucHocBongGioi: latest.mucHocBongGioi || 7000000,
            mucHocBongKha: latest.mucHocBongKha || 5000000,
            ghiChu: ''
          });
        }
      }
      setIsRuleModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      const res = await axiosClient.post(`/api/truong/campaigns/${selectedCampForRules.maDot}/rules`, ruleForm);
      if (res.data.success) {
        setMsg('Đã tạo phiên bản quy tắc mới thành công!');
        const rRes = await axiosClient.get(`/api/truong/campaigns/${selectedCampForRules.maDot}/rules`);
        if (rRes.data.success) setRuleHistory(rRes.data.data);
        fetchCampaigns();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu quy tắc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Đợt xét & Cấu hình Dynamic Rule Engine</h1>
          <p className="text-sm text-slate-500 mt-1">
            Khởi tạo chiến dịch học bổng, thiết lập điều kiện ràng buộc động và quản lý phiên bản quy tắc
          </p>
        </div>
        <button
          onClick={() => handleOpenCampModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Khởi tạo Đợt xét Học bổng mới
        </button>
      </div>

      {/* Campaign Cards List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Đang tải danh sách đợt xét...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Chưa có đợt xét học bổng nào</div>
        ) : (
          campaigns.map((c) => (
            <div key={c.maDot} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-800">{c.tenDot}</h2>
                    <span className={`px-3 py-0.5 text-xs font-semibold rounded-full ${
                      c.trangThai === 'DA_CONG_BO' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {c.trangThai === 'DA_CONG_BO' ? 'Đã công bố chính thức' : 'Đang mở'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Mã đợt: {c.maDot} | Học kỳ áp dụng: <strong>{c.tenHocKy || c.maHocKy}</strong> | Thời hạn:{' '}
                    {c.ngayBatDau} đến {c.ngayKetThuc}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenRuleModal(c)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Quy tắc & Phiên bản
                  </button>

                  <Link
                    to={`/truong/campaigns/${c.maDot}?tab=budget`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Quỹ 8% (Khoa - Khóa - Ngành)
                  </Link>

                  <Link
                    to={`/truong/campaigns/${c.maDot}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" /> Duyệt DS các Khoa
                  </Link>

                  <button
                    onClick={() => handleOpenCampModal(c)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCamp(c.maDot)}
                    className="p-2 border border-rose-200 rounded-xl hover:bg-rose-50 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Rules Info Box */}
              {c.quyTacHienHanh && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Phiên bản Quy tắc</span>
                    <span className="font-bold text-purple-700 text-sm">
                      Version {c.quyTacHienHanh.phienBan}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ngưỡng GPA tối thiểu</span>
                    <span className="font-bold text-slate-700 text-sm">
                      GPA &ge; {c.quyTacHienHanh.diemTbDuoiThieu}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ngưỡng ĐRL tối thiểu</span>
                    <span className="font-bold text-slate-700 text-sm">
                      ĐRL &ge; {c.quyTacHienHanh.diemRlToiThieu}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Số TC tối thiểu / Nợ môn</span>
                    <span className="font-bold text-slate-700 text-sm">
                      {c.quyTacHienHanh.soTinChiToiThieu} TC | {c.quyTacHienHanh.khongNoMon ? 'Không nợ môn' : 'Cho phép'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Campaign */}
      <Modal
        isOpen={isCampModalOpen}
        onClose={() => setIsCampModalOpen(false)}
        title={editingCamp ? 'Cập nhật đợt xét học bổng' : 'Khởi tạo đợt xét học bổng mới'}
      >
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSaveCamp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mã đợt xét</label>
            <input
              type="text"
              required
              disabled={!!editingCamp}
              value={campForm.maDot}
              onChange={(e) => setCampForm({ ...campForm, maDot: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đợt xét học bổng</label>
            <input
              type="text"
              required
              value={campForm.tenDot}
              onChange={(e) => setCampForm({ ...campForm, tenDot: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Học kỳ xét điểm</label>
            <select
              value={campForm.maHocKy}
              onChange={(e) => setCampForm({ ...campForm, maHocKy: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
            >
              {hocKys.map((h) => (
                <option key={h.maHocKy} value={h.maHocKy}>
                  {h.tenHocKy}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                required
                value={campForm.ngayBatDau}
                onChange={(e) => setCampForm({ ...campForm, ngayBatDau: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày kết thúc</label>
              <input
                type="date"
                required
                value={campForm.ngayKetThuc}
                onChange={(e) => setCampForm({ ...campForm, ngayKetThuc: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCampModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-medium shadow-md shadow-primary-700/20 transition cursor-pointer"
            >
              {editingCamp ? 'Lưu thay đổi' : 'Khởi tạo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Dynamic Rule Engine Configuration & Versioning (UC06) */}
      <Modal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        title={`Cấu hình Dynamic Rule Engine: ${selectedCampForRules?.tenDot}`}
      >
        <div className="space-y-6">
          {msg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-medium">
              <CheckCircle className="w-4 h-4" /> {msg}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSaveRule} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm TB Học tập (GPA) tối thiểu</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={ruleForm.diemTbDuoiThieu}
                  onChange={(e) => setRuleForm({ ...ruleForm, diemTbDuoiThieu: parseFloat(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm Rèn luyện (ĐRL) tối thiểu</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={ruleForm.diemRlToiThieu}
                  onChange={(e) => setRuleForm({ ...ruleForm, diemRlToiThieu: parseFloat(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Tín chỉ tích lũy tối thiểu trong kỳ</label>
                <input
                  type="number"
                  required
                  value={ruleForm.soTinChiToiThieu}
                  onChange={(e) => setRuleForm({ ...ruleForm, soTinChiToiThieu: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ràng buộc Nợ môn / Học phần rớt</label>
                <select
                  value={ruleForm.khongNoMon ? 'true' : 'false'}
                  onChange={(e) => setRuleForm({ ...ruleForm, khongNoMon: e.target.value === 'true' })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                >
                  <option value="true">Bắt buộc: Không được rớt môn nào</option>
                  <option value="false">Cho phép có môn rớt</option>
                </select>
              </div>
            </div>

            {/* Scholarship Monetary Amounts */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Định mức Học bổng (% Học phí bình quân ngành)</h4>
                <span className="text-[11px] text-blue-600 font-medium">Quỹ HB ≥ 8% tổng thu học phí</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800 mb-1">Xuất sắc (100% HP)</label>
                  <input
                    type="number"
                    value={ruleForm.mucHocBongXuatSac}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setRuleForm({
                        ...ruleForm,
                        mucHocBongXuatSac: val,
                        mucHocBongGioi: Math.round(val * 0.70),
                        mucHocBongKha: Math.round(val * 0.50),
                      });
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-blue-800 mb-1">Giỏi (70% HP)</label>
                  <input
                    type="number"
                    value={ruleForm.mucHocBongGioi}
                    onChange={(e) => setRuleForm({ ...ruleForm, mucHocBongGioi: parseFloat(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-800 mb-1">Khá (50% HP)</label>
                  <input
                    type="number"
                    value={ruleForm.mucHocBongKha}
                    onChange={(e) => setRuleForm({ ...ruleForm, mucHocBongKha: parseFloat(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-amber-700"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Tự động tính 100% - 70% - 50% học phí bình quân. Hệ thống xét từ trên xuống theo thứ hạng (GPA → ĐRL → Tín chỉ) cho đến khi hết Quỹ ngân sách của Khoa.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú lý do cập nhật phiên bản mới</label>
              <input
                type="text"
                value={ruleForm.ghiChu}
                onChange={(e) => setRuleForm({ ...ruleForm, ghiChu: e.target.value })}
                placeholder="VD: Điều chỉnh định mức khen thưởng HK1 2025"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-700/20 transition cursor-pointer"
              >
                + Lưu thành Phiên bản mới (Versioning)
              </button>
            </div>
          </form>

          {/* Version History Table */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-4 h-4 text-purple-600" /> Lịch sử các phiên bản quy tắc đã ban hành:
            </h4>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
              {ruleHistory.map((r, idx) => (
                <div key={r.maQuyTac} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-purple-700">Phiên bản {r.phienBan}</span>
                    {idx === 0 && <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Đang áp dụng</span>}
                    <p className="text-slate-500 mt-0.5">{r.ghiChu || 'Không có ghi chú'}</p>
                  </div>
                  <div className="text-right text-slate-600 font-mono">
                    GPA &ge; {r.diemTbDuoiThieu} | ĐRL &ge; {r.diemRlToiThieu} | TC &ge; {r.soTinChiToiThieu}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignManagement;
