import { X } from 'lucide-react';
import type { SearchFilters } from '../model/types';
import { HEIGHT_RANGE_LIMIT, WEIGHT_RANGE_LIMIT } from '../model/types';

export interface AppliedFilterChipsProps {
  filters: SearchFilters;
  onRemove: (patch: Partial<SearchFilters>) => void;
}

const SALE_STATUS_LABEL: Record<SearchFilters['saleStatus'], string> = {
  all: '전체',
  onSaleIncluded: '판매중 포함',
  onSaleOnly: '판매중만',
};

const GENDER_LABEL: Record<SearchFilters['gender'], string> = {
  all: '전체',
  male: '남자',
  female: '여자',
};

interface ChipEntry {
  key: string;
  label: string;
  onRemove: () => void;
}

const AppliedFilterChips = ({ filters, onRemove }: AppliedFilterChipsProps) => {
  const chips: ChipEntry[] = [];

  if (filters.saleStatus !== 'all') {
    chips.push({
      key: 'saleStatus',
      label: SALE_STATUS_LABEL[filters.saleStatus],
      onRemove: () => onRemove({ saleStatus: 'all' }),
    });
  }

  if (filters.gender !== 'all') {
    chips.push({
      key: 'gender',
      label: GENDER_LABEL[filters.gender],
      onRemove: () => onRemove({ gender: 'all' }),
    });
  }

  filters.categories.forEach((category) => {
    chips.push({
      key: `category-${category}`,
      label: category,
      onRemove: () => onRemove({ categories: filters.categories.filter((c) => c !== category) }),
    });
  });

  if (
    filters.heightRange[0] !== HEIGHT_RANGE_LIMIT[0] ||
    filters.heightRange[1] !== HEIGHT_RANGE_LIMIT[1]
  ) {
    chips.push({
      key: 'height',
      label: `키 ${filters.heightRange[0]}-${filters.heightRange[1]}cm`,
      onRemove: () => onRemove({ heightRange: HEIGHT_RANGE_LIMIT }),
    });
  }

  if (
    filters.weightRange[0] !== WEIGHT_RANGE_LIMIT[0] ||
    filters.weightRange[1] !== WEIGHT_RANGE_LIMIT[1]
  ) {
    chips.push({
      key: 'weight',
      label: `몸무게 ${filters.weightRange[0]}-${filters.weightRange[1]}kg`,
      onRemove: () => onRemove({ weightRange: WEIGHT_RANGE_LIMIT }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="bg-gray-bg text-body-2 text-text-primary inline-flex h-9 shrink-0 items-center gap-1 rounded-full px-3.5 font-medium whitespace-nowrap"
        >
          {chip.label}
          <X size={14} className="text-text-tertiary" />
        </button>
      ))}
    </div>
  );
};

export default AppliedFilterChips;
