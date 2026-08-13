import { Menu } from 'lucide-react';
import { leftArrow } from '@/shared/assets';

export interface ViewHeaderProps {
  onBack: () => void;
  onMoreClick: () => void;
}

const ViewHeader = ({ onBack, onMoreClick }: ViewHeaderProps) => (
  <div className="bg-bg-white sticky top-0 z-30 flex items-center justify-between py-3">
    <button type="button" onClick={onBack} aria-label="뒤로가기">
      <img src={leftArrow} alt="" className="size-5" />
    </button>
    <button type="button" onClick={onMoreClick} aria-label="더보기">
      <Menu size={22} className="text-text-primary" />
    </button>
  </div>
);

export default ViewHeader;
