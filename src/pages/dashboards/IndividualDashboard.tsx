import { useEffect, useState } from 'react';
// Refactored Dashboard Components
import {
    Plus,
    FileCheck,
    Search,
    Filter,
    FileText,
    ShieldCheck,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@/services/dashboardService';
import apiClient from '@/lib/apiClient';
import type { DashboardData, ApiAcquisition } from '@/types';
import { cn } from '@/lib/utils';

// --- Components for Folder Design ---

const FolderCard = ({
    label,
    value,
    icon: Icon,
    color = "bg-white",
    textColor = "text-[#1A2035]",
    subtext,
    trend
}: any) => {
    return (
        <div className="relative group hover:-translate-y-1 transition-transform duration-300">
            {/* Folder Tab */}
            <div className={`absolute -top-8 left-0 h-10 w-28 rounded-l-lg z-0 ${color} shadow-sm group-hover:shadow-md transition-all`}
                style={{ clipPath: 'polygon(0 0, 70% 0, 100% 100%, 0 100%)' }}>
            </div>

            {/* Folder Body */}
            <div className={`relative z-10 w-full rounded-b-2xl rounded-tr-2xl p-6 shadow-sm group-hover:shadow-lg transition-all ${color} border-[1px] border-black/5`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-black/5 rounded-lg">
                        <Icon className={`h-6 w-6 ${textColor}`} />
                    </div>
                    {trend && (
                        <Badge variant="secondary" className="bg-gray-800/50 hover:bg-black/10 text-xs font-medium">
                            {trend}
                        </Badge>
                    )}
                </div>
                <div>
                    <h3 className={`text-4xl font-extrabold tracking-tight mb-1 ${textColor}`}>
                        {value}
                    </h3>
                    <p className={`text-sm font-semibold opacity-70 ${textColor}`}>
                        {label}
                    </p>
                    {subtext && (
                        <p className={`text-xs mt-2 opacity-50 font-medium ${textColor}`}>
                            {subtext}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Slanted Tabs Component ---

const SlantedTabs = ({ tabs, activeTab, onTabChange }: any) => {
    return (
        <div className="flex items-end  overflow-x-auto no-scrollbar">
            {tabs.map((tab: string) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={cn(
                        "relative px-8 rounded-sm py-3 bg-gray-100 text-gray-500 font-bold text-sm transition-all duration-200 hover:text-[#1A2035] -ml-4 first:ml-0 z-0",
                        "hover:z-10 focus:outline-none",
                        activeTab === tab && "z-20 text-[#1A2035] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
                    )}
                    style={{
                        clipPath: 'polygon(0% 0, 90% 0, 100% 100%, 0% 100%)', // Slanted shape
                        paddingLeft: '2.5rem',
                        paddingRight: '2.5rem',
                        marginRight: '0.5rem'
                    }}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default function IndividualDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [acquisitions, setAcquisitions] = useState<ApiAcquisition[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Recent Work');

    // Safety check for user object
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Use allSettled to allow partial success (e.g., if one endpoint hits 429)
                const [dashboardResult, acquisitionsResult] = await Promise.allSettled([
                    dashboardService.getDashboardData(),
                    apiClient.get('/acquisitions/me')
                ]);

                if (dashboardResult.status === 'fulfilled' && dashboardResult.value.success) {
                    const dashboardData = dashboardResult.value.data;

                    // Parse acquisitions if successful
                    if (acquisitionsResult.status === 'fulfilled' && acquisitionsResult.value.data.success) {
                        const acqRes = acquisitionsResult.value;
                        const acqData = acqRes.data.data || [];

                        const acqList = Array.isArray(acqData) ? acqData : (acqData.data || []);
                        setAcquisitions(acqList);

                        const pendingAcquisitions = acqList.filter((acq: any) =>
                            ['INITIATED', 'PENDING_PAYMENT', 'PENDING_DEALER_APPROVAL'].includes(acq.status)
                        ).length;

                        if (dashboardData.summary) {
                            dashboardData.summary.pending_applications = (dashboardData.summary.pending_applications || 0) + pendingAcquisitions;
                        }
                    }

                    setData(dashboardData);
                }
                // We don't need to explicitly handle the rejected case since the interceptor will show the toast
                // And loading state will be cleared finally

            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const stats = [
        {
            label: 'Total Firearms',
            value: data?.summary?.total_firearms ?? 0,
            icon: ShieldCheck,
            color: 'bg-[#1A2035]',
            textColor: 'text-white',
            subtext: 'Registered & Active',
            trend: ''
        },
        {
            label: 'Total Applications',
            value: data?.summary?.total_applications ?? 0,
            icon: FileCheck,
            color: 'bg-blue-700',
            textColor: 'text-white',
            subtext: 'Submitted',
            trend: ''
        },
        {
            label: 'Pending',
            value: data?.summary?.pending_applications ?? 0,
            icon: Clock,
            color: 'bg-white',
            textColor: 'text-orange-600',
            subtext: 'In Processing',
            trend: ''
        },
        {
            label: 'Approved',
            value: data?.summary?.approved_applications ?? 0,
            icon: FileCheck, // Reusing icon or AlertCircle if preferred
            color: 'bg-white',
            textColor: 'text-green-600',
            subtext: 'Applications',
            trend: ''
        }
    ];

    const activityApplications = data?.recent_resources?.applications?.map(app => ({
        id: app.tracking_id || (app.id ? app.id.substring(0, 8).toUpperCase() : 'APP'),
        title: `${app.type.replace(/_/g, ' ')}`,
        course: "Application",
        updateTime: app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'Draft',
        timestamp: app.submitted_at ? new Date(app.submitted_at).getTime() : 0,
        status: app.status,
    })) || [];

    const activityAcquisitions = acquisitions.map(acq => ({
        id: `PO-${acq.id.substring(0, 8).toUpperCase()}`,
        title: `${acq.firearm?.model || 'Firearm'} Purchase`,
        course: "Acquisition",
        updateTime: new Date(acq.created_at).toLocaleDateString(),
        timestamp: new Date(acq.created_at).getTime(),
        status: acq.status,
    }));

    const recentActivity = [...activityApplications, ...activityAcquisitions]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            APPROVED: "text-emerald-800 bg-emerald-100 border-emerald-200 shadow-sm",
            IN_REVIEW: "text-blue-800 bg-blue-100 border-blue-200 shadow-sm",
            UNDER_REVIEW: "text-blue-800 bg-blue-100 border-blue-200 shadow-sm",
            PENDING: "text-amber-800 bg-amber-100 border-amber-200 shadow-sm",
            SUBMITTED: "text-amber-800 bg-amber-100 border-amber-200 shadow-sm",
            PENDING_PAYMENT: "text-amber-800 bg-amber-100 border-amber-200 shadow-sm",
            INITIATED: "text-purple-800 bg-purple-100 border-purple-200 shadow-sm",
            REJECTED: "text-rose-800 bg-rose-100 border-rose-200 shadow-sm",
            // Add other statuses as needed
        };

        const style = styles[status] || "text-slate-600 bg-slate-100 border-slate-200 shadow-sm";

        return (
            <Badge variant="outline" className={`${style} hover:${style.split(' ')[1]} border`}>
                {status.replace(/_/g, ' ')}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2035]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 max-w-[87rem] mx-auto font-sans bg-white/0">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#1A2035] tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Welcome back, {user?.firstName}. Overview of your firearms status.
                    </p>
                </div>

            </div>

            {/* Folder Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 pt-6">
                {stats.map((stat, i) => (
                    <FolderCard key={i} {...stat} />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                {/* Slanted Table Section (Left 2/3) */}
                <div className="lg:col-span-2 space-y-0">
                    {/* Tab Navigation */}
                    <SlantedTabs
                        tabs={['Recent Work', 'Daily Practice', 'Public Courses', 'Cancel Work']}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Content Container */}
                    <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">

                        {/* Table Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search Work Name..."
                                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="rounded-xl border-gray-200">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                                <Button className="bg-[#1A2035] text-white rounded-xl shadow-lg shadow-[#1A2035]/20 hover:bg-[#2A3455]">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Styled Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Work Name</th>
                                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Update Time</th>
                                        <th className="text-center py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="text-right py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Operate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentActivity.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-[#1A2035]">{item.title}</div>
                                                <div className="text-xs text-gray-400">{item.id}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="font-semibold text-gray-600">{item.course}</div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-500 font-mono">
                                                {item.updateTime}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {getStatusBadge(item.status === 'PENDING_REVIEW' ? 'PENDING' : item.status)}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="h-8 text-[#1A2035] hover:bg-white border border-transparent hover:border-gray-200">
                                                        Details
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Mock */}
                        <div className="flex justify-center mt-8 gap-2">
                            {[1, 2, 3].map(page => (
                                <button key={page} className={`h-8 w-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${page === 1 ? 'bg-[#1A2035] text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}>
                                    {page}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[#1A2035] rounded-3xl p-6 text-white shadow-xl shadow-[#1A2035]/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">New License</h3>
                            <p className="opacity-70 text-sm mb-6">Apply for a new firearm license efficiently.</p>
                            <Button
                                className="w-full bg-white text-[#1A2035] hover:bg-gray-100 font-bold rounded-xl border-none"
                                onClick={() => navigate('/applications/new')}
                            >
                                Start Application
                            </Button>
                        </div>
                        <FileText className="absolute -bottom-4 -right-4 h-32 w-32 text-white/5 rotate-12" />
                    </div>

                    <div className="bg-[#1A2035] rounded-3xl p-6 text-white shadow-xl shadow-[#1A2035]/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Find Dealers</h3>
                            <p className="opacity-70 text-sm mb-6">Locate verified firearm dealers near you.</p>
                            <Button
                                className="w-full bg-white text-[#1A2035] hover:bg-gray-100 font-bold rounded-xl border-none"
                                onClick={() => navigate('/dealers')}
                            >
                                View Directory
                            </Button>
                        </div>
                        <Search className="absolute -bottom-4 -right-4 h-32 w-32 text-white/5 rotate-12" />
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[#1A2035]">Your Firearms</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-gray-400 hover:text-[#1A2035]"
                                onClick={() => navigate('/firearms')}
                            >
                                View All
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {data?.recent_resources?.firearms?.length ? data.recent_resources.firearms.slice(0, 3).map((firearm, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <ShieldCheck className="h-5 w-5 text-[#1A2035]" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm text-[#1A2035] truncate">{firearm.model} - {firearm.type}</p>
                                        <p className="text-xs text-gray-400 truncate">{firearm.serial_number}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500">No firearms found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
