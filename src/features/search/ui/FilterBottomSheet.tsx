import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { BottomSheet, DoubleButton } from '@/shared/components';
import { cn } from '@/shared/lib/cn';
import { useCategories } from '../lib/useCategories';
import { groupCategories } from '../model/categoryData';
import {
  DEFAULT_SEARCH_FILTERS,
  HEIGHT_RANGE_LIMIT,
  WEIGHT_RANGE_LIMIT,
  type SearchFilters,
} from '../model/types';
import FilterOptionChip from './FilterOptionChip';
import RangeSlider from './RangeSlider';

export interface FilterBottomSheetProps {
  open: boolean;
  filters: SearchFilters;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
}

type SectionKey = 'saleStatus' | 'gender' | 'category' | 'heightWeight';

const SECTION_LABELS: Record<SectionKey, string> = {
  saleStatus: '판매 상태',
  gender: '게시자 성별',
  category: '카테고리',
  heightWeight: '키 · 몸무게',
};

const SectionHeader = ({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex w-full items-center justify-between py-4"
  >
    <span className="text-body-1 text-text-primary font-semibold">{label}</span>
    {open ? (
      <ChevronUp size={18} className="text-text-tertiary" />
    ) : (
      <ChevronDown size={18} className="text-text-tertiary" />
    )}
  </button>
);

const FilterBottomSheet = ({ open, filters, onClose, onApply }: FilterBottomSheetProps) => {
  const categories = useCategories();
  const categoryGroups = groupCategories(categories);
  const [draft, setDraft] = useState<SearchFilters>(filters);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set());
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setDraft(filters);
  }

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroup = (id: number) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategoryItem = (id: number) => {
    setDraft((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleReset = () => setDraft(DEFAULT_SEARCH_FILTERS);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      variant="plain"
      className="flex max-h-[85vh] max-w-md flex-col"
    >
      <div className="flex items-center justify-between px-4 pb-2">
        <h2 className="text-title-3 text-text-primary font-semibold">필터</h2>
        <button type="button" onClick={onClose} aria-label="닫기">
          <X size={22} className="text-text-primary" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="border-border-secondary border-b">
          <SectionHeader
            label={SECTION_LABELS.saleStatus}
            open={openSections.has('saleStatus')}
            onToggle={() => toggleSection('saleStatus')}
          />
          {openSections.has('saleStatus') && (
            <div className="flex gap-2 pb-4">
              <FilterOptionChip
                label="전체"
                selected={draft.saleStatus === 'all'}
                onClick={() => setDraft((prev) => ({ ...prev, saleStatus: 'all' }))}
              />
              <FilterOptionChip
                label="판매중 포함"
                selected={draft.saleStatus === 'onSaleIncluded'}
                onClick={() => setDraft((prev) => ({ ...prev, saleStatus: 'onSaleIncluded' }))}
              />
              <FilterOptionChip
                label="판매중만"
                selected={draft.saleStatus === 'onSaleOnly'}
                onClick={() => setDraft((prev) => ({ ...prev, saleStatus: 'onSaleOnly' }))}
              />
            </div>
          )}
        </div>

        <div className="border-border-secondary border-b">
          <SectionHeader
            label={SECTION_LABELS.gender}
            open={openSections.has('gender')}
            onToggle={() => toggleSection('gender')}
          />
          {openSections.has('gender') && (
            <div className="flex gap-2 pb-4">
              <FilterOptionChip
                label="전체"
                selected={draft.gender === 'all'}
                onClick={() => setDraft((prev) => ({ ...prev, gender: 'all' }))}
              />
              <FilterOptionChip
                label="남자"
                selected={draft.gender === 'male'}
                onClick={() => setDraft((prev) => ({ ...prev, gender: 'male' }))}
              />
              <FilterOptionChip
                label="여자"
                selected={draft.gender === 'female'}
                onClick={() => setDraft((prev) => ({ ...prev, gender: 'female' }))}
              />
            </div>
          )}
        </div>

        <div className="border-border-secondary border-b">
          <SectionHeader
            label={SECTION_LABELS.category}
            open={openSections.has('category')}
            onToggle={() => toggleSection('category')}
          />
          {openSections.has('category') && (
            <div className="pb-4">
              {categoryGroups.map((group) => (
                <div
                  key={group.id}
                  className={cn('border-border-secondary', 'border-t first:border-t-0')}
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="flex w-full items-center justify-between py-3"
                  >
                    <span className="text-body-2 text-text-primary font-semibold">
                      {group.name}
                    </span>
                    {openGroups.has(group.id) ? (
                      <ChevronUp size={16} className="text-text-tertiary" />
                    ) : (
                      <ChevronDown size={16} className="text-text-tertiary" />
                    )}
                  </button>
                  {openGroups.has(group.id) && (
                    <div className="flex flex-wrap gap-2 pb-4">
                      {group.items.map((item) => (
                        <FilterOptionChip
                          key={item.id}
                          label={item.name}
                          selected={draft.categoryIds.includes(item.id)}
                          onClick={() => toggleCategoryItem(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <SectionHeader
            label={SECTION_LABELS.heightWeight}
            open={openSections.has('heightWeight')}
            onToggle={() => toggleSection('heightWeight')}
          />
          {openSections.has('heightWeight') && (
            <div className="flex flex-col gap-5 pb-6">
              <div>
                <p className="text-body-2 text-text-secondary mb-1">키(cm)</p>
                <RangeSlider
                  min={HEIGHT_RANGE_LIMIT[0]}
                  max={HEIGHT_RANGE_LIMIT[1]}
                  unit="cm"
                  value={draft.heightRange}
                  onChange={(heightRange) => setDraft((prev) => ({ ...prev, heightRange }))}
                />
              </div>
              <div>
                <p className="text-body-2 text-text-secondary mb-1">몸무게(kg)</p>
                <RangeSlider
                  min={WEIGHT_RANGE_LIMIT[0]}
                  max={WEIGHT_RANGE_LIMIT[1]}
                  unit="kg"
                  value={draft.weightRange}
                  onChange={(weightRange) => setDraft((prev) => ({ ...prev, weightRange }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-border-secondary flex gap-2.5 border-t p-4">
        <DoubleButton
          layout="half"
          leftLabel="초기화"
          rightLabel="적용하기"
          onLeftClick={handleReset}
          onRightClick={handleApply}
        />
      </div>
    </BottomSheet>
  );
};

export default FilterBottomSheet;
