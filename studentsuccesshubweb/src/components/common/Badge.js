import React from 'react';

const Badge = ({ variant = 'slate', children, className = '' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'emerald':
      case 'green':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'amber':
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rose':
      case 'red':
      case 'danger':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getVariantStyles()} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'HOAT_DONG':
      case 'DANG_HOC':
      case 'DA_PHE_DUYET':
      case 'DA_DUYET':
      case 'DA_CHAP_NHAN':
      case 'CHINH_THUC':
      case 'DA_CONG_BO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DU_KIEN':
      case 'DA_CONG_BO_DU_KIEN':
      case 'DANG_MO':
      case 'DANG_XET_DUYET':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CHO_DUYET':
      case 'CHO_XU_LY':
      case 'CHUA_XET':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DA_CHOT_GUI_TRUONG':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'BI_KHOA':
      case 'THOI_HOC':
      case 'TU_CHOI':
      case 'DA_TU_CHOI':
      case 'BI_TRA_VE':
      case 'KHONG_DAT':
      case 'BI_LOAI':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'HOAT_DONG': return 'Hoạt động';
      case 'BI_KHOA': return 'Bị khóa';
      case 'DANG_HOC': return 'Đang học';
      case 'BAO_LUU': return 'Bảo lưu';
      case 'THOI_HOC': return 'Thôi học';
      case 'DANG_MO': return 'Đang mở';
      case 'DANG_XET_DUYET': return 'Đang xét duyệt';
      case 'DA_CONG_BO': return 'Đã công bố';
      case 'DONG': return 'Đã đóng';
      case 'CHUA_XET': return 'Chưa xét duyệt';
      case 'DA_CONG_BO_DU_KIEN': return 'Đã công bố dự kiến';
      case 'DA_CHOT_GUI_TRUONG': return 'Đã chốt gửi Trường';
      case 'DA_PHE_DUYET': return 'Đã phê duyệt';
      case 'BI_TRA_VE': return 'Bị trả về (y/c sửa)';
      case 'DU_KIEN': return 'Đạt dự kiến';
      case 'CHINH_THUC': return 'Đạt chính thức';
      case 'KHONG_DAT': return 'Không đạt';
      case 'BI_LOAI': return 'Bị loại';
      case 'CHO_DUYET': return 'Chờ duyệt';
      case 'DA_DUYET': return 'Đã duyệt';
      case 'TU_CHOI': return 'Từ chối';
      case 'CHO_XU_LY': return 'Chờ xử lý';
      case 'DA_CHAP_NHAN': return 'Đã chấp nhận';
      case 'DA_TU_CHOI': return 'Đã từ chối';
      case 'XUAT_SAC': return 'Học bổng Xuất Sắc';
      case 'GIOI': return 'Học bổng Giỏi';
      case 'KHA': return 'Học bổng Khá';
      default: return status || 'N/A';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
      {getStatusText()}
    </span>
  );
};

export default Badge;
