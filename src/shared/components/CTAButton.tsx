import { cn } from '@/shared/lib/cn';

export interface CTAButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'brand' | 'dark';
}

const CTAButton = ({
  label,
  onClick,
  disabled = false,
  fullWidth = false,
  variant = 'brand',
}: CTAButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-sans font-semibold text-white',
        fullWidth ? 'h-[52px] w-full text-[16px]' : 'h-[32px] w-[166.5px] text-[14px]',
        disabled && 'cursor-not-allowed',
        variant === 'dark'
          ? disabled
            ? 'bg-gray-bg text-text-disabled'
            : 'bg-text-primary'
          : disabled
            ? 'bg-[#CCEEFF]'
            : 'bg-[#00AAFF]',
      )}
    >
      {label}
    </button>
  );
};

export default CTAButton;
