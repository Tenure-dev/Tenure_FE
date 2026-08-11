import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { cn } from '@/shared/lib/cn';
import type { OotdItem } from '@/features/ootd/model/item';
import imageUpload from '@/shared/assets/image-upload.svg';
import TagItemRow from './TagItemRow';

type Props = {
  items: OotdItem[];
  activeItemId?: string; // 활성 박스에 부착된 아이템 id
  onSelect: (id: string) => void; // 아이템 선택 → 활성 박스에 부착/해제
  active: boolean; // 활성 박스 존재 여부 (없으면 빈 상태)
  count: number; // 완성된 태그(아이템 부착된 박스) 수
  searchMode: boolean;
  query: string;
  onQueryChange: (v: string) => void;
  onSearchOpen: () => void;
  onSearchClose: () => void;
  onNewItem: () => void;
  onBbox: () => void;
  overlay?: 'absolute' | 'fixed';
  onHeightChange?: (height: number) => void;
  onExpandedChange?: (expanded: boolean) => void; // 시트가 최대 높이에 도달했는지
};

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 3단계 스냅 높이
export const COLLAPSED = 100; // 맨 아래 (선택 완료 버튼만)
export const MIDDLE = 178; // 중간 (분석한 결과 헤더 + 검색까지) — 기본
const TOP_GAP = 48; // 끝까지 올렸을 때 화면 위로 남기는 여백

const TagResultSheet = ({
  items,
  activeItemId,
  onSelect,
  active,
  count,
  searchMode,
  query,
  onQueryChange,
  onSearchOpen,
  onSearchClose,
  onNewItem,
  onBbox,
  overlay = 'absolute',
  onHeightChange,
  onExpandedChange,
}: Props) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  const [height, setHeight] = useState(MIDDLE);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    onHeightChange?.(height);
    // 최대 높이 근처(40px 이내)면 '펼쳐짐'으로 간주 → 헤더 숨김 트리거
    onExpandedChange?.(height >= window.innerHeight - TOP_GAP - 40);
  }, [height, onHeightChange, onExpandedChange]);

  // 박스가 비활성→활성으로 바뀌면(말풍선 클릭 등) 시트를 중간 높이로 올린다.
  // (effect 대신 이전 값 비교로 렌더 중 조정 — React 권장 패턴)
  const [prevActive, setPrevActive] = useState(active);
  if (active !== prevActive) {
    setPrevActive(active);
    if (active) setHeight(MIDDLE);
  }

  const collapsed = height <= COLLAPSED; // 접힌 상태면 버튼 닫힌 색

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${item.brand} ${item.name}`.toLowerCase().includes(q);
  });

  // 끝까지 올렸을 때 최대 높이 (화면 절반까지만)
  const getMaxH = () => window.innerHeight - TOP_GAP;

  // 드래그로 자유롭게, 놓으면 3단계 중 가까운 곳으로 스냅
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startY: e.clientY, startH: sheetRef.current?.offsetHeight ?? height };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = dragRef.current.startY - e.clientY; // 위로 = +
    setHeight(Math.min(Math.max(dragRef.current.startH + delta, COLLAPSED), getMaxH()));
  };
  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    // 현재 실제 높이 기준으로 가까운 스냅 지점으로
    const current = sheetRef.current?.offsetHeight ?? height;
    const points = [COLLAPSED, MIDDLE, getMaxH()];
    const nearest = points.reduce((a, b) =>
      Math.abs(b - current) < Math.abs(a - current) ? b : a,
    );
    setHeight(nearest);
  };

  return (
    <div
      ref={sheetRef}
      style={{ height }}
      className={cn(
        'bg-bg-white inset-x-0 bottom-0 mx-auto flex max-w-[768px] flex-col rounded-t-2xl shadow-xl',
        overlay === 'fixed' ? 'fixed' : 'absolute',
        !dragging && 'transition-[height] duration-200',
      )}
    >
      {/* 드래그 핸들 */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex shrink-0 cursor-grab touch-none justify-center py-3 active:cursor-grabbing"
      >
        <span className="bg-bg-secondary h-1 w-10 rounded-full" />
      </div>

      <div
        onDragStart={(e) => e.preventDefault()}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 select-none"
      >
        {!active ? (
          <div className="flex h-full flex-col items-center justify-center pb-8 text-center">
            <p className="text-body-2 text-text-secondary leading-relaxed">
              이미지에서 아이템을 탭해
              <br />
              태그를 추가하세요.
            </p>
          </div>
        ) : searchMode ? (
          <div className="flex items-center gap-2 pb-3">
            <div className="border-border-secondary bg-bg-white flex h-11 flex-1 items-center gap-2 rounded-md border px-3.5">
              <span className="text-text-tertiary shrink-0">
                <SearchIcon />
              </span>
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="검색어를 입력하세요."
                className="placeholder:text-text-tertiary flex-1 bg-transparent text-[16px] outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  aria-label="지우기"
                  className="shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <circle cx="10" cy="10" r="9" fill="#C4C4C4" />
                    <path
                      d="M7 7l6 6M13 7l-6 6"
                      stroke="#fff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button type="button" onClick={onSearchClose} className="text-body-2 shrink-0">
              취소
            </button>
          </div>
        ) : (
          <div className="border-border-secondary border-b pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-title-2 font-semibold">분석한 결과</h2>
              <button type="button" onClick={onSearchOpen} aria-label="검색">
                <SearchIcon />
              </button>
            </div>
            <p className="text-body-3 text-text-secondary mt-1">
              유사한 아이템 {items.length}개 찾았습니다.
            </p>
          </div>
        )}

        {active && (
          <div className="pt-3 pb-2">
            {/* 새 아이템 등록 */}
            <button
              type="button"
              onClick={onNewItem}
              className="bg-bg-quaternary flex h-20 w-full items-center gap-2.5 rounded-xl px-3"
            >
              <img src={imageUpload} width={48} height={48} alt="" className="shrink-0" />
              <span className="text-body-2 font-semibold">새 아이템 등록</span>
            </button>

            <h3 className="text-body-2 mt-5 mb-2 font-semibold">기존 아이템</h3>
            <div className="flex flex-col gap-2">
              {filtered.map((item) => (
                <TagItemRow
                  key={item.id}
                  item={item}
                  selected={item.id === activeItemId}
                  onToggle={onSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 선택 완료 → 시트 접기 (게시물 미리보기 이동은 헤더 '완료' 버튼만) */}
      <div className="shrink-0 px-5 pt-2 pb-6">
        <button
          type="button"
          disabled={count === 0}
          onClick={() => {
            setHeight(COLLAPSED);
            onBbox();
          }}
          className={cn(
            'text-btn-2 w-full rounded-md py-3.5 font-medium',
            count > 0 && !collapsed
              ? 'bg-brand text-text-primary'
              : 'bg-disabled text-text-inverse',
          )}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

export default TagResultSheet;
