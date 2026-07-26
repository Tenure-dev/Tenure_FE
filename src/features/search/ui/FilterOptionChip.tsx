import { cn } from '@/shared/lib/cn';

export interface FilterOptionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FilterOptionChip = ({ label, selected, onClick }: FilterOptionChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-body-2 inline-flex h-9 shrink-0 items-center justify-center rounded-full px-3.5 font-semibold whitespace-nowrap',
        selected ? 'bg-bg-black text-text-inverse' : 'bg-gray-bg text-text-primary',
      )}
    >
      {label}
    </button>
  );
};

export default FilterOptionChip;
