import type { ReactNode } from 'react';
import { chevon, close, plus } from '@/shared/assets';
import { CTAButton, Checkbox, Input } from '@/shared/components';
import cn from '@/shared/lib/cn';
import { CATEGORY_GROUPS, CATEGORY_SIZES } from '@/shared/lib/itemSizeData';
import { CATEGORY_FIELDS, MEASUREMENT_LABELS } from '@/features/product/lib/measurementUtils';
import type { FeePolicy, SaleForm, SectionKey, WearingTarget } from './types';
import { CONDITION_FLAG_LABELS, FEE_POLICY_LABELS, WEARING_TARGET_LABELS } from './types';

// 서브 컴포넌트

const SectionHeader = ({
  label,
  open,
  onToggle,
}: {
  label: ReactNode;
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
  disabled,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={cn(
      'text-body-2 inline-flex h-9 shrink-0 items-center justify-center rounded-full px-3.5 font-semibold whitespace-nowrap',
      selected ? 'bg-bg-black text-text-inverse' : 'bg-gray-bg text-text-primary',
      disabled && !selected && 'cursor-not-allowed opacity-30',
    )}
  >
    {label}
  </button>
);

const MeasurementField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-body-3 text-text-secondary">{label}</span>
    <div className="border-border flex h-11 items-center rounded-lg border px-3">
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="text-body-2 text-text-primary placeholder:text-text-tertiary min-w-0 flex-1 bg-transparent outline-none"
      />
      <span className="text-body-3 text-text-tertiary">cm</span>
    </div>
  </div>
);

const ConditionRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-body-2 text-text-primary">{label}</span>
    <Checkbox checked={checked} onChange={onChange} />
  </div>
);

const Req = () => <span className="text-error ml-0.5">*</span>;

// static data
const CATEGORIES = CATEGORY_GROUPS.map((g) => g.name);
const WEARING_TARGET_OPTIONS = Object.entries(WEARING_TARGET_LABELS) as [WearingTarget, string][];
const FEE_POLICY_OPTIONS = Object.entries(FEE_POLICY_LABELS) as [FeePolicy, string][];

// 메인 컴포넌트
export interface SaleFormBodyProps {
  form: SaleForm;
  openSections: Set<SectionKey>;
  onToggleSection: (key: SectionKey) => void;
  onFormChange: (updates: Partial<SaleForm>) => void;
  onOpenOotdPicker: () => void;
  onRemoveOotd: (id: number) => void;
  selectedOotds: { id: number; imageUrl: string }[];
  submitLabel: string;
  onSubmit: () => void;
  isBasic?: boolean;
}

