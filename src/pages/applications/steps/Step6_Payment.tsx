import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface StepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

const PROCESSING_FEE = 150.00;

export default function Step6_Payment({ onPrev }: StepProps) {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        toast.success('Application submitted successfully!');
        navigate('/dashboard'); // Go back to dashboard after success
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Payment & Submission</h2>
                <p className="text-gray-400">Select a payment method to complete the application processing fee.</p>
            </div>

            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-6 mb-8 text-center">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Amount Due</p>
                <div className="text-4xl font-bold text-[#D4AF37]">
                    GHS {PROCESSING_FEE.toFixed(2)}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div
                    onClick={() => setSelectedMethod('momo')}
                    className={`
                cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all
                ${selectedMethod === 'momo'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'}
             `}
                >
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Mobile Money</h4>
                        <p className="text-xs text-gray-500">MTN, Vodafone, AirtelpTigo</p>
                    </div>
                    {selectedMethod === 'momo' && <Check className="ml-auto w-5 h-5 text-[#D4AF37]" />}
                </div>

                <div
                    onClick={() => setSelectedMethod('card')}
                    className={`
                cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all
                ${selectedMethod === 'card'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'}
             `}
                >
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Bank Card</h4>
                        <p className="text-xs text-gray-500">Visa, Mastercard</p>
                    </div>
                    {selectedMethod === 'card' && <Check className="ml-auto w-5 h-5 text-[#D4AF37]" />}
                </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
                <Button
                    variant="outline"
                    onClick={onPrev}
                    disabled={isProcessing}
                    className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button
                    onClick={handlePayment}
                    disabled={!selectedMethod || isProcessing}
                    className="bg-green-600 text-white hover:bg-green-700 min-w-[200px]"
                >
                    {isProcessing ? (
                        <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                        <>Pay & Submit Application</>
                    )}
                </Button>
            </div>
        </div>
    );
}
