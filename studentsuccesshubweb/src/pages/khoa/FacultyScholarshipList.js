import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import {
  Award,
  Search,
  Filter,
  Download,
  Printer,
  BookOpen,
  DollarSign,
  Users,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  Calendar,
  Layers,
  ChevronDown,
  RefreshCw,
  X,
  AlertTriangle,
  Eye,
  CheckCircle
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const FacultyScholarshipList = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [lops, setLops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDot, setSelectedDot] = useState('ALL');
  const [selectedLoaiHb, setSelectedLoaiHb] = useState('ALL');
  const [selectedTrangThai, setSelectedTrangThai] = useState('ALL');
  const [selectedLop, setSelectedLop] = useState('ALL');
  const [selectedHeDaoTao, setSelectedHeDaoTao] = useState('ALL');
  const [search, setSearch] = useState('');

  const [studentGrades, setStudentGrades] = useState(null);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  const maKhoa = user?.maKhoa || 'IT';

  useEffect(() => {
    fetchMetadata();
  }, [maKhoa]);

  useEffect(() => {
    fetchScholarships();
  }, [maKhoa, selectedDot, selectedLoaiHb, selectedTrangThai]);

  const fetchMetadata = async () => {
    try {
      const [rCamp, rLop] = await Promise.all([
        axiosClient.get(`/api/khoa/campaigns?maKhoa=${maKhoa}`),
        axiosClient.get(`/api/common/danh-muc/lop?maKhoa=${maKhoa}`)
      ]);
      if (rCamp.data.success) setCampaigns(rCamp.data.data);
      if (rLop.data.success) setLops(rLop.data.data);
    } catch (err) {
      console.error('Lỗi tải danh mục:', err);
    }
  };

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('maKhoa', maKhoa);
      if (selectedDot && selectedDot !== 'ALL') params.append('maDot', selectedDot);
      if (selectedLoaiHb && selectedLoaiHb !== 'ALL') params.append('loaiHocBong', selectedLoaiHb);
      if (selectedTrangThai && selectedTrangThai !== 'ALL') params.append('trangThai', selectedTrangThai);
      if (search) params.append('search', search);

      const res = await axiosClient.get(`/api/khoa/scholarships?${params.toString()}`);
      if (res.data.success) {
        setScholarships(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Lỗi tải danh sách học bổng:', err);
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    return scholarships.filter((item) => {
      if (selectedLop !== 'ALL' && item.maLop !== selectedLop) return false;
      if (selectedHeDaoTao !== 'ALL') {
        const isDacBiet = item.heDaoTao === 'DAC_BIET' || item.heDaoTao === 'CHAT_LUONG_CAO';
        if (selectedHeDaoTao === 'DAC_BIET' && !isDacBiet) return false;
        if (selectedHeDaoTao === 'CHUAN' && isDacBiet) return false;
      }
      if (search.trim()) {
        const kw = search.toLowerCase().trim();
        const mssvMatch = item.mssv?.toLowerCase().includes(kw);
        const nameMatch = item.hoTen?.toLowerCase().includes(kw);
        const lopMatch = item.maLop?.toLowerCase().includes(kw);
        const nganhMatch = item.tenNganh?.toLowerCase().includes(kw);
        if (!mssvMatch && !nameMatch && !lopMatch && !nganhMatch) return false;
      }
      return true;
    });
  }, [scholarships, selectedLop, selectedHeDaoTao, search]);

  const stats = useMemo(() => {
    const totalAwardees = filteredList.filter((s) => s.loaiHocBong && s.loaiHocBong !== 'KHONG_DAT' && (parseFloat(s.mucHocBong || 0) > 0 || parseFloat(s.soTienNhanDuoc || 0) > 0)).length;
    const totalAmount = filteredList.reduce((sum, s) => sum + (parseFloat(s.soTienNhanDuoc || s.mucHocBong) || 0), 0);
    const countXuatSac = filteredList.filter((s) => s.loaiHocBong === 'XUAT_SAC' && (parseFloat(s.soTienNhanDuoc || s.mucHocBong) || 0) > 0).length;
    const countGioi = filteredList.filter((s) => s.loaiHocBong === 'GIOI' && (parseFloat(s.soTienNhanDuoc || s.mucHocBong) || 0) > 0).length;
    const countKha = filteredList.filter((s) => s.loaiHocBong === 'KHA' && (parseFloat(s.soTienNhanDuoc || s.mucHocBong) || 0) > 0).length;

    return { totalAwardees, totalAmount, countXuatSac, countGioi, countKha };
  }, [filteredList]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const handleViewGrades = async (hs) => {
    setSelectedStudentForModal(hs);
    setLoadingGrades(true);
    setShowGradesModal(true);
    try {
      const maHocKy = hs.maHocKy || 'HK1_2025_2026';
      const res = await axiosClient.get(`/api/common/danh-muc/grades/${hs.mssv}?maHocKy=${maHocKy}`);
      setStudentGrades(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi tải điểm chi tiết:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredList.length === 0) {
      alert('Không có dữ liệu để xuất file');
      return;
    }

    const headers = [
      'STT',
      'Thứ hạng',
      'MSSV',
      'Họ và Tên',
      'Lớp',
      'Ngành',
      'Chương trình ĐT',
      'Đợt xét / Học kỳ',
      'Điểm GPA (Hệ 4)',
      'Điểm Rèn Luyện (ĐRL)',
      'Số Tín Chỉ',
      'Điểm Xét Tuyển',
      'Loại Học Bổng',
      'Tỷ lệ % Học Phí',
      'Học Phí Học Kỳ (VNĐ)',
      'Số Tiền Học Bổng (VNĐ)',
      'Trạng Thái',
      'Cấp Quỹ'
    ];

    const rows = filteredList.map((item, index) => [
      index + 1,
      item.thuHang || '',
      `"${item.mssv}"`,
      `"${item.hoTen}"`,
      `"${item.maLop || ''}"`,
      `"${item.tenNganh || ''}"`,
      item.heDaoTao === 'DAC_BIET' || item.heDaoTao === 'CHAT_LUONG_CAO' ? 'Chất lượng cao' : 'Chuẩn (Đại trà)',
      `"${item.tenDot || item.maDot || ''}"`,
      item.diemTrungBinh != null ? item.diemTrungBinh : '',
      item.diemRenLuyen != null ? item.diemRenLuyen : '',
      item.soTinChi || '',
      item.diemXet != null ? item.diemXet : '',
      item.loaiHocBong || '',
      item.tyLeHocBong ? `${item.tyLeHocBong}%` : '',
      item.tongHocPhiKy || 0,
      item.soTienNhanDuoc || item.mucHocBong || 0,
      item.trangThai || '',
      item.trangThaiCapQuy || ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Danh_Sach_SV_Dat_Hoc_Bong_${maKhoa}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Danh Sách Sinh Viên Đạt Học Bổng</h1>
            <Badge variant="primary">{user?.tenKhoa || 'Khoa'}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp kết quả xét học bổng Khuyến khích học tập toàn khoa
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchScholarships}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Xuất Excel / CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> In Danh Sách
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Tổng SV Nhận HB</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.totalAwardees} SV</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Tổng Tiền Trao HB</span>
          <div className="text-lg font-black text-emerald-700 mt-1">{formatCurrency(stats.totalAmount)}</div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
          <span className="text-xs text-emerald-800 font-bold block">Xuất Sắc (100% HP)</span>
          <div className="text-xl font-black text-emerald-700 mt-1">{stats.countXuatSac} SV</div>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80">
          <span className="text-xs text-blue-800 font-bold block">Giỏi (70% HP)</span>
          <div className="text-xl font-black text-blue-700 mt-1">{stats.countGioi} SV</div>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
          <span className="text-xs text-amber-800 font-bold block">Khá (50% HP)</span>
          <div className="text-xl font-black text-amber-700 mt-1">{stats.countKha} SV</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm MSSV, họ tên, lớp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedDot}
              onChange={(e) => setSelectedDot(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả đợt xét</option>
              {campaigns.map((c) => (
                <option key={c.id || c.maDot} value={c.maDot}>
                  {c.tenDot || c.maDot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLoaiHb}
              onChange={(e) => setSelectedLoaiHb(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả loại học bổng</option>
              <option value="XUAT_SAC">Loại Xuất Sắc</option>
              <option value="GIOI">Loại Giỏi</option>
              <option value="KHA">Loại Khá</option>
            </select>
          </div>

          <div>
            <select
              value={selectedLop}
              onChange={(e) => setSelectedLop(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả các lớp</option>
              {lops.map((l) => (
                <option key={l.maLop || l.id} value={l.maLop}>
                  Lớp {l.maLop} {l.tenLop ? `(${l.tenLop})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedHeDaoTao}
              onChange={(e) => setSelectedHeDaoTao(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả hệ đào tạo</option>
              <option value="CHUAN">Chuẩn (Đại trà)</option>
              <option value="DAC_BIET">Chất lượng cao</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-4 py-3 text-center">Hạng</th>
                <th className="px-4 py-3">Sinh viên</th>
                <th className="px-4 py-3">Lớp & Ngành</th>
                <th className="px-4 py-3 text-center">GPA / ĐRL</th>
                <th className="px-4 py-3 text-center">Tín chỉ</th>
                <th className="px-4 py-3 text-center">Loại Học Bổng</th>
                <th className="px-4 py-3 text-right">Số Tiền (VNĐ)</th>
                <th className="px-4 py-3 text-center">Trạng Thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10">
                    <div className="inline-block w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-xs text-slate-400">Đang tải danh sách học bổng...</p>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-400">
                    Không tìm thấy sinh viên nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => {
                  const isAwarded = item.loaiHocBong && item.loaiHocBong !== 'KHONG_DAT' && (parseFloat(item.soTienNhanDuoc || item.mucHocBong || 0) > 0);
                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {item.thuHang ? (
                          <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px]">
                            {item.thuHang}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{item.hoTen}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{item.mssv}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{item.maLop}</div>
                        <div className="text-[11px] text-slate-500">{item.tenNganh}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="font-bold text-primary-700">
                          GPA: {item.diemTrungBinh != null ? Number(item.diemTrungBinh).toFixed(2) : '-'}
                        </div>
                        <div className="text-[11px] font-semibold text-purple-700">
                          ĐRL: {item.diemRenLuyen != null ? item.diemRenLuyen : '-'} đ
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700">
                        {item.soTinChi || 0} TC
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.loaiHocBong === 'XUAT_SAC' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                            <Award className="w-3 h-3" /> Xuất sắc (100%)
                          </span>
                        ) : item.loaiHocBong === 'GIOI' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 inline-flex items-center gap-1">
                            <Award className="w-3 h-3" /> Giỏi (70%)
                          </span>
                        ) : item.loaiHocBong === 'KHA' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 inline-flex items-center gap-1">
                            <Award className="w-3 h-3" /> Khá (50%)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Không đạt</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-black font-mono text-emerald-700">
                        {formatCurrency(item.soTienNhanDuoc || item.mucHocBong)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.trangThai === 'CHINH_THUC' || item.trangThai === 'DA_DUYET' ? (
                          <Badge variant="emerald">Chính thức</Badge>
                        ) : item.trangThai === 'DU_KIEN' ? (
                          <Badge variant="blue">Dự kiến</Badge>
                        ) : (
                          <Badge variant="slate">{item.trangThai || 'Chưa duyệt'}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleViewGrades(item)}
                          className="px-2.5 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Bảng điểm
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showGradesModal}
        onClose={() => setShowGradesModal(false)}
        title={`Bảng điểm chi tiết: ${selectedStudentForModal?.hoTen || ''} (${selectedStudentForModal?.mssv || ''})`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          {loadingGrades ? (
            <div className="py-8 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-xs">Đang tải bảng điểm chi tiết...</p>
            </div>
          ) : studentGrades?.danhSachDiemMonHoc?.length > 0 ? (
            <div>
              <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between text-xs">
                <span>Tổng số tín chỉ: <strong>{studentGrades.tongSoTinChi} TC</strong></span>
                <span>Học phí học kỳ: <strong className="text-primary-700">{formatCurrency(studentGrades.tongHocPhiHocKy)}</strong></span>
                <span>GPA Học kỳ: <strong className="text-emerald-700">{studentGrades.gpaHe4 != null ? Number(studentGrades.gpaHe4).toFixed(2) : '-'} (Hệ 4)</strong></span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-slate-100 text-slate-500 uppercase">
                    <tr>
                      <th className="px-3 py-2">Mã MH</th>
                      <th className="px-3 py-2">Tên Môn</th>
                      <th className="px-3 py-2 text-center">TC</th>
                      <th className="px-3 py-2 text-center">CC (10%)</th>
                      <th className="px-3 py-2 text-center">GK (30%)</th>
                      <th className="px-3 py-2 text-center">CK (60%)</th>
                      <th className="px-3 py-2 text-center">Tổng kết 10</th>
                      <th className="px-3 py-2 text-center">Hệ 4</th>
                      <th className="px-3 py-2 text-center">Điểm chữ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentGrades.danhSachDiemMonHoc.map((m, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-mono font-bold text-slate-700">{m.maMon}</td>
                        <td className="px-3 py-2">{m.tenMon}</td>
                        <td className="px-3 py-2 text-center">{m.soTinChi}</td>
                        <td className="px-3 py-2 text-center">{m.diemChuyenCan != null ? Number(m.diemChuyenCan).toFixed(1) : '-'}</td>
                        <td className="px-3 py-2 text-center">{m.diemGiuaKy != null ? Number(m.diemGiuaKy).toFixed(1) : '-'}</td>
                        <td className="px-3 py-2 text-center">{m.diemCuoiKy != null ? Number(m.diemCuoiKy).toFixed(1) : '-'}</td>
                        <td className="px-3 py-2 text-center font-bold">{m.diemTongKet10 != null ? Number(m.diemTongKet10).toFixed(1) : '-'}</td>
                        <td className="px-3 py-2 text-center font-bold text-primary-700">{m.diemHe4 != null ? Number(m.diemHe4).toFixed(2) : '-'}</td>
                        <td className="px-3 py-2 text-center font-bold">{m.diemChu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">Chưa có bảng điểm chi tiết cho học kỳ này</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FacultyScholarshipList;
