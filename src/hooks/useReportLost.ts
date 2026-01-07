import { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { ApiFirearm } from '@/types';

interface ReportLostForm {
    lastSeenDate: string;
    lastSeenTime: string;
    policeStation: string;
    policeReportNumber: string;
    location: string;
    description: string;
}

export const useReportLost = (onSuccess?: () => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFirearm, setSelectedFirearm] = useState<ApiFirearm | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<ReportLostForm>({
        lastSeenDate: '',
        lastSeenTime: '',
        policeStation: '',
        policeReportNumber: '',
        location: '',
        description: ''
    });

    const [isSuccess, setIsSuccess] = useState(false);

    const openModal = (firearm: ApiFirearm) => {
        setSelectedFirearm(firearm);
        setIsOpen(true);
        setIsSuccess(false);
    };

    const closeModal = () => {
        setIsOpen(false);
        setIsSuccess(false);
        setForm({
            lastSeenDate: '',
            lastSeenTime: '',
            policeStation: '',
            policeReportNumber: '',
            location: '',
            description: ''
        });
    };

    const updateForm = (field: keyof ReportLostForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return !!(
            form.lastSeenDate &&
            form.lastSeenTime &&
            form.policeStation &&
            form.location &&
            form.description
        );
    };

    const submitReport = async () => {
        if (!selectedFirearm || !isFormValid()) return;

        setIsSubmitting(true);
        try {
            // Collate data
            const finalReason = `${form.description}\n\nLast Seen Time: ${form.lastSeenTime}\nReported at: ${form.policeStation}`;

            const response = await apiClient.post(
                `/firearms/${selectedFirearm.id}/report-lost`,
                {
                    reason: finalReason,
                    date: form.lastSeenDate,
                    location: form.location,
                    police_report_number: form.policeReportNumber
                }
            );

            if (response.data.success) {
                toast.success(`${selectedFirearm.model} reported as lost. Active licence suspended.`);
                setIsSuccess(true);
                onSuccess?.();
            }
        } catch (error) {
            console.error('Error reporting lost firearm:', error);
            toast.error('Failed to report lost firearm. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isOpen,
        selectedFirearm,
        form,
        isSubmitting,
        isSuccess,
        isFormValid: isFormValid(),
        openModal,
        closeModal,
        updateForm,
        submitReport
    };
};
