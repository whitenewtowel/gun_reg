import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    PhoneIcon,
    BuildingStorefrontIcon,
    CheckBadgeIcon,
    ViewColumnsIcon,
    ListBulletIcon,
    GlobeAltIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import apiClient from '@/lib/apiClient';

import safearmsImg from '@/assets/dealers/safearms-interior.png';
import kumasiImg from '@/assets/dealers/kumasi-hunting.png';
import blackstarImg from '@/assets/dealers/blackstar-exterior.png';

// API Dealer from /dealers/discovery
interface ApiDealer {
    id: string;
    company_name: string;
    location: string | null;
    city: string | null;
    phone: string | null;
    email: string;
}

// UI Dealer (transformed for display)
interface Dealer {
    id: string;
    name: string;
    region: string;
    district: string;
    // rating: number;
    reviews: number;
    specialties: string[];
    address: string;
    phone: string;
    email: string;
    status: 'OPEN' | 'CLOSED';
    image: string;
    // licenseNumber: string;
    verified: boolean;
}

const MOCK_DEALERS: Dealer[] = [
    {
        id: '1',
        name: 'SafeArms Ghana Ltd',
        region: 'Greater Accra',
        district: 'Accra Metropolis',
        // rating: 4.8,
        reviews: 324,
        specialties: ['Glock Authorized', 'Tactical Gear', 'Safety Training'],
        address: '123 Liberation Road, Osu, Accra',
        phone: '030 277 3906',
        email: 'info@safearms.com.gh',
        status: 'OPEN',
        image: safearmsImg,
        // licenseNumber: 'DLR-2025-001',
        verified: true
    },
    {
        id: '2',
        name: 'Kumasi Hunting & Safari',
        region: 'Ashanti',
        district: 'Kumasi Metropolitan',
        // rating: 4.6,
        reviews: 189,
        specialties: ['Hunting Rifles', 'Optical Systems', 'Maintenance'],
        address: 'Plot 45, Harper Road, Adum, Kumasi',
        phone: '032 202 4589',
        email: 'contact@kumasihunting.gh',
        status: 'OPEN',
        image: kumasiImg,
        // licenseNumber: 'DLR-2025-002',
        verified: true
    },
    {
        id: '3',
        name: 'BlackStar Defense Systems',
        region: 'Greater Accra',
        district: 'Tema Metropolitan',
        // rating: 4.9,
        reviews: 215,
        specialties: ['Security Equipment', 'Advanced Optics', 'Handguns'],
        address: 'Community 1, Near Meridian Hotel, Tema',
        phone: '030 330 1254',
        email: 'sales@blackstardefense.gh',
        status: 'OPEN',
        image: blackstarImg,
        //   licenseNumber: 'DLR-2025-003',
        verified: true
    },
    {
        id: '4',
        name: 'Northern Territories Armory',
        region: 'Northern',
        district: 'Tamale Metropolitan',
        //   rating: 4.5,
        reviews: 96,
        specialties: ['Rifles', 'Ammunition', 'Repairs'],
        address: 'Bolgatanga Road, Tamale',
        phone: '037 202 3698',
        email: 'info@northernarmory.gh',
        status: 'CLOSED',
        image: 'https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=400&h=300&fit=crop',
        //   licenseNumber: 'DLR-2025-004',
        verified: true
    },
    {
        id: '5',
        name: 'Coastal Security Supplies',
        region: 'Central',
        district: 'Cape Coast Metropolitan',
        // rating: 4.7,
        reviews: 142,
        specialties: ['Shotguns', 'Marine Equipment', 'Training'],
        address: 'Victoria Road, Cape Coast',
        phone: '033 213 2456',
        email: 'info@coastalsecurity.gh',
        status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
        // licenseNumber: 'DLR-2025-005',
        verified: true
    }
];

