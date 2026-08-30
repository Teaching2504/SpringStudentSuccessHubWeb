import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Search, Filter, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import Badge from '../../components/common/Badge';
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
    fetchMetadata();
  }, [maKhoa]);

  useEffect(() => {
    fetchStudents();
  }, [maKhoa, selectedLop, selectedHk, search]);

  const fetchMetadata = async () => {
    try {
      const [rLop, rHk] = await Promise.all([
        axiosClient.get(`/api/common/danh-muc/lop?maKhoa=${maKhoa}`),
        axiosClient.get('/api/common/danh-muc/hoc-ky')
      ]);
      if (rLop.data.success) setLops(rLop.data.data);
      if (rHk.data.success) setHocKys(sortSemesters(rHk.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('maKhoa', maKhoa);
      if (selectedLop) params.append('maLop', selectedLop);
      if (selectedHk) params.append('maHocKy', selectedHk);
      if (search) params.append('search', search);

      const res = await axiosClient.get(`/api/khoa/students?${params.toString()}`);
      if (res.data.success) {
        setStudents(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Danh sách Sinh viên & Kết quả Học tập - Rèn luyện Khoa
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi chi tiết sinh viên thuộc <strong>{user?.tenKhoa || 'Khoa CNTT'}</strong>, cảnh báo GPA thấp và nợ môn
        </p>
      </div>

      {/* Filter Bar */}
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

        <div>
          <select
            value={selectedLop}
            onChange={(e) => setSelectedLop(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Tất cả Lớp sinh hoạt --</option>
            {lops.map((l) => (
              <option key={l.maLop} value={l.maLop}>
                {l.tenLop} ({l.maLop})
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedHk}
            onChange={(e) => setSelectedHk(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Tất cả Học kỳ --</option>
            {hocKys.map((h) => (
              <option key={h.maHocKy} value={h.maHocKy}>
                {h.tenHocKy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
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
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Đang tải danh sách sinh viên khoa...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    Không tìm thấy sinh viên nào
                  </td>
                </tr>
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
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                        {sv.diemTrungBinh != null ? sv.diemTrungBinh.toFixed(2) : '-'}
                      </td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                        {sv.diemRenLuyen != null ? sv.diemRenLuyen : '-'}
                      </td>
                      <td className="px-5 py-3.5 text-center text-xs text-slate-600">
                        {sv.soTinChi != null ? sv.soTinChi : '-'}
                      </td>
                      <td className="px-5 py-3.5">
                        {isWarned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> {sv.canhBao}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
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
