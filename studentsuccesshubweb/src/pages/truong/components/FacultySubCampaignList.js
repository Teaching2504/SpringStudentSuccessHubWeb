import React from 'react';
import { DollarSign, Users, AlertCircle, Edit3, CheckCircle, XCircle } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatCurrency } from '../../../utils/formatters';

const SUB_STATUS = {
  CHUA_XET: <Badge variant="slate">Khoa chưa xét</Badge>,
  DA_CONG_BO_DU_KIEN: <Badge variant="blue">Khoa đã công bố dự kiến</Badge>,
  DA_CHOT_GUI_TRUONG: <Badge variant="purple">Đã gửi chờ trường duyệt</Badge>,
  DA_PHE_DUYET: <Badge variant="emerald">Trường đã duyệt</Badge>,
  BI_TRA_VE: <Badge variant="rose">Bị trả về yêu cầu sửa</Badge>,
};

export const FacultySubCampaignList = ({
  facultyCampaigns,
  selectedSubCamp,
  onSelectFaculty,
  onOpenQuotaModal,
  onOpenReviewModal
}) => {
  return (
    <div className="lg:col-span-1 space-y-3">
      <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Danh sách các Khoa trực thuộc ({facultyCampaigns.length})</h3>
      <div className="space-y-2">
        {facultyCampaigns.map((sub) => {
          const isSelected = selectedSubCamp?.maDotXetHbKhoa === sub.maDotXetHbKhoa;
          return (
            <div
              key={sub.maDotXetHbKhoa}
              onClick={() => onSelectFaculty(sub)}
              className={`p-4 rounded-2xl border transition cursor-pointer text-left ${isSelected ? 'bg-primary-50/50 border-primary-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">{sub.tenKhoa || sub.khoa?.tenKhoa}</span>
                <span className="text-xs font-mono font-bold text-primary-700">Quota: {sub.chiTieu || 0} suất</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Ngân sách:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(sub.nganSachKhoa)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-600" /> Đã đề xuất:</span>
                <span className="font-bold text-slate-700">{sub.soLuongSinhVienDuocCap || 0} SV</span>
              </div>
              {sub.soKienNghiChuaXuLy > 0 && (
                <div className="mt-2 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Có {sub.soKienNghiChuaXuLy} kiến nghị chưa xử lý
                </div>
              )}
              <div className="mt-2 flex items-center justify-between">{SUB_STATUS[sub.trangThai] || <Badge>{sub.trangThai}</Badge>}<span className="text-xs font-bold text-slate-600">Chỉ tiêu: {sub.chiTieu}</span></div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                <button onClick={() => onOpenQuotaModal(sub)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5" /> Chỉ tiêu
                </button>
                {sub.trangThai === 'DA_CHOT_GUI_TRUONG' && (
                  <>
                    <button onClick={() => onOpenReviewModal(sub, true)} className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                      <CheckCircle className="w-3.5 h-3.5" /> Duyệt
                    </button>
                    <button onClick={() => onOpenReviewModal(sub, false)} className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                      <XCircle className="w-3.5 h-3.5" /> Trả về
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FacultySubCampaignList;
