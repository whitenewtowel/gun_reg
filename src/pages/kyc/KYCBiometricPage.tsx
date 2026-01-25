/**
 * Biometric KYC Page
 * Final verification step using Smile ID SDK
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
    ArrowRightIcon,
    ShieldCheckIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import heroBg from '@/assets/hero-bg.png';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { Button } from '@/components/ui/button';
import biometricService from '@/services/biometricService';
import { useAuth } from '@/context/AuthContext';
import SmileCamera from '@/components/ui/SmileCamera';

// Import Smile ID Web Component


const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

interface LocationState {
    ghana_card_number: string;
    userId: string;
}

export default function KYCBiometricPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const state = location.state as LocationState;

    const [ghanaCardInput, setGhanaCardInput] = useState(state?.ghana_card_number || user?.ghanaCardNumber || '');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<'IDLE' | 'FAILED'>('IDLE');

    // Check status on mount
    useEffect(() => {
        const checkInitialStatus = async () => {
            const effectiveUserId = state?.userId || user?.id;
            if (!effectiveUserId) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await biometricService.getStatus(effectiveUserId);
                console.log('Initial Biometric Status:', response);

                const backendStatus = response.data?.status;
                const resultCode = response.data?.verificationData?.resultCode;

                // If already Pending or Verified, redirect immediately
                if (
                    backendStatus === 'PENDING' ||
                    backendStatus === 'VERIFIED' ||
                    backendStatus === 'COMPLETED' ||
                    resultCode === '0810' ||
                    resultCode === '0811'
                ) {
                    toast.info('Verification in progress', {
                        description: 'Redirecting you to the next step...'
                    });
                    navigate('/onboarding/select-user-type');
                } else {
                    // Stay on page and show camera
                    setIsLoading(false);
                    if (backendStatus === 'FAILED' || resultCode === '0815') {
                        setStatus('FAILED');
                    }
                }
            } catch (error) {
                console.error('Failed to check status:', error);
                setIsLoading(false);
            }
        };

        checkInitialStatus();
    }, [user, state, navigate]);

    const handleImagesSuccess = (detail: any) => {
        console.log('Smile ID Images Success:', detail);
        const images = detail.images;
        if (images && images.length > 0) {
            const selfieImage = images[0].image;
            const dataUrl = selfieImage.startsWith('data:image')
                ? selfieImage
                : `data:image/jpeg;base64,${selfieImage}`;

            const capturedFile = dataURLtoFile(dataUrl, 'smile_id_selfie.jpg');

            setFile(capturedFile);
            setPreview(dataUrl);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error('Selfie required', {
                description: 'Please capture a selfie first.'
            });
            return;
        }

        const effectiveUserId = state?.userId || user?.id;
        // Use the manually entered value or fallback
        const ghanaCard = ghanaCardInput;

        if (!effectiveUserId) {
            toast.error('Session Error', {
                description: 'User ID not found. Please log in again.'
            });
            return;
        }

        if (!ghanaCard) {
            toast.error('Missing Information', {
                description: 'Please enter your Ghana Card Number.'
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await biometricService.initiateBiometric({
                userId: effectiveUserId,
                ghanaCardNumber: ghanaCard,
                selfie: file
            });

            if (response.success) {
                toast.success('Verification Submitted', {
                    description: 'Your verification is now in progress.'
                });
                // Immediate redirect as per new flow
                navigate('/onboarding/select-user-type');
            } else {
                toast.error('Initiation failed', {
                    description: response.message
                });
                setIsLoading(false);
            }
        } catch (error) {
            toast.error('Submission error', {
                description: error instanceof Error ? error.message : 'Failed to submit documents'
            });
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/onboarding/select-user-type');
    };

    const handleRetake = () => {
        setFile(null);
        setPreview(null);
    };




    return (
        <div className="min-h-screen bg-[#0B1021] text-white font-technical relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[#0B1021]" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/10 blur-[150px] rounded-full mix-blend-color-dodge" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px]  rounded-full mix-blend-color-dodge" />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-[#D4AF37]/5 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-overlay" />
                <ShootingStars
                    starColor="#D4AF37"
                    trailColor="#FFFFFF"
                    minSpeed={15}
                    maxSpeed={35}
                    minDelay={1000}
                    maxDelay={3000}
                    className="absolute inset-0 z-0"
                />
            </div>

            <main className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12 md:py-20">
                <div className="bg-[#1A2035] border border-white/5 p-1 relative overflow-hidden clip-chamfer shadow-2xl backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

                    <div className="bg-[#0B1021]/90 p-5 md:p-8 clip-chamfer border border-white/5 space-y-6 md:space-y-8">
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center justify-center md:justify-start mb-2 opacity-70">
                                <div className="h-px w-8 bg-[#D4AF37]" />
                                <span className="px-3 text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase">Identity Protocol</span>
                                <div className="h-px w-8 bg-[#D4AF37]" />
                            </div>
                            <h2 className="text-xl md:text-3xl font-stencil text-white mb-2 uppercase tracking-wide glow-text">Liveness Check</h2>
                            <p className="text-gray-400 text-sm md:text-base">
                                Position your face in the frame. Ensure your Ghana Card Number is correct.
                            </p>
                        </div>

                        {isLoading ? (
                            // Loading State
                            <div className="py-16 md:py-24 text-center space-y-8">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                                    <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
                                    <ShieldCheckIcon className="absolute inset-0 m-auto w-10 h-10 md:w-14 md:h-14 text-[#D4AF37] animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Checking Status</h3>
                                    <p className="text-gray-400 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                                        Retrieving verification status...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Ghana Card Input Field */}
                                <div className="relative group">
                                    <label htmlFor="ghanaCard" className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-[#D4AF37] transition-colors">
                                        Ghana Card ID Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="ghanaCard"
                                            value={ghanaCardInput}
                                            onChange={(e) => setGhanaCardInput(e.target.value.toUpperCase())}
                                            placeholder="GHA-000000000-0"
                                            className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 transition-all font-mono tracking-wider"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <ShieldCheckIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-1">Format: GHA-123456789-0</p>
                                </div>

                                {/* Camera / Preview Area */}
                                <div className="relative min-h-[350px] md:min-h-[450px] bg-black/50 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center shadow-inner group">
                                    <div className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none z-10"></div>
                                    {!preview ? (
                                        // Smile ID Web Component
                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            <SmileCamera
                                                onSuccess={handleImagesSuccess}
                                            // onClose={() => console.log('Camera closed')}
                                            />
                                        </div>
                                    ) : (
                                        // Preview Captured Image
                                        <div className="relative w-full h-full p-6 flex flex-col items-center justify-center space-y-6">
                                            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                                <img src={preview} alt="Captured" className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                onClick={handleRetake}
                                                className="flex items-center text-[#D4AF37] hover:text-white transition-all transform hover:scale-105 gap-2 text-sm md:text-base font-medium"
                                            >
                                                <ArrowPathIcon className="w-5 h-5" />
                                                Retake Photo
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-2">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!file || isLoading}
                                        className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold h-12 md:h-14 text-base md:text-lg uppercase tracking-widest clip-chamfer rounded-none transition-all duration-300"
                                    >
                                        {isLoading ? 'Processing...' : 'Verify Now'}
                                        {!isLoading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
                                    </Button>

                                    <div className="text-center">
                                        <Button
                                            variant="ghost"
                                            onClick={handleSkip}
                                            className="text-gray-500 hover:text-white text-sm md:text-base hover:bg-white/5"
                                            disabled={isLoading}
                                        >
                                            Skip for now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
