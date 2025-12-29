import {
    Package,
    TrendingUp,
    FileCheck,
    Plus,
    ArrowRight,
    DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function DealerDashboard() {
    const navigate = useNavigate();
    // Mock Data for Dealer
    const stats = [
        {
            label: 'Total Inventory',
            value: '145',
            icon: Package,
            color: 'text-[#D4AF37]',
            bg: 'bg-[#D4AF37]/10',
            change: '+12 New'
        },
        {
            label: 'Monthly Sales',
            value: 'GH₵ 45k',
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            change: '+15% vs last mo'
        },
        {
            label: 'Pending Imports',
            value: '2',
            icon: FileCheck,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            change: 'Customs Clearing'
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dealer Portal</h1>
                    <p className="text-gray-400">
                        Manage inventory, sales, and compliance.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                        Import Request
                    </Button>
                    <Button
                        className="bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold"
                        onClick={() => navigate('/dealer/inventory/add')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Inventory
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

            {/* Main Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-[#1A2035] border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all cursor-pointer group" onClick={() => navigate('/dealer/sales')}>
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 group-hover:text-[#D4AF37] transition-colors">
                            <DollarSign className="h-5 w-5" /> RECORD NEW SALE
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-4">Validate buyer license and transfer firearm ownership.</p>
                        <Button className="w-full bg-[#1A2035] border border-[#D4AF37]/30 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                            Start Sale Process <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-[#1A2035] border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all cursor-pointer group" onClick={() => navigate('/dealer/inventory')}>
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 group-hover:text-[#D4AF37] transition-colors">
                            <Package className="h-5 w-5" /> MANAGE INVENTORY
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-4">View stock levels, update firearm details and batch uploads.</p>
                        <Button className="w-full bg-[#1A2035] border border-[#D4AF37]/30 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                            View Inventory <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
