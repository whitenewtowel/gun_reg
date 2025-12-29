import { motion } from 'framer-motion';
import { RefreshCw, ArrowLeftRight, FilePlus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

const APPLICATION_TYPES = [
    {
        id: 'NEW_LICENSE',
        title: 'New License',
        description: 'Apply for a license for a new firearm.',
        icon: FilePlus,
    },
    {
        id: 'RENEWAL',
        title: 'Renewal',
        description: 'Renew an existing firearm license.',
        icon: RefreshCw,
    },
    {
        id: 'TRANSFER',
        title: 'Transfer',
        description: 'Transfer ownership of a firearm.',
        icon: ArrowLeftRight,
    },
];

export default function Step1_ApplicationType({ formData, updateFormData, onNext, onPrev }: StepProps) {

    const handleSelect = (typeId: string) => {
        updateFormData({ applicationType: typeId });
    };

    return (
        <div className="space-y-6">
            <div className="text-center md:text-left mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Select Application Type</h2>
                <p className="text-gray-400">What kind of firearm license service do you require today?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {APPLICATION_TYPES.map((type) => {
                    const isSelected = formData.applicationType === type.id;
                    const Icon = type.icon;

                    return (
                        <motion.div
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(type.id)}
                            className={`
                cursor-pointer rounded-lg p-6 border-2 transition-all duration-300 relative overflow-hidden group
                ${isSelected
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                    : 'border-white/10 bg-white/5 hover:border-[#D4AF37]/50 hover:bg-white/10'}
              `}
                        >
                            <div className={`
                w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors
                ${isSelected ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-gray-400 group-hover:text-white'}
              `}>
                                <Icon className="w-6 h-6" />
                            </div>

                            <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                                {type.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {type.description}
                            </p>

                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                    <div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
                <Button
                    variant="outline"
                    onClick={onPrev}
                    className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!formData.applicationType}
                    className={`
            min-w-[140px]
            ${formData.applicationType
                            ? 'bg-[#D4AF37] text-black hover:bg-[#B4941F]'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
          `}
                >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
