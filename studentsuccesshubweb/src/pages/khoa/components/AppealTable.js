import React from 'react';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import Badge from '../../../components/common/Badge';

const AppealTable = ({ appeals, loading, onOpenModal }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Sinh viên</th>
              <th className="px-5 py-3.5">Nội dung kiến nghị</th>
              <th className="px-5 py-3.5 text-center">GPA / ĐRL hiện tại</th>
              <th className="px-5 py-3.5">Minh chứng</th>
              <th className="px-5 py-3.5 text-center">Trạng thái</th>
              <th className="px-5 py-3.5">Kết quả phản hồi</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8 text-slate-400">Đang tải danh sách kiến nghị...</td></tr>
            ) : appeals.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-slate-400">Không có kiến nghị nào cần xử lý</td></tr>
            ) : (
              appeals.map((kn) => (
                <tr key={kn.maKienNghi} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    <div className="font-bold">{kn.hoTenSinhVien}</div>
                    <div className="text-xs font-mono text-primary-700">{kn.mssv} {kn.maLop ? `(${kn.maLop})` : ''}</div>
                    <div className="text-[11px] text-slate-400">{kn.tenDot || kn.maHocKy}</div>
                  </td>
                  <td className="px-5 py-3.5 max-w-sm">
                    <p className="text-slate-800 text-xs font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">{kn.noiDung}</p>
                    <span className="text-[11px] text-slate-400 font-mono mt-1 block">Ngày gửi: {kn.ngayGui}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="font-bold text-primary-700">GPA: {kn.diemTrungBinhHienTai != null ? Number(kn.diemTrungBinhHienTai).toFixed(2) : '-'}</div>
                    <div className="text-xs font-semibold text-purple-700 mt-0.5">ĐRL: {kn.diemRenLuyenHienTai != null ? kn.diemRenLuyenHienTai : '-'} đ</div>
                  </td>
                  <td className="px-5 py-3.5">
                    {kn.tepMinhChung ? (
                      <a href={kn.tepMinhChung} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 underline">
                        <ExternalLink className="w-3.5 h-3.5" /> Xem file
                      </a>
                    ) : <span className="text-xs text-slate-400">Không đính kèm</span>}
                  </td>
                  <td className="px-5 py-3.5 text-center"><Badge status={kn.trangThai} /></td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs">
                    {kn.phanHoi ? (
                      <div>
                        <p className="line-clamp-2">{kn.phanHoi}</p>
                        {kn.hoTenNhanVien && <span className="text-[10px] text-slate-400 block mt-0.5">Bởi: {kn.hoTenNhanVien}</span>}
                      </div>
                    ) : <span className="text-slate-400 italic">Chưa phản hồi</span>}
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                    {kn.trangThai === 'CHO_XU_LY' ? (
                      <>
                        <button onClick={() => onOpenModal(kn, true)} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Chấp nhận & Chỉnh ĐRL
                        </button>
                        <button onClick={() => onOpenModal(kn, false)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Từ chối
                        </button>
                      </>
                    ) : (
                      <button onClick={() => onOpenModal(kn, true)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer">
                        Cập nhật lại
                      </button>
                    )}
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

export default AppealTable;
