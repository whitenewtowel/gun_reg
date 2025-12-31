import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ClockIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    UserCircleIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ActivityItem {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export default function HistoryPage() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            // Mock data - replace with actual API call
            setActivities([
                {
                    id: '1',
                    type: 'APPLICATION',
                    title: 'Permit Application Submitted',
                    description: 'Your permit to purchase application has been submitted for review',
                    timestamp: '2024-12-20T10:00:00Z',
                    metadata: { applicationId: 'APP-001' }
                },
                {
                    id: '2',
                    type: 'PAYMENT',
                    title: 'Payment Completed',
                    description: 'Payment of GHS 250.00 for permit application fee',
                    timestamp: '2024-12-20T10:05:00Z',
                    metadata: { amount: 250, currency: 'GHS' }
                },
                {
                    id: '3',
                    type: 'FIREARM',
                    title: 'Firearm Registered',
                    description: 'Glock 19 Gen5 successfully registered',
                    timestamp: '2024-01-15T10:00:00Z',
                    metadata: { firearmId: 'FRM-001' }
                },
                {
                    id: '4',
                    type: 'PROFILE',
                    title: 'Profile Updated',
                    description: 'Contact information updated',
                    timestamp: '2024-12-15T14:30:00Z'
                },
                {
                    id: '5',
                    type: 'APPLICATION',
                    title: 'Application Approved',
                    description: 'Your license renewal application has been approved',
                    timestamp: '2024-11-20T09:15:00Z',
                    metadata: { applicationId: 'APP-002' }
                }
            ]);
        } catch (error) {
            console.error('Error fetching history:', error);
            toast.error('Failed to load activity history');
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'APPLICATION':
                return <DocumentTextIcon className="w-5 h-5" />;
            case 'FIREARM':
                return <ShieldCheckIcon className="w-5 h-5" />;
            case 'PAYMENT':
                return <CreditCardIcon className="w-5 h-5" />;
            case 'PROFILE':
                return <UserCircleIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'APPLICATION':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'FIREARM':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'PAYMENT':
                return 'text-[#1A2035] bg-gray-100 border-gray-200';
            case 'PROFILE':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            default:
                return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    const filteredActivities = activities.filter(activity => {
        if (filter === 'ALL') return true;
        return activity.type === filter;
    });

    const groupByDate = (activities: ActivityItem[]) => {
        const groups: Record<string, ActivityItem[]> = {};

        activities.forEach(activity => {
            const date = new Date(activity.timestamp).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(activity);
        });

        return groups;
    };

    const groupedActivities = groupByDate(filteredActivities);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#1A2035] mb-2">Activity History</h1>
                <p className="text-gray-500">Track all your account activities and transactions</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
                <CalendarIcon className="w-5 h-5 text-[#1A2035] flex-shrink-0" />
                <div className="flex gap-2 flex-wrap">
                    {['ALL', 'APPLICATION', 'FIREARM', 'PAYMENT', 'PROFILE'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === type
                                ? 'bg-[#1A2035] text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Timeline */}
            {Object.keys(groupedActivities).length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#1A2035] mb-2">No Activity Found</h3>
                    <p className="text-gray-500">
                        {filter === 'ALL'
                            ? "No activity to display"
                            : `No ${filter.toLowerCase()} activities`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedActivities).map(([date, items]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    {date}
                                </span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {/* Activities for this date */}
                            <div className="relative pl-8 space-y-4">
                                {/* Timeline line */}
                                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200" />

                                {items.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative"
                                    >
                                        {/* Timeline dot */}
                                        <div className={`absolute -left-8 top-3 w-8 h-8 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                            {getActivityIcon(activity.type)}
                                        </div>

                                        {/* Activity Card */}
                                        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1A2035]/30 hover:shadow-md transition-all ml-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-[#1A2035]">{activity.title}</h3>
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getActivityColor(activity.type)}`}>
                                                            {activity.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        {activity.description}
                                                    </p>

                                                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                                        <div className="flex flex-wrap gap-3 text-xs">
                                                            {Object.entries(activity.metadata).map(([key, value]) => (
                                                                <div key={key} className="text-gray-500">
                                                                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                                                                    <span className="text-[#1A2035] font-medium ml-1">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {new Date(activity.timestamp).toLocaleTimeString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
