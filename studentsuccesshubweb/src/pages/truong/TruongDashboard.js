import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Award, DollarSign, Building, AlertCircle, CheckCircle2, ChevronRight, Sliders, FileText } from 'lucide-react';

const TruongDashboard = () => {
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rStats, rCamp] = await Promise.all([
        axiosClient.get('/api/truong/stats'),
        axiosClient.get('/api/truong/campaigns')
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
        <h1 className="text-2xl font-bold text-slate-800">Cổng Điều hành Cán bộ Cấp Trường (P.CTSV)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Hoạch định đợt xét học bổng, cấu hình Dynamic Rule Engine, phân bổ chỉ tiêu và phê duyệt toàn trường
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đợt xét học bổng</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{campaigns.length} Đợt</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hồ sơ Đạt học bổng</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.tongHoSoDatHocBong || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Kinh phí Đã duyệt</p>
            <h3 className="text-lg font-bold text-emerald-700 mt-0.5">{formatCurrency(stats?.tongKinhPhiHocBong)}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khoa tham gia</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.tongKhoa || 0} Khoa</h3>
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/truong/campaigns"
          className="p-5 bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-2xl shadow-lg flex items-center justify-between group cursor-pointer hover:shadow-xl transition"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5" /> Quản lý Đợt xét & Cấu hình Quy tắc
            </h3>
            <p className="text-xs text-primary-200">
              Thiết lập chỉ tiêu, ngân sách, điều kiện điểm GPA/ĐRL & phiên bản quy tắc
            </p>
          </div>
          <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/truong/stats"
          className="p-5 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-2xl shadow-lg flex items-center justify-between group cursor-pointer hover:shadow-xl transition"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" /> Báo cáo Thống kê & Phân tích
            </h3>
            <p className="text-xs text-slate-300">
              Biểu đồ phân bổ ngân sách, học bổng theo khoa và xếp hạng sinh viên
            </p>
          </div>
          <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Campaigns list preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Các đợt xét học bổng gần đây</h2>
          <Link to="/truong/campaigns" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            Xem tất cả →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {campaigns.map((c) => (
            <div key={c.maDot} className="py-3.5 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{c.tenDot}</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  {c.maDot} | Học kỳ: {c.tenHocKy || c.maHocKy} | Hạn: {c.ngayKetThuc}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  c.trangThai === 'DA_CONG_BO' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {c.trangThai === 'DA_CONG_BO' ? 'Đã công bố chính thức' : 'Đang mở xét duyệt'}
                </span>

                <Link
                  to={`/truong/campaigns/${c.maDot}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
                >
                  Chi tiết đợt xét
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TruongDashboard;
