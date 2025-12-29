import { useState } from 'react';
import {
    FileText,
    ShieldAlert,
    Search,
    Users,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PoliceDashboard() {
    const navigate = useNavigate();
    // Mock Data for Police
    const stats = [
        {
            label: 'Pending Reviews',
            value: '14',
            icon: FileText,
            color: 'text-[#D4AF37]',
            bg: 'bg-[#D4AF37]/10',
            change: '+5 today'
        },
        {
            label: 'Flagged Firearms',
            value: '3',
            icon: ShieldAlert,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            change: 'Critical'
        },
        {
            label: 'New Registrations',
            value: '28',
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            change: 'This week'
        },
    ];

    const recentSubmissions = [
        {
            id: 101,
            applicant: "Kwame Asante",
            type: "New Shotgun License",
            status: "Pending Review",
            date: "Today, 09:30 AM"
        },
        {
            id: 102,
            applicant: "John Doe",
            type: "Renewal",
            status: "Pending Review",
            date: "Today, 08:15 AM"
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Police Command Center</h1>
                    <p className="text-gray-400">
                        Monitoring & Enforcement Dashboard
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-[#1A2035] border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                        <Search className="mr-2 h-4 w-4" /> Global Search
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

            {/* Operations Area */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Review Queue */}
                <Card className="bg-[#1A2035] border-[#D4AF37]/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <FileText className="text-[#D4AF37] h-5 w-5" /> Applications Queue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSubmissions.map((sub, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded bg-black/20 border border-white/5 hover:border-[#D4AF37]/30 cursor-pointer">
                                    <div>
                                        <p className="text-white font-bold text-sm">{sub.applicant}</p>
                                        <p className="text-gray-400 text-xs">{sub.type}</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="text-xs border-[#D4AF37]/30 text-[#D4AF37] h-8">
                                        Review
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-4 bg-[#D4AF37] text-black hover:bg-[#B4941F]">
                            View All Pending
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-red-900/20 to-[#0B1021] border border-red-900/30 flex items-center justify-between group cursor-pointer hover:border-red-500/50 transition-all">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-red-400">Flagged Firearms</h3>
                            <p className="text-sm text-gray-400">View reported lost or stolen items.</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-500 opacity-50 group-hover:opacity-100" />
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-blue-900/20 to-[#0B1021] border border-blue-900/30 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400">Dealer Checks</h3>
                            <p className="text-sm text-gray-400">Inspect dealer inventories and sales.</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500 opacity-50 group-hover:opacity-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}
