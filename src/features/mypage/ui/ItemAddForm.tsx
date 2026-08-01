import { useState } from 'react';
import { chevon, close, plus } from '@/shared/assets';
import { DoubleButton, Input, Toast } from '@/shared/components';
import { CATEGORY_GROUPS, CATEGORY_SIZES } from '@/shared/lib/itemSizeData';
import { useCreateItem } from '../model/useCreateItem';
import { uploadItemImage } from '../api/itemsApi';
import type { WearingTarget } from '../model/items';
import { useToast } from '@/shared/hooks/useToast';
import cn from '@/shared/lib/cn';
import ImagePickerSheet from './image/ImagePickerSheet';
import ItemImageCropView from './image/ImageCropView';
import PostPickerView from './image/PostPickerView';

const CATEGORIES = CATEGORY_GROUPS.map((g) => g.name);

const GENDERS = ['남성복', '여성복', '공용'] as const;
type WearTarget = (typeof GENDERS)[number];
type SectionKey = 'category' | 'subCategory' | 'size' | 'gender';

const WEAR_TARGET_MAP: Record<WearTarget, WearingTarget> = {
  남성복: 'MENSWEAR',
  여성복: 'WOMENSWEAR',
  공용: 'UNISEX',
};

interface ItemAddFormState {
  brand: string;
  name: string;
  category: string;
  subCategory: string;
  size: string;
  sizeSystem: string;
  gender: WearTarget | '';
  firstOwnedAt: string;
}

const EMPTY_FORM: ItemAddFormState = {
  brand: '',
  name: '',
  category: '',
  subCategory: '',
  size: '',
  sizeSystem: '',
  gender: '',
  firstOwnedAt: '',
};

type PickerState =
  | { step: 'idle' }
  | { step: 'picker' }
  | { step: 'post-picking' }
  | { step: 'cropping'; imageUrl: string; from: 'album' | 'post' };

const TODAY = new Date().toISOString().split('T')[0];

const Required = () => <span className="text-error ml-0.5">*</span>;

