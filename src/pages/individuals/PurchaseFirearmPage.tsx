import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Permit {
    id: string;
    user_id: string;
    firearm_id: string | null;
    application_type: string;
    status: string;
    tracking_id: string;
    permit_data: {
        purpose?: string;
        expiry_date?: string;
        notes?: string;
    } | null;
    dealer_status: string;
    submitted_at: string | null;
    created_at: string;
}

export default function PurchaseFirearmPage() {
    const navigate = useNavigate();
    const { dealerId } = useParams();
    const location = useLocation();

    const dealer = location.state?.dealer;
    const firearm = location.state?.item;

    const [permits, setPermits] = useState<Permit[]>([]);
    const [selectedPermitId, setSelectedPermitId] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!dealer || !firearm) {
            toast.error('Invalid purchase request');
            navigate(-1);
            return;
        }
        fetchPermits();
    }, []);

    const fetchPermits = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/permits/my');

            if (response.data.success) {
                // Filter for approved and unused permits
                const availablePermits = response.data.data.filter(
                    (permit: Permit) =>
                        permit.status === 'APPROVED' &&
                        permit.firearm_id === null &&
                        permit.application_type === 'PERMIT_TO_PURCHASE'
                );
                setPermits(availablePermits);

                if (availablePermits.length === 0) {
                    toast.error('You need an approved and unused Permit to Purchase');
                }
            }
        } catch (error) {
            console.error('Error fetching permits:', error);
            toast.error('Failed to load your permits');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedPermitId) {
            toast.error('Please select a permit');
            return;
        }

        setProcessing(true);

        try {
            // Step 1: Create acquisition (use firearmId, not inventory item id)
            const acquisitionResponse = await apiClient.post('/acquisitions', {
                permitId: selectedPermitId,
                dealerId: dealerId,
                firearmId: firearm.firearmId, // Use the actual firearm ID
                notes: notes || undefined
            });

            if (!acquisitionResponse.data.success) {
                throw new Error('Failed to create acquisition');
            }

            const acquisitionId = acquisitionResponse.data.data.id;

            // Step 2: Initiate payment
            const paymentResponse = await apiClient.post('/payments/initiate', {
                acquisition_id: acquisitionId,
                provider: 'HUBTEL'
            });

            if (!paymentResponse.data.success) {
                throw new Error('Failed to initiate payment');
            }

            const checkoutUrl = paymentResponse.data.data?.checkout_url ||
                paymentResponse.data.data?.paymentUrl;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                // If no checkout URL is returned (test mode or specific provider),
                // manually redirect to the success callback to complete the flow.
                toast.success('Payment initiated successfully');
                navigate('/payments/callback?status=success');
            }

        } catch (error: any) {
            console.error('Error processing purchase:', error);
            toast.error(error.response?.data?.message || 'Failed to process purchase');
            setProcessing(false);
        }
    };

    if (!dealer || !firearm) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to Dealer
                </button>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Title */}
                    <div className="bg-[#1A2035] px-6 py-4">
                        <div className="flex items-center gap-3">
                            <ShoppingCartIcon className="w-6 h-6 text-[#D4AF37]" />
                            <h1 className="text-xl font-bold text-white">Purchase Firearm</h1>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Dealer Info */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-2">Dealer</h3>
                            <p className="text-sm text-slate-700">{dealer.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{dealer.address}</p>
                        </div>

                        {/* Firearm Details */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-3">Selected Firearm</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-slate-600">Name:</span>
                                    <p className="font-medium text-slate-900">{firearm.name}</p>
                                </div>
                                <div>
                                    <span className="text-slate-600">Type:</span>
                                    <p className="font-medium text-slate-900">{firearm.type}</p>
                                </div>
                                <div>
                                    <span className="text-slate-600">Model:</span>
                                    <p className="font-medium text-slate-900">{firearm.model}</p>
                                </div>
                                <div>
                                    <span className="text-slate-600">Caliber:</span>
                                    <p className="font-medium text-slate-900">{firearm.caliber}</p>
                                </div>
                                {firearm.serialNumber && (
                                    <div className="col-span-2">
                                        <span className="text-slate-600">Serial Number:</span>
                                        <p className="font-mono text-xs text-slate-900">{firearm.serialNumber}</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <span className="text-slate-600 text-sm">Total Price:</span>
                                <p className="text-2xl font-bold text-[#D4AF37]">
                                    GHS {firearm.price.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Permit Selection - Card Based */}
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-3">
                                Select Permit to Purchase *
                            </label>
                            {loading ? (
                                <div className="text-center py-8 text-slate-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-2"></div>
                                    Loading permits...
                                </div>
                            ) : permits.length === 0 ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm text-amber-800 mb-3">
                                        You don't have any available permits. Please apply for a Permit to Purchase first.
                                    </p>
                                    <Button
                                        onClick={() => navigate('/applications/new')}
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        Apply for Permit
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    {permits.map(permit => {
                                        const expiryDate = permit.permit_data?.expiry_date;
                                        const isSelected = selectedPermitId === permit.id;

                                        return (
                                            <button
                                                key={permit.id}
                                                onClick={() => setSelectedPermitId(permit.id)}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm font-semibold text-slate-900">
                                                                {permit.tracking_id}
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                                APPROVED
                                                            </span>
                                                        </div>
                                                        {permit.permit_data?.purpose && (
                                                            <p className="text-sm text-slate-600 mb-1">
                                                                Purpose: <span className="font-medium">{permit.permit_data.purpose}</span>
                                                            </p>
                                                        )}
                                                        {expiryDate && (
                                                            <p className="text-xs text-slate-500">
                                                                Valid until: {format(new Date(expiryDate), 'MMM dd, yyyy')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {isSelected && (
                                                        <CheckCircleIcon className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any additional information about this purchase..."
                                rows={4}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={() => navigate(-1)}
                                variant="outline"
                                className="flex-1"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePurchase}
                                disabled={!selectedPermitId || permits.length === 0 || processing}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#B4941F] text-white"
                            >
                                {processing ? 'Processing...' : 'Continue to Payment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
