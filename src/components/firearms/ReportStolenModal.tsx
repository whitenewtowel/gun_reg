import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface ReportStolenModalProps {
    isOpen: boolean;
    onClose: () => void;
    firearmModel?: string;
    firearmSerial?: string;
    form: {
        incidentDate: string;
        incidentTime: string;
        policeStation: string;
        policeReportNumber: string;
        location: string;
        description: string;
    };
    onFormChange: (field: keyof ReportStolenModalProps['form'], value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isFormValid: boolean;
    isSuccess?: boolean;
}

export const ReportStolenModal = ({
    isOpen,
    onClose,
    firearmModel,
    firearmSerial,
    form,
    onFormChange,
    onSubmit,
    isSubmitting,
    isFormValid,
    isSuccess
}: ReportStolenModalProps) => {

    if (isSuccess) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] text-center">
                    <div className="flex flex-col items-center justify-center py-6">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                        <DialogTitle className="text-xl font-bold text-gray-900 mb-2">Report Submitted</DialogTitle>
                        <DialogDescription className="text-center mb-6 max-w-xs mx-auto">
                            The theft of {firearmModel} ({firearmSerial}) has been reported. Your license is now suspended pending police investigation.
                        </DialogDescription>
                        <Button onClick={onClose} className="w-full bg-gray-900 hover:bg-gray-800">
                            Acknowledge & Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-red-600">
                        Report Stolen Firearm
                    </DialogTitle>
                    <DialogDescription>
                        Report {firearmModel} ({firearmSerial}) as stolen to the Ghana Police Service Central Firearms Registry.
                        <span className="block mt-2 text-sm font-semibold text-orange-600">
                            ⚠️ Filing a false report is a criminal offense under Ghana's Arms and Ammunition Act.
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="incidentDate">Incident Date *</Label>
                            <Input
                                id="incidentDate"
                                type="date"
                                value={form.incidentDate}
                                onChange={(e) => onFormChange('incidentDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="incidentTime">Incident Time *</Label>
                            <Input
                                id="incidentTime"
                                type="time"
                                value={form.incidentTime}
                                onChange={(e) => onFormChange('incidentTime', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="policeStation">Police Station *</Label>
                        <Input
                            id="policeStation"
                            placeholder="e.g., Accra Central Police Station"
                            value={form.policeStation}
                            onChange={(e) => onFormChange('policeStation', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="policeReportNumber">Police Report Number</Label>
                        <Input
                            id="policeReportNumber"
                            placeholder="e.g., CR/2026/001234 (if already filed)"
                            value={form.policeReportNumber}
                            onChange={(e) => onFormChange('policeReportNumber', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                            If you haven't filed a police report yet, you can add this later.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location of Theft *</Label>
                        <Input
                            id="location"
                            placeholder="e.g., Osu, Accra"
                            value={form.location}
                            onChange={(e) => onFormChange('location', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description of Incident *</Label>
                        <Textarea
                            id="description"
                            placeholder="Provide details about how the firearm was stolen..."
                            value={form.description}
                            onChange={(e) => onFormChange('description', e.target.value)}
                            rows={4}
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Include any relevant details that may help in recovery.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
