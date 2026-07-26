import { type ReactNode, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chevon, circleCheck, close, plus } from '@/shared/assets';
import { BackHeader, Checkbox, CTAButton, Input } from '@/shared/components';
import cn from '@/shared/lib/cn';
import { CATEGORY_GROUPS } from '@/features/search/model/categoryData';
import { ootdPickerItems, registeredItemDetails } from './mock';

type View = 'form' | 'ootd-picker' | 'loading' | 'complete';

type Measurements = {
  waistWidth: string;
  lowerWidth: string;
  totalLength: string;
  rise: string;
  inseam: string;
  hem: string;
};

type Conditions = {
  stained: boolean;
  torn: boolean;
  pilling: boolean;
  repaired: boolean;
  missingParts: boolean;
};

type SaleForm = {
  photo: string;
  brand: string;
  name: string;
  category: string;
  subCategory: string;
  size: string;
  gender: string;
  feeBearer: string;
  shippingCost: string;
  price: string;
  ootdIds: string[];
  measurements: Measurements;
  conditions: Conditions;
  description: string;
};

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
const FEE_BEARERS = ['판매자 부담', '구매자 부담', '반반 부담'];

type SectionKey = 'category' | 'subCategory' | 'size';

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

const SaleConversionPage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const item = registeredItemDetails[itemId ?? ''];

  const initForm = (): SaleForm => ({
    photo: item?.imageUrl ?? '',
    brand: item?.brand ?? '',
    name: item?.name ?? '',
    category: item?.category ?? '',
    subCategory: item?.subCategory ?? '',
    size: item?.size ?? '',
    gender: item?.gender ?? '',
    feeBearer: '',
    shippingCost: '',
    price: '',
    ootdIds: [],
    measurements: {
      waistWidth: '',
      lowerWidth: '',
      totalLength: '',
      rise: '',
      inseam: '',
      hem: '',
    },
    conditions: {
      stained: false,
      torn: false,
      pilling: false,
      repaired: false,
      missingParts: false,
    },
    description: '',
  });

  const [view, setView] = useState<View>('form');
  const [form, setForm] = useState<SaleForm>(initForm);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set<SectionKey>(['category', 'subCategory', 'size']),
  );
  const [tempOotdIds, setTempOotdIds] = useState<string[]>([]);

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const subCategories = CATEGORY_GROUPS.find((g) => g.name === form.category)?.items ?? [];

  const handleSubmit = () => {
    setView('loading');
    setTimeout(() => setView('complete'), 2000);
  };

  const openOotdPicker = () => {
    setTempOotdIds(form.ootdIds);
    setView('ootd-picker');
  };

  const toggleTempOotd = (id: string) => {
    setTempOotdIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const confirmOotdSelection = () => {
    setForm((prev) => ({ ...prev, ootdIds: tempOotdIds }));
    setView('form');
  };

  const removeOotd = (id: string) =>
    setForm((prev) => ({ ...prev, ootdIds: prev.ootdIds.filter((i) => i !== id) }));

  const setMeasurement = (key: keyof Measurements, v: string) =>
    setForm((prev) => ({ ...prev, measurements: { ...prev.measurements, [key]: v } }));

  const setCondition = (key: keyof Conditions, v: boolean) =>
    setForm((prev) => ({ ...prev, conditions: { ...prev.conditions, [key]: v } }));

  // ── OOTD Picker ──────────────────────────────────────────────
  if (view === 'ootd-picker') {
    return (
      <div className="bg-bg-white mx-auto flex min-h-screen max-w-md flex-col">
        <BackHeader title="대표 OOTD (최대 5개)" onBack={() => setView('form')} />
        <div className="flex-1 overflow-y-auto p-2">
          <div className="columns-2 gap-2">
            {ootdPickerItems.map((ootd) => {
              const selIdx = tempOotdIds.indexOf(ootd.id);
              const selected = selIdx !== -1;
              return (
                <div
                  key={ootd.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTempOotd(ootd.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleTempOotd(ootd.id)}
                  className="relative mb-2 cursor-pointer break-inside-avoid overflow-hidden rounded-lg"
                >
                  <img src={ootd.imageUrl} alt="" className="w-full object-cover" />
                  {selected && (
                    <div className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/75">
                      <span className="text-body-3 font-semibold text-white">{selIdx + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-border-light border-t p-4">
          <CTAButton label="선택 완료" onClick={confirmOotdSelection} fullWidth />
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────
  if (view === 'loading') {
    return (
      <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
        <BackHeader title="판매 전환" onBack={() => setView('form')} />
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="border-gray-bg border-t-brand size-12 animate-spin rounded-full border-4" />
          <p className="text-title-2 text-text-primary font-semibold">게시하는 중...</p>
        </div>
      </div>
    );
  }

  // ── Complete ──────────────────────────────────────────────────
  if (view === 'complete') {
    return (
      <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
        <header className="border-border-light bg-bg-white flex h-[52px] items-center justify-center border-b px-4">
          <h1 className="text-title-4 text-text-primary font-medium">판매 게시 완료 / 전환 안내</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <img src={circleCheck} alt="complete" className="size-[52px]" />
          <p className="text-title-3 text-text-primary font-semibold">판매 게시가 완료됐습니다.</p>
        </div>
        <div className="p-4">
          <CTAButton label="홈으로" onClick={() => navigate('/')} fullWidth />
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <div className="bg-bg-white mx-auto min-h-screen max-w-md">
      <BackHeader title="판매 전환" />

      <div>
        {/* 대표 사진 */}
        <div className="px-4 pt-5 pb-3">
          <p className="text-body-2 text-text-primary mb-2 font-medium">
            대표 사진
            <Req />
          </p>
          <div className="bg-gray-bg size-[120px] overflow-hidden rounded-xl">
            {form.photo ? (
              <img src={form.photo} alt="대표 사진" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center">
                <img src={plus} alt="사진 추가" className="size-8 opacity-30" />
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
            value={form.brand}
            showPasswordToggle={false}
            onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, brand: '' }))}
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
            value={form.name}
            showPasswordToggle={false}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, name: '' }))}
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

        {/* 착용 대상 */}
        <div className="border-border-secondary border-t p-4">
          <p className="text-body-1 text-text-primary mb-3 font-semibold">
            착용 대상
            <Req />
          </p>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <SelectChip
                key={g}
                label={g}
                selected={form.gender === g}
                onClick={() => setForm((prev) => ({ ...prev, gender: g }))}
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
            {FEE_BEARERS.map((f) => (
              <SelectChip
                key={f}
                label={f}
                selected={form.feeBearer === f}
                onClick={() => setForm((prev) => ({ ...prev, feeBearer: f }))}
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
            <div className="border-border flex h-12 items-center rounded-lg border px-3">
              <input
                type="number"
                inputMode="numeric"
                value={form.shippingCost}
                onChange={(e) => setForm((prev) => ({ ...prev, shippingCost: e.target.value }))}
                placeholder="0"
                className="text-body-2 text-text-primary placeholder:text-text-tertiary min-w-0 flex-1 bg-transparent outline-none"
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
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
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
              onClick={openOotdPicker}
              className="bg-gray-bg flex size-20 shrink-0 items-center justify-center rounded-xl"
            >
              <img src={plus} alt="OOTD 추가" className="size-6 opacity-50" />
            </button>
            {form.ootdIds.map((id) => {
              const ootd = ootdPickerItems.find((o) => o.id === id);
              if (!ootd) return null;
              return (
                <div key={id} className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                  <img src={ootd.imageUrl} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeOotd(id)}
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60"
                    aria-label="OOTD 제거"
                  >
                    <img src={close} alt="" className="size-3 invert" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 실측 입력·비치 */}
        <div className="border-border-secondary border-t p-4">
          <p className="text-body-1 text-text-primary mb-4 font-semibold">실측 입력·비치</p>
          <div className="grid grid-cols-2 gap-3">
            <MeasurementField
              label="허리 단면"
              value={form.measurements.waistWidth}
              onChange={(v) => setMeasurement('waistWidth', v)}
            />
            <MeasurementField
              label="하체 단면"
              value={form.measurements.lowerWidth}
              onChange={(v) => setMeasurement('lowerWidth', v)}
            />
            <MeasurementField
              label="총 기장"
              value={form.measurements.totalLength}
              onChange={(v) => setMeasurement('totalLength', v)}
            />
            <MeasurementField
              label="밑위"
              value={form.measurements.rise}
              onChange={(v) => setMeasurement('rise', v)}
            />
            <MeasurementField
              label="인심"
              value={form.measurements.inseam}
              onChange={(v) => setMeasurement('inseam', v)}
            />
            <MeasurementField
              label="밑단"
              value={form.measurements.hem}
              onChange={(v) => setMeasurement('hem', v)}
            />
          </div>
        </div>

        {/* 상태 이상 체크 */}
        <div className="border-border-secondary border-t px-4">
          <p className="text-body-1 text-text-primary py-4 font-semibold">상태 이상 체크</p>
          <div className="divide-border-secondary divide-y">
            <ConditionRow
              label="오염 있음"
              checked={form.conditions.stained}
              onChange={(v) => setCondition('stained', v)}
            />
            <ConditionRow
              label="찢어짐 있음"
              checked={form.conditions.torn}
              onChange={(v) => setCondition('torn', v)}
            />
            <ConditionRow
              label="보풀/번색 있음"
              checked={form.conditions.pilling}
              onChange={(v) => setCondition('pilling', v)}
            />
            <ConditionRow
              label="수선 이력 있음"
              checked={form.conditions.repaired}
              onChange={(v) => setCondition('repaired', v)}
            />
            <ConditionRow
              label="구성품 누락 있음"
              checked={form.conditions.missingParts}
              onChange={(v) => setCondition('missingParts', v)}
            />
          </div>
        </div>

        {/* 판매자 설명 */}
        <div className="border-border-secondary border-t p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-body-1 text-text-primary font-semibold">판매자 설명</p>
            <button
              type="button"
              className="text-body-3 text-brand"
              onClick={() => {
                const el = document.getElementById('sale-description');
                el?.focus();
              }}
            >
              직접 입력
            </button>
          </div>
          <textarea
            id="sale-description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="짧은 설명, 구매자가 알아야 할 내용 및 내용을 적절하게 설명해주세요."
            rows={5}
            className="border-border text-body-2 text-text-primary placeholder:text-text-tertiary w-full resize-none rounded-lg border p-3 outline-none"
          />
        </div>

        {/* 판매하기 */}
        <div className="p-4 pb-10">
          <CTAButton label="판매하기" onClick={handleSubmit} fullWidth />
        </div>
      </div>
    </div>
  );
};

export default SaleConversionPage;
