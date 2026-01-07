import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function PaymentCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        // In a real app, we would verify the transaction reference with the backend here.
        // For now, we'll check the 'status' param or assume success if we're redirected here.
        const statusParam = searchParams.get('status');

        // Simulating verification delay
        const timer = setTimeout(() => {
            if (statusParam === 'failed' || statusParam === 'cancelled') {
                setStatus('failed');
            } else {
                setStatus('success');
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                {status === 'loading' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Verifying Payment</h2>
                        <p className="text-slate-500">Please wait while we confirm your transaction...</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircleIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                        <p className="text-slate-600 mb-8">
                            Your payment has been processed successfully. Your firearm acquisition request is now pending approval.
                        </p>
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-[#D4AF37] hover:bg-[#B4941F] text-white h-12 text-lg"
                        >
                            Go to Dashboard
                        </Button>
                    </motion.div>
                )}

                {status === 'failed' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircleIcon className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h2>
                        <p className="text-slate-600 mb-8">
                            We couldn't process your payment. Please try again or contact support if the issue persists.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => navigate(-1)}
                                variant="outline"
                                className="flex-1"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 bg-slate-900 text-white"
                            >
                                Dashboard
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
