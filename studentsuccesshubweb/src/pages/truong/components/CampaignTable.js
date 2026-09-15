import React from 'react';
import { Link } from 'react-router-dom';
import { Sliders, Award, Edit2, Trash2, TrendingUp } from 'lucide-react';

export const CampaignTable = ({ campaigns, loading, onOpenRules, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-12 text-slate-400">Đang tải danh sách đợt xét...</div>;
  }

  if (campaigns.length === 0) {
    return <div className="text-center py-12 text-slate-400">Chưa có đợt xét học bổng nào</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {campaigns.map(c => (
        <div key={c.maDot} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-800">{c.tenDot}</h2>
                <span className={`px-3 py-0.5 text-xs font-semibold rounded-full ${c.trangThai === 'DA_CONG_BO' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                  {c.trangThai === 'DA_CONG_BO' ? 'Đã công bố chính thức' : 'Đang mở'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">Mã đợt: {c.maDot} | Học kỳ: <strong>{c.tenHocKy || c.maHocKy}</strong> | Thời hạn: {c.ngayBatDau} đến {c.ngayKetThuc}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => onOpenRules(c)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-xl transition cursor-pointer">
                <Sliders className="w-3.5 h-3.5" /> Quy tắc & Phiên bản
              </button>
              <Link to={`/truong/campaigns/${c.maDot}?tab=budget`} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl transition cursor-pointer">
                <TrendingUp className="w-3.5 h-3.5" /> Quỹ 8% (Khoa - Khóa - Ngành)
              </Link>
              <Link to={`/truong/campaigns/${c.maDot}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer">
                <Award className="w-3.5 h-3.5" /> Duyệt DS các Khoa
              </Link>
              <button onClick={() => onEdit(c)} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => onDelete(c.maDot)} className="p-2 border border-rose-200 rounded-xl hover:bg-rose-50 text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>

          {c.quyTacHienHanh && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div><span className="text-slate-400 block">Phiên bản Quy tắc</span><span className="font-bold text-purple-700 text-sm">Version {c.quyTacHienHanh.phienBan}</span></div>
              <div><span className="text-slate-400 block">Ngưỡng GPA tối thiểu</span><span className="font-bold text-slate-700 text-sm">GPA &ge; {c.quyTacHienHanh.diemTbDuoiThieu}</span></div>
              <div><span className="text-slate-400 block">Ngưỡng ĐRL tối thiểu</span><span className="font-bold text-slate-700 text-sm">ĐRL &ge; {c.quyTacHienHanh.diemRlToiThieu}</span></div>
              <div><span className="text-slate-400 block">Số TC tối thiểu / Nợ môn</span><span className="font-bold text-slate-700 text-sm">{c.quyTacHienHanh.soTinChiToiThieu} TC | {c.quyTacHienHanh.khongNoMon ? 'Không nợ môn' : 'Cho phép'}</span></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default CampaignTable;
