import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    BarChart3,
    Calendar,
    Search,
    MoreHorizontal,
    Banknote,
    Smartphone,
    TrendingUp,
    Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
    const [selectedPeriod] = useState('This Month');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await apiClient.get('/dashboard/payments');
            const data = response.data;
            if (data.success && data.data) {
                setPayments(data.data);
            } else {
                setPayments([]);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to load payment history');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100';
            case 'FAILED':
                return 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        return method === 'MOBILE_MONEY' ? (
            <Smartphone className="w-5 h-5" />
        ) : (
            <CreditCard className="w-5 h-5" />
        );
    };

    const downloadReceipt = () => {
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
            <div className="flex items-center justify-center h-screen bg-gray-50/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading payments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 pb-20 font-sans">
            <div className="max-w-[90rem] mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-[#1A2035] tracking-tight">Payment Overview</h1>
                        <p className="text-slate-500 mt-1">Track your licensing and service payments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="bg-white hover:bg-gray-50 text-slate-700 border-gray-200 gap-2 h-10 rounded-xl">
                            <Calendar className="w-4 h-4" />
                            {selectedPeriod}
                        </Button>
                        <Button className="bg-[#D4AF37] hover:bg-[#C4A030] text-white gap-2 h-10 rounded-xl font-bold shadow-lg shadow-[#D4AF37]/20">
                            <Download className="w-4 h-4" />
                            Export Report
                        </Button>
                    </div>
                </motion.div>

                {/* Balance Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Paid Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden bg-[#1A2035] rounded-3xl p-8 text-white shadow-xl shadow-[#1A2035]/10"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <Banknote className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/20">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    +12.5%
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Total Paid</p>
                            <h2 className="text-4xl font-bold mb-2 tracking-tight">GHS {totalPaid.toFixed(2)}</h2>
                            <p className="text-white/40 text-xs">Since registration</p>
                        </div>
                    </motion.div>

                    {/* Completed Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100">
                                {completedCount > 0 ? Math.round((completedCount / payments.length) * 100) : 0}% Success
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Completed Transactions</p>
                        <h2 className="text-3xl font-bold text-[#1A2035]">{completedCount}</h2>
                        <p className="text-slate-400 text-xs mt-2">Successful payments processed</p>
                    </motion.div>

                    {/* Pending Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100">
                                In Progress
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Pending Amount</p>
                        <h2 className="text-3xl font-bold text-[#1A2035]">GHS {pendingAmount.toFixed(2)}</h2>
                        <p className="text-slate-400 text-xs mt-2">{pendingCount} transactions processing</p>
                    </motion.div>
                </div>

                {/* Chart and Recent Payments Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Spending Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-[#1A2035]">Spending Overview</h3>
                                <p className="text-sm text-slate-500">Monthly payment trends</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="hover:bg-gray-50 text-slate-400 rounded-lg">
                                    <BarChart3 className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:bg-gray-50 text-slate-400 rounded-lg">
                                    <MoreHorizontal className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="space-y-3">
                            {monthlyData.map((data, index) => (
                                <motion.div
                                    key={data.month}
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: '100%' }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <span className="text-sm font-medium text-slate-400 w-8 group-hover:text-[#1A2035] transition-colors">{data.month}</span>
                                    <div className="flex-1 bg-gray-50 rounded-xl h-10 relative overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(data.amount / maxAmount) * 100}%` }}
                                            transition={{ delay: 0.6 + index * 0.1, duration: 0.8, type: "spring" }}
                                            className="absolute inset-y-0 left-0 bg-[#1A2035] rounded-xl flex items-center justify-end pr-3 group-hover:bg-[#2A3550] transition-colors"
                                        >
                                            {data.amount > 0 && (
                                                <span className="text-xs font-bold text-white/90">
                                                    GHS {data.amount}
                                                </span>
                                            )}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 p-5 bg-gray-50/80 rounded-2xl border border-dashed border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Average Monthly Spend</span>
                                <span className="font-bold text-[#1A2035] text-lg">GHS {(totalPaid / 6).toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6"
                    >
                        <h3 className="text-lg font-bold text-[#1A2035]">Payment Methods</h3>

                        <div className="space-y-4">
                            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 hover:bg-blue-50 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 rounded-lg p-2">
                                            <Smartphone className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">Mobile Money</span>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">65%</span>
                                </div>
                                <div className="h-2 bg-blue-100/50 rounded-full overflow-hidden">
                                    <div className="h-full w-[65%] bg-blue-500 rounded-full"></div>
                                </div>
                            </div>

                            <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100/50 hover:bg-purple-50 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 rounded-lg p-2">
                                            <CreditCard className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">Bank Card</span>
                                    </div>
                                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-md">35%</span>
                                </div>
                                <div className="h-2 bg-purple-100/50 rounded-full overflow-hidden">
                                    <div className="h-full w-[35%] bg-purple-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-bold text-emerald-900">Secure Payments</span>
                            </div>
                            <p className="text-xs text-emerald-700 leading-relaxed opacity-80">
                                256-bit SSL encryption protects all your transactions.
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
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search by purpose or reference..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 bg-white border-gray-200 hover:border-gray-300 focus:border-[#1A2035] rounded-xl shadow-sm"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map((status) => (
                            <Button
                                key={status}
                                variant={filter === status ? 'default' : 'outline'}
                                onClick={() => setFilter(status)}
                                className={`rounded-xl px-5 h-10 font-bold text-xs transition-all ${filter === status
                                    ? 'bg-[#1A2035] text-white shadow-lg shadow-[#1A2035]/20 hover:bg-[#2A3455]'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {/* Transactions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-[#1A2035]">Transaction History</h3>
                            <p className="text-sm text-slate-500">All your payment transactions</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                            <Filter className="w-5 h-5" />
                        </Button>
                    </div>

                    {filteredPayments.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1A2035] mb-2">No Transactions Found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                {filter === 'ALL'
                                    ? "You haven't made any payments yet. All your future transactions will appear here."
                                    : `No ${filter.toLowerCase()} payments found matching your criteria.`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredPayments.map((payment, index) => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.05 }}
                                    className="p-6 hover:bg-gray-50/80 transition-colors group cursor-default"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Left Section */}
                                        <div className="flex items-start sm:items-center gap-5">
                                            <div className={`p-3.5 rounded-2xl flex-shrink-0 border ${payment.status === 'COMPLETED'
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                : payment.status === 'PENDING'
                                                    ? 'bg-amber-50 border-amber-100 text-amber-600'
                                                    : 'bg-rose-50 border-rose-100 text-rose-600'
                                                }`}>
                                                {getPaymentMethodIcon(payment.paymentMethod)}
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-[#1A2035] mb-1.5 group-hover:text-[#D4AF37] transition-colors text-base">
                                                    {payment.purpose}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
                                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{payment.referenceNumber}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 pl-[4.5rem] sm:pl-0">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-[#1A2035] tabular-nums">
                                                    {payment.currency} {payment.amount.toFixed(2)}
                                                </p>
                                                <Badge variant="outline" className={`mt-1 font-bold border ${getStatusColor(payment.status)}`}>
                                                    {payment.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                    {payment.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                                                    {payment.status === 'FAILED' && <XCircle className="w-3 h-3 mr-1" />}
                                                    {payment.status}
                                                </Badge>
                                            </div>

                                            {payment.status === 'COMPLETED' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => downloadReceipt()}
                                                    className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md hover:text-[#D4AF37] transition-all text-slate-400 border border-transparent hover:border-gray-100"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </Button>
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