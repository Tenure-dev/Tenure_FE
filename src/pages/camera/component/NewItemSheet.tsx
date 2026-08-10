import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '@/shared/lib/cn';
import calendar from '@/shared/assets/calendar.svg';
import type { Bbox, OotdItem, WearTarget } from '@/features/ootd/model/item';
import { createTagDraftItem, toWearingTarget, uploadItemImage } from '@/features/ootd/api/item';
import { cropImageToBbox } from '@/features/ootd/lib/cropImage';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import DatePickerSheet from './DatePickerSheet';

type Props = {
  onBack: () => void;
  onSubmit: (item: OotdItem) => void;
  photo?: string | null; // 촬영 사진(dataURL) — bbox 크롭용
  bbox?: Bbox; // 활성 박스 bbox — 이 영역만 대표 이미지로 업로드
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

// 핸들을 이 정도 이상 아래로 끌어내리면 닫힘으로 판단
const DISMISS_THRESHOLD_PX = 120;

const NewItemSheet = ({ onBack, onSubmit, photo, bbox }: Props) => {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState<WearTarget>('남성복');
  const [date, setDate] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // 핸들을 눌러 아래로 끌면 시트가 따라 내려가고, 충분히 내리면 닫힌다(다른 시트들과 동일한 제스처).
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartYRef = useRef<number | null>(null);

  const handleHandlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleHandlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current == null) return;
    setDragY(Math.max(0, e.clientY - dragStartYRef.current));
  };
  const handleHandlePointerUp = () => {
    if (dragStartYRef.current == null) return;
    dragStartYRef.current = null;
    setDragging(false);
    if (dragY > DISMISS_THRESHOLD_PX) {
      onBack();
    } else {
      setDragY(0);
    }
  };

  const canSubmit = brand.trim() !== '' && name.trim() !== '';

  // 대표 이미지 미리보기 — bbox 영역을 크롭해 objectURL로 표시 (업로드될 이미지 확인용)
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!photo || !bbox) return; // preview 기본값이 null이라 별도 초기화 불필요
    let url: string | null = null;
    let cancelled = false;
    cropImageToBbox(photo, bbox)
      .then((file) => {
        if (cancelled) return;
        url = URL.createObjectURL(file);
        setPreview(url);
      })
      .catch(() => setPreview(null));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [photo, bbox]);

  const [submitting, setSubmitting] = useState(false);
  const { message: toast, show: showToast, hide: hideToast } = useToast();

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      // bbox 영역만 크롭해 대표 이미지로 업로드 → URL 확보 (실패해도 아이템 등록은 진행)
      let representativeImageUrl: string | undefined;
      if (photo && bbox) {
        try {
          const cropped = await cropImageToBbox(photo, bbox);
          const uploaded = await uploadItemImage(cropped);
          representativeImageUrl = uploaded.imageUrl;
        } catch {
          // 이미지 업로드 실패는 무시하고 아이템만 등록
        }
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
    <div
      className="absolute inset-0 z-10 flex flex-col justify-end bg-black/30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onBack(); // 배경 자체를 눌렀을 때만 닫기(내부 클릭 버블링 무시)
      }}
    >
      <div
        className={cn(
          'bg-bg-white flex h-[calc(100%-48px)] flex-col rounded-t-2xl px-5 pt-3 pb-6 select-none',
          !dragging && 'transition-transform duration-200 ease-out',
          datePickerOpen && 'hidden',
        )}
        style={{ transform: dragY ? `translateY(${dragY}px)` : undefined }}
      >
        <div
          onPointerDown={handleHandlePointerDown}
          onPointerMove={handleHandlePointerMove}
          onPointerUp={handleHandlePointerUp}
          onPointerCancel={handleHandlePointerUp}
          onDragStart={(e) => e.preventDefault()}
          className="mb-2 flex shrink-0 touch-none justify-center py-1 select-none"
        >
          <span className="bg-bg-secondary h-1 w-10 rounded-full" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <h2 className="text-title-2 mb-5 font-semibold">새 아이템 등록</h2>
          <div className="mb-4">
            <label className="text-body-3 mb-1.5 block font-medium">대표 이미지</label>
            <div className="border-border-secondary bg-bg-secondary flex size-24 items-center justify-center overflow-hidden rounded-md border">
              {preview ? (
                <img
                  src={preview}
                  alt="대표 이미지 미리보기"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="size-full object-cover"
                />
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
