import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin,
    Search,
    Phone,
    Star,
    ShieldCheck,
    Navigation,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Premium Mock Dealer Data
const MOCK_DEALERS = [
    {
        id: '1',
        name: 'SafeArms Ghana Ltd',
        region: 'Greater Accra',
        district: 'Accra Metropolis',
        rating: 4.8,
        reviews: 324,
        specialties: ['Glock Authorized', 'Tactical Gear', 'Safety Training'],
        address: '123 Liberation Road, Osu, Accra',
        phone: '030 277 3906',
        status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1583096114844-06ce6a5af5e0?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Kumasi Hunting & Safari',
        region: 'Ashanti',
        district: 'Kumasi Metropolitan',
        rating: 4.6,
        reviews: 89,
        specialties: ['Hunting Rifles', 'Optical Systems', 'Maintenance'],
        address: 'Plot 45, Harper Road, Adum, Kumasi',
        phone: '032 202 4589',
        status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1620003013233-875c742c33ba?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: '3',
        name: 'BlackStar Defense Systems',
        region: 'Greater Accra',
        district: 'Tema Metropolitan',
        rating: 4.9,
        reviews: 215,
        specialties: ['Security Personnel Equipment', 'Advanced Optics', 'Handguns'],
        address: 'Community 1, Near Meridian Hotel, Tema',
        phone: '030 330 1254',
        status: 'CLOSED',
        image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: '4',
        name: 'Northern Territories Armory',
        region: 'Northern',
        district: 'Tamale Metropolitan',
        rating: 4.5,
        reviews: 56,
        specialties: ['Rifles', 'Ammunition Bulk', 'Repairs'],
        address: 'Bolgatanga Road, Tamale',
        phone: '037 202 3698',
        status: 'OPEN',
        image: 'https://images.unsplash.com/photo-1584027786482-a7d0e49520b2?q=80&w=2148&auto=format&fit=crop'
    }
];

export default function DealersPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('ALL');

    const filteredDealers = MOCK_DEALERS.filter(dealer => {
        const matchesSearch = dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dealer.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === 'ALL' || dealer.region === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    const regions = ['ALL', ...Array.from(new Set(MOCK_DEALERS.map(d => d.region)))];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
            {/* Header / Hero */}
            <div className="bg-[#1A2035] text-white pt-12 pb-24 px-6 md:px-12 rounded-b-[3rem] relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                        Authorized Dealer Network
                    </h1>
                    <p className="text-white/70 font-medium text-lg md:text-xl max-w-2xl">
                        Access Ghana's most trusted network of verified firearm dealers. Purchase, train, and service your equipment with certified professionals.
                    </p>
                </div>
                {/* Abstract Background Decoration */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
            </div>

            <div className="max-w-[87rem] mx-auto px-6 -mt-16 relative z-20">
                {/* Search & Filter Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 mb-12 flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Find dealers by name, city, or specialty..."
                            className="pl-12 h-14 text-base rounded-xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A2035]/10 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-1 overflow-x-auto">
                        {regions.slice(0, 3).map((region) => (
                            <Button
                                key={region}
                                variant="ghost"
                                onClick={() => setSelectedRegion(region)}
                                className={`rounded-xl h-12 px-6 whitespace-nowrap font-bold transition-all ${selectedRegion === region
                                        ? 'bg-[#1A2035] text-white hover:bg-[#2A3455]'
                                        : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {region === 'ALL' ? 'All Locations' : region}
                            </Button>
                        ))}
                        <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200 shrink-0">
                            <Filter className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                </div>

                {/* Dealers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDealers.map((dealer, index) => (
                        <motion.div
                            key={dealer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group h-full"
                        >
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                {/* Image Header */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <img
                                        src={dealer.image}
                                        alt={dealer.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <Badge className={`backdrop-blur-md border-white/20 px-3 py-1 ${dealer.status === 'OPEN'
                                                ? 'bg-emerald-500/90 text-white'
                                                : 'bg-rose-500/90 text-white'
                                            }`}>
                                            {dealer.status === 'OPEN' ? 'Open Now' : 'Closed'}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-4 left-4 z-20 text-white">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className="flex bg-yellow-400 text-[#1A2035] px-1.5 py-0.5 rounded text-xs font-black items-center">
                                                <Star className="h-3 w-3 mr-0.5 fill-[#1A2035]" />
                                                {dealer.rating}
                                            </div>
                                            <span className="text-xs text-white/80 font-medium">{dealer.reviews} verified reviews</span>
                                        </div>
                                        <h3 className="text-2xl font-bold leading-tight shadow-black drop-shadow-lg">
                                            {dealer.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="text-sm text-gray-600 font-medium flex items-center">
                                            <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                            {dealer.district}, {dealer.region}
                                        </div>
                                        <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] uppercase font-bold tracking-wider">
                                            Verified
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {dealer.specialties.slice(0, 3).map((tag) => (
                                            <span key={tag} className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto space-y-3 pt-4 border-t border-gray-50">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Phone className="h-4 w-4 mr-2.5 text-gray-400" />
                                            {dealer.phone}
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                className="flex-1 bg-[#1A2035] hover:bg-[#2A3455] text-white rounded-xl h-12 font-bold shadow-lg shadow-[#1A2035]/10"
                                                onClick={() => navigate(`/dealers/${dealer.id}`)}
                                            >
                                                Visit Store
                                            </Button>
                                            <Button variant="outline" className="flex-none rounded-xl h-12 w-12 p-0 border-gray-200 hover:bg-gray-50">
                                                <Navigation className="h-5 w-5 text-gray-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredDealers.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1A2035]">No dealers found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">
                            We couldn't find any dealers matching "{searchQuery}". Try adjusting your filters or search terms.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
