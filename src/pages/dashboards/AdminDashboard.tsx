import {
    Users,
    Settings,
    BarChart3,

    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function AdminDashboard() {

    const stats = [
        {
            label: 'Total Users',
            value: '1,234',
            icon: Users,
            color: 'text-[#D4AF37]',
            bg: 'bg-[#D4AF37]/10',
            change: '+45 this week'
        },
        {
            label: 'System Health',
            value: '99.9%',
            icon: Settings,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            change: 'All systems operational'
        },
        {
            label: 'Security Alerts',
            value: '0',
            icon: ShieldAlert,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            change: 'No active threats'
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Console</h1>
                    <p className="text-gray-400">
                        System Administration & Oversight
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                        <BarChart3 className="mr-2 h-4 w-4" /> Generate Report
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
                        <Card className="bg-[#1A2035] border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    {stat.label}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
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

            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-[#1A2035] border-[#D4AF37]/10">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Audit Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <div className="text-gray-300">
                                        <span className="text-[#D4AF37] font-bold">Admin</span> updated system policy.
                                    </div>
                                    <div className="text-gray-500 text-xs">2 mins ago</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1A2035] border-[#D4AF37]/10">
                    <CardHeader>
                        <CardTitle className="text-white">User Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-start text-left bg-black/20 hover:bg-black/40 border border-white/5">
                            <Users className="mr-2 h-4 w-4 text-blue-500" /> Manage Staff Access
                        </Button>
                        <Button className="w-full justify-start text-left bg-black/20 hover:bg-black/40 border border-white/5">
                            <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> Security Policies
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
