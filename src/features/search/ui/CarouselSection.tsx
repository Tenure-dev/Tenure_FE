import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import { saveRecentOotd } from '../api/searchApi';
import type { SearchOotdResponse } from '../api/types';

export interface CarouselSectionProps {
  title: string;
  subtitle: string;
  items: SearchOotdResponse[];
  moreHref: string;
}

// 가로 스크롤 목록이 너무 길어지지 않도록 6번째 카드까지만 보여주고,
// 그 자리를 블러 처리한 "더보기" 카드로 대체해 더보기 페이지로 유도한다.
const MAX_VISIBLE = 6;

const CarouselSection = ({ title, subtitle, items, moreHref }: CarouselSectionProps) => {
  const navigate = useNavigate();
  const hasMore = items.length > MAX_VISIBLE;
  const visibleItems = items.slice(0, MAX_VISIBLE);

  return (
    <div className="border-border-secondary border-b px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(moreHref)}
        className="flex w-full items-start justify-between text-left"
      >
        <div>
          <h2 className="text-body-1 text-text-primary font-semibold">{title}</h2>
          <p className="text-body-4 text-text-tertiary mt-0.5">{subtitle}</p>
        </div>
        <ArrowRight size={18} className="text-text-tertiary mt-1 shrink-0" />
      </button>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {visibleItems.map((item, index) => {
          const isMoreCard = hasMore && index === MAX_VISIBLE - 1;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (isMoreCard) {
                  navigate(moreHref);
                  return;
                }
                saveRecentOotd(item.id);
                navigate(`/ootd/${item.id}`);
              }}
              className="relative shrink-0"
            >
              <img
                src={resolveImageUrl(item.imageUrl)}
                alt=""
                className={cn(
                  'bg-gray-bg h-[140px] w-[110px] rounded-lg object-cover',
                  isMoreCard && 'blur-[2px] brightness-50',
                )}
              />
              {isMoreCard && (
                <span className="text-body-3 absolute inset-0 flex items-center justify-center font-semibold text-white">
                  더보기
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CarouselSection;
