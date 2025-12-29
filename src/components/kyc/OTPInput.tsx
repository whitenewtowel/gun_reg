/**
 * OTP Input Component
 * 6-digit OTP input with auto-focus and paste support
 */

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export default function OTPInput({
    length = 6,
    value,
    onChange,
    disabled = false,
    error = false,
}: OTPInputProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, inputValue: string) => {
        // Only allow numbers
        const numericValue = inputValue.replace(/[^0-9]/g, '');

        if (numericValue.length > 1) {
            // Handle paste
            handlePaste(numericValue);
            return;
        }

        const newValue = value.split('');
        newValue[index] = numericValue;
        const newOTP = newValue.join('');

        onChange(newOTP);

        // Auto-focus next input
        if (numericValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
            setActiveIndex(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
                setActiveIndex(index - 1);
            } else {
                // Clear current input
                const newValue = value.split('');
                newValue[index] = '';
                onChange(newValue.join(''));
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
            setActiveIndex(index - 1);
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
            setActiveIndex(index + 1);
        }
    };

    const handlePaste = (pastedValue: string) => {
        const numericValue = pastedValue.replace(/[^0-9]/g, '').slice(0, length);
        onChange(numericValue);

        // Focus the next empty input or last input
        const nextIndex = Math.min(numericValue.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
        setActiveIndex(nextIndex);
    };

    const handlePasteEvent = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        handlePaste(pastedData);
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePasteEvent}
                    onFocus={() => setActiveIndex(index)}
                    disabled={disabled}
                    className={cn(
                        'w-12 h-14 text-center text-2xl font-semibold rounded-lg border-2 transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : activeIndex === index
                                ? 'border-green-600 focus:ring-green-600'
                                : 'border-slate-300 focus:ring-green-600',
                        disabled && 'bg-slate-100 cursor-not-allowed opacity-50'
                    )}
                    aria-label={`OTP digit ${index + 1}`}
                />
            ))}
        </div>
    );
}
