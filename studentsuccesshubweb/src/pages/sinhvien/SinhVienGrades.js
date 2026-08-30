import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { sortSemestersAsc } from '../../utils/semesterSort';
import { 
  FileSpreadsheet, 
  Award, 
  CreditCard, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Calendar
} from 'lucide-react';

export const SinhVienGrades = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('HK1_2025_2026');
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      fetchGrades(selectedSemester);
    }
  }, [selectedSemester]);

  const fetchSemesters = async () => {
    try {
      const res = await axiosClient.get('/api/common/danh-muc/hoc-ky');
      const list = res.data.data || res.data || [];
      const sorted = sortSemestersAsc(list);
      setSemesters(sorted);
      if (sorted.length > 0) {
        const found = sorted.find(s => s.maHocKy === 'HK1_2025_2026');
        setSelectedSemester(found ? found.maHocKy : sorted[sorted.length - 1].maHocKy);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách học kỳ:', err);
    }
  };

  const fetchGrades = async (maHocKy) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/sinhvien/grades?maHocKy=${maHocKy}`);
      setGradeData(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi tải bảng điểm:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getGradeBadge = (grade) => {
    if (!grade) return <span className="text-slate-400">-</span>;
    if (grade.startsWith('A')) return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-lg">{grade}</span>;
    if (grade.startsWith('B')) return <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-lg">{grade}</span>;
    if (grade.startsWith('C')) return <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-lg">{grade}</span>;
    if (grade.startsWith('D')) return <span className="px-2.5 py-1 text-xs font-bold bg-orange-100 text-orange-800 rounded-lg">{grade}</span>;
    return <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-lg">{grade}</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Bộ lọc học kỳ */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-primary-600" />
            Bảng điểm Chi tiết & Học phí Môn học
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tra cứu kết quả học tập chi tiết từng học phần, đơn giá tín chỉ và tổng học phí thực tế đóng trong kỳ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-4 h-4 text-primary-600" />
            Học kỳ:
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-slate-800 min-w-[200px]"
          >
            {semesters.map((hk) => (
              <option key={hk.maHocKy} value={hk.maHocKy}>
                {hk.tenHocKy || hk.maHocKy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-9 h-9 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !gradeData || !gradeData.danhSachDiemMonHoc || gradeData.danhSachDiemMonHoc.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Info className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-base font-semibold text-slate-700">Chưa có dữ liệu bảng điểm cho học kỳ này</p>
          <p className="text-sm text-slate-500">Vui lòng chọn học kỳ khác hoặc liên hệ Phòng Đào tạo / Giáo vụ Khoa.</p>
        </div>
      ) : (
        <>
          {/* Tóm tắt Học kỳ Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Tổng số Tín chỉ</span>
                <BookOpen className="w-4 h-4 text-primary-600" />
              </div>
              <p className="text-2xl font-black text-slate-800 mt-2">{gradeData.tongSoTinChi || 0} <span className="text-sm font-normal text-slate-500">tín chỉ</span></p>
              <p className="text-xs text-slate-500 mt-1">Đủ điều kiện xét HB (≥ 14 TC)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>GPA Hệ 4 / Điểm TB 10</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600 mt-2">
                {gradeData.gpaHe4 ? Number(gradeData.gpaHe4).toFixed(2) : '0.00'} 
                <span className="text-sm font-semibold text-slate-400 ml-2">/ 10: {gradeData.diemTrungBinhHocKy10 ? Number(gradeData.diemTrungBinhHocKy10).toFixed(2) : '0.00'}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {gradeData.gpaHe4 >= 3.6 ? '🌟 Đạt ngưỡng Xuất sắc (≥ 3.60)' : gradeData.gpaHe4 >= 3.2 ? '⭐ Đạt ngưỡng Giỏi (≥ 3.20)' : 'Đạt chuẩn xét (≥ 2.50)'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Tổng Học Phí Kỳ</span>
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-700 mt-2">
                {formatCurrency(gradeData.tongHocPhiHocKy)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Hệ đào tạo: <span className="font-semibold text-slate-700">{gradeData.heDaoTao === 'CHAT_LUONG_CAO' || gradeData.heDaoTao === 'DAC_BIET' ? 'Chất lượng cao' : 'Chuẩn (Đại trà)'}</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Tình trạng Nợ môn</span>
                {gradeData.coHocPhanRot ? (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <p className="text-xl font-bold mt-2">
                {gradeData.coHocPhanRot ? (
                  <span className="text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-5 h-5" /> Có môn rớt (F)
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> Hoàn thành 100%
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {gradeData.coHocPhanRot ? 'Không đủ điều kiện xét HB KKHT' : 'Đủ điều kiện xét Học bổng KKHT'}
              </p>
            </div>
          </div>

          {/* Bảng Chi tiết Điểm & Học phí từng môn */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-base">Danh sách Học phần trong Kỳ ({gradeData.danhSachDiemMonHoc.length} môn)</h2>
              <span className="text-xs text-slate-500 font-medium">Tỷ lệ đánh giá: Chuyên cần 10% | Giữa kỳ 30% | Cuối kỳ 60%</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Mã môn</th>
                    <th className="py-3.5 px-4">Tên Học phần</th>
                    <th className="py-3.5 px-3 text-center">Số TC</th>
                    <th className="py-3.5 px-3 text-right">Học phí môn</th>
                    <th className="py-3.5 px-3 text-center">CC (10%)</th>
                    <th className="py-3.5 px-3 text-center">GK (30%)</th>
                    <th className="py-3.5 px-3 text-center">CK (60%)</th>
                    <th className="py-3.5 px-3 text-center font-black text-slate-900">Điểm 10</th>
                    <th className="py-3.5 px-3 text-center font-black text-slate-900">Hệ 4</th>
                    <th className="py-3.5 px-3 text-center">Điểm chữ</th>
                    <th className="py-3.5 px-4 text-center">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {gradeData.danhSachDiemMonHoc.map((m, idx) => (
                    <tr key={m.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primary-700">{m.maMon}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{m.tenMon}</td>
                      <td className="py-3.5 px-3 text-center font-bold">{m.soTinChi}</td>
                      <td className="py-3.5 px-3 text-right font-semibold text-slate-700">{formatCurrency(m.hocPhiMon)}</td>
                      <td className="py-3.5 px-3 text-center text-slate-600">{m.diemChuyenCan != null ? Number(m.diemChuyenCan).toFixed(1) : '-'}</td>
                      <td className="py-3.5 px-3 text-center text-slate-600">{m.diemGiuaKy != null ? Number(m.diemGiuaKy).toFixed(1) : '-'}</td>
                      <td className="py-3.5 px-3 text-center text-slate-600">{m.diemCuoiKy != null ? Number(m.diemCuoiKy).toFixed(1) : '-'}</td>
                      <td className="py-3.5 px-3 text-center font-black text-slate-900 bg-slate-50/60">
                        {m.diemTongKet10 != null ? Number(m.diemTongKet10).toFixed(2) : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-center font-black text-amber-700 bg-amber-50/40">
                        {m.diemHe4 != null ? Number(m.diemHe4).toFixed(2) : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {getGradeBadge(m.diemChu)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {m.dat ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đạt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                            <AlertCircle className="w-3.5 h-3.5" /> Rớt
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bảng tính Định mức Học bổng Kỳ này */}
            <div className="p-5 bg-gradient-to-r from-primary-50 via-slate-50 to-primary-50 border-t border-slate-200">
              <h3 className="text-sm font-bold text-primary-900 mb-2.5 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-600" />
                Mức Học bổng Khuyến khích Học tập áp dụng cho Học kỳ này:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-primary-200/80 shadow-xs">
                  <span className="font-bold text-emerald-800 block mb-1">🥇 Học bổng Xuất sắc (100% Học phí):</span>
                  <span className="text-base font-black text-emerald-700">{formatCurrency(gradeData.tongHocPhiHocKy)}</span>
                  <span className="text-slate-500 block mt-0.5">Yêu cầu: GPA ≥ 3.60 & ĐRL ≥ 90</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-primary-200/80 shadow-xs">
                  <span className="font-bold text-blue-800 block mb-1">🥈 Học bổng Giỏi (70% Học phí):</span>
                  <span className="text-base font-black text-blue-700">{formatCurrency(gradeData.tongHocPhiHocKy ? gradeData.tongHocPhiHocKy * 0.7 : 0)}</span>
                  <span className="text-slate-500 block mt-0.5">Yêu cầu: GPA ≥ 3.20 & ĐRL ≥ 80</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-primary-200/80 shadow-xs">
                  <span className="font-bold text-amber-800 block mb-1">🥉 Học bổng Khá (50% Học phí):</span>
                  <span className="text-base font-black text-amber-700">{formatCurrency(gradeData.tongHocPhiHocKy ? gradeData.tongHocPhiHocKy * 0.5 : 0)}</span>
                  <span className="text-slate-500 block mt-0.5">Yêu cầu: GPA ≥ 2.50 & ĐRL ≥ 65</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SinhVienGrades;
