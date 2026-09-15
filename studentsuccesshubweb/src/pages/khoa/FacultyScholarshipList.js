import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Download, Printer, RefreshCw } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import FacultyScholarshipTable from './components/FacultyScholarshipTable';
import StudentGradesModal from './components/StudentGradesModal';

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
    Promise.all([
      axiosClient.get(`/api/khoa/campaigns?maKhoa=${maKhoa}`),
      axiosClient.get(`/api/common/danh-muc/lop?maKhoa=${maKhoa}`)
    ]).then(([rCamp, rLop]) => {
      if (rCamp.data.success) setCampaigns(rCamp.data.data);
      if (rLop.data.success) setLops(rLop.data.data);
    }).catch(console.error);
  }, [maKhoa]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ maKhoa });
      if (selectedDot !== 'ALL') params.append('maDot', selectedDot);
      if (selectedLoaiHb !== 'ALL') params.append('loaiHocBong', selectedLoaiHb);
      if (selectedTrangThai !== 'ALL') params.append('trangThai', selectedTrangThai);
      if (search) params.append('search', search);

      const res = await axiosClient.get(`/api/khoa/scholarships?${params.toString()}`);
      if (res.data.success) setScholarships(res.data.data);
    } catch (err) {
      console.error('Lỗi tải danh sách học bổng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScholarships(); }, [maKhoa, selectedDot, selectedLoaiHb, selectedTrangThai]);

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
        const match = item.mssv?.toLowerCase().includes(kw) || item.hoTen?.toLowerCase().includes(kw) || item.maLop?.toLowerCase().includes(kw) || item.tenNganh?.toLowerCase().includes(kw);
        if (!match) return false;
      }
      return true;
    });
  }, [scholarships, selectedLop, selectedHeDaoTao, search]);

  const stats = useMemo(() => {
    const list = filteredList.filter(s => s.loaiHocBong && s.loaiHocBong !== 'KHONG_DAT' && ((Number(s.mucHocBong) || 0) > 0 || (Number(s.soTienNhanDuoc) || 0) > 0));
    const totalAwardees = list.length;
    const totalAmount = filteredList.reduce((sum, s) => sum + (Number(s.soTienNhanDuoc || s.mucHocBong) || 0), 0);
    const countXuatSac = list.filter(s => s.loaiHocBong === 'XUAT_SAC').length;
    const countGioi = list.filter(s => s.loaiHocBong === 'GIOI').length;
    const countKha = list.filter(s => s.loaiHocBong === 'KHA').length;
    return { totalAwardees, totalAmount, countXuatSac, countGioi, countKha };
  }, [filteredList]);

  const handleViewGrades = async (hs) => {
    setSelectedStudentForModal(hs);
    setLoadingGrades(true);
    setShowGradesModal(true);
    try {
      const maHocKy = hs.maHocKy || 'HK1_2025_2026';
      const res = await axiosClient.get(`/api/common/danh-muc/grades/${hs.mssv}?maHocKy=${maHocKy}`);
      setStudentGrades(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi tải điểm:', err);
    } finally {
      setLoadingGrades(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredList.length === 0) return alert('Không có dữ liệu để xuất file');
    const headers = ['STT', 'Thứ hạng', 'MSSV', 'Họ và Tên', 'Lớp', 'Ngành', 'Chương trình ĐT', 'Đợt xét / Học kỳ', 'Điểm GPA (Hệ 4)', 'Điểm Rèn Luyện (ĐRL)', 'Số Tín Chỉ', 'Điểm Xét Tuyển', 'Loại Học Bổng', 'Tỷ lệ % Học Phí', 'Học Phí Học Kỳ (VNĐ)', 'Số Tiền Học Bổng (VNĐ)', 'Trạng Thái', 'Cấp Quỹ'];
    const rows = filteredList.map((item, i) => [
      i + 1, item.thuHang || '', `"${item.mssv}"`, `"${item.hoTen}"`, `"${item.maLop || ''}"`, `"${item.tenNganh || ''}"`,
      item.heDaoTao === 'DAC_BIET' || item.heDaoTao === 'CHAT_LUONG_CAO' ? 'Chất lượng cao' : 'Chuẩn (Đại trà)',
      `"${item.tenDot || item.maDot || ''}"`, item.diemTrungBinh ?? '', item.diemRenLuyen ?? '', item.soTinChi || '', item.diemXet ?? '', item.loaiHocBong || '', item.tyLeHocBong ? `${item.tyLeHocBong}%` : '', item.tongHocPhiKy || 0, item.soTienNhanDuoc || item.mucHocBong || 0, item.trangThai || '', item.trangThaiCapQuy || ''
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Danh_Sach_SV_Dat_Hoc_Bong_${maKhoa}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Danh Sách Sinh Viên Đạt Học Bổng</h1>
            <Badge variant="primary">{user?.tenKhoa || 'Khoa'}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tổng hợp kết quả xét học bổng Khuyến khích học tập toàn khoa</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchScholarships} className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"><RefreshCw className="w-3.5 h-3.5" /> Làm mới</button>
          <button onClick={handleExportCSV} className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5 cursor-pointer"><Download className="w-3.5 h-3.5" /> Xuất Excel / CSV</button>
          <button onClick={() => window.print()} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"><Printer className="w-3.5 h-3.5" /> In Danh Sách</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"><span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Tổng SV Nhận HB</span><div className="text-2xl font-black text-slate-800 mt-1">{stats.totalAwardees} SV</div></div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"><span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Tổng Tiền Trao HB</span><div className="text-lg font-black text-emerald-700 mt-1">{formatCurrency(stats.totalAmount)}</div></div>
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80"><span className="text-xs text-emerald-800 font-bold block">Xuất Sắc (100% HP)</span><div className="text-xl font-black text-emerald-700 mt-1">{stats.countXuatSac} SV</div></div>
        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80"><span className="text-xs text-blue-800 font-bold block">Giỏi (70% HP)</span><div className="text-xl font-black text-blue-700 mt-1">{stats.countGioi} SV</div></div>
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80"><span className="text-xs text-amber-800 font-bold block">Khá (50% HP)</span><div className="text-xl font-black text-amber-700 mt-1">{stats.countKha} SV</div></div>
      </div>

      <FacultyScholarshipTable
        search={search}
        setSearch={setSearch}
        selectedDot={selectedDot}
        setSelectedDot={setSelectedDot}
        campaigns={campaigns}
        selectedLoaiHb={selectedLoaiHb}
        setSelectedLoaiHb={setSelectedLoaiHb}
        selectedLop={selectedLop}
        setSelectedLop={setSelectedLop}
        lops={lops}
        selectedHeDaoTao={selectedHeDaoTao}
        setSelectedHeDaoTao={setSelectedHeDaoTao}
        filteredList={filteredList}
        loading={loading}
        onViewGrades={handleViewGrades}
      />

      <StudentGradesModal
        isOpen={showGradesModal}
        onClose={() => setShowGradesModal(false)}
        selectedStudent={selectedStudentForModal}
        studentGrades={studentGrades}
        loadingGrades={loadingGrades}
      />
    </div>
  );
};

export default FacultyScholarshipList;
