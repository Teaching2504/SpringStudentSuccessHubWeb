import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { BarChart3, PieChart, DollarSign, Award, Users, TrendingUp } from 'lucide-react';

const TruongStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/truong/stats');
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Báo cáo & Thống kê Học bổng Toàn trường</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng hợp số liệu giải ngân quỹ học bổng, cơ cấu xếp loại và phân bổ theo từng đơn vị Khoa
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-blue-50/90 to-sky-100/80 border border-blue-200/90 p-6 rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Tổng Kinh phí Đã Duyệt</p>
          <h2 className="text-2xl font-black text-slate-800 mt-1">{formatCurrency(stats?.tongKinhPhiHocBong)}</h2>
          <p className="text-xs text-blue-700 mt-3 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-4 h-4 text-blue-600" /> Toàn bộ sinh viên đạt điều kiện
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Suất Học bổng</p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{stats?.tongHoSoDatHocBong || 0} suất</h2>
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-3">Đã xét duyệt qua Dynamic Rule Engine</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khoa Tham gia</p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">{stats?.tongKhoa || 0} Khoa</h2>
          </div>
          <p className="text-xs text-slate-500 mt-3">{stats?.tongSinhVien || 0} sinh viên toàn hệ thống</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-600" /> Bảng Phân bổ Ngân sách & Số lượng theo Khoa
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Tên Đơn vị / Khoa</th>
                <th className="px-5 py-3 text-center">Số suất đạt</th>
                <th className="px-5 py-3 text-right">Tổng kinh phí phân bổ (VNĐ)</th>
                <th className="px-5 py-3 text-right">Tỷ trọng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {stats?.hocBongTheoKhoa &&
                Object.entries(stats.hocBongTheoKhoa).map(([khoa, count]) => {
                  const money = stats?.kinhPhiTheoKhoa?.[khoa] || 0;
                  const ratio = stats?.tongKinhPhiHocBong && stats.tongKinhPhiHocBong > 0
                    ? ((money / stats.tongKinhPhiHocBong) * 100).toFixed(1)
                    : 0;

                  return (
                    <tr key={khoa} className="hover:bg-slate-50/80">
                      <td className="px-5 py-3.5 font-bold text-slate-800">{khoa}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-primary-700">{count} suất</td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-700">{formatCurrency(money)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-slate-600">{ratio}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scholarship Types Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary-600" /> Cơ cấu phân loại Học bổng Toàn trường
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Xuất sắc (10,000,000 đ)</span>
            <h3 className="text-3xl font-extrabold text-emerald-700 mt-2">
              {stats?.phanBoLoaiHocBong?.XUAT_SAC || 0}
            </h3>
            <p className="text-xs text-emerald-600 mt-1">GPA &ge; 3.60 | ĐRL &ge; 90</p>
          </div>

          <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl text-center">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Giỏi (7,000,000 đ)</span>
            <h3 className="text-3xl font-extrabold text-blue-700 mt-2">
              {stats?.phanBoLoaiHocBong?.GIOI || 0}
            </h3>
            <p className="text-xs text-blue-600 mt-1">GPA &ge; 3.20 | ĐRL &ge; 80</p>
          </div>

          <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Khá (5,000,000 đ)</span>
            <h3 className="text-3xl font-extrabold text-amber-700 mt-2">
              {stats?.phanBoLoaiHocBong?.KHA || 0}
            </h3>
            <p className="text-xs text-amber-600 mt-1">GPA &ge; 2.50 | ĐRL &ge; 65</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruongStats;
