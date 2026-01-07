import { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { ApiFirearm } from '@/types';

interface ReportStolenForm {
    incidentDate: string;
    incidentTime: string;
    policeStation: string;
    policeReportNumber: string;
    location: string;
    description: string;
}

export const useReportStolen = (onSuccess?: () => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFirearm, setSelectedFirearm] = useState<ApiFirearm | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<ReportStolenForm>({
        incidentDate: '',
        incidentTime: '',
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
            incidentDate: '',
            incidentTime: '',
            policeStation: '',
            policeReportNumber: '',
            location: '',
            description: ''
        });
    };

    const updateForm = (field: keyof ReportStolenForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return !!(
            form.incidentDate &&
            form.incidentTime &&
            form.policeStation &&
            form.location &&
            form.description
        );
    };

    const submitReport = async () => {
        if (!selectedFirearm || !isFormValid()) return;

        setIsSubmitting(true);
        try {
            // Collate data into description/reason as requested
            const finalReason = `${form.description}\n\nTime of Incident: ${form.incidentTime}\nRoported at: ${form.policeStation}`;

            const response = await apiClient.post(
                `/firearms/${selectedFirearm.id}/report-stolen`,
                {
                    reason: finalReason,
                    date: form.incidentDate,
                    location: form.location,
                    police_report_number: form.policeReportNumber
                }
            );

            if (response.data.success) {
                toast.success(`${selectedFirearm.model} reported as stolen. Active licence suspended.`);
                setIsSuccess(true);
                onSuccess?.();
            }
        } catch (error) {
            console.error('Error reporting stolen firearm:', error);
            toast.error('Failed to report stolen firearm. Please try again.');
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
