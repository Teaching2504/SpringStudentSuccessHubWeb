import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Clock } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ScholarshipResultCard from './components/ScholarshipResultCard';
import StudentAppealModal from './components/StudentAppealModal';

const SinhVienScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [myAppeals, setMyAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHb, setSelectedHb] = useState(null);
  const [appealForm, setAppealForm] = useState({ noiDung: '', tepMinhChung: '' });
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAppealModal = (hb) => {
    setSelectedHb(hb);
    setAppealForm({ noiDung: '', tepMinhChung: '' });
    setError('');
    setMsg('');
    setIsModalOpen(true);
  };

  const handleSubmitAppeal = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const res = await axiosClient.post('/api/sinhvien/kien-nghi', {
        noiDung: appealForm.noiDung,
        tepMinhChung: appealForm.tepMinhChung,
        maDotXetHbKhoa: selectedHb.maDotXetHbKhoa,
        maHoSo: selectedHb.maHoSo
      });
      if (res.data.success) {
        setMsg('Gửi kiến nghị thành công! Cán bộ khoa sẽ rà soát và phản hồi.');
        fetchData();
        setTimeout(() => setIsModalOpen(false), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi kiến nghị');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Kết quả Học bổng & Khiếu nại / Kiến nghị</h1>
        <p className="text-sm text-slate-500 mt-1">Theo dõi kết quả xét duyệt học bổng và gửi đơn khiếu nại trong thời hạn công bố danh sách dự kiến</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-800">Danh sách các Đợt xét Học bổng của bạn</h2>
        <ScholarshipResultCard scholarships={scholarships} loading={loading} onOpenAppealModal={handleOpenAppealModal} />
      </div>

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
                  <span className="font-semibold text-xs text-slate-800">Đợt: {kn.tenDot || kn.maDotXetHbKhoa} ({kn.ngayGui})</span>
                  <Badge status={kn.trangThai} />
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl"><strong>Nội dung gửi:</strong> {kn.noiDung}</p>
                {kn.phanHoi && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200"><strong>Phản hồi từ Khoa:</strong> {kn.phanHoi}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <StudentAppealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedHb={selectedHb}
        appealForm={appealForm}
        setAppealForm={setAppealForm}
        msg={msg}
        error={error}
        onSubmit={handleSubmitAppeal}
      />
    </div>
  );
};

export default SinhVienScholarships;
