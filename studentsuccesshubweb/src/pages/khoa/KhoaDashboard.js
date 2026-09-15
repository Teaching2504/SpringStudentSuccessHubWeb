import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Users, Award, CheckSquare, MessageSquare, AlertTriangle, ChevronRight, Play, Sliders } from 'lucide-react';

const KhoaDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyData(user?.maKhoa || 'IT');
  }, [user]);

  const fetchFacultyData = async (maKhoa) => {
    try {
      setLoading(true);
      const [rStats, rCamp] = await Promise.all([
        axiosClient.get(`/api/khoa/stats?maKhoa=${maKhoa}`),
        axiosClient.get(`/api/khoa/campaigns?maKhoa=${maKhoa}`)
      ]);

      if (rStats.data.success) setStats(rStats.data.data);
      if (rCamp.data.success) setCampaigns(rCamp.data.data);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Cổng Quản lý Đào tạo & Xét duyệt Học bổng Cấp Khoa
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Đơn vị: <strong>{user?.tenKhoa || 'Khoa Công nghệ Thông tin'}</strong> ({user?.maKhoa || 'CNTT'})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sinh viên Khoa</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.tongSinhVien || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hồ sơ Đạt học bổng</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.tongHoSoDatHocBong || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Minh chứng chờ duyệt</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.soMinhChungChoDuyet || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kiến nghị chờ xử lý</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.soKienNghiChoXuLy || 0}</h3>
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/khoa/evidence"
          className="p-5 bg-gradient-to-r from-amber-50/90 to-yellow-50/80 hover:from-amber-100/90 hover:to-yellow-100/80 border border-amber-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-amber-950 transition-colors">
                Phê duyệt Minh chứng Rèn luyện
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Xem xét giấy tờ hoạt động, đề xuất cộng điểm ĐRL cho sinh viên
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all shrink-0 ml-2">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        <Link
          to="/khoa/appeals"
          className="p-5 bg-gradient-to-r from-blue-50/90 to-sky-50/80 hover:from-blue-100/90 hover:to-sky-100/80 border border-blue-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-950 transition-colors">
                Xử lý Khiếu nại / Kiến nghị
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Giải đáp thắc mắc của sinh viên trong thời hạn công bố danh sách dự kiến
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white group-hover:border-blue-700 transition-all shrink-0 ml-2">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition" />
          </div>
        </Link>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Các đợt xét học bổng của Khoa</h2>

        <div className="divide-y divide-slate-100">
          {campaigns.map((c) => (
            <div key={c.maDotXetHbKhoa} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{c.tenDot}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉ tiêu: <strong>{c.chiTieu} suất</strong> | Ngân sách:{' '}
                  <strong className="text-emerald-700">{formatCurrency(c.nganSachKhoa)}</strong> | Hạn phản hồi:{' '}
                  <strong>{c.hanPhanHoi}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/khoa/campaigns/${c.maDotXetHbKhoa}`}
                  className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-primary-700/20 transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Chạy Rule Engine & Xét duyệt
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KhoaDashboard;
