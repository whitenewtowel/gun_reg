import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '@/types'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if we have tokens in localStorage
    const token = localStorage.getItem('access_token')
    if (token) {
      // Give AuthContext time to initialize
      const timer = setTimeout(() => {
        setIsChecking(false)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setIsChecking(false)
    }
  }, [])

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0B1021] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#D4AF37] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    )
  }

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
