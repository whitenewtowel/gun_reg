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

interface ReportLostModalProps {
    isOpen: boolean;
    onClose: () => void;
    firearmModel?: string;
    firearmSerial?: string;
    form: {
        lastSeenDate: string;
        lastSeenTime: string;
        policeStation: string;
        policeReportNumber: string;
        location: string;
        description: string;
    };
    onFormChange: (field: keyof ReportLostModalProps['form'], value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isFormValid: boolean;
}

export const ReportLostModal = ({
    isOpen,
    onClose,
    firearmModel,
    firearmSerial,
    form,
    onFormChange,
    onSubmit,
    isSubmitting,
    isFormValid
}: ReportLostModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-orange-600">
                        Report Lost Firearm
                    </DialogTitle>
                    <DialogDescription>
                        Report {firearmModel} ({firearmSerial}) as lost to the Ghana Police Service Central Firearms Registry.
                        <span className="block mt-2 text-sm font-semibold text-orange-600">
                            ⚠️ You must report lost firearms within 24 hours of discovery under Ghana's Arms and Ammunition Act.
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lastSeenDate">Last Seen Date *</Label>
                            <Input
                                id="lastSeenDate"
                                type="date"
                                value={form.lastSeenDate}
                                onChange={(e) => onFormChange('lastSeenDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastSeenTime">Last Seen Time *</Label>
                            <Input
                                id="lastSeenTime"
                                type="time"
                                value={form.lastSeenTime}
                                onChange={(e) => onFormChange('lastSeenTime', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="policeStationLost">Police Station *</Label>
                        <Input
                            id="policeStationLost"
                            placeholder="e.g., Accra Central Police Station"
                            value={form.policeStation}
                            onChange={(e) => onFormChange('policeStation', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="policeReportNumberLost">Police Report Number</Label>
                        <Input
                            id="policeReportNumberLost"
                            placeholder="e.g., CR/2026/001234 (if already filed)"
                            value={form.policeReportNumber}
                            onChange={(e) => onFormChange('policeReportNumber', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                            If you haven't filed a police report yet, you can add this later.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locationLost">Last Known Location *</Label>
                        <Input
                            id="locationLost"
                            placeholder="e.g., Osu, Accra"
                            value={form.location}
                            onChange={(e) => onFormChange('location', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descriptionLost">Description of Circumstances *</Label>
                        <Textarea
                            id="descriptionLost"
                            placeholder="Provide details about how the firearm was lost..."
                            value={form.description}
                            onChange={(e) => onFormChange('description', e.target.value)}
                            rows={4}
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Include when you discovered it was missing and any search efforts made.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
