import { useState } from 'react';
import { ArrowRight, ArrowLeft, UploadCloud, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Step4_Documents({ formData, updateFormData, onNext, onPrev }: StepProps) {
    // In a real implementation, we would use react-dropzone and upload to backend here.
    // For this demo, we'll simulate "uploaded" state using local state.
    const [uploadedDocs, setUploadedDocs] = useState<string[]>(formData.documents || []);

    const handleFakeUpload = (docName: string) => {
        if (!uploadedDocs.includes(docName)) {
            const newDocs = [...uploadedDocs, docName];
            setUploadedDocs(newDocs);
            updateFormData({ documents: newDocs });
        }
    };

    const removeDoc = (docName: string) => {
        const newDocs = uploadedDocs.filter(d => d !== docName);
        setUploadedDocs(newDocs);
        updateFormData({ documents: newDocs });
    };

    const REQUIRED_DOCS = [
        { id: 'ghana_card', label: 'Ghana Card (Front & Back)' },
        { id: 'police_report', label: 'Police Clearance Report' },
        { id: 'passport_photos', label: 'Passport Size Photos (2)' },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Required Documents</h2>
                <p className="text-gray-400">Upload clear, legible copies of the following documents to support your application.</p>
            </div>

            <div className="grid gap-6">
                {REQUIRED_DOCS.map((doc) => {
                    const isUploaded = uploadedDocs.includes(doc.id);

                    return (
                        <div key={doc.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${isUploaded ? 'bg-green-500/20 text-green-500' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}
                        `}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{doc.label}</h4>
                                    <p className="text-xs text-gray-500">PDF, JPG or PNG (Max 5MB)</p>
                                </div>
                            </div>

                            {isUploaded ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-500/10 rounded border border-green-500/20">Uploaded</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeDoc(doc.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFakeUpload(doc.id)}
                                    className="border-dashed border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                >
                                    <UploadCloud className="w-4 h-4 mr-2" /> Upload
                                </Button>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-200">
                    <strong>Note:</strong> Ensure all documents are valid and not expired. Illegible documents will delay your application.
                </p>
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
                    disabled={uploadedDocs.length < REQUIRED_DOCS.length}
                    className="bg-[#D4AF37] text-black hover:bg-[#B4941F]"
                >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
