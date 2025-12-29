import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/authService'

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ForgotPasswordValues) => {
        try {
            await authService.requestPasswordReset(data.email)
            toast.success('Reset OTP sent to your email')
            // Navigate to Reset Password page with email state
            navigate('/reset-password', { state: { email: data.email } })
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : 'Failed to send reset link')
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-[#0B1021] text-white selection:bg-[#D4AF37] selection:text-black">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center px-6 sm:px-8 md:w-1/2 lg:px-24 max-w-2xl mx-auto relative z-10">

                <div className="mb-10">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#B4941F] mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Login
                    </Link>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-12 w-12 bg-black/50 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="h-7 w-7 text-[#D4AF37]" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-gray-400">Enter your email address to receive a secure password reset OTP.</p>
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

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold text-base shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Mail className="h-4 w-4 animate-spin" /> Sending OTP...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Send Reset OTP
                            </span>
                        )}
                    </Button>
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

            {/* Right Side - Same as Login for consistency */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#0F1629]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1021]/80 via-transparent to-[#0B1021]/80 z-10"></div>

                <img
                    src="/CiGN/assets/images/hero-gun.png"
                    alt="Secure Facility"
                    className="h-full w-full object-cover opacity-60 mix-blend-overlay"
                />

                <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-[#0B1021] to-transparent">
                    <blockquote className="mb-8 text-2xl font-medium leading-relaxed font-serif text-white/90 italic border-l-4 border-[#D4AF37] pl-6">
                        "Public safety is the first duty of the government; the right to bear arms is a privilege regulated for the common good."
                    </blockquote>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-bold text-lg text-[#D4AF37]">Ministry of Interior</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">Public Safety Directive</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
