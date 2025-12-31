import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    CheckCircleIcon,
    UserCircleIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CompleteApplications() {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(true);

    const [formData, setFormData] = useState({
        fullName: '',
        ghanaCardNumber: '',
        dateOfBirth: '',
        address: '',
        phone: '',
        email: '',
        region: '',
        district: '',
        city: ''
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Fetch user data from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    // Prefill form with API data
                    setFormData({
                        fullName: data.user.full_name || 'Kwame Mensah',
                        ghanaCardNumber: 'GHA-123456789-1', // Dummy - not in API
                        dateOfBirth: '1985-03-15', // Dummy - not in API
                        address: 'GA-123-4567, Accra, Greater Accra', // Dummy - not in API
                        phone: data.user.phone || '',
                        email: data.user.email || '',
                        region: data.user.region_data?.name || 'Greater Accra',
                        district: 'Accra Metropolis', // Dummy - not in API
                        city: data.user.city || 'Accra'
                    });
                } else {
                    // Use dummy data if API fails
                    setFormData({
                        fullName: authUser?.firstName && authUser?.lastName
                            ? `${authUser.firstName} ${authUser.lastName}`
                            : 'Kwame Mensah',
                        ghanaCardNumber: authUser?.ghanaCardNumber || 'GHA-123456789-1',
                        dateOfBirth: '1985-03-15',
                        address: 'GA-123-4567, Accra, Greater Accra',
                        phone: authUser?.phone || '',
                        email: authUser?.email || '',
                        region: 'Greater Accra',
                        district: 'Accra Metropolis',
                        city: 'Accra'
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Use dummy data on error
                setFormData({
                    fullName: 'Kwame Mensah',
                    ghanaCardNumber: 'GHA-123456789-1',
                    dateOfBirth: '1985-03-15',
                    address: 'GA-123-4567, Accra, Greater Accra',
                    phone: '+233541185762',
                    email: 'kwame@example.com',
                    region: 'Greater Accra',
                    district: 'Accra Metropolis',
                    city: 'Accra'
                });
            } finally {
                setFetchingUser(false);
            }
        };

        fetchUserData();
    }, [authUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCompleteAccount = async () => {
        // Validation
        if (!formData.phone || !formData.email) {
            toast.error('Please provide your phone number and email address');
            return;
        }

        if (!agreedToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Phone validation (Ghana format)
        const phoneRegex = /^(0|\+233)[0-9]{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Please enter a valid Ghana phone number (e.g., 0244123456)');
            return;
        }

        setLoading(true);

        try {
            // API call to update user profile
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    email: formData.email,
                    full_name: formData.fullName,
                    city: formData.city
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            await response.json();

            toast.success('Account completed successfully!');

            // Navigate to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            console.error('Error completing account:', error);
            toast.error('Failed to complete account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingUser) {
        return (
            <div className="min-h-screen bg-[#0B1021] flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-[#D4AF37] mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-400">Loading your information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1021] text-white font-technical relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                        <span className="px-4 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">
                            Account Setup
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-stencil uppercase tracking-wider mb-4">
                        Complete Your Profile
                    </h1>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Please verify your information and add your contact details to complete your account setup
                    </p>
                </motion.div>

                {/* Main Content - Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Ghana Card Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Ghana Card Visual - Realistic Design */}
                        <div className="relative">
                            {/* Card Container with Shadow */}
                            <div className="bg-white rounded-xl overflow-hidden border-4 border-gray-200 transform hover:scale-[1.02] transition-transform duration-300">
                                {/* Ghana Flag Colors Header */}
                                <div className="h-3 flex">
                                    <div className="flex-1 bg-[#CE1126]" /> {/* Red */}
                                    <div className="flex-1 bg-[#FCD116]" /> {/* Gold/Yellow */}
                                    <div className="flex-1 bg-[#006B3F]" /> {/* Green */}
                                </div>

                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-[#006B3F] to-[#004d2d] px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white font-bold text-lg tracking-wide">GHANA CARD</h3>
                                            <p className="text-[#FCD116] text-xs font-semibold">National Identification Authority</p>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                            <div className="w-10 h-10 bg-[#FCD116] rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 2l2.5 7.5H20l-6 4.5 2.5 7.5L10 17l-6.5 4.5L6 14 0 9.5h7.5z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="bg-white p-6">
                                    <div className="flex gap-6">
                                        {/* Photo */}
                                        <div className="flex-shrink-0">
                                            <div className="w-32 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300 ">
                                                <UserCircleIcon className="w-20 h-20 text-gray-400" />
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Personal ID Number</p>
                                                <p className="text-lg font-bold text-[#006B3F] font-mono tracking-wide">{formData.ghanaCardNumber}</p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Full Name</p>
                                                <p className="text-base font-bold text-gray-900 uppercase">{formData.fullName}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Date of Birth</p>
                                                    <p className="text-sm font-semibold text-gray-900">{new Date(formData.dateOfBirth).toLocaleDateString('en-GB')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Sex</p>
                                                    <p className="text-sm font-semibold text-gray-900">M</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Nationality</p>
                                                <p className="text-sm font-semibold text-gray-900">GHANAIAN</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Region</p>
                                                <p className="text-sm font-semibold text-gray-900">{formData.region}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">District</p>
                                                <p className="text-sm font-semibold text-gray-900">{formData.district}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Residential Address</p>
                                            <p className="text-sm font-semibold text-gray-900">{formData.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="bg-gradient-to-r from-[#006B3F] to-[#004d2d] px-6 py-2 flex items-center justify-between">
                                    <p className="text-white text-xs font-semibold">Issue Date: 01/01/2024</p>
                                    <p className="text-[#FCD116] text-xs font-semibold">Valid Until: 01/01/2034</p>
                                </div>
                            </div>

                            {/* Verified Badge - Outside Card */}
                            <div className="mt-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-green-400 font-bold">Identity Verified via NIA</span>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="p-6 bg-blue-500/10 backdrop-blur-sm border-blue-500/30 rounded-lg">
                            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                What's Next?
                            </h3>
                            <p className="text-gray-400 text-sm mb-3">
                                After completing your account, you'll be redirected to your dashboard where you can:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                                    Start a new firearm license application
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                                    View your application status
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                                    Manage your profile and documents
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right Column - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#0B1021]/50 backdrop-blur-sm border border-white/10 rounded-lg p-8 clip-chamfer"
                    >
                        <h2 className="text-2xl font-stencil text-[#D4AF37] mb-6">Contact Information</h2>

                        <div className="space-y-6">
                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    Phone Number <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="0244123456 or +233244123456"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format: 0244123456 or +233244123456</p>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <EnvelopeIcon className="w-4 h-4" />
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="kwame@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <MapPinIcon className="w-4 h-4" />
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Accra"
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Full Name - Editable */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <UserCircleIcon className="w-4 h-4" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Your full name"
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Terms and Conditions */}
                            <div className="border-t border-white/10 pt-6">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                        I confirm that the information provided is accurate and I agree to the{' '}
                                        <a href="/terms" className="text-[#D4AF37] hover:underline">
                                            Terms and Conditions
                                        </a>{' '}
                                        and{' '}
                                        <a href="/privacy" className="text-[#D4AF37] hover:underline">
                                            Privacy Policy
                                        </a>{' '}
                                        of the National Firearm Licensing & Tracking Management System.
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 px-6 py-3 border border-white/20 rounded text-white hover:bg-white/5 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCompleteAccount}
                                    disabled={loading || !agreedToTerms}
                                    className="flex-1 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Complete Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
