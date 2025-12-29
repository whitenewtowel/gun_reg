import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Step5_Review({ formData, onNext, onPrev }: StepProps) {

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Review Application</h2>
                <p className="text-gray-400">Please carefully review all details before proceeding to payment. Modifications cannot be made after submission.</p>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">

                {/* Section 1: Type */}
                <section className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider mb-3">Application Type</h3>
                    <div className="text-white font-medium">{formData.applicationType?.replace('_', ' ')}</div>
                </section>

                {/* Section 2: Personal */}
                <section className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider mb-3">Applicant Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block">Name</span>
                            <span className="text-white">{formData.personalDetails.firstName} {formData.personalDetails.lastName}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Phone</span>
                            <span className="text-white">{formData.personalDetails.phone}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-500 block">Address</span>
                            <span className="text-white">{formData.personalDetails.address}, {formData.personalDetails.city}, {formData.personalDetails.region}</span>
                        </div>
                    </div>
                </section>

                {/* Section 3: Firearm */}
                <section className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider mb-3">Firearm Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block">Type</span>
                            <span className="text-white">{formData.firearmDetails.type}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Make/Model</span>
                            <span className="text-white">{formData.firearmDetails.make} {formData.firearmDetails.model}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Serial Number</span>
                            <span className="text-white font-mono">{formData.firearmDetails.serialNumber}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Caliber</span>
                            <span className="text-white">{formData.firearmDetails.caliber}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-500 block">Purpose</span>
                            <span className="text-white italic">"{formData.firearmDetails.purpose}"</span>
                        </div>
                    </div>
                </section>

                {/* Section 4: Documents */}
                <section className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider mb-3">Documents Attached</h3>
                    <ul className="list-disc list-inside text-sm text-gray-300">
                        {formData.documents?.map((doc: string) => (
                            <li key={doc} className="capitalize">{doc.replace('_', ' ')} <span className="text-green-500 ml-2 text-xs">(Verified)</span></li>
                        ))}
                    </ul>
                </section>

                <div className="flex items-start gap-3 bg-[#D4AF37]/5 p-4 rounded border border-[#D4AF37]/20">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">
                        By clicking "Proceed to Payment", I declare that all information provided is true and accurate. I understand that providing false information is a criminal offense under the Firearms Act.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
                <Button
                    variant="outline"
                    onClick={onPrev}
                    className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back to Edit
                </Button>
                <Button
                    onClick={onNext}
                    className="bg-[#D4AF37] text-black hover:bg-[#B4941F]"
                >
                    Proceed to Payment <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
