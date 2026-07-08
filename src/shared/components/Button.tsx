import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'filled' | 'ghost' | 'solid';
export type ButtonSize = '54' | '48' | '44' | '36';
export type ButtonState = 'default' | 'focus' | 'press' | 'disabled';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  '54': 'w-[142px] h-[54px] text-[16px] px-[20px]',
  '48': 'w-[135px] h-[48px] text-[15px] px-[18px]',
  '44': 'w-[128px] h-[44px] text-[14px] px-[16px]',
  '36': 'w-[128px] h-[36px] text-[14px] px-[14px]',
};

const backgroundClasses: Record<ButtonVariant, Record<ButtonState, string>> = {
  filled: {
    default: 'bg-[#00AAFF]',
    focus: 'bg-[#70CFFF]',
    press: 'bg-[#0096E0]',
    disabled: 'bg-[#A3B6B8]',
  },
  ghost: {
    default: 'bg-[#EAEDF0]',
    focus: 'bg-[#EAEDF0]',
    press: 'bg-[#DDE3E9]',
    disabled: 'bg-[#EAEDF0]',
  },
  solid: {
    default: 'bg-white',
    focus: 'bg-white',
    press: 'bg-[#111111]',
    disabled: 'bg-[#F5F6F8]',
  },
};

const textClasses: Record<ButtonVariant, Record<ButtonState, string>> = {
  filled: {
    default: 'text-[#111111]',
    focus: 'text-[#111111]',
    press: 'text-[#111111]',
    disabled: 'text-[#111111]',
  },
  ghost: {
    default: 'text-[#111111]',
    focus: 'text-[#111111]',
    press: 'text-[#111111]',
    disabled: 'text-[#A3B6B8]',
  },
  solid: {
    default: 'text-[#111111]',
    focus: 'text-[#111111]',
    press: 'text-white',
    disabled: 'text-[#A3B6B8]',
  },
};

const borderClasses: Record<ButtonVariant, Record<ButtonState, string>> = {
  filled: {
    default: 'border-none',
    focus: 'border-none',
    press: 'border-none',
    disabled: 'border-none',
  },
  ghost: {
    default: 'border-none',
    focus: 'box-border border-2 border-[#00AAFF]',
    press: 'border-none',
    disabled: 'border-none',
  },
  solid: {
    default: 'box-border border-2 border-[#E2E6E8]',
    focus: 'box-border border-2 border-[#111111]',
    press: 'border-none',
    disabled: 'border-none',
  },
};

const Button = ({
  variant = 'filled',
  size = '54',
  state = 'default',
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || state === 'disabled';
  const resolvedState: ButtonState = isDisabled ? 'disabled' : state;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[4px] font-sans font-semibold ${sizeClasses[size]} ${backgroundClasses[variant][resolvedState]} ${textClasses[variant][resolvedState]} ${borderClasses[variant][resolvedState]} ${className}`}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

export default Button;
