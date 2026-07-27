import { useState } from 'react';
import { cn } from '@/shared/lib/cn';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type Props = {
  onClose: () => void;
  onSelect: (date: Date) => void;
};

const DatePickerSheet = ({ onClose, onSelect }: Props) => {
  const [view, setView] = useState(() => new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const year = view.getFullYear();
  const month = view.getMonth(); // 0-based
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (d: number) =>
    !!selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d;

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <div className="bg-bg-white flex h-[calc(100%-48px)] flex-col rounded-t-2xl px-5 pt-3 pb-6">
        <div className="mb-2 flex justify-center">
          <span className="bg-bg-secondary h-1 w-10 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="relative flex items-center justify-center py-2">
          <button type="button" onClick={onClose} aria-label="닫기" className="absolute left-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <h2 className="text-title-2 font-semibold">날짜 선택</h2>
        </div>

        {/* 월 이동 */}
        <div className="my-4 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => setView(new Date(year, month - 1, 1))}
            aria-label="이전 달"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="text-body-1 font-semibold">
            {year}년 {month + 1}월
          </span>
          <button
            type="button"
            onClick={() => setView(new Date(year, month + 1, 1))}
            aria-label="다음 달"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-body-3 text-text-secondary py-2">
              {w}
            </span>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((d, i) =>
            d === null ? (
              <span key={`blank-${i}`} />
            ) : (
              <button
                key={d}
                type="button"
                onClick={() => setSelected(new Date(year, month, d))}
                className={cn(
                  'text-body-2 font-regular mx-auto flex size-10 items-center justify-center rounded-lg',
                  isSelected(d) && 'bg-brand-tertiary font-semibold',
                )}
              >
                {d}
              </button>
            ),
          )}
        </div>

        {/* 선택 버튼 */}
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className={cn(
            'text-btn-2 mt-6 w-full rounded-md py-3.5 font-medium',
            selected ? 'bg-brand text-text-primary' : 'bg-disabled text-text-inverse',
          )}
        >
          {selected
            ? `${selected.getFullYear()}년 ${selected.getMonth() + 1}월 ${selected.getDate()}일 선택`
            : '선택'}
        </button>
      </div>
    </div>
  );
};

export default DatePickerSheet;
