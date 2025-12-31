import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    UserCircleIcon,
    BellIcon,
    ShieldCheckIcon,
    KeyIcon,
    GlobeAltIcon,
    DevicePhoneMobileIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import GhanaCard from '@/components/GhanaCard';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    // Profile settings
    const [profileData, setProfileData] = useState({
        fullName: 'Bernard Wiafe',
        email: 'bernard@example.com',
        phone: '+233541185762',
        city: 'Accra',
        region: 'Greater Accra',
        // Ghana Card Details (Read-only)
        ghanaCardNumber: 'GHA-123456789-0',
        dateOfBirth: '1990-05-15',
        sex: 'M',
        district: 'Accra Metropolis',
        issueDate: '2020-01-15',
        expiryDate: '2030-01-15',
        address: 'Hse No 24, Block B, Madina',
        photoUrl: '/assets/ghanaian-hunter.png' // Utilizing existing asset as placeholder
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: true,
        applicationUpdates: true,
        licenseExpiry: true,
        paymentReceipts: true,
        securityAlerts: true
    });

    // ... (rest of state remain same)

    const [security, setSecuritySettings] = useState({
        twoFactorAuth: false,
        loginAlerts: true
    });

    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
            // API call to update profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // ... (other handlers)

    const handleNotificationUpdate = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Notification preferences updated');
        } catch (error) {
            toast.error('Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleSecurityUpdate = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Security settings updated');
        } catch (error) {
            toast.error('Failed to update security settings');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserCircleIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'preferences', name: 'Preferences', icon: GlobeAltIcon }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#1A2035] mb-2">Settings</h1>
                <p className="text-gray-500">Manage your account settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'text-[#1A2035] border-b-2 border-[#1A2035]'
                            : 'text-gray-500 hover:text-[#1A2035]'
                            }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        {/* Ghana Card Display */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-[#1A2035] mb-4">National Identification</h3>
                            <GhanaCard
                                fullName={profileData.fullName}
                                ghanaCardNumber={profileData.ghanaCardNumber}
                                dateOfBirth={profileData.dateOfBirth}
                                sex={profileData.sex}
                                nationality="Ghanaian"
                                region={profileData.region}
                                district={profileData.district}
                                address={profileData.address}
                                issueDate={profileData.issueDate}
                                expiryDate={profileData.expiryDate}
                                photoUrl={profileData.photoUrl} // Use local mock data or context
                            />
                        </div>

                        <h2 className="text-xl font-bold text-[#1A2035] mb-4">Personal Information (Editable)</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    <UserCircleIcon className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    <PhoneIcon className="w-4 h-4 inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={profileData.city}
                                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    Region
                                </label>
                                <input
                                    type="text"
                                    value={profileData.region}
                                    onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleProfileUpdate}
                            disabled={loading}
                            className="px-6 py-3 bg-[#1A2035] text-white font-bold rounded-xl hover:bg-[#2c3554] disabled:opacity-50 shadow-lg shadow-gray-200"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-[#1A2035] mb-4">Notification Preferences</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <EnvelopeIcon className="w-5 h-5 text-[#1A2035]" />
                                    <div>
                                        <p className="font-medium text-[#1A2035]">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive updates via email</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNotifications}
                                        onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2035]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <DevicePhoneMobileIcon className="w-5 h-5 text-[#1A2035]" />
                                    <div>
                                        <p className="font-medium text-[#1A2035]">SMS Notifications</p>
                                        <p className="text-sm text-gray-500">Receive updates via SMS</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.smsNotifications}
                                        onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2035]"></div>
                                </label>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <h3 className="font-bold text-[#1A2035] mb-3">Notification Types</h3>

                                {[
                                    { key: 'applicationUpdates', label: 'Application Updates', desc: 'Status changes on your applications' },
                                    { key: 'licenseExpiry', label: 'License Expiry Reminders', desc: 'Alerts before license expiration' },
                                    { key: 'paymentReceipts', label: 'Payment Receipts', desc: 'Confirmation of payments' },
                                    { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div>
                                            <p className="font-medium text-[#1A2035]">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.key as keyof typeof notifications]}
                                                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2035]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleNotificationUpdate}
                            disabled={loading}
                            className="px-6 py-3 bg-[#1A2035] text-white font-bold rounded-xl hover:bg-[#2c3554] disabled:opacity-50 shadow-lg shadow-gray-200"
                        >
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-[#1A2035] mb-4">Security Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <ShieldCheckIcon className="w-5 h-5 text-[#1A2035]" />
                                    <div>
                                        <p className="font-medium text-[#1A2035]">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={security.twoFactorAuth}
                                        onChange={(e) => setSecuritySettings({ ...security, twoFactorAuth: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2035]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <BellIcon className="w-5 h-5 text-[#1A2035]" />
                                    <div>
                                        <p className="font-medium text-[#1A2035]">Login Alerts</p>
                                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={security.loginAlerts}
                                        onChange={(e) => setSecuritySettings({ ...security, loginAlerts: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A2035]"></div>
                                </label>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <h3 className="font-bold text-[#1A2035] mb-3">Password</h3>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-[#1A2035] rounded-xl hover:bg-gray-100">
                                    <KeyIcon className="w-4 h-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSecurityUpdate}
                            disabled={loading}
                            className="px-6 py-3 bg-[#1A2035] text-white font-bold rounded-xl hover:bg-[#2c3554] disabled:opacity-50 shadow-lg shadow-gray-200"
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-[#1A2035] mb-4">General Preferences</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Language</label>
                                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]">
                                    <option value="en">English</option>
                                    <option value="tw">Twi</option>
                                    <option value="ga">Ga</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Timezone</label>
                                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]">
                                    <option value="GMT">GMT (Ghana)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Date Format</label>
                                <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#1A2035] focus:outline-none focus:ring-2 focus:ring-[#1A2035]/20 focus:border-[#1A2035]">
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="px-6 py-3 bg-[#1A2035] text-white font-bold rounded-xl hover:bg-[#2c3554] disabled:opacity-50 shadow-lg shadow-gray-200"
                        >
                            Save Preferences
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
