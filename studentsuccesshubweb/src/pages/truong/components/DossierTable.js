import React from 'react';
import { BookOpen } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatCurrency } from '../../../utils/formatters';

const HB_BADGES = {
  XUAT_SAC: <Badge variant="emerald">Xuất sắc (100%)</Badge>,
  GIOI: <Badge variant="blue">Giỏi (70%)</Badge>,
  KHA: <Badge variant="amber">Khá (50%)</Badge>,
  KHONG_DAT: <Badge variant="slate">Không đạt</Badge>,
};

export const DossierTable = ({
  dossiers,
  search,
  setSearch,
  selectedKhoaHoc,
  setSelectedKhoaHoc,
  selectedNganh,
  setSelectedNganh,
  selectedHeDaoTao,
  setSelectedHeDaoTao,
  selectedLoaiHb,
  setSelectedLoaiHb,
  uniqueKhoaHoc,
  uniqueNganh,
  onViewGrades
}) => {
  return (
    <div className="space-y-3">
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        <input type="text" placeholder="Tìm MSSV, Họ tên, Lớp..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
        <select value={selectedKhoaHoc} onChange={e => setSelectedKhoaHoc(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
          <option value="ALL">Tất cả Khóa học</option>{uniqueKhoaHoc.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select value={selectedNganh} onChange={e => setSelectedNganh(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
          <option value="ALL">Tất cả Ngành học</option>{uniqueNganh.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={selectedHeDaoTao} onChange={e => setSelectedHeDaoTao(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
          <option value="ALL">Tất cả Chương trình</option><option value="CHUAN">Chuẩn (Đại trà)</option><option value="DAC_BIET">Đặc biệt (CLC)</option>
        </select>
        <select value={selectedLoaiHb} onChange={e => setSelectedLoaiHb(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium">
          <option value="ALL">Tất cả Loại HB</option><option value="XUAT_SAC">Xuất sắc (100%)</option><option value="GIOI">Giỏi (70%)</option><option value="KHA">Khá (50%)</option><option value="KHONG_DAT">Không đạt</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-center">Hạng</th>
                <th className="px-4 py-3">MSSV</th>
                <th className="px-4 py-3">Họ và Tên</th>
                <th className="px-4 py-3">Lớp & Khóa</th>
                <th className="px-4 py-3">Ngành & CTĐT</th>
                <th className="px-4 py-3 text-center">GPA</th>
                <th className="px-4 py-3 text-center">ĐRL</th>
                <th className="px-4 py-3">Loại HB</th>
                <th className="px-4 py-3 text-right">Tiền HB</th>
                <th className="px-4 py-3 text-center">Điểm</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {dossiers.length === 0 ? (
                <tr><td colSpan="11" className="text-center py-10 text-slate-400">Không có hồ sơ sinh viên nào theo bộ lọc</td></tr>
              ) : (
                dossiers.map(hs => {
                  const isAwarded = hs.mucHocBong && parseFloat(hs.mucHocBong) > 0;
                  return (
                    <tr key={hs.maHoSo} className={`hover:bg-slate-50/80 transition-colors ${isAwarded ? 'bg-emerald-50/20' : ''}`}>
                      <td className="px-4 py-3 text-center font-bold">{hs.thuHang != null ? <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isAwarded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{hs.thuHang}</span> : '-'}</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary-700">{hs.mssv}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{hs.hoTen}</td>
                      <td className="px-4 py-3 text-xs"><div className="font-semibold text-slate-800">{hs.maLop}</div><div className="text-slate-400">{hs.khoaHoc}</div></td>
                      <td className="px-4 py-3 text-xs"><div className="font-semibold text-slate-800">{hs.tenNganh}</div><div className="mt-0.5"><span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${['DAC_BIET', 'CHAT_LUONG_CAO'].includes(hs.heDaoTao) ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}>{['DAC_BIET', 'CHAT_LUONG_CAO'].includes(hs.heDaoTao) ? 'Đặc biệt (CLC)' : 'Chuẩn'}</span></div></td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{hs.diemTrungBinh != null ? hs.diemTrungBinh.toFixed(2) : '-'}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{hs.diemRenLuyen != null ? hs.diemRenLuyen : '-'}</td>
                      <td className="px-4 py-3">{HB_BADGES[hs.loaiHocBong] || <Badge>{hs.loaiHocBong}</Badge>}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">{formatCurrency(hs.mucHocBong)}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => onViewGrades(hs.mssv)} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer">
                          <BookOpen className="w-3.5 h-3.5" /> Xem điểm
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center"><Badge variant={hs.trangThai === 'CHINH_THUC' ? 'emerald' : hs.trangThai === 'DU_KIEN' ? 'blue' : 'slate'}>{hs.trangThai === 'CHINH_THUC' ? 'Chính thức' : hs.trangThai === 'DU_KIEN' ? 'Dự kiến' : 'Không đạt'}</Badge></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DossierTable;
