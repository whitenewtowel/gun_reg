/**
 * KYC Progress Indicator
 * Shows current step in the KYC onboarding process
 */

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    id: number;
    title: string;
    description: string;
}

interface KYCProgressProps {
    currentStep: number;
    steps?: Step[];
}

const defaultSteps: Step[] = [
    {
        id: 1,
        title: 'Verify Identity',
        description: 'Ghana Card verification',
    },
    {
        id: 2,
        title: 'Verify Contact',
        description: 'OTP verification',
    },
    {
        id: 3,
        title: 'Create Account',
        description: 'Set password',
    },
];

export default function KYCProgress({ currentStep, steps = defaultSteps }: KYCProgressProps) {
    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                                    currentStep > step.id
                                        ? 'bg-green-600 border-green-600'
                                        : currentStep === step.id
                                            ? 'bg-green-600 border-green-600'
                                            : 'bg-white border-slate-300'
                                )}
                            >
                                {currentStep > step.id ? (
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                ) : currentStep === step.id ? (
                                    <Circle className="w-6 h-6 text-white fill-white" />
                                ) : (
                                    <span className="text-slate-400 font-semibold">{step.id}</span>
                                )}
                            </div>

                            {/* Step Info */}
                            <div className="mt-2 text-center hidden sm:block">
                                <p
                                    className={cn(
                                        'text-sm font-medium',
                                        currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'
                                    )}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-4 -mt-8">
                                <div
                                    className={cn(
                                        'h-full transition-all',
                                        currentStep > step.id ? 'bg-green-600' : 'bg-slate-300'
                                    )}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile Step Info */}
            <div className="sm:hidden mt-4 text-center">
                <p className="text-sm font-medium text-slate-900">
                    {steps[currentStep - 1]?.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    {steps[currentStep - 1]?.description}
                </p>
            </div>
        </div>
    );
}
