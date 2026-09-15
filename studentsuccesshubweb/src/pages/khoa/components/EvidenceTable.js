import React from 'react';
import { ExternalLink } from 'lucide-react';
import Badge from '../../../components/common/Badge';

const EvidenceTable = ({ evidenceList, loading, onOpenReviewModal }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Sinh viên</th>
              <th className="px-5 py-3.5">Tên hoạt động / Hoạt cảnh</th>
              <th className="px-5 py-3.5 text-center">Điểm đề xuất</th>
              <th className="px-5 py-3.5">Tệp đính kèm</th>
              <th className="px-5 py-3.5">Trạng thái</th>
              <th className="px-5 py-3.5">Phản hồi</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8 text-slate-400">Đang tải danh sách minh chứng...</td></tr>
            ) : evidenceList.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-slate-400">Không có minh chứng rèn luyện nào</td></tr>
            ) : (
              evidenceList.map((mc) => (
                <tr key={mc.maMinhChung} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    <div>{mc.hoTenSinhVien}</div>
                    <div className="text-xs font-mono text-primary-700">{mc.mssv} - {mc.maLop}</div>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="font-semibold text-slate-800">{mc.tenHoatDong}</div>
                    <div className="text-xs text-slate-500 truncate">{mc.moTa}</div>
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-emerald-700">+{mc.diemDeXuat || 0} đ</td>
                  <td className="px-5 py-3.5">
                    {mc.fileUrl ? (
                      <a href={mc.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 underline">
                        <ExternalLink className="w-3.5 h-3.5" /> Xem tài liệu
                      </a>
                    ) : <span className="text-xs text-slate-400">Không có file</span>}
                  </td>
                  <td className="px-5 py-3.5"><Badge status={mc.trangThai} /></td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">{mc.lyDoPhanHoi || '-'}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    {mc.trangThai === 'CHO_DUYET' ? (
                      <>
                        <button onClick={() => onOpenReviewModal(mc, true)} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer">
                          Duyệt (+Điểm)
                        </button>
                        <button onClick={() => onOpenReviewModal(mc, false)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer">
                          Từ chối
                        </button>
                      </>
                    ) : <span className="text-xs text-slate-400">Đã xử lý</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvidenceTable;
