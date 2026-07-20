import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { SortOption } from '../model/types';

const SORT_LABELS: Record<SortOption, string> = {
  recommend: '추천순',
  latest: '최신순',
  like: '좋아요순',
  view: '조회수순',
  save: '저장순',
};

const SORT_OPTIONS: SortOption[] = ['recommend', 'latest', 'like', 'view', 'save'];

export interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-body-2 text-text-primary inline-flex items-center gap-1 font-medium"
      >
        {SORT_LABELS[value]}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <ul className="border-border-secondary bg-bg-white absolute top-full right-0 z-30 mt-2 w-32 overflow-hidden rounded-lg border shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
          {SORT_OPTIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  'text-body-2 flex w-full items-center justify-between px-3 py-2.5 text-left',
                  option === value ? 'text-text-primary font-semibold' : 'text-text-secondary',
                )}
              >
                {SORT_LABELS[option]}
                {option === value && <Check size={14} className="text-text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
