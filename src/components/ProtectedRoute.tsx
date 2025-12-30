import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate home page based on role if trying to access unauthorized route
    if (user.role === 'RENEWAL_USER') return <Navigate to="/renewal" replace />
    if (user.role === 'GUN_DEALER') return <Navigate to="/dealer-registration" replace />
    if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />

    // If user has no role (new user), redirect to onboarding
    if (!user.role) return <Navigate to="/onboarding/select-user-type" replace />

    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
