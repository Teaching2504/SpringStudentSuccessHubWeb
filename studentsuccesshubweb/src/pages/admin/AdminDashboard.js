import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Users, Building, BookOpen, Award, DollarSign, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan Quản trị Hệ thống (Admin)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Giám sát toàn bộ người dùng, danh mục đào tạo, kết quả học tập và quỹ học bổng
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Sinh viên</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.tongSinhVien || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khoa / Đơn vị</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats?.tongKhoa || 0} Khoa</h3>
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
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Kinh phí Đã duyệt</p>
            <h3 className="text-lg font-bold text-emerald-700 mt-0.5">{formatCurrency(stats?.tongKinhPhiHocBong)}</h3>
          </div>
        </div>
      </div>

      {/* Secondary Status Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-800">Đợt xét học bổng</p>
              <p className="text-sm font-bold text-slate-800">{stats?.tongDotXet || 0} Chiến dịch</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-800">Minh chứng chờ duyệt</p>
              <p className="text-sm font-bold text-slate-800">{stats?.soMinhChungChoDuyet || 0} hồ sơ</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-800">Cảnh báo học tập (GPA &lt; 2.0 / Nợ môn)</p>
              <p className="text-sm font-bold text-slate-800">{stats?.soSinhVienCanhBao || 0} sinh viên</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Charts / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Học bổng theo Khoa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">Phân bổ Học bổng theo Khoa</h2>
          <div className="space-y-3">
            {stats?.hocBongTheoKhoa && Object.entries(stats.hocBongTheoKhoa).map(([khoa, count]) => (
              <div key={khoa} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">{khoa}</span>
                <span className="text-sm font-bold px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
                  {count} suất
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phân loại Học bổng */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">Cơ cấu Loại Học bổng Đạt được</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="text-xs font-semibold text-emerald-800 uppercase">Xuất Sắc</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {stats?.phanBoLoaiHocBong?.XUAT_SAC || 0}
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <p className="text-xs font-semibold text-blue-800 uppercase">Giỏi</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {stats?.phanBoLoaiHocBong?.GIOI || 0}
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-xs font-semibold text-amber-800 uppercase">Khá</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                {stats?.phanBoLoaiHocBong?.KHA || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