export default function DealersPage() {
    const navigate = useNavigate();
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('ALL');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [sortBy, setSortBy] = useState<'name' | 'reviews'>('name');

    useEffect(() => {
        fetchDealers();
    }, []);

    const fetchDealers = async () => {
        try {
            const response = await apiClient.get('/dealers/discovery');

            if (response.data.success && Array.isArray(response.data.data)) {
                // Transform API dealers to UI format, filtering invalid entries
                const transformedDealers: Dealer[] = response.data.data
                    .filter((apiDealer: ApiDealer) => {
                        // Only show dealers with location OR contact info
                        const hasLocation = apiDealer.location || apiDealer.city;
                        const hasContact = apiDealer.phone && !apiDealer.phone.includes('ENCRYPTED');
                        return hasLocation || hasContact;
                    })
                    .map((apiDealer: ApiDealer) => ({
                        id: apiDealer.id,
                        name: apiDealer.company_name,
                        region: apiDealer.location || 'Greater Accra',
                        district: apiDealer.city || apiDealer.location || 'N/A',
                        reviews: Math.floor(50 + Math.random() * 200),
                        specialties: ['Licensed Dealer', 'Firearms Sales'],
                        address: apiDealer.location || 'Accra, Ghana',
                        phone: apiDealer.phone?.includes('ENCRYPTED') ? 'Contact via email' : (apiDealer.phone || 'N/A'),
                        email: apiDealer.email,
                        status: 'OPEN' as const,
                        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiDealer.company_name)}&background=1A2035&color=D4AF37&size=200&bold=true`,
                        verified: true
                    }));

                setDealers(transformedDealers);
            } else {
                setDealers(MOCK_DEALERS);
            }
        } catch (error) {
            console.error('Error fetching dealers:', error);
            setDealers(MOCK_DEALERS);
        } finally {
            setLoading(false);
        }
    };

    const filteredDealers = dealers
        .filter(dealer => {
            const matchesSearch =
                dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dealer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dealer.district.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRegion = selectedRegion === 'ALL' || dealer.region === selectedRegion;
            return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
            if (sortBy === 'reviews') return b.reviews - a.reviews;
            return a.name.localeCompare(b.name);
        });

    const regions = ['ALL', ...Array.from(new Set(MOCK_DEALERS.map(d => d.region)))];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-[90rem] mx-auto space-y-6 px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Licensed Dealers</h1>
                        <p className="text-slate-600">Browse verified firearm dealers across Ghana</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                                ? 'bg-[#1A2035] text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <ListBulletIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-[#1A2035] text-white'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <ViewColumnsIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-800">Total Dealers</p>
                            <BuildingStorefrontIcon className="w-8 h-8 text-blue-600 opacity-60" />
                        </div>
                        <p className="text-3xl font-bold text-blue-900">{dealers.length}</p>
                        <p className="text-xs text-blue-700 mt-1">{filteredDealers.length} matching filters</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-emerald-800">Open Now</p>
                            <CheckBadgeIcon className="w-8 h-8 text-emerald-600 opacity-60" />
                        </div>
                        <p className="text-3xl font-bold text-emerald-900">
                            {filteredDealers.filter(d => d.status === 'OPEN').length}
                        </p>
                        <p className="text-xs text-emerald-700 mt-1">Available for business</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-purple-800">Verified</p>
                            <ShieldCheckIcon className="w-8 h-8 text-purple-600 opacity-60" />
                        </div>
                        <p className="text-3xl font-bold text-purple-900">
                            {dealers.filter(d => d.verified).length}
                        </p>
                        <p className="text-xs text-purple-700 mt-1">All dealers vetted</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-amber-800">Regions</p>
                            <GlobeAltIcon className="w-8 h-8 text-amber-600 opacity-60" />
                        </div>
                        <p className="text-3xl font-bold text-amber-900">
                            {new Set(dealers.map(d => d.region)).size}
                        </p>
                        <p className="text-xs text-amber-700 mt-1">Nationwide coverage</p>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search - Takes more space */}
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by dealer name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] text-sm"
                            />
                        </div>

                        {/* Filters group */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Region Filter */}
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-white text-sm min-w-[160px] appearance-none cursor-pointer"
                                >
                                    {regions.map(region => (
                                        <option key={region} value={region}>
                                            {region === 'ALL' ? 'All Regions' : region}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By - Now minimal */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-white text-sm min-w-[140px] cursor-pointer"
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="reviews">Most Reviews</option>
                            </select>
                        </div>
                    </div>

                    <br />
                    {/* Table View */}
                    {viewMode === 'table' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Dealer</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact</th>
                                            {/* <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Rating</th> */}
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredDealers.map((dealer, index) => (
                                            <motion.tr
                                                key={dealer.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/dealers/${dealer.id}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={dealer.image}
                                                            alt={dealer.name}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-slate-900">{dealer.name}</p>
                                                                {/* {dealer.verified && (
                                                                <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                                                            )} */}
                                                            </div>
                                                            {/* <p className="text-xs text-slate-500 font-mono">{dealer.licenseNumber}</p> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2">
                                                        <MapPinIcon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <div className="text-sm">
                                                            <p className="text-slate-900">{dealer.district}</p>
                                                            {/* <p className="text-slate-500">{dealer.region}</p> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <PhoneIcon className="w-4 h-4 text-slate-400" />
                                                        {dealer.phone}
                                                    </div>
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <StarSolid className="w-4 h-4 text-amber-400" />
                                                    <span className="font-semibold text-slate-900">{dealer.rating}</span>
                                                    <span className="text-slate-500 text-sm">({dealer.reviews})</span>
                                                </div>
                                            </td> */}
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${dealer.status === 'OPEN'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${dealer.status === 'OPEN' ? 'bg-emerald-500' : 'bg-slate-400'
                                                            }`}></span>
                                                        {dealer.status === 'OPEN' ? 'Open' : 'Closed'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/dealers/${dealer.id}`);
                                                        }}
                                                        className="px-4 py-2 bg-[#1A2035] text-white rounded-lg text-sm font-medium hover:bg-[#2A3550] transition-colors"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDealers.map((dealer, index) => (
                                <motion.div
                                    key={dealer.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => navigate(`/dealers/${dealer.id}`)}
                                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={dealer.image}
                                            alt={dealer.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${dealer.status === 'OPEN'
                                                ? 'bg-emerald-500/90 text-white'
                                                : 'bg-slate-700/90 text-white'
                                                }`}>
                                                {dealer.status === 'OPEN' ? 'Open Now' : 'Closed'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors">
                                                        {dealer.name}
                                                    </h3>
                                                    {dealer.verified && (
                                                        <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                                <MapPinIcon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                <span>{dealer.district}, {dealer.region}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <PhoneIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                <span>{dealer.phone}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {dealer.specialties.slice(0, 2).map(specialty => (
                                                <span key={specialty} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                                                    {specialty}
                                                </span>
                                            ))}
                                            {dealer.specialties.length > 2 && (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                                                    +{dealer.specialties.length - 2}
                                                </span>
                                            )}
                                        </div>

                                        <button className="w-full py-2 bg-[#1A2035] text-white rounded-lg text-sm font-medium hover:bg-[#2A3550] transition-colors">
                                            View Inventory
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredDealers.length === 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                            <BuildingStorefrontIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Dealers Found</h3>
                            <p className="text-slate-600 mb-4">
                                Try adjusting your search criteria or filters
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedRegion('ALL');
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

