import { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

interface ReportStolenForm {
    incidentDate: string;
    incidentTime: string;
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

export const useReportStolen = (onSuccess?: () => void) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFirearm, setSelectedFirearm] = useState<Firearm | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<ReportStolenForm>({
        incidentDate: '',
        incidentTime: '',
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
            const response = await apiClient.post(
                `/firearms/${selectedFirearm.id}/report-stolen`,
                {
                    incident_date: form.incidentDate,
                    incident_time: form.incidentTime,
                    police_station: form.policeStation,
                    police_report_number: form.policeReportNumber,
                    location: form.location,
                    description: form.description
                }
            );

            if (response.data.success) {
                toast.success(`${selectedFirearm.model} reported as stolen successfully`);
                closeModal();
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
        isFormValid: isFormValid(),
        openModal,
        closeModal,
        updateForm,
        submitReport
    };
};
