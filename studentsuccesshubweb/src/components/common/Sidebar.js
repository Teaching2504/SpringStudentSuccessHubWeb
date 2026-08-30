import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  GraduationCap,
  Award,
  Sliders,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  BarChart3,
  UserCheck,
  FileText,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.vaiTro;

  const adminLinks = [
    { to: '/admin', label: 'Tổng quan hệ thống', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Quản lý tài khoản & Quyền', icon: Users },
    { to: '/admin/categories', label: 'Danh mục (Khoa/Ngành/Lớp)', icon: FolderTree },
    { to: '/admin/students', label: 'Quản lý hồ sơ Sinh viên', icon: GraduationCap },
  ];

  const truongLinks = [
    { to: '/truong', label: 'Tổng quan cấp Trường', icon: LayoutDashboard },
    { to: '/truong/campaigns', label: 'Quản lý Đợt & Rule Engine', icon: Sliders },
    { to: '/truong/stats', label: 'Báo cáo & Thống kê Ngân sách', icon: BarChart3 },
  ];

  const khoaLinks = [
    { to: '/khoa', label: `Tổng quan ${user?.tenKhoa || 'Khoa'}`, icon: LayoutDashboard },
    { to: '/khoa/students', label: 'Danh sách SV & Cảnh báo', icon: AlertTriangle },
    { to: '/khoa/evidence', label: 'Duyệt Minh chứng Rèn luyện', icon: FileCheck },
    { to: '/khoa/appeals', label: 'Xử lý Kiến nghị', icon: HelpCircle },
  ];

  const svLinks = [
    { to: '/sinh-vien', label: 'Kết quả Học tập & Rèn luyện', icon: LayoutDashboard },
    { to: '/sinh-vien/grades', label: 'Bảng điểm & Học phí kỳ', icon: FileSpreadsheet },
    { to: '/sinh-vien/curriculum', label: 'Chương trình Đào tạo', icon: FolderTree },
    { to: '/sinh-vien/scholarships', label: 'Tra cứu Học bổng & Kiến nghị', icon: Award },
    { to: '/sinh-vien/evidence', label: 'Nộp Minh chứng Rèn luyện', icon: UploadCloud },
  ];

  let links = [];
  if (role === 'ROLE_ADMIN') links = adminLinks;
  else if (role === 'ROLE_CAN_BO_TRUONG') links = truongLinks;
  else if (role === 'ROLE_CAN_BO_KHOA') links = khoaLinks;
  else if (role === 'ROLE_SINH_VIEN') links = svLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-sm">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Chức năng nghiệp vụ
        </div>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/truong' || item.to === '/khoa' || item.to === '/sinh-vien'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-700 text-white shadow-md shadow-primary-700/25 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3.5 bg-primary-50/70 border border-primary-100/80 rounded-2xl">
        <p className="text-xs font-bold text-primary-900 leading-snug">Hệ thống OU-SSH</p>
        <p className="text-[11px] text-primary-700 mt-0.5">Đồ Án Tốt Nghiệp 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
