import { ChevronRight } from 'lucide-react';
import type { ItemSeller } from '../model/types';

export interface SellerInfoSectionProps {
  seller: ItemSeller;
  onClick?: () => void;
}

const SellerInfoSection = ({ seller, onClick }: SellerInfoSectionProps) => {
  return (
    <div className="border-border-light border-t p-4">
      <button
        type="button"
        onClick={onClick}
        className="mb-3 flex w-full items-center justify-between"
      >
        <span className="text-title-4 text-text-primary">판매자 정보</span>
        <ChevronRight size={16} className="text-text-secondary" />
      </button>
      <div className="flex items-center gap-3">
        <div className="bg-gray-bg size-10 shrink-0 overflow-hidden rounded-full">
          {seller.avatarUrl && (
            <img src={seller.avatarUrl} alt="" className="size-full object-cover" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-body-1 text-text-primary">{seller.nickname}</span>
          <span className="text-body-4 text-text-secondary">
            팔로워 {seller.followerCount} · 레코드 사용자
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoSection;
