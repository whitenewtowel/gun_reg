import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    IdentificationIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

interface Document {
    url: string;
    doc_id: string;
    stored_name: string;
}

interface Reference {
    full_name: string;
    profession: string;
    phone: string;
    email: string;
    address: string;
    digital_address?: string;
}

interface ApplicationDetail {
    id: string;
    user_id: string;
    firearm_id: string | null;
    application_type: string;
    status: string;
    tracking_id: string;
    region_id: string | null;
    station_id: string | null;
    dealer_id: string | null;
    dealer_status: string;
    permit_expiry_date: string | null;
    permit_data: {
        purpose: string;
        storage_description?: string;
        documents?: {
            [key: string]: Document[]
        };
        references?: Reference[];
        medical_valid?: boolean;
        police_clearance_valid?: boolean;
    };
    submitted_at: string;
    reviewed_at: string | null;
    decision_at: string | null;
    notes: string | null;
    rejection_reason: string | null;
    reviewed_by: string | null;
    created_at: string;
    updated_at: string;
    reviewer: string | null;
}

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchApplicationDetails(id);
        }
    }, [id]);

    const fetchApplicationDetails = async (appId: string) => {
        try {
            const response = await apiClient.get(`/applications/${appId}`);
            // API response structure might be { success: true, data: { ... } }
            // or just the object. usage in list was response.data.data (array).
            // Usually single item endpoint returns { success: true, data: { ... } }
            setApplication(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching application details:', error);
            toast.error('Failed to load application details');
            navigate('/applications');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'text-emerald-800 bg-emerald-100 border-emerald-200 shadow-sm';
            case 'PENDING':
            case 'SUBMITTED': return 'text-amber-800 bg-amber-100 border-amber-200 shadow-sm';
            case 'REJECTED': return 'text-rose-800 bg-rose-100 border-rose-200 shadow-sm';
            case 'UNDER_REVIEW': return 'text-blue-800 bg-blue-100 border-blue-200 shadow-sm';
            default: return 'text-slate-600 bg-slate-100 border-slate-200 shadow-sm';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    if (!application) return null;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header / Back */}
            <button
                onClick={() => navigate('/applications')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#1A2035] transition-colors"
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Applications
            </button>

            {/* Title Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-[#1A2035]">
                            {application.application_type?.replace(/_/g, ' ') || 'Application'}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(application.status)}`}>
                            {application.status?.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <p className="text-gray-500 flex items-center gap-2">
                        <IdentificationIcon className="w-4 h-4" />
                        ID: {application.tracking_id || application.id}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500">Submitted on</p>
                    <p className="text-[#1A2035] font-medium">
                        {new Date(application.submitted_at).toLocaleString(undefined, {
                            dateStyle: 'long',
                            timeStyle: 'short'
                        })}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Purpose Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1A2035] mb-4 flex items-center gap-2">
                            <DocumentTextIcon className="w-5 h-5 text-[#1A2035]" />
                            Application Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500">Purpose</label>
                                <p className="text-[#1A2035] text-lg">
                                    {application.permit_data?.purpose?.replace(/_/g, ' ') || 'N/A'}
                                </p>
                            </div>

                            {application.permit_data?.storage_description && (
                                <div>
                                    <label className="block text-sm text-gray-500">Storage Description</label>
                                    <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {application.permit_data.storage_description}
                                    </p>
                                </div>
                            )}

                            {/* Validations */}
                            <div className="flex gap-4 mt-4">
                                {application.permit_data?.medical_valid !== undefined && (
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${application.permit_data.medical_valid
                                        ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                                        : 'bg-rose-100 border-rose-200 text-rose-800'
                                        }`}>
                                        {application.permit_data.medical_valid ? (
                                            <CheckCircleIcon className="w-4 h-4" />
                                        ) : (
                                            <XCircleIcon className="w-4 h-4" />
                                        )}
                                        <span className="text-sm font-medium">Medical Valid</span>
                                    </div>
                                )}

                                {application.permit_data?.police_clearance_valid !== undefined && (
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${application.permit_data.police_clearance_valid
                                        ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                                        : 'bg-rose-100 border-rose-200 text-rose-800'
                                        }`}>
                                        {application.permit_data.police_clearance_valid ? (
                                            <CheckCircleIcon className="w-4 h-4" />
                                        ) : (
                                            <XCircleIcon className="w-4 h-4" />
                                        )}
                                        <span className="text-sm font-medium">Police Clearance Valid</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    {application.permit_data?.documents && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[#1A2035] mb-4 flex items-center gap-2">
                                <DocumentTextIcon className="w-5 h-5 text-[#1A2035]" />
                                Submitted Documents
                            </h3>
                            <div className="grid gap-3">
                                {Object.entries(application.permit_data.documents).map(([key, docs]) => (
                                    <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                                            {key.replace(/_/g, ' ')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {docs.map((doc, idx) => (
                                                <a
                                                    key={idx}
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 border border-blue-200 truncate max-w-[200px]"
                                                >
                                                    {doc.stored_name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* References Section */}
                    {application.permit_data?.references && application.permit_data.references.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[#1A2035] mb-4 flex items-center gap-2">
                                <UserGroupIcon className="w-5 h-5 text-[#1A2035]" />
                                References
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {application.permit_data.references.map((ref, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="font-bold text-[#1A2035]">{ref.full_name}</p>
                                        <p className="text-sm text-gray-500 mb-2">{ref.profession}</p>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>{ref.phone}</p>
                                            <p>{ref.email}</p>
                                            <p>{ref.address}</p>
                                            {ref.digital_address && <p>{ref.digital_address}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Status & Timeline */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1A2035] mb-4">Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                {application.status === 'APPROVED' ? (
                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                ) : application.status === 'REJECTED' ? (
                                    <XCircleIcon className="w-6 h-6 text-red-500" />
                                ) : (
                                    <ClockIcon className="w-6 h-6 text-[#1A2035]" />
                                )}
                                <div>
                                    <p className="text-[#1A2035] font-medium capitalize">
                                        {application.status?.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Last Updated: {new Date(application.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {application.rejection_reason && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                    <p className="font-bold">Reason for Rejection:</p>
                                    {application.rejection_reason}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
