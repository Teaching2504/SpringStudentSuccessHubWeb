import React from 'react';

const VARIANT_MAP = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_STYLE_MAP = {
  HOAT_DONG: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DANG_HOC: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DA_PHE_DUYET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DA_DUYET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DA_CHAP_NHAN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CHINH_THUC: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DA_CONG_BO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DU_KIEN: 'bg-blue-50 text-blue-700 border-blue-200',
  DA_CONG_BO_DU_KIEN: 'bg-blue-50 text-blue-700 border-blue-200',
  DANG_MO: 'bg-blue-50 text-blue-700 border-blue-200',
  DANG_XET_DUYET: 'bg-blue-50 text-blue-700 border-blue-200',
  CHO_DUYET: 'bg-amber-50 text-amber-700 border-amber-200',
  CHO_XU_LY: 'bg-amber-50 text-amber-700 border-amber-200',
  CHUA_XET: 'bg-amber-50 text-amber-700 border-amber-200',
  DA_CHOT_GUI_TRUONG: 'bg-purple-50 text-purple-700 border-purple-200',
  BI_KHOA: 'bg-rose-50 text-rose-700 border-rose-200',
  THOI_HOC: 'bg-rose-50 text-rose-700 border-rose-200',
  TU_CHOI: 'bg-rose-50 text-rose-700 border-rose-200',
  DA_TU_CHOI: 'bg-rose-50 text-rose-700 border-rose-200',
  BI_TRA_VE: 'bg-rose-50 text-rose-700 border-rose-200',
  KHONG_DAT: 'bg-rose-50 text-rose-700 border-rose-200',
  BI_LOAI: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_TEXT_MAP = {
  HOAT_DONG: 'Hoạt động', BI_KHOA: 'Bị khóa', DANG_HOC: 'Đang học', BAO_LUU: 'Bảo lưu',
  THOI_HOC: 'Thôi học', DANG_MO: 'Đang mở', DANG_XET_DUYET: 'Đang xét duyệt', DA_CONG_BO: 'Đã công bố',
  DONG: 'Đã đóng', CHUA_XET: 'Chưa xét duyệt', DA_CONG_BO_DU_KIEN: 'Đã công bố dự kiến',
  DA_CHOT_GUI_TRUONG: 'Đã chốt gửi Trường', DA_PHE_DUYET: 'Đã phê duyệt', BI_TRA_VE: 'Bị trả về (y/c sửa)',
  DU_KIEN: 'Đạt dự kiến', CHINH_THUC: 'Đạt chính thức', KHONG_DAT: 'Không đạt', BI_LOAI: 'Bị loại',
  CHO_DUYET: 'Chờ duyệt', DA_DUYET: 'Đã duyệt', TU_CHOI: 'Từ chối', CHO_XU_LY: 'Chờ xử lý',
  DA_CHAP_NHAN: 'Đã chấp nhận', DA_TU_CHOI: 'Đã từ chối', XUAT_SAC: 'Học bổng Xuất Sắc',
  GIOI: 'Học bổng Giỏi', KHA: 'Học bổng Khá',
};

const Badge = ({ variant = 'slate', status, children, className = '' }) => {
  if (status) {
    const style = STATUS_STYLE_MAP[status] || (variant ? VARIANT_MAP[variant] : 'bg-slate-100 text-slate-700 border-slate-200');
    const text = children || STATUS_TEXT_MAP[status] || status || '—';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}>
        {text}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${VARIANT_MAP[variant] || 'bg-slate-100 text-slate-700 border-slate-200'} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => (
  <Badge status={status} className={className} />
);

export default Badge;
