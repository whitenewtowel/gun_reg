import { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

interface ReportLostForm {
    lastSeenDate: string;
    lastSeenTime: string;
    policeStation: string;
    policeReportNumber: string;
    location: string;
    description: string;
}

interface Firearm {
    id: string;
    model: string;
    serial_number: string;
}

export const useReportLost = (onSuccess?: () => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFirearm, setSelectedFirearm] = useState<Firearm | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<ReportLostForm>({
        lastSeenDate: '',
        lastSeenTime: '',
        policeStation: '',
        policeReportNumber: '',
        location: '',
        description: ''
    });

    const openModal = (firearm: Firearm) => {
        setSelectedFirearm(firearm);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
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
            const response = await apiClient.post(
                `/firearms/${selectedFirearm.id}/report-lost`,
                {
                    last_seen_date: form.lastSeenDate,
                    last_seen_time: form.lastSeenTime,
                    police_station: form.policeStation,
                    police_report_number: form.policeReportNumber,
                    location: form.location,
                    description: form.description
                }
            );

            if (response.data.success) {
                toast.success(`${selectedFirearm.model} reported as lost successfully`);
                closeModal();
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
        isFormValid: isFormValid(),
        openModal,
        closeModal,
        updateForm,
        submitReport
    };
};
