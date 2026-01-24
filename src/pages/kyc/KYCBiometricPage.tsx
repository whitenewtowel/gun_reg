/**
 * Biometric KYC Page
 * Final verification step using Smile ID SDK
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
    ArrowRightIcon,
    ShieldCheckIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import biometricService from '@/services/biometricService';
import { useAuth } from '@/context/AuthContext';
import { IMAGES } from '@/assets/images';

// Import Smile ID Web Component
import '@smileid/web-components/smart-camera-web';

// Declare custom element for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'smart-camera-web': any;
        }
    }
}

// Helper to convert Base64 to File
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

// Simple check mark icon for success state
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

interface LocationState {
    ghana_card_number: string;
    userId: string;
}

export default function KYCBiometricPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const state = location.state as LocationState;

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'COMPLETED' | 'FAILED'>('IDLE');
    const [jobId, setJobId] = useState<string | null>(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);
    const cameraRef = useRef<HTMLElement | null>(null);

    // Use callback ref to handle strict mode and ensure listener is attached
    const setCameraRef = useCallback((node: HTMLElement | null) => {
        if (cameraRef.current) {
            // Cleanup previous listener
            cameraRef.current.removeEventListener('images-success', handleImagesSuccess as EventListener);
        }

        cameraRef.current = node;

        if (node) {
            // Attach new listener
            node.addEventListener('images-success', handleImagesSuccess as EventListener);
        }
    }, []);

    const handleImagesSuccess = (e: CustomEvent) => {
        console.log('Smile ID Images Success:', e.detail);
        const images = e.detail.images;
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
        const ghanaCard = state?.ghana_card_number || user?.ghanaCardNumber;

        if (!effectiveUserId || !ghanaCard) {
            toast.error('Missing user information', {
                description: 'Cannot proceed without User ID and Ghana Card number.'
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
                setJobId(response.data.jobId);
                setStatus('PENDING');
                toast.success('Verification Initiated', {
                    description: 'We are verifying your identity. This may take a moment.'
                });
                startPolling(effectiveUserId);
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

    const startPolling = (userId: string) => {
        if (pollInterval.current) clearInterval(pollInterval.current);

        pollInterval.current = setInterval(async () => {
            try {
                const response = await biometricService.getStatus(userId);
                if (response.data.status === 'COMPLETED') {
                    stopPolling();
                    setStatus('COMPLETED');
                    toast.success('Verification Successful', {
                        description: 'Your identity has been verified.'
                    });
                    setTimeout(() => {
                        navigate('/onboarding/select-user-type', {
                            state: {
                                verified: true,
                                userId: userId
                            }
                        });
                    }, 1500);
                } else if (response.data.status === 'FAILED') {
                    stopPolling();
                    setStatus('FAILED');
                    toast.error('Verification Failed', {
                        description: 'Identity verification failed. Please try again.'
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 3000);
    };

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
        }
    };

    useEffect(() => {
        return () => stopPolling();
    }, []);

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
                            <p className="text-[0.6rem] text-[#D4AF37] tracking-widest uppercase">Biometric Verification</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl relative z-10">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex justify-between relative">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${s <= 3 ? 'bg-[#D4AF37] border-[#D4AF37] text-black' :
                                    s === 4 ? 'bg-[#1A2035] border-[#D4AF37] text-[#D4AF37]' :
                                        'bg-[#1A2035] border-white/10 text-gray-500'
                                    }`}>
                                    {s <= 3 ? <CheckCircleIcon className="w-6 h-6" /> : s}
                                </div>
                                <span className={`mt-2 text-xs uppercase tracking-wider font-semibold ${s === 4 ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
                                    {s === 4 ? 'Biometric' : ''}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1A2035] -z-0">
                            <div className="h-full bg-[#D4AF37] w-[90%]"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/5 p-1 relative overflow-hidden clip-chamfer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

                    <div className="bg-[#0B1021] p-6 md:p-8 clip-chamfer border border-white/5 space-y-6">
                        <div>
                            <h2 className="text-2xl font-stencil text-white mb-2 uppercase">Liveness Check</h2>
                            <p className="text-gray-400 text-sm">Position your face in the frame to verify your identity.</p>
                        </div>

                        {status === 'IDLE' || status === 'FAILED' ? (
                            <div className="space-y-6">
                                {/* Camera / Preview Area */}
                                <div className="relative min-h-[300px] bg-black/50 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                                    {!preview ? (
                                        // Smile ID Web Component
                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            <smart-camera-web
                                                ref={setCameraRef}
                                            ></smart-camera-web>
                                        </div>
                                    ) : (
                                        // Preview Captured Image
                                        <div className="relative w-full h-full p-4 flex flex-col items-center">
                                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#D4AF37] mb-4">
                                                <img src={preview} alt="Captured" className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                onClick={handleRetake}
                                                className="flex items-center text-[#D4AF37] hover:text-white transition-colors gap-2 text-sm"
                                            >
                                                <ArrowPathIcon className="w-4 h-4" />
                                                Retake Photo
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={!file || isLoading}
                                    className="w-full bg-[#D4AF37]  text-black font-bold h-12 uppercase tracking-widest clip-chamfer rounded-none"
                                >
                                    {isLoading ? 'Processing...' : 'Verify Now'}
                                    {!isLoading && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                                </Button>

                                <div className="text-center pt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={handleSkip}
                                        className="text-gray-500 hover:text-white text-sm"
                                        disabled={isLoading}
                                    >
                                        Skip for now
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Polling State
                            <div className="py-12 text-center space-y-6">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
                                    <ShieldCheckIcon className="absolute inset-0 m-auto w-10 h-10 text-[#D4AF37] animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Verifying Identity</h3>
                                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                        Please wait while we securely verify your information with the National Identification Authority.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
