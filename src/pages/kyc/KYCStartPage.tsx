/**
 * KYC Start Page
 * First step in the KYC onboarding process
 * Collects Ghana Card number, name, and contact information
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KYCProgress from '@/components/kyc/KYCProgress';
import kycService from '@/services/kycService';

// Validation schema
const kycStartSchema = z.object({
    ghanaCardNumber: z
        .string()
        .min(1, 'Ghana Card number is required')
        .regex(/^GHA-\d{9}-\d$/, 'Invalid Ghana Card format (e.g., GHA-123456789-1)'),
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters'),
    emailOrPhone: z
        .string()
        .min(1, 'Email or phone number is required')
        .refine(
            (val) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^(0|\+233)[0-9]{9}$/;
                return emailRegex.test(val) || phoneRegex.test(val);
            },
            'Must be a valid email or Ghana phone number (e.g., 0241234567 or +233241234567)'
        ),
});

type KYCStartFormData = z.infer<typeof kycStartSchema>;

export default function KYCStartPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<KYCStartFormData>({
        resolver: zodResolver(kycStartSchema),
    });

    const onSubmit = async (data: KYCStartFormData) => {
        setIsLoading(true);

        try {
            // Start KYC process
            const session = await kycService.startKYC(data);

            toast.success('Verification code sent!', {
                description: `We've sent a 6-digit code to ${data.emailOrPhone}`,
            });

            // Navigate to OTP verification with session ID
            navigate('/kyc/verify', {
                state: {
                    sessionId: session.sessionId,
                    emailOrPhone: data.emailOrPhone,
                },
            });
        } catch (error) {
            toast.error('Failed to start verification', {
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
                        Create Your Account
                    </h1>
                    <p className="text-slate-600">
                        Let's verify your identity to get started
                    </p>
                </div>

                {/* Progress Indicator */}
                <KYCProgress currentStep={1} />

                {/* KYC Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Enter your Ghana Card details and contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Ghana Card Number */}
                            <div className="space-y-2">
                                <Label htmlFor="ghanaCardNumber">
                                    Ghana Card Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ghanaCardNumber"
                                    placeholder="GHA-123456789-1"
                                    {...register('ghanaCardNumber')}
                                    disabled={isLoading}
                                    className={errors.ghanaCardNumber ? 'border-red-500' : ''}
                                />
                                {errors.ghanaCardNumber && (
                                    <p className="text-sm text-red-500">
                                        {errors.ghanaCardNumber.message}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500">
                                    Format: GHA-XXXXXXXXX-X
                                </p>
                            </div>

                            {/* First Name */}
                            <div className="space-y-2">
                                <Label htmlFor="firstName">
                                    First Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    {...register('firstName')}
                                    disabled={isLoading}
                                    className={errors.firstName ? 'border-red-500' : ''}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <Label htmlFor="lastName">
                                    Last Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    {...register('lastName')}
                                    disabled={isLoading}
                                    className={errors.lastName ? 'border-red-500' : ''}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                                )}
                            </div>

                            {/* Email or Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="emailOrPhone">
                                    Email or Phone Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="emailOrPhone"
                                    placeholder="email@example.com or 0241234567"
                                    {...register('emailOrPhone')}
                                    disabled={isLoading}
                                    className={errors.emailOrPhone ? 'border-red-500' : ''}
                                />
                                {errors.emailOrPhone && (
                                    <p className="text-sm text-red-500">
                                        {errors.emailOrPhone.message}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500">
                                    We'll send a verification code to this email or phone number
                                </p>
                            </div>

                            {/* Privacy Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900">
                                    <strong>Privacy Notice:</strong> Your information will be verified
                                    against the National Identification Authority database. We protect
                                    your data in accordance with Ghana's Data Protection Act.
                                </p>
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
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-green-600 hover:underline font-medium">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
