import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface AuthOTPInputProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    onComplete?: (code: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export default function AuthOTPInput({
    length = 6,
    value: controlledValue,
    onChange,
    onComplete,
    disabled = false,
    error = false,
}: AuthOTPInputProps) {
    const [localValue, setLocalValue] = useState('');
    // Use controlled value if provided, otherwise local state
    const value = controlledValue !== undefined ? controlledValue : localValue;

    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const triggerChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setLocalValue(newValue);
        }
        onChange?.(newValue);
        if (newValue.length === length) {
            onComplete?.(newValue);
        }
    };

    const handleChange = (index: number, inputValue: string) => {
        // Only allow numbers
        const numericValue = inputValue.replace(/[^0-9]/g, '');

        if (numericValue.length > 1) {
            // Handle paste
            handlePaste(numericValue);
            return;
        }

        // If the value string is initially empty or shorter, we need to handle it.
        // Better strategy: construct array based on current value length or fill with ''
        const currentValPadded = value.padEnd(length, ' ').split('').map(c => c.trim());

        currentValPadded[index] = numericValue;
        const newOTP = currentValPadded.join('').substring(0, length); // Ensure strictly length

        triggerChange(newOTP);

        // Auto-focus next input
        if (numericValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
            setActiveIndex(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            const currentValPadded = value.padEnd(length, ' ').split('').map(c => c.trim());

            if (!currentValPadded[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
                setActiveIndex(index - 1);
            } else {
                // Clear current input
                currentValPadded[index] = '';
                triggerChange(currentValPadded.join(''));
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
        triggerChange(numericValue);

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
                        'w-12 h-14 text-center text-2xl font-semibold rounded-lg border transition-all bg-black/20 text-white',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#D4AF37]/50',
                        error
                            ? 'border-red-500 focus:border-red-500'
                            : activeIndex === index
                                ? 'border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                                : 'border-white/10 hover:border-[#D4AF37]/50',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label={`OTP digit ${index + 1}`}
                />
            ))}
        </div>
    );
}
