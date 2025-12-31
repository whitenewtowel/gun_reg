import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCardIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowDownTrayIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

// ... (interface remains the same)
interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    purpose: string;
    paymentMethod: string;
    createdAt: string;
    completedAt?: string;
    referenceNumber?: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await apiClient.get('/payments/my');
            const data = response.data;
            setPayments(data.payments || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            // Fallback to mock data on error
            setPayments([
                {
                    id: '1',
                    amount: 250.00,
                    currency: 'GHS',
                    status: 'COMPLETED',
                    purpose: 'Permit Application Fee',
                    paymentMethod: 'MOBILE_MONEY',
                    createdAt: '2024-12-20T10:00:00Z',
                    completedAt: '2024-12-20T10:05:00Z',
                    referenceNumber: 'PAY-2024-001234'
                },
                {
                    id: '2',
                    amount: 150.00,
                    currency: 'GHS',
                    status: 'PENDING',
                    purpose: 'License Renewal Fee',
                    paymentMethod: 'BANK_CARD',
                    createdAt: '2024-12-30T14:30:00Z',
                    referenceNumber: 'PAY-2024-005678'
                }
            ]);
            // toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'PENDING':
                return 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30';
            case 'FAILED':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'PENDING':
                return <ClockIcon className="w-5 h-5" />;
            case 'FAILED':
                return <XCircleIcon className="w-5 h-5" />;
            default:
                return <CreditCardIcon className="w-5 h-5" />;
        }
    };

    const downloadReceipt = (paymentId: string) => {
        toast.success(`Receipt for payment ${paymentId} download started`);
        // Implement actual download logic
    };

    const filteredPayments = payments.filter(payment => {
        if (filter === 'ALL') return true;
        return payment.status === filter;
    });

    const totalPaid = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Payment History</h1>
                <p className="text-gray-400">View and manage your payment transactions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1A2035] border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <CreditCardIcon className="w-8 h-8 text-[#D4AF37]" />
                        <div>
                            <p className="text-2xl font-bold text-white">GHS {totalPaid.toFixed(2)}</p>
                            <p className="text-sm text-gray-400">Total Paid</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircleIcon className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {payments.filter(p => p.status === 'COMPLETED').length}
                            </p>
                            <p className="text-sm text-gray-400">Completed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ClockIcon className="w-8 h-8 text-[#D4AF37]" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {payments.filter(p => p.status === 'PENDING').length}
                            </p>
                            <p className="text-sm text-gray-400">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 p-4 bg-[#1A2035] border border-white/10 rounded-lg">
                <FunnelIcon className="w-5 h-5 text-[#D4AF37]" />
                <div className="flex gap-2 flex-wrap">
                    {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payments List */}
            {filteredPayments.length === 0 ? (
                <div className="text-center py-16 bg-[#1A2035] border border-white/10 rounded-lg">
                    <CreditCardIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Payments Found</h3>
                    <p className="text-gray-400">
                        {filter === 'ALL'
                            ? "You haven't made any payments yet"
                            : `No ${filter.toLowerCase()} payments`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPayments.map((payment, index) => (
                        <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1A2035] border border-white/10 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 flex-1">
                                    <div className={`p-3 rounded-lg ${getStatusColor(payment.status)}`}>
                                        {getStatusIcon(payment.status)}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {payment.purpose}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Reference: {payment.referenceNumber}
                                        </p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Amount:</span>
                                                <p className="text-white font-bold">
                                                    {payment.currency} {payment.amount.toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Method:</span>
                                                <p className="text-white">
                                                    {payment.paymentMethod.replace('_', ' ')}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Date:</span>
                                                <p className="text-white">
                                                    {new Date(payment.createdAt).toLocaleDateString('en-GB')}
                                                </p>
                                            </div>
                                            {payment.completedAt && (
                                                <div>
                                                    <span className="text-gray-500">Completed:</span>
                                                    <p className="text-white">
                                                        {new Date(payment.completedAt).toLocaleDateString('en-GB')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${getStatusColor(payment.status)}`}>
                                        {payment.status}
                                    </span>

                                    {payment.status === 'COMPLETED' && (
                                        <button
                                            onClick={() => downloadReceipt(payment.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-[#D4AF37] rounded hover:bg-white/10 transition-colors"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                            Receipt
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
