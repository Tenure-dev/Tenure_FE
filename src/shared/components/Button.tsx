import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-semibold',
  {
    variants: {
      variant: {
        filled: '',
        ghost: '',
        solid: '',
      },
      size: {
        '54': 'h-[54px] w-[142px] px-[20px] text-[16px]',
        '48': 'h-[48px] w-[135px] px-[18px] text-[15px]',
        '44': 'h-[44px] w-[128px] px-[16px] text-[14px]',
        '36': 'h-[36px] w-[128px] px-[14px] text-[14px]',
      },
      state: {
        default: '',
        focus: '',
        press: '',
        disabled: '',
      },
    },
    compoundVariants: [
      { variant: 'filled', state: 'default', class: 'border-none bg-brand text-text-primary' },
      {
        variant: 'filled',
        state: 'focus',
        class: 'border-none bg-brand-light text-text-primary',
      },
      { variant: 'filled', state: 'press', class: 'border-none bg-brand-dark text-text-primary' },
      { variant: 'filled', state: 'disabled', class: 'border-none bg-disabled text-text-primary' },

      { variant: 'ghost', state: 'default', class: 'border-none bg-gray-bg text-text-primary' },
      {
        variant: 'ghost',
        state: 'focus',
        class: 'box-border border-2 border-brand bg-gray-bg text-text-primary',
      },
      { variant: 'ghost', state: 'press', class: 'border-none bg-gray-press text-text-primary' },
      {
        variant: 'ghost',
        state: 'disabled',
        class: 'border-none bg-gray-bg text-text-disabled',
      },

      {
        variant: 'solid',
        state: 'default',
        class: 'box-border border-2 border-border bg-white text-text-primary',
      },
      {
        variant: 'solid',
        state: 'focus',
        class: 'box-border border-2 border-text-primary bg-white text-text-primary',
      },
      { variant: 'solid', state: 'press', class: 'border-none bg-text-primary text-white' },
      {
        variant: 'solid',
        state: 'disabled',
        class: 'border-none bg-gray-bg text-text-disabled',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      size: '54',
      state: 'default',
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
export type ButtonState = NonNullable<VariantProps<typeof buttonVariants>['state']>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const Button = ({
  variant = 'filled',
  size = '54',
  state = 'default',
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || state === 'disabled';
  const resolvedState: ButtonState = isDisabled ? 'disabled' : state;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, state: resolvedState }), className)}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

export default Button;
