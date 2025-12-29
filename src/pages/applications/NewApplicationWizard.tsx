import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Step1_ApplicationType from '@/pages/applications/steps/Step1_ApplicationType';
import Step2_PersonalDetails from '@/pages/applications/steps/Step2_PersonalDetails';
import Step3_FirearmDetails from '@/pages/applications/steps/Step3_FirearmDetails';
import Step4_Documents from '@/pages/applications/steps/Step4_Documents';
import Step5_Review from '@/pages/applications/steps/Step5_Review';
import Step6_Payment from '@/pages/applications/steps/Step6_Payment';

export type WizardData = {
    applicationType: string;
    personalDetails: any;
    firearmDetails: any;
    documents: any[];
    paymentMethod: string;
};

const STEPS = [
    { id: 1, title: 'License Type', component: Step1_ApplicationType },
    { id: 2, title: 'Personal Info', component: Step2_PersonalDetails },
    { id: 3, title: 'Firearm Details', component: Step3_FirearmDetails },
    { id: 4, title: 'Documents', component: Step4_Documents },
    { id: 5, title: 'Review', component: Step5_Review },
    { id: 6, title: 'Payment', component: Step6_Payment },
];

export default function NewApplicationWizard() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState<WizardData>({
        applicationType: '',
        personalDetails: {},
        firearmDetails: {},
        documents: [],
        paymentMethod: '',
    });

    const updateFormData = (newData: Partial<WizardData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep((prev) => prev - 1);
        } else {
            navigate('/dashboard');
        }
    };

    const CurrentComponent = STEPS[currentStep - 1].component;

    const pageVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        animate: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen bg-[#0B1021] text-white p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header & Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#D4AF37] tracking-tight">New License Application</h1>
                            <p className="text-gray-400 mt-1">Complete the steps below to submit your request.</p>
                        </div>
                        <div className="text-right hidden md:block">
                            <span className="text-2xl font-bold text-white">{currentStep}</span>
                            <span className="text-gray-500 text-lg"> / {STEPS.length}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-[#D4AF37]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Step Labels (Desktop) */}
                    <div className="hidden md:flex justify-between mt-4 px-1">
                        {STEPS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;
                            return (
                                <div key={step.id} className={`flex items-center gap-2 text-sm font-medium ${isActive ? 'text-[#D4AF37]' : isCompleted ? 'text-white' : 'text-gray-600'}`}>
                                    <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs border 
                        ${isActive ? 'border-[#D4AF37] bg-[#D4AF37]/10' : isCompleted ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-gray-700 bg-gray-800'}
                    `}>
                                        {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                                    </div>
                                    {step.title}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full"
                        >
                            <div className="bg-[#151B2D] border border-[#D4AF37]/20 rounded-xl p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm relative overflow-hidden">
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 p-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                                <CurrentComponent
                                    formData={formData}
                                    updateFormData={updateFormData}
                                    onNext={nextStep}
                                    onPrev={prevStep}
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
