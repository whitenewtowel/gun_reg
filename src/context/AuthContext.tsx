import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  setAuth: (user: User, tokens: { access_token: string; refresh_token: string }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to map backend user to frontend User interface
const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: backendUser.id || backendUser.user_id,
    email: backendUser.email,
    firstName: backendUser.full_name?.split(' ')[0] || '', // Basic extraction if full_name exists
    lastName: backendUser.full_name?.split(' ').slice(1).join(' ') || '',
    phone: backendUser.phone,
    role: (backendUser.roles && backendUser.roles.length > 0) ? backendUser.roles[0] : (backendUser.role || 'INDIVIDUAL'),
    status: backendUser.status || 'ACTIVE',
    ghanaCardNumber: backendUser.ghana_card_number,
    createdAt: backendUser.created_at || new Date().toISOString(),
    updatedAt: backendUser.updated_at || new Date().toISOString(),
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize user from localStorage to prevent flash of login/loading
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (e) {
      return null
    }
  })

  // Loading is false if we have a user, otherwise true until verification
  const [loading, setLoading] = useState(!localStorage.getItem('user'))
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('onboarding_context')
    setUser(null)
    navigate('/login')
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      // If we have a user in local storage, we're already "loaded"
      // But we verify in background to ensure token is valid and data is fresh

      if (token) {
        try {
          const { valid, user: backendData } = await authService.verifyToken()
          if (valid && backendData) {
            const mappedUser = mapBackendUserToFrontend(backendData);
            setUser(mappedUser)
            localStorage.setItem('user', JSON.stringify(mappedUser))
          } else {
            // If token explicitly invalid but we have a token, maybe logout?
            // But apiClient might handle refresh. 
            // If verify check fails logic-wise (valid: false), we should probably trust it?
            // For now, if we have a local user, we keep it to support offline/flaky network
            // unless unauthorized. 
          }
        } catch (error) {
          console.log('Token verification failed, defaulting to local persistence')
        }
      } else {
        // No token, ensure user is null
        setUser(null)
        localStorage.removeItem('user')
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const setAuth = (userData: User, tokens: { access_token: string; refresh_token: string }) => {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Clear any existing session data before new login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('onboarding_context');

      const response = await authService.login({ email, password })
      const { access_token, refresh_token, data } = response

      // Map backend user data to frontend User interface
      const userData = mapBackendUserToFrontend(data);

      setAuth(userData, { access_token, refresh_token })

      // Store onboarding context for routing decisions
      if (data.onboarding_context) {
        localStorage.setItem('onboarding_context', JSON.stringify(data.onboarding_context))
      }

      // Route based on onboarding_context or role
      if (data.onboarding_context?.type === 'NONE' || !userData.role) {
        navigate('/kyc/biometric')
      } else {
        navigate('/dashboard')
      }

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setAuth, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
