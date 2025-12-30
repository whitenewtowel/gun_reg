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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const logout = () => {
    // Call API logout if needed, but primarily clear local state
    // authService.logout().catch(console.error) 

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    navigate('/login')
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const { valid, user: userData } = await authService.verifyToken()
          if (valid && userData) {
            setUser(userData)
          } else {
            // Token invalid
            logout()
          }
        } catch (error) {
          console.error('Auth initialization failed', error)
          logout()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])



  const setAuth = (userData: User, tokens: { access_token: string; refresh_token: string }) => {
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    setUser(userData)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password })
      const { access_token, refresh_token, data } = response

      // Store tokens
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      // Map backend user data to frontend User interface
      // Backend returns user_id, frontend expects id
      const userData = {
        ...data,
        id: data.user_id || data.id,
      }

      setUser(userData)

      // Redirect based on role
      switch (userData.role) {
        case 'RENEWAL_USER':
          navigate('/renewal')
          break
        case 'GUN_DEALER':
          navigate('/dealer-registration')
          break
        case 'ADMIN':
        case 'POLICE':
          navigate('/dashboard')
          break
        default:
          // If no specific role matched or empty, go to safe default
          if (!userData.role) {
            navigate('/onboarding/select-user-type')
          } else {
            navigate('/dashboard')
          }
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