const SaleFormBody = ({
  form,
  openSections,
  onToggleSection,
  onFormChange,
  onOpenOotdPicker,
  onRemoveOotd,
  selectedOotds,
  submitLabel,
  onSubmit,
  isBasic = false,
}: SaleFormBodyProps) => {
  const subCategories = CATEGORY_GROUPS.find((g) => g.name === form.categoryLarge)?.items ?? [];
  const sizes = CATEGORY_SIZES[form.categoryLarge] ?? [];
  const measurementFieldKeys = CATEGORY_FIELDS[form.categoryLarge];

  return (
    <div>
      {/* 대표 사진 */}
      <div className="px-4 pt-5 pb-3">
        <p className="text-body-2 text-text-primary mb-2 font-medium">
          대표 사진
          <Req />
        </p>
        <div className="bg-gray-bg size-[120px] overflow-hidden rounded-xl">
          {form.mainImageUrl ? (
            <img src={form.mainImageUrl} alt="대표 사진" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center">
              <img src={plus} alt="" className="size-8 opacity-30" />
            </div>
          )}
        </div>
      </div>

      {/* 브랜드명 */}
      <div className="px-4 py-2">
        <p className="text-body-2 text-text-primary mb-1 font-medium">
          브랜드명
          <Req />
        </p>
        <Input
          size={48}
          value={form.brandName}
          showPasswordToggle={false}
          onChange={(e) => onFormChange({ brandName: e.target.value })}
          onClear={() => onFormChange({ brandName: '' })}
          placeholder="브랜드명"
        />
      </div>

      {/* 아이템명 */}
      <div className="px-4 py-2 pb-4">
        <p className="text-body-2 text-text-primary mb-1 font-medium">
          아이템명
          <Req />
        </p>
        <Input
          size={48}
          value={form.itemName}
          showPasswordToggle={false}
          onChange={(e) => onFormChange({ itemName: e.target.value })}
          onClear={() => onFormChange({ itemName: '' })}
          placeholder="아이템명"
        />
      </div>

      {/* 카테고리 */}
      <div className="border-border-secondary border-t px-4">
        <SectionHeader
          label={
            <>
              카테고리
              <Req />
            </>
          }
          open={openSections.has('category')}
          onToggle={() => onToggleSection('category')}
        />
        {openSections.has('category') && (
          <div className="flex flex-wrap gap-2 pb-4">
            {CATEGORIES.map((cat) => (
              <SelectChip
                key={cat}
                label={cat}
                selected={form.categoryLarge === cat}
                onClick={() =>
                  onFormChange({
                    categoryLarge: cat,
                    categorySmall: '',
                    sizeValue: '',
                    sizeSystem: '',
                    measurements: {},
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* 세부 카테고리 */}
      <div className="border-border-secondary border-t px-4">
        <SectionHeader
          label={
            <>
              세부 카테고리
              <Req />
            </>
          }
          open={openSections.has('subCategory')}
          onToggle={() => onToggleSection('subCategory')}
        />
        {openSections.has('subCategory') && (
          <div className="flex flex-wrap gap-2 pb-4">
            {subCategories.map((sub) => (
              <SelectChip
                key={sub}
                label={sub}
                selected={form.categorySmall === sub}
                onClick={() => onFormChange({ categorySmall: sub })}
              />
            ))}
          </div>
        )}
      </div>

      {/* 사이즈 */}
      <div className="border-border-secondary border-t px-4">
        <SectionHeader
          label={
            <>
              사이즈
              <Req />
            </>
          }
          open={openSections.has('size')}
          onToggle={() => onToggleSection('size')}
        />
        {openSections.has('size') && (
          <div className="flex flex-wrap gap-2 pb-4">
            {sizes.map((size) => (
              <SelectChip
                key={`${size.system}-${size.value}`}
                label={size.value}
                selected={form.sizeValue === size.value && form.sizeSystem === size.system}
                onClick={() => onFormChange({ sizeValue: size.value, sizeSystem: size.system })}
              />
            ))}
          </div>
        )}
      </div>

      {/* 착용 대상 */}
      <div className="border-border-secondary border-t p-4">
        <p className="text-body-1 text-text-primary mb-3 font-semibold">
          착용 대상
          <Req />
        </p>
        <div className="flex flex-wrap gap-2">
          {WEARING_TARGET_OPTIONS.map(([value, label]) => (
            <SelectChip
              key={value}
              label={label}
              selected={form.wearingTarget === value}
              onClick={() => onFormChange({ wearingTarget: value })}
            />
          ))}
        </div>
      </div>

      {/* 수수료 부담 */}
      <div className="border-border-secondary border-t p-4">
        <p className="text-body-1 text-text-primary mb-3 font-semibold">
          수수료 부담
          <Req />
        </p>
        <div className="flex flex-wrap gap-2">
          {FEE_POLICY_OPTIONS.map(([value, label]) => (
            <SelectChip
              key={value}
              label={label}
              selected={form.feePolicy === value}
              onClick={() => onFormChange({ feePolicy: value })}
              disabled={isBasic && value !== 'SELLER_PAYS'}
            />
          ))}
        </div>
      </div>

      {/* 배송비 / 가격 */}
      <div className="border-border-secondary grid grid-cols-2 gap-3 border-t p-4">
        <div>
          <p className="text-body-2 text-text-primary mb-1 font-medium">
            배송비
            <Req />
          </p>
          <div
            className={cn(
              'border-border flex h-12 items-center rounded-lg border px-3',
              isBasic && 'bg-gray-bg',
            )}
          >
            <input
              type="number"
              inputMode="numeric"
              value={isBasic ? '0' : form.shippingFee}
              onChange={(e) => !isBasic && onFormChange({ shippingFee: e.target.value })}
              placeholder="0"
              disabled={isBasic}
              className="text-body-2 text-text-primary placeholder:text-text-tertiary min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
            />
            <span className="text-body-3 text-text-tertiary shrink-0">원</span>
          </div>
        </div>
        <div>
          <p className="text-body-2 text-text-primary mb-1 font-medium">
            가격
            <Req />
          </p>
          <div className="border-border flex h-12 items-center rounded-lg border px-3">
            <input
              type="number"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => onFormChange({ price: e.target.value })}
              placeholder="0"
              className="text-body-2 text-text-primary placeholder:text-text-tertiary min-w-0 flex-1 bg-transparent outline-none"
            />
            <span className="text-body-3 text-text-tertiary shrink-0">원</span>
          </div>
        </div>
      </div>

      {/* 대표 OOTD */}
      <div className="border-border-secondary border-t p-4">
        <p className="text-body-1 text-text-primary mb-3 font-semibold">
          대표 OOTD (1개 이상)
          <Req />
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={onOpenOotdPicker}
            className="bg-gray-bg flex size-20 shrink-0 items-center justify-center rounded-xl"
          >
            <img src={plus} alt="OOTD 추가" className="size-6 opacity-50" />
          </button>
          {selectedOotds.map((ootd) => (
            <div key={ootd.id} className="relative size-20 shrink-0 overflow-hidden rounded-xl">
              <img src={ootd.imageUrl} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveOotd(ootd.id)}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60"
                aria-label="OOTD 제거"
              >
                <img src={close} alt="" className="size-3 invert" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 실측 입력 (카테고리별 동적) */}
      {measurementFieldKeys && (
        <div className="border-border-secondary border-t p-4">
          <p className="text-body-1 text-text-primary mb-4 font-semibold">
            실측 입력 · {form.categoryLarge}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {measurementFieldKeys.map((key) => (
              <MeasurementField
                key={key}
                label={MEASUREMENT_LABELS[key]}
                value={form.measurements[key] ?? ''}
                onChange={(v) => onFormChange({ measurements: { ...form.measurements, [key]: v } })}
              />
            ))}
          </div>
        </div>
      )}

      {/* 상태 이상 체크 */}
      <div className="border-border-secondary border-t px-4">
        <p className="text-body-1 text-text-primary py-4 font-semibold">상태 이상 체크</p>
        <div className="divide-border-secondary divide-y">
          {(
            Object.entries(form.conditionFlags) as [keyof typeof form.conditionFlags, boolean][]
          ).map(([key, checked]) => (
            <ConditionRow
              key={key}
              label={CONDITION_FLAG_LABELS[key]}
              checked={checked}
              onChange={(v) =>
                onFormChange({ conditionFlags: { ...form.conditionFlags, [key]: v } })
              }
            />
          ))}
        </div>
      </div>

      {/* 판매자 설명 */}
      <div className="border-border-secondary border-t p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-body-1 text-text-primary font-semibold">판매자 설명</p>
          <button
            type="button"
            className="text-body-3 text-brand"
            onClick={() => document.getElementById('sale-description')?.focus()}
          >
            직접 입력
          </button>
        </div>
        <textarea
          id="sale-description"
          value={form.sellerDescription}
          onChange={(e) => onFormChange({ sellerDescription: e.target.value })}
          placeholder="짧은 설명, 구매자가 알아야 할 내용 및 내용을 적절하게 설명해주세요."
          rows={5}
          className="border-border text-body-2 text-text-primary placeholder:text-text-tertiary w-full resize-none rounded-lg border p-3 outline-none"
        />
      </div>

      {/* 제출 버튼 */}
      <div className="p-4 pb-10">
        <CTAButton label={submitLabel} onClick={onSubmit} fullWidth />
      </div>
    </div>
  );
};

export default SaleFormBody;
