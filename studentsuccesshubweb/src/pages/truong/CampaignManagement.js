import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus } from 'lucide-react';
import { sortSemesters } from '../../utils/semesterSort';
import CampaignTable from './components/CampaignTable';
import CampaignModal from './components/CampaignModal';
import RuleConfigModal from './components/RuleConfigModal';

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [hocKys, setHocKys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);
  const [campForm, setCampForm] = useState({ maDot: '', tenDot: '', ngayBatDau: '', ngayKetThuc: '', maHocKy: '' });
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedCampForRules, setSelectedCampForRules] = useState(null);
  const [ruleHistory, setRuleHistory] = useState([]);
  const [ruleForm, setRuleForm] = useState({
    diemTbDuoiThieu: 2.5, diemRlToiThieu: 65, soTinChiToiThieu: 14, khongNoMon: true,
    mucHocBongXuatSac: 10000000, mucHocBongGioi: 7000000, mucHocBongKha: 5000000, ghiChu: ''
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/truong/campaigns');
      if (res.data.success) setCampaigns(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHocKys = async () => {
    try {
      const res = await axiosClient.get('/api/common/danh-muc/hoc-ky');
      if (res.data.success) setHocKys(sortSemesters(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCampaigns(); fetchHocKys(); }, []);

  const handleOpenCampModal = (c = null) => {
    setError('');
    setEditingCamp(c);
    const today = new Date().toISOString().split('T')[0];
    setCampForm(c ? { maDot: c.maDot, tenDot: c.tenDot, ngayBatDau: c.ngayBatDau || '', ngayKetThuc: c.ngayKetThuc || '', maHocKy: c.maHocKy || hocKys[0]?.maHocKy || '' }
      : { maDot: 'HB_' + Date.now().toString().slice(-6), tenDot: 'Học bổng Khuyến khích Học tập Kỳ Mới', ngayBatDau: today, ngayKetThuc: today, maHocKy: hocKys[0]?.maHocKy || '' });
    setIsCampModalOpen(true);
  };

  const handleSaveCamp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      editingCamp ? await axiosClient.put(`/api/truong/campaigns/${editingCamp.maDot}`, campForm) : await axiosClient.post('/api/truong/campaigns', campForm);
      setIsCampModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteCamp = async (maDot) => {
    if (window.confirm('Bạn có chắc muốn xóa đợt xét này?')) {
      try {
        await axiosClient.delete(`/api/truong/campaigns/${maDot}`);
        fetchCampaigns();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  const handleOpenRuleModal = async (c) => {
    setSelectedCampForRules(c);
    setError('');
    setMsg('');
    try {
      const res = await axiosClient.get(`/api/truong/campaigns/${c.maDot}/rules`);
      if (res.data.success) {
        setRuleHistory(res.data.data);
        const latest = res.data.data[0];
        if (latest) {
          setRuleForm({
            diemTbDuoiThieu: latest.diemTbDuoiThieu || 2.5, diemRlToiThieu: latest.diemRlToiThieu || 65,
            soTinChiToiThieu: latest.soTinChiToiThieu || 14, khongNoMon: latest.khongNoMon ?? true,
            mucHocBongXuatSac: latest.mucHocBongXuatSac || 10000000, mucHocBongGioi: latest.mucHocBongGioi || 7000000,
            mucHocBongKha: latest.mucHocBongKha || 5000000, ghiChu: ''
          });
        }
      }
      setIsRuleModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const res = await axiosClient.post(`/api/truong/campaigns/${selectedCampForRules.maDot}/rules`, ruleForm);
      if (res.data.success) {
        setMsg('Đã tạo phiên bản quy tắc mới thành công!');
        const rRes = await axiosClient.get(`/api/truong/campaigns/${selectedCampForRules.maDot}/rules`);
        if (rRes.data.success) setRuleHistory(rRes.data.data);
        fetchCampaigns();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu quy tắc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Đợt xét & Cấu hình Dynamic Rule Engine</h1>
          <p className="text-sm text-slate-500 mt-1">Khởi tạo chiến dịch học bổng, thiết lập điều kiện ràng buộc động và quản lý phiên bản quy tắc</p>
        </div>
        <button onClick={() => handleOpenCampModal()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-700/20 transition cursor-pointer">
          <Plus className="w-4 h-4" /> Khởi tạo Đợt xét Học bổng mới
        </button>
      </div>

      <CampaignTable
        campaigns={campaigns}
        loading={loading}
        onOpenRules={handleOpenRuleModal}
        onEdit={handleOpenCampModal}
        onDelete={handleDeleteCamp}
      />

      <CampaignModal
        isOpen={isCampModalOpen}
        onClose={() => setIsCampModalOpen(false)}
        editingCamp={editingCamp}
        campForm={campForm}
        setCampForm={setCampForm}
        onSubmit={handleSaveCamp}
        error={error}
        hocKys={hocKys}
      />

      <RuleConfigModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        selectedCamp={selectedCampForRules}
        ruleForm={ruleForm}
        setRuleForm={setRuleForm}
        ruleHistory={ruleHistory}
        onSubmit={handleSaveRule}
        error={error}
        msg={msg}
      />
    </div>
  );
};
export default CampaignManagement;
