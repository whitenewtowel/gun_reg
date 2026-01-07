import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeftIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon,
    CheckBadgeIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

import safearmsImg from '@/assets/dealers/safearms-interior.png';
import glockImg from '@/assets/products/glock-19.png';
import remingtonImg from '@/assets/products/remington-870.png';
import sigImg from '@/assets/products/sig-p320.png';
import winchesterImg from '@/assets/products/winchester-70.png';
import berettaImg from '@/assets/products/beretta-92fs.png';

// API Response type from GET /dealers/{id}
interface ApiDealerDetail {
    id: string;
    user_id: string;
    company_name: string;
    tin: string;
    location: string | null;
    status: string;
    business_registration_number: string | null;
    license_expiry_date: string | null;
    authorized_importer: boolean;
    business_hours: string | null;
    about: string | null;
    specialties: string | null;
    website: string | null;
    phone_number: string | null;
    verified_by_police: boolean;
    documents: any[];
    approved_by: string | null;
    approved_at: string | null;
    rejection_reason: string | null;
    rejected_at: string | null;
    rejected_by: string | null;
    reapplication_attempt: number;
    reapplication_submitted_at: string | null;
    reapplication_reason: string | null;
    region_id: string | null;
    created_at: string;
    updated_at: string;
    owner: {
        id: string;
        email: string;
        phone: string;
        city: string | null;
        address: string | null;
        full_name: string;
        region_id: string | null;
        regionData: any;
    };
    regionData: any;
    inventory: Array<{
        id: string;
        dealer_id: string;
        firearm_id: string;
        status: string;
        stock_status: string;
        price: number | null;
        currency: string;
        condition: string | null;
        police_approved: boolean;
        created_at: string;
        updated_at: string;
        firearm: {
            id: string;
            serial_number: string;
            type: string;
            model: string;
            calibre: string;
            status: string;
            created_at: string;
            updated_at: string;
            current_owner_user_id: string | null;
            created_by: string | null;
        };
    }>;
}

interface InventoryItem {
    id: string;
    name: string;
    type: 'PISTOL' | 'RIFLE' | 'SHOTGUN';
    make: string;
    model: string;
    caliber: string;
    price: number;
    stock: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
    image: string;
    serialNumber?: string;
}

const DEALER_DETAIL = {
    id: '1',
    name: 'SafeArms Ghana Ltd',
    licenseNumber: 'DLR-2025-001',
    description: 'Premier licensed firearm dealer in Greater Accra. Authorized importer and distributor of quality firearms and accessories. Ghana Police Service verified.',
    region: 'Greater Accra',
    district: 'Accra Metropolis',
    address: '123 Liberation Road, Osu, Accra',
    phone: '030 277 3906',
    email: 'info@safearms.com.gh',
    website: 'www.safearms.com.gh',
    rating: 4.8,
    reviews: 324,
    status: 'OPEN' as const,
    verified: true,
    hours: {
        weekday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed'
    },
    specialties: ['Glock Authorized', 'Tactical Gear', 'Safety Training', 'Gunsmithing'],
    image: safearmsImg
};

const INVENTORY: InventoryItem[] = [
    {
        id: '1',
        name: 'Glock 19 Gen 5',
        type: 'PISTOL',
        make: 'Glock',
        model: '19 Gen 5',
        caliber: '9mm',
        price: 25000,
        stock: 'IN_STOCK',
        image: glockImg,
        serialNumber: 'GLK-2025-001'
    },
    {
        id: '2',
        name: 'Remington 870 Express',
        type: 'SHOTGUN',
        make: 'Remington',
        model: '870 Express',
        caliber: '12 Gauge',
        price: 18000,
        stock: 'LOW_STOCK',
        image: remingtonImg,
        serialNumber: 'REM-2025-045'
    },
    {
        id: '3',
        name: 'Sig Sauer P320',
        type: 'PISTOL',
        make: 'Sig Sauer',
        model: 'P320',
        caliber: '9mm',
        price: 28000,
        stock: 'IN_STOCK',
        image: sigImg,
        serialNumber: 'SIG-2025-023'
    },
    {
        id: '4',
        name: 'Winchester Model 70',
        type: 'RIFLE',
        make: 'Winchester',
        model: 'Model 70',
        caliber: '.308',
        price: 32000,
        stock: 'IN_STOCK',
        image: winchesterImg,
        serialNumber: 'WIN-2025-012'
    },
    {
        id: '5',
        name: 'Beretta 92FS',
        type: 'PISTOL',
        make: 'Beretta',
        model: '92FS',
        caliber: '9mm',
        price: 26500,
        stock: 'OUT_OF_STOCK',
        image: berettaImg
    }
];

