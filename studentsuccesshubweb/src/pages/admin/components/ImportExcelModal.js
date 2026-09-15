import React from 'react';
import Modal from '../../../components/common/Modal';

export const ImportExcelModal = ({ isOpen, onClose, onSubmit, importFile, setImportFile, importLoading, importResult }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nhập dữ liệu Sinh viên & Điểm từ file Excel (.xlsx)">
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="text-xs text-slate-600 leading-relaxed">
          Chọn file Excel chuẩn để đồng bộ thông tin sinh viên, điểm môn học và điểm rèn luyện tự động vào hệ thống.
        </p>
        <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-2">
          <input type="file" accept=".xlsx, .xls" required onChange={e => setImportFile(e.target.files[0])} className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
          {importFile && <span className="text-xs text-emerald-600 font-semibold mt-1">Đã chọn: {importFile.name}</span>}
        </div>
        {importResult && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
            <div className="font-bold">Kết quả Import thành công:</div>
            <div>• Tổng số dòng: <strong>{importResult.totalRows}</strong></div>
            <div>• Thêm mới / Cập nhật SV: <strong>{importResult.insertedStudents}</strong> sinh viên</div>
            <div>• Điểm môn học: <strong>{importResult.insertedGrades}</strong> bản ghi</div>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Đóng</button>
          <button type="submit" disabled={importLoading} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50">
            {importLoading ? 'Đang xử lý...' : 'Bắt đầu Import'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default ImportExcelModal;
