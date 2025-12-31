import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    CheckCircleIcon,
    UserCircleIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    DocumentTextIcon,
    PhotoIcon,
    ShieldCheckIcon,
    HomeIcon,
    PlusIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

interface Reference {
    full_name: string;
    email: string;
    phone: string;
    profession: string;
    address: string;
    digital_address: string;
}

export default function CompleteApplications() {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    // Basic Info
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

    // Permit Application Data
    const [permitData, setPermitData] = useState({
        purpose: 'PERSONAL_SECURITY',
        storage_description: ''
    });

    // References (minimum 2)
    const [references, setReferences] = useState<Reference[]>([
        {
            full_name: '',
            email: '',
            phone: '',
            profession: '',
            address: '',
            digital_address: ''
        },
        {
            full_name: '',
            email: '',
            phone: '',
            profession: '',
            address: '',
            digital_address: ''
        }
    ]);

    // File uploads
    const [files, setFiles] = useState({
        passport_photos: [] as File[],
        medical_certificate: null as File | null,
        police_clearance: null as File | null,
        proof_of_residence: null as File | null,
        letter_of_intent: null as File | null,
        storage_photos: [] as File[]
    });

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Fetch user data from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        fullName: data.user.full_name || 'Bernard Wiafe',
                        ghanaCardNumber: 'GHA-123456789-1',
                        dateOfBirth: '1997-06-06',
                        address: 'GA-123-4567, Accra, Greater Accra',
                        phone: data.user.phone || '',
                        email: data.user.email || '',
                        region: data.user.region_data?.name || 'Greater Accra',
                        district: 'Accra Metropolis',
                        city: data.user.city || 'Accra'
                    });
                } else {
                    setFormData({
                        fullName: authUser?.firstName && authUser?.lastName
                            ? `${authUser.firstName} ${authUser.lastName}`
                            : 'Bernard Wiafe',
                        ghanaCardNumber: authUser?.ghanaCardNumber || 'GHA-123456789-1',
                        dateOfBirth: '1997-06-06',
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
                setFormData({
                    fullName: 'Bernard Wiafe',
                    ghanaCardNumber: 'GHA-123456789-1',
                    dateOfBirth: '1997-06-06',
                    address: 'GA-123-4567, Accra, Greater Accra',
                    phone: '+233541185762',
                    email: 'bernard@example.com',
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePermitDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPermitData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReferenceChange = (index: number, field: keyof Reference, value: string) => {
        const newReferences = [...references];
        newReferences[index] = {
            ...newReferences[index],
            [field]: value
        };
        setReferences(newReferences);
    };

    const addReference = () => {
        setReferences([...references, {
            full_name: '',
            email: '',
            phone: '',
            profession: '',
            address: '',
            digital_address: ''
        }]);
    };

    const removeReference = (index: number) => {
        if (references.length > 2) {
            setReferences(references.filter((_, i) => i !== index));
        } else {
            toast.error('At least 2 references are required');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof files) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        if (fieldName === 'passport_photos' || fieldName === 'storage_photos') {
            setFiles(prev => ({
                ...prev,
                [fieldName]: Array.from(selectedFiles)
            }));
        } else {
            setFiles(prev => ({
                ...prev,
                [fieldName]: selectedFiles[0]
            }));
        }
    };

    const validateStep1 = () => {
        if (!formData.phone || !formData.email) {
            toast.error('Please provide your phone number and email address');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        const phoneRegex = /^(0|\+233)[0-9]{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Please enter a valid Ghana phone number');
            return false;
        }

        return true;
    };

    const validateStep2 = () => {
        if (!permitData.storage_description) {
            toast.error('Please describe your firearm storage facility');
            return false;
        }

        // Validate references
        for (let i = 0; i < Math.min(2, references.length); i++) {
            const ref = references[i];
            if (!ref.full_name || !ref.email || !ref.phone || !ref.profession) {
                toast.error(`Please complete all fields for Reference ${i + 1}`);
                return false;
            }
        }

        return true;
    };

    const validateStep3 = () => {
        if (!files.medical_certificate) {
            toast.error('Medical certificate is required');
            return false;
        }
        if (!files.police_clearance) {
            toast.error('Police clearance certificate is required');
            return false;
        }
        if (!files.proof_of_residence) {
            toast.error('Proof of residence is required');
            return false;
        }
        if (files.passport_photos.length === 0) {
            toast.error('At least one passport photo is required');
            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
        if (currentStep === 3 && !validateStep3()) return;

        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!agreedToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            // Create FormData for multipart upload
            const formDataToSend = new FormData();

            // Add text fields
            formDataToSend.append('purpose', permitData.purpose);
            formDataToSend.append('storage_description', permitData.storage_description);
            formDataToSend.append('references', JSON.stringify(references));

            // Add file uploads
            files.passport_photos.forEach((file) => {
                formDataToSend.append('passport_photos', file);
            });

            if (files.medical_certificate) {
                formDataToSend.append('medical_certificate', files.medical_certificate);
            }

            if (files.police_clearance) {
                formDataToSend.append('police_clearance', files.police_clearance);
            }

            if (files.proof_of_residence) {
                formDataToSend.append('proof_of_residence', files.proof_of_residence);
            }

            if (files.letter_of_intent) {
                formDataToSend.append('letter_of_intent', files.letter_of_intent);
            }

            files.storage_photos.forEach((file) => {
                formDataToSend.append('storage_photos', file);
            });

            // Submit to API
            // Submit to API
            await apiClient.post('/applications', formDataToSend);

            // Update onboarding context
            const onboardingContext = {
                type: 'INDIVIDUAL',
                status: 'COMPLETED'
            };
            localStorage.setItem('onboarding_context', JSON.stringify(onboardingContext));

            toast.success('Application submitted successfully!');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-[#1A2035] mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-500">Loading your information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-[#1A2035] font-technical relative overflow-hidden">
            {/* Background Effects - Simplified for light theme */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1A2035]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#1A2035]" />
                        <span className="px-4 text-[#1A2035] text-xs font-bold tracking-[0.3em] uppercase">
                            Permit Application
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#1A2035]" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-stencil uppercase tracking-wider mb-4 text-[#1A2035]">
                        Apply for Firearm Permit
                    </h1>

                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Complete your application to purchase a firearm
                    </p>

                    {/* Progress Steps */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= step
                                    ? 'bg-[#1A2035] text-white'
                                    : 'bg-gray-200 text-gray-400'
                                    }`}>
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div className={`w-16 h-1 ${currentStep > step ? 'bg-[#1A2035]' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Step Content */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg"
                >
                    {/* Step 1: Contact Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-stencil text-[#1A2035] mb-6">Contact Information</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <PhoneIcon className="w-4 h-4 inline mr-2" />
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="0244123456"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <MapPinIcon className="w-4 h-4 inline mr-2" />
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <UserCircleIcon className="w-4 h-4 inline mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Permit Details & References */}
                    {currentStep === 2 && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-stencil text-[#1A2035] mb-6">Permit Details</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">
                                            <ShieldCheckIcon className="w-4 h-4 inline mr-2" />
                                            Purpose <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="purpose"
                                            value={permitData.purpose}
                                            onChange={handlePermitDataChange}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                        >
                                            <option value="PERSONAL_SECURITY">Personal Security</option>
                                            <option value="HUNTING">Hunting</option>
                                            <option value="SPORT_SHOOTING">Sport Shooting</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">
                                            <HomeIcon className="w-4 h-4 inline mr-2" />
                                            Storage Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="storage_description"
                                            value={permitData.storage_description}
                                            onChange={handlePermitDataChange}
                                            placeholder="Describe where and how you will store the firearm (e.g., Wall-mounted gun safe in bedroom)"
                                            rows={3}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* References */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-[#1A2035]">References (Minimum 2)</h3>
                                    <button
                                        onClick={addReference}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#1A2035]/10 text-[#1A2035] rounded-lg hover:bg-[#1A2035]/20"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add Reference
                                    </button>
                                </div>

                                {references.map((ref, index) => (
                                    <div key={index} className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-[#1A2035]">Reference {index + 1}</h4>
                                            {references.length > 2 && (
                                                <button
                                                    onClick={() => removeReference(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Full Name *"
                                                value={ref.full_name}
                                                onChange={(e) => handleReferenceChange(index, 'full_name', e.target.value)}
                                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A2035] focus:outline-none focus:ring-1 focus:ring-[#1A2035]"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email *"
                                                value={ref.email}
                                                onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A2035] focus:outline-none focus:ring-1 focus:ring-[#1A2035]"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone *"
                                                value={ref.phone}
                                                onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A2035] focus:outline-none focus:ring-1 focus:ring-[#1A2035]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Profession *"
                                                value={ref.profession}
                                                onChange={(e) => handleReferenceChange(index, 'profession', e.target.value)}
                                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A2035] focus:outline-none focus:ring-1 focus:ring-[#1A2035]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address"
                                                value={ref.address}
                                                onChange={(e) => handleReferenceChange(index, 'address', e.target.value)}
                                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A2035] focus:outline-none focus:ring-1 focus:ring-[#1A2035]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Digital Address (e.g., GA-123-4567)"
                                                value={ref.digital_address}
                                                onChange={(e) => handleReferenceChange(index, 'digital_address', e.target.value)}
                                                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#1A2035] focus:outline-none focus:ring-1 focus:ring-[#1A2035]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Document Uploads */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-stencil text-[#1A2035] mb-6">Required Documents</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Passport Photos */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <PhotoIcon className="w-4 h-4 inline mr-2" />
                                        Passport Photos <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'passport_photos')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A2035] file:text-white hover:file:bg-[#2c3554]"
                                    />
                                    {files.passport_photos.length > 0 && (
                                        <p className="text-xs text-green-600 mt-1">{files.passport_photos.length} file(s) selected</p>
                                    )}
                                </div>

                                {/* Medical Certificate */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                                        Medical Certificate <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange(e, 'medical_certificate')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A2035] file:text-white hover:file:bg-[#2c3554]"
                                    />
                                    {files.medical_certificate && (
                                        <p className="text-xs text-green-600 mt-1">{files.medical_certificate.name}</p>
                                    )}
                                </div>

                                {/* Police Clearance */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <ShieldCheckIcon className="w-4 h-4 inline mr-2" />
                                        Police Clearance <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange(e, 'police_clearance')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A2035] file:text-white hover:file:bg-[#2c3554]"
                                    />
                                    {files.police_clearance && (
                                        <p className="text-xs text-green-600 mt-1">{files.police_clearance.name}</p>
                                    )}
                                </div>

                                {/* Proof of Residence */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <HomeIcon className="w-4 h-4 inline mr-2" />
                                        Proof of Residence <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange(e, 'proof_of_residence')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A2035] file:text-white hover:file:bg-[#2c3554]"
                                    />
                                    {files.proof_of_residence && (
                                        <p className="text-xs text-green-600 mt-1">{files.proof_of_residence.name}</p>
                                    )}
                                </div>

                                {/* Letter of Intent */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                                        Letter of Intent (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileChange(e, 'letter_of_intent')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A2035] file:text-white hover:file:bg-[#2c3554]"
                                    />
                                    {files.letter_of_intent && (
                                        <p className="text-xs text-green-600 mt-1">{files.letter_of_intent.name}</p>
                                    )}
                                </div>

                                {/* Storage Photos */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        <PhotoIcon className="w-4 h-4 inline mr-2" />
                                        Storage Photos (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'storage_photos')}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A2035] file:text-white hover:file:bg-[#2c3554]"
                                    />
                                    {files.storage_photos.length > 0 && (
                                        <p className="text-xs text-green-600 mt-1">{files.storage_photos.length} file(s) selected</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review & Submit */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-stencil text-[#1A2035] mb-6">Review & Submit</h2>

                            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div>
                                    <h3 className="font-bold text-[#1A2035] mb-2">Contact Information</h3>
                                    <p className="text-gray-600">Email: {formData.email}</p>
                                    <p className="text-gray-600">Phone: {formData.phone}</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#1A2035] mb-2">Permit Details</h3>
                                    <p className="text-gray-600">Purpose: {permitData.purpose.replace('_', ' ')}</p>
                                    <p className="text-gray-600">Storage: {permitData.storage_description}</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#1A2035] mb-2">References</h3>
                                    <p className="text-gray-600">{references.length} reference(s) provided</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#1A2035] mb-2">Documents</h3>
                                    <ul className="text-gray-600 space-y-1">
                                        <li>✓ Passport Photos: {files.passport_photos.length} file(s)</li>
                                        <li>✓ Medical Certificate: {files.medical_certificate ? 'Uploaded' : 'Missing'}</li>
                                        <li>✓ Police Clearance: {files.police_clearance ? 'Uploaded' : 'Missing'}</li>
                                        <li>✓ Proof of Residence: {files.proof_of_residence ? 'Uploaded' : 'Missing'}</li>
                                        {files.letter_of_intent && <li>✓ Letter of Intent: Uploaded</li>}
                                        {files.storage_photos.length > 0 && <li>✓ Storage Photos: {files.storage_photos.length} file(s)</li>}
                                    </ul>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="border-t border-gray-200 pt-6">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#1A2035] focus:ring-[#1A2035]"
                                    />
                                    <span className="text-sm text-gray-600">
                                        I confirm that all information provided is accurate and I agree to the terms and conditions
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-[#1A2035] hover:bg-gray-50"
                            >
                                Back
                            </button>
                        )}

                        {currentStep < 4 ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 px-6 py-3 bg-[#1A2035] text-white font-bold rounded-xl hover:bg-[#2c3554] shadow-lg shadow-gray-200"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !agreedToTerms}
                                className="flex-1 px-6 py-3 bg-[#1A2035] text-white font-bold rounded-xl hover:bg-[#2c3554] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Submit Application
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