export default function DealerDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'inventory' | 'about'>('inventory');
    const [loading, setLoading] = useState(true);
    const [dealerData, setDealerData] = useState<any>(null);
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

    useEffect(() => {
        fetchDealerDetails();
    }, [id]);

    const fetchDealerDetails = async () => {
        if (!id) return;

        try {
            const response = await apiClient.get(`/dealers/${id}`);

            if (response.data.success && response.data.data) {
                const apiDealer: ApiDealerDetail = response.data.data;

                // Parse specialties if it's a JSON string
                let specialtiesList: string[] = ['Licensed Dealer', 'Firearms Sales'];
                if (apiDealer.specialties) {
                    try {
                        specialtiesList = JSON.parse(apiDealer.specialties);
                    } catch {
                        specialtiesList = [apiDealer.specialties];
                    }
                }

                // Parse business hours if available
                let businessHours = {
                    weekday: '8:00 AM - 5:00 PM',
                    saturday: '9:00 AM - 2:00 PM',
                    sunday: 'Closed'
                };
                if (apiDealer.business_hours) {
                    try {
                        businessHours = JSON.parse(apiDealer.business_hours);
                    } catch {
                        // Keep defaults
                    }
                }

                // Transform inventory from API
                const transformedInventory: InventoryItem[] = (apiDealer.inventory || []).map(item => {
                    // Map stock_status to our UI format
                    let stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK';
                    if (item.stock_status === 'OUT_OF_STOCK') stockStatus = 'OUT_OF_STOCK';
                    else if (item.stock_status === 'LOW_STOCK') stockStatus = 'LOW_STOCK';

                    return {
                        id: item.id,
                        name: `${item.firearm.type} - ${item.firearm.model}`,
                        type: item.firearm.type as 'PISTOL' | 'RIFLE' | 'SHOTGUN',
                        make: item.firearm.type, // Using type as make since make isn't in API
                        model: item.firearm.model,
                        caliber: item.firearm.calibre,
                        price: item.price || 0,
                        stock: stockStatus,
                        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.firearm.model)}&background=1A2035&color=D4AF37&size=200`,
                        serialNumber: item.firearm.serial_number
                    };
                });

                // Transform to UI format
                const transformed = {
                    id: apiDealer.id,
                    name: apiDealer.company_name,
                    licenseNumber: apiDealer.tin || `DLR-${new Date().getFullYear()}-${id.slice(0, 3).toUpperCase()}`,
                    description: apiDealer.about || 'Licensed firearm dealer verified by Ghana Police Service.',
                    region: apiDealer.location || 'Greater Accra',
                    district: apiDealer.owner?.city || apiDealer.location || 'Accra',
                    address: apiDealer.owner?.address || apiDealer.location || 'Accra, Ghana',
                    phone: apiDealer.phone_number || apiDealer.owner?.phone || 'N/A',
                    email: apiDealer.owner?.email || 'N/A',
                    website: apiDealer.website || 'N/A',
                    rating: 4.5 + (Math.random() * 0.5), // Mock rating
                    reviews: Math.floor(50 + Math.random() * 200), // Mock reviews
                    status: apiDealer.status === 'APPROVED' ? 'OPEN' as const : 'CLOSED' as const,
                    verified: apiDealer.verified_by_police,
                    hours: businessHours,
                    specialties: specialtiesList,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiDealer.company_name)}&background=1A2035&color=D4AF37&size=400&bold=true`
                };

                setDealerData(transformed);
                setInventoryData(transformedInventory);
            } else {
                // Fallback to mock
                setDealerData(DEALER_DETAIL);
                setInventoryData(INVENTORY);
            }
        } catch (error) {
            console.error('Error fetching dealer details:', error);
            setDealerData(DEALER_DETAIL);
            setInventoryData(INVENTORY);
            toast.error('Failed to load dealer details');
        } finally {
            setLoading(false);
        }
    };

    const dealer = dealerData || DEALER_DETAIL;
    const inventory = inventoryData.length > 0 ? inventoryData : INVENTORY;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    const handlePurchase = (item: InventoryItem) => {
        if (item.stock === 'OUT_OF_STOCK') {
            toast.error('This item is currently out of stock');
            return;
        }

        navigate(`/dealers/${dealer.id}/purchase/${item.id}`, {
            state: {
                dealer: dealer,
                item: item
            }
        });
    };

    const getStockBadge = (stock: string) => {
        switch (stock) {
            case 'IN_STOCK':
                return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">In Stock</span>;
            case 'LOW_STOCK':
                return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">Low Stock</span>;
            case 'OUT_OF_STOCK':
                return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">Out of Stock</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header with Hero Image */}
            <div className="relative h-64 bg-slate-900">
                <img
                    src={dealer.image}
                    alt={dealer.name}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                <div className="absolute top-6 left-6">
                    <button
                        onClick={() => navigate('/dealers')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Dealers
                    </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    {dealer.verified && (
                                        <CheckBadgeIcon className="w-6 h-6 text-blue-400" />
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${dealer.status === 'OPEN'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-600 text-white'
                                        }`}>
                                        {dealer.status === 'OPEN' ? 'Open Now' : 'Closed'}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-2">{dealer.name}</h1>
                                <div className="flex items-center gap-4 text-white/80">
                                    <div className="flex items-center gap-1">
                                        <StarSolid className="w-5 h-5 text-amber-400" />
                                        <span className="font-semibold">{dealer.rating}</span>
                                        <span className="text-sm">({dealer.reviews} reviews)</span>
                                    </div>
                                    <span>•</span>
                                    <span className="text-sm font-mono">{dealer.licenseNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="max-w-[88rem] mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'inventory'
                                        ? 'bg-[#1A2035] text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Inventory ({inventory.filter(i => i.stock !== 'OUT_OF_STOCK').length} available)
                                </button>
                                <button
                                    onClick={() => setActiveTab('about')}
                                    className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'about'
                                        ? 'bg-[#1A2035] text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    About
                                </button>
                            </div>

                            {/* Inventory Tab */}
                            {activeTab === 'inventory' && (
                                <div className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="border-b border-slate-200">
                                                <tr>
                                                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">Firearm</th>
                                                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">Type</th>
                                                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">Caliber</th>
                                                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">Price</th>
                                                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">Stock</th>
                                                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {inventory.map((item, index) => (
                                                    <motion.tr
                                                        key={item.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="hover:bg-slate-50 transition-colors"
                                                    >
                                                        <td className="py-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-16 h-12 rounded object-cover"
                                                                />
                                                                <div>
                                                                    <p className="font-semibold text-slate-900">{item.name}</p>
                                                                    <p className="text-xs text-slate-500">{item.make} {item.model}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                                                {item.type}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-slate-900">{item.caliber}</td>
                                                        <td className="py-4">
                                                            <span className="font-bold text-slate-900">GHS {item.price.toLocaleString()}</span>
                                                        </td>
                                                        <td className="py-4">{getStockBadge(item.stock)}</td>
                                                        <td className="py-4">
                                                            <button
                                                                onClick={() => handlePurchase(item)}
                                                                disabled={item.stock === 'OUT_OF_STOCK'}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${item.stock === 'OUT_OF_STOCK'
                                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                    : 'bg-[#D4AF37] text-white hover:bg-[#B4941F]'
                                                                    }`}
                                                            >
                                                                {item.stock === 'OUT_OF_STOCK' ? 'Unavailable' : 'Purchase'}
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* About Tab */}
                            {activeTab === 'about' && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                                        <p className="text-slate-600 leading-relaxed">{dealer.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-3">Specialties</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {dealer.specialties.map(specialty => (
                                                <span key={specialty} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPinIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-900">{dealer.address}</p>
                                        <p className="text-slate-600">{dealer.district}, {dealer.region}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <PhoneIcon className="w-5 h-5 text-slate-400" />
                                    <a href={`tel:${dealer.phone}`} className="text-sm text-slate-900 hover:text-[#D4AF37]">
                                        {dealer.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                                    <a href={`mailto:${dealer.email}`} className="text-sm text-slate-900 hover:text-[#D4AF37]">
                                        {dealer.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GlobeAltIcon className="w-5 h-5 text-slate-400" />
                                    <a href={`https://${dealer.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-900 hover:text-[#D4AF37]">
                                        {dealer.website}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-slate-400" />
                                Business Hours
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Mon - Fri</span>
                                    <span className="font-medium text-slate-900">{dealer.hours.weekday}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Saturday</span>
                                    <span className="font-medium text-slate-900">{dealer.hours.saturday}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Sunday</span>
                                    <span className="font-medium text-red-600">{dealer.hours.sunday}</span>
                                </div>
                            </div>
                        </div>

                        {/* Important Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <h3 className="font-bold text-amber-900 mb-2">Before Visiting</h3>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Ensure you have a valid firearm license and Permit to Purchase before visiting the dealer.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}