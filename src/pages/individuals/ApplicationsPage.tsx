import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    PlusIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';

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
            // API returns { success: true, data: [...] }
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
            // Fallback to mock data on error (for dev)
            setApplications([
                {
                    id: '1',
                    type: 'PERMIT_TO_PURCHASE',
                    status: 'SUBMITTED',
                    submittedAt: '2024-12-20T10:00:00Z',
                    updatedAt: '2024-12-20T10:00:00Z',
                    purpose: 'PERSONAL_SECURITY',
                    trackingId: 'PMT-2024-001'
                },
                {
                    id: '2',
                    type: 'LICENSE_RENEWAL',
                    status: 'APPROVED',
                    submittedAt: '2024-11-15T14:30:00Z',
                    updatedAt: '2024-11-20T09:15:00Z',
                    trackingId: 'LIC-2024-889'
                }
            ]);
            // toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'PENDING':
            case 'SUBMITTED':
                return 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30';
            case 'REJECTED':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'UNDER_REVIEW':
                return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'PENDING':
            case 'SUBMITTED':
            case 'UNDER_REVIEW':
                return <ClockIcon className="w-5 h-5" />;
            case 'REJECTED':
                return <XCircleIcon className="w-5 h-5" />;
            default:
                return <DocumentTextIcon className="w-5 h-5" />;
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'ALL') return true;
        return app.status === filter;
    });

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
                    <p className="text-gray-400">Track and manage your firearm permit applications</p>
                </div>
                <button
                    onClick={() => navigate('/complete-applications')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F] transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Application
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 p-4 bg-[#1A2035] border border-white/10 rounded-lg">
                <FunnelIcon className="w-5 h-5 text-[#D4AF37]" />
                <div className="flex gap-2 flex-wrap">
                    {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
                <div className="text-center py-16 bg-[#1A2035] border border-white/10 rounded-lg">
                    <DocumentTextIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Applications Found</h3>
                    <p className="text-gray-400 mb-6">
                        {filter === 'ALL'
                            ? "You haven't submitted any applications yet"
                            : `No ${filter.toLowerCase()} applications`
                        }
                    </p>
                    <button
                        onClick={() => navigate('/complete-applications')}
                        className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F]"
                    >
                        Submit Your First Application
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredApplications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1A2035] border border-white/10 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 flex-1">
                                    <div className={`p-3 rounded-lg ${getStatusColor(app.status)}`}>
                                        {getStatusIcon(app.status)}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                                            {app.type.replace(/_/g, ' ')}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Application ID: {app.trackingId || app.id}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Submitted:</span>
                                                <span className="text-white ml-2">
                                                    {new Date(app.submittedAt).toLocaleDateString('en-GB')}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Last Updated:</span>
                                                <span className="text-white ml-2">
                                                    {new Date(app.updatedAt).toLocaleDateString('en-GB')}
                                                </span>
                                            </div>
                                            {app.purpose && (
                                                <div>
                                                    <span className="text-gray-500">Purpose:</span>
                                                    <span className="text-white ml-2">
                                                        {app.purpose.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${getStatusColor(app.status)}`}>
                                        {app.status.replace('_', ' ')}
                                    </span>

                                    <button
                                        onClick={() => navigate(`/applications/${app.id}`)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-[#D4AF37] rounded hover:bg-white/10 transition-colors"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
