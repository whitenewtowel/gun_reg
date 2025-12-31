import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Star,
    ArrowLeft,
    Share2,
    Navigation,
    Globe,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Premium Mock Data
// Using updated high-quality images
const DEALER_DETAILS = {
    id: '1',
    name: 'SafeArms Ghana Ltd',
    description: "Premier provider of firearms and tactical equipment in the Greater Accra region. As a licensed importer and trusted partner of the Ghana Police Service, we offer a secure environment for certified training and acquisitions. Experience our state-of-the-art indoor range and consult with our expert armorers.",
    region: 'Greater Accra',
    district: 'Accra Metropolis',
    address: '123 Liberation Road, Osu, Accra',
    phone: '030 277 3906',
    email: 'info@safearms.com.gh',
    website: 'www.safearms.com.gh',
    rating: 4.8,
    reviews: 124,
    licenseNumber: 'DLR-2025-00123',
    status: 'OPEN',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1583096114844-06ce6a5af5e0?q=80&w=2000&auto=format&fit=crop',
    specialties: ['Glock Authorized', 'Tactical Gear', 'Safety Training', 'Gunsmithing'],
    inventory: [
        {
            id: 1,
            name: 'Glock 19 Gen 5',
            type: 'Pistol',
            price: 'GHS 25,000',
            stock: 'In Stock',
            image: 'https://images.unsplash.com/photo-1585589266782-966902229115?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 2,
            name: 'Remington 870 Express',
            type: 'Shotgun',
            price: 'GHS 18,000',
            stock: 'Low Stock',
            image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 3,
            name: 'Sig Sauer P320',
            type: 'Pistol',
            price: 'GHS 28,000',
            stock: 'In Stock',
            image: 'https://images.unsplash.com/photo-1619360815063-44d320b9c375?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 4,
            name: 'Mossberg 500 Tactical',
            type: 'Shotgun',
            price: 'GHS 22,000',
            stock: 'In Stock',
            image: 'https://images.unsplash.com/photo-1584027786482-a7d0e49520b2?auto=format&fit=crop&q=80&w=800'
        }
    ]
};

export default function DealerDetailPage() {
    const navigate = useNavigate();

    // In a real app, fetch dealer by ID here
    const dealer = DEALER_DETAILS;

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
            {/* Immersive Header */}
            <div className="relative h-[80vh] md:h-[60vh] w-full lg:rounded-b-[3rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2035] via-transparent to-transparent z-10 opacity-90" />
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img
                    src={dealer.image}
                    alt={dealer.name}
                    className="w-full h-full object-cover"
                />

                {/* Navbar area trigger */}
                <div className="absolute top-0 left-0 right-0 p-6 z-20">
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10 hover:text-white rounded-full bg-black/20"
                        onClick={() => navigate('/dealers')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        All Dealers
                    </Button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 pb-24 md:pb-12">
                    <div className="max-w-[87rem] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-3 py-1 text-sm">
                                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Verified Dealer
                                </Badge>
                                <span className="flex items-center text-sm font-bold bg-white/10 text-white px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                    <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-400 fill-yellow-400" />
                                    {dealer.rating} · {dealer.reviews} Reviews
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                                {dealer.name}
                            </h1>
                            <div className="flex items-center text-white/90 font-medium text-lg">
                                <MapPin className="h-5 w-5 mr-2 opacity-80" />
                                {dealer.address}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="bg-white text-[#1A2035] hover:bg-gray-100 rounded-xl font-bold h-12 px-6 shadow-xl">
                                <Navigation className="mr-2 h-4 w-4" />
                                Get Directions
                            </Button>
                            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl h-12 w-12 p-0 backdrop-blur-md">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[87rem] mx-auto px-6 -mt-8 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Sections Wrapper */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100/50">
                            {/* Bio */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-[#1A2035] mb-4">About the Dealer</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {dealer.description}
                                </p>
                            </section>

                            {/* Specialties */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Specialties & Services</h3>
                                <div className="flex flex-wrap gap-2">
                                    {dealer.specialties.map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-4 py-2 text-sm bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100 transition-colors">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Inventory Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-black text-[#1A2035]">Available Inventory</h2>
                                <Button variant="ghost" className="text-[#1A2035] font-bold hover:bg-white">View All</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {dealer.inventory.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                        <div className="h-48 rounded-2xl bg-gray-50 mb-4 overflow-hidden relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Badge className={`backdrop-blur-md bg-white/90 text-[#1A2035] border-none shadow-sm font-bold`}>
                                                    {item.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="px-2 pb-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg text-[#1A2035] leading-tight max-w-[70%]">{item.name}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${item.stock === 'In Stock' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                                                    {item.stock}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-xl font-black text-[#1A2035]">{item.price}</div>
                                                <Button
                                                    className="bg-[#1A2035] text-white hover:bg-[#2A3455] rounded-xl px-6 font-bold shadow-lg shadow-[#1A2035]/10"
                                                    onClick={() => navigate(`/dealers/${dealer.id}/purchase/${item.id}`)}
                                                    disabled={item.stock !== 'In Stock'}
                                                >
                                                    Purchase
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="rounded-3xl border-none shadow-xl shadow-gray-200/50 bg-white">
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                                        <Clock className="h-5 w-5 mr-2.5 text-gray-400" />
                                        Opening Hours
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 rounded-2xl bg-gray-50">
                                            <span className="text-gray-600 font-medium text-sm">Mon - Fri</span>
                                            <span className="font-bold text-[#1A2035] text-sm">8:00 AM - 5:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-2xl bg-gray-50">
                                            <span className="text-gray-600 font-medium text-sm">Saturday</span>
                                            <span className="font-bold text-[#1A2035] text-sm">9:00 AM - 2:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-gray-100">
                                            <span className="text-gray-400 font-medium text-sm">Sunday</span>
                                            <span className="font-bold text-red-500 text-sm">Closed</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-gray-100" />

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                                        <Phone className="h-5 w-5 mr-2.5 text-gray-400" />
                                        Contact
                                    </h3>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start h-12 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-[#1A2035] font-medium text-gray-600">
                                            <Phone className="mr-3 h-4 w-4" />
                                            {dealer.phone}
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start h-12 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-[#1A2035] font-medium text-gray-600">
                                            <Mail className="mr-3 h-4 w-4" />
                                            Email Dealer
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start h-12 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-[#1A2035] font-medium text-gray-600">
                                            <Globe className="mr-3 h-4 w-4" />
                                            Visit Website
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-[#1A2035] text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-[#1A2035]/30">
                            <div className="relative z-10">
                                <h3 className="font-bold text-xl mb-3">Ready to Visit?</h3>
                                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                    Ensure you have your digital Permit to Purchase (QR Code) and a valid ID before visiting the physical store.
                                </p>
                                <Button className="w-full bg-white text-[#1A2035] hover:bg-gray-100 font-bold border-none h-12 rounded-xl">
                                    View My Permit
                                </Button>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl -translate-x-5 translate-y-5"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
