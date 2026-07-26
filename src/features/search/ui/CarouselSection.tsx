import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import { saveRecentOotd } from '../api/searchApi';
import type { SearchOotdResponse } from '../api/types';

export interface CarouselSectionProps {
  title: string;
  subtitle: string;
  items: SearchOotdResponse[];
  moreHref: string;
}

const CarouselSection = ({ title, subtitle, items, moreHref }: CarouselSectionProps) => {
  const navigate = useNavigate();

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
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              saveRecentOotd(item.id);
              navigate(`/ootd/${item.id}`);
            }}
            className="shrink-0"
          >
            <img
              src={resolveImageUrl(item.imageUrl)}
              alt=""
              className="bg-gray-bg h-[140px] w-[110px] rounded-lg object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarouselSection;
