export interface RecommendedKeywordsProps {
  keywords: string[];
  onSelect: (keyword: string) => void;
}

const RecommendedKeywords = ({ keywords, onSelect }: RecommendedKeywordsProps) => {
  return (
    <div className="px-4 pt-4">
      <h2 className="text-body-1 text-text-primary font-semibold">추천 검색어</h2>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {keywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => onSelect(keyword)}
            className="border-border-secondary text-body-2 text-text-primary inline-flex h-9 shrink-0 items-center justify-center rounded-full border px-4 whitespace-nowrap"
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendedKeywords;
