import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Search, AlertTriangle, CheckCircle, Users, BookOpen } from 'lucide-react';
import { sortSemesters } from '../../utils/semesterSort';

const KhoaStudentList = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [lops, setLops] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLop, setSelectedLop] = useState('');
  const [selectedHk, setSelectedHk] = useState('HK1_2025_2026');
  const [search, setSearch] = useState('');

  const maKhoa = user?.maKhoa || 'IT';

  useEffect(() => {
    Promise.all([
      axiosClient.get(`/api/common/danh-muc/lop?maKhoa=${maKhoa}`),
      axiosClient.get('/api/common/danh-muc/hoc-ky')
    ]).then(([rLop, rHk]) => {
      if (rLop.data.success) setLops(rLop.data.data);
      if (rHk.data.success) setHocKys(sortSemesters(rHk.data.data));
    }).catch(console.error);
  }, [maKhoa]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('maKhoa', maKhoa);
        if (selectedLop) params.append('maLop', selectedLop);
        if (selectedHk) params.append('maHocKy', selectedHk);
        if (search) params.append('search', search);
        const res = await axiosClient.get(`/api/khoa/students?${params.toString()}`);
        if (res.data.success) setStudents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [maKhoa, selectedLop, selectedHk, search]);

  const totalStudents = students.length;
  const warnedStudents = students.filter(s => s.canhBao && s.canhBao !== 'Bình thường').length;
  const normalStudents = totalStudents - warnedStudents;
  const avgGpa = totalStudents > 0 ? (students.reduce((sum, s) => sum + (Number(s.diemTrungBinh) || 0), 0) / totalStudents).toFixed(2) : '-';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Danh sách Sinh viên & Kết quả Học tập - Rèn luyện Khoa</h1>
        <p className="text-sm text-slate-500 mt-1">Theo dõi chi tiết sinh viên thuộc <strong>{user?.tenKhoa || 'Khoa CNTT'}</strong>, cảnh báo GPA thấp và nợ môn</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Sinh viên', val: `${totalStudents} SV`, sub: 'Toàn bộ sinh viên trong khoa', bg: 'bg-blue-50/80 border-blue-200/80 text-blue-800', txt: 'text-slate-800', icon: <Users className="w-4 h-4" />, iconBg: 'bg-blue-100 text-blue-700' },
          { label: 'GPA Trung bình', val: `${avgGpa} / 4.0`, sub: 'Theo bộ lọc học kỳ hiện tại', bg: 'bg-purple-50/80 border-purple-200/80 text-purple-800', txt: 'text-purple-900', icon: <BookOpen className="w-4 h-4" />, iconBg: 'bg-purple-100 text-purple-700' },
          { label: 'Tình trạng Bình thường', val: `${normalStudents} SV`, sub: 'Đạt chuẩn tiến độ đào tạo', bg: 'bg-emerald-50/80 border-emerald-200/80 text-emerald-800', txt: 'text-emerald-900', icon: <CheckCircle className="w-4 h-4" />, iconBg: 'bg-emerald-100 text-emerald-700' },
          { label: 'Cảnh báo Học vụ', val: `${warnedStudents} SV`, sub: 'GPA < 2.0 hoặc nợ môn', bg: 'bg-amber-50/80 border-amber-200/80 text-amber-800', txt: 'text-amber-900', icon: <AlertTriangle className="w-4 h-4" />, iconBg: 'bg-amber-100 text-amber-700' },
        ].map((c, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${c.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">{c.label}</span>
              <span className={`p-2 rounded-xl ${c.iconBg}`}>{c.icon}</span>
            </div>
            <p className={`text-2xl font-black mt-2 ${c.txt}`}>{c.val}</p>
            <span className="text-[11px] font-medium opacity-80">{c.sub}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo MSSV, Họ và tên..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select value={selectedLop} onChange={(e) => setSelectedLop(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">-- Tất cả Lớp sinh hoạt --</option>
          {lops.map(l => <option key={l.maLop} value={l.maLop}>{l.tenLop} ({l.maLop})</option>)}
        </select>
        <select value={selectedHk} onChange={(e) => setSelectedHk(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">-- Tất cả Học kỳ --</option>
          {hocKys.map(h => <option key={h.maHocKy} value={h.maHocKy}>{h.tenHocKy}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">MSSV</th>
                <th className="px-5 py-3.5">Họ và Tên</th>
                <th className="px-5 py-3.5">Lớp / Ngành</th>
                <th className="px-5 py-3.5 text-center">GPA</th>
                <th className="px-5 py-3.5 text-center">ĐRL</th>
                <th className="px-5 py-3.5 text-center">Tín chỉ</th>
                <th className="px-5 py-3.5">Cảnh báo Học vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Đang tải danh sách sinh viên khoa...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-400">Không tìm thấy sinh viên nào</td></tr>
              ) : (
                students.map((sv) => {
                  const isWarned = sv.canhBao && sv.canhBao !== 'Bình thường';
                  return (
                    <tr key={sv.mssv} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-primary-700">{sv.mssv}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        <div>{sv.hoTen}</div>
                        <div className="text-xs text-slate-400">{sv.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        <div className="font-semibold text-slate-800">{sv.maLop}</div>
                        <div>{sv.tenNganh}</div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">{sv.diemTrungBinh != null ? sv.diemTrungBinh.toFixed(2) : '-'}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">{sv.diemRenLuyen != null ? sv.diemRenLuyen : '-'}</td>
                      <td className="px-5 py-3.5 text-center text-xs text-slate-600">{sv.soTinChi != null ? sv.soTinChi : '-'}</td>
                      <td className="px-5 py-3.5">
                        {isWarned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> {sv.canhBao}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Bình thường
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KhoaStudentList;
