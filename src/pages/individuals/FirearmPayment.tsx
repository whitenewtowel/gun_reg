import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    CreditCardIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    IdentificationIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface PurchaseItem {
    id: string;
    name: string;
    type: 'PISTOL' | 'RIFLE' | 'SHOTGUN';
    make: string;
    model: string;
    caliber: string;
    price: number;
    image: string;
    serialNumber?: string;
}

interface Dealer {
    id: string;
    name: string;
    address: string;
    phone: string;
    licenseNumber: string;
}

const PROCESSING_FEE = 50;

export default function FirearmPurchaseFlow() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dealer, item } = location.state || {};

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [paymentMethod, setPaymentMethod] = useState<'MOBILE_MONEY' | 'CARD' | null>(null);
    const [mobileProvider, setMobileProvider] = useState<'MTN' | 'VODAFONE' | 'AIRTELTIGO'>('MTN');
    const [mobileNumber, setMobileNumber] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToHandover, setAgreedToHandover] = useState(false);

    // Redirect if no data
    if (!dealer || !item) {
        navigate('/dealers');
        return null;
    }

    const total = item.price + PROCESSING_FEE;

    const steps = [
        { id: 1, label: 'Review Request', icon: DocumentTextIcon },
        { id: 2, label: 'Payment', icon: CreditCardIcon },
        { id: 3, label: 'Confirmation', icon: CheckCircleIcon }
    ];

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            // Navigate to success page or show success state
            navigate('/purchase-requests', {
                state: {
                    success: true,
                    requestId: `REQ-${Date.now()}`,
                    itemName: item.name,
                    dealerName: dealer.name
                }
            });
            toast.success('Purchase request submitted successfully!');
        }, 2000);
    };

    const canProceed = () => {
        if (currentStep === 1) return true;
        if (currentStep === 2) {
            return paymentMethod !== null &&
                (paymentMethod === 'CARD' || mobileNumber.length >= 10);
        }
        if (currentStep === 3) {
            return agreedToTerms && agreedToHandover;
        }
        return false;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span className="font-medium">{currentStep === 1 ? 'Back to Dealer' : 'Previous Step'}</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Firearm Purchase Request</h1>
                            <p className="text-slate-600 mt-1">Submit your request for dealer approval</p>
                        </div>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentStep > step.id
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : currentStep === step.id
                                                ? 'bg-[#1A2035] border-[#1A2035]'
                                                : 'bg-white border-slate-300'
                                        }`}>
                                        {currentStep > step.id ? (
                                            <CheckIcon className="w-6 h-6 text-white" />
                                        ) : (
                                            <step.icon className={`w-5 h-5 ${currentStep === step.id ? 'text-white' : 'text-slate-400'
                                                }`} />
                                        )}
                                    </div>
                                    <span className={`text-sm font-medium mt-2 ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`h-0.5 w-24 mx-4 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-300'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Step 1: Review Request */}
                                    {currentStep === 1 && (
                                        <div className="p-8 space-y-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 mb-2">Review Purchase Request</h2>
                                                <p className="text-slate-600">Verify all details before proceeding</p>
                                            </div>

                                            {/* Firearm Details */}
                                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                                    <h3 className="font-semibold text-slate-900">Firearm Details</h3>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex gap-4">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-24 h-24 rounded-lg object-cover border border-slate-200"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="inline-block px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded mb-2">
                                                                {item.type}
                                                            </span>
                                                            <h4 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h4>
                                                            <p className="text-slate-600 mb-3">{item.make} {item.model}</p>
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-slate-500">Caliber</p>
                                                                    <p className="font-semibold text-slate-900">{item.caliber}</p>
                                                                </div>
                                                                {item.serialNumber && (
                                                                    <div>
                                                                        <p className="text-slate-500">Serial Number</p>
                                                                        <p className="font-mono text-sm font-semibold text-slate-900">{item.serialNumber}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dealer Information */}
                                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                                    <h3 className="font-semibold text-slate-900">Authorized Dealer</h3>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <BuildingStorefrontIcon className="w-5 h-5 text-slate-600 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-slate-500">Dealer Name</p>
                                                            <p className="font-semibold text-slate-900">{dealer.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <IdentificationIcon className="w-5 h-5 text-slate-600 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-slate-500">License Number</p>
                                                            <p className="font-mono text-sm font-semibold text-slate-900">{dealer.licenseNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* How It Works */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                                    <ShieldCheckIcon className="w-5 h-5" />
                                                    How This Works
                                                </h4>
                                                <ol className="space-y-2 text-sm text-blue-900">
                                                    <li className="flex gap-2">
                                                        <span className="font-semibold">1.</span>
                                                        <span>Submit purchase request with payment</span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-semibold">2.</span>
                                                        <span>Dealer verifies your license and approves request</span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-semibold">3.</span>
                                                        <span>Dealer submits firearm details to police for recording</span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-semibold">4.</span>
                                                        <span>Visit dealer for physical handover with your ID</span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-semibold">5.</span>
                                                        <span>Firearm registered to you in the national registry</span>
                                                    </li>
                                                </ol>
                                            </div>

                                            <button
                                                onClick={handleNext}
                                                className="w-full py-3 bg-[#1A2035] text-white rounded-lg font-semibold hover:bg-[#2A3550] transition-colors"
                                            >
                                                Continue to Payment
                                            </button>
                                        </div>
                                    )}

                                    {/* Step 2: Payment */}
                                    {currentStep === 2 && (
                                        <div className="p-8 space-y-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Details</h2>
                                                <p className="text-slate-600">Choose your payment method</p>
                                            </div>

                                            {/* Payment Methods */}
                                            <div className="space-y-4">
                                                {/* Mobile Money */}
                                                <button
                                                    onClick={() => setPaymentMethod('MOBILE_MONEY')}
                                                    className={`w-full p-6 border-2 rounded-lg text-left transition-all ${paymentMethod === 'MOBILE_MONEY'
                                                            ? 'border-[#1A2035] bg-slate-50'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                                <DevicePhoneMobileIcon className="w-6 h-6 text-emerald-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">Mobile Money</p>
                                                                <p className="text-sm text-slate-600">MTN, Vodafone, AirtelTigo</p>
                                                            </div>
                                                        </div>
                                                        {paymentMethod === 'MOBILE_MONEY' && (
                                                            <CheckCircleIcon className="w-6 h-6 text-[#1A2035]" />
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Mobile Money Form */}
                                                {paymentMethod === 'MOBILE_MONEY' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-4 pl-4 border-l-4 border-[#1A2035] ml-6"
                                                    >
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                                Select Network
                                                            </label>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {(['MTN', 'VODAFONE', 'AIRTELTIGO'] as const).map(provider => (
                                                                    <button
                                                                        key={provider}
                                                                        onClick={() => setMobileProvider(provider)}
                                                                        className={`py-2 px-4 rounded-lg border-2 font-medium transition-all ${mobileProvider === provider
                                                                                ? 'border-[#1A2035] bg-[#1A2035] text-white'
                                                                                : 'border-slate-200 text-slate-700 hover:border-slate-300'
                                                                            }`}
                                                                    >
                                                                        {provider}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                                Phone Number
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={mobileNumber}
                                                                onChange={(e) => setMobileNumber(e.target.value)}
                                                                placeholder="0244123456"
                                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                                            />
                                                            <p className="text-sm text-slate-500 mt-2">
                                                                You'll receive a prompt to authorize payment
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Card Payment */}
                                                <button
                                                    onClick={() => setPaymentMethod('CARD')}
                                                    className={`w-full p-6 border-2 rounded-lg text-left transition-all ${paymentMethod === 'CARD'
                                                            ? 'border-[#1A2035] bg-slate-50'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <CreditCardIcon className="w-6 h-6 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">Debit/Credit Card</p>
                                                                <p className="text-sm text-slate-600">Visa, Mastercard</p>
                                                            </div>
                                                        </div>
                                                        {paymentMethod === 'CARD' && (
                                                            <CheckCircleIcon className="w-6 h-6 text-[#1A2035]" />
                                                        )}
                                                    </div>
                                                </button>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleBack}
                                                    className="flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    disabled={!canProceed()}
                                                    className="flex-1 px-6 py-3 bg-[#1A2035] text-white rounded-lg font-semibold hover:bg-[#2A3550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Continue to Confirmation
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Confirmation */}
                                    {currentStep === 3 && (
                                        <div className="p-8 space-y-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 mb-2">Final Confirmation</h2>
                                                <p className="text-slate-600">Review and confirm your purchase request</p>
                                            </div>

                                            {/* Order Summary */}
                                            <div className="border border-slate-200 rounded-lg p-4">
                                                <h3 className="font-semibold text-slate-900 mb-3">Request Summary</h3>
                                                <div className="flex gap-4 mb-4 pb-4 border-b border-slate-200">
                                                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover border border-slate-200" alt={item.name} />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                                        <p className="text-sm text-slate-600">{item.make} {item.model}</p>
                                                    </div>
                                                    <p className="font-bold text-slate-900">GHS {item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Dealer</span>
                                                        <span className="text-slate-900 font-medium">{dealer.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Payment Method</span>
                                                        <span className="text-slate-900 font-medium">
                                                            {paymentMethod === 'MOBILE_MONEY' ? 'Mobile Money' : 'Card'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Terms */}
                                            <div className="space-y-3">
                                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={agreedToTerms}
                                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                        className="mt-1 w-5 h-5 rounded border-slate-300 text-[#1A2035] focus:ring-[#1A2035]/20"
                                                    />
                                                    <span className="text-sm text-slate-700">
                                                        I confirm that I have a valid firearm license that matches this firearm type,
                                                        and I understand the dealer will verify my license before approving this request.
                                                    </span>
                                                </label>

                                                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={agreedToHandover}
                                                        onChange={(e) => setAgreedToHandover(e.target.checked)}
                                                        className="mt-1 w-5 h-5 rounded border-slate-300 text-[#1A2035] focus:ring-[#1A2035]/20"
                                                    />
                                                    <span className="text-sm text-slate-700">
                                                        I understand I must visit {dealer.name} in person with valid ID to collect
                                                        the firearm after approval, and the firearm will be registered in my name.
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Important Notice */}
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <div className="flex gap-3">
                                                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-amber-900 mb-2">Important Information</p>
                                                        <ul className="space-y-1 text-sm text-amber-800">
                                                            <li>• Dealer will verify your license with Ghana Police Service</li>
                                                            <li>• Physical handover requires valid ID matching your license</li>
                                                            <li>• Firearm will be automatically registered in national registry</li>
                                                            <li>• Processing fee is non-refundable after dealer approval</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleBack}
                                                    className="flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={!canProceed() || isSubmitting}
                                                    className="flex-1 px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-bold hover:bg-[#C4A030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        'Submit Purchase Request'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-6">
                            <div className="p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-slate-600">{item.type}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Item Price</span>
                                            <span className="font-medium text-slate-900">GHS {item.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Processing Fee</span>
                                            <span className="font-medium text-slate-900">GHS {PROCESSING_FEE}</span>
                                        </div>
                                        <div className="border-t border-slate-200 pt-2 flex justify-between">
                                            <span className="font-bold text-slate-900">Total</span>
                                            <span className="font-bold text-slate-900 text-lg">GHS {total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-sm text-emerald-800">
                                        <ShieldCheckIcon className="w-4 h-4" />
                                        <span className="font-medium">Secure Transaction</span>
                                    </div>
                                    <p className="text-xs text-emerald-700 mt-1">256-bit SSL encryption</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}