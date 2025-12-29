import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

interface StepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Step3_FirearmDetails({ formData, updateFormData, onNext, onPrev }: StepProps) {

    const handleChange = (field: string, value: string) => {
        updateFormData({
            firearmDetails: {
                ...formData.firearmDetails,
                [field]: value,
            },
        });
    };

    const isFormValid =
        formData.firearmDetails.type &&
        formData.firearmDetails.make &&
        formData.firearmDetails.model &&
        formData.firearmDetails.serialNumber &&
        formData.firearmDetails.purpose;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Firearm Details</h2>
                <p className="text-gray-400">Provide specific details about the firearm you wish to license.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-gray-300">Firearm Type</Label>
                    <Select
                        value={formData.firearmDetails.type}
                        onValueChange={(val: string) => handleChange('type', val)}
                    >
                        <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50">
                            <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A2035] border-[#D4AF37]/20 text-white">
                            <SelectItem value="PISTOL">Pistol</SelectItem>
                            <SelectItem value="REVOLVER">Revolver</SelectItem>
                            <SelectItem value="SHOTGUN">Shotgun</SelectItem>
                            <SelectItem value="RIFLE">Rifle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="serial" className="text-gray-300">Serial Number</Label>
                    <Input
                        id="serial"
                        value={formData.firearmDetails.serialNumber || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('serialNumber', e.target.value)}
                        className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50 font-mono"
                        placeholder="Ex: GH-123456"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="make" className="text-gray-300">Make / Manufacturer</Label>
                    <Input
                        id="make"
                        value={formData.firearmDetails.make || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('make', e.target.value)}
                        className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50"
                        placeholder="e.g. Glock, Remington"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="model" className="text-gray-300">Model</Label>
                    <Input
                        id="model"
                        value={formData.firearmDetails.model || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('model', e.target.value)}
                        className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50"
                        placeholder="e.g. 19 Gen 5"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="caliber" className="text-gray-300">Caliber / Gauge</Label>
                <Input
                    id="caliber"
                    value={formData.firearmDetails.caliber || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('caliber', e.target.value)}
                    className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50 md:w-1/2"
                    placeholder="e.g. 9mm, .12 Gauge"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="purpose" className="text-gray-300">Reason for Application</Label>
                <Textarea
                    id="purpose"
                    value={formData.firearmDetails.purpose || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('purpose', e.target.value)}
                    className="bg-black/20 border-white/10 text-white focus:border-[#D4AF37]/50 min-h-[100px]"
                    placeholder="Please state briefly why you need this license (e.g., Personal Protection, Hunting, Sport)..."
                />
            </div>

            <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
                <Button
                    variant="outline"
                    onClick={onPrev}
                    className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!isFormValid}
                    className="bg-[#D4AF37] text-black hover:bg-[#B4941F]"
                >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
