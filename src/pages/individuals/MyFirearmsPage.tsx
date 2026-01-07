import { useState, useEffect } from 'react';
import {
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    EyeIcon,
    ArrowPathIcon,
    EllipsisVerticalIcon,
    ExclamationCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    BellAlertIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useReportStolen } from '@/hooks/useReportStolen';
import { useReportLost } from '@/hooks/useReportLost';
import { ReportStolenModal } from '@/components/firearms/ReportStolenModal';
import { ReportLostModal } from '@/components/firearms/ReportLostModal';
import { ApiFirearm } from '@/types';

export default function MyFirearmsPage() {
    const navigate = useNavigate();
    const [firearms, setFirearms] = useState<ApiFirearm[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });

    // Fetch firearms function
    const fetchFirearms = async (page = 1) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/firearms?page=${page}&limit=${pagination.limit}`);
            if (response.data.success && response.data.data) {
                setFirearms(response.data.data);
                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        ...response.data.pagination
                    }));
                }
            } else {
                setFirearms([]);
            }
        } catch (error) {
            console.error('Error fetching firearms:', error);
            setFirearms([]);
        } finally {
            setLoading(false);
        }
    };

    // Custom hooks for clean architecture
    const reportStolen = useReportStolen(() => fetchFirearms(pagination.page));
    const reportLost = useReportLost(() => fetchFirearms(pagination.page));

    useEffect(() => {
        fetchFirearms(pagination.page);
    }, [pagination.page]);

    // Update handlers to use new type
    // Update handlers to use new type
    const handleReportStolen = (firearm: ApiFirearm) => {
        reportStolen.openModal(firearm);
    };

    const handleReportLost = (firearm: ApiFirearm) => {
        reportLost.openModal(firearm);
    };

    const handleRenewLicense = (firearm: ApiFirearm) => {
        navigate(`/applications/renew/${firearm.serial_number}`);
    };

    // Helper to get the latest licence from a firearm's licences array
    const getLatestLicence = (firearm: ApiFirearm): ApiLicence | null => {
        if (!firearm.licences || firearm.licences.length === 0) return null;

        // Sort by issued_date descending and return the first (most recent)
        const sorted = [...firearm.licences].sort((a, b) => {
            const dateA = new Date(a.issued_date || '1970-01-01').getTime();
            const dateB = new Date(b.issued_date || '1970-01-01').getTime();
            return dateB - dateA;
        });

        return sorted[0];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-emerald-800 bg-emerald-100 border-emerald-200 shadow-sm';
            case 'EXPIRED':
                return 'text-rose-800 bg-rose-100 border-rose-200 shadow-sm';
            case 'PENDING':
                return 'text-amber-800 bg-amber-100 border-amber-200 shadow-sm';
            case 'SUSPENDED':
                return 'text-orange-800 bg-orange-100 border-orange-200 shadow-sm';
            default:
                return 'text-slate-600 bg-slate-100 border-slate-200 shadow-sm';
        }
    };

    // Client-side filtering for search (if API doesn't support search param)
    // Ideally API should handle search, but keeping hybrid for now
    const filteredFirearms = firearms.filter(firearm =>
        firearm.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firearm.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firearm.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Actions Menu Component
    const FirearmActionsMenu = ({ firearm }: { firearm: ApiFirearm }) => {
        // Check if the latest license is expired
        const latestLicence = getLatestLicence(firearm);
        const isExpired = latestLicence?.status === 'EXPIRED';

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Actions"
                    >
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem onClick={() => navigate(`/firearms/${firearm.id}`, { state: { firearm } })}>
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View Details
                    </DropdownMenuItem>

                    {isExpired && (
                        <DropdownMenuItem
                            onClick={() => handleRenewLicense(firearm)}
                            className="text-blue-600"
                        >
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            Renew License
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => handleReportStolen(firearm)}
                        className="text-red-600"
                    >
                        <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                        Report Stolen
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => handleReportLost(firearm)}
                        className="text-orange-600"
                    >
                        <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                        Report Lost
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    if (loading && firearms.length === 0) {
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
                    <h1 className="text-3xl font-bold text-[#1A2035] mb-2">My Firearms</h1>
                    <p className="text-gray-500">View and manage your registered firearms</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by make, model, or serial number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1A2035] placeholder-gray-400 focus:border-[#1A2035] focus:ring-1 focus:ring-[#1A2035] focus:outline-none shadow-sm"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-2xl font-bold text-[#1A2035]">
                                {firearms.filter(f => {
                                    const latestLicence = getLatestLicence(f);
                                    return latestLicence?.status === 'ACTIVE';
                                }).length}
                            </p>
                            <p className="text-sm text-gray-500">Active Firearms</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <ClockIcon className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-2xl font-bold text-[#1A2035]">
                                {pagination.total || firearms.length}
                            </p>
                            <p className="text-sm text-gray-500">Total Licences</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <BellAlertIcon className="w-8 h-8 text-yellow-600" />
                        <div>
                            <p className="text-2xl font-bold text-[#1A2035]">
                                {firearms.filter(f => {
                                    const latestLicence = getLatestLicence(f);
                                    if (!latestLicence?.expiry_date) return false;
                                    const expiryDate = new Date(latestLicence.expiry_date);
                                    const today = new Date();
                                    const thirtyDaysFromNow = new Date();
                                    thirtyDaysFromNow.setDate(today.getDate() + 30);
                                    return expiryDate > today && expiryDate <= thirtyDaysFromNow;
                                }).length}
                            </p>
                            <p className="text-sm text-gray-500">Expiring Soon</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
                        <div>
                            <p className="text-2xl font-bold text-[#1A2035]">
                                {firearms.filter(f => f.status === 'INACTIVE' || f.status === 'SUSPENDED').length}
                            </p>
                            <p className="text-sm text-gray-500">Inactive</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Firearms List */}
            {filteredFirearms.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#1A2035] mb-2">No Firearms Found</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm
                            ? "No firearms match your search"
                            : "You haven't registered any firearms yet"
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => navigate('/complete-applications')}
                            className="px-6 py-3 bg-[#1A2035] text-white font-bold rounded-xl hover:bg-[#2c3554] shadow-lg shadow-gray-200"
                        >
                            Apply for Permit
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="relative overflow-x-auto bg-white shadow-sm rounded-xl border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="text-sm text-gray-700 bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-semibold">
                                        Model
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-semibold">
                                        Serial Number
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-semibold">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-semibold">
                                        Calibre
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-semibold">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-semibold">
                                        Registered
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-semibold text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFirearms.map((firearm) => (
                                    <tr
                                        key={firearm.id}
                                        className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <th scope="row" className="px-6 py-4 font-semibold text-[#1A2035] whitespace-nowrap">
                                            {firearm.model}
                                        </th>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                            {firearm.serial_number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(firearm.status)}`}>
                                                {firearm.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {firearm.calibre}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                // If firearm itself is not active (e.g., LOST, STOLEN), show that
                                                if (firearm.status !== 'ACTIVE') {
                                                    return (
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(firearm.status)}`}>
                                                            {firearm.status}
                                                        </span>
                                                    );
                                                }

                                                // Otherwise, show the latest licence status
                                                const latestLicence = getLatestLicence(firearm);
                                                const effectiveStatus = latestLicence?.status || firearm.status;

                                                return (
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(effectiveStatus)}`}>
                                                        {effectiveStatus}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {new Date(firearm.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <FirearmActionsMenu firearm={firearm} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-xl">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                    disabled={pagination.page === pagination.pages}
                                >
                                    Next
                                </Button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                                        <span className="font-medium">{pagination.pages}</span> (Total <span className="font-medium">{pagination.total}</span>)
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <Button
                                            variant="outline"
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                            disabled={pagination.page === 1}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                                            disabled={pagination.page === pagination.pages}
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </Button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Report Modals */}
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
