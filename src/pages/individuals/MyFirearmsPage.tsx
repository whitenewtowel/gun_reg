import { useState, useEffect } from 'react';
import {
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    EyeIcon,
    ArrowPathIcon,
    EllipsisVerticalIcon,
    ExclamationCircleIcon
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
import { useReportStolen } from '@/hooks/useReportStolen';
import { useReportLost } from '@/hooks/useReportLost';
import { ReportStolenModal } from '@/components/firearms/ReportStolenModal';
import { ReportLostModal } from '@/components/firearms/ReportLostModal';

interface Firearm {
    id: string;
    serial_number: string;
    type: string;
    model: string;
    calibre: string;
    status: string;
    current_owner_user_id: string;
    created_at: string;
    updated_at: string;
}

export default function MyFirearmsPage() {
    const navigate = useNavigate();
    const [firearms, setFirearms] = useState<Firearm[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch firearms function
    const fetchFirearms = async () => {
        try {
            const response = await apiClient.get('/firearms');
            if (response.data.success && response.data.data) {
                // Add test expired firearm for renewal flow testing
                const testExpiredFirearm = {
                    id: 'GHA-2026-F283105',
                    serial_number: 'GHA-2026-F283105',
                    type: 'HANDGUN',
                    model: 'Glock 19 (EXPIRED - Test)',
                    calibre: '9mm',
                    status: 'EXPIRED',
                    current_owner_user_id: 'current-user',
                    created_at: '2020-01-15T10:00:00Z',
                    updated_at: '2024-12-31T23:59:59Z'
                };

                setFirearms([testExpiredFirearm, ...response.data.data]);
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
    const reportStolen = useReportStolen(fetchFirearms);
    const reportLost = useReportLost(fetchFirearms);

    useEffect(() => {
        fetchFirearms();
    }, []);



    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'EXPIRED':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'PENDING':
                return 'text-[#1A2035] bg-gray-100 border-gray-200';
            case 'SUSPENDED':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            default:
                return 'text-gray-500 bg-gray-100 border-gray-200';
        }
    };

    const filteredFirearms = firearms.filter(firearm =>
        firearm.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firearm.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firearm.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Action handlers - using custom hooks for clean architecture
    const handleReportStolen = (firearm: Firearm) => {
        reportStolen.openModal(firearm);
    };

    const handleReportLost = (firearm: Firearm) => {
        reportLost.openModal(firearm);
    };

    const handleRenewLicense = (firearm: Firearm) => {
        navigate(`/applications/renew/${firearm.id}`);
    };

    // Actions Menu Component
    const FirearmActionsMenu = ({ firearm }: { firearm: Firearm }) => {
        const isExpired = firearm.status === 'EXPIRED';

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
                    <DropdownMenuItem onClick={() => navigate(`/firearms/${firearm.id}`)}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-2xl font-bold text-[#1A2035]">
                                {firearms.filter(f => f.status === 'ACTIVE').length}
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
                                {firearms.length}
                            </p>
                            <p className="text-sm text-gray-500">Total Firearms</p>
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
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(firearm.status)}`}>
                                            {firearm.status}
                                        </span>
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
            )}


            {/* Report Modals - Clean Component Separation */}
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
            />
        </div>
    );
}
