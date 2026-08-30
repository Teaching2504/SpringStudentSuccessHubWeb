import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Pages
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/auth/ProfilePage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import StudentManagement from './pages/admin/StudentManagement';

// Trường
import TruongDashboard from './pages/truong/TruongDashboard';
import CampaignManagement from './pages/truong/CampaignManagement';
import CampaignReviewDetail from './pages/truong/CampaignReviewDetail';
import TruongStats from './pages/truong/TruongStats';

// Khoa
import KhoaDashboard from './pages/khoa/KhoaDashboard';
import KhoaStudentList from './pages/khoa/KhoaStudentList';
import EvidenceReview from './pages/khoa/EvidenceReview';
import KhoaCampaignDetail from './pages/khoa/KhoaCampaignDetail';
import KhoaAppeals from './pages/khoa/KhoaAppeals';

// Sinh viên
import SinhVienDashboard from './pages/sinhvien/SinhVienDashboard';
import SinhVienGrades from './pages/sinhvien/SinhVienGrades';
import SinhVienCurriculum from './pages/sinhvien/SinhVienCurriculum';
import SinhVienScholarships from './pages/sinhvien/SinhVienScholarships';
import SubmitEvidence from './pages/sinhvien/SubmitEvidence';

const MainLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.vaiTro)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.vaiTro) {
    case 'ROLE_ADMIN':
      return <Navigate to="/admin" replace />;
    case 'ROLE_CAN_BO_TRUONG':
      return <Navigate to="/truong" replace />;
    case 'ROLE_CAN_BO_KHOA':
      return <Navigate to="/khoa" replace />;
    case 'ROLE_SINH_VIEN':
      return <Navigate to="/sinh-vien" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/admin/students" element={<StudentManagement />} />
            </Route>

            {/* Cấp Trường Routes */}
            <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CAN_BO_TRUONG']} />}>
              <Route path="/truong" element={<TruongDashboard />} />
              <Route path="/truong/campaigns" element={<CampaignManagement />} />
              <Route path="/truong/campaigns/:id" element={<CampaignReviewDetail />} />
              <Route path="/truong/stats" element={<TruongStats />} />
            </Route>

            {/* Cấp Khoa Routes */}
            <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_CAN_BO_KHOA']} />}>
              <Route path="/khoa" element={<KhoaDashboard />} />
              <Route path="/khoa/students" element={<KhoaStudentList />} />
              <Route path="/khoa/evidence" element={<EvidenceReview />} />
              <Route path="/khoa/campaigns/:id" element={<KhoaCampaignDetail />} />
              <Route path="/khoa/appeals" element={<KhoaAppeals />} />
            </Route>

            {/* Sinh Viên Routes */}
            <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SINH_VIEN']} />}>
              <Route path="/sinh-vien" element={<SinhVienDashboard />} />
              <Route path="/sinh-vien/grades" element={<SinhVienGrades />} />
              <Route path="/sinh-vien/curriculum" element={<SinhVienCurriculum />} />
              <Route path="/sinh-vien/scholarships" element={<SinhVienScholarships />} />
              <Route path="/sinh-vien/evidence" element={<SubmitEvidence />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
