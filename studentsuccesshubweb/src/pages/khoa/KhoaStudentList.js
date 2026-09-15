import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { AlertTriangle, CheckCircle, Users, BookOpen } from 'lucide-react';
import { sortSemesters } from '../../utils/semesterSort';
import KhoaStudentTable from './components/KhoaStudentTable';

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

      <KhoaStudentTable
        search={search}
        setSearch={setSearch}
        selectedLop={selectedLop}
        setSelectedLop={setSelectedLop}
        lops={lops}
        selectedHk={selectedHk}
        setSelectedHk={setSelectedHk}
        hocKys={hocKys}
        students={students}
        loading={loading}
      />
    </div>
  );
};

export default KhoaStudentList;
