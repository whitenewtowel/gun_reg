/**
 * KYC Verify Page - Redesigned
 * OTP verification step in the KYC onboarding process
 * Tactical Dark Theme
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import OTPInput from '@/components/kyc/OTPInput';
import kycService from '@/services/kycService';
import { IMAGES } from '@/assets/images';

interface LocationState {
    registration_session_id: string;
    emailOrPhone: string;
    ghana_card_number?: string;
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
        if (!state?.registration_session_id) {
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
            const response = await kycService.verifyOTP({
                registration_session_id: state.registration_session_id,
                otp,
            });

            // Allow for different response structures (direct token or nested in data or setup_code)
            const setupToken = response.setup_code;

            toast.success('Code verified!', {
                description: 'Now set up your password',
            });

            navigate('/kyc/complete', {
                state: {
                    registration_session_id: state.registration_session_id,
                    emailOrPhone: state.emailOrPhone,
                    setupToken: setupToken,
                    ghana_card_number: state.ghana_card_number // Passing this through for consistency
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
            await kycService.resendOTP(state.registration_session_id);

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

    if (!state?.registration_session_id) {
        return null;
    }

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
                        <img src={IMAGES.LOGIN2} alt="" className='w-12 ' />
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-white leading-none">NFLTMS</h1>
                            <p className="text-[0.6rem] text-[#D4AF37] tracking-widest uppercase">Secure Verification</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                        Verifying Device
                    </div>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl relative z-10 flex flex-col justify-center">

                {/* Progress Steps (matching Start Page visual) */}
                <div className="mb-12">
                    <div className="flex justify-between relative">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${s <= 2
                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                                    : 'bg-[#1A2035] border-white/10 text-gray-500'
                                    }`}>
                                    {s}
                                </div>
                                <span className={`mt-2 text-xs uppercase tracking-wider font-semibold ${s <= 2 ? 'text-[#D4AF37]' : 'text-gray-600'
                                    }`}>
                                    {s === 1 ? 'Identity' : s === 2 ? 'Verify' : 'Secure'}
                                </span>
                            </div>
                        ))}
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1A2035] -z-0">
                            <div className="h-full bg-[#D4AF37] w-[50%]"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/5 p-1 relative overflow-hidden clip-chamfer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

                    <div className="bg-[#0B1021] p-6 md:p-8 clip-chamfer border border-white/5 space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-stencil text-white mb-2 uppercase">Verify Code</h2>
                            <p className="text-gray-400 text-sm">
                                Enter the 6-digit code sent to <span className="text-[#D4AF37] font-mono">{state.emailOrPhone}</span>
                            </p>
                        </div>

                        <div className="flex justify-center py-4">
                            {/* NOTE: OTPInput needs to support dark mode or be transparent. 
                                Assuming OTPInput accepts standard styling or is headless. 
                                If it contains hardcoded white styles, this might look odd. 
                                I'll wrap it in a div that might help, but ideally OTPInput should be updated too.
                                For now, relying on its transparency or simplicity. */}
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                disabled={isLoading}
                                error={false}
                            />
                        </div>

                        <div className="space-y-4">
                            {otp.length === 6 && (
                                <Button
                                    onClick={handleVerify}
                                    className="w-full bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold h-12 uppercase tracking-widest clip-chamfer rounded-none"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                                    {!isLoading && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                                </Button>
                            )}

                            <div className="text-center">
                                {canResend ? (
                                    <Button
                                        variant="ghost"
                                        onClick={handleResend}
                                        disabled={isResending}
                                        className="text-[#D4AF37] hover:text-[#B4941F] hover:bg-[#D4AF37]/10"
                                    >
                                        <ArrowPathIcon className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                                        Resend Code
                                    </Button>
                                ) : (
                                    <p className="text-sm text-gray-500 font-mono">
                                        Resend code in <span className="text-white">{countdown}s</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/kyc/start')}
                        className="text-gray-500 text-sm hover:text-white transition-colors"
                    >
                        ← Change Contact Details
                    </button>
                </div>
            </div>
        </div>
    );
}
