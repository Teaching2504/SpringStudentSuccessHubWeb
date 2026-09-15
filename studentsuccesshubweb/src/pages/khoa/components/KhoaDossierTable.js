import React from 'react';
import { BookOpen } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatCurrency } from '../../../utils/formatters';

const KhoaDossierTable = ({
  search,
  setSearch,
  selectedKhoaHoc,
  setSelectedKhoaHoc,
  uniqueKhoaHoc,
  selectedNganh,
  setSelectedNganh,
  uniqueNganh,
  selectedHeDaoTao,
  setSelectedHeDaoTao,
  selectedLoaiHb,
  setSelectedLoaiHb,
  filteredDossiers,
  totalDossiersCount,
  onViewGrades
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Bộ lọc xét duyệt</span>
          <button
            onClick={() => {
              setSearch('');
              setSelectedKhoaHoc('ALL');
              setSelectedNganh('ALL');
              setSelectedHeDaoTao('ALL');
              setSelectedLoaiHb('ALL');
            }}
            className="text-xs text-primary-600 hover:text-primary-700 font-semibold cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tìm kiếm sinh viên</label>
            <input
              type="text"
              placeholder="Nhập MSSV, Tên hoặc Lớp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Khóa học</label>
            <select
              value={selectedKhoaHoc}
              onChange={(e) => setSelectedKhoaHoc(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">-- Tất cả Khóa học --</option>
              {uniqueKhoaHoc.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ngành học</label>
            <select
              value={selectedNganh}
              onChange={(e) => setSelectedNganh(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">-- Tất cả Ngành học --</option>
              {uniqueNganh.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chương trình Đào tạo</label>
            <select
              value={selectedHeDaoTao}
              onChange={(e) => setSelectedHeDaoTao(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">-- Tất cả Chương trình --</option>
              <option value="CHUAN">Chương trình Chuẩn (Đại trà)</option>
              <option value="DAC_BIET">Chương trình Đặc biệt (CLC)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Phân loại Học bổng</label>
            <select
              value={selectedLoaiHb}
              onChange={(e) => setSelectedLoaiHb(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">-- Tất cả Phân loại --</option>
              <option value="XUAT_SAC">Xuất sắc (100% HP)</option>
              <option value="GIOI">Giỏi (70% HP)</option>
              <option value="KHA">Khá (50% HP)</option>
              <option value="KHONG_DAT">Không đạt (0đ / Hết quỹ)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Danh sách kết quả tính điểm & xếp hạng sinh viên</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hiển thị <strong>{filteredDossiers.length}</strong> / <strong>{totalDossiersCount}</strong> sinh viên theo bộ lọc</p>
          </div>
          <div className="text-xs font-medium text-slate-500">* Cấp từ thứ hạng 1 xuống dưới đến khi hết Quỹ học bổng khoa</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-center">Thứ hạng</th>
                <th className="px-4 py-3">MSSV</th>
                <th className="px-4 py-3">Họ và Tên</th>
                <th className="px-4 py-3">Lớp & Khóa</th>
                <th className="px-4 py-3">Ngành & CTĐT</th>
                <th className="px-4 py-3 text-center">GPA</th>
                <th className="px-4 py-3 text-center">ĐRL</th>
                <th className="px-4 py-3">Phân loại HB</th>
                <th className="px-4 py-3 text-right">Tiền HB nhận</th>
                <th className="px-4 py-3 text-center">Bảng điểm</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredDossiers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-12 text-slate-400">
                    <p className="text-base font-semibold">Không tìm thấy sinh viên phù hợp</p>
                    <p className="text-xs mt-1">
                      {totalDossiersCount === 0
                        ? 'Bấm nút "Chạy Dynamic Rule Engine" ở trên để hệ thống tự động lọc và xếp thứ tự'
                        : 'Thử điều chỉnh lại bộ lọc Khóa, Ngành hoặc Chương trình đào tạo'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDossiers.map((hs) => {
                  const isAwarded = hs.mucHocBong && parseFloat(hs.mucHocBong) > 0;
                  return (
                    <tr key={hs.maHoSo} className={`hover:bg-slate-50/80 transition-colors ${isAwarded ? 'bg-emerald-50/30' : ''}`}>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {hs.thuHang != null ? (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isAwarded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                            {hs.thuHang}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-primary-700">{hs.mssv}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{hs.hoTen}</td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-semibold text-slate-800">{hs.maLop || '-'}</div>
                        <div className="text-slate-500">{hs.khoaHoc || '-'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-semibold text-slate-800">{hs.tenNganh || '-'}</div>
                        <div className="mt-0.5">
                          {['DAC_BIET', 'CHAT_LUONG_CAO'].includes(hs.heDaoTao) ? (
                            <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded text-[10px]">Đặc biệt (CLC)</span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[10px]">Chuẩn (Đại trà)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{hs.diemTrungBinh != null ? hs.diemTrungBinh.toFixed(2) : '-'}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{hs.diemRenLuyen != null ? hs.diemRenLuyen : '-'}</td>
                      <td className="px-4 py-3"><Badge status={hs.loaiHocBong} /></td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">{formatCurrency(hs.mucHocBong)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onViewGrades(hs.mssv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> Xem điểm
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center"><Badge status={hs.trangThai} /></td>
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

export default KhoaDossierTable;
