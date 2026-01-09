import { useState, useEffect } from 'react'
import { ArrowLeft, ShieldCheck, Lock, KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/authService'
import AuthOTPInput from '@/components/auth/AuthOTPInput'
import { IMAGES } from '@/assets/images'

const passwordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type PasswordValues = z.infer<typeof passwordSchema>

export default function ResetPassword() {
    const navigate = useNavigate()
    const location = useLocation()
    const [step, setStep] = useState<'otp' | 'password'>('otp')
    const [sessionId, setSessionId] = useState('')
    const [resetToken, setResetToken] = useState('')
    const [otp, setOtp] = useState('')
    const [phone, setPhone] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)

    useEffect(() => {
        if (location.state?.phone && location.state?.sessionId) {
            setPhone(location.state.phone)
            setSessionId(location.state.sessionId)
        } else {
            toast.error('Session expired. Please request reset again.')
            navigate('/forgot-password')
        }
    }, [location, navigate])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
    })

    const handleVerifyOTP = async (code: string) => {
        if (code.length !== 6) return

        setIsVerifying(true)
        try {
            const response = await authService.verifyResetOTP(sessionId, code)
            setResetToken(response.resetToken)
            setStep('password')
            toast.success('OTP verified successfully')
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : 'Invalid OTP')
        } finally {
            setIsVerifying(false)
        }
    }

    const onSubmitPassword = async (data: PasswordValues) => {
        try {
            await authService.completePasswordReset({
                resetToken: resetToken,
                newPassword: data.password
            })
            toast.success('Password reset successfully')
            navigate('/login')
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : 'Failed to reset password')
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-[#0B1021] text-white selection:bg-[#D4AF37] selection:text-black">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center px-6 sm:px-8 md:w-1/2 lg:px-24 max-w-2xl mx-auto relative z-10">

                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="relative group">
                            <img src={IMAGES.LOGIN2} alt="Logo" className='w-14 h-12 object-contain' />
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

                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-gray-400">
                        {step === 'otp'
                            ? `Enter the secure code sent to ${phone}`
                            : 'Create a new secure password for your account'}
                    </p>
                </div>

                {step === 'otp' ? (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <AuthOTPInput
                                length={6}
                                value={otp}
                                onChange={setOtp}
                                onComplete={handleVerifyOTP}
                                disabled={isVerifying}
                            />
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            Didn't receive code?{' '}
                            <button
                                onClick={() => {/* Resend logic */ }}
                                className="text-[#D4AF37] hover:underline"
                            >
                                Resend
                            </button>
                        </div>
                        <div className="text-center h-6">
                            {isVerifying && <span className="text-[#D4AF37] text-sm animate-pulse">Verifying OTP...</span>}
                        </div>
                    </div>
                ) : (
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmitPassword)}>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 h-12 pr-10 ${errors.password ? 'border-red-500' : ''
                                        }`}
                                    {...register('password')}
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>
                            {errors.password && (
                                <span className="text-sm text-red-500">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className={`bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 h-12 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''
                                        }`}
                                    {...register('confirmPassword')}
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold text-base shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <KeyRound className="h-4 w-4 animate-spin" /> Updating Password...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <KeyRound className="h-4 w-4" /> Reset Password
                                </span>
                            )}
                        </Button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#B4941F] transition-colors">
                        <ArrowLeft className="h-3 w-3" /> Back to Login
                    </Link>
                </div>

                <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>AES-256 Encrypted</span>
                    </div>
                    <span>•</span>
                    <span>Official Government Portal</span>
                </div>
            </div>

            {/* Right Side - Same as Login for consistency */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#0F1629]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1021]/80 via-transparent to-[#0B1021]/80 z-10"></div>

                <img
                    src={IMAGES.LOGIN}
                    alt="Secure Facility"
                    className="h-full w-full object-cover opacity-60 mix-blend-overlay"
                />

                <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-[#0B1021] to-transparent">
                    <blockquote className="mb-8 text-2xl font-medium leading-relaxed font-serif text-white/90 italic border-l-4 border-[#D4AF37] pl-6">
                        "Security is not a product, but a process. Maintaining the integrity of our systems protects the integrity of our nation."
                    </blockquote>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-bold text-lg text-[#D4AF37]">Ministry of Interior</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Cybersecurity Division</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
