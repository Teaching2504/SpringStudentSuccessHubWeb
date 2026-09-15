import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const CohortMajorSummary = ({ cohortMajorGroups }) => {
  if (!cohortMajorGroups || cohortMajorGroups.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Quỹ Học Bổng 8% Phân bổ theo từng Ngành & Khóa học ({cohortMajorGroups.length} nhóm)
        </h3>
        <span className="text-xs text-slate-500 font-medium">* Xét duyệt & xếp thứ tự riêng biệt cho từng nhóm (Ngành - Khóa)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cohortMajorGroups.map(g => (
          <div key={g.key} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">{g.tenNganh}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-primary-100 text-primary-800 rounded-md">{g.khoaHoc}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-slate-500 block text-[11px]">Tổng học phí thu:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(g.totalTuition)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Quỹ 8% học bổng:</span>
                <span className="font-black text-emerald-700">{formatCurrency(g.totalTuition * 0.08)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Đã cấp: <strong>{g.awardedCount} / {g.totalSV} SV</strong></span>
              <span className="font-bold text-emerald-700">{formatCurrency(g.totalAwarded)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CohortMajorSummary;
