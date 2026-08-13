import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RepresentativeOOTD } from '../model/types';

export interface RepresentativeOOTDSectionProps {
  title?: string;
  items: RepresentativeOOTD[];
  onMoreClick?: () => void;
}

const RepresentativeOOTDSection = ({
  title = '대표 OOTD',
  items,
  onMoreClick,
}: RepresentativeOOTDSectionProps) => {
  return (
    <div className="border-border-secondary border-t-2 p-4 md:px-6">
      <div className="mb-3 flex w-full items-center justify-between">
        <span className="text-title-4 text-text-primary">{title}</span>
        <button type="button" onClick={onMoreClick} aria-label={`${title} 더보기`}>
          <ChevronRight size={18} className="text-text-primary" />
        </button>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {items.map((item) => (
          <Link key={item.id} to={`/ootd/${item.id}`} className="block shrink-0">
            <img
              src={item.imageUrl}
              alt=""
              className="size-[104px] rounded-md object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RepresentativeOOTDSection;
