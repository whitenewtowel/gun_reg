/**
 * KYC Complete Page
 * Final step: Password setup and account creation
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Shield, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KYCProgress from '@/components/kyc/KYCProgress';
import { useAuthStore } from '@/stores/authStore';
import authService from '@/services/authService';

interface LocationState {
    sessionId: string;
    emailOrPhone: string;
}

// Password validation schema
const passwordSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function KYCCompletePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const setAuth = useAuthStore((state) => state.setAuth);

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

        try {
            // In production, this would complete the KYC process with password setup
            // For now, we'll simulate a successful account creation

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('Account created successfully!', {
                description: 'You can now login with your credentials',
            });

            // Redirect to login
            navigate('/login', {
                state: {
                    email: state.emailOrPhone,
                    message: 'Account created! Please login to continue.',
                },
            });
        } catch (error) {
            toast.error('Failed to create account', {
                description: error instanceof Error ? error.message : 'Please try again',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Shield className="h-4 w-4" />
                        Secure KYC Verification
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Create Your Password
                    </h1>
                    <p className="text-slate-600">
                        Choose a strong password to secure your account
                    </p>
                </div>

                {/* Progress Indicator */}
                <KYCProgress currentStep={3} />

                {/* Password Setup Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Set Your Password</CardTitle>
                        <CardDescription>
                            Your password must meet the security requirements below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        {...register('password')}
                                        disabled={isLoading}
                                        className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Password strength:</span>
                                        <span
                                            className={
                                                strengthScore <= 2
                                                    ? 'text-red-600 font-medium'
                                                    : strengthScore <= 4
                                                        ? 'text-yellow-600 font-medium'
                                                        : 'text-green-600 font-medium'
                                            }
                                        >
                                            {strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Medium' : 'Strong'}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${strengthScore <= 2
                                                    ? 'bg-red-500'
                                                    : strengthScore <= 4
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                }`}
                                            style={{ width: `${(strengthScore / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password Requirements */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium text-slate-700 mb-2">
                                    Password must contain:
                                </p>
                                {[
                                    { label: 'At least 8 characters', met: passwordStrength.hasMinLength },
                                    { label: 'One uppercase letter (A-Z)', met: passwordStrength.hasUppercase },
                                    { label: 'One lowercase letter (a-z)', met: passwordStrength.hasLowercase },
                                    { label: 'One number (0-9)', met: passwordStrength.hasNumber },
                                    { label: 'One special character (!@#$%)', met: passwordStrength.hasSpecial },
                                ].map((req, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2
                                            className={`h-4 w-4 ${req.met ? 'text-green-600' : 'text-slate-300'
                                                }`}
                                        />
                                        <span className={req.met ? 'text-slate-700' : 'text-slate-400'}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Re-enter your password"
                                        {...register('confirmPassword')}
                                        disabled={isLoading}
                                        className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        By creating an account, you agree to our{' '}
                        <a href="/terms" className="text-green-600 hover:underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-green-600 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
