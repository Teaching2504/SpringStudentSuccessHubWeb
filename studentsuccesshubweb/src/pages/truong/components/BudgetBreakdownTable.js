import React from 'react';
import { DollarSign, Users, TrendingUp, RefreshCw, Zap, Settings } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export const BudgetBreakdownTable = ({
  budgetBreakdown,
  loadingBreakdown,
  syncingBudget,
  onAutoSync,
  search,
  setSearch,
  selectedKhoa,
  setSelectedKhoa,
  selectedKhoaHoc,
  setSelectedKhoaHoc,
  selectedNganh,
  setSelectedNganh,
  selectedHeDaoTao,
  setSelectedHeDaoTao,
  uniqueKhoas,
  uniqueKhoaHocs,
  uniqueNganhs,
  filteredStudents,
  filteredTuitionSum,
  filtered8PercentFund,
  totalAllocatedBudget,
  onOpenQuotaModalByKhoaCode
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50/80 border border-blue-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span>Tổng SV trong phạm vi</span><Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{filteredStudents} sinh viên</p>
          <span className="text-xs text-blue-700 font-medium">Theo bộ lọc hiện tại</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
            <span>Tổng Học phí thu thực tế</span><DollarSign className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{formatCurrency(filteredTuitionSum)}</p>
          <span className="text-xs text-slate-500 font-medium">Tích lũy từ các lớp & tín chỉ</span>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span>Quỹ Học Bổng 8% Chuẩn</span><TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{formatCurrency(filtered8PercentFund)}</p>
          <span className="text-xs text-emerald-700 font-medium">Đúng quy định tối thiểu 8%</span>
        </div>

        <div className="bg-purple-50/80 border border-purple-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-purple-800 text-xs font-bold uppercase tracking-wider">
            <span>Đã Phân Bổ Các Khoa</span><DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 mt-2">{formatCurrency(totalAllocatedBudget)}</p>
          <span className="text-xs text-purple-700 font-medium">Hạn mức các khoa được cấp</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Bảng Phân bổ Ngân sách 8% theo từng Khoa - Khóa học - Ngành đào tạo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống tự động gom nhóm học phí và xác định chính xác Quỹ 8% học bổng cho từng chuyên ngành & khóa
            </p>
          </div>
          <button
            onClick={onAutoSync}
            disabled={syncingBudget}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
          >
            {syncingBudget ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Tự động Đồng bộ Ngân sách 8% vào các Khoa
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          <input
            type="text"
            placeholder="Tìm theo Khoa, Ngành..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-primary-500"
          />
          <select value={selectedKhoa} onChange={e => setSelectedKhoa(e.target.value)} className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
            <option value="ALL">-- Tất cả Khoa --</option>
            {uniqueKhoas.map(k => <option key={k.maKhoa} value={k.maKhoa}>{k.tenKhoa} ({k.maKhoa})</option>)}
          </select>
          <select value={selectedKhoaHoc} onChange={e => setSelectedKhoaHoc(e.target.value)} className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
            <option value="ALL">-- Tất cả Khóa học --</option>
            {uniqueKhoaHocs.map(kh => <option key={kh} value={kh}>{kh}</option>)}
          </select>
          <select value={selectedNganh} onChange={e => setSelectedNganh(e.target.value)} className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
            <option value="ALL">-- Tất cả Ngành học --</option>
            {uniqueNganhs.map(ng => <option key={ng} value={ng}>{ng}</option>)}
          </select>
          <select value={selectedHeDaoTao} onChange={e => setSelectedHeDaoTao(e.target.value)} className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800">
            <option value="ALL">-- Tất cả Hệ đào tạo --</option>
            <option value="CHUAN">Chuẩn (Đại trà)</option>
            <option value="DAC_BIET">Đặc biệt (CLC)</option>
          </select>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Khoa phụ trách</th>
                <th className="py-3 px-4">Khóa học</th>
                <th className="py-3 px-4">Ngành đào tạo</th>
                <th className="py-3 px-3">Chương trình</th>
                <th className="py-3 px-3 text-center">Số SV</th>
                <th className="py-3 px-4 text-right">Tổng học phí thu</th>
                <th className="py-3 px-4 text-right font-black text-emerald-800 bg-emerald-50/50">Quỹ HB 8% Chuẩn</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loadingBreakdown ? (
                <tr><td colSpan="8" className="py-8 text-center text-slate-400">Đang tính toán ngân sách 8% theo từng nhóm...</td></tr>
              ) : budgetBreakdown.length === 0 ? (
                <tr><td colSpan="8" className="py-8 text-center text-slate-400">Không tìm thấy nhóm phân bổ nào theo bộ lọc</td></tr>
              ) : (
                budgetBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{item.tenKhoa}</td>
                    <td className="py-3 px-4 font-bold text-primary-700"><span className="px-2 py-0.5 bg-primary-50 rounded-md">{item.khoaHoc}</span></td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.tenNganh}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${['DAC_BIET', 'CHAT_LUONG_CAO'].includes(item.heDaoTao) ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}>
                        {['DAC_BIET', 'CHAT_LUONG_CAO'].includes(item.heDaoTao) ? 'Đặc biệt (CLC)' : 'Chuẩn'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{item.soSinhVienTong} SV</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">{formatCurrency(item.tongHocPhiThu)}</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 bg-emerald-50/30">{formatCurrency(item.quyHocBong8PhanTram)}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => onOpenQuotaModalByKhoaCode(item.maKhoa)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] transition inline-flex items-center gap-1 cursor-pointer">
                        <Settings className="w-3 h-3" /> Phân bổ
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
export default BudgetBreakdownTable;
