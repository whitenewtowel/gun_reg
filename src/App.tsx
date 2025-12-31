import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

import LicenseManagement from './pages/LicenseManagement'
import Alerts from './pages/Alerts'
import ProfilePage from './pages/ProfilePage'
import NewApplicationWizard from './pages/applications/NewApplicationWizard';
import Renewal from './pages/Renewal'
import DealerRegistration from './pages/DealerRegistration'
import KYCStartPage from './pages/kyc/KYCStartPage'
import KYCVerifyPage from './pages/kyc/KYCVerifyPage'
import KYCCompletePage from './pages/kyc/KYCCompletePage'
import SelectUserTypePage from './pages/onboarding/SelectUserTypePage'
import CompleteApplications from './pages/individuals/CompleteApplications'
import ApplicationsPage from './pages/individuals/ApplicationsPage'
import ApplicationDetailPage from './pages/individuals/ApplicationDetailPage'
import MyFirearmsPage from './pages/individuals/MyFirearmsPage'
import PaymentsPage from './pages/individuals/PaymentsPage'
import HistoryPage from './pages/individuals/HistoryPage'
import SettingsPage from './pages/individuals/SettingsPage'
import DashboardRedirectHandler from './components/auth/DashboardRedirectHandler'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import { Toaster } from 'sonner'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/signup" element={<SignUp />} />

          {/* KYC Routes */}
          <Route path="/kyc/start" element={<KYCStartPage />} />
          <Route path="/kyc/verify" element={<KYCVerifyPage />} />
          <Route path="/kyc/complete" element={<KYCCompletePage />} />
          <Route path="/auth/password-setup" element={<KYCCompletePage />} />

          {/* Main App Routes - Protected by Auth only (Roles handled internally) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding/select-user-type" element={<SelectUserTypePage />} />
            <Route path="/onboarding/complete-account" element={<CompleteApplications />} />
            <Route path="/complete-applications" element={<CompleteApplications />} />

            {/* Dashboard & Management */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardRedirectHandler />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/applications/:id" element={<ApplicationDetailPage />} />
              <Route path="/firearms" element={<MyFirearmsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/licenses" element={<LicenseManagement />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/applications/new" element={<NewApplicationWizard />} />
            </Route>

            {/* Specific Functional Routes */}
            <Route path="/renewal" element={<Renewal />} />

            <Route path="/dealer-registration" element={<DealerRegistration />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  )
}

export default App
