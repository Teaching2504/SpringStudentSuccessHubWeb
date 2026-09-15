import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { GraduationCap, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import CurriculumSemesterSection from './components/CurriculumSemesterSection';

export const SinhVienCurriculum = () => {
  const [curriculum, setCurriculum] = useState([]);
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosClient.get('/api/common/danh-muc/nganh'),
      axiosClient.get('/api/sinhvien/curriculum')
    ]).then(([rMajors, rCurr]) => {
      const majorList = rMajors.data.data || rMajors.data || [];
      const currList = rCurr.data.data || rCurr.data || [];
      setMajors(majorList);
      setCurriculum(currList);
      if (currList.length > 0 && currList[0].maNganh) setSelectedMajor(currList[0].maNganh);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSelectMajor = async (maNganh) => {
    setSelectedMajor(maNganh);
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/sinhvien/curriculum?maNganh=${maNganh}`);
      setCurriculum(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupedBySemester = curriculum.reduce((acc, item) => {
    const hk = item.hocKyGoiY || 1;
    if (!acc[hk]) acc[hk] = [];
    acc[hk].push(item);
    return acc;
  }, {});

  const totalCredits = curriculum.reduce((sum, item) => sum + (item.soTinChi || 0), 0);
  const currentMajorObj = majors.find(m => m.maNganh === selectedMajor);
  const majorName = curriculum[0]?.tenNganh || currentMajorObj?.tenNganh || 'Khoa học Máy tính';
  const programType = (curriculum[0]?.heDaoTao === 'CHAT_LUONG_CAO' || currentMajorObj?.heDaoTao === 'CHAT_LUONG_CAO')
    ? 'Chương trình Đặc biệt (Chất lượng cao)'
    : 'Chương trình Chuẩn (Đại trà)';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-indigo-50/70 border border-blue-200/90 text-slate-800 p-6 md:p-8 rounded-3xl shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 text-blue-800 rounded-full text-xs font-semibold tracking-wide border border-blue-200/80">
              <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
              Khung Chương Trình Đào Tạo Đại Học (QĐ 561/QĐ-ĐHM)
            </div>

            {majors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-900 font-semibold">Chọn Ngành:</span>
                <select
                  value={selectedMajor}
                  onChange={(e) => handleSelectMajor(e.target.value)}
                  className="bg-white text-slate-800 text-xs border border-blue-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold shadow-xs cursor-pointer"
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

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-950">Ngành: {majorName}</h1>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            Hệ đào tạo: <span className="font-bold text-slate-900">{programType}</span>. Khung chương trình chuẩn bị lộ trình tích lũy đủ các khối kiến thức đại cương, cơ sở ngành và chuyên ngành.
          </p>

          <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-blue-100/90 shadow-xs">
              <span className="text-[11px] text-blue-700 block uppercase font-bold tracking-wider">Tổng môn học</span>
              <span className="text-xl font-black text-slate-800">{curriculum.length} môn</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-blue-100/90 shadow-xs">
              <span className="text-[11px] text-blue-700 block uppercase font-bold tracking-wider">Tổng tín chỉ</span>
              <span className="text-xl font-black text-slate-800">{totalCredits} TC</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-blue-100/90 shadow-xs col-span-2">
              <span className="text-[11px] text-blue-700 block uppercase font-bold tracking-wider">Đơn giá 1 Tín chỉ</span>
              <span className="text-lg font-black text-emerald-600">{formatCurrency(curriculum[0]?.donGiaTinChi || 650000)}</span>
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
        <CurriculumSemesterSection groupedBySemester={groupedBySemester} />
      )}
    </div>
  );
};

export default SinhVienCurriculum;
