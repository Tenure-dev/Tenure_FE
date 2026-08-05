import { type ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface ItemImageSectionProps {
  imageUrls: string[];
  dimmed?: boolean;
  wished: boolean;
  onToggleWish: () => void;
  children?: ReactNode;
}

const ItemImageSection = ({
  imageUrls,
  dimmed = false,
  wished,
  onToggleWish,
  children,
}: ItemImageSectionProps) => {
  return (
    <div className="bg-gray-bg relative aspect-square w-full overflow-hidden">
      <div className="no-scrollbar flex size-full snap-x snap-mandatory overflow-x-auto">
        {imageUrls.map((url) => (
          <img
            key={url}
            src={url}
            alt=""
            className={cn('size-full shrink-0 snap-center object-cover', dimmed && 'grayscale')}
          />
        ))}
      </div>
      {dimmed && <div className="absolute inset-0 bg-black/30" />}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      {children && <div className="absolute inset-x-4 bottom-4 md:inset-x-6">{children}</div>}
      <button
        type="button"
        onClick={onToggleWish}
        aria-label={wished ? '관심 해제' : '관심 등록'}
        className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-white/70 md:right-5"
      >
        <Bell size={18} className={wished ? 'fill-brand text-brand' : 'text-text-primary'} />
      </button>
    </div>
  );
};

export default ItemImageSection;
