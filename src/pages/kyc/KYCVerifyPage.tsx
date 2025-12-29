/**
 * KYC Verify Page
 * OTP verification step in the KYC onboarding process
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KYCProgress from '@/components/kyc/KYCProgress';
import OTPInput from '@/components/kyc/OTPInput';
import kycService from '@/services/kycService';

interface LocationState {
    sessionId: string;
    emailOrPhone: string;
}

export default function KYCVerifyPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);

    // Redirect if no session ID
    useEffect(() => {
        if (!state?.sessionId) {
            toast.error('Invalid session', {
                description: 'Please start the verification process again',
            });
            navigate('/kyc/start');
        }
    }, [state, navigate]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    // Auto-submit when OTP is complete
    useEffect(() => {
        if (otp.length === 6) {
            handleVerify();
        }
    }, [otp]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error('Invalid OTP', {
                description: 'Please enter the 6-digit code',
            });
            return;
        }

        setIsLoading(true);

        try {
            // For now, just navigate to password setup
            // In production, this would verify the OTP with the backend
            await kycService.verifyOTP({
                sessionId: state.sessionId,
                otp,
                password: '', // Will be set in next step
            });

            toast.success('Code verified!', {
                description: 'Now set up your password',
            });

            navigate('/kyc/complete', {
                state: {
                    sessionId: state.sessionId,
                    emailOrPhone: state.emailOrPhone,
                },
            });
        } catch (error) {
            toast.error('Verification failed', {
                description: error instanceof Error ? error.message : 'Invalid code. Please try again.',
            });
            setOtp(''); // Clear OTP on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);

        try {
            await kycService.resendOTP(state.sessionId);

            toast.success('Code resent!', {
                description: `A new code has been sent to ${state.emailOrPhone}`,
            });

            setOtp('');
            setCountdown(60);
            setCanResend(false);
        } catch (error) {
            toast.error('Failed to resend code', {
                description: error instanceof Error ? error.message : 'Please try again',
            });
        } finally {
            setIsResending(false);
        }
    };

    if (!state?.sessionId) {
        return null;
    }

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
                        Verify Your Contact
                    </h1>
                    <p className="text-slate-600">
                        Enter the 6-digit code sent to{' '}
                        <span className="font-medium text-slate-900">{state.emailOrPhone}</span>
                    </p>
                </div>

                {/* Progress Indicator */}
                <KYCProgress currentStep={2} />

                {/* OTP Verification Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Enter Verification Code</CardTitle>
                        <CardDescription>
                            Check your {state.emailOrPhone.includes('@') ? 'email' : 'phone'} for the code
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* OTP Input */}
                        <div className="py-4">
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                disabled={isLoading}
                                error={false}
                            />
                        </div>

                        {/* Resend Code */}
                        <div className="text-center">
                            {canResend ? (
                                <Button
                                    variant="ghost"
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-green-600 hover:text-green-700"
                                >
                                    {isResending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Resend Code
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    Resend code in {countdown} seconds
                                </p>
                            )}
                        </div>

                        {/* Help Text */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <p className="text-sm text-slate-700">
                                <strong>Didn't receive the code?</strong>
                            </p>
                            <ul className="text-sm text-slate-600 mt-2 space-y-1 list-disc list-inside">
                                <li>Check your spam/junk folder if using email</li>
                                <li>Ensure you have network coverage if using SMS</li>
                                <li>Wait 60 seconds before requesting a new code</li>
                            </ul>
                        </div>

                        {/* Manual Verify Button (if not auto-submitting) */}
                        {otp.length === 6 && (
                            <Button
                                onClick={handleVerify}
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
                                        Verify Code
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Back Link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/kyc/start')}
                        className="text-sm text-slate-600 hover:text-slate-900"
                    >
                        ← Back to start
                    </button>
                </div>
            </div>
        </div>
    );
}
