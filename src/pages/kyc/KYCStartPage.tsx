/**
 * KYC Start Page - Redesigned
 * tactical/dark themed multi-step wizard
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheckIcon,
    ArrowRightIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import kycService from '@/services/kycService';
import logo from '@/assets/images/logo2.png'
// --- Validation Schema ---
const phoneRegex = /^(0|\+233)[0-9]{9}$/;

const kycStartSchema = z.object({
    ghana_card_number: z.string().min(1, 'Ghana Card number is required').regex(/^GHA-\d{9}-\d$/, 'Invalid format (GHA-123456789-0)'),
    region_code: z.string().min(1, 'Region is required'),
    city: z.string().min(2, 'City is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(phoneRegex, 'Invalid Ghana phone number'),
    delivery_channel: z.enum(['sms', 'email']),
    emergency_contact: z.object({
        name: z.string().optional(),
        phone: z.string().optional(), // Make optional first to allow empty, but refine if needed. User prompt implies optional? "emergency_contact { description: Optional... }" YES.
        relationship: z.string().optional(),
        email: z.string().email('Invalid emergency email').optional().or(z.literal('')),
    }).optional(),
});

type KYCFormData = z.infer<typeof kycStartSchema>;

// --- Constants ---
const REGIONS = [
    { code: 'AHR', name: 'Ahafo Region' },
    { code: 'ASH', name: 'Ashanti Region' },
    { code: 'BON', name: 'Bono Region' },
    { code: 'BER', name: 'Bono East Region' },
    { code: 'CEN', name: 'Central Region' },
    { code: 'EAR', name: 'Eastern Region' },
    { code: 'GAR', name: 'Greater Accra Region' },
    { code: 'NER', name: 'North East Region' },
    { code: 'NOR', name: 'Northern Region' },
    { code: 'OTR', name: 'Oti Region' },
    { code: 'SAV', name: 'Savannah Region' },
    { code: 'UER', name: 'Upper East Region' },
    { code: 'UWR', name: 'Upper West Region' },
    { code: 'VOR', name: 'Volta Region' },
    { code: 'WNR', name: 'Western North Region' },
    { code: 'WES', name: 'Western Region' },
];

export default function KYCStartPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
        setValue
    } = useForm<KYCFormData>({
        resolver: zodResolver(kycStartSchema),
        defaultValues: {
            delivery_channel: 'sms',
            region_code: '',
            emergency_contact: {
                name: '',
                phone: '',
                relationship: '',
                email: ''
            }
        }
    });

    const deliveryChannel = watch('delivery_channel');

    const nextStep = async () => {
        let fieldsToValidate: (keyof KYCFormData)[] = [];
        if (step === 1) fieldsToValidate = ['ghana_card_number', 'region_code', 'city'];
        if (step === 2) fieldsToValidate = ['email', 'phone', 'delivery_channel'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const onSubmit = async (data: KYCFormData) => {
        setIsLoading(true);
        try {
            const response = await kycService.startKYC(data);

            if (response.success) {
                toast.success('Verification started', {
                    description: response.message || `Code sent to your ${data.delivery_channel === 'sms' ? 'phone' : 'email'}`,
                });
                navigate('/kyc/verify', {
                    state: {
                        kyc_session_id: response.data.kyc_session_id,
                        emailOrPhone: data.delivery_channel === 'sms' ? data.phone : data.email
                    }
                });
            } else {
                toast.error('Failed to start verification', {
                    description: response.message || 'Please try again',
                });
            }
        } catch (error: any) {
            // Handle existing session case
            if (error?.error_code === 'KYC_ALREADY_IN_PROGRESS') {
                const contact = data.delivery_channel === 'sms' ? data.phone : data.email;
                const toastId = toast.loading('Resuming verification...', {
                    description: 'Recovering your active session details',
                });

                try {
                    const session = await kycService.getSession(contact);
                    // Check both direct and nested data structure
                    const sessionId = session?.data?.kyc_session_id || session?.kyc_session_id;

                    if (sessionId) {
                        toast.dismiss(toastId);
                        toast.success('Session recovered', {
                            description: 'Taking you to verification step',
                        });

                        navigate('/kyc/verify', {
                            state: {
                                kyc_session_id: sessionId,
                                emailOrPhone: contact
                            }
                        });
                        return;
                    } else {
                        toast.dismiss(toastId);
                        console.error('Session recovery failed: No ID found in response', session);
                    }
                } catch (sessionError) {
                    toast.dismiss(toastId);
                    console.error('Failed to recover session', sessionError);
                }
            }

            toast.error('Failed to start verification', {
                description: error instanceof Error ? error.message : (error?.error || 'Please try again'),
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
                <Link className="container mx-auto px-4 py-4 flex items-center justify-between" to="/">
             
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10  flex items-center justify-center">
                            <img src={logo} alt="Logo" className='w-14 h-12 object-contain' />

                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-white leading-none">NFLTMS</h1>
                            <p className="text-[0.6rem] text-[#D4AF37] tracking-widest uppercase">Secure Verification</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        Encrypted Session
                    </div>
                </Link>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl relative z-10">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex justify-between relative">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${step >= s
                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                                    : 'bg-[#1A2035] border-white/10 text-gray-500'
                                    }`}>
                                    {s}
                                </div>
                                <span className={`mt-2 text-xs uppercase tracking-wider font-semibold ${step >= s ? 'text-[#D4AF37]' : 'text-gray-600'
                                    }`}>
                                    {s === 1 ? 'Identity' : s === 2 ? 'Contact' : 'Emergency'}
                                </span>
                            </div>
                        ))}
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1A2035] -z-0">
                            <motion.div
                                className="h-full bg-[#D4AF37]"
                                initial={{ width: '0%' }}
                                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/5 p-1 relative overflow-hidden clip-chamfer">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0B1021] p-6 md:p-8 clip-chamfer border border-white/5">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h2 className="text-2xl font-stencil text-white mb-2 uppercase">Verify Identity</h2>
                                        <p className="text-gray-400 text-sm">Enter your National ID details for verification</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Ghana Card Number</label>
                                            <div className="relative group">
                                                <div className="absolute left-0 bottom-0 top-0 w-1 bg-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                                <input
                                                    {...register('ghana_card_number')}
                                                    placeholder="GHA-000000000-0"
                                                    className="w-full bg-[#1A2035] border-none text-white p-4 pl-6 focus:ring-1 focus:ring-[#D4AF37] placeholder:text-gray-600"
                                                />
                                            </div>
                                            {errors.ghana_card_number && <p className="text-red-500 text-xs mt-1">{errors.ghana_card_number.message}</p>}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Region</label>
                                                <select
                                                    {...register('region_code')}
                                                    className="w-full bg-[#1A2035] border-none text-white p-4 focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                                                >
                                                    <option value="">Select Region</option>
                                                    {REGIONS.map(r => (
                                                        <option key={r.code} value={r.code}>{r.name}</option>
                                                    ))}
                                                </select>
                                                {errors.region_code && <p className="text-red-500 text-xs mt-1">{errors.region_code.message}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">City / Town</label>
                                                <input
                                                    {...register('city')}
                                                    placeholder="Accra"
                                                    className="w-full bg-[#1A2035] border-none text-white p-4 focus:ring-1 focus:ring-[#D4AF37]"
                                                />
                                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="button"
                                            onClick={nextStep}
                                            className="w-full bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold h-12 uppercase tracking-widest clip-chamfer rounded-none"
                                        >
                                            Continue
                                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <h2 className="text-2xl font-stencil text-white mb-2 uppercase">Contact Details</h2>
                                        <p className="text-gray-400 text-sm">How should we verify your account?</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Email Address</label>
                                            <div className="relative">
                                                <EnvelopeIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    {...register('email')}
                                                    placeholder="user@example.com"
                                                    className="w-full bg-[#1A2035] border-none text-white p-4 pl-12 focus:ring-1 focus:ring-[#D4AF37]"
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Phone Number</label>
                                            <div className="relative">
                                                <PhoneIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    {...register('phone')}
                                                    placeholder="+233"
                                                    className="w-full bg-[#1A2035] border-none text-white p-4 pl-12 focus:ring-1 focus:ring-[#D4AF37]"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Verification Method</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div
                                                    onClick={() => setValue('delivery_channel', 'sms')}
                                                    className={`cursor-pointer p-4 border ${deliveryChannel === 'sms' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-[#1A2035]'} transition-all`}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${deliveryChannel === 'sms' ? 'border-[#D4AF37]' : 'border-gray-500'}`}>
                                                            {deliveryChannel === 'sms' && <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />}
                                                        </div>
                                                        <span className={`font-bold ${deliveryChannel === 'sms' ? 'text-[#D4AF37]' : 'text-gray-400'}`}>SMS</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 pl-7">Fastest delivery to your provided number</p>
                                                </div>

                                                <div
                                                    // onClick={() => setValue('delivery_channel', 'email')}
                                                    onClick={() => null}
                                                    className={`cursor-pointer p-4 border ${deliveryChannel === 'email' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-[#1A2035]'} transition-all`}
                                                    
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${deliveryChannel === 'email' ? 'border-[#D4AF37]' : 'border-gray-500'}`}>
                                                            {deliveryChannel === 'email' && <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />}
                                                        </div>
                                                        <span className={`font-bold ${deliveryChannel === 'email' ? 'text-[#D4AF37]' : 'text-gray-400'}`}>Email</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 pl-7">Receive code via your email address</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            onClick={prevStep}
                                            variant="outline"
                                            className="w-1/3 border-white/20 text-yellow-500 uppercase hover:bg-white/10 h-12 rounded-none"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex-1 bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold h-12 uppercase tracking-widest clip-chamfer rounded-none"
                                        >
                                            Continue
                                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-2xl font-stencil text-white mb-2 uppercase">Emergency Contact</h2>
                                                <p className="text-gray-400 text-sm"> Secondary contact</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Full Name</label>
                                            <input
                                                {...register('emergency_contact.name')}
                                                placeholder="Next of Kin Name"
                                                className="w-full bg-[#1A2035] border-none text-white p-4 focus:ring-1 focus:ring-[#D4AF37]"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Relationship</label>
                                                <input
                                                    {...register('emergency_contact.relationship')}
                                                    placeholder="Spouse, Sibling, etc."
                                                    className="w-full bg-[#1A2035] border-none text-white p-4 focus:ring-1 focus:ring-[#D4AF37]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Phone</label>
                                                <input
                                                    {...register('emergency_contact.phone')}
                                                    placeholder="+233"
                                                    className="w-full bg-[#1A2035] border-none text-white p-4 focus:ring-1 focus:ring-[#D4AF37]"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Email (Optional)</label>
                                            <input
                                                {...register('emergency_contact.email')}
                                                placeholder="emergency@example.com"
                                                className="w-full bg-[#1A2035] border-none text-white p-4 focus:ring-1 focus:ring-[#D4AF37]"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-[#D4AF37]/5 p-4 border-l-2 border-[#D4AF37] mt-6">
                                        <div className="flex gap-3">
                                            <ShieldCheckIcon className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                                            <div>
                                                <h4 className="text-white font-bold text-xs uppercase mb-1">Data Privacy</h4>
                                                <p className="text-[10px] text-gray-400 leading-relaxed">
                                                    Your data is verified against the National Identification Authority database. By continuing, you agree to our Terms of Service.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            onClick={prevStep}
                                            variant="outline"
                                            className="w-1/3 border-white/20 text-yellow-500 uppercase hover:bg-white/10 h-12 rounded-none"
                                            disabled={isLoading}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold h-12 uppercase tracking-widest clip-chamfer rounded-none"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Verifying...' : 'Submit Verification'}
                                            {!isLoading && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Existing Application? <a href="/login" className="text-[#D4AF37] hover:underline font-bold">Login Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
