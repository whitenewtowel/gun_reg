import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logo from '@/assets/images/logo2.png'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const success = await login(data.email, data.password)
      if (!success) {
        toast.error('Invalid credentials')
      } else {
        toast.success('Logged in successfully')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred during login')
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0B1021] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-6 sm:px-8 md:w-1/2 lg:px-24 max-w-2xl mx-auto relative z-10">

        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#B4941F] mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="relative group">
              <img src={logo} alt="Logo" className='w-14 h-12 object-contain' />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">
                NFLTMS
              </h1>
              <p className="text-[0.65rem] md:text-xs text-[#D4AF37] tracking-widest uppercase mt-1">
                National Firearm Licensing
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Please enter your credentials to access the secure system.</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="officer@police.gov.gh"
              className={`bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 h-12 ${errors.email ? 'border-red-500' : ''
                }`}
              {...register('email')}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 h-12 pr-10 ${errors.password ? 'border-red-500' : ''
                  }`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-black/20 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                {...register('rememberMe')}
              />
              <label htmlFor="remember" className="text-sm text-gray-400 hover:text-white cursor-pointer select-none">
                Remember device
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-[#D4AF37] hover:text-[#B4941F] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold text-base shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 animate-spin" /> Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Secure Login
              </span>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/kyc/start" className="font-medium text-[#D4AF37] hover:underline">
              Start Application
            </Link>
          </div>
        </form>

        <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>AES-256 Encrypted</span>
          </div>
          <span>•</span>
          <span>Official Government Portal</span>
        </div>
      </div>

      {/* Right Side - Image & Quote */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#0F1629]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1021]/80 via-transparent to-[#0B1021]/80 z-10"></div>

        {/* We can use the generated hero gun image here as well for consistency, or the holster image */}
        <img
          src="/CiGN/assets/images/hero-gun.png"
          alt="Secure Facility"
          className="h-full w-full object-cover opacity-60 mix-blend-overlay"
        />

        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-[#0B1021] to-transparent">
          <blockquote className="mb-8 text-2xl font-medium leading-relaxed font-serif text-white/90 italic border-l-4 border-[#D4AF37] pl-6">
            "The citizens are inured with the correlative constitutional right to acquire arms, to keep and to bear them in anticipation of national defence."
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg text-[#D4AF37]">Dr. Ishmael Norman</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Ghanaian Security Scholar</div>
            </div>
            {/* Navigation arrows could go here if we had multiple quotes */}
          </div>
        </div>
      </div>
    </div>
  )
}
