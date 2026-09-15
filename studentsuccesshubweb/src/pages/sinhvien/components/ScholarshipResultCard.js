import React from 'react';
import { MessageSquare } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatCurrency } from '../../../utils/formatters';

const ScholarshipResultCard = ({ scholarships, loading, onOpenAppealModal }) => {
  if (loading) {
    return <div className="text-center py-12 text-slate-400">Đang tải kết quả học bổng...</div>;
  }

  if (scholarships.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
        Hiện chưa có kết quả xét học bổng nào trong các kỳ học của bạn
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scholarships.map((hs) => (
        <div key={hs.maHoSo} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{hs.tenDot}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Đơn vị: {hs.tenKhoa} | Mã hồ sơ: {hs.maHoSo}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge status={hs.trangThai} />
              <button
                onClick={() => onOpenAppealModal(hs)}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Gửi Kiến nghị / Khiếu nại
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Thứ hạng xếp loại</span>
              <span className="font-bold text-slate-800 text-base mt-0.5 block">{hs.thuHang ? `Hạng #${hs.thuHang}` : 'Không xếp hạng'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Điểm GPA kỳ</span>
              <span className="font-bold text-slate-800 text-base mt-0.5 block">{hs.diemTrungBinh != null ? hs.diemTrungBinh.toFixed(2) : '-'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Điểm Rèn luyện</span>
              <span className="font-bold text-slate-800 text-base mt-0.5 block">{hs.diemRenLuyen != null ? hs.diemRenLuyen : '-'} đ</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Loại Học bổng</span>
              <span className="font-bold text-slate-800 text-base mt-0.5 block">{hs.loaiHocBong || 'Không đạt'}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 block font-semibold">Số tiền Học bổng</span>
              <span className="font-extrabold text-emerald-700 text-base mt-0.5 block">{formatCurrency(hs.mucHocBong)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScholarshipResultCard;
