import { useState } from 'react';
import { chevon, close } from '@/shared/assets';
import { BottomSheet, DoubleButton, Input } from '@/shared/components';
import cn from '@/shared/lib/cn';
import { CATEGORY_GROUPS } from '@/features/search/model/categoryData';
import type { RegisteredItemDetail } from '../model/items';

const CATEGORIES = CATEGORY_GROUPS.map((g) => g.name);

const SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '85',
  '90',
  '95',
  '100',
  '105',
  '110',
  '115',
  '36',
  '38',
  '40',
  '42',
  '44',
  '46',
  '48',
  '50',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  'Free',
];

const GENDERS = ['남성복', '여성복', '공용'];

type SectionKey = 'category' | 'subCategory' | 'size' | 'gender';

interface ItemEditForm {
  brand: string;
  name: string;
  category: string;
  subCategory: string;
  size: string;
  gender: string;
}

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
    <img
      src={chevon}
      alt=""
      className={cn('size-[18px] transition-transform duration-200', !open && 'rotate-180')}
    />
  </button>
);

const SelectChip = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
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

export interface ItemEditSheetProps {
  open: boolean;
  item: RegisteredItemDetail;
  onClose: () => void;
  onApply: (form: ItemEditForm) => void;
}

const ItemEditSheet = ({ open, item, onClose, onApply }: ItemEditSheetProps) => {
  const toForm = (): ItemEditForm => ({
    brand: item.brand,
    name: item.name,
    category: item.category,
    subCategory: item.subCategory,
    size: item.size,
    gender: item.gender,
  });

  const [form, setForm] = useState<ItemEditForm>(toForm);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set<SectionKey>(['category', 'subCategory', 'size', 'gender']),
  );
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm(toForm());
  }

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const subCategories = CATEGORY_GROUPS.find((g) => g.name === form.category)?.items ?? [];

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      variant="plain"
      className="flex max-h-[90vh] max-w-md flex-col"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 className="text-title-2 text-text-primary font-semibold">상세 수정</h2>
        <button type="button" onClick={onClose} aria-label="닫기">
          <img src={close} alt="" className="size-[20px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="py-4">
          <p className="text-body-2 text-text-secondary mb-1">브랜드명</p>
          <Input
            size={48}
            value={form.brand}
            showPasswordToggle={false}
            onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, brand: '' }))}
            placeholder="브랜드명"
          />
        </div>

        <div className="pb-4">
          <p className="text-body-2 text-text-secondary mb-1">아이템명</p>
          <Input
            size={48}
            showPasswordToggle={false}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, name: '' }))}
            placeholder="아이템명"
          />
        </div>

        <div className="border-border-secondary border-t">
          <SectionHeader
            label="카테고리"
            open={openSections.has('category')}
            onToggle={() => toggleSection('category')}
          />
          {openSections.has('category') && (
            <div className="flex flex-wrap gap-2 pb-4">
              {CATEGORIES.map((cat) => (
                <SelectChip
                  key={cat}
                  label={cat}
                  selected={form.category === cat}
                  onClick={() => setForm((prev) => ({ ...prev, category: cat, subCategory: '' }))}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-border-secondary border-t">
          <SectionHeader
            label="세부 카테고리"
            open={openSections.has('subCategory')}
            onToggle={() => toggleSection('subCategory')}
          />
          {openSections.has('subCategory') && (
            <div className="flex flex-wrap gap-2 pb-4">
              {subCategories.map((sub) => (
                <SelectChip
                  key={sub}
                  label={sub}
                  selected={form.subCategory === sub}
                  onClick={() => setForm((prev) => ({ ...prev, subCategory: sub }))}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-border-secondary border-t">
          <SectionHeader
            label="사이즈"
            open={openSections.has('size')}
            onToggle={() => toggleSection('size')}
          />
          {openSections.has('size') && (
            <div className="flex flex-wrap gap-2 pb-4">
              {SIZES.map((size) => (
                <SelectChip
                  key={size}
                  label={size}
                  selected={form.size === size}
                  onClick={() => setForm((prev) => ({ ...prev, size }))}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-border-secondary border-t">
          <SectionHeader
            label="착용 대상"
            open={openSections.has('gender')}
            onToggle={() => toggleSection('gender')}
          />
          {openSections.has('gender') && (
            <div className="flex flex-wrap gap-2 pb-4">
              {GENDERS.map((g) => (
                <SelectChip
                  key={g}
                  label={g}
                  selected={form.gender === g}
                  onClick={() => setForm((prev) => ({ ...prev, gender: g }))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-border-secondary flex border-t p-4">
        <DoubleButton
          layout="half"
          leftLabel="초기화"
          rightLabel="적용하기"
          onLeftClick={() => setForm(toForm())}
          onRightClick={() => {
            onApply(form);
            onClose();
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default ItemEditSheet;
