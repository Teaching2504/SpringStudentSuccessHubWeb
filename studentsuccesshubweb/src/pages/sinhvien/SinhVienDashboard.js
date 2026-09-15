import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Award, BookOpen, CheckSquare, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft, Upload, Calendar, Filter, Layers, Camera } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { sortSemesters } from '../../utils/semesterSort';
import { formatCurrency } from '../../utils/formatters';

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

      {allSemesters.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-slate-800">Bảng điểm Chi tiết các Học phần (CTĐT Chuẩn)</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">Theo Chương trình đào tạo Quyết định 561/QĐ-ĐHM - Khoa Công nghệ Thông tin</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => navigateSemester(-1)}
                  title="Học kỳ trước"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Kỳ trước</span>
                </button>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => navigateSemester(1)}
                  title="Học kỳ sau"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <span className="hidden sm:inline">Kỳ sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex items-center">
                <Filter className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="ALL">Tất cả các học kỳ ({allSemesters.length} kỳ)</option>
                  {allSemesters.map((hk, i) => (
                    <option key={i} value={hk.maHocKy}>
                      {hk.tenHocKy || hk.maHocKy} (GPA: {hk.gpaHe4 != null ? Number(hk.gpaHe4).toFixed(2) : '-'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSemester('ALL')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedSemester === 'ALL' ? 'bg-primary-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Tất cả ({allSemesters.length} kỳ)
            </button>
            {allSemesters.map((hk, i) => {
              const isSelected = selectedSemester === hk.maHocKy;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedSemester(hk.maHocKy)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected ? 'bg-primary-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{hk.tenHocKy || hk.maHocKy}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isSelected ? 'bg-primary-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {hk.gpaHe4 != null ? Number(hk.gpaHe4).toFixed(2) : '-'}
                  </span>
                </button>
              );
            })}
          </div>

          {displayedSemesters.map((hkScore, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{hkScore.tenHocKy || hkScore.maHocKy}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 font-semibold">
                    {hkScore.heDaoTao === 'CHAT_LUONG_CAO' ? 'Chất lượng cao' : 'Chương trình Chuẩn'}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-slate-600">
                  <span>Tổng tín chỉ: <strong className="text-slate-800">{hkScore.tongSoTinChi || 0} TC</strong></span>
                  <span>Tổng học phí: <strong className="text-primary-700">{formatCurrency(hkScore.tongHocPhiHocKy)}</strong></span>
                  <span>GPA Học kỳ: <strong className="text-emerald-700 font-bold">{hkScore.gpaHe4 != null ? Number(hkScore.gpaHe4).toFixed(2) : '-'} (Hệ 4)</strong></span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-white border-b border-slate-100 text-slate-500 font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Mã MH</th>
                      <th className="px-4 py-2.5">Tên Môn học</th>
                      <th className="px-4 py-2.5 text-center">Tín chỉ</th>
                      <th className="px-4 py-2.5 text-center">Chuyên cần (10%)</th>
                      <th className="px-4 py-2.5 text-center">Giữa kỳ (30%)</th>
                      <th className="px-4 py-2.5 text-center">Cuối kỳ (60%)</th>
                      <th className="px-4 py-2.5 text-center">Tổng kết 10</th>
                      <th className="px-4 py-2.5 text-center">Hệ 4</th>
                      <th className="px-4 py-2.5 text-center">Điểm chữ</th>
                      <th className="px-4 py-2.5 text-right">Học phí môn</th>
                      <th className="px-4 py-2.5 text-center">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {hkScore.danhSachDiemMonHoc?.map((mon, mIdx) => (
                      <tr key={mIdx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-700">{mon.maMon}</td>
                        <td className="px-4 py-2.5 font-medium text-slate-800">{mon.tenMon}</td>
                        <td className="px-4 py-2.5 text-center font-semibold">{mon.soTinChi}</td>
                        <td className="px-4 py-2.5 text-center">{mon.diemChuyenCan != null ? Number(mon.diemChuyenCan).toFixed(1) : '-'}</td>
                        <td className="px-4 py-2.5 text-center">{mon.diemGiuaKy != null ? Number(mon.diemGiuaKy).toFixed(1) : '-'}</td>
                        <td className="px-4 py-2.5 text-center">{mon.diemCuoiKy != null ? Number(mon.diemCuoiKy).toFixed(1) : '-'}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-slate-900">{mon.diemTongKet10 != null ? Number(mon.diemTongKet10).toFixed(1) : '-'}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-primary-700">{mon.diemHe4 != null ? Number(mon.diemHe4).toFixed(2) : '-'}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                            ['A+', 'A'].includes(mon.diemChu) ? 'bg-emerald-100 text-emerald-800' :
                            ['B+', 'B'].includes(mon.diemChu) ? 'bg-blue-100 text-blue-800' :
                            ['C+', 'C'].includes(mon.diemChu) ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {mon.diemChu || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-600">{formatCurrency(mon.hocPhiMon)}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`font-semibold flex items-center justify-center gap-1 ${mon.dat ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {mon.dat ? <><CheckCircle className="w-3.5 h-3.5" /> Đạt</> : <><AlertTriangle className="w-3.5 h-3.5" /> Học lại</>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SinhVienDashboard;
