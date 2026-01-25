/**
 * KYC Complete Page - Redesigned
 * Final step: Password setup and account creation
 * Tactical Dark Theme
 */

import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
    ShieldCheckIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import authService from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

interface LocationState {
    registration_session_id?: string;
    emailOrPhone?: string;
    setupToken?: string;
    ghana_card_number?: string;
}

// Password validation schema
const passwordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain number')
        .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function KYCCompletePage() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const state = location.state as LocationState;

    // Get token from URL query params or state
    const setupToken = searchParams.get('token') || state?.setupToken;

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const password = watch('password', '');

    // Password strength indicators
    const passwordStrength = {
        hasMinLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

    const onSubmit = async (data: PasswordFormData) => {
        setIsLoading(true);

        if (!setupToken) {
            toast.error('Missing setup token', {
                description: 'Please click the link sent to your email/phone',
            });
            return;
        }

        try {
            const response = await authService.setupPassword({
                token: setupToken,
                password: data.password
            });

            if (response.success) {
                toast.success('Account created successfully!', {
                    description: 'Logging you in...',
                });

                // Auto-login with the new credential
                try {
                    // We need the email to login. Check location state.
                    if (!state?.emailOrPhone) {
                        throw new Error("Email not found for auto-login. Please login manually.");
                    }

                    const loginResponse = await authService.login({
                        email: state.emailOrPhone, // emailOrPhone maps to email in login
                        password: data.password
                    });

                    if (loginResponse && loginResponse.access_token) {
                        setAuth(loginResponse.data, {
                            access_token: loginResponse.access_token,
                            refresh_token: loginResponse.refresh_token
                        });

                        // Redirect based on role or flow
                        navigate('/kyc/biometric'); // Or '/kyc/biometric' if that's truly next
                    }
                } catch (loginError) {
                    console.error("Auto-login failed:", loginError);
                    toast.error('Login failed', {
                        description: 'Account created but auto-login failed. Please login manually.'
                    });
                    navigate('/auth/login');
                }
            }


        } catch (error) {
            toast.error('Failed to create account', {
                description: error instanceof Error ? error.message : 'Please try again',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1021] text-white font-technical selection:bg-[#D4AF37] selection:text-black flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.05),transparent_70%)]"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#D4AF37]/5 to-transparent"></div>
            </div>

            {/* Header */}
            <header className="border-b border-white/5 bg-[#0B1021]/95 backdrop-blur-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-black rounded border border-[#D4AF37]/30 flex items-center justify-center">
                            <ShieldCheckIcon className="h-6 w-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-white leading-none">NFLTMS</h1>
                            <p className="text-[0.6rem] text-[#D4AF37] tracking-widest uppercase">Secure Verification</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl relative z-10">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex justify-between relative">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${s <= 3
                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                                    : 'bg-[#1A2035] border-white/10 text-gray-500'
                                    }`}>
                                    {s}
                                </div>
                                <span className="mt-2 text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                                    {s === 1 ? 'Identity' : s === 2 ? 'Verify' : 'Secure'}
                                </span>
                            </div>
                        ))}
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1A2035] -z-0">
                            <div className="h-full bg-[#D4AF37] w-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/5 p-1 relative overflow-hidden clip-chamfer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0B1021] p-6 md:p-8 clip-chamfer border border-white/5 space-y-6">
                        <div>
                            <h2 className="text-2xl font-stencil text-white mb-2 uppercase">Create Password</h2>
                            <p className="text-gray-400 text-sm">Secure your account with a strong password</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className="w-full bg-[#1A2035] border-none text-white p-4 pr-12 focus:ring-1 focus:ring-[#D4AF37]"
                                        placeholder="Min. 8 characters"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                            {/* Strength Meter */}
                            {password && (
                                <div className="space-y-2 bg-black/20 p-3 rounded">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-400">Password strength</span>
                                        <span className={strengthScore <= 2 ? 'text-red-500' : strengthScore <= 4 ? 'text-yellow-500' : 'text-green-500'}>
                                            {strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Medium' : 'Strong'}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${strengthScore <= 2 ? 'bg-red-500' : strengthScore <= 4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            style={{ width: `${(strengthScore / 5) * 100}%` }}
                                        ></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {[
                                            { label: '8+ chars', met: passwordStrength.hasMinLength },
                                            { label: 'Uppercase', met: passwordStrength.hasUppercase },
                                            { label: 'Lowercase', met: passwordStrength.hasLowercase },
                                            { label: 'Number', met: passwordStrength.hasNumber },
                                            { label: 'Special char', met: passwordStrength.hasSpecial },
                                        ].map((req, i) => (
                                            <div key={i} className={`flex items-center gap-1.5 text-[10px] ${req.met ? 'text-green-500' : 'text-gray-600'}`}>
                                                <CheckCircleIcon className="h-3 w-3" />
                                                {req.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...register('confirmPassword')}
                                        className="w-full bg-[#1A2035] border-none text-white p-4 pr-12 focus:ring-1 focus:ring-[#D4AF37]"
                                        placeholder="Re-enter password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold h-12 uppercase tracking-widest clip-chamfer rounded-none"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Complete Setup'}
                                {!isLoading && <LockClosedIcon className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
