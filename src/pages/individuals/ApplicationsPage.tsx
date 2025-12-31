import { useState, useEffect } from 'react';
import {
    Plus,
    FileCheck,
    AlertCircle,
    Search,
    Filter,
    FileText,
    ShieldCheck,
    Clock,
    XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { StatsCard } from '@/components/ui/stats-card';

// --- Reused Components (To be refactored into shared UI later) ---



const SlantedTabs = ({ tabs, activeTab, onTabChange }: any) => {
    return (
        <div className="flex items-end overflow-x-auto no-scrollbar">
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
                    {tab.replace('_', ' ')}
                </button>
            ))}
        </div>
    );
};

interface Application {
    id: string;
    type: string;
    status: string;
    submittedAt: string;
    updatedAt: string;
    purpose?: string;
    trackingId?: string;
}

export default function ApplicationsPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await apiClient.get('/applications/my');
            const apiData = response.data.data || [];

            const mappedApplications = apiData.map((app: any) => ({
                id: app.id,
                type: app.application_type,
                status: app.status,
                submittedAt: app.submitted_at,
                updatedAt: app.updated_at,
                purpose: app.permit_data?.purpose,
                trackingId: app.tracking_id
            }));

            setApplications(mappedApplications);
        } catch (error) {
            console.error('Error fetching applications:', error);
            // Fallback for dev/demo
            setApplications([
                { id: '1', type: 'PERMIT_TO_PURCHASE', status: 'SUBMITTED', submittedAt: '2024-12-20T10:00:00Z', updatedAt: '2024-12-20T10:00:00Z', purpose: 'PERSONAL_SECURITY', trackingId: 'PMT-2024-001' },
                { id: '2', type: 'LICENSE_RENEWAL', status: 'APPROVED', submittedAt: '2024-11-15T14:30:00Z', updatedAt: '2024-11-20T09:15:00Z', trackingId: 'LIC-2024-889' },
                { id: '3', type: 'FIREARM_REGISTRATION', status: 'REJECTED', submittedAt: '2024-10-05T09:00:00Z', updatedAt: '2024-10-10T16:45:00Z', trackingId: 'REG-2024-112' },
                { id: '4', type: 'AMMUNITION_REQUEST', status: 'PENDING', submittedAt: '2025-01-02T11:20:00Z', updatedAt: '2025-01-02T11:20:00Z', trackingId: 'AMM-2025-044' }
            ]);
            toast.error('Using offline data');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredApplications = applications.filter(app => {
        if (filter === 'ALL') return true;
        return app.status === filter;
    });

    // --- Stats Data ---
    const stats: { title: string; value: string; icon: any; change: string; changeType: 'positive' | 'negative' }[] = [
        {
            title: 'Total Applications',
            value: applications.length.toString(),
            icon: FileText,
            change: '+12.5%',
            changeType: 'positive'
        },
        {
            title: 'Approved',
            value: applications.filter(a => a.status === 'APPROVED').length.toString(),
            icon: FileCheck,
            change: '+5.2%',
            changeType: 'positive'
        },
        {
            title: 'Pending Review',
            value: applications.filter(a => ['PENDING', 'SUBMITTED', 'UNDER_REVIEW'].includes(a.status)).length.toString(),
            icon: Clock,
            change: '-2.1%',
            changeType: 'negative'
        },
        {
            title: 'Issues / Rejected',
            value: applications.filter(a => a.status === 'REJECTED').length.toString(),
            icon: XCircle,
            change: '+0.0%',
            changeType: 'positive'
        }
    ];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            APPROVED: "bg-green-100 text-green-700 border-green-200",
            IN_REVIEW: "bg-blue-100 text-blue-700 border-blue-200",
            UNDER_REVIEW: "bg-blue-100 text-blue-700 border-blue-200",
            PENDING: "bg-orange-100 text-orange-700 border-orange-200",
            SUBMITTED: "bg-orange-100 text-orange-700 border-orange-200",
            REJECTED: "bg-red-100 text-red-700 border-red-200",
        };
        return <Badge className={`${styles[status] || "bg-gray-100"} hover:bg-white`}>{status.replace(/_/g, ' ')}</Badge>;
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
                        My Applications
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Track and manage all your firearm permit requests.
                    </p>
                </div>
                <div>
                    <Button
                        onClick={() => navigate('/complete-applications')}
                        className="bg-[#1A2035] hover:bg-[#2A3455] text-white rounded-xl px-5 shadow-lg shadow-[#1A2035]/20 font-bold"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        New Application
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <StatsCard
                            key={i}
                            title={stat.title}
                            value={stat.value}
                            icon={<Icon className="h-4 w-4 text-muted-foreground" />}
                            change={stat.change}
                            changeType={stat.changeType}
                        />
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="mt-8">
                {/* Tab Navigation */}
                <SlantedTabs
                    tabs={['ALL', 'SUBMITTED', 'APPROVED', 'REJECTED']}
                    activeTab={filter}
                    onTabChange={setFilter}
                />

                {/* Content Container */}
                <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">

                    {/* Table Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or Type..."
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl border-gray-200 text-[#1A2035]">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="ghost" className="text-[#1A2035] hover:bg-gray-50">
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {/* Styled Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Application Type</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tracking ID</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Updated</th>
                                    <th className="text-center py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-right py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app, idx) => (
                                        <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-[#1A2035]">{app.type.replace(/_/g, ' ')}</div>
                                                <div className="text-xs text-gray-400 font-medium">{app.purpose?.replace(/_/g, ' ')}</div>
                                            </td>
                                            <td className="py-4 px-4 text-sm font-mono text-gray-500">
                                                {app.trackingId || app.id}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(app.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {getStatusBadge(app.status)}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-[#1A2035] hover:bg-white border border-transparent hover:border-gray-200"
                                                    onClick={() => navigate(`/applications/${app.id}`)}
                                                >
                                                    Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-500">
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Mock */}
                    {filteredApplications.length > 0 && (
                        <div className="flex justify-center mt-8 gap-2">
                            {[1].map(page => (
                                <button key={page} className={`h-8 w-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${page === 1 ? 'bg-[#1A2035] text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}>
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
