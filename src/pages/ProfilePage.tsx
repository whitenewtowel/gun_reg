import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    User as UserIcon,
    Mail,
    Phone,
    CreditCard,
    Shield,
    Save,
    X,
    Edit2,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

// Validation Schema
const profileSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    phone: z.string().regex(/^[0-9+\s-]{10,}$/, 'Invalid phone number').optional().or(z.literal('')),
    ghanaCardNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user } = useAuth(); // We might need to update local user state, but AuthContext doesn't expose a setUser directly. 
    // Ideally AuthContext should have a refreshProfile method. 
    // For now we rely on the component state for immediate feedback.
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            ghanaCardNumber: ''
        }
    });

    // Fetch latest profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const response = await userService.getProfile();
            if (response.success && response.data) {
                reset({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phone: response.data.phone || '',
                    ghanaCardNumber: response.data.ghanaCardNumber || ''
                });
            } else {
                toast.error('Failed to load profile data');
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, [reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        const response = await userService.updateProfile(data);

        if (response.success) {
            toast.success('Profile updated successfully');
            setIsEditing(false);
            // Ideally trigger a re-fetch of user in AuthContext here if needed
        } else {
            toast.error(response.message || 'Failed to update profile');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1A2035]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A2035] mb-2">My Profile</h1>
                    <p className="text-gray-500">Manage your personal information and account settings.</p>
                </div>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#1A2035] text-white hover:bg-[#2c3554] shadow-lg shadow-[#1A2035]/20"
                    >
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    {/* Personal Information Card */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-[#1A2035]" />
                                <CardTitle className="text-[#1A2035]">Personal Information</CardTitle>
                            </div>
                            <CardDescription>Your primary identification details.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 grid md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-gray-600">First Name</Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="firstName"
                                            {...register('firstName')}
                                            className="bg-white border-gray-200 text-[#1A2035] focus:border-[#1A2035] focus:ring-[#1A2035]/20"
                                        />
                                        {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                                    </>
                                ) : (
                                    <div className="p-2.5 rounded-md bg-gray-50 text-[#1A2035] border border-gray-100 font-medium">
                                        {user?.firstName}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-gray-600">Last Name</Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="lastName"
                                            {...register('lastName')}
                                            className="bg-white border-gray-200 text-[#1A2035] focus:border-[#1A2035] focus:ring-[#1A2035]/20"
                                        />
                                        {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                                    </>
                                ) : (
                                    <div className="p-2.5 rounded-md bg-gray-50 text-[#1A2035] border border-gray-100 font-medium">
                                        {user?.lastName}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-600 flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" /> Email Address
                                </Label>
                                <div className="p-2.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100 flex justify-between items-center">
                                    {user?.email}
                                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-200">VERIFIED</span>
                                </div>
                                <p className="text-[10px] text-gray-500">Email cannot be changed directly.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-600 flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5" /> Phone Number
                                </Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="phone"
                                            {...register('phone')}
                                            className="bg-white border-gray-200 text-[#1A2035] focus:border-[#1A2035] focus:ring-[#1A2035]/20"
                                            placeholder="+233..."
                                        />
                                        {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                                    </>
                                ) : (
                                    <div className="p-2.5 rounded-md bg-gray-50 text-[#1A2035] border border-gray-100 font-medium">
                                        {user?.phone || <span className="text-gray-500 italic">Not set</span>}
                                    </div>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* Identity & Security */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-[#1A2035]" />
                                <CardTitle className="text-[#1A2035]">Identity & Verification</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ghanaCardNumber" className="text-gray-600 flex items-center gap-2">
                                    <CreditCard className="h-3.5 w-3.5" /> Ghana Card Number
                                </Label>
                                {isEditing ? (
                                    <>
                                        <Input
                                            id="ghanaCardNumber"
                                            {...register('ghanaCardNumber')}
                                            className="bg-white border-gray-200 text-[#1A2035] focus:border-[#1A2035] focus:ring-[#1A2035]/20"
                                            placeholder="GHA-..."
                                        />
                                    </>
                                ) : (
                                    <div className="p-2.5 rounded-md bg-gray-50 text-[#1A2035] border border-gray-100 font-mono font-medium">
                                        {user?.ghanaCardNumber || <span className="text-gray-500 italic">Not verified</span>}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-600">Account Role</Label>
                                <div className="p-2.5 rounded-md bg-[#1A2035]/10 text-[#1A2035] border border-[#1A2035]/20 font-bold text-sm inline-block">
                                    {user?.role?.replace('_', ' ')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                reset(); // Revert changes
                            }}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            disabled={isSaving}
                        >
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#1A2035] text-white hover:bg-[#2c3554] shadow-md"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
