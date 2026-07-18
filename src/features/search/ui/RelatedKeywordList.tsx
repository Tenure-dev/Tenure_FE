import { Search } from 'lucide-react';

export interface RelatedKeywordListProps {
  keywords: string[];
  onSelect: (keyword: string) => void;
}

const RelatedKeywordList = ({ keywords, onSelect }: RelatedKeywordListProps) => {
  if (keywords.length === 0) return null;

  return (
    <div className="px-4 pt-2">
      {keywords.map((keyword) => (
        <button
          key={keyword}
          type="button"
          onClick={() => onSelect(keyword)}
          className="flex w-full items-center gap-3 py-3 text-left"
        >
          <Search size={18} className="text-text-tertiary shrink-0" />
          <span className="text-body-2 text-text-primary truncate">{keyword}</span>
        </button>
      ))}
    </div>
  );
};

export default RelatedKeywordList;
