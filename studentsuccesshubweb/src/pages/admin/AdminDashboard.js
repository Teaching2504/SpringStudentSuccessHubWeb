import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Users, Building, Award, DollarSign, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/api/admin/stats')
      .then(res => { if (res.data.success) setStats(res.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Đang tải tổng quan hệ thống..." />;

  const kpiCards = [
    { label: 'Tổng Sinh viên', val: stats?.tongSinhVien || 0, icon: Users, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Khoa / Đơn vị', val: `${stats?.tongKhoa || 0} Khoa`, icon: Building, bg: 'bg-purple-50 text-purple-600' },
    { label: 'Hồ sơ Đạt học bổng', val: stats?.tongHoSoDatHocBong || 0, icon: Award, bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Tổng Kinh phí Đã duyệt', val: formatCurrency(stats?.tongKinhPhiHocBong), icon: DollarSign, bg: 'bg-amber-50 text-amber-600', valClass: 'text-lg font-bold text-emerald-700' },
  ];

  const alerts = [
    { label: 'Đợt xét học bổng', val: `${stats?.tongDotXet || 0} Chiến dịch`, icon: ShieldCheck, cardBg: 'bg-emerald-50/70 border-emerald-200/80', iconBg: 'bg-emerald-100 text-emerald-700', textCls: 'text-emerald-800' },
    { label: 'Minh chứng chờ duyệt', val: `${stats?.soMinhChungChoDuyet || 0} hồ sơ`, icon: CheckCircle2, cardBg: 'bg-blue-50/70 border-blue-200/80', iconBg: 'bg-blue-100 text-blue-700', textCls: 'text-blue-800' },
    { label: 'Cảnh báo học tập (GPA < 2.0 / Nợ môn)', val: `${stats?.soSinhVienCanhBao || 0} sinh viên`, icon: AlertTriangle, cardBg: 'bg-amber-50/70 border-amber-200/80', iconBg: 'bg-amber-100 text-amber-700', textCls: 'text-amber-800' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan Quản trị Hệ thống (Admin)</h1>
        <p className="text-sm text-slate-500 mt-1">Giám sát toàn bộ người dùng, danh mục đào tạo, kết quả học tập và quỹ học bổng</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3.5 rounded-xl ${c.bg}`}><Icon className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
                <h3 className={`mt-0.5 ${c.valClass || 'text-2xl font-bold text-slate-800'}`}>{c.val}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {alerts.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className={`border rounded-2xl p-4 flex items-center justify-between ${a.cardBg}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${a.iconBg}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className={`text-xs font-semibold ${a.textCls}`}>{a.label}</p>
                  <p className="text-sm font-bold text-slate-800">{a.val}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">Phân bổ Học bổng theo Khoa</h2>
          <div className="space-y-3">
            {stats?.hocBongTheoKhoa && Object.entries(stats.hocBongTheoKhoa).map(([khoa, count]) => (
              <div key={khoa} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">{khoa}</span>
                <span className="text-sm font-bold px-3 py-1 bg-primary-100 text-primary-800 rounded-full">{count} suất</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">Cơ cấu Loại Học bổng Đạt được</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { type: 'Xuất Sắc', count: stats?.phanBoLoaiHocBong?.XUAT_SAC || 0, bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', numCls: 'text-emerald-700' },
              { type: 'Giỏi', count: stats?.phanBoLoaiHocBong?.GIOI || 0, bg: 'bg-blue-50 border-blue-200 text-blue-800', numCls: 'text-blue-700' },
              { type: 'Khá', count: stats?.phanBoLoaiHocBong?.KHA || 0, bg: 'bg-amber-50 border-amber-200 text-amber-800', numCls: 'text-amber-700' },
            ].map((b, i) => (
              <div key={i} className={`p-4 border rounded-2xl ${b.bg}`}>
                <p className="text-xs font-semibold uppercase">{b.type}</p>
                <p className={`text-2xl font-bold mt-1 ${b.numCls}`}>{b.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
