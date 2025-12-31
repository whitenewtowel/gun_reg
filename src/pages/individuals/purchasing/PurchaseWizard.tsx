import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Shield,
    CreditCard,
    FileText,
    ArrowLeft,
    Upload,
    ChevronRight,
    Lock,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Mock Data (Simulating fetching item details)
const MOCK_ITEM = {
    id: 1,
    name: 'Glock 19 Gen 5',
    type: 'Pistol',
    price: 25000,
    dealer: 'SafeArms Ghana Ltd',
    image: 'https://images.unsplash.com/photo-1585589266782-966902229115?auto=format&fit=crop&q=80&w=800'
};

const STEPS = [
    { number: 1, label: 'Review Item' },
    { number: 2, label: 'Documents' },
    { number: 3, label: 'Terms' },
    { number: 4, label: 'Payment' }
];

export default function PurchaseWizard() {
    const navigate = useNavigate();
    const { dealerId, itemId } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form States
    const [agreed, setAgreed] = useState(false);

    // Handlers
    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(c => c + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
        else navigate(-1);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white max-w-lg w-full rounded-3xl p-10 shadow-2xl text-center border border-gray-100"
                >
                    <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1A2035] mb-4">Purchase Request Sent!</h2>
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        Your request for the <span className="font-bold text-[#1A2035]">{MOCK_ITEM.name}</span> has been securely transmitted to <span className="font-semibold">{MOCK_ITEM.dealer}</span>.
                    </p>
                    <div className="bg-blue-50 p-6 rounded-2xl mb-8 text-left">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                            <Shield className="h-4 w-4 mr-2" /> Next Steps
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                            <li>Dealer verifies your Permit to Purchase.</li>
                            <li>You receive a notification upon approval.</li>
                            <li>Visit the store for physical handover.</li>
                        </ul>
                    </div>
                    <Button
                        className="w-full bg-[#1A2035] hover:bg-[#2A3455] text-white h-12 rounded-xl font-bold"
                        onClick={() => navigate('/history')}
                    >
                        View Order Status
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pb-20 pt-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" className="hover:bg-transparent -ml-4 text-gray-400 hover:text-gray-900" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Wizard Form */}
                    <div className="lg:col-span-8">
                        {/* Progress Stepper */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center relative overflow-hidden">
                            {STEPS.map((step) => {
                                const isActive = currentStep === step.number;
                                const isCompleted = currentStep > step.number;
                                return (
                                    <div key={step.number} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? 'bg-[#1A2035] text-white shadow-lg scale-110' :
                                                isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.number}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-[#1A2035]' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                            {/* Connector Line */}
                            <div className="absolute top-11 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
                        </div>

                        {/* Step Content */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden min-h-[400px] relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-8 h-full flex flex-col"
                                >
                                    {/* Step 1: Review */}
                                    {currentStep === 1 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black text-[#1A2035]">Review your selection</h2>
                                            <div className="flex gap-6 items-start p-6 bg-gray-50 rounded-2xl">
                                                <div className="h-32 w-32 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                                    <img src={MOCK_ITEM.image} alt={MOCK_ITEM.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <Badge className="bg-[#1A2035] text-white mb-2">{MOCK_ITEM.type}</Badge>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{MOCK_ITEM.name}</h3>
                                                    <p className="text-gray-500 text-sm mb-4">Sold by: {MOCK_ITEM.dealer}</p>
                                                    <div className="text-2xl font-black text-[#1A2035]">GHS {MOCK_ITEM.price.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                <p className="text-sm text-blue-800 leading-relaxed">
                                                    You are initiating a purchase request. No physical items will be shipped. You must pick up the firearm in person after police verification.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Documents */}
                                    {currentStep === 2 && (
                                        <div className="space-y-8">
                                            <div className="text-center">
                                                <h2 className="text-2xl font-black text-[#1A2035] mb-2">Verification Documents</h2>
                                                <p className="text-gray-500">Upload clear copies of your required documents.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:bg-gray-50 transition-colors text-center group cursor-pointer">
                                                    <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                        <FileText className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1">Permit to Purchase</h4>
                                                    <p className="text-xs text-gray-500 mb-4">Form 1, issued by Police</p>
                                                    <Button size="sm" variant="outline" className="rounded-full">Select File</Button>
                                                </div>
                                                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:bg-gray-50 transition-colors text-center group cursor-pointer">
                                                    <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                        <Shield className="h-8 w-8 text-emerald-600" />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1">Ghana Card (ID)</h4>
                                                    <p className="text-xs text-gray-500 mb-4">Front and Back</p>
                                                    <Button size="sm" variant="outline" className="rounded-full">Select File</Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Terms */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black text-[#1A2035]">Terms & Declarations</h2>
                                            <div className="bg-gray-50 p-6 rounded-2xl h-64 overflow-y-auto text-sm text-gray-600 space-y-4 border border-gray-100">
                                                <p>1. I hereby declare that all information provided is true and accurate.</p>
                                                <p>2. I understand that this purchase is subject to approval by the Ghana Police Service.</p>
                                                <p>3. I confirm that I am the holder of a valid Permit to Purchase for this specific class of firearm.</p>
                                                <p>4. I agree to the non-refundable processing fee of GHS 50.00.</p>
                                                <p>5. Physical collection requires biometric verification at the dealer's location.</p>
                                            </div>
                                            <div className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#1A2035] transition-colors cursor-pointer" onClick={() => setAgreed(!agreed)}>
                                                <Checkbox id="terms" checked={agreed} onCheckedChange={(c) => setAgreed(!!c)} />
                                                <label htmlFor="terms" className="text-sm font-bold text-gray-900 cursor-pointer select-none">
                                                    I have read and agree to all terms and conditions above.
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Payment */}
                                    {currentStep === 4 && (
                                        <div className="space-y-8">
                                            <div className="text-center">
                                                <h2 className="text-2xl font-black text-[#1A2035] mb-2">Secure Payment</h2>
                                                <p className="text-gray-500">Choose your preferred payment method.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative border-2 border-[#1A2035] bg-[#1A2035]/5 rounded-2xl p-6 cursor-pointer">
                                                    <div className="absolute top-4 right-4">
                                                        <CheckCircle2 className="h-6 w-6 text-[#1A2035] fill-white" />
                                                    </div>
                                                    <CreditCard className="h-8 w-8 text-[#1A2035] mb-4" />
                                                    <h4 className="font-bold text-[#1A2035]">Mobile Money</h4>
                                                    <p className="text-sm text-gray-600">MTN, Vodafone, AirtelTigo</p>
                                                </div>
                                                <div className="border-2 border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 rounded-2xl p-6 cursor-pointer transition-all shadow-sm">
                                                    <CreditCard className="h-8 w-8 text-gray-400 mb-4" />
                                                    <h4 className="font-bold text-gray-900">Card Payment</h4>
                                                    <p className="text-sm text-gray-500">Visa, Mastercard</p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-100 p-4 rounded-xl">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600">Item Price</span>
                                                    <span className="font-bold">GHS {MOCK_ITEM.price.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600">Processing Fee</span>
                                                    <span className="font-bold">GHS 50.00</span>
                                                </div>
                                                <div className="h-px bg-gray-200 my-2" />
                                                <div className="flex justify-between items-center text-lg font-black text-[#1A2035]">
                                                    <span>Total to Pay</span>
                                                    <span>GHS {(MOCK_ITEM.price + 50).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="p-8 border-t border-gray-100 flex justify-between bg-gray-50/50 mt-auto">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    className="h-12 px-8 rounded-xl font-bold border-gray-200"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    disabled={(currentStep === 3 && !agreed) || isSubmitting}
                                    className="h-12 px-8 rounded-xl font-bold bg-[#1A2035] hover:bg-[#2A3455] text-white shadow-lg shadow-[#1A2035]/20"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center"><span className="animate-spin mr-2">⏳</span> Processing...</span>
                                    ) : currentStep === 4 ? (
                                        'Pay & Submit Request'
                                    ) : (
                                        'Continue'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-3xl border-none shadow-xl shadow-gray-200/50">
                            <CardContent className="p-6">
                                <h3 className="font-black text-gray-900 mb-6 text-lg">Order Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            <img src={MOCK_ITEM.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded inline-block mb-1">
                                                {MOCK_ITEM.type}
                                            </div>
                                            <div className="font-bold text-[#1A2035] leading-tight">{MOCK_ITEM.name}</div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100" />

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span>GHS {MOCK_ITEM.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Fees</span>
                                            <span>GHS 50.00</span>
                                        </div>
                                        <div className="flex justify-between font-black text-[#1A2035] text-lg pt-2">
                                            <span>Total</span>
                                            <span>GHS {(MOCK_ITEM.price + 50).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-xs font-medium flex gap-2">
                                        <Lock className="h-4 w-4 shrink-0" />
                                        Secure transaction encrypted by 256-bit SSL.
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
