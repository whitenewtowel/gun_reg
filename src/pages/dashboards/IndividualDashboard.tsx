import { useEffect, useState } from 'react';
import {
    FileText,
    ShieldCheck,
    AlertTriangle,
    Clock,
    CheckCircle2,
    Plus,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardData } from '@/types';

export default function IndividualDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const response = await dashboardService.getDashboardData();
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Mock data for display if API returns nothing (or during development)
    const stats = [
        {
            label: 'Active Licenses',
            value: data?.summary?.activeLicences ?? 2,
            icon: ShieldCheck,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            change: '+1 Approved'
        },
        {
            label: 'Pending Applications',
            value: data?.summary?.pendingApplications ?? 1,
            icon: FileText,
            color: 'text-[#D4AF37]',
            bg: 'bg-[#D4AF37]/10',
            change: 'In Review'
        },
        {
            label: 'Expiring Soon',
            value: data?.summary?.expiringLicences ?? 0,
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            change: 'Action Needed'
        },
    ];

    const recentActivity = data?.recentApplications?.length ? data.recentApplications.map(app => ({
        id: app.id,
        type: 'Application',
        title: `${app.type.replace('_', ' ')} Application`,
        status: app.status,
        date: new Date(app.updatedAt).toLocaleDateString(),
        icon: FileText,
        statusColor: app.status === 'APPROVED' ? 'text-green-500' : 'text-[#D4AF37]'
    })) : [
        {
            id: 1,
            type: 'Application',
            title: 'Shotgun License Application',
            status: 'In Review',
            date: '2 hours ago',
            icon: Clock,
            statusColor: 'text-[#D4AF37]'
        },
        {
            id: 2,
            type: 'License',
            title: 'Handgun License Renewal',
            status: 'Approved',
            date: '2 days ago',
            icon: CheckCircle2,
            statusColor: 'text-green-500'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                        System Operational • {new Date().toLocaleDateString('en-GH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60">
                        <Clock className="mr-2 h-4 w-4" /> History
                    </Button>
                    <Button
                        className="bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold shadow-lg shadow-[#D4AF37]/20"
                        onClick={() => navigate('/applications/new')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Application
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-[#1A2035] border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-300 group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                                    {stat.label}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bg} group-hover:bg-opacity-20 transition-all`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <p className="text-xs text-gray-500">{stat.change}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock className="h-5 w-5 text-[#D4AF37]" />
                            Recent Activity
                        </h2>
                        <Button variant="link" className="text-[#D4AF37] hover:text-[#B4941F] p-0">View All</Button>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.map((item) => (
                            <Card key={item.id} className="bg-[#1A2035] border-[#D4AF37]/10 hover:bg-[#1E2540] hover:border-[#D4AF37]/30 transition-all cursor-pointer group">
                                <div className="p-4 flex items-center gap-4">
                                    <div className={`mt-1 p-2 rounded-full bg-black/30 ${item.statusColor} border border-white/5 group-hover:border-[#D4AF37]/20`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs ${item.statusColor} font-medium px-2 py-0.5 rounded bg-white/5`}>{item.status}</span>
                                            <span className="text-xs text-gray-500">• {item.date}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions (Large Cards) */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                        <div
                            onClick={() => navigate('/applications/new')}
                            className="bg-gradient-to-br from-[#1A2035] to-[#0B1021] border border-[#D4AF37]/10 rounded-xl p-6 relative overflow-hidden group cursor-pointer hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <FileText className="h-32 w-32 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10 group-hover:text-[#D4AF37] transition-colors">Start New Application</h3>
                            <p className="text-sm text-gray-400 mb-4 relative z-10">Apply for a shotgun, handgun, or rifle license securely online.</p>
                            <span className="text-[#D4AF37] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Begin Now <ArrowRight className="h-4 w-4" />
                            </span>
                        </div>

                        <div className="bg-gradient-to-br from-[#1A2035] to-[#0B1021] border border-red-900/20 rounded-xl p-6 relative overflow-hidden group cursor-pointer hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <AlertTriangle className="h-32 w-32 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10 group-hover:text-red-400 transition-colors">Report Lost/Stolen</h3>
                            <p className="text-sm text-gray-400 mb-4 relative z-10">Immediately report missing firearms to valid authorities.</p>
                            <span className="text-red-500 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Report Issue <ArrowRight className="h-4 w-4" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Registered Firearms Mini-List */}
                <div className="lg:col-span-1">
                    <Card className="bg-[#1A2035] border-[#D4AF37]/10 h-full hover:border-[#D4AF37]/30 transition-colors">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                                Your Firearms
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {data?.firearms?.length ? (
                                <div className="space-y-4">
                                    {data.firearms.map((firearm) => (
                                        <div key={firearm.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                                            <ShieldCheck className="h-8 w-8 text-gray-600" />
                                            <div>
                                                <p className="text-sm font-bold text-white">{firearm.make} {firearm.model}</p>
                                                <p className="text-xs text-green-500">{firearm.status} • SN: {firearm.serialNumber}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-[#0B1021] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                                        <ShieldCheck className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-white font-medium mb-1">No Firearms Registered</h3>
                                    <p className="text-sm text-gray-500 mb-6">You haven't registered any firearms yet.</p>
                                    <Button variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                                        Register Firearm
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
