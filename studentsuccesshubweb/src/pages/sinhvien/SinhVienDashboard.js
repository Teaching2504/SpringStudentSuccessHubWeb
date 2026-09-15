import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Award, BookOpen, CheckSquare, AlertTriangle, CheckCircle, ChevronRight, Upload, Calendar, Camera } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { sortSemesters } from '../../utils/semesterSort';
import SemesterGradesSection from './components/SemesterGradesSection';

const SinhVienDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState('');
  const [avatarErr, setAvatarErr] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [rProf, rAcad, rHb] = await Promise.all([
        axiosClient.get('/api/sinhvien/profile'),
        axiosClient.get('/api/sinhvien/academic-history'),
        axiosClient.get('/api/sinhvien/my-scholarship-results')
      ]);

      if (rProf.data.success) setProfile(rProf.data.data);
      if (rAcad.data.success) {
        const d = rAcad.data.data;
        if (d?.ketQuaHocTap) {
          d.ketQuaHocTap = sortSemesters(d.ketQuaHocTap.map(k => ({ ...k, maHocKy: k.hocKy?.maHocKy, namHoc: k.hocKy?.namHoc, tenHocKy: k.hocKy?.tenHocKy })));
        }
        if (d?.bangDiemChiTiet) {
          d.bangDiemChiTiet = sortSemesters(d.bangDiemChiTiet);
        }
        setAcademicData(d);
      }
      if (rHb.data.success) setScholarships(rHb.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, JPEG)!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng ảnh không được vượt quá 5MB!');
      return;
    }

    try {
      setUploadingAvatar(true);
      setAvatarMsg('');
      setAvatarErr('');
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosClient.post('/api/auth/avatar', formData);
      if (res.data?.success) {
        setAvatarMsg('Cập nhật ảnh đại diện thành công!');
        const newAvatar = res.data?.data?.avatar;
        if (newAvatar) setProfile(prev => prev ? ({ ...prev, avatar: newAvatar }) : prev);
        await refreshUser();
        setTimeout(() => setAvatarMsg(''), 4000);
      } else {
        setAvatarErr(res.data?.message || 'Không thể cập nhật ảnh đại diện');
      }
    } catch (err) {
      setAvatarErr(err.response?.data?.message || 'Lỗi khi tải ảnh đại diện lên');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isWarned = profile?.canhBao && profile?.canhBao !== 'Bình thường';
  const allSemesters = academicData?.bangDiemChiTiet || [];
  const displayedSemesters = selectedSemester === 'ALL'
    ? allSemesters
    : allSemesters.filter(s => s.maHocKy === selectedSemester || s.tenHocKy === selectedSemester);

  const navigateSemester = (direction) => {
    if (allSemesters.length === 0) return;
    if (selectedSemester === 'ALL') {
      setSelectedSemester(direction === -1 ? allSemesters[allSemesters.length - 1].maHocKy : allSemesters[0].maHocKy);
      return;
    }
    const idx = allSemesters.findIndex(s => s.maHocKy === selectedSemester || s.tenHocKy === selectedSemester);
    const targetIdx = idx + direction;
    if (targetIdx >= 0 && targetIdx < allSemesters.length) {
      setSelectedSemester(allSemesters[targetIdx].maHocKy);
    } else {
      setSelectedSemester('ALL');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => fileInputRef.current?.click()}
            title="Nhấp để tải lên / thay đổi ảnh đại diện"
          >
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            {profile?.avatar || user?.avatar ? (
              <img src={profile?.avatar || user?.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-200 group-hover:opacity-90 transition" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 font-bold text-2xl flex items-center justify-center shadow-inner group-hover:bg-primary-200 transition">
                {profile?.hoTen?.charAt(0) || 'S'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition backdrop-blur-xs">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-primary-600 group-hover:text-white transition">
              <Camera className="w-3.5 h-3.5" />
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">{profile?.hoTen}</h1>
              <Badge variant="amber">Sinh viên</Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              MSSV: <strong>{profile?.mssv}</strong> | Lớp: <strong>{profile?.maLop}</strong> | Khoa: <strong>{profile?.tenKhoa}</strong>
            </p>
            {avatarMsg && <p className="text-xs font-semibold text-emerald-600 mt-1 animate-fade-in">{avatarMsg}</p>}
            {avatarErr && <p className="text-xs font-semibold text-rose-600 mt-1 animate-fade-in">{avatarErr}</p>}
          </div>
        </div>

        <div>
          {isWarned ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{profile?.canhBao}</span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Tình trạng học vụ: Bình thường</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Điểm GPA Học kỳ', val: `${profile?.diemTrungBinh != null ? profile.diemTrungBinh.toFixed(2) : '-'} / 4.0`, icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Điểm Rèn luyện (ĐRL)', val: `${profile?.diemRenLuyen != null ? profile.diemRenLuyen : '-'} đ`, icon: <CheckSquare className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600' },
          { label: 'Số Tín chỉ đăng ký', val: `${profile?.soTinChi || 0} TC`, icon: <Calendar className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
          { label: 'Học bổng đã đạt', val: `${scholarships.filter(s => ['CHINH_THUC', 'DU_KIEN'].includes(s.trangThai)).length} đợt`, icon: <Award className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600', valClass: 'text-emerald-700' },
        ].map((c, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3.5 rounded-xl ${c.color}`}>{c.icon}</div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
              <h3 className={`text-2xl font-bold text-slate-800 mt-0.5 ${c.valClass || ''}`}>{c.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/sinh-vien/scholarships"
          className="p-5 bg-gradient-to-r from-blue-50/90 to-sky-50/80 hover:from-blue-100/90 hover:to-sky-100/80 border border-blue-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-900 transition-colors">Tra cứu Kết quả Học bổng & Khiếu nại</h3>
              <p className="text-xs text-slate-500 font-medium">Xem danh sách dự kiến / chính thức và nộp đơn kiến nghị nếu có thắc mắc</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white group-hover:border-blue-700 transition-all shrink-0 ml-2">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        <Link
          to="/sinh-vien/evidence"
          className="p-5 bg-gradient-to-r from-amber-50/90 to-yellow-50/80 hover:from-amber-100/90 hover:to-yellow-100/80 border border-amber-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-amber-950 transition-colors">Nộp Minh chứng Hoạt động Rèn luyện</h3>
              <p className="text-xs text-slate-500 font-medium">Gửi chứng chỉ ngoại khóa, NCKH, tình nguyện để được cộng điểm ĐRL</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all shrink-0 ml-2">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition" />
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-800">Lịch sử Kết quả Học tập & Rèn luyện</h2>
          <p className="text-xs text-slate-500">Tổng hợp điểm trung bình GPA và điểm rèn luyện ĐRL qua các học kỳ</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Học kỳ / Năm học</th>
                <th className="px-5 py-3 text-center">GPA</th>
                <th className="px-5 py-3 text-center">Số tín chỉ</th>
                <th className="px-5 py-3 text-center">Nợ môn</th>
                <th className="px-5 py-3 text-center">Điểm ĐRL</th>
                <th className="px-5 py-3">Xếp loại ĐRL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {academicData?.ketQuaHocTap?.map((kq) => {
                const drl = academicData.ketQuaRenLuyen?.find(d => d.hocKy?.maHocKy === kq.hocKy?.maHocKy);
                return (
                  <tr key={kq.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-bold text-slate-800">{kq.hocKy?.tenHocKy || kq.hocKy?.maHocKy}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary-700">{kq.diemTrungBinh != null ? kq.diemTrungBinh.toFixed(2) : '-'}</td>
                    <td className="px-5 py-3.5 text-center">{kq.soTinChi || 0}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`font-semibold text-xs ${kq.coHocPhanRot ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {kq.coHocPhanRot ? 'Có rớt môn' : 'Không'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-slate-800">{drl?.diemRenLuyen != null ? drl.diemRenLuyen : '-'}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-600">{drl?.xepLoai || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SemesterGradesSection
        allSemesters={allSemesters}
        displayedSemesters={displayedSemesters}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        navigateSemester={navigateSemester}
      />
    </div>
  );
};

export default SinhVienDashboard;
