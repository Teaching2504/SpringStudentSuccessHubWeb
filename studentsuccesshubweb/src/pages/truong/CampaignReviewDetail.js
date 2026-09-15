import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Send, CheckCircle, Building2, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FacultySubCampaignList from './components/FacultySubCampaignList';
import DossierTable from './components/DossierTable';
import BudgetBreakdownTable from './components/BudgetBreakdownTable';
import { QuotaModal, ReviewDecisionModal, GradesDetailModal } from './components/TruongModals';

const CampaignReviewDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [campaign, setCampaign] = useState(null);
  const [facultyCampaigns, setFacultyCampaigns] = useState([]);
  const [selectedSubCamp, setSelectedSubCamp] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentGrades, setStudentGrades] = useState(null);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [showGradesModal, setShowGradesModal] = useState(false);

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'budget' ? 'BUDGET_8_PERCENT' : 'FACULTY_REVIEW');
  const [budgetBreakdown, setBudgetBreakdown] = useState([]);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  const [syncingBudget, setSyncingBudget] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState('ALL');
  const [selectedNganh, setSelectedNganh] = useState('ALL');
  const [selectedHeDaoTao, setSelectedHeDaoTao] = useState('ALL');
  const [selectedLoaiHb, setSelectedLoaiHb] = useState('ALL');

  const [budgetSearch, setBudgetSearch] = useState('');
  const [budgetSelectedKhoa, setBudgetSelectedKhoa] = useState('ALL');
  const [budgetSelectedKhoaHoc, setBudgetSelectedKhoaHoc] = useState('ALL');
  const [budgetSelectedNganh, setBudgetSelectedNganh] = useState('ALL');
  const [budgetSelectedHeDaoTao, setBudgetSelectedHeDaoTao] = useState('ALL');

  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [quotaForm, setQuotaForm] = useState({ chiTieu: 9, nganSach: 105300000 });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState({ approve: true, lyDo: '' });

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
        if (rFaculties.data.data.length > 0) handleSelectFaculty(rFaculties.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetBreakdown = async () => {
    try {
      setLoadingBreakdown(true);
      const res = await axiosClient.get(`/api/truong/campaigns/${id}/budget-breakdown`);
      if (res.data.success) setBudgetBreakdown(res.data.data);
    } catch (err) {
      console.error('Lỗi tải ngân sách 8%:', err);
    } finally {
      setLoadingBreakdown(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);
  useEffect(() => { if (activeTab === 'BUDGET_8_PERCENT') fetchBudgetBreakdown(); }, [activeTab, id]);

  const handleSelectFaculty = async (sub) => {
    setSelectedSubCamp(sub);
    try {
      const res = await axiosClient.get(`/api/khoa/campaigns/${sub.maDotXetHbKhoa}/dossiers`);
      if (res.data.success) setDossiers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoSync8Percent = async () => {
    if (window.confirm('Hệ thống sẽ tự động tính 8% tổng học phí thực tế của tất cả sinh viên thuộc từng Khoa và cập nhật trực tiếp vào Ngân sách & Chỉ tiêu của các Khoa. Xác nhận?')) {
      try {
        setSyncingBudget(true);
        const res = await axiosClient.post(`/api/truong/campaigns/${id}/auto-sync-8percent-budget`);
        if (res.data.success) {
          alert(res.data.message || 'Đã đồng bộ ngân sách 8% thành công!');
          fetchData();
          fetchBudgetBreakdown();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi đồng bộ ngân sách 8%');
      } finally {
        setSyncingBudget(false);
      }
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
      console.error('Lỗi tải điểm:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const handleOpenQuotaModal = (sub) => {
    setSelectedSubCamp(sub);
    setQuotaForm({ chiTieu: sub.chiTieu || 9, nganSach: sub.nganSachKhoa || 105300000 });
    setIsQuotaModalOpen(true);
  };

  const handleOpenQuotaModalByKhoaCode = (maKhoa) => {
    const sub = facultyCampaigns.find(f => f.maKhoa === maKhoa || f.khoa?.maKhoa === maKhoa);
    sub ? handleOpenQuotaModal(sub) : alert('Không tìm thấy thông tin phân bổ của khoa này');
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

  const handleExecuteReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post(`/api/truong/campaigns/faculty-campaigns/${selectedSubCamp.maDotXetHbKhoa}/review`, reviewAction);
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

  const filteredDossiers = dossiers.filter(d => {
    const s = search.toLowerCase();
    const matchSearch = !search || d.mssv?.toLowerCase().includes(s) || d.hoTen?.toLowerCase().includes(s) || d.maLop?.toLowerCase().includes(s);
    const matchKh = selectedKhoaHoc === 'ALL' || d.khoaHoc === selectedKhoaHoc;
    const matchNg = selectedNganh === 'ALL' || d.tenNganh === selectedNganh;
    const matchHe = selectedHeDaoTao === 'ALL' || (selectedHeDaoTao === 'CHUAN' && (!d.heDaoTao || d.heDaoTao === 'CHUAN')) || (selectedHeDaoTao === 'DAC_BIET' && (d.heDaoTao === 'DAC_BIET' || d.heDaoTao === 'CHAT_LUONG_CAO'));
    const matchLoai = selectedLoaiHb === 'ALL' || d.loaiHocBong === selectedLoaiHb;
    return matchSearch && matchKh && matchNg && matchHe && matchLoai;
  });

  const filteredBudgetBreakdown = budgetBreakdown.filter(item => {
    const s = budgetSearch.toLowerCase();
    const matchSearch = !budgetSearch || item.tenKhoa?.toLowerCase().includes(s) || item.maKhoa?.toLowerCase().includes(s) || item.tenNganh?.toLowerCase().includes(s) || item.maNganh?.toLowerCase().includes(s);
    const matchKh = budgetSelectedKhoa === 'ALL' || item.maKhoa === budgetSelectedKhoa;
    const matchKhHoc = budgetSelectedKhoaHoc === 'ALL' || item.khoaHoc === budgetSelectedKhoaHoc;
    const matchNg = budgetSelectedNganh === 'ALL' || item.tenNganh === budgetSelectedNganh;
    const matchHe = budgetSelectedHeDaoTao === 'ALL' || (budgetSelectedHeDaoTao === 'CHUAN' && (!item.heDaoTao || item.heDaoTao === 'CHUAN')) || (budgetSelectedHeDaoTao === 'DAC_BIET' && (item.heDaoTao === 'DAC_BIET' || item.heDaoTao === 'CHAT_LUONG_CAO'));
    return matchSearch && matchKh && matchKhHoc && matchNg && matchHe;
  });

  const uniqueKhoaHoc = Array.from(new Set(dossiers.map(d => d.khoaHoc).filter(Boolean)));
  const uniqueNganh = Array.from(new Set(dossiers.map(d => d.tenNganh).filter(Boolean)));
  const uniqueBudgetKhoas = Array.from(new Map(budgetBreakdown.map(item => [item.maKhoa, { maKhoa: item.maKhoa, tenKhoa: item.tenKhoa }])).values());
  const uniqueBudgetKhoaHocs = Array.from(new Set(budgetBreakdown.map(item => item.khoaHoc).filter(Boolean)));
  const uniqueBudgetNganhs = Array.from(new Set(budgetBreakdown.map(item => item.tenNganh).filter(Boolean)));

  const filteredStudents = filteredBudgetBreakdown.reduce((sum, item) => sum + (item.soSinhVienTong || 0), 0);
  const filteredTuitionSum = filteredBudgetBreakdown.reduce((sum, item) => sum + (Number(item.tongHocPhiThu) || 0), 0);
  const filtered8PercentFund = filteredBudgetBreakdown.reduce((sum, item) => sum + (Number(item.quyHocBong8PhanTram) || 0), 0);
  const totalAllocatedFacultyBudget = facultyCampaigns.reduce((sum, item) => sum + (Number(item.nganSachKhoa) || 0), 0);

  if (loading) return <LoadingSpinner text="Đang tải chi tiết đợt xét..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/truong/campaigns" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{campaign?.tenDot}</h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Mã đợt: {campaign?.maDot} | Học kỳ: {campaign?.tenHocKy}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {campaign?.trangThai !== 'DA_CONG_BO' ? (
            <button onClick={handlePublishOfficial} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition cursor-pointer">
              <Send className="w-4 h-4" /> Công bố Chính thức Toàn trường
            </button>
          ) : (
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Đã công bố kết quả toàn trường</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button onClick={() => setActiveTab('FACULTY_REVIEW')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${activeTab === 'FACULTY_REVIEW' ? 'bg-primary-700 text-white shadow-md shadow-primary-700/20' : 'text-slate-600 hover:bg-slate-100'}`}>
          <Building2 className="w-4 h-4" /> Duyệt Hồ sơ & Danh sách các Khoa ({facultyCampaigns.length})
        </button>
        <button onClick={() => setActiveTab('BUDGET_8_PERCENT')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${activeTab === 'BUDGET_8_PERCENT' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'text-slate-600 hover:bg-slate-100'}`}>
          <TrendingUp className="w-4 h-4" /> Phân bổ Ngân sách Quỹ 8% (Khoa - Khóa - Ngành)
        </button>
      </div>

      {activeTab === 'BUDGET_8_PERCENT' ? (
        <BudgetBreakdownTable
          budgetBreakdown={filteredBudgetBreakdown}
          loadingBreakdown={loadingBreakdown}
          syncingBudget={syncingBudget}
          onAutoSync={handleAutoSync8Percent}
          search={budgetSearch}
          setSearch={setBudgetSearch}
          selectedKhoa={budgetSelectedKhoa}
          setSelectedKhoa={setBudgetSelectedKhoa}
          selectedKhoaHoc={budgetSelectedKhoaHoc}
          setSelectedKhoaHoc={setBudgetSelectedKhoaHoc}
          selectedNganh={budgetSelectedNganh}
          setSelectedNganh={setBudgetSelectedNganh}
          selectedHeDaoTao={budgetSelectedHeDaoTao}
          setSelectedHeDaoTao={setBudgetSelectedHeDaoTao}
          uniqueKhoas={uniqueBudgetKhoas}
          uniqueKhoaHocs={uniqueBudgetKhoaHocs}
          uniqueNganhs={uniqueBudgetNganhs}
          filteredStudents={filteredStudents}
          filteredTuitionSum={filteredTuitionSum}
          filtered8PercentFund={filtered8PercentFund}
          totalAllocatedBudget={totalAllocatedFacultyBudget}
          onOpenQuotaModalByKhoaCode={handleOpenQuotaModalByKhoaCode}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <FacultySubCampaignList
            facultyCampaigns={facultyCampaigns}
            selectedSubCamp={selectedSubCamp}
            onSelectFaculty={handleSelectFaculty}
            onOpenQuotaModal={handleOpenQuotaModal}
            onOpenReviewModal={(sub, approve) => {
              setSelectedSubCamp(sub);
              setReviewAction({ approve, lyDo: approve ? 'Hồ sơ đạt yêu cầu, đồng ý phê duyệt' : 'Cần rà soát lại chỉ tiêu hoặc danh sách' });
              setIsReviewModalOpen(true);
            }}
          />

          <div className="lg:col-span-3 space-y-4">
            <DossierTable
              dossiers={filteredDossiers}
              search={search}
              setSearch={setSearch}
              selectedKhoaHoc={selectedKhoaHoc}
              setSelectedKhoaHoc={setSelectedKhoaHoc}
              selectedNganh={selectedNganh}
              setSelectedNganh={setSelectedNganh}
              selectedHeDaoTao={selectedHeDaoTao}
              setSelectedHeDaoTao={setSelectedHeDaoTao}
              selectedLoaiHb={selectedLoaiHb}
              setSelectedLoaiHb={setSelectedLoaiHb}
              uniqueKhoaHoc={uniqueKhoaHoc}
              uniqueNganh={uniqueNganh}
              onViewGrades={handleViewGrades}
            />
          </div>
        </div>
      )}

      <QuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        selectedSubCamp={selectedSubCamp}
        quotaForm={quotaForm}
        setQuotaForm={setQuotaForm}
        onSubmit={handleSaveQuota}
      />

      <ReviewDecisionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        selectedSubCamp={selectedSubCamp}
        reviewAction={reviewAction}
        setReviewAction={setReviewAction}
        onSubmit={handleExecuteReview}
      />

      <GradesDetailModal
        isOpen={showGradesModal}
        onClose={() => { setShowGradesModal(false); setStudentGrades(null); }}
        loadingGrades={loadingGrades}
        studentGrades={studentGrades}
      />
    </div>
  );
};
export default CampaignReviewDetail;
