import { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import calendar from '@/shared/assets/calendar.svg';
import { plus } from '@/shared/assets';
import type { OotdItem, WearTarget } from '@/features/ootd/model/item';
import { createTagDraftItem, toWearingTarget } from '@/features/ootd/api/item';
import { uploadItemImage } from '@/features/mypage/api/itemsApi';
import ImagePickerSheet from '@/features/mypage/ui/image/ImagePickerSheet';
import ImageCropView from '@/features/mypage/ui/image/ImageCropView';
import PostPickerView from '@/features/mypage/ui/image/PostPickerView';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
// 카메라 플로우(새 OOTD 작성)의 날짜 선택 시트를 그대로 재사용한다 (읽기 전용 재사용, 수정 없음).
import DatePickerSheet from '@/pages/camera/component/DatePickerSheet';

type Props = {
  onBack: () => void;
  onSubmit: (item: OotdItem) => void;
};

type PickerState =
  | { step: 'idle' }
  | { step: 'post-picking' }
  | { step: 'cropping'; imageUrl: string; from: 'album' | 'post' };

const TARGETS: WearTarget[] = ['남성복', '여성복', '공용'];

const Label = ({ children }: { children: string }) => (
  <label className="text-body-3 mb-1.5 block font-medium">
    {children} <span className="text-error">*</span>
  </label>
);

// Date → 'YY.MM.DD'
const formatDate = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getFullYear() % 100)}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
};

// 공용 Input(lucide 의존) 대신 일반 입력 필드 + clear 버튼
const TextField = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div className="bg-bg-secondary flex h-[54px] w-full items-center gap-2 rounded-md px-4">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="placeholder:text-text-tertiary flex-1 bg-transparent text-[16px] outline-none"
    />
    {value && (
      <button type="button" onClick={() => onChange('')} aria-label="지우기" className="shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 6l8 8M14 6l-8 8" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    )}
  </div>
);

const NewItemSheet = ({ onBack, onSubmit }: Props) => {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState<WearTarget>('남성복');
  const [date, setDate] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pickerState, setPickerState] = useState<PickerState>({ step: 'idle' });

  const canSubmit = brand.trim() !== '' && name.trim() !== '';

  const [submitting, setSubmitting] = useState(false);
  const { message: toast, show: showToast, hide: hideToast } = useToast();

  const handleFileSelected = (file: File) => {
    setImagePickerOpen(false);
    const blobUrl = URL.createObjectURL(file);
    setPickerState({ step: 'cropping', imageUrl: blobUrl, from: 'album' });
  };

  const handlePickFromPost = () => {
    setImagePickerOpen(false);
    setPickerState({ step: 'post-picking' });
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

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      let representativeImageUrl: string | undefined;
      if (imagePreview) {
        const blob = await fetch(imagePreview).then((r) => r.blob());
        const file = new File([blob], 'item-image.jpg', { type: blob.type });
        const uploaded = await uploadItemImage(file);
        representativeImageUrl = uploaded.imageUrl;
      }

      // 'YY.MM.DD' → '20YY-MM-DD' (없으면 생략)
      const firstOwnedAt = date ? `20${date.replace(/\./g, '-')}` : undefined;
      const res = await createTagDraftItem({
        brandName: brand.trim(),
        itemName: name.trim(),
        wearingTarget: toWearingTarget(target),
        ...(firstOwnedAt && { firstOwnedAt }),
        ...(representativeImageUrl && { representativeImageUrl }),
      });
      onSubmit({
        id: String(res.itemId),
        brand: res.brandName,
        name: res.itemName,
        meta: '신규 아이템',
        isNew: true,
        thumbnail: representativeImageUrl,
      });
    } catch {
      showToast('아이템 등록에 실패했어요. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/30">
      <div
        className={cn(
          'bg-bg-white flex h-[calc(100%-48px)] flex-col rounded-t-2xl px-5 pt-3 pb-6',
          (datePickerOpen || imagePickerOpen || pickerState.step !== 'idle') && 'hidden',
        )}
      >
        <div className="mb-2 flex shrink-0 justify-center">
          <span className="bg-bg-secondary h-1 w-10 rounded-full" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <h2 className="text-title-2 mb-5 font-semibold">새 아이템 등록</h2>

          <div className="mb-4">
            <p className="text-body-3 mb-1.5 font-medium">사진</p>
            <button
              type="button"
              onClick={() => setImagePickerOpen(true)}
              className="bg-bg-secondary flex size-20 items-center justify-center overflow-hidden rounded-lg"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="아이템 사진" className="size-full object-cover" />
              ) : (
                <img src={plus} alt="사진 추가" className="size-6 opacity-40" />
              )}
            </button>
          </div>

          <div className="mb-4">
            <Label>브랜드명</Label>
            <TextField value={brand} onChange={setBrand} placeholder="브랜드명을 입력하세요." />
          </div>

          <div className="mb-4">
            <Label>제품명</Label>
            <TextField value={name} onChange={setName} placeholder="제품명을 입력하세요." />
          </div>

          <div className="mb-4">
            <Label>착용 대상</Label>
            <div className="flex gap-3">
              {TARGETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTarget(t)}
                  className={cn(
                    'bg-bg-white text-body-3 h-11 rounded-sm border-[1.5px] px-6 font-medium',
                    target === t
                      ? 'border-border-primary text-text-primary'
                      : 'border-border-secondary text-text-secondary',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-body-3 mb-1.5 block font-medium">최초 보유 날짜</label>
            <button
              type="button"
              onClick={() => setDatePickerOpen(true)}
              className="bg-bg-secondary flex h-[54px] w-full items-center gap-2 rounded-md px-4 text-left"
            >
              <img src={calendar} width={20} height={20} alt="" className="shrink-0" />
              <span className={date ? 'text-text-primary' : 'text-text-tertiary'}>
                {date || '26.05.24'}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-bg text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
          >
            뒤로 가기
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={cn(
              'text-btn-2 flex-1 rounded-md py-3.5 font-medium',
              canSubmit && !submitting
                ? 'bg-brand text-text-primary'
                : 'bg-disabled text-text-inverse',
            )}
          >
            {submitting ? '등록 중…' : '등록하기'}
          </button>
        </div>
      </div>

      <ImagePickerSheet
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onFileSelected={handleFileSelected}
        onPickFromPost={handlePickFromPost}
      />

      <PostPickerView
        open={pickerState.step === 'post-picking'}
        onClose={() => setPickerState({ step: 'idle' })}
        onSelect={handlePostSelected}
      />

      {pickerState.step === 'cropping' && (
        <ImageCropView
          imageUrl={pickerState.imageUrl}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}

      {datePickerOpen && (
        <DatePickerSheet
          onClose={() => setDatePickerOpen(false)}
          onSelect={(d) => {
            setDate(formatDate(d));
            setDatePickerOpen(false);
          }}
        />
      )}

      <Toast message={toast} onClose={hideToast} />
    </div>
  );
};

export default NewItemSheet;
