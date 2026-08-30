import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Download, 
  DollarSign, 
  Users, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Send, 
  BookOpen,
  Layers,
  RefreshCw,
  Zap,
  TrendingUp,
  CheckCircle2,
  FolderTree,
  Building2,
  Filter,
  Sliders,
  Settings
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const CampaignReviewDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'budget' ? 'BUDGET_8_PERCENT' : 'FACULTY_REVIEW';

  const [campaign, setCampaign] = useState(null);
  const [facultyCampaigns, setFacultyCampaigns] = useState([]);
  const [selectedSubCamp, setSelectedSubCamp] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentGrades, setStudentGrades] = useState(null);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [showGradesModal, setShowGradesModal] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState(initialTab); // 'FACULTY_REVIEW' | 'BUDGET_8_PERCENT'
  const [budgetBreakdown, setBudgetBreakdown] = useState([]);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  const [syncingBudget, setSyncingBudget] = useState(false);

  // Filter States for Tab 1 (Dossiers)
  const [search, setSearch] = useState('');
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState('ALL');
  const [selectedNganh, setSelectedNganh] = useState('ALL');
  const [selectedHeDaoTao, setSelectedHeDaoTao] = useState('ALL');
  const [selectedLoaiHb, setSelectedLoaiHb] = useState('ALL');

  // Filter States for Tab 2 (Budget 8% Breakdown)
  const [budgetSearch, setBudgetSearch] = useState('');
  const [budgetSelectedKhoa, setBudgetSelectedKhoa] = useState('ALL');
  const [budgetSelectedKhoaHoc, setBudgetSelectedKhoaHoc] = useState('ALL');
  const [budgetSelectedNganh, setBudgetSelectedNganh] = useState('ALL');
  const [budgetSelectedHeDaoTao, setBudgetSelectedHeDaoTao] = useState('ALL');

  // Quota modal
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [quotaForm, setQuotaForm] = useState({ chiTieu: 9, nganSach: 105300000 });

  // Reject / Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState({ approve: true, lyDo: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'BUDGET_8_PERCENT') {
      fetchBudgetBreakdown();
    }
  }, [activeTab, id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rCamp, rFaculties] = await Promise.all([
        axiosClient.get(`/api/truong/campaigns/${id}`),
        axiosClient.get(`/api/truong/campaigns/${id}/faculties`)
      ]);

      if (rCamp.data.success) setCampaign(rCamp.data.data);
      if (rFaculties.data.success) {
        setFacultyCampaigns(rFaculties.data.data);
        if (rFaculties.data.data.length > 0) {
          handleSelectFaculty(rFaculties.data.data[0]);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchBudgetBreakdown = async () => {
    try {
      setLoadingBreakdown(true);
      const res = await axiosClient.get(`/api/truong/campaigns/${id}/budget-breakdown`);
      if (res.data.success) {
        setBudgetBreakdown(res.data.data);
      }
      setLoadingBreakdown(false);
    } catch (err) {
      console.error('Lỗi tải bảng phân rã ngân sách 8%:', err);
      setLoadingBreakdown(false);
    }
  };

  const handleAutoSync8Percent = async () => {
    if (window.confirm('Hệ thống sẽ tự động tính 8% tổng học phí thực tế của tất cả sinh viên thuộc từng Khoa (chia theo Ngành & Khóa) và cập nhật trực tiếp vào Ngân sách & Chỉ tiêu của các Khoa. Xác nhận đồng bộ?')) {
      try {
        setSyncingBudget(true);
        const res = await axiosClient.post(`/api/truong/campaigns/${id}/auto-sync-8percent-budget`);
        setSyncingBudget(false);
        if (res.data.success) {
          alert(res.data.message || 'Đã đồng bộ ngân sách 8% thành công!');
          fetchData();
          fetchBudgetBreakdown();
        }
      } catch (err) {
        setSyncingBudget(false);
        alert(err.response?.data?.message || 'Lỗi khi đồng bộ ngân sách 8%');
      }
    }
  };

  const handleSelectFaculty = async (sub) => {
    setSelectedSubCamp(sub);
    try {
      const res = await axiosClient.get(`/api/khoa/campaigns/${sub.maDotXetHbKhoa}/dossiers`);
      if (res.data.success) {
        setDossiers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewGrades = async (mssv) => {
    setLoadingGrades(true);
    setShowGradesModal(true);
    try {
      const maHocKy = selectedSubCamp?.maHocKy || campaign?.maHocKy || 'HK1_2025_2026';
      const res = await axiosClient.get(`/api/common/danh-muc/grades/${mssv}?maHocKy=${maHocKy}`);
      setStudentGrades(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi tải điểm chi tiết:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const filteredDossiers = dossiers.filter((d) => {
    const matchSearch =
      !search ||
      (d.mssv && d.mssv.toLowerCase().includes(search.toLowerCase())) ||
      (d.hoTen && d.hoTen.toLowerCase().includes(search.toLowerCase())) ||
      (d.maLop && d.maLop.toLowerCase().includes(search.toLowerCase()));

    const matchKhoaHoc = selectedKhoaHoc === 'ALL' || d.khoaHoc === selectedKhoaHoc;
    const matchNganh = selectedNganh === 'ALL' || d.tenNganh === selectedNganh;
    const matchHeDaoTao =
      selectedHeDaoTao === 'ALL' ||
      (selectedHeDaoTao === 'CHUAN' && (!d.heDaoTao || d.heDaoTao === 'CHUAN')) ||
      (selectedHeDaoTao === 'DAC_BIET' && (d.heDaoTao === 'DAC_BIET' || d.heDaoTao === 'CHAT_LUONG_CAO'));

    const matchLoaiHb = selectedLoaiHb === 'ALL' || d.loaiHocBong === selectedLoaiHb;

    return matchSearch && matchKhoaHoc && matchNganh && matchHeDaoTao && matchLoaiHb;
  });

  const filteredBudgetBreakdown = budgetBreakdown.filter((item) => {
    const matchSearch =
      !budgetSearch ||
      (item.tenKhoa && item.tenKhoa.toLowerCase().includes(budgetSearch.toLowerCase())) ||
      (item.maKhoa && item.maKhoa.toLowerCase().includes(budgetSearch.toLowerCase())) ||
      (item.tenNganh && item.tenNganh.toLowerCase().includes(budgetSearch.toLowerCase())) ||
      (item.maNganh && item.maNganh.toLowerCase().includes(budgetSearch.toLowerCase()));

    const matchKhoa = budgetSelectedKhoa === 'ALL' || item.maKhoa === budgetSelectedKhoa;
    const matchKhoaHoc = budgetSelectedKhoaHoc === 'ALL' || item.khoaHoc === budgetSelectedKhoaHoc;
    const matchNganh = budgetSelectedNganh === 'ALL' || item.tenNganh === budgetSelectedNganh;
    const matchHeDaoTao =
      budgetSelectedHeDaoTao === 'ALL' ||
      (budgetSelectedHeDaoTao === 'CHUAN' && (!item.heDaoTao || item.heDaoTao === 'CHUAN')) ||
      (budgetSelectedHeDaoTao === 'DAC_BIET' && (item.heDaoTao === 'DAC_BIET' || item.heDaoTao === 'CHAT_LUONG_CAO'));

    return matchSearch && matchKhoa && matchKhoaHoc && matchNganh && matchHeDaoTao;
  });

  const handleOpenQuotaModal = (sub) => {
    setSelectedSubCamp(sub);
    setQuotaForm({
      chiTieu: sub.chiTieu || 9,
      nganSach: sub.nganSachKhoa || 105300000
    });
    setIsQuotaModalOpen(true);
  };

  const handleOpenQuotaModalByKhoaCode = (maKhoa) => {
    const sub = facultyCampaigns.find((f) => f.maKhoa === maKhoa || f.khoa?.maKhoa === maKhoa);
    if (sub) {
      handleOpenQuotaModal(sub);
    } else {
      alert('Không tìm thấy thông tin phân bổ của khoa này');
    }
  };

  const handleSaveQuota = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/truong/campaigns/faculty-campaigns/${selectedSubCamp.maDotXetHbKhoa}/quota`, quotaForm);
      setIsQuotaModalOpen(false);
      fetchData();
      fetchBudgetBreakdown();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi lưu chỉ tiêu');
    }
  };

  const handleOpenReviewModal = (approve) => {
    setReviewAction({ approve, lyDo: '' });
    setIsReviewModalOpen(true);
  };

  const handleExecuteReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post(`/api/truong/campaigns/faculty-campaigns/${selectedSubCamp.maDotXetHbKhoa}/review`, {
        approve: reviewAction.approve,
        lyDo: reviewAction.lyDo
      });
      setIsReviewModalOpen(false);
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi phê duyệt');
    }
  };

  const handlePublishOfficial = async () => {
    if (window.confirm('Xác nhận CÔNG BỐ CHÍNH THỨC kết quả học bổng toàn trường? Toàn bộ sinh viên sẽ nhận được thông báo học bổng.')) {
      try {
        const res = await axiosClient.post(`/api/truong/campaigns/${id}/publish-official`);
        alert(res.data.message);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi công bố');
      }
    }
  };

  const handleExportExcel = (dkId) => {
    window.open(`/api/truong/campaigns/faculty-campaigns/${dkId}/export-excel`, '_blank');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const getSubCampStatusBadge = (st) => {
    switch (st) {
      case 'CHUA_XET':
        return <Badge variant="slate">Khoa chưa xét</Badge>;
      case 'DA_CONG_BO_DU_KIEN':
        return <Badge variant="blue">Khoa đã công bố dự kiến</Badge>;
      case 'DA_CHOT_GUI_TRUONG':
        return <Badge variant="purple">Đã gửi chờ trường duyệt</Badge>;
      case 'DA_PHE_DUYET':
        return <Badge variant="emerald">Trường đã duyệt</Badge>;
      case 'BI_TRA_VE':
        return <Badge variant="rose">Bị trả về yêu cầu sửa</Badge>;
      default:
        return <Badge>{st}</Badge>;
    }
  };

  // Unique filter lists for Tab 1
  const uniqueKhoaHoc = Array.from(new Set(dossiers.map((d) => d.khoaHoc).filter(Boolean)));
  const uniqueNganh = Array.from(new Set(dossiers.map((d) => d.tenNganh).filter(Boolean)));

  // Unique filter lists for Tab 2 (Budget Breakdown)
  const uniqueBudgetKhoas = Array.from(
    new Map(budgetBreakdown.map((item) => [item.maKhoa, { maKhoa: item.maKhoa, tenKhoa: item.tenKhoa }])).values()
  );
  const uniqueBudgetKhoaHocs = Array.from(new Set(budgetBreakdown.map((item) => item.khoaHoc).filter(Boolean)));
  const uniqueBudgetNganhs = Array.from(new Set(budgetBreakdown.map((item) => item.tenNganh).filter(Boolean)));

  // Totals for filtered 8% breakdown
  const filteredStudents = filteredBudgetBreakdown.reduce((sum, item) => sum + (item.soSinhVienTong || 0), 0);
  const filteredTuitionSum = filteredBudgetBreakdown.reduce((sum, item) => sum + (Number(item.tongHocPhiThu) || 0), 0);
  const filtered8PercentFund = filteredBudgetBreakdown.reduce((sum, item) => sum + (Number(item.quyHocBong8PhanTram) || 0), 0);
  const totalAllocatedFacultyBudget = facultyCampaigns.reduce((sum, item) => sum + (Number(item.nganSachKhoa) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/truong/campaigns" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{campaign?.tenDot}</h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Mã đợt: {campaign?.maDot} | Học kỳ: {campaign?.tenHocKy}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {campaign?.trangThai !== 'DA_CONG_BO' ? (
            <button
              onClick={handlePublishOfficial}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition cursor-pointer"
            >
              <Send className="w-4 h-4" /> Công bố Chính thức Toàn trường
            </button>
          ) : (
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Đã công bố kết quả toàn trường
            </span>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('FACULTY_REVIEW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'FACULTY_REVIEW'
              ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Duyệt Hồ sơ & Danh sách các Khoa ({facultyCampaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('BUDGET_8_PERCENT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            activeTab === 'BUDGET_8_PERCENT'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Phân bổ Ngân sách Quỹ 8% (Khoa - Khóa - Ngành)
        </button>
      </div>

      {activeTab === 'BUDGET_8_PERCENT' ? (
        /* TAB 2: PHÂN BỔ QUỸ 8% THEO KHOA, NGÀNH & KHÓA */
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                <span>Sinh viên (Bộ lọc)</span>
                <Users className="w-4 h-4 text-primary-600" />
              </div>
              <p className="text-2xl font-black text-slate-800 mt-2">{filteredStudents} <span className="text-sm font-normal text-slate-500">sinh viên</span></p>
              <p className="text-xs text-slate-500 mt-1">Theo 3 Khóa K23, K24, K25</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                <span>Tổng Thu Học Phí Kỳ</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-blue-700 mt-2">{formatCurrency(filteredTuitionSum)}</p>
              <p className="text-xs text-slate-500 mt-1">Căn cứ trích lập học bổng</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/50">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase">
                <span>Quỹ 8% Học Bổng</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-700 mt-2">{formatCurrency(filtered8PercentFund)}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">8% $\times$ Tổng thu học phí</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm bg-gradient-to-br from-white to-purple-50/50">
              <div className="flex items-center justify-between text-purple-800 text-xs font-bold uppercase">
                <span>Hạn Mức Ngân Sách Khoa</span>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-purple-700 mt-2">{formatCurrency(totalAllocatedFacultyBudget)}</p>
              <p className="text-xs text-purple-600 font-semibold mt-1">Tổng hạn mức 12 Khoa</p>
            </div>
          </div>

          {/* Action Sync Button & Description */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Cơ chế Tự động Phân bổ Ngân sách 8% theo từng Khoa, Ngành & Khóa
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Quy chế chuẩn OU: Học bổng được chia riêng biệt theo từng <strong>Khoa</strong> $\rightarrow$ <strong>Ngành đào tạo</strong> $\rightarrow$ <strong>Khóa học (K23, K24, K25)</strong> dựa trên 8% tổng số tiền học phí thực tế thu từ sinh viên của nhóm đó.
              </p>
            </div>

            <button
              onClick={handleAutoSync8Percent}
              disabled={syncingBudget}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {syncingBudget ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 text-amber-300" />
              )}
              ⚡ Tự động tính & Phân bổ 8% Ngân sách từ Học phí
            </button>
          </div>

          {/* Filter Toolbar for Budget Breakdown (Khoa, Khóa, Ngành, CTĐT) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-emerald-600" />
                Bộ lọc Ngân sách Quỹ 8% theo Khoa, Khóa học & Ngành đào tạo
              </span>
              <button
                onClick={() => {
                  setBudgetSearch('');
                  setBudgetSelectedKhoa('ALL');
                  setBudgetSelectedKhoaHoc('ALL');
                  setBudgetSelectedNganh('ALL');
                  setBudgetSelectedHeDaoTao('ALL');
                }}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tìm kiếm</label>
                <input
                  type="text"
                  placeholder="Nhập tên Khoa hoặc Ngành..."
                  value={budgetSearch}
                  onChange={(e) => setBudgetSearch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Khoa quản lý</label>
                <select
                  value={budgetSelectedKhoa}
                  onChange={(e) => setBudgetSelectedKhoa(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">-- Tất cả Khoa ({uniqueBudgetKhoas.length}) --</option>
                  {uniqueBudgetKhoas.map((k) => (
                    <option key={k.maKhoa} value={k.maKhoa}>
                      {k.tenKhoa || k.maKhoa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Khóa học</label>
                <select
                  value={budgetSelectedKhoaHoc}
                  onChange={(e) => setBudgetSelectedKhoaHoc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">-- Tất cả Khóa học --</option>
                  {uniqueBudgetKhoaHocs.map((kh) => (
                    <option key={kh} value={kh}>{kh}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ngành học</label>
                <select
                  value={budgetSelectedNganh}
                  onChange={(e) => setBudgetSelectedNganh(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">-- Tất cả Ngành học --</option>
                  {uniqueBudgetNganhs.map((ng) => (
                    <option key={ng} value={ng}>{ng}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chương trình Đào tạo</label>
                <select
                  value={budgetSelectedHeDaoTao}
                  onChange={(e) => setBudgetSelectedHeDaoTao(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">-- Tất cả Chương trình --</option>
                  <option value="CHUAN">Chương trình Chuẩn (Đại trà)</option>
                  <option value="DAC_BIET">Chương trình Đặc biệt (CLC)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                Chi tiết Quỹ 8% Học phí phân rã theo Khoa, Ngành & Khóa học
              </h3>
              <span className="text-xs text-slate-500">
                Hiển thị {filteredBudgetBreakdown.length} / {budgetBreakdown.length} nhóm ngành & khóa
              </span>
            </div>

            {loadingBreakdown ? (
              <div className="py-16 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredBudgetBreakdown.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="font-semibold">Không tìm thấy dữ liệu ngân sách theo bộ lọc đã chọn.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="py-3 px-4">Khoa quản lý</th>
                      <th className="py-3 px-4">Ngành đào tạo</th>
                      <th className="py-3 px-3">Hệ ĐT</th>
                      <th className="py-3 px-3">Khóa học</th>
                      <th className="py-3 px-3 text-center">Số SV</th>
                      <th className="py-3 px-4 text-right">Tổng học phí thu</th>
                      <th className="py-3 px-4 text-right font-black text-emerald-800">Quỹ 8% học bổng</th>
                      <th className="py-3 px-3 text-center">Suất ước tính</th>
                      <th className="py-3 px-4 text-right">Hạn mức Khoa hiện tại</th>
                      <th className="py-3 px-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredBudgetBreakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">{item.tenKhoa || item.maKhoa}</td>
                        <td className="py-3 px-4 font-semibold text-primary-700">{item.tenNganh || item.maNganh}</td>
                        <td className="py-3 px-3 text-xs">
                          {item.heDaoTao === 'DAC_BIET' || item.heDaoTao === 'CHAT_LUONG_CAO' ? (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[11px]">CLC</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[11px]">Chuẩn</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs font-bold text-slate-800">{item.khoaHoc}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">{item.soSinhVienTong}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-700">{formatCurrency(item.tongHocPhiThu)}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700 bg-emerald-50/40">
                          {formatCurrency(item.quyHocBong8PhanTram)}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-blue-700">{item.soSinhVienDatHocBong || 1} suất</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-800">{formatCurrency(item.nganSachKhoaHienTai)}</td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleOpenQuotaModalByKhoaCode(item.maKhoa)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                            title="Điều chỉnh chỉ tiêu & ngân sách của Khoa này"
                          >
                            <Settings className="w-3.5 h-3.5" /> Sửa Quỹ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 1: DUYỆT HỒ SƠ & DANH SÁCH CÁC KHOA */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Faculty Sub-Campaign List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Danh sách các Khoa:</h3>
            <div className="space-y-2">
              {facultyCampaigns.map((sub) => (
                <div
                  key={sub.maDotXetHbKhoa}
                  onClick={() => handleSelectFaculty(sub)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedSubCamp?.maDotXetHbKhoa === sub.maDotXetHbKhoa
                      ? 'border-primary-600 bg-primary-50/60 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-800">{sub.tenKhoa}</h4>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    {getSubCampStatusBadge(sub.trangThai)}
                    <span className="text-xs font-bold text-slate-600">
                      Chỉ tiêu: {sub.chiTieu}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Area: Selected Faculty Dossiers & Review Actions */}
          <div className="lg:col-span-3 space-y-5">
            {selectedSubCamp && (
              <>
                {/* Faculty Banner & Actions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">{selectedSubCamp.tenKhoa}</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Chỉ tiêu: <strong>{selectedSubCamp.chiTieu} suất</strong> | Ngân sách:{' '}
                        <strong className="text-emerald-700">{formatCurrency(selectedSubCamp.nganSachKhoa)}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleOpenQuotaModal(selectedSubCamp)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Phân bổ Chỉ tiêu / Quỹ
                      </button>

                      <button
                        onClick={() => handleExportExcel(selectedSubCamp.maDotXetHbKhoa)}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Xuất Excel
                      </button>

                      <button
                        onClick={() => handleOpenReviewModal(true)}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Duyệt danh sách
                      </button>

                      <button
                        onClick={() => handleOpenReviewModal(false)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Trả về yêu cầu sửa
                      </button>
                    </div>
                  </div>

                  {selectedSubCamp.lyDoTraVe && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <div>
                        <strong>Lý do trả về gần nhất:</strong> {selectedSubCamp.lyDoTraVe}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter Toolbar for Students */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Bộ lọc xét duyệt theo Khóa học, Ngành đào tạo & Chương trình
                    </span>
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedKhoaHoc('ALL');
                        setSelectedNganh('ALL');
                        setSelectedHeDaoTao('ALL');
                        setSelectedLoaiHb('ALL');
                      }}
                      className="text-xs text-primary-600 hover:text-primary-700 font-semibold cursor-pointer"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tìm kiếm sinh viên</label>
                      <input
                        type="text"
                        placeholder="Nhập MSSV, Tên hoặc Lớp..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Khóa học</label>
                      <select
                        value={selectedKhoaHoc}
                        onChange={(e) => setSelectedKhoaHoc(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ALL">-- Tất cả Khóa học --</option>
                        {uniqueKhoaHoc.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ngành học</label>
                      <select
                        value={selectedNganh}
                        onChange={(e) => setSelectedNganh(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ALL">-- Tất cả Ngành học --</option>
                        {uniqueNganh.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chương trình Đào tạo</label>
                      <select
                        value={selectedHeDaoTao}
                        onChange={(e) => setSelectedHeDaoTao(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ALL">-- Tất cả Chương trình --</option>
                        <option value="CHUAN">Chương trình Chuẩn (Đại trà)</option>
                        <option value="DAC_BIET">Chương trình Đặc biệt (CLC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phân loại Học bổng</label>
                      <select
                        value={selectedLoaiHb}
                        onChange={(e) => setSelectedLoaiHb(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="ALL">-- Tất cả Phân loại --</option>
                        <option value="XUAT_SAC">Xuất sắc (100% HP)</option>
                        <option value="GIOI">Giỏi (70% HP)</option>
                        <option value="KHA">Khá (50% HP)</option>
                        <option value="KHONG_DAT">Không đạt (0đ / Hết quỹ)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dossiers List Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Danh sách xếp hạng sinh viên đề xuất ({filteredDossiers.length} / {dossiers.length} sinh viên)
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3 text-center">Thứ hạng</th>
                          <th className="px-4 py-3">MSSV</th>
                          <th className="px-4 py-3">Họ và Tên</th>
                          <th className="px-4 py-3">Lớp & Khóa</th>
                          <th className="px-4 py-3">Ngành & CTĐT</th>
                          <th className="px-4 py-3 text-center">GPA</th>
                          <th className="px-4 py-3 text-center">ĐRL</th>
                          <th className="px-4 py-3">Loại HB</th>
                          <th className="px-4 py-3 text-right">Tiền HB nhận</th>
                          <th className="px-4 py-3 text-center">Bảng điểm</th>
                          <th className="px-4 py-3 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        {filteredDossiers.length === 0 ? (
                          <tr>
                            <td colSpan="11" className="text-center py-8 text-slate-400">
                              {dossiers.length === 0
                                ? 'Khoa chưa chạy Dynamic Rule Engine xét duyệt'
                                : 'Không tìm thấy sinh viên phù hợp theo bộ lọc'}
                            </td>
                          </tr>
                        ) : (
                          filteredDossiers.map((hs) => {
                            const isAwarded = hs.mucHocBong && parseFloat(hs.mucHocBong) > 0;
                            return (
                              <tr
                                key={hs.maHoSo}
                                className={`hover:bg-slate-50/80 transition-colors ${
                                  isAwarded ? 'bg-emerald-50/30' : ''
                                }`}
                              >
                                <td className="px-4 py-3 text-center font-bold text-slate-800">
                                  {hs.thuHang != null ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                                      {hs.thuHang}
                                    </span>
                                  ) : (
                                    '-'
                                  )}
                                </td>
                                <td className="px-4 py-3 font-mono font-bold text-primary-700">{hs.mssv}</td>
                                <td className="px-4 py-3 font-medium text-slate-800">{hs.hoTen}</td>
                                <td className="px-4 py-3 text-xs">
                                  <div className="font-semibold text-slate-800">{hs.maLop || '-'}</div>
                                  <div className="text-slate-500">{hs.khoaHoc || '-'}</div>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  <div className="font-semibold text-slate-800">{hs.tenNganh || '-'}</div>
                                  <div className="mt-0.5">
                                    {hs.heDaoTao === 'DAC_BIET' || hs.heDaoTao === 'CHAT_LUONG_CAO' ? (
                                      <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px]">
                                        Đặc biệt (CLC)
                                      </span>
                                    ) : (
                                      <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[10px]">
                                        Chuẩn (Đại trà)
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-800">
                                  {hs.diemTrungBinh != null ? hs.diemTrungBinh.toFixed(2) : '-'}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-800">
                                  {hs.diemRenLuyen != null ? hs.diemRenLuyen : '-'}
                                </td>
                                <td className="px-4 py-3">
                                  {hs.loaiHocBong === 'XUAT_SAC' && <Badge variant="emerald">Xuất sắc (100%)</Badge>}
                                  {hs.loaiHocBong === 'GIOI' && <Badge variant="blue">Giỏi (70%)</Badge>}
                                  {hs.loaiHocBong === 'KHA' && <Badge variant="amber">Khá (50%)</Badge>}
                                  {hs.loaiHocBong === 'KHONG_DAT' && <Badge variant="slate">Không đạt</Badge>}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-emerald-700">
                                  {formatCurrency(hs.mucHocBong)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => handleViewGrades(hs.mssv)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                                    title="Xem bảng điểm chi tiết các môn"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Xem điểm
                                  </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {hs.trangThai === 'CHINH_THUC' && <Badge variant="emerald">Chính thức</Badge>}
                                  {hs.trangThai === 'DU_KIEN' && <Badge variant="blue">Dự kiến</Badge>}
                                  {hs.trangThai === 'KHONG_DAT' && <Badge variant="slate">Không đạt</Badge>}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Adjust Quota / Budget */}
      <Modal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        title={`Phân bổ Chỉ tiêu & Ngân sách: ${selectedSubCamp?.tenKhoa}`}
      >
        <form onSubmit={handleSaveQuota} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chỉ tiêu số suất học bổng</label>
            <input
              type="number"
              required
              value={quotaForm.chiTieu}
              onChange={(e) => setQuotaForm({ ...quotaForm, chiTieu: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hạn mức Ngân sách cấp cho Khoa (VNĐ)</label>
            <input
              type="number"
              required
              value={quotaForm.nganSach}
              onChange={(e) => setQuotaForm({ ...quotaForm, nganSach: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-emerald-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsQuotaModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 cursor-pointer"
            >
              Lưu chỉ tiêu
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Review / Approve / Reject */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={reviewAction.approve ? 'Xác nhận Phê duyệt danh sách Khoa' : 'Trả về yêu cầu Khoa rà soát / điều chỉnh'}
      >
        <form onSubmit={handleExecuteReview} className="space-y-4">
          <p className="text-sm text-slate-600">
            {reviewAction.approve
              ? `Bạn có chắc chắn muốn phê duyệt danh sách xét học bổng của ${selectedSubCamp?.tenKhoa}?`
              : `Vui lòng nhập lý do và yêu cầu điều chỉnh để cán bộ khoa cập nhật lại danh sách:`}
          </p>

          {!reviewAction.approve && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lý do / Hướng dẫn điều chỉnh</label>
              <textarea
                rows="4"
                required
                value={reviewAction.lyDo}
                onChange={(e) => setReviewAction({ ...reviewAction, lyDo: e.target.value })}
                placeholder="VD: Cần rà soát lại trường hợp điểm ĐRL của sinh viên lớp IT01, điều chỉnh chỉ tiêu..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer ${
                reviewAction.approve
                  ? 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20'
                  : 'bg-rose-700 hover:bg-rose-800 shadow-rose-700/20'
              }`}
            >
              {reviewAction.approve ? 'Xác nhận Phê duyệt' : 'Gửi Trả về Khoa'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Popup Chi tiết Bảng điểm Môn học */}
      <Modal
        isOpen={showGradesModal}
        onClose={() => {
          setShowGradesModal(false);
          setStudentGrades(null);
        }}
        title="Bảng điểm Học phần & Học phí Chi tiết"
        maxWidth="max-w-4xl"
      >
        {loadingGrades ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !studentGrades || !studentGrades.danhSachDiemMonHoc || studentGrades.danhSachDiemMonHoc.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <p className="font-semibold">Chưa có bảng điểm chi tiết môn học trong kỳ của sinh viên này.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sinh viên Header Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block font-semibold">Sinh viên:</span>
                <span className="font-bold text-slate-800 text-sm">{studentGrades.hoTen}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">MSSV / Lớp:</span>
                <span className="font-mono font-bold text-primary-700">{studentGrades.mssv}</span> - {studentGrades.tenLop}
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">Tổng tín chỉ:</span>
                <span className="font-bold text-slate-800 text-sm">{studentGrades.tongSoTinChi} TC</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">Tổng học phí kỳ:</span>
                <span className="font-bold text-emerald-700 text-sm">{formatCurrency(studentGrades.tongHocPhiHocKy)}</span>
              </div>
            </div>

            {/* Subject Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">Mã môn</th>
                    <th className="py-2.5 px-3">Tên môn học</th>
                    <th className="py-2.5 px-2 text-center">TC</th>
                    <th className="py-2.5 px-2 text-right">Học phí</th>
                    <th className="py-2.5 px-2 text-center">CC (10%)</th>
                    <th className="py-2.5 px-2 text-center">GK (30%)</th>
                    <th className="py-2.5 px-2 text-center">CK (60%)</th>
                    <th className="py-2.5 px-2 text-center font-black">Điểm 10</th>
                    <th className="py-2.5 px-2 text-center font-black">Hệ 4</th>
                    <th className="py-2.5 px-2 text-center">Điểm chữ</th>
                    <th className="py-2.5 px-3 text-center">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {studentGrades.danhSachDiemMonHoc.map((m, i) => (
                    <tr key={m.id || i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-primary-700">{m.maMon}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{m.tenMon}</td>
                      <td className="py-2.5 px-2 text-center font-bold">{m.soTinChi}</td>
                      <td className="py-2.5 px-2 text-right font-semibold text-slate-700">{formatCurrency(m.hocPhiMon)}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{m.diemChuyenCan != null ? Number(m.diemChuyenCan).toFixed(1) : '-'}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{m.diemGiuaKy != null ? Number(m.diemGiuaKy).toFixed(1) : '-'}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{m.diemCuoiKy != null ? Number(m.diemCuoiKy).toFixed(1) : '-'}</td>
                      <td className="py-2.5 px-2 text-center font-black text-slate-900 bg-slate-50">{m.diemTongKet10 != null ? Number(m.diemTongKet10).toFixed(2) : '-'}</td>
                      <td className="py-2.5 px-2 text-center font-black text-amber-700 bg-amber-50">{m.diemHe4 != null ? Number(m.diemHe4).toFixed(2) : '-'}</td>
                      <td className="py-2.5 px-2 text-center font-bold">{m.diemChu}</td>
                      <td className="py-2.5 px-3 text-center">
                        {m.dat ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Đạt</span>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">Rớt</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowGradesModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CampaignReviewDetail;
