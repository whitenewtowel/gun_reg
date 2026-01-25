/**
 * NFLTMS - Ghana National Firearm Licensing & Tracking Management System
 * Complete Landing Page with Curved Sections & Rich Content
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShieldCheckIcon,
    CheckBadgeIcon,
    ArrowRightIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    LockClosedIcon,
    GlobeAltIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    UserIcon,
    ChartBarIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import pistolLicenseImg from '@/assets/pistol-license.png';
import rifleLicenseImg from '@/assets/rifle-license.png';
import shotgunLicenseImg from '@/assets/shotgun-license.png';
import heroImg from '@/assets/hero-image.png';
import aboutImg from '@/assets/about-image.png';
import ghCivImg from '@/assets/ghanaian-civilian.png';
import ghSecImg from '@/assets/ghanaian-security.png';
import ghOffImg from '@/assets/ghanaian-official.png';
import ghHuntImg from '@/assets/ghanaian-hunter.png';
import logo from '@/assets/images/logo2.png';

export default function LandingPage() {
    const licenseCategories = [
        {
            title: 'Personal Defense',
            image: pistolLicenseImg,
            description: 'Handguns for personal protection',
            count: '45,000+ active',
        },
        {
            title: 'Hunting & Protection',
            image: shotgunLicenseImg,
            description: 'Shotguns for farm security & game',
            count: '85,000+ active',
        },
        {
            title: 'Sport & Precision',
            image: rifleLicenseImg,
            description: 'Authorized rifles for club use',
            count: '12,000+ active',
        },
    ];

    const applicationProcess = [
        {
            step: '01',
            title: 'Identity Verification',
            description: 'Verify your identity using Ghana Card integration',
            icon: UserIcon,
        },
        {
            step: '02',
            title: 'Submit Documents',
            description: 'Upload required certificates and documentation',
            icon: DocumentTextIcon,
        },
        {
            step: '03',
            title: 'Background Check',
            description: 'Police conduct thorough background verification',
            icon: ShieldCheckIcon,
        },
        {
            step: '04',
            title: 'Payment & Approval',
            description: 'Pay fees and receive your digital license',
            icon: CheckCircleIcon,
        },
    ];

    const successStories = [
        { image: ghCivImg, name: 'Licensed Owner' },
        { image: ghSecImg, name: 'Security Professional' },
        { image: ghHuntImg, name: 'Sport Shooter' },
        { image: ghOffImg, name: 'Licensed Dealer' },
        { image: ghHuntImg, name: 'Hunting Enthusiast' },
        { image: ghSecImg, name: 'Range Officer' },
        { image: ghCivImg, name: 'Collector' },
        { image: ghOffImg, name: 'Agency Director' },
    ];

    const featuredServices = [
        {
            title: 'New License Application',
            price: 'GHS 500',
            features: ['Ghana Card Verification', 'Background Check', 'Digital Certificate', 'Mobile Access'],
            popular: true,
        },
        {
            title: 'License Renewal',
            price: 'GHS 200',
            features: ['Quick Renewal', 'Updated Certificate', 'Status Tracking', '3-Year Validity'],
            popular: false,
        },
        {
            title: 'Dealer Registration',
            price: 'GHS 2,000',
            features: ['Business Verification', 'Inventory System', 'Sales Tracking', 'Import Documentation'],
            popular: false,
        },
    ];

    const recentLicenses = [
        { id: 'NFL-2025-001', type: 'Pistol', status: 'Active', holder: 'K. Mensah' },
        { id: 'NFL-2025-002', type: 'Rifle', status: 'Active', holder: 'A. Osei' },
        { id: 'NFL-2025-003', type: 'Shotgun', status: 'Active', holder: 'E. Boateng' },
        { id: 'NFL-2025-004', type: 'Dealer', status: 'Verified', holder: 'SafeArms Ltd' },
    ];

    const navigationItems = ['Licenses', 'Dealers', 'Services', 'About', 'Contact'];

    return (
        <div className="min-h-screen bg-[#0B1021] text-white font-technical selection:bg-[#D4AF37] selection:text-black relative">
            {/* Global Background Texture */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-90 bg-[url('/assets/hero-bg.png')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(11,16,33,0.8),rgba(11,16,33,0.95))]"></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10">
                {/* Top Banner */}
                <div className="bg-[#D4AF37] text-black font-semibold py-1.5 px-4 shadow-md relative z-50">
                    <div className="container mx-auto flex justify-between items-center text-xs md:text-sm tracking-wide">
                        <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="h-4 w-4" />
                            <span>REPUBLIC OF GHANA • MINISTRY OF INTERIOR</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:inline flex items-center gap-1">
                                <LockClosedIcon className="h-3 w-3" />
                                Secure Portal
                            </span>
                            <div className="flex items-center gap-1 cursor-pointer hover:underline">
                                <GlobeAltIcon className="h-3 w-3" />
                                <span>EN</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <header className="border-b border-white/5 bg-[#0B1021]/95 backdrop-blur-md sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="relative group">
                                    <img src={logo} alt="Logo" className='w-14 h-14 object-contain' />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">
                                        NFLTMS
                                    </h1>
                                    <p className="text-[0.65rem] md:text-xs text-[#D4AF37] tracking-widest uppercase mt-1">
                                        National Firearm Licensing
                                    </p>
                                </div>
                            </div>

                            {/* Desktop Nav */}
                            <nav className="hidden lg:flex items-center gap-8">
                                {navigationItems.map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors relative group"
                                    >
                                        {item}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full"></span>
                                    </a>
                                ))}
                            </nav>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <Link to="/licenses" className="hidden sm:block">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                    >
                                        <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                                        Find License
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button className="bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] border-none clip-chamfer rounded-none px-6">
                                        LOGIN
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header >

                {/* Hero Section */}
                <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
                    <div className="absolute inset-0 bg-[#0B1021]/80">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),transparent_60%)]"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10 py-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border-l-2 border-[#D4AF37] text-[#D4AF37] px-4 py-1.5 text-xs font-bold tracking-widest mb-8 uppercase">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse"></div>
                                    Official Government Platform
                                </div>

                                <h1 className="text-5xl md:text-7xl font-stencil mb-6 leading-[0.9] tracking-tight">
                                    IT ISN&apos;T
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                                        LICENSED
                                    </span>
                                    <br />
                                    UNLESS IT&apos;S
                                    <br />
                                    REGISTERED
                                </h1>

                                <div className="h-1 w-24 bg-[#D4AF37] mb-8"></div>

                                <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                                    Ghana&apos;s official digital platform for firearm licensing, registration, and tracking.
                                    Ensuring public safety through{' '}
                                    <span className="text-white font-semibold">efficient regulation</span> and{' '}
                                    <span className="text-white font-semibold">real-time monitoring</span>.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/kyc/start" className="w-full sm:w-auto">
                                        <Button
                                            size="lg"
                                            className="w-full h-14 bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold text-lg relative overflow-hidden group clip-chamfer rounded-none"
                                        >
                                            <span className="relative z-10 flex items-center uppercase tracking-wider">
                                                Apply for License
                                                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </Button>
                                    </Link>
                                    <Link to="/licenses" className="w-full sm:w-auto">
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="w-full h-14 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37] rounded-none clip-chamfer"
                                        >
                                            <span className="uppercase tracking-wider flex items-center">
                                                <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                                                Check Status
                                            </span>
                                        </Button>
                                    </Link>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
                                    <div>
                                        <div className="text-3xl font-bold text-[#D4AF37]">7,500+</div>
                                        <div className="text-sm text-gray-400 mt-1">Active Licenses</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-[#D4AF37]">24/7</div>
                                        <div className="text-sm text-gray-400 mt-1">Portal Access</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-[#D4AF37]">21 Days</div>
                                        <div className="text-sm text-gray-400 mt-1">Processing</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hero Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative hidden lg:block"
                            >
                                <div className="relative z-10">
                                    <div className="absolute -inset-4 border border-[#D4AF37]/20 z-0"></div>
                                    <div className="absolute -inset-4 border border-[#D4AF37]/40 z-0 scale-95 opacity-50"></div>

                                    <div className="bg-gradient-to-b from-[#1A2035] to-[#0B1021] border border-[#D4AF37]/20 p-2 shadow-2xl relative overflow-hidden">
                                        <div className="aspect-[4/3] relative bg-black/50 overflow-hidden group">
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                                <ShieldCheckIcon className="h-48 w-48 text-[#D4AF37] opacity-30" />
                                            </div>

                                            <div className="absolute inset-0 bg-cover bg-center opacity-100 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${heroImg})` }}></div>

                                            <div className="absolute bottom-6 left-6 z-20 bg-black/70 backdrop-blur-md p-4 border-l-2 border-[#D4AF37]">
                                                <p className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-1">
                                                    Government Certified
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                    <span className="text-white font-mono text-xs">SYSTEM ACTIVE</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1, duration: 0.8 }}
                                        className="absolute -bottom-8 -left-12 bg-[#0F1629] p-5 border-l-4 border-[#D4AF37] shadow-xl max-w-xs z-30"
                                    >
                                        <div className="flex items-start gap-3">
                                            <CheckBadgeIcon className="h-6 w-6 text-[#D4AF37] flex-shrink-0" />
                                            <div>
                                                <h3 className="text-white font-bold text-xs mb-1 uppercase">
                                                    100% Verified
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    Every license linked to Ghana Card for complete identity assurance
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Angled Bottom Divider */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden z-20">
                        <svg
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                            className="absolute w-full h-full"
                        >
                            <path
                                d="M0,120 L1200,120 L1200,0 L0,80 Z"
                                fill="#0F1629"
                            ></path>
                        </svg>
                    </div>
                </section >

                {/* Find Your License - Curved Section */}
                <section id="licenses" className="bg-[#0F1629] py-20 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-stencil mb-4 text-white uppercase tracking-wider">Find Your Gun Model</h2>
                            <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-6 clip-trapezoid"></div>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Search by firearm make, model, or serial number to verify licensing requirements
                            </p>
                        </div>

                        {/* Search Form */}
                        {/* Search Form - Tactical Angled Bar */}
                        <div className="max-w-5xl mx-auto mb-20">
                            <div className="bg-[#1A2035] p-2 clip-chamfer">
                                <div className="grid md:grid-cols-12 gap-1">
                                    {/* Make Select */}
                                    <div className="md:col-span-4 bg-[#0B1021] flex items-center relative group">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]"></div>
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest hidden lg:block">Make</span>
                                        <select className="w-full h-14 pl-4 lg:pl-20 pr-4 bg-transparent text-white border-none focus:ring-0 font-medium uppercase tracking-wide cursor-pointer appearance-none">
                                            <option value="">Select Make...</option>
                                            <option value="glock">Glock</option>
                                            <option value="taurus">Taurus</option>
                                            <option value="beretta">Beretta</option>
                                            <option value="browning">Browning</option>
                                            <option value="remington">Remington</option>
                                            <option value="mossberg">Mossberg</option>
                                        </select>
                                        <div className="absolute right-4 pointer-events-none text-[#D4AF37]">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>

                                    {/* Model Select */}
                                    <div className="md:col-span-5 bg-[#0B1021] flex items-center relative">
                                        <div className="absolute left-0 top-2 bottom-2 w-px bg-white/10"></div>
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest hidden lg:block">Model</span>
                                        <select className="w-full h-14 pl-4 lg:pl-24 pr-4 bg-transparent text-white border-none focus:ring-0 font-medium uppercase tracking-wide cursor-pointer appearance-none">
                                            <option value="">Select Model...</option>
                                            <option value="g17">Glock 17 Gen5</option>
                                            <option value="g19">Glock 19 Gen5</option>
                                            <option value="g2c">Taurus G2C</option>
                                            <option value="ts9">Taurus TS9</option>
                                            <option value="92fs">Beretta 92FS</option>
                                            <option value="rem870">Remington 870</option>
                                            <option value="moss500">Mossberg 500</option>
                                        </select>
                                        <div className="absolute right-4 pointer-events-none text-[#D4AF37]">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <div className="md:col-span-3">
                                        <Link to="/licenses" className="w-full">
                                            <Button className="w-full h-14 bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold uppercase tracking-widest rounded-none">
                                                <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                                                SEARCH DB
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* License Categories */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {licenseCategories.map((category, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden bg-[#1A2035] border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300">
                                        <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${category.image})` }}></div>
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                                                <h3 className="text-2xl font-bold text-white mb-1 font-stencil tracking-wide uppercase">{category.title}</h3>
                                                <p className="text-sm text-gray-300 mb-2">{category.description}</p>
                                                <span className="text-xs text-[#D4AF37] font-semibold">{category.count}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-[#1A2035]">
                                            <Link
                                                to="/licenses"
                                                className="text-[#D4AF37] text-sm font-bold flex items-center group-hover:gap-2 transition-all"
                                            >
                                                View Requirements
                                                <ArrowRightIcon className="ml-2 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Angled Divider */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
                        <svg
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                            className="absolute w-full h-full"
                        >
                            <path d="M0,0 L1200,80 L1200,120 L0,120 Z" fill="#D4AF37"></path>
                        </svg>
                    </div>
                </section >

                {/* Quick Actions Strip */}
                < section className="bg-[#D4AF37] py-12" >
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-black/10">
                            <Link to="/licenses" className="flex items-center justify-center gap-4 group p-4">
                                <div className="bg-black/10 p-3 clip-chamfer group-hover:bg-black transition-colors">
                                    <MagnifyingGlassIcon className="h-6 w-6 text-black group-hover:text-[#D4AF37] transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-black text-lg">Verify License</h4>
                                    <p className="text-black/70 text-sm">Check validity instantly</p>
                                </div>
                            </Link>

                            <Link to="/alerts" className="flex items-center justify-center gap-4 group p-4">
                                <div className="bg-black/10 p-3 clip-chamfer group-hover:bg-black transition-colors">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-black group-hover:text-[#D4AF37] transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-black text-lg">Report Lost/Stolen</h4>
                                    <p className="text-black/70 text-sm">24/7 emergency reporting</p>
                                </div>
                            </Link>

                            <Link to="/dashboard" className="flex items-center justify-center gap-4 group p-4">
                                <div className="bg-black/10 p-3 clip-chamfer group-hover:bg-black transition-colors">
                                    <DocumentTextIcon className="h-6 w-6 text-black group-hover:text-[#D4AF37] transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-black text-lg">Track Application</h4>
                                    <p className="text-black/70 text-sm">Real-time status updates</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section >

                {/* Application Process Section */}
                < section className="py-24 bg-[#0B1021] relative" >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-stencil mb-4 text-white uppercase tracking-wider">How It Works</h2>
                            <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-6 clip-trapezoid"></div>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Simple, secure, and streamlined process from application to approval
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {applicationProcess.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    {/* Connector Line */}
                                    {index < applicationProcess.length - 1 && (
                                        <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-[#D4AF37]/20"></div>
                                    )}

                                    <div className="bg-[#1A2035] border border-white/5 p-8 hover:border-[#D4AF37]/50 transition-all duration-300">
                                        <div className="relative mb-6">
                                            <div className="h-16 w-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto border-2 border-[#D4AF37]">
                                                <step.icon className="h-8 w-8 text-[#D4AF37]" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 bg-[#D4AF37] text-black font-bold text-xs h-8 w-8 rounded-full flex items-center justify-center">
                                                {step.step}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-3 text-center">{step.title}</h3>
                                        <p className="text-gray-400 text-sm text-center leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/kyc/start">
                                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#B4941F] text-black font-bold clip-chamfer rounded-none uppercase tracking-wider">
                                    Start Your Application
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Angled Top */}
                    <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute w-full h-full">
                            <path
                                d="M1200,0 L0,0 L0,40 L1200,120 Z"
                                fill="#D4AF37"
                            ></path>
                        </svg>
                    </div>
                </section >
                < section className="py-24 bg-[#0B1021]" >
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#D4AF37] transform rotate-3 opacity-10"></div>
                                <div className="relative bg-[#1A2035] p-2 border border-white/5 overflow-hidden">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-80 hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${aboutImg})` }}></div>
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="absolute bottom-12 right-12 bg-black/90 px-8 py-4 border-l-4 border-[#D4AF37] shadow-xl backdrop-blur-sm z-10">
                                            <p className="text-[#D4AF37] text-3xl font-bold">21 Days</p>
                                            <p className="text-white text-sm uppercase tracking-wider">Avg. Processing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-stencil text-white mb-6 uppercase tracking-wider">About NFLTMS</h2>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    The <span className="text-[#D4AF37] font-semibold">National Firearm Licensing & Tracking Management System</span> is a government-owned digital platform operated by the Ghana Police Service in partnership with the Ministry of Interior.
                                </p>
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Launched in 2025, our mission is to modernize Ghana&apos;s firearm regulation through secure digital infrastructure while maintaining the highest standards of public safety and regulatory compliance.
                                </p>
                                <ul className="space-y-6">
                                    {[
                                        { title: 'Centralized Registry', desc: 'Single source of truth for all firearms in Ghana' },
                                        { title: 'Ghana Card Integration', desc: '100% biometric verification for every license' },
                                        { title: 'Real-time Tracking', desc: 'Complete audit trail from import to ownership' },
                                        { title: 'Mobile Access', desc: 'Digital licenses accessible anywhere, anytime' },
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <CheckCircleIcon className="h-6 w-6 text-[#D4AF37] flex-shrink-0 mt-1" />
                                            <div>
                                                <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                                                <p className="text-gray-400 text-sm">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/about">
                                    <Button variant="outline" className="mt-10 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black clip-chamfer rounded-none">
                                        Learn More About Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section >

                {/* People Using System - Success Stories */}
                < section className="py-24 bg-[#0F1629]" >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-stencil mb-4 text-white uppercase tracking-wider">
                                Trusted by License Holders Nationwide
                            </h2>
                            <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-6 clip-trapezoid"></div>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Join thousands of responsible firearm owners using our secure digital platform
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {successStories.map((story, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="aspect-square bg-[#1A2035] border border-white/5 overflow-hidden relative group cursor-pointer hover:border-[#D4AF37] transition-all"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                        <UserIcon className="h-16 w-16 text-[#D4AF37] opacity-20" />
                                    </div>
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${story.image})` }}></div>
                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300"></div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                        <p className="text-white text-xs font-semibold">{story.name}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-[#1A2035] p-8 border border-white/5">
                                <ChartBarIcon className="h-12 w-12 text-[#D4AF37] mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">98.5%</h3>
                                <p className="text-gray-400 text-sm">Approval Rate</p>
                            </div>
                            <div className="bg-[#1A2035] p-8 border border-white/5">
                                <UserGroupIcon className="h-12 w-12 text-[#D4AF37] mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">7,500+</h3>
                                <p className="text-gray-400 text-sm">Active License Holders</p>
                            </div>
                            <div className="bg-[#1A2035] p-8 border border-white/5">
                                <ClockIcon className="h-12 w-12 text-[#D4AF37] mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">14 Days</h3>
                                <p className="text-gray-400 text-sm">Average Processing Time</p>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Services & Pricing */}
                <section id="services" className="py-24 bg-[#0B1021]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-stencil mb-4 text-white uppercase tracking-wider">Featured Services</h2>
                            <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-6 clip-trapezoid"></div>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Transparent pricing for all licensing services
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {featuredServices.map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`bg-[#1A2035] border ${service.popular ? 'border-[#D4AF37]' : 'border-white/5'
                                        } p-8 relative hover:border-[#D4AF37] transition-all duration-300`}
                                >
                                    {service.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-black px-4 py-1 text-xs font-bold uppercase tracking-wider">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-[#D4AF37]">{service.price}</span>
                                        <span className="text-gray-400 text-sm">/application</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                                <CheckCircleIcon className="h-5 w-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to={index === 0 ? "/kyc/start" : index === 1 ? "/renewal" : "/dealer-registration"}>
                                        <Button
                                            className={`w-full ${service.popular
                                                ? 'bg-[#D4AF37] hover:bg-[#B4941F] text-black'
                                                : 'bg-white/5 hover:bg-white/10 text-white'
                                                } clip-chamfer rounded-none uppercase tracking-wider font-bold`}
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section >

                {/* Recent Licenses Issued */}
                < section className="py-24 bg-[#0F1629]" >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-stencil mb-4 text-white uppercase tracking-wider">Recently Issued Licenses</h2>
                            <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-6 clip-trapezoid"></div>
                            <p className="text-gray-400">Live updates from our secure registry</p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="bg-[#1A2035] border border-white/5 overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left p-4 text-[#D4AF37] text-sm font-bold uppercase tracking-wider">
                                                License ID
                                            </th>
                                            <th className="text-left p-4 text-[#D4AF37] text-sm font-bold uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="text-left p-4 text-[#D4AF37] text-sm font-bold uppercase tracking-wider">
                                                Holder
                                            </th>
                                            <th className="text-left p-4 text-[#D4AF37] text-sm font-bold uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentLicenses.map((license, index) => (
                                            <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-white font-mono text-sm">{license.id}</td>
                                                <td className="p-4 text-gray-300">{license.type}</td>
                                                <td className="p-4 text-gray-300">{license.holder}</td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 text-xs font-semibold">
                                                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                                        {license.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section >


                {/* Newsletter with Diagonal Background */}
                <section id="contact" className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-[#0B1021]">
                        <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url(${pistolLicenseImg})` }}></div>
                        <div className="absolute left-0 top-0 bottom-0 right-1/2 bg-[#0F1629]/95 transform skew-x-12 origin-top-left"></div>
                        <div className="absolute right-0 top-0 bottom-0 left-1/3 bg-gradient-to-r from-[#D4AF37]/90 to-[#B4941F]/90 transform -skew-x-12 origin-bottom-right"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-stencil mb-2 text-white uppercase tracking-wider">Stay Updated</h3>
                                <p className="text-gray-300">Get the latest news on firearm regulations and licensing</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <input
                                    type="email"
                                    placeholder="Enter Email Address"
                                    className="px-4 py-3 bg-white text-zinc-900 placeholder:text-zinc-400 flex-1 md:w-80 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                />
                                <Button className="bg-black hover:bg-zinc-900 text-white px-8 border border-white/10 clip-chamfer rounded-none uppercase tracking-wider font-bold">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Footer */}
                < footer className="bg-black text-white pt-20 pb-10 border-t border-white/10" >
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-4 gap-12 mb-16">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <ShieldCheckIcon className="h-10 w-10 text-[#D4AF37]" />
                                    <span className="text-2xl font-stencil tracking-wider">NFLTMS</span>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    Official digital platform for Ghana&apos;s firearm regulation and public safety monitoring.
                                </p>
                                <div className="flex gap-3">
                                    {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, i) => (
                                        <div
                                            key={i}
                                            className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#D4AF37] transition-colors cursor-pointer flex items-center justify-center"
                                        >
                                            <span className="text-xs font-bold">{social[0]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li>
                                        <a href="/kyc/start" className="hover:text-[#D4AF37] transition-colors">
                                            New License Application
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/licences/renew" className="hover:text-[#D4AF37] transition-colors">
                                            License Renewal
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/dealer/register" className="hover:text-[#D4AF37] transition-colors">
                                            Dealer Registration
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/agency/register" className="hover:text-[#D4AF37] transition-colors">
                                            Agency Registration
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li>
                                        <a href="/faq" className="hover:text-[#D4AF37] transition-colors">
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/guides" className="hover:text-[#D4AF37] transition-colors">
                                            User Guides
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/privacy" className="hover:text-[#D4AF37] transition-colors">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/contact" className="hover:text-[#D4AF37] transition-colors">
                                            Contact Support
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
                                <ul className="space-y-4 text-sm text-gray-400">
                                    <li className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                        <span>
                                            Ghana Police Headquarters
                                            <br />
                                            Accra, Ghana
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <PhoneIcon className="h-5 w-5 text-[#D4AF37]" />
                                        <span>+233 (0) 30 277 3906</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <EnvelopeIcon className="h-5 w-5 text-[#D4AF37]" />
                                        <span>info@nfltms.gov.gh</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                            <p>© {new Date().getFullYear()} Republic of Ghana. All Rights Reserved.</p>
                            <div className="flex gap-2">
                                {['VISA', 'MASTERCARD', 'MOMO', 'AMEX', 'DISCOVER', 'PAYPAL'].map((method) => (
                                    <div
                                        key={method}
                                        className="h-8 px-3 bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-bold"
                                    >
                                        {method}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer >
            </div>
        </div >
    );
}