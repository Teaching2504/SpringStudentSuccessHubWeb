import React from 'react';
import { AlertCircle, CheckCircle, History } from 'lucide-react';
import Modal from '../../../components/common/Modal';

export const RuleConfigModal = ({ isOpen, onClose, selectedCamp, ruleForm, setRuleForm, ruleHistory, onSubmit, error, msg }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cấu hình Dynamic Rule Engine: ${selectedCamp?.tenDot}`}>
      <div className="space-y-6">
        {msg && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-medium"><CheckCircle className="w-4 h-4" /> {msg}</div>}
        {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium"><AlertCircle className="w-4 h-4" /> {error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Điểm TB Học tập (GPA) tối thiểu</label><input type="number" step="0.01" required value={ruleForm.diemTbDuoiThieu} onChange={e => setRuleForm({ ...ruleForm, diemTbDuoiThieu: parseFloat(e.target.value) })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold" /></div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Điểm Rèn luyện (ĐRL) tối thiểu</label><input type="number" step="0.5" required value={ruleForm.diemRlToiThieu} onChange={e => setRuleForm({ ...ruleForm, diemRlToiThieu: parseFloat(e.target.value) })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Số Tín chỉ tích lũy tối thiểu trong kỳ</label><input type="number" required value={ruleForm.soTinChiToiThieu} onChange={e => setRuleForm({ ...ruleForm, soTinChiToiThieu: parseInt(e.target.value) })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold" /></div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Ràng buộc Nợ môn / Học phần rớt</label><select value={ruleForm.khongNoMon ? 'true' : 'false'} onChange={e => setRuleForm({ ...ruleForm, khongNoMon: e.target.value === 'true' })} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"><option value="true">Bắt buộc: Không được rớt môn nào</option><option value="false">Cho phép có môn rớt</option></select></div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between"><h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Định mức Học bổng (% Học phí bình quân ngành)</h4><span className="text-[11px] text-blue-600 font-medium">Quỹ HB ≥ 8% tổng thu học phí</span></div>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="block text-[11px] font-semibold text-emerald-800 mb-1">Xuất sắc (100% HP)</label><input type="number" value={ruleForm.mucHocBongXuatSac} onChange={e => { const val = parseFloat(e.target.value) || 0; setRuleForm({ ...ruleForm, mucHocBongXuatSac: val, mucHocBongGioi: Math.round(val * 0.70), mucHocBongKha: Math.round(val * 0.50) }); }} className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-700" /></div>
              <div><label className="block text-[11px] font-semibold text-blue-800 mb-1">Giỏi (70% HP)</label><input type="number" value={ruleForm.mucHocBongGioi} onChange={e => setRuleForm({ ...ruleForm, mucHocBongGioi: parseFloat(e.target.value) })} className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-700" /></div>
              <div><label className="block text-[11px] font-semibold text-amber-800 mb-1">Khá (50% HP)</label><input type="number" value={ruleForm.mucHocBongKha} onChange={e => setRuleForm({ ...ruleForm, mucHocBongKha: parseFloat(e.target.value) })} className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-amber-700" /></div>
            </div>
            <p className="text-[11px] text-slate-500 italic">* Tự động tính 100% - 70% - 50% học phí bình quân. Hệ thống xét từ trên xuống theo thứ hạng (GPA → ĐRL → Tín chỉ) cho đến khi hết Quỹ ngân sách của Khoa.</p>
          </div>
          <div><label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú lý do cập nhật phiên bản mới</label><input type="text" value={ruleForm.ghiChu} onChange={e => setRuleForm({ ...ruleForm, ghiChu: e.target.value })} placeholder="VD: Điều chỉnh định mức khen thưởng HK1 2025" className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm" /></div>
          <div className="flex justify-end gap-3 pt-2"><button type="submit" className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-700/20 transition cursor-pointer">+ Lưu thành Phiên bản mới (Versioning)</button></div>
        </form>
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5"><History className="w-4 h-4 text-purple-600" /> Lịch sử các phiên bản quy tắc đã ban hành:</h4>
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
            {ruleHistory.map((r, idx) => (
              <div key={r.maQuyTac} className="py-2 flex items-center justify-between">
                <div><span className="font-bold text-purple-700">Phiên bản {r.phienBan}</span>{idx === 0 && <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Đang áp dụng</span>}<p className="text-slate-500 mt-0.5">{r.ghiChu || 'Không có ghi chú'}</p></div>
                <div className="text-right text-slate-600 font-mono">GPA &ge; {r.diemTbDuoiThieu} | ĐRL &ge; {r.diemRlToiThieu} | TC &ge; {r.soTinChiToiThieu}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default RuleConfigModal;
