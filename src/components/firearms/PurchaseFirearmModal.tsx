import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import apiClient from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface Permit {
    id: string;
    application_type: string;
    status: string;
    firearm_type: string;
    firearm_purpose: string;
    created_at: string;
    expiry_date: string | null;
}

interface PurchaseFirearmModalProps {
    isOpen: boolean;
    onClose: () => void;
    firearm: {
        id: string;
        name: string;
        type: string;
        model: string;
        caliber: string;
        price: number;
        serialNumber?: string;
    };
    dealerId: string;
}

export default function PurchaseFirearmModal({
    isOpen,
    onClose,
    firearm,
    dealerId
}: PurchaseFirearmModalProps) {
    const [step, setStep] = useState<'select' | 'confirm' | 'processing' | 'success'>('select');
    const [permits, setPermits] = useState<Permit[]>([]);
    const [selectedPermitId, setSelectedPermitId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchPermits();
            setStep('select');
            setSelectedPermitId('');
            setNotes('');
        }
    }, [isOpen]);

    const fetchPermits = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/permits/my');

            if (response.data.success) {
                // Filter for approved permits only
                const approvedPermits = response.data.data.filter(
                    (permit: Permit) => permit.status === 'APPROVED'
                );
                setPermits(approvedPermits);

                if (approvedPermits.length === 0) {
                    toast.error('You need an approved Permit to Purchase before buying a firearm');
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

        setStep('processing');

        try {
            // Step 1: Create acquisition
            const acquisitionResponse = await apiClient.post('/acquisitions', {
                permitId: selectedPermitId,
                dealerId: dealerId,
                firearmId: firearm.id,
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

            // Check if there's a checkout URL to redirect to
            const checkoutUrl = paymentResponse.data.data?.checkout_url ||
                paymentResponse.data.data?.paymentUrl;

            if (checkoutUrl) {
                // Redirect to payment page
                window.location.href = checkoutUrl;
            } else {
                // Show success if no redirect needed
                setStep('success');
                toast.success('Purchase request submitted successfully!');
            }

        } catch (error: any) {
            console.error('Error processing purchase:', error);
            toast.error(error.response?.data?.message || 'Failed to process purchase');
            setStep('select');
        }
    };

    const handleClose = () => {
        if (step !== 'processing') {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCartIcon className="w-5 h-5 text-[#D4AF37]" />
                        Purchase Firearm
                    </DialogTitle>
                </DialogHeader>

                {/* Step 1: Select Permit */}
                {step === 'select' && (
                    <div className="space-y-4">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-2">Selected Firearm</h3>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-slate-600">Name:</span> <span className="font-medium">{firearm.name}</span></p>
                                <p><span className="text-slate-600">Type:</span> <span className="font-medium">{firearm.type}</span></p>
                                <p><span className="text-slate-600">Caliber:</span> <span className="font-medium">{firearm.caliber}</span></p>
                                {firearm.serialNumber && (
                                    <p><span className="text-slate-600">Serial:</span> <span className="font-mono text-xs">{firearm.serialNumber}</span></p>
                                )}
                                <p className="text-lg font-bold text-[#D4AF37] mt-2">
                                    GHS {firearm.price.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Select Permit to Purchase *
                            </label>
                            {loading ? (
                                <div className="text-center py-4 text-slate-500">Loading permits...</div>
                            ) : permits.length === 0 ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm text-amber-800">
                                        You don't have any approved permits. Please apply for a Permit to Purchase first.
                                    </p>
                                </div>
                            ) : (
                                <select
                                    value={selectedPermitId}
                                    onChange={(e) => setSelectedPermitId(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]"
                                >
                                    <option value="">-- Select a permit --</option>
                                    {permits.map(permit => (
                                        <option key={permit.id} value={permit.id}>
                                            {permit.firearm_type} - {permit.firearm_purpose} (Approved)
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any additional notes..."
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePurchase}
                                disabled={!selectedPermitId || permits.length === 0}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#B4941F] text-white"
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Processing */}
                {step === 'processing' && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Purchase...</h3>
                        <p className="text-sm text-slate-600">Please wait while we process your request</p>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                    <div className="text-center py-8">
                        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Purchase Request Submitted!</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Your acquisition request has been created. You'll be redirected to complete payment.
                        </p>
                        <Button
                            onClick={onClose}
                            className="bg-[#1A2035] hover:bg-[#2A3550] text-white"
                        >
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
