import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Dashboard from './pages/Dashboard'
import LicenseManagement from './pages/LicenseManagement'
import Alerts from './pages/Alerts'
import ProfilePage from './pages/ProfilePage'
import NewApplicationWizard from './pages/applications/NewApplicationWizard';
import Renewal from './pages/Renewal'
import DealerRegistration from './pages/DealerRegistration'
import KYCStartPage from './pages/kyc/KYCStartPage'
import KYCVerifyPage from './pages/kyc/KYCVerifyPage'
import KYCCompletePage from './pages/kyc/KYCCompletePage'
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

          {/* Protected Routes */}

          {/* User & Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'POLICE', 'INDIVIDUAL']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/licenses" element={<LicenseManagement />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/applications/new" element={<NewApplicationWizard />} />
            </Route>
          </Route>

          {/* Renewal User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['RENEWAL_USER']} />}>
            <Route path="/renewal" element={<Renewal />} />
          </Route>

          {/* Gun Dealer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['GUN_DEALER']} />}>
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
