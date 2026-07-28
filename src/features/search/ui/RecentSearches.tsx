import { Search, X } from 'lucide-react';
import type { RecentSearchItem } from '../model/types';

export interface RecentSearchesProps {
  searches: RecentSearchItem[];
  onSelect: (keyword: string) => void;
  onRemove: (id: number) => void;
  onClearAll: () => void;
}

const RecentSearches = ({ searches, onSelect, onRemove, onClearAll }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-body-1 text-text-primary font-semibold">최근 검색</h2>
        <button type="button" onClick={onClearAll} className="text-body-3 text-text-tertiary">
          지우기
        </button>
      </div>

      <div className="divide-border-secondary mt-1 divide-y">
        {searches.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3">
            <button
              type="button"
              onClick={() => onSelect(item.keyword)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <Search size={18} className="text-text-tertiary shrink-0" />
              <span className="text-body-2 text-text-primary truncate">{item.keyword}</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`${item.keyword} 삭제`}
              className="text-text-tertiary shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
