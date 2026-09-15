import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Award, DollarSign, Building, CheckCircle2, ChevronRight, Sliders, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TruongDashboard = () => {
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosClient.get('/api/truong/stats'),
      axiosClient.get('/api/truong/campaigns')
    ]).then(([rStats, rCamp]) => {
      if (rStats.data.success) setStats(rStats.data.data);
      if (rCamp.data.success) setCampaigns(rCamp.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Đang tải tổng quan Cấp Trường..." />;

  const kpis = [
    { label: 'Đợt xét học bổng', val: `${campaigns.length} Đợt`, icon: Award, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Hồ sơ Đạt học bổng', val: stats?.tongHoSoDatHocBong || 0, icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Tổng Kinh phí Đã duyệt', val: formatCurrency(stats?.tongKinhPhiHocBong), icon: DollarSign, bg: 'bg-amber-50 text-amber-600', valClass: 'text-lg font-bold text-emerald-700' },
    { label: 'Khoa tham gia', val: `${stats?.tongKhoa || 0} Khoa`, icon: Building, bg: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Cổng Điều hành Cán bộ Cấp Trường (P.CTSV)</h1>
        <p className="text-sm text-slate-500 mt-1">Hoạch định đợt xét học bổng, cấu hình Dynamic Rule Engine, phân bổ chỉ tiêu và phê duyệt toàn trường</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3.5 rounded-xl ${k.bg}`}><Icon className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{k.label}</p>
                <h3 className={`mt-0.5 ${k.valClass || 'text-2xl font-bold text-slate-800'}`}>{k.val}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/truong/campaigns" className="p-5 bg-gradient-to-r from-blue-50/90 to-sky-50/80 hover:from-blue-100/90 hover:to-sky-100/80 border border-blue-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><Sliders className="w-6 h-6" /></div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-950 transition-colors">Quản lý Đợt xét & Cấu hình Quy tắc</h3>
              <p className="text-xs text-slate-500 font-medium">Thiết lập chỉ tiêu, ngân sách, điều kiện điểm GPA/ĐRL & phiên bản quy tắc</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white group-hover:border-blue-700 transition-all shrink-0 ml-2">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        <Link to="/truong/stats" className="p-5 bg-gradient-to-r from-amber-50/90 to-yellow-50/80 hover:from-amber-100/90 hover:to-yellow-100/80 border border-amber-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors"><FileText className="w-6 h-6" /></div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-amber-950 transition-colors">Báo cáo Thống kê & Phân tích</h3>
              <p className="text-xs text-slate-500 font-medium">Biểu đồ phân bổ ngân sách, học bổng theo khoa và xếp hạng sinh viên</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all shrink-0 ml-2">
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition" />
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Các đợt xét học bổng gần đây</h2>
          <Link to="/truong/campaigns" className="text-sm font-semibold text-primary-600 hover:text-primary-700">Xem tất cả →</Link>
        </div>

        <div className="divide-y divide-slate-100">
          {campaigns.map(c => (
            <div key={c.maDot} className="py-3.5 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{c.tenDot}</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{c.maDot} | Học kỳ: {c.tenHocKy || c.maHocKy} | Hạn: {c.ngayKetThuc}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${c.trangThai === 'DA_CONG_BO' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {c.trangThai === 'DA_CONG_BO' ? 'Đã công bố chính thức' : 'Đang mở xét duyệt'}
                </span>
                <Link to={`/truong/campaigns/${c.maDot}`} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition">Chi tiết đợt xét</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TruongDashboard;
