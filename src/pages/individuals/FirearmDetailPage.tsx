import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { ApiFirearm, ApiLicence } from '@/types';
import {
    ArrowLeftIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    UserIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useReportStolen } from '@/hooks/useReportStolen';
import { useReportLost } from '@/hooks/useReportLost';
import { ReportStolenModal } from '@/components/firearms/ReportStolenModal';
import { ReportLostModal } from '@/components/firearms/ReportLostModal';

export default function FirearmDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const stateFirearm = location.state?.firearm as ApiFirearm | undefined;

    const [firearm, setFirearm] = useState<ApiFirearm | null>(stateFirearm || null);
    const [licences, setLicences] = useState<ApiLicence[]>(
        stateFirearm?.licences?.sort((a: ApiLicence, b: ApiLicence) => new Date(b.issued_date || '1970-01-01').getTime() - new Date(a.issued_date || '1970-01-01').getTime()) || []
    );
    const [loading, setLoading] = useState(!stateFirearm);
    const [error, setError] = useState('');

    const fetchFirearm = async () => {
        if (!id) return;
        if (!stateFirearm) setLoading(true);

        try {
            // We need serial number for licence status check
            let serialNumber = stateFirearm?.serial_number;
            let firearmDetails = stateFirearm;

            // 1. Fetch Firearm details (always needed for complete history)
            // If we don't have serialNumber, we must await this first.
            const firearmPromise = apiClient.get<{ success: boolean, data: ApiFirearm }>(`/firearms/${id}`);

            if (!serialNumber) {
                const res = await firearmPromise;
                if (res.data.success) {
                    firearmDetails = res.data.data;
                    setFirearm(firearmDetails);
                    serialNumber = firearmDetails.serial_number;
                } else {
                    throw new Error('Failed to load firearm details');
                }
            } else {
                // We can fetch parallel if we have serial number
                firearmPromise.then(res => {
                    if (res.data.success) {
                        const details = res.data.data;
                        // Preserve licences from state if available/needed
                        if (stateFirearm?.licences) {
                            details.licences = stateFirearm.licences;
                        }
                        setFirearm(details);
                    }
                });
            }

            // 2. Fetch Licence Status if not already present in state
            const hasStateLicences = stateFirearm?.licences && stateFirearm.licences.length > 0;

            console.log('[FirearmDetailPage] Licence fetch decision:', {
                hasStateLicences,
                serialNumber,
                willFetch: !hasStateLicences && !!serialNumber
            });

            if (!hasStateLicences && serialNumber) {
                console.log('[FirearmDetailPage] Fetching licences from /licences/status?serial_number=' + serialNumber);
                const licenceRes = await apiClient.get<{ success: boolean, data: ApiLicence[] | ApiLicence }>(`/licences/status?serial_number=${serialNumber}`);

                if (licenceRes.data.success) {
                    console.log('[FirearmDetailPage] Licence fetch successful:', licenceRes.data.data);
                    const data = licenceRes.data.data;
                    const list = Array.isArray(data) ? data : [data];
                    // Sort by newest
                    list.sort((a, b) => new Date(b.issued_date).getTime() - new Date(a.issued_date).getTime());
                    setLicences(list);
                }
            } else {
                console.log('[FirearmDetailPage] Skipping licence fetch - using state data');
            }

        } catch (err) {
            console.error(err);
            if (!stateFirearm) setError('Error loading firearm details');
        } finally {
            setLoading(false);
        }
    };

    const reportStolen = useReportStolen(fetchFirearm);
    const reportLost = useReportLost(fetchFirearm);

    useEffect(() => {
        fetchFirearm();
    }, [id]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm hover:bg-emerald-100 border';
            case 'EXPIRED': return 'bg-rose-100 text-rose-800 border-rose-200 shadow-sm hover:bg-rose-100 border';
            case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm hover:bg-amber-100 border';
            default: return 'bg-slate-100 text-slate-800 border-slate-200 shadow-sm hover:bg-slate-100 border';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2035]"></div>
            </div>
        );
    }

    if (error || !firearm) {
        return (
            <div className="text-center py-12">
                <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                <h2 className="text-lg font-bold text-gray-900">{error || 'Firearm not found'}</h2>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/firearms')}>
                    Return to List
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div>
                <Button variant="ghost" className="pl-0 hover:bg-transparent mb-4" onClick={() => navigate('/firearms')}>
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Firearms
                </Button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1A2035]">{firearm.model}</h1>
                        <p className="text-gray-500 font-mono mt-1">Serial: {firearm.serial_number}</p>
                    </div>
                    <Badge className={`text-base px-4 py-1.5 w-fit ${getStatusStyles(firearm.status)}`}>
                        {firearm.status}
                    </Badge>
                </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Specifications Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                        <h2 className="text-lg font-bold text-[#1A2035]">Specs & Details</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-y-6">
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Type</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">{firearm.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Calibre</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">{firearm.calibre}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Registered</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                {format(new Date(firearm.created_at), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Last Updated</p>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                {format(new Date(firearm.updated_at), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions Card */}
                <div className="bg-[#1A2035] rounded-2xl p-6 text-white shadow-lg shadow-blue-900/10 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold">Quick Actions</h2>
                            <p className="text-white/60 text-sm mt-1">Manage this firearm registration</p>
                        </div>

                        <div className="space-y-3">
                            {firearm.status === 'EXPIRED' && (
                                <Button className="w-full bg-white text-[#1A2035] hover:bg-gray-100 font-bold" onClick={() => navigate(`/applications/renew/${firearm.id}`)}>
                                    Renew License
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                className="w-full bg-red-600 hover:bg-red-700 text-white border-none"
                                onClick={() => reportStolen.openModal(firearm)}
                            >
                                <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                                Report Stolen
                            </Button>
                            <Button
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none"
                                onClick={() => reportLost.openModal(firearm)}
                            >
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                Report Lost
                            </Button>
                        </div>
                    </div>
                    <ShieldCheckIcon className="absolute -bottom-8 -right-8 h-48 w-48 text-white/5 rotate-12" />
                </div>
            </div>

            {/* Licences History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                    <DocumentTextIcon className="h-6 w-6 text-green-600" />
                    <h2 className="text-lg font-bold text-[#1A2035]">Licence History</h2>
                </div>

                {licences && licences.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase border-b border-gray-50">
                                    <th className="font-semibold py-3 pl-4">Issued Date</th>
                                    <th className="font-semibold py-3">Expiry Date</th>
                                    <th className="font-semibold py-3">Type</th>
                                    <th className="font-semibold py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {licences.map((lic) => (
                                    <tr key={lic.id} className="hover:bg-gray-50/50">
                                        <td className="py-4 pl-4 text-sm font-medium text-gray-900">
                                            {format(new Date(lic.issued_date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="py-4 text-sm text-gray-500">
                                            {format(new Date(lic.expiry_date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="py-4 text-sm text-gray-900">
                                            <Badge variant="outline" className="font-normal">{lic.application_type.replace('_', ' ')}</Badge>
                                        </td>
                                        <td className="py-4">
                                            <Badge className={`text-xs ${getStatusStyles(lic.status)}`}>
                                                {lic.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <ClockIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No licence history available.</p>
                    </div>
                )}
            </div>

            {/* Ownership History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                    <UserIcon className="h-6 w-6 text-purple-600" />
                    <h2 className="text-lg font-bold text-[#1A2035]">Ownership History</h2>
                </div>

                {firearm.ownership_history && firearm.ownership_history.length > 0 ? (
                    <div className="space-y-6">
                        {firearm.ownership_history.map((history, index) => (
                            <div key={history.id} className="flex gap-4 relative">
                                {index !== firearm.ownership_history!.length - 1 && (
                                    <div className="absolute left-2.5 top-8 bottom-[-24px] w-0.5 bg-gray-100"></div>
                                )}
                                <div className="mt-1 h-5 w-5 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                    <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                                </div>
                                <div className="flex-1 pb-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                        <p className="text-sm font-bold text-gray-900">{history.transfer_type}</p>
                                        <span className="text-xs text-gray-500">{format(new Date(history.created_at), 'MMM d, yyyy - h:mm a')}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {history.from_user && <span className="text-gray-900 font-medium">From: {history.from_user.email}</span>}
                                        {history.from_user && history.to_user && <span className="mx-2 text-gray-400">→</span>}
                                        {history.to_user && <span className="text-gray-900 font-medium">To: {history.to_user.email}</span>}
                                    </div>
                                    {history.notes && (
                                        <p className="text-xs text-gray-500 mt-1 italic">"{history.notes}"</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <ClockIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No ownership history available.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ReportStolenModal
                isOpen={reportStolen.isOpen}
                onClose={reportStolen.closeModal}
                firearmModel={reportStolen.selectedFirearm?.model}
                firearmSerial={reportStolen.selectedFirearm?.serial_number}
                form={reportStolen.form}
                onFormChange={reportStolen.updateForm}
                onSubmit={reportStolen.submitReport}
                isSubmitting={reportStolen.isSubmitting}
                isFormValid={reportStolen.isFormValid}
                isSuccess={reportStolen.isSuccess}
            />

            <ReportLostModal
                isOpen={reportLost.isOpen}
                onClose={reportLost.closeModal}
                firearmModel={reportLost.selectedFirearm?.model}
                firearmSerial={reportLost.selectedFirearm?.serial_number}
                form={reportLost.form}
                onFormChange={reportLost.updateForm}
                onSubmit={reportLost.submitReport}
                isSubmitting={reportLost.isSubmitting}
                isFormValid={reportLost.isFormValid}
                isSuccess={reportLost.isSuccess}
            />
        </div>
    );
}
