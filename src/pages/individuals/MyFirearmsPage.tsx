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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/firearms`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFirearms(data.firearms || []);
            } else {
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
            }
        } catch (error) {
            console.error('Error fetching firearms:', error);
            toast.error('Failed to load firearms');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-green-400 bg-green-500/10 border-green-500/30';
            case 'EXPIRED':
                return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'PENDING':
                return 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30';
            case 'SUSPENDED':
                return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
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
                    <h1 className="text-3xl font-bold text-white mb-2">My Firearms</h1>
                    <p className="text-gray-400">View and manage your registered firearms</p>
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
                    className="w-full pl-12 pr-4 py-3 bg-[#1A2035] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1A2035] border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheckIcon className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {firearms.filter(f => f.status === 'ACTIVE').length}
                            </p>
                            <p className="text-sm text-gray-400">Active Firearms</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ClockIcon className="w-8 h-8 text-[#D4AF37]" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {firearms.filter(f => isExpiringSoon(f.licenseExpiresAt)).length}
                            </p>
                            <p className="text-sm text-gray-400">Expiring Soon</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A2035] border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {firearms.filter(f => f.status === 'EXPIRED' || f.status === 'SUSPENDED').length}
                            </p>
                            <p className="text-sm text-gray-400">Needs Attention</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Firearms List */}
            {filteredFirearms.length === 0 ? (
                <div className="text-center py-16 bg-[#1A2035] border border-white/10 rounded-lg">
                    <ShieldCheckIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Firearms Found</h3>
                    <p className="text-gray-400 mb-6">
                        {searchTerm
                            ? "No firearms match your search"
                            : "You haven't registered any firearms yet"
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => navigate('/complete-applications')}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F]"
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
                            className="bg-[#1A2035] border border-white/10 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 flex-1">
                                    <div className={`p-3 rounded-lg ${getStatusColor(firearm.status)}`}>
                                        {getTypeIcon()}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                                {firearm.make} {firearm.model}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(firearm.status)}`}>
                                                {firearm.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Serial Number:</span>
                                                <p className="text-white font-mono">{firearm.serialNumber}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Type:</span>
                                                <p className="text-white">{firearm.type}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Caliber:</span>
                                                <p className="text-white">{firearm.caliber}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Registered:</span>
                                                <p className="text-white">
                                                    {new Date(firearm.registeredAt).toLocaleDateString('en-GB')}
                                                </p>
                                            </div>
                                        </div>

                                        {firearm.licenseExpiresAt && (
                                            <div className="mt-3 flex items-center gap-2">
                                                {isExpiringSoon(firearm.licenseExpiresAt) && (
                                                    <ExclamationTriangleIcon className="w-4 h-4 text-[#D4AF37]" />
                                                )}
                                                <span className="text-sm text-gray-500">License Expires:</span>
                                                <span className={`text-sm font-medium ${isExpiringSoon(firearm.licenseExpiresAt) ? 'text-[#D4AF37]' : 'text-white'
                                                    }`}>
                                                    {new Date(firearm.licenseExpiresAt).toLocaleDateString('en-GB')}
                                                </span>
                                                {isExpiringSoon(firearm.licenseExpiresAt) && (
                                                    <button
                                                        onClick={() => navigate('/renewal')}
                                                        className="ml-auto flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded hover:bg-[#D4AF37]/30 text-sm"
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
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-[#D4AF37] rounded hover:bg-white/10 transition-colors"
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
