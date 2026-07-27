import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Search, Eye, EyeOff, X } from 'lucide-react';
import cn from '@/shared/lib/cn';

const DEFAULT_PLACEHOLDER = '입력하는 경우';

const boxVariants = cva('flex w-full items-center border-[1.5px] bg-bg-white transition-colors', {
  variants: {
    size: {
      54: 'h-[54px] gap-2 rounded-lg px-4 text-[16px]',
      48: 'h-[48px] gap-2 rounded-lg px-4 text-[15px]',
      44: 'h-[44px] gap-2 rounded-md px-[14px] text-[14px]',
    },
    state: {
      default: 'border-border',
      focus: 'border-brand shadow-[0_0_0_3px_rgba(51,214,255,0.25)]',
      active: 'border-border-strong',
      error: 'border-error',
      completion: 'border-border',
      disabled: 'bg-bg-100 cursor-not-allowed border-border-light',
    },
  },
  defaultVariants: {
    size: 54,
    state: 'default',
  },
});

type BoxState = NonNullable<VariantProps<typeof boxVariants>['state']>;

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 54 | 48 | 44;
  /** 상태 강제 지정. 미지정 시 focus/active/default는 내부에서 자동 계산 */
  state?: BoxState;
  error?: boolean;
  completion?: boolean;
  /** leading 아이콘. 미지정 시 size 44는 검색 아이콘 자동 노출 */
  leftIcon?: ReactNode;
  showClear?: boolean;
  showPasswordToggle?: boolean;
  onClear?: () => void;
}

const Input = ({
  size = 54,
  state,
  error = false,
  completion = false,
  disabled = false,
  type = 'text',
  placeholder = DEFAULT_PLACEHOLDER,
  value,
  onChange,
  leftIcon,
  showClear = true,
  showPasswordToggle,
  onClear,
  className,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const hasValue = value != null && value !== '';

  // 상태 결정: disabled > 강제값 > error > completion > focus > active(값 있음) > default
  const getState = (): BoxState => {
    if (disabled) return 'disabled';
    if (state) return state;
    if (error) return 'error';
    if (completion) return 'completion';
    if (focused) return 'focus';
    if (hasValue) return 'active';
    return 'default';
  };

  const resolvedState = getState();

  // trailing 액션(비번 토글 / clear)은 편집 가능한 상태에서만 노출
  const showTrailing =
    resolvedState === 'focus' || resolvedState === 'active' || resolvedState === 'error';

  const isPassword = type === 'password';
  const wantToggle = showPasswordToggle ?? isPassword;

  const iconSize = size === 44 ? 18 : 20;
  const leading =
    leftIcon !== undefined ? (
      leftIcon
    ) : size === 44 ? (
      <Search size={iconSize} strokeWidth={2} className="text-text-tertiary" />
    ) : null;

  const effectiveType = isPassword && revealed ? 'text' : type;

  const iconButtonClass = cn(
    'inline-flex shrink-0 items-center justify-center p-[2px] leading-none',
    'text-text-tertiary transition-colors hover:text-text-primary',
    'disabled:cursor-not-allowed',
  );

  return (
    <div className={cn(boxVariants({ size, state: resolvedState }), className)}>
      {leading && <span className="shrink-0 leading-none">{leading}</span>}

      <input
        type={effectiveType}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'h-full min-w-0 flex-1 border-none bg-transparent outline-none',
          'caret-border-strong placeholder:text-text-tertiary',
          disabled ? 'text-text-disabled' : 'text-text-primary',
        )}
        {...rest}
      />

      {showTrailing && wantToggle && (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setRevealed((prev) => !prev)}
          aria-label={revealed ? '비밀번호 숨기기' : '비밀번호 표시'}
          className={iconButtonClass}
        >
          {revealed ? (
            <Eye size={iconSize} strokeWidth={2} />
          ) : (
            <EyeOff size={iconSize} strokeWidth={2} />
          )}
        </button>
      )}

      {showTrailing && showClear && (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={onClear}
          aria-label="입력 지우기"
          className={iconButtonClass}
        >
          <X size={iconSize} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default Input;
