import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Play, Send, CheckCircle, ArrowLeft, Download, AlertTriangle, Clock, RefreshCw, MessageSquare, BookOpen, FileSpreadsheet, Eye, X, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const KhoaCampaignDetail = () => {
  const { id } = useParams();
  const [subCamp, setSubCamp] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningEngine, setRunningEngine] = useState(false);
  const [studentGrades, setStudentGrades] = useState(null);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [showGradesModal, setShowGradesModal] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState('ALL');
  const [selectedNganh, setSelectedNganh] = useState('ALL');
  const [selectedHeDaoTao, setSelectedHeDaoTao] = useState('ALL');
  const [selectedLoaiHb, setSelectedLoaiHb] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rSub, rDossiers] = await Promise.all([
        axiosClient.get(`/api/khoa/campaigns/${id}`),
        axiosClient.get(`/api/khoa/campaigns/${id}/dossiers`)
      ]);

      if (rSub.data.success) setSubCamp(rSub.data.data);
      if (rDossiers.data.success) setDossiers(rDossiers.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Trigger Dynamic Rule Engine Execution
  const handleRunRuleEngine = async () => {
    try {
      setRunningEngine(true);
      const res = await axiosClient.post(`/api/khoa/campaigns/${id}/run-ranking`);
      setRunningEngine(false);
      if (res.data.success) {
        alert('Dynamic Rule Engine đã tính toán và xếp hạng sinh viên thành công!');
        fetchData();
      }
    } catch (err) {
      setRunningEngine(false);
      alert(err.response?.data?.message || 'Lỗi khi thực thi Rule Engine');
    }
  };

  // Publish preliminary list to students
  const handlePublishDuKien = async () => {
    if (window.confirm('Xác nhận CÔNG BỐ DỰ KIẾN? Sinh viên sẽ có thể xem kết quả xếp hạng và nộp kiến nghị/khiếu nại nếu có sai sót.')) {
      try {
        const res = await axiosClient.post(`/api/khoa/campaigns/${id}/publish-du-kien`);
        alert(res.data.message);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi công bố dự kiến');
      }
    }
  };

  // Finalize & submit to university
  const handleChotDanhSach = async () => {
    if (window.confirm('Xác nhận CHỐT DANH SÁCH & GỬI LÊN CẤP TRƯỜNG? Hãy chắc chắn rằng bạn đã xử lý hết các kiến nghị của sinh viên.')) {
      try {
        const res = await axiosClient.post(`/api/khoa/campaigns/${id}/chot-danh-sach`);
        alert(res.data.message);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi chốt danh sách');
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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'CHUA_XET':
        return <Badge variant="slate">Chưa xét duyệt</Badge>;
      case 'DA_CONG_BO_DU_KIEN':
        return <Badge variant="blue">Đã công bố dự kiến</Badge>;
      case 'DA_CHOT_GUI_TRUONG':
        return <Badge variant="purple">Đã chốt gửi cấp trường</Badge>;
      case 'DA_PHE_DUYET':
        return <Badge variant="emerald">Trường đã phê duyệt</Badge>;
      case 'BI_TRA_VE':
        return <Badge variant="rose">Bị trả về yêu cầu sửa</Badge>;
      default:
        return <Badge>{st}</Badge>;
    }
  };

  // Unique Filter Options
  const uniqueKhoaHoc = Array.from(new Set(dossiers.map((d) => d.khoaHoc).filter(Boolean)));
  const uniqueNganh = Array.from(new Set(dossiers.map((d) => d.tenNganh).filter(Boolean)));

  // Filtered Dossiers
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

  // Statistics
  const countXuatSac = dossiers.filter((d) => d.loaiHocBong === 'XUAT_SAC' && d.mucHocBong > 0).length;
  const countGioi = dossiers.filter((d) => d.loaiHocBong === 'GIOI' && d.mucHocBong > 0).length;
  const countKha = dossiers.filter((d) => d.loaiHocBong === 'KHA' && d.mucHocBong > 0).length;
  const totalAllocated = dossiers.reduce((acc, cur) => acc + (parseFloat(cur.mucHocBong) || 0), 0);

  // Group dossiers by Major & Cohort to show 8% fund details
  const cohortMajorGroups = Object.values(
    dossiers.reduce((acc, d) => {
      const key = `${d.tenNganh || 'Ngành khác'} - ${d.khoaHoc || 'Khóa khác'}`;
      if (!acc[key]) {
        acc[key] = {
          key,
          tenNganh: d.tenNganh || 'Ngành khác',
          khoaHoc: d.khoaHoc || 'Khóa khác',
          heDaoTao: d.heDaoTao || 'CHUAN',
          totalSV: 0,
          totalTuition: 0,
          awardedCount: 0,
          totalAwarded: 0,
        };
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
      {/* Header */}
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
          {/* Button 1: Run Engine */}
          <button
            onClick={handleRunRuleEngine}
            disabled={runningEngine || subCamp?.trangThai === 'DA_CHOT_GUI_TRUONG' || subCamp?.trangThai === 'DA_PHE_DUYET'}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-700/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {runningEngine ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Chạy Dynamic Rule Engine
          </button>

          {/* Button 2: Publish Preliminary */}
          {subCamp?.trangThai === 'CHUA_XET' && (
            <button
              onClick={handlePublishDuKien}
              disabled={dossiers.length === 0}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-700/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Công bố Dự kiến
            </button>
          )}

          {/* Button 3: Finalize & Submit */}
          {subCamp?.trangThai === 'DA_CONG_BO_DU_KIEN' && (
            <button
              onClick={handleChotDanhSach}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Chốt Danh sách Gửi Trường
            </button>
          )}

          {subCamp?.trangThai === 'BI_TRA_VE' && (
            <button
              onClick={handleChotDanhSach}
              className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-700/20 transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Gửi lại Cấp trường sau điều chỉnh
            </button>
          )}
        </div>
      </div>

      {/* Info Status Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <span className="text-slate-400 text-xs block">Trạng thái đợt xét</span>
          <div className="mt-1">{getStatusBadge(subCamp?.trangThai)}</div>
        </div>

        <div>
          <span className="text-slate-400 text-xs block">Chỉ tiêu Khoa được cấp</span>
          <span className="text-base font-bold text-slate-800 mt-1 block">
            {subCamp?.chiTieu || 0} suất
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-xs block">Hạn mức Ngân sách</span>
          <span className="text-base font-bold text-emerald-700 mt-1 block">
            {formatCurrency(subCamp?.nganSachKhoa)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-xs block">Đã cấp học bổng</span>
          <span className="text-base font-bold text-blue-700 mt-1 block">
            {formatCurrency(totalAllocated)}
          </span>
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

      {/* Summary Cards by Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800">Xuất sắc (100% HP)</span>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">{countXuatSac} sinh viên</div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-white px-2.5 py-1 rounded-lg border border-emerald-100">100%</span>
        </div>
        <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-800">Giỏi (70% HP)</span>
            <div className="text-xl font-extrabold text-blue-700 mt-0.5">{countGioi} sinh viên</div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-100">70%</span>
        </div>
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800">Khá (50% HP)</span>
            <div className="text-xl font-extrabold text-amber-700 mt-0.5">{countKha} sinh viên</div>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-white px-2.5 py-1 rounded-lg border border-amber-100">50%</span>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700">Tổng sinh viên xét</span>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{dossiers.length} sinh viên</div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">Khoa</span>
        </div>
      </div>

      {/* Quỹ Học Bổng 8% Phân bổ theo từng Ngành & Khóa học */}
      {cohortMajorGroups.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Quỹ Học Bổng 8% Phân bổ theo từng Ngành & Khóa học ({cohortMajorGroups.length} nhóm)
            </h3>
            <span className="text-xs text-slate-500 font-medium">* Xét duyệt & xếp thứ tự riêng biệt cho từng nhóm (Ngành - Khóa)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cohortMajorGroups.map((g) => {
              const fund8 = g.totalTuition * 0.08;
              return (
                <div key={g.key} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{g.tenNganh}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-primary-100 text-primary-800 rounded-md">
                      {g.khoaHoc}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Tổng học phí thu:</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(g.totalTuition)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Quỹ 8% học bổng:</span>
                      <span className="font-black text-emerald-700">{formatCurrency(fund8)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Đã cấp: <strong>{g.awardedCount} / {g.totalSV} SV</strong></span>
                    <span className="font-bold text-emerald-700">{formatCurrency(g.totalAwarded)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Toolbar: Cohort, Major, Training Program, Tier */}
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
          {/* Search Box */}
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

          {/* Filter by Cohort (Khóa học) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Khóa học</label>
            <select
              value={selectedKhoaHoc}
              onChange={(e) => setSelectedKhoaHoc(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">-- Tất cả Khóa học --</option>
              {uniqueKhoaHoc.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Major (Ngành học) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ngành học</label>
            <select
              value={selectedNganh}
              onChange={(e) => setSelectedNganh(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">-- Tất cả Ngành học --</option>
              {uniqueNganh.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Program (Chương trình đào tạo / Hệ đào tạo) */}
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

          {/* Filter by Scholarship Tier */}
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
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Danh sách kết quả tính điểm & xếp hạng sinh viên
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiển thị <strong>{filteredDossiers.length}</strong> / <strong>{dossiers.length}</strong> sinh viên theo bộ lọc
            </p>
          </div>

          <div className="text-xs font-medium text-slate-500">
            * Cấp từ thứ hạng 1 xuống dưới đến khi hết Quỹ học bổng khoa
          </div>
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
                <th className="px-4 py-3">Phân loại HB</th>
                <th className="px-4 py-3 text-right">Tiền HB nhận</th>
                <th className="px-4 py-3 text-center">Bảng điểm</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredDossiers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-12 text-slate-400">
                    <p className="text-base font-semibold">Không tìm thấy sinh viên phù hợp</p>
                    <p className="text-xs mt-1">
                      {dossiers.length === 0
                        ? 'Bấm nút "Chạy Dynamic Rule Engine" ở trên để hệ thống tự động lọc và xếp thứ tự'
                        : 'Thử điều chỉnh lại bộ lọc Khóa, Ngành hoặc Chương trình đào tạo'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDossiers.map((hs) => {
                  const isAwarded = hs.mucHocBong && parseFloat(hs.mucHocBong) > 0;
                  return (
                    <tr
                      key={hs.maHoSo}
                      className={`hover:bg-slate-50/80 transition-colors ${isAwarded ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {hs.thuHang != null ? (
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              isAwarded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
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

export default KhoaCampaignDetail;
