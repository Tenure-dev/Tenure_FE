import { useState } from 'react';
import { chevon, close } from '@/shared/assets';
import { BottomSheet, DoubleButton, Input } from '@/shared/components';
import cn from '@/shared/lib/cn';
import { CATEGORY_GROUPS, CATEGORY_SIZES, getSizeSystem } from '@/shared/lib/itemSizeData';
import { WEARING_TARGET_LABEL } from '../lib/wearingTargetLabel';
import type { ItemUpdateRequest, RegisteredItemDetail, WearingTarget } from '../model/items';

const CATEGORIES = CATEGORY_GROUPS.map((g) => g.name);
const WEARING_TARGETS: WearingTarget[] = ['MENSWEAR', 'WOMENSWEAR', 'UNISEX'];

type SectionKey = 'category' | 'subCategory' | 'size' | 'wearingTarget';

interface ItemEditForm {
  brandName: string;
  itemName: string;
  categoryLarge: string;
  categorySmall: string;
  sizeValue: string;
  wearingTarget: WearingTarget;
  firstOwnedAt: string;
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
  onApply: (body: ItemUpdateRequest) => void;
}

const ItemEditSheet = ({ open, item, onClose, onApply }: ItemEditSheetProps) => {
  const toForm = (): ItemEditForm => ({
    brandName: item.brandName,
    itemName: item.itemName,
    categoryLarge: item.categoryLarge,
    categorySmall: item.categorySmall,
    sizeValue: item.sizeValue,
    wearingTarget: item.wearingTarget,
    firstOwnedAt: item.firstOwnedAt.slice(0, 10),
  });

  const [form, setForm] = useState<ItemEditForm>(toForm);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set<SectionKey>(['category', 'subCategory', 'size', 'wearingTarget']),
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

  const subCategories = CATEGORY_GROUPS.find((g) => g.name === form.categoryLarge)?.items ?? [];
  const sizeOptions = CATEGORY_SIZES[form.categoryLarge] ?? [];

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
            value={form.brandName}
            showPasswordToggle={false}
            onChange={(e) => setForm((prev) => ({ ...prev, brandName: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, brandName: '' }))}
            placeholder="브랜드명"
          />
        </div>

        <div className="pb-4">
          <p className="text-body-2 text-text-secondary mb-1">아이템명</p>
          <Input
            size={48}
            showPasswordToggle={false}
            value={form.itemName}
            onChange={(e) => setForm((prev) => ({ ...prev, itemName: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, itemName: '' }))}
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
                  selected={form.categoryLarge === cat}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      categoryLarge: cat,
                      categorySmall: '',
                      sizeValue: '',
                    }))
                  }
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
                  selected={form.categorySmall === sub}
                  onClick={() => setForm((prev) => ({ ...prev, categorySmall: sub }))}
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
              {sizeOptions.map(({ value }) => (
                <SelectChip
                  key={value}
                  label={value}
                  selected={form.sizeValue === value}
                  onClick={() => setForm((prev) => ({ ...prev, sizeValue: value }))}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-border-secondary border-t">
          <SectionHeader
            label="착용 대상"
            open={openSections.has('wearingTarget')}
            onToggle={() => toggleSection('wearingTarget')}
          />
          {openSections.has('wearingTarget') && (
            <div className="flex flex-wrap gap-2 pb-4">
              {WEARING_TARGETS.map((target) => (
                <SelectChip
                  key={target}
                  label={WEARING_TARGET_LABEL[target]}
                  selected={form.wearingTarget === target}
                  onClick={() => setForm((prev) => ({ ...prev, wearingTarget: target }))}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-border-secondary border-t py-4">
          <p className="text-body-2 text-text-secondary mb-1">최초 보유 날짜</p>
          <Input
            size={48}
            type="date"
            showPasswordToggle={false}
            value={form.firstOwnedAt}
            onChange={(e) => setForm((prev) => ({ ...prev, firstOwnedAt: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, firstOwnedAt: '' }))}
          />
        </div>
      </div>

      <div className="border-border-secondary flex border-t p-4">
        <DoubleButton
          layout="half"
          leftLabel="초기화"
          rightLabel="적용하기"
          onLeftClick={() => setForm(toForm())}
          onRightClick={() => {
            onApply({
              ...form,
              sizeSystem: getSizeSystem(form.categoryLarge, form.sizeValue),
              representativeImageUrl: item.representativeImageUrl,
            });
            onClose();
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default ItemEditSheet;
