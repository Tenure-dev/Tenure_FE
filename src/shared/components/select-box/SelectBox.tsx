import { useEffect, useRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from '@/shared/lib/cn';

export interface SelectOption {
  value: string; // 실제 서버에 전송되는 값
  label: string; // 사용자에게 표시될 텍스트 값
}

const DEFAULT_PLACEHOLDER = '입력하는 경우';

const boxVariants = cva(
  'flex w-full items-center justify-between border-[1.5px] border-border-secondary px-4 select-none',
  {
    variants: {
      size: {
        54: 'h-[54px]',
        48: 'h-[48px]',
      },
      state: {
        default: 'cursor-pointer rounded-lg bg-bg-white',
        completion: 'cursor-pointer rounded-lg bg-bg-white',
        active: 'cursor-pointer rounded-t-lg bg-bg-white',
        disabled: 'cursor-not-allowed rounded-lg bg-gray-disabled',
      },
    },
    defaultVariants: {
      size: 54,
      state: 'default',
    },
  },
);

const textVariants = cva('leading-[1.45] font-regular tracking-[-0.025em]', {
  variants: {
    size: {
      54: 'text-[15px]',
      48: 'text-[14px]',
    },
    color: {
      primary: 'text-text-primary',
      tertiary: 'text-text-tertiary',
      disabled: 'text-text-disabled',
    },
  },
  defaultVariants: {
    size: 54,
    color: 'tertiary',
  },
});

type BoxState = NonNullable<VariantProps<typeof boxVariants>['state']>;
type TextColor = NonNullable<VariantProps<typeof textVariants>['color']>;

interface SelectBoxProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 54 | 48;
}

const ChevronIcon = ({ isOpen, disabled }: { isOpen: boolean; disabled: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      'shrink-0 transition-transform duration-200',
      isOpen ? 'rotate-180' : 'rotate-0',
      disabled ? 'text-text-disabled' : 'text-text-tertiary',
    )}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SelectBox = ({
  options,
  value,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
  size = 54,
}: SelectBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const getState = (): BoxState => {
    if (disabled) return 'disabled';
    if (isOpen) return 'active';
    if (value) return 'completion';
    return 'default';
  };

  // 텍스트 색상 결정
  const getTextColor = (): TextColor => {
    if (disabled) return 'disabled';
    if (selectedOption) return 'primary';
    return 'tertiary';
  };

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 토글 버튼 클릭
  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  // 메뉴 선택
  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 트리거 */}
      <div className={cn(boxVariants({ size, state: getState() }))} onClick={handleToggle}>
        <span className={cn(textVariants({ size, color: getTextColor() }))}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon isOpen={isOpen} disabled={disabled} />
      </div>

      {/* 열린 메뉴 목록 - absolute로 띄워서 아래 UI 밀지 않음 */}
      {isOpen && (
        <ul className="border-border-secondary bg-bg-white absolute inset-x-0 z-50 overflow-hidden rounded-b-lg border-[1.5px] border-t-0">
          {options.map((option) => (
            <li
              key={option.value}
              className={cn(
                textVariants({ size, color: 'primary' }),
                'hover:bg-gray-default active:bg-gray-default cursor-pointer px-4 py-[14px] transition-colors',
                'border-border-secondary border-t first:border-t-0',
              )}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectBox;
