import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Award, MessageSquare, AlertCircle, CheckCircle, Clock, Send, ExternalLink } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const SinhVienScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [myAppeals, setMyAppeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal File Appeal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHb, setSelectedHb] = useState(null);
  const [appealForm, setAppealForm] = useState({
    noiDung: '',
    tepMinhChung: ''
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rHb, rKn] = await Promise.all([
        axiosClient.get('/api/sinhvien/my-scholarship-results'),
        axiosClient.get('/api/sinhvien/kien-nghi')
      ]);

      if (rHb.data.success) setScholarships(rHb.data.data);
      if (rKn.data.success) setMyAppeals(rKn.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenAppealModal = (hb) => {
    setSelectedHb(hb);
    setAppealForm({
      noiDung: '',
      tepMinhChung: ''
    });
    setError('');
    setMsg('');
    setIsModalOpen(true);
  };

  const handleSubmitAppeal = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      const payload = {
        noiDung: appealForm.noiDung,
        tepMinhChung: appealForm.tepMinhChung,
        maDotXetHbKhoa: selectedHb.maDotXetHbKhoa,
        maHoSo: selectedHb.maHoSo
      };

      const res = await axiosClient.post('/api/sinhvien/kien-nghi', payload);
      if (res.data.success) {
        setMsg('Gửi kiến nghị thành công! Cán bộ khoa sẽ rà soát và phản hồi.');
        fetchData();
        setTimeout(() => setIsModalOpen(false), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi kiến nghị');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Kết quả Học bổng & Khiếu nại / Kiến nghị
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi kết quả xét duyệt học bổng và gửi đơn khiếu nại trong thời hạn công bố danh sách dự kiến
        </p>
      </div>

      {/* Scholarship Results Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-800">Danh sách các Đợt xét Học bổng của bạn</h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Đang tải kết quả học bổng...</div>
        ) : scholarships.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
            Hiện chưa có kết quả xét học bổng nào trong các kỳ học của bạn
          </div>
        ) : (
          scholarships.map((hs) => (
            <div key={hs.maHoSo} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{hs.tenDot}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Đơn vị: {hs.tenKhoa} | Mã hồ sơ: {hs.maHoSo}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {hs.trangThai === 'CHINH_THUC' && <Badge variant="emerald">Học bổng Chính thức</Badge>}
                  {hs.trangThai === 'DU_KIEN' && <Badge variant="blue">Danh sách Dự kiến</Badge>}
                  {hs.trangThai === 'KHONG_DAT' && <Badge variant="slate">Không đạt</Badge>}

                  <button
                    onClick={() => handleOpenAppealModal(hs)}
                    className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Gửi Kiến nghị / Khiếu nại
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">Thứ hạng xếp loại</span>
                  <span className="font-bold text-slate-800 text-base mt-0.5 block">
                    {hs.thuHang ? `Hạng #${hs.thuHang}` : 'Không xếp hạng'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">Điểm GPA kỳ</span>
                  <span className="font-bold text-slate-800 text-base mt-0.5 block">
                    {hs.diemTrungBinh != null ? hs.diemTrungBinh.toFixed(2) : '-'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">Điểm Rèn luyện</span>
                  <span className="font-bold text-slate-800 text-base mt-0.5 block">
                    {hs.diemRenLuyen != null ? hs.diemRenLuyen : '-'} đ
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">Loại Học bổng</span>
                  <span className="font-bold text-slate-800 text-base mt-0.5 block">
                    {hs.loaiHocBong || 'Không đạt'}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 block font-semibold">Số tiền Học bổng</span>
                  <span className="font-extrabold text-emerald-700 text-base mt-0.5 block">
                    {formatCurrency(hs.mucHocBong)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* My Appeals History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" /> Lịch sử Kiến nghị của bạn
        </h2>

        <div className="divide-y divide-slate-100">
          {myAppeals.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">Bạn chưa gửi kiến nghị nào</p>
          ) : (
            myAppeals.map((kn) => (
              <div key={kn.maKienNghi} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800">
                    Đợt: {kn.tenDot || kn.maDotXetHbKhoa} ({kn.ngayGui})
                  </span>
                  {kn.trangThai === 'CHO_XU_LY' && <Badge variant="amber">Đang chờ giải quyết</Badge>}
                  {kn.trangThai === 'DA_CHAP_NHAN' && <Badge variant="emerald">Khoa đã chấp nhận</Badge>}
                  {kn.trangThai === 'DA_TU_CHOI' && <Badge variant="rose">Khoa từ chối</Badge>}
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <strong>Nội dung gửi:</strong> {kn.noiDung}
                </p>
                {kn.phanHoi && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <strong>Phản hồi từ Khoa:</strong> {kn.phanHoi}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal File Appeal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Gửi Kiến nghị / Khiếu nại Học bổng`}
      >
        {msg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-medium">
            <CheckCircle className="w-4 h-4" /> {msg}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmitAppeal} className="space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p>Đợt xét: <strong>{selectedHb?.tenDot}</strong></p>
            <p>Điểm hiện tại: GPA {selectedHb?.diemTrungBinh?.toFixed(2)} | ĐRL {selectedHb?.diemRenLuyen}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nội dung kiến nghị / thắc mắc chi tiết (bắt buộc)
            </label>
            <textarea
              rows="4"
              required
              value={appealForm.noiDung}
              onChange={(e) => setAppealForm({ ...appealForm, noiDung: e.target.value })}
              placeholder="VD: Em xin khiếu nại về điểm rèn luyện chưa được cộng điểm hoạt động NCKH hoặc thắc mắc điểm GPA môn..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link file / hình ảnh minh chứng bổ sung (nếu có)
            </label>
            <input
              type="text"
              value={appealForm.tepMinhChung}
              onChange={(e) => setAppealForm({ ...appealForm, tepMinhChung: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-700/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Gửi Kiến nghị
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SinhVienScholarships;
