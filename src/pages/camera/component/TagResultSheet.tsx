import { Input } from '@/shared/components';
import { cn } from '@/shared/lib/cn';
import type { OotdItem } from '@/features/ootd/model/item';
import { SIMILAR_COUNT } from '@/features/ootd/mock';
import TagItemRow from './TagItemRow';

type Props = {
  items: OotdItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  searchMode: boolean;
  query: string;
  onQueryChange: (v: string) => void;
  onSearchOpen: () => void;
  onSearchClose: () => void;
  onNewItem: () => void;
  onComplete: () => void;
};

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TagResultSheet = ({
  items,
  selectedIds,
  onToggle,
  expanded,
  onToggleExpand,
  searchMode,
  query,
  onQueryChange,
  onSearchOpen,
  onSearchClose,
  onNewItem,
  onComplete,
}: Props) => {
  const count = selectedIds.size;
  const showList = expanded || searchMode;

  const filtered = items.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${item.brand} ${item.name}`.toLowerCase().includes(q);
  });

  return (
    <div className="bg-bg-white absolute inset-x-0 bottom-0 flex max-h-[80%] flex-col rounded-t-2xl">
      {/* 손잡이 (탭하여 펼침/접기) */}
      <button
        type="button"
        onClick={onToggleExpand}
        aria-label={expanded ? '접기' : '펼치기'}
        className="flex justify-center py-3"
      >
        <span className="bg-bg-200 h-1 w-10 rounded-full" />
      </button>

      <div className="flex-1 overflow-y-auto px-5">
        {searchMode ? (
          <div className="flex items-center gap-2 pb-3">
            <Input
              size={44}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onClear={() => onQueryChange('')}
              placeholder="검색어를 입력하세요."
              className="flex-1"
            />
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
              유사한 아이템 {SIMILAR_COUNT}개 찾았습니다.
            </p>
          </div>
        )}

        {showList && (
          <div className="pt-3 pb-2">
            {/* 새 아이템 등록 */}
            <button
              type="button"
              onClick={onNewItem}
              className="bg-bg-50 flex w-full items-center gap-3 rounded-xl p-3"
            >
              <span className="bg-bg-200 text-text-secondary flex size-12 shrink-0 items-center justify-center rounded-full text-2xl">
                +
              </span>
              <span className="text-body-2 font-semibold">새 아이템 등록</span>
            </button>

            <h3 className="text-body-2 mt-5 mb-2 font-semibold">기존 아이템</h3>
            <div className="flex flex-col gap-2">
              {filtered.map((item) => (
                <TagItemRow
                  key={item.id}
                  item={item}
                  selected={selectedIds.has(item.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 선택 완료 */}
      <div className="px-5 pt-2 pb-6">
        <button
          type="button"
          disabled={count === 0}
          onClick={onComplete}
          className={cn(
            'text-btn-2 w-full rounded-md py-3.5 font-medium',
            count > 0 ? 'bg-brand text-text-primary' : 'bg-disabled text-text-inverse',
          )}
        >
          선택 완료{count > 0 ? ` (${count})` : ''}
        </button>
      </div>
    </div>
  );
};

export default TagResultSheet;
