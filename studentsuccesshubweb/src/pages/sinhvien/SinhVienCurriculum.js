import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { 
  FolderTree, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  CreditCard, 
  CheckCircle2, 
  Info,
  Calendar
} from 'lucide-react';

export const SinhVienCurriculum = () => {
  const [curriculum, setCurriculum] = useState([]);
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [rMajors, rCurr] = await Promise.all([
        axiosClient.get('/api/common/danh-muc/nganh'),
        axiosClient.get('/api/sinhvien/curriculum')
      ]);

      const majorList = rMajors.data.data || rMajors.data || [];
      setMajors(majorList);

      const currList = rCurr.data.data || rCurr.data || [];
      setCurriculum(currList);
      if (currList.length > 0 && currList[0].maNganh) {
        setSelectedMajor(currList[0].maNganh);
      }
    } catch (err) {
      console.error('Lỗi tải CTĐT:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMajor = async (maNganh) => {
    setSelectedMajor(maNganh);
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/sinhvien/curriculum?maNganh=${maNganh}`);
      setCurriculum(res.data.data || res.data || []);
    } catch (err) {
      console.error('Lỗi tải CTĐT ngành:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Gom nhóm môn học theo Học kỳ gợi ý
  const groupedBySemester = curriculum.reduce((acc, item) => {
    const hk = item.hocKyGoiY || 1;
    if (!acc[hk]) acc[hk] = [];
    acc[hk].push(item);
    return acc;
  }, {});

  const totalCredits = curriculum.reduce((sum, item) => sum + (item.soTinChi || 0), 0);
  const totalTuition = curriculum.reduce((sum, item) => sum + (Number(item.hocPhiDuKien) || 0), 0);
  const currentMajorObj = majors.find(m => m.maNganh === selectedMajor);
  const majorName = curriculum[0]?.tenNganh || currentMajorObj?.tenNganh || 'Khoa học Máy tính';
  const programType = (curriculum[0]?.heDaoTao === 'CHAT_LUONG_CAO' || currentMajorObj?.heDaoTao === 'CHAT_LUONG_CAO')
    ? 'Chương trình Đặc biệt (Chất lượng cao)' 
    : 'Chương trình Chuẩn (Đại trà)';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-primary-200 border border-white/10">
              <GraduationCap className="w-3.5 h-3.5" />
              Khung Chương Trình Đào Tạo Đại Học (QĐ 561/QĐ-ĐHM)
            </div>

            {majors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary-200 font-medium">Chọn Ngành:</span>
                <select
                  value={selectedMajor}
                  onChange={(e) => handleSelectMajor(e.target.value)}
                  className="bg-white/10 text-white text-xs border border-white/20 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold cursor-pointer"
                >
                  {majors.map((m) => (
                    <option key={m.maNganh} value={m.maNganh} className="text-slate-800">
                      {m.tenNganh} ({m.maNganh})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Ngành: {majorName}
          </h1>

          <p className="text-primary-100 text-sm max-w-2xl leading-relaxed">
            Hệ đào tạo: <span className="font-bold text-white">{programType}</span>. Khung chương trình chuẩn bị lộ trình tích lũy đủ các khối kiến thức đại cương, cơ sở ngành và chuyên ngành.
          </p>

          <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <span className="text-[11px] text-primary-200 block uppercase font-semibold">Tổng môn học</span>
              <span className="text-xl font-black text-white">{curriculum.length} môn</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <span className="text-[11px] text-primary-200 block uppercase font-semibold">Tổng tín chỉ</span>
              <span className="text-xl font-black text-white">{totalCredits} TC</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 col-span-2">
              <span className="text-[11px] text-primary-200 block uppercase font-semibold">Đơn giá 1 Tín chỉ</span>
              <span className="text-lg font-black text-emerald-300">
                {curriculum[0]?.donGiaTinChi ? formatCurrency(curriculum[0].donGiaTinChi) : '650.000 VNĐ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-9 h-9 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : curriculum.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Info className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-base font-semibold text-slate-700">Chưa tìm thấy Khung CTĐT của ngành này</p>
          <p className="text-sm text-slate-500">Vui lòng liên hệ Phòng Đào tạo để cập nhật danh mục môn học.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedBySemester).sort((a, b) => Number(a) - Number(b)).map((hkNum) => {
            const subjects = groupedBySemester[hkNum];
            const semCredits = subjects.reduce((sum, s) => sum + (s.soTinChi || 0), 0);
            const semTuition = subjects.reduce((sum, s) => sum + (Number(s.hocPhiDuKien) || 0), 0);

            return (
              <div key={hkNum} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 bg-primary-700 text-white rounded-lg flex items-center justify-center text-xs font-black">
                      {hkNum}
                    </span>
                    <h2 className="font-bold text-slate-800 text-base">Học kỳ {hkNum} (Đề xuất)</h2>
                    <span className="text-xs px-2.5 py-0.5 bg-primary-50 text-primary-700 font-bold rounded-full">
                      {subjects.length} môn học
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span>Tổng số: <strong className="text-slate-900">{semCredits} tín chỉ</strong></span>
                    <span>•</span>
                    <span>Học phí dự kiến: <strong className="text-emerald-700">{formatCurrency(semTuition)}</strong></span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-5">Mã môn</th>
                        <th className="py-3 px-5">Tên Học phần</th>
                        <th className="py-3 px-3 text-center">Số TC</th>
                        <th className="py-3 px-3 text-center">LT / TH</th>
                        <th className="py-3 px-4 text-right">Đơn giá / TC</th>
                        <th className="py-3 px-4 text-right">Học phí môn</th>
                        <th className="py-3 px-4 text-center">Loại học phần</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {subjects.map((s, idx) => (
                        <tr key={s.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-primary-700">{s.maMon}</td>
                          <td className="py-3.5 px-5 font-semibold text-slate-800">{s.tenMon}</td>
                          <td className="py-3.5 px-3 text-center font-bold text-slate-900">{s.soTinChi}</td>
                          <td className="py-3.5 px-3 text-center text-xs text-slate-500 font-medium">
                            {s.soTietLyThuyet || 0} tiết / {s.soTietThucHanh || 0} tiết
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-600">{formatCurrency(s.donGiaTinChi)}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{formatCurrency(s.hocPhiDuKien)}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">
                              {s.loaiHocPhan === 'BAT_BUOC' ? 'Bắt buộc' : 'Tự chọn'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SinhVienCurriculum;
