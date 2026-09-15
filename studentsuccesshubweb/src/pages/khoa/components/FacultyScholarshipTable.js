import React from 'react';
import { Award, Search, BookOpen } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatCurrency } from '../../../utils/formatters';

const HB_TAGS = {
  XUAT_SAC: <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1"><Award className="w-3 h-3" /> Xuất sắc (100%)</span>,
  GIOI: <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 inline-flex items-center gap-1"><Award className="w-3 h-3" /> Giỏi (70%)</span>,
  KHA: <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 inline-flex items-center gap-1"><Award className="w-3 h-3" /> Khá (50%)</span>,
};

const FacultyScholarshipTable = ({
  search,
  setSearch,
  selectedDot,
  setSelectedDot,
  campaigns,
  selectedLoaiHb,
  setSelectedLoaiHb,
  selectedLop,
  setSelectedLop,
  lops,
  selectedHeDaoTao,
  setSelectedHeDaoTao,
  filteredList,
  loading,
  onViewGrades
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm MSSV, họ tên, lớp..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <select value={selectedDot} onChange={e => setSelectedDot(e.target.value)} className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <option value="ALL">Tất cả đợt xét</option>
            {campaigns.map(c => <option key={c.id || c.maDot} value={c.maDot}>{c.tenDot || c.maDot}</option>)}
          </select>
          <select value={selectedLoaiHb} onChange={e => setSelectedLoaiHb(e.target.value)} className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <option value="ALL">Tất cả loại học bổng</option><option value="XUAT_SAC">Loại Xuất Sắc</option><option value="GIOI">Loại Giỏi</option><option value="KHA">Loại Khá</option>
          </select>
          <select value={selectedLop} onChange={e => setSelectedLop(e.target.value)} className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <option value="ALL">Tất cả các lớp</option>
            {lops.map(l => <option key={l.maLop || l.id} value={l.maLop}>Lớp {l.maLop} {l.tenLop ? `(${l.tenLop})` : ''}</option>)}
          </select>
          <select value={selectedHeDaoTao} onChange={e => setSelectedHeDaoTao(e.target.value)} className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <option value="ALL">Tất cả hệ đào tạo</option><option value="CHUAN">Chuẩn (Đại trà)</option><option value="DAC_BIET">Chất lượng cao</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-4 py-3 text-center">Hạng</th>
                <th className="px-4 py-3">Sinh viên</th>
                <th className="px-4 py-3">Lớp & Ngành</th>
                <th className="px-4 py-3 text-center">GPA / ĐRL</th>
                <th className="px-4 py-3 text-center">Tín chỉ</th>
                <th className="px-4 py-3 text-center">Loại Học Bổng</th>
                <th className="px-4 py-3 text-right">Số Tiền (VNĐ)</th>
                <th className="px-4 py-3 text-center">Trạng Thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr><td colSpan="9" className="text-center py-10 text-slate-400">Đang tải danh sách học bổng...</td></tr>
              ) : filteredList.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-10 text-slate-400">Không tìm thấy sinh viên nào phù hợp với bộ lọc</td></tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-slate-800">
                      {item.thuHang ? <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px]">{item.thuHang}</span> : '-'}
                    </td>
                    <td className="px-4 py-3"><div className="font-bold text-slate-900">{item.hoTen}</div><div className="text-[11px] text-slate-500 font-mono">{item.mssv}</div></td>
                    <td className="px-4 py-3"><div className="font-semibold text-slate-800">{item.maLop}</div><div className="text-[11px] text-slate-500">{item.tenNganh}</div></td>
                    <td className="px-4 py-3 text-center"><div className="font-bold text-primary-700">GPA: {item.diemTrungBinh != null ? Number(item.diemTrungBinh).toFixed(2) : '-'}</div><div className="text-[11px] font-semibold text-purple-700">ĐRL: {item.diemRenLuyen != null ? item.diemRenLuyen : '-'} đ</div></td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">{item.soTinChi || 0} TC</td>
                    <td className="px-4 py-3 text-center">{HB_TAGS[item.loaiHocBong] || <span className="text-slate-400 text-xs">Không đạt</span>}</td>
                    <td className="px-4 py-3 text-right font-black font-mono text-emerald-700">{formatCurrency(item.soTienNhanDuoc || item.mucHocBong)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={item.trangThai === 'CHINH_THUC' || item.trangThai === 'DA_DUYET' ? 'emerald' : item.trangThai === 'DU_KIEN' ? 'blue' : 'slate'}>
                        {item.trangThai === 'CHINH_THUC' || item.trangThai === 'DA_DUYET' ? 'Chính thức' : item.trangThai === 'DU_KIEN' ? 'Dự kiến' : item.trangThai || 'Chưa duyệt'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => onViewGrades(item)} className="px-2.5 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 mx-auto">
                        <BookOpen className="w-3.5 h-3.5" /> Bảng điểm
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyScholarshipTable;
