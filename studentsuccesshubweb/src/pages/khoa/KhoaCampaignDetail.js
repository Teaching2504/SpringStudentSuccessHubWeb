import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Play, Send, CheckCircle, ArrowLeft, AlertTriangle, RefreshCw, MessageSquare } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import CohortMajorSummary from './components/CohortMajorSummary';
import KhoaDossierTable from './components/KhoaDossierTable';
import KhoaGradesModal from './components/KhoaGradesModal';

const KhoaCampaignDetail = () => {
  const { id } = useParams();
  const [subCamp, setSubCamp] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningEngine, setRunningEngine] = useState(false);
  const [studentGrades, setStudentGrades] = useState(null);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [showGradesModal, setShowGradesModal] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState('ALL');
  const [selectedNganh, setSelectedNganh] = useState('ALL');
  const [selectedHeDaoTao, setSelectedHeDaoTao] = useState('ALL');
  const [selectedLoaiHb, setSelectedLoaiHb] = useState('ALL');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rSub, rDossiers] = await Promise.all([
        axiosClient.get(`/api/khoa/campaigns/${id}`),
        axiosClient.get(`/api/khoa/campaigns/${id}/dossiers`)
      ]);
      if (rSub.data.success) setSubCamp(rSub.data.data);
      if (rDossiers.data.success) setDossiers(rDossiers.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunRuleEngine = async () => {
    try {
      setRunningEngine(true);
      const res = await axiosClient.post(`/api/khoa/campaigns/${id}/run-ranking`);
      if (res.data.success) {
        alert('Dynamic Rule Engine đã tính toán và xếp hạng sinh viên thành công!');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi thực thi Rule Engine');
    } finally {
      setRunningEngine(false);
    }
  };

  const handleAction = async (endpoint, confirmMsg, successMsg) => {
    if (window.confirm(confirmMsg)) {
      try {
        const res = await axiosClient.post(`/api/khoa/campaigns/${id}/${endpoint}`);
        alert(res.data.message || successMsg);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    }
  };

  const handleViewGrades = async (mssv) => {
    setLoadingGrades(true);
    setShowGradesModal(true);
    try {
      const maHocKy = subCamp?.maHocKy || 'HK1_2025_2026';
      const res = await axiosClient.get(`/api/common/danh-muc/grades/${mssv}?maHocKy=${maHocKy}`);
      setStudentGrades(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi tải điểm chi tiết:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const uniqueKhoaHoc = Array.from(new Set(dossiers.map(d => d.khoaHoc).filter(Boolean)));
  const uniqueNganh = Array.from(new Set(dossiers.map(d => d.tenNganh).filter(Boolean)));

  const filteredDossiers = dossiers.filter(d => {
    const s = search.toLowerCase();
    const matchSearch = !search || d.mssv?.toLowerCase().includes(s) || d.hoTen?.toLowerCase().includes(s) || d.maLop?.toLowerCase().includes(s);
    const matchKhoaHoc = selectedKhoaHoc === 'ALL' || d.khoaHoc === selectedKhoaHoc;
    const matchNganh = selectedNganh === 'ALL' || d.tenNganh === selectedNganh;
    const matchHeDaoTao = selectedHeDaoTao === 'ALL' ||
      (selectedHeDaoTao === 'CHUAN' && (!d.heDaoTao || d.heDaoTao === 'CHUAN')) ||
      (selectedHeDaoTao === 'DAC_BIET' && (d.heDaoTao === 'DAC_BIET' || d.heDaoTao === 'CHAT_LUONG_CAO'));
    const matchLoaiHb = selectedLoaiHb === 'ALL' || d.loaiHocBong === selectedLoaiHb;
    return matchSearch && matchKhoaHoc && matchNganh && matchHeDaoTao && matchLoaiHb;
  });

  const countXuatSac = dossiers.filter(d => d.loaiHocBong === 'XUAT_SAC' && d.mucHocBong > 0).length;
  const countGioi = dossiers.filter(d => d.loaiHocBong === 'GIOI' && d.mucHocBong > 0).length;
  const countKha = dossiers.filter(d => d.loaiHocBong === 'KHA' && d.mucHocBong > 0).length;
  const totalAllocated = dossiers.reduce((acc, cur) => acc + (parseFloat(cur.mucHocBong) || 0), 0);

  const cohortMajorGroups = Object.values(
    dossiers.reduce((acc, d) => {
      const key = `${d.tenNganh || 'Ngành khác'} - ${d.khoaHoc || 'Khóa khác'}`;
      if (!acc[key]) {
        acc[key] = { key, tenNganh: d.tenNganh || 'Ngành khác', khoaHoc: d.khoaHoc || 'Khóa khác', totalSV: 0, totalTuition: 0, awardedCount: 0, totalAwarded: 0 };
      }
      acc[key].totalSV += 1;
      acc[key].totalTuition += Number(d.tongHocPhiKy) || 0;
      if (d.mucHocBong && parseFloat(d.mucHocBong) > 0) {
        acc[key].awardedCount += 1;
        acc[key].totalAwarded += parseFloat(d.mucHocBong);
      }
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/khoa" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{subCamp?.tenDot}</h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Đơn vị: <strong>{subCamp?.tenKhoa}</strong> | Hạn phản hồi kiến nghị: <strong>{subCamp?.hanPhanHoi}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunRuleEngine}
            disabled={runningEngine || ['DA_CHOT_GUI_TRUONG', 'DA_PHE_DUYET'].includes(subCamp?.trangThai)}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-700/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {runningEngine ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Chạy Dynamic Rule Engine
          </button>
          {subCamp?.trangThai === 'CHUA_XET' && (
            <button
              onClick={() => handleAction('publish-du-kien', 'Xác nhận CÔNG BỐ DỰ KIẾN? Sinh viên sẽ có thể xem kết quả xếp hạng và nộp kiến nghị/khiếu nại nếu có sai sót.')}
              disabled={dossiers.length === 0}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-700/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Công bố Dự kiến
            </button>
          )}
          {subCamp?.trangThai === 'DA_CONG_BO_DU_KIEN' && (
            <button
              onClick={() => handleAction('chot-danh-sach', 'Xác nhận CHỐT DANH SÁCH & GỬI LÊN CẤP TRƯỜNG? Hãy chắc chắn rằng bạn đã xử lý hết các kiến nghị của sinh viên.')}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Chốt Danh sách Gửi Trường
            </button>
          )}
          {subCamp?.trangThai === 'BI_TRA_VE' && (
            <button
              onClick={() => handleAction('chot-danh-sach', 'Xác nhận GỬI LẠI CẤP TRƯỜNG sau khi đã điều chỉnh?')}
              className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-700/20 transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Gửi lại Cấp trường sau điều chỉnh
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <span className="text-slate-400 text-xs block">Trạng thái đợt xét</span>
          <div className="mt-1"><Badge status={subCamp?.trangThai} /></div>
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Chỉ tiêu Khoa được cấp</span>
          <span className="text-base font-bold text-slate-800 mt-1 block">{subCamp?.chiTieu || 0} suất</span>
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Hạn mức Ngân sách</span>
          <span className="text-base font-bold text-emerald-700 mt-1 block">{formatCurrency(subCamp?.nganSachKhoa)}</span>
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Đã cấp học bổng</span>
          <span className="text-base font-bold text-blue-700 mt-1 block">{formatCurrency(totalAllocated)}</span>
        </div>
        <div>
          <span className="text-slate-400 text-xs block">Kiến nghị chưa xử lý</span>
          <span className="text-base font-bold text-rose-700 mt-1 block flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> {subCamp?.soKienNghiChuaXuLy || 0} kiến nghị
          </span>
        </div>
      </div>

      {subCamp?.lyDoTraVe && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="text-sm font-bold block mb-0.5">Yêu cầu điều chỉnh từ Cán bộ Trường:</strong>
            <p>{subCamp.lyDoTraVe}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Xuất sắc (100% HP)', count: countXuatSac, pct: '100%', bg: 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800', txt: 'text-emerald-700', tag: 'border-emerald-100 text-emerald-600' },
          { label: 'Giỏi (70% HP)', count: countGioi, pct: '70%', bg: 'bg-blue-50/70 border-blue-200/80 text-blue-800', txt: 'text-blue-700', tag: 'border-blue-100 text-blue-600' },
          { label: 'Khá (50% HP)', count: countKha, pct: '50%', bg: 'bg-amber-50/70 border-amber-200/80 text-amber-800', txt: 'text-amber-700', tag: 'border-amber-100 text-amber-600' },
          { label: 'Tổng sinh viên xét', count: dossiers.length, pct: 'Khoa', bg: 'bg-slate-50 border-slate-200 text-slate-700', txt: 'text-slate-800', tag: 'border-slate-200 text-slate-600' },
        ].map((c, i) => (
          <div key={i} className={`p-4 border rounded-2xl flex items-center justify-between ${c.bg}`}>
            <div>
              <span className={`text-xs font-semibold ${c.bg.split(' ')[3]}`}>{c.label}</span>
              <div className={`text-xl font-extrabold mt-0.5 ${c.txt}`}>{c.count} sinh viên</div>
            </div>
            <span className={`text-xs font-bold bg-white px-2.5 py-1 rounded-lg border ${c.tag}`}>{c.pct}</span>
          </div>
        ))}
      </div>

      <CohortMajorSummary cohortMajorGroups={cohortMajorGroups} />

      <KhoaDossierTable
        search={search}
        setSearch={setSearch}
        selectedKhoaHoc={selectedKhoaHoc}
        setSelectedKhoaHoc={setSelectedKhoaHoc}
        uniqueKhoaHoc={uniqueKhoaHoc}
        selectedNganh={selectedNganh}
        setSelectedNganh={setSelectedNganh}
        uniqueNganh={uniqueNganh}
        selectedHeDaoTao={selectedHeDaoTao}
        setSelectedHeDaoTao={setSelectedHeDaoTao}
        selectedLoaiHb={selectedLoaiHb}
        setSelectedLoaiHb={setSelectedLoaiHb}
        filteredDossiers={filteredDossiers}
        totalDossiersCount={dossiers.length}
        onViewGrades={handleViewGrades}
      />

      <KhoaGradesModal
        isOpen={showGradesModal}
        onClose={() => { setShowGradesModal(false); setStudentGrades(null); }}
        loadingGrades={loadingGrades}
        studentGrades={studentGrades}
      />
    </div>
  );
};

export default KhoaCampaignDetail;
