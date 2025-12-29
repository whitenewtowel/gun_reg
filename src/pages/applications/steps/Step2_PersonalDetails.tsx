import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Phone, MapPin, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Step2_PersonalDetails({ formData, updateFormData, onNext, onPrev }: StepProps) {
    const { user } = useAuth();

    // Pre-fill data from user context if not already in formData
    useEffect(() => {
        if (Object.keys(formData.personalDetails).length === 0 && user) {
            updateFormData({
                personalDetails: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    // address would come from user profile in a real scenario
                    address: '',
                    city: '',
                    region: '',
                }
            });
        }
    }, [user, formData.personalDetails, updateFormData]);

    const handleChange = (field: string, value: string) => {
        updateFormData({
            personalDetails: {
                ...formData.personalDetails,
                [field]: value,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                <p className="text-gray-400">Please verify your personal details and provide your current residential address.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-lg border border-white/10">
                <div className="space-y-1">
                    <Label className="text-gray-500 text-xs uppercase tracking-wider">Full Name</Label>
                    <div className="flex items-center gap-2 text-lg font-medium text-white">
                        <User className="w-4 h-4 text-[#D4AF37]" />
                        {formData.personalDetails.firstName} {formData.personalDetails.lastName}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-gray-500 text-xs uppercase tracking-wider">Email Address</Label>
                    <div className="flex items-center gap-2 text-lg font-medium text-white">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                        {formData.personalDetails.email}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-gray-500 text-xs uppercase tracking-wider">Phone Number</Label>
                    <div className="flex items-center gap-2 text-lg font-medium text-white">
                        <Phone className="w-4 h-4 text-[#D4AF37]" />
                        {formData.personalDetails.phone || 'Not set'}
                    </div>
                </div>
            </div>

            <div className="pt-4 space-y-4">
                <h3 className="text-lg font-semibold text-[#D4AF37] flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Residential Address
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-300">Street Address</Label>
                        <Input
                            id="address"
                            value={formData.personalDetails.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50"
                            placeholder="e.g. 12 Independence Avenue"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-gray-300">City / Town</Label>
                            <Input
                                id="city"
                                value={formData.personalDetails.city || ''}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50"
                                placeholder="e.g. Accra"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="region" className="text-gray-300">Region</Label>
                            <Input
                                id="region"
                                value={formData.personalDetails.region || ''}
                                onChange={(e) => handleChange('region', e.target.value)}
                                className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50"
                                placeholder="e.g. Greater Accra"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
                <Button
                    variant="outline"
                    onClick={onPrev}
                    className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button
                    onClick={onNext}
                    // Basic validation: check if address fields are filled
                    disabled={!formData.personalDetails.address || !formData.personalDetails.city}
                    className="bg-[#D4AF37] text-black hover:bg-[#B4941F]"
                >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
