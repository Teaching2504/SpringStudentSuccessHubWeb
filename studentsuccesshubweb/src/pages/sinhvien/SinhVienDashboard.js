import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Award, BookOpen, CheckSquare, MessageSquare, AlertTriangle, CheckCircle, ChevronRight, Upload, Calendar } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { sortSemesters } from '../../utils/semesterSort';

const SinhVienDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

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
        if (d && d.ketQuaHocTap) {
          d.ketQuaHocTap = sortSemesters(d.ketQuaHocTap.map(k => ({ ...k, maHocKy: k.hocKy?.maHocKy, namHoc: k.hocKy?.namHoc, tenHocKy: k.hocKy?.tenHocKy })));
        }
        setAcademicData(d);
      }
      if (rHb.data.success) setScholarships(rHb.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isWarned = profile?.canhBao && profile?.canhBao !== 'Bình thường';

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 font-bold text-2xl flex items-center justify-center shadow-inner">
            {profile?.hoTen?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">{profile?.hoTen}</h1>
              <Badge variant="amber">Sinh viên</Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              MSSV: <strong>{profile?.mssv}</strong> | Lớp: <strong>{profile?.maLop}</strong> | Khoa: <strong>{profile?.tenKhoa}</strong>
            </p>
          </div>
        </div>

        {/* Warning Indicator */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm GPA Học kỳ</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {profile?.diemTrungBinh != null ? profile.diemTrungBinh.toFixed(2) : '-'} / 4.0
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm Rèn luyện (ĐRL)</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {profile?.diemRenLuyen != null ? profile.diemRenLuyen : '-'} đ
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số Tín chỉ đăng ký</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {profile?.soTinChi || 0} TC
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Học bổng đã đạt</p>
            <h3 className="text-xl font-bold text-emerald-700 mt-0.5">
              {scholarships.filter(s => s.trangThai === 'CHINH_THUC' || s.trangThai === 'DU_KIEN').length} đợt
            </h3>
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/sinh-vien/scholarships"
          className="p-5 bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-2xl shadow-lg flex items-center justify-between group cursor-pointer hover:shadow-xl transition"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5" /> Tra cứu Kết quả Học bổng & Khiếu nại
            </h3>
            <p className="text-xs text-primary-200">
              Xem danh sách dự kiến / chính thức và nộp đơn kiến nghị nếu có thắc mắc
            </p>
          </div>
          <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/sinh-vien/evidence"
          className="p-5 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-2xl shadow-lg flex items-center justify-between group cursor-pointer hover:shadow-xl transition"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Upload className="w-5 h-5" /> Nộp Minh chứng Hoạt động Rèn luyện
            </h3>
            <p className="text-xs text-amber-100">
              Gửi chứng chỉ ngoại khóa, NCKH, tình nguyện để được cộng điểm ĐRL
            </p>
          </div>
          <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Academic Results History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Lịch sử Kết quả Học tập & Rèn luyện</h2>
            <p className="text-xs text-slate-500">Tổng hợp điểm trung bình GPA và điểm rèn luyện ĐRL qua các học kỳ</p>
          </div>
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
                    <td className="px-5 py-3.5 font-bold text-slate-800">
                      {kq.hocKy?.tenHocKy || kq.hocKy?.maHocKy}
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary-700">
                      {kq.diemTrungBinh != null ? kq.diemTrungBinh.toFixed(2) : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-center">{kq.soTinChi || 0}</td>
                    <td className="px-5 py-3.5 text-center">
                      {kq.coHocPhanRot ? (
                        <span className="text-rose-600 font-semibold text-xs">Có rớt môn</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-xs">Không</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                      {drl?.diemRenLuyen != null ? drl.diemRenLuyen : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-600">
                      {drl?.xepLoai || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Course Breakdown from Official Curriculum */}
      {academicData?.bangDiemChiTiet && academicData.bangDiemChiTiet.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-slate-800">Bảng điểm Chi tiết các Học phần (CTĐT Chuẩn)</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Theo Chương trình đào tạo Quyết định 561/QĐ-ĐHM - Khoa Công nghệ Thông tin
              </p>
            </div>
          </div>

          {academicData.bangDiemChiTiet.map((hkScore, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">
                    {hkScore.tenHocKy || hkScore.maHocKy}
                  </span>
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
                        <td className="px-4 py-2.5 text-center font-bold text-slate-900">
                          {mon.diemTongKet10 != null ? Number(mon.diemTongKet10).toFixed(1) : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-center font-bold text-primary-700">
                          {mon.diemHe4 != null ? Number(mon.diemHe4).toFixed(2) : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                            mon.diemChu === 'A+' || mon.diemChu === 'A' ? 'bg-emerald-100 text-emerald-800' :
                            mon.diemChu === 'B+' || mon.diemChu === 'B' ? 'bg-blue-100 text-blue-800' :
                            mon.diemChu === 'C+' || mon.diemChu === 'C' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {mon.diemChu || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-600">
                          {formatCurrency(mon.hocPhiMon)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {mon.dat ? (
                            <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Đạt
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold flex items-center justify-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Học lại
                            </span>
                          )}
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
