import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import calendar from '@/shared/assets/calendar.svg';
import type { Bbox, OotdItem, WearTarget } from '@/features/ootd/model/item';
import {
  createTagDraftItem,
  toWearingTarget,
  createItemRepresentativeImage,
} from '@/features/ootd/api/item';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import DatePickerSheet from './DatePickerSheet';

type Props = {
  onBack: () => void;
  onSubmit: (item: OotdItem) => void;
  bbox?: Bbox; // 활성 박스 bbox — 이 영역으로 대표 이미지 생성
  ootdId?: number; // 대표 이미지 생성 대상 OOTD
};

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

const NewItemSheet = ({ onBack, onSubmit, bbox, ootdId }: Props) => {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState<WearTarget>('남성복');
  const [date, setDate] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const canSubmit = brand.trim() !== '' && name.trim() !== '';

  // 대표 이미지 — 진입 시 백엔드가 원본 OOTD에서 생성한 3:4 대표 이미지를 그대로 미리보기로 표시하고,
  // 등록 시 이 URL을 재사용한다(중복 생성 방지).
  const [repImageUrl, setRepImageUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (ootdId == null || !bbox) return;
    let cancelled = false;
    createItemRepresentativeImage(ootdId, bbox)
      .then((res) => {
        if (!cancelled) setRepImageUrl(res.representativeImageUrl);
      })
      .catch(() => {
        if (!cancelled) setRepImageUrl(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [ootdId, bbox]);

  const preview = repImageUrl ? resolveFileUrl(repImageUrl) : null;

  const [submitting, setSubmitting] = useState(false);
  const { message: toast, show: showToast, hide: hideToast } = useToast();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      // 진입 시 생성해 둔 대표 이미지 URL을 재사용 (없으면 대표 이미지 없이 등록)
      const representativeImageUrl = repImageUrl;

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
        thumbnail: representativeImageUrl ? resolveFileUrl(representativeImageUrl) : undefined,
        meta: '신규 아이템',
        isNew: true,
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
          datePickerOpen && 'hidden',
        )}
      >
        <div className="mb-2 flex shrink-0 justify-center">
          <span className="bg-bg-secondary h-1 w-10 rounded-full" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <h2 className="text-title-2 mb-5 font-semibold">새 아이템 등록</h2>
          <div className="mb-4">
            <label className="text-body-3 mb-1.5 block font-medium">대표 이미지</label>
            <div className="border-border-secondary bg-bg-secondary flex aspect-[3/4] w-24 items-center justify-center overflow-hidden rounded-md border">
              {preview ? (
                <img src={preview} alt="대표 이미지 미리보기" className="size-full object-cover" />
              ) : (
                <span className="text-body-4 text-text-tertiary">이미지 없음</span>
              )}
            </div>
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
