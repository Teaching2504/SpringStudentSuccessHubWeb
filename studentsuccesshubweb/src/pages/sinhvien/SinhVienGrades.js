import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { sortSemestersAsc } from '../../utils/semesterSort';
import { FileSpreadsheet, Award, CreditCard, BookOpen, CheckCircle2, AlertCircle, Info, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import AcademicGradesTable from './components/AcademicGradesTable';

export const SinhVienGrades = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('HK1_2025_2026');
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/api/common/danh-muc/hoc-ky').then(res => {
      const sorted = sortSemestersAsc(res.data.data || res.data || []);
      setSemesters(sorted);
      if (sorted.length > 0) {
        const found = sorted.find(s => s.maHocKy === 'HK1_2025_2026');
        setSelectedSemester(found ? found.maHocKy : sorted[sorted.length - 1].maHocKy);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      setLoading(true);
      axiosClient.get(`/api/sinhvien/grades?maHocKy=${selectedSemester}`)
        .then(res => setGradeData(res.data.data || res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedSemester]);

  const getGradeBadge = (grade) => {
    if (!grade) return <span className="text-slate-400">-</span>;
    const color = grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800'
      : grade.startsWith('B') ? 'bg-blue-100 text-blue-800'
      : grade.startsWith('C') ? 'bg-amber-100 text-amber-800'
      : grade.startsWith('D') ? 'bg-orange-100 text-orange-800'
      : 'bg-rose-100 text-rose-800';
    return <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${color}`}>{grade}</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-primary-600" />
            Bảng điểm Chi tiết & Học phí Môn học
          </h1>
          <p className="text-sm text-slate-500 mt-1">Tra cứu kết quả học tập chi tiết từng học phần, đơn giá tín chỉ và tổng học phí thực tế đóng trong kỳ.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-4 h-4 text-primary-600" /> Học kỳ:
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-slate-800 min-w-[200px]"
          >
            {semesters.map((hk) => <option key={hk.maHocKy} value={hk.maHocKy}>{hk.tenHocKy || hk.maHocKy}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-9 h-9 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !gradeData || !gradeData.danhSachDiemMonHoc?.length ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Info className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-base font-semibold text-slate-700">Chưa có dữ liệu bảng điểm cho học kỳ này</p>
          <p className="text-sm text-slate-500">Vui lòng chọn học kỳ khác hoặc liên hệ Phòng Đào tạo / Giáo vụ Khoa.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Tổng số Tín chỉ</span><BookOpen className="w-4 h-4 text-primary-600" />
              </div>
              <p className="text-2xl font-black text-slate-800 mt-2">{gradeData.tongSoTinChi || 0} <span className="text-sm font-normal text-slate-500">tín chỉ</span></p>
              <p className="text-xs text-slate-500 mt-1">Đủ điều kiện xét HB (≥ 14 TC)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>GPA Hệ 4 / Điểm TB 10</span><Award className="w-4 h-4 text-amber-500" />
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
                <span>Tổng Học Phí Kỳ</span><CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-700 mt-2">{formatCurrency(gradeData.tongHocPhiHocKy)}</p>
              <p className="text-xs text-slate-500 mt-1">
                Hệ đào tạo: <span className="font-semibold text-slate-700">{['CHAT_LUONG_CAO', 'DAC_BIET'].includes(gradeData.heDaoTao) ? 'Chất lượng cao' : 'Chuẩn (Đại trà)'}</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span>Tình trạng Nợ môn</span>
                {gradeData.coHocPhanRot ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xl font-bold mt-2">
                <span className={`flex items-center gap-1.5 ${gradeData.coHocPhanRot ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {gradeData.coHocPhanRot ? <><AlertCircle className="w-5 h-5" /> Có môn rớt (F)</> : <><CheckCircle2 className="w-5 h-5" /> Hoàn thành 100%</>}
                </span>
              </p>
              <p className="text-xs text-slate-500 mt-1">{gradeData.coHocPhanRot ? 'Không đủ điều kiện xét HB KKHT' : 'Đủ điều kiện xét Học bổng KKHT'}</p>
            </div>
          </div>

          <AcademicGradesTable gradeData={gradeData} getGradeBadge={getGradeBadge} />
        </>
      )}
    </div>
  );
};

export default SinhVienGrades;