const SectionHeader = ({
  label,
  open,
  onToggle,
}: {
  label: React.ReactNode;
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

export interface ItemAddFormProps {
  onSuccess: () => void;
}

const ItemAddForm = ({ onSuccess }: ItemAddFormProps) => {
  const [form, setForm] = useState<ItemAddFormState>(EMPTY_FORM);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set<SectionKey>(['category', 'subCategory', 'size', 'gender']),
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pickerState, setPickerState] = useState<PickerState>({ step: 'idle' });
  const [isUploading, setIsUploading] = useState(false);
  const { message: errorMsg, show: showError, hide: hideError } = useToast();
  const { mutate: createItem, isPending } = useCreateItem();

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const subCategories = CATEGORY_GROUPS.find((g) => g.name === form.category)?.items ?? [];

  const handleFileSelected = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    setPickerState({ step: 'cropping', imageUrl: blobUrl, from: 'album' });
  };

  const handlePostSelected = (imageUrl: string) => {
    setPickerState({ step: 'cropping', imageUrl, from: 'post' });
  };

  const handleCropConfirm = (croppedDataUrl: string) => {
    if (pickerState.step === 'cropping' && pickerState.from === 'album') {
      URL.revokeObjectURL(pickerState.imageUrl);
    }
    setImagePreview(croppedDataUrl);
    setPickerState({ step: 'idle' });
  };

  const handleCropCancel = () => {
    if (pickerState.step !== 'cropping') return;
    if (pickerState.from === 'album') {
      URL.revokeObjectURL(pickerState.imageUrl);
      setPickerState({ step: 'idle' });
    } else {
      setPickerState({ step: 'post-picking' });
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!imagePreview) {
      showError('대표 사진을 선택해주세요');
      return;
    }
    if (!form.brand || !form.name || !form.category || !form.gender) {
      showError('필수 항목을 모두 입력해주세요');
      return;
    }

    let representativeImageUrl: string | undefined;
    try {
      setIsUploading(true);
      const blob = await fetch(imagePreview).then((r) => r.blob());
      const file = new File([blob], 'item-image.jpg', { type: blob.type });
      const uploaded = await uploadItemImage(file);
      representativeImageUrl = uploaded.imageUrl;
    } catch {
      showError('이미지 업로드에 실패했습니다');
      return;
    } finally {
      setIsUploading(false);
    }

    createItem(
      {
        brandName: form.brand,
        itemName: form.name,
        wearingTarget: WEAR_TARGET_MAP[form.gender],
        categoryLarge: form.category,
        ...(form.subCategory && { categorySmall: form.subCategory }),
        sizeSystem: 'KR',
        ...(form.size && { sizeValue: form.size }),
        ...(form.firstOwnedAt && { firstOwnedAt: form.firstOwnedAt }),
        representativeImageUrl,
      },
      {
        onSuccess,
        onError: () => showError('아이템 등록에 실패했습니다'),
      },
    );
  };

  return (
    <>
      <div className="pb-28">
        {/* 대표 사진 */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-body-2 text-text-secondary mb-2">
            대표 사진
            <Required />
          </p>
          <button
            type="button"
            onClick={() => setPickerState({ step: 'picker' })}
            className="bg-gray-bg flex size-24 items-center justify-center overflow-hidden rounded-lg"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="대표 사진" className="size-full object-cover" />
            ) : (
              <img src={plus} alt="사진 추가" className="size-6 opacity-40" />
            )}
          </button>
        </div>

        {/* 브랜드명 */}
        <div className="px-4 py-2">
          <p className="text-body-2 text-text-secondary mb-1">
            브랜드명
            <Required />
          </p>
          <Input
            size={48}
            showPasswordToggle={false}
            value={form.brand}
            onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, brand: '' }))}
            placeholder="브랜드명"
          />
        </div>

        {/* 아이템명 */}
        <div className="px-4 py-2">
          <p className="text-body-2 text-text-secondary mb-1">
            아이템명
            <Required />
          </p>
          <Input
            size={48}
            showPasswordToggle={false}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            onClear={() => setForm((prev) => ({ ...prev, name: '' }))}
            placeholder="아이템명"
          />
        </div>

        {/* 카테고리 / 세부 카테고리 / 사이즈 / 착용 대상 */}
        <div className="px-4">
          <div className="border-border-secondary border-t">
            <SectionHeader
              label={
                <>
                  카테고리
                  <Required />
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
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        category: cat,
                        subCategory: '',
                        size: '',
                        sizeSystem: '',
                      }))
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-border-secondary border-t">
            <SectionHeader
              label={
                <>
                  세부 카테고리
                  <Required />
                </>
              }
              open={openSections.has('subCategory')}
              onToggle={() => toggleSection('subCategory')}
            />
            {openSections.has('subCategory') && (
              <div className="flex flex-wrap gap-2 pb-4">
                {subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <SelectChip
                      key={sub}
                      label={sub}
                      selected={form.subCategory === sub}
                      onClick={() => setForm((prev) => ({ ...prev, subCategory: sub }))}
                    />
                  ))
                ) : (
                  <p className="text-body-2 text-text-disabled pb-2">
                    카테고리를 먼저 선택해주세요
                  </p>
                )}
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
                {(CATEGORY_SIZES[form.category] ?? []).map((o) => (
                  <SelectChip
                    key={`${o.system}-${o.value}`}
                    label={o.value}
                    selected={form.size === o.value && form.sizeSystem === o.system}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, size: o.value, sizeSystem: o.system }))
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-border-secondary border-t">
            <SectionHeader
              label={
                <>
                  착용 대상
                  <Required />
                </>
              }
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

        {/* 최초 보유 날짜 */}
        <div className="px-4 py-2">
          <p className="text-body-2 text-text-secondary mb-1">최초 보유 날짜</p>
          <div className="bg-gray-bg flex h-12 items-center rounded-lg px-4">
            <input
              type="date"
              className="text-body-1 text-text-primary flex-1 bg-transparent outline-none"
              value={form.firstOwnedAt}
              max={TODAY}
              onChange={(e) => setForm((prev) => ({ ...prev, firstOwnedAt: e.target.value }))}
            />
            {form.firstOwnedAt && (
              <button
                type="button"
                aria-label="날짜 지우기"
                onClick={() => setForm((prev) => ({ ...prev, firstOwnedAt: '' }))}
              >
                <img src={close} alt="" className="size-4 opacity-40" />
              </button>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="border-border-secondary bg-bg-white fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t p-4">
          <DoubleButton
            layout="half"
            leftLabel="초기화"
            rightLabel="적용하기"
            onLeftClick={handleReset}
            onRightClick={handleSubmit}
            disabled={isPending || isUploading}
          />
        </div>
      </div>

      {/* 이미지 피커 플로우 */}
      <ImagePickerSheet
        open={pickerState.step === 'picker'}
        onClose={() => setPickerState({ step: 'idle' })}
        onFileSelected={handleFileSelected}
        onPickFromPost={() => setPickerState({ step: 'post-picking' })}
      />
      <PostPickerView
        open={pickerState.step === 'post-picking'}
        onClose={() => setPickerState({ step: 'idle' })}
        onSelect={handlePostSelected}
      />
      {pickerState.step === 'cropping' && (
        <ItemImageCropView
          imageUrl={pickerState.imageUrl}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}

      <Toast message={errorMsg} onClose={hideError} />
    </>
  );
};

export default ItemAddForm;
