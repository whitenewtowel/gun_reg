import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCardIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowDownTrayIcon,
    ChartBarIcon,
    CalendarIcon,
    MagnifyingGlassIcon,
    EllipsisHorizontalIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

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

interface MonthlyData {
    month: string;
    amount: number;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('This Month');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await apiClient.get('/payments/my');
            const data = response.data;
            setPayments(data.payments || mockPayments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setPayments(mockPayments);
        } finally {
            setLoading(false);
        }
    };

    const mockPayments: Payment[] = [
        {
            id: '1',
            amount: 450.00,
            currency: 'GHS',
            status: 'COMPLETED',
            purpose: 'New Rifle License Application',
            paymentMethod: 'MOBILE_MONEY',
            createdAt: '2024-12-15T10:00:00Z',
            completedAt: '2024-12-15T10:05:00Z',
            referenceNumber: 'PAY-2024-001234'
        },
        {
            id: '2',
            amount: 200.00,
            currency: 'GHS',
            status: 'COMPLETED',
            purpose: 'License Renewal Fee',
            paymentMethod: 'BANK_CARD',
            createdAt: '2024-11-20T14:30:00Z',
            completedAt: '2024-11-20T14:35:00Z',
            referenceNumber: 'PAY-2024-005678'
        },
        {
            id: '3',
            amount: 50.00,
            currency: 'GHS',
            status: 'COMPLETED',
            purpose: 'Firearm Transfer Fee',
            paymentMethod: 'MOBILE_MONEY',
            createdAt: '2024-10-10T09:15:00Z',
            completedAt: '2024-10-10T09:20:00Z',
            referenceNumber: 'PAY-2024-003456'
        },
        {
            id: '4',
            amount: 150.00,
            currency: 'GHS',
            status: 'PENDING',
            purpose: 'Document Processing Fee',
            paymentMethod: 'MOBILE_MONEY',
            createdAt: '2024-12-30T16:00:00Z',
            referenceNumber: 'PAY-2024-007890'
        },
        {
            id: '5',
            amount: 400.00,
            currency: 'GHS',
            status: 'FAILED',
            purpose: 'Pistol License Application',
            paymentMethod: 'BANK_CARD',
            createdAt: '2024-12-28T11:00:00Z',
            referenceNumber: 'PAY-2024-006789'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'text-emerald-600 bg-emerald-50';
            case 'PENDING':
                return 'text-amber-600 bg-amber-50';
            case 'FAILED':
                return 'text-rose-600 bg-rose-50';
            default:
                return 'text-slate-600 bg-slate-50';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        return method === 'MOBILE_MONEY' ? (
            <DevicePhoneMobileIcon className="w-5 h-5" />
        ) : (
            <CreditCardIcon className="w-5 h-5" />
        );
    };

    const downloadReceipt = (paymentId: string) => {
        toast.success('Receipt download started');
    };

    const filteredPayments = payments.filter(payment => {
        const matchesFilter = filter === 'ALL' || payment.status === filter;
        const matchesSearch = payment.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalPaid = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = payments
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);

    const completedCount = payments.filter(p => p.status === 'COMPLETED').length;
    const pendingCount = payments.filter(p => p.status === 'PENDING').length;

    // Monthly spending data for chart
    const monthlyData: MonthlyData[] = [
        { month: 'Jul', amount: 0 },
        { month: 'Aug', amount: 0 },
        { month: 'Sep', amount: 0 },
        { month: 'Oct', amount: 50 },
        { month: 'Nov', amount: 200 },
        { month: 'Dec', amount: 600 }
    ];

    const maxAmount = Math.max(...monthlyData.map(d => d.amount));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-md animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading payments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">Payment Overview</h1>
                        <p className="text-slate-500">Track your licensing and service payments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            {selectedPeriod}
                        </button>
                        <button className="px-6 py-2 bg-[#D4AF37] text-white rounded-xl font-medium hover:bg-[#B4941F] transition-all ">
                            Export Report
                        </button>
                    </div>
                </motion.div>

                {/* Balance Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Paid Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden bg-gradient-to-br from-[#1A2035] to-[#2A3550] rounded-2xl p-6 text-white "
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-md blur-3xl"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <BanknotesIcon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                                    <ArrowTrendingUpIcon className="w-4 h-4" />
                                    +12.5%
                                </div>
                            </div>
                            <p className="text-white/70 text-sm mb-2">Total Paid</p>
                            <h2 className="text-4xl font-bold mb-1">GHS {totalPaid.toFixed(2)}</h2>
                            <p className="text-white/50 text-xs">Since registration</p>
                        </div>
                    </motion.div>

                    {/* Completed Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6  border border-slate-100 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CheckCircleSolid className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
                                Success Rate: {completedCount > 0 ? Math.round((completedCount / payments.length) * 100) : 0}%
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm mb-2">Completed</p>
                        <h2 className="text-3xl font-bold text-slate-900">{completedCount}</h2>
                        <p className="text-slate-400 text-xs mt-1">Successful transactions</p>
                    </motion.div>

                    {/* Pending Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6  border border-slate-100 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <ClockIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                                In Progress
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm mb-2">Pending</p>
                        <h2 className="text-3xl font-bold text-slate-900">{pendingCount}</h2>
                        <p className="text-slate-400 text-xs mt-1">GHS {pendingAmount.toFixed(2)} pending</p>
                    </motion.div>
                </div>

                {/* Chart and Recent Payments Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Spending Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6  border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Spending Overview</h3>
                                <p className="text-sm text-slate-500">Monthly payment trends</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <ChartBarIcon className="w-5 h-5 text-slate-400" />
                                </button>
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <EllipsisHorizontalIcon className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="space-y-2">
                            {monthlyData.map((data, index) => (
                                <motion.div
                                    key={data.month}
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: '100%' }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <span className="text-sm font-medium text-slate-600 w-8">{data.month}</span>
                                    <div className="flex-1 bg-slate-100 rounded-md h-10 relative overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(data.amount / maxAmount) * 100}%` }}
                                            transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37] to-[#B4941F] rounded-md flex items-center justify-end pr-3"
                                        >
                                            {data.amount > 0 && (
                                                <span className="text-xs font-bold text-white">
                                                    GHS {data.amount}
                                                </span>
                                            )}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Average Monthly Spend</span>
                                <span className="font-bold text-slate-900">GHS {(totalPaid / 6).toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-md p-6  border border-slate-100 space-y-4"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Methods</h3>

                        <div className="space-y-3">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium text-slate-700">Mobile Money</span>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600">65%</span>
                                </div>
                                <div className="h-2 bg-white/50 rounded-md overflow-hidden">
                                    <div className="h-full w-[65%] bg-blue-500 rounded-md"></div>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <CreditCardIcon className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm font-medium text-slate-700">Bank Card</span>
                                    </div>
                                    <span className="text-xs font-bold text-purple-600">35%</span>
                                </div>
                                <div className="h-2 bg-white/50 rounded-md overflow-hidden">
                                    <div className="h-full w-[35%] bg-purple-500 rounded-md"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircleSolid className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-900">All Payments Secured</span>
                            </div>
                            <p className="text-xs text-emerald-700 leading-relaxed">
                                256-bit SSL encryption protects all your transactions
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-4 items-center justify-between"
                >
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === status
                                    ? 'bg-[#1A2035] text-white'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Transactions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl  border border-slate-100 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
                        <p className="text-sm text-slate-500">All your payment transactions</p>
                    </div>

                    {filteredPayments.length === 0 ? (
                        <div className="text-center py-16">
                            <CreditCardIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Transactions Found</h3>
                            <p className="text-slate-500 text-sm">
                                {filter === 'ALL'
                                    ? "You haven't made any payments yet"
                                    : `No ${filter.toLowerCase()} payments found`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredPayments.map((payment, index) => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.05 }}
                                    className="p-6 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Left Section */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-3 rounded-xl ${payment.status === 'COMPLETED'
                                                ? 'bg-emerald-50'
                                                : payment.status === 'PENDING'
                                                    ? 'bg-amber-50'
                                                    : 'bg-rose-50'
                                                }`}>
                                                {getPaymentMethodIcon(payment.paymentMethod)}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-[#D4AF37] transition-colors">
                                                    {payment.purpose}
                                                </h4>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="font-mono">{payment.referenceNumber}</span>
                                                    <span>•</span>
                                                    <span>{new Date(payment.createdAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">
                                                        {payment.paymentMethod.replace('_', ' ').toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section */}
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-slate-900">
                                                    {payment.currency} {payment.amount.toFixed(2)}
                                                </p>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(payment.status)
                                                    }`}>
                                                    {payment.status === 'COMPLETED' && <CheckCircleSolid className="w-3 h-3" />}
                                                    {payment.status === 'PENDING' && <ClockIcon className="w-3 h-3" />}
                                                    {payment.status === 'FAILED' && <XCircleIcon className="w-3 h-3" />}
                                                    {payment.status}
                                                </span>
                                            </div>

                                            {payment.status === 'COMPLETED' && (
                                                <button
                                                    onClick={() => downloadReceipt(payment.id)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors group/btn"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5 text-slate-400 group-hover/btn:text-[#D4AF37] transition-colors" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}