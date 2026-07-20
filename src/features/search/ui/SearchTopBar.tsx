import type { ChangeEvent, KeyboardEvent } from 'react';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/shared/components';

export interface SearchTopBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFocus?: () => void;
  onBack?: () => void;
  onFilterClick: () => void;
  filterActive?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchTopBar = ({
  value,
  onChange,
  onSubmit,
  onFocus,
  onBack,
  onFilterClick,
  filterActive = false,
  placeholder = '상품과 유저를 검색해보세요.',
  autoFocus = false,
}: SearchTopBarProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSubmit?.(value);
  };

  return (
    <div className="bg-bg-white sticky top-0 z-20 flex items-center gap-2 px-4 py-3">
      {onBack && (
        <button type="button" onClick={onBack} aria-label="뒤로가기" className="shrink-0">
          <ChevronLeft size={24} className="text-text-primary" />
        </button>
      )}

      <Input
        size={44}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        onClear={() => onChange('')}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="!bg-gray-bg !border-transparent"
      />

      <button type="button" onClick={onFilterClick} aria-label="필터" className="relative shrink-0">
        <SlidersHorizontal size={20} className="text-text-primary" />
        {filterActive && (
          <span className="bg-brand absolute -top-0.5 -right-0.5 size-1.5 rounded-full" />
        )}
      </button>
    </div>
  );
};

export default SearchTopBar;
