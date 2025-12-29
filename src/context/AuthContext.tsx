import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password })
      const { user, tokens } = response

      // Store tokens
      localStorage.setItem('access_token', tokens.accessToken)
      localStorage.setItem('refresh_token', tokens.refreshToken)

      setUser(user)

      // Redirect based on role
      switch (user.role) {
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
          navigate('/dashboard')
      }
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    // Call API logout if needed, but primarily clear local state
    // authService.logout().catch(console.error) 

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
