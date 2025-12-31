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

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    // Profile settings
    const [profileData, setProfileData] = useState({
        fullName: 'Bernard Wiafe',
        email: 'bernard@example.com',
        phone: '+233541185762',
        city: 'Accra',
        region: 'Greater Accra'
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: true,
        applicationUpdates: true,
        licenseExpiry: true,
        paymentReceipts: true,
        securityAlerts: true
    });

    // Security settings
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
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                                : 'text-gray-400 hover:text-white'
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
                className="bg-[#1A2035] border border-white/10 rounded-lg p-6"
            >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <UserCircleIcon className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <PhoneIcon className="w-4 h-4 inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={profileData.city}
                                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Region
                                </label>
                                <input
                                    type="text"
                                    value={profileData.region}
                                    onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white"
                                    disabled
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleProfileUpdate}
                            disabled={loading}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F] disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Notification Preferences</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <EnvelopeIcon className="w-5 h-5 text-[#D4AF37]" />
                                    <div>
                                        <p className="font-medium text-white">Email Notifications</p>
                                        <p className="text-sm text-gray-400">Receive updates via email</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNotifications}
                                        onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <DevicePhoneMobileIcon className="w-5 h-5 text-[#D4AF37]" />
                                    <div>
                                        <p className="font-medium text-white">SMS Notifications</p>
                                        <p className="text-sm text-gray-400">Receive updates via SMS</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.smsNotifications}
                                        onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                </label>
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="font-bold text-white mb-3">Notification Types</h3>

                                {[
                                    { key: 'applicationUpdates', label: 'Application Updates', desc: 'Status changes on your applications' },
                                    { key: 'licenseExpiry', label: 'License Expiry Reminders', desc: 'Alerts before license expiration' },
                                    { key: 'paymentReceipts', label: 'Payment Receipts', desc: 'Confirmation of payments' },
                                    { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg">
                                        <div>
                                            <p className="font-medium text-white">{item.label}</p>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.key as keyof typeof notifications]}
                                                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleNotificationUpdate}
                            disabled={loading}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <ShieldCheckIcon className="w-5 h-5 text-[#D4AF37]" />
                                    <div>
                                        <p className="font-medium text-white">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={security.twoFactorAuth}
                                        onChange={(e) => setSecuritySettings({ ...security, twoFactorAuth: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <BellIcon className="w-5 h-5 text-[#D4AF37]" />
                                    <div>
                                        <p className="font-medium text-white">Login Alerts</p>
                                        <p className="text-sm text-gray-400">Get notified of new login attempts</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={security.loginAlerts}
                                        onChange={(e) => setSecuritySettings({ ...security, loginAlerts: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                                </label>
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="font-bold text-white mb-3">Password</h3>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-[#D4AF37] rounded hover:bg-white/10">
                                    <KeyIcon className="w-4 h-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSecurityUpdate}
                            disabled={loading}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">General Preferences</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Language</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white">
                                    <option value="en">English</option>
                                    <option value="tw">Twi</option>
                                    <option value="ga">Ga</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Timezone</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white">
                                    <option value="GMT">GMT (Ghana)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Date Format</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white">
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B8941F] disabled:opacity-50"
                        >
                            Save Preferences
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
