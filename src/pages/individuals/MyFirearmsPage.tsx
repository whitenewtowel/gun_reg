import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    EyeIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

interface Firearm {
    id: string;
    make: string;
    model: string;
    serialNumber: string;
    type: string;
    caliber: string;
    status: string;
    registeredAt: string;
    licenseExpiresAt?: string;
}

export default function MyFirearmsPage() {
    const navigate = useNavigate();
    const [firearms, setFirearms] = useState<Firearm[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFirearms();
    }, []);

    const fetchFirearms = async () => {
        try {
            const response = await apiClient.get('/dashboard/firearms');
            const data = response.data;
            setFirearms(data.firearms || []);
        } catch (error) {
            console.error('Error fetching firearms:', error);
            // Fallback to mock data
            setFirearms([
                {
                    id: '1',
                    make: 'Glock',
                    model: '19 Gen5',
                    serialNumber: 'GLK-2024-001234',
                    type: 'HANDGUN',
                    caliber: '9mm',
                    status: 'ACTIVE',
                    registeredAt: '2024-01-15T10:00:00Z',
                    licenseExpiresAt: '2026-01-15T10:00:00Z'
                },
                {
                    id: '2',
                    make: 'Remington',
                    model: '870 Express',
                    serialNumber: 'REM-2023-005678',
                    type: 'SHOTGUN',
                    caliber: '12 Gauge',
                    status: 'ACTIVE',
                    registeredAt: '2023-06-20T14:30:00Z',
                    licenseExpiresAt: '2025-06-20T14:30:00Z'
                }
            ]);
            toast.error('Failed to load firearms');
        } finally {
            setLoading(false);
        }
    };

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

    const getTypeIcon = () => {
        return <ShieldCheckIcon className="w-6 h-6" />;
    };

    const isExpiringSoon = (expiryDate?: string) => {
        if (!expiryDate) return false;
        const daysUntilExpiry = Math.floor((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    };

    const filteredFirearms = firearms.filter(firearm =>
        firearm.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firearm.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firearm.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <ClockIcon className="w-8 h-8 text-[#1A2035]" />
                        <div>
                            <p className="text-2xl font-bold text-[#1A2035]">
                                {firearms.filter(f => isExpiringSoon(f.licenseExpiresAt)).length}
                            </p>
                            <p className="text-sm text-gray-500">Expiring Soon</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                        <div>
                            <p className="text-2xl font-bold text-[#1A2035]">
                                {firearms.filter(f => f.status === 'EXPIRED' || f.status === 'SUSPENDED').length}
                            </p>
                            <p className="text-sm text-gray-500">Needs Attention</p>
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
                <div className="grid gap-4">
                    {filteredFirearms.map((firearm, index) => (
                        <motion.div
                            key={firearm.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1A2035]/30 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 flex-1">
                                    <div className={`p-3 rounded-lg ${getStatusColor(firearm.status)}`}>
                                        {getTypeIcon()}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-[#1A2035] group-hover:text-blue-700 transition-colors">
                                                {firearm.make} {firearm.model}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(firearm.status)}`}>
                                                {firearm.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Serial Number:</span>
                                                <p className="text-[#1A2035] font-mono">{firearm.serialNumber}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Type:</span>
                                                <p className="text-[#1A2035]">{firearm.type}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Caliber:</span>
                                                <p className="text-[#1A2035]">{firearm.caliber}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Registered:</span>
                                                <p className="text-[#1A2035]">
                                                    {new Date(firearm.registeredAt).toLocaleDateString('en-GB')}
                                                </p>
                                            </div>
                                        </div>

                                        {firearm.licenseExpiresAt && (
                                            <div className="mt-3 flex items-center gap-2">
                                                {isExpiringSoon(firearm.licenseExpiresAt) && (
                                                    <ExclamationTriangleIcon className="w-4 h-4 text-[#1A2035]" />
                                                )}
                                                <span className="text-sm text-gray-500">License Expires:</span>
                                                <span className={`text-sm font-medium ${isExpiringSoon(firearm.licenseExpiresAt) ? 'text-red-600' : 'text-[#1A2035]'
                                                    }`}>
                                                    {new Date(firearm.licenseExpiresAt).toLocaleDateString('en-GB')}
                                                </span>
                                                {isExpiringSoon(firearm.licenseExpiresAt) && (
                                                    <button
                                                        onClick={() => navigate('/renewal')}
                                                        className="ml-auto flex items-center gap-2 px-3 py-1 bg-[#1A2035]/10 text-[#1A2035] rounded-lg hover:bg-[#1A2035]/20 text-sm"
                                                    >
                                                        <ArrowPathIcon className="w-4 h-4" />
                                                        Renew Now
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/firearms/${firearm.id}`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-[#1A2035] rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
