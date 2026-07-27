import { useNavigate } from 'react-router-dom';
import { Bell, BellRing } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { WishlistItem } from '../model/types';

export interface WishlistItemRowProps {
  item: WishlistItem;
  onToggleNotify: (id: string) => void;
}

const formatPrice = (price: number) => `${price.toLocaleString()}원`;

const getBadge = (item: WishlistItem) => {
  if (item.tradeStatus === 'waiting' || item.tradeStatus === 'created') {
    return { label: '거래중', className: 'text-brand border-brand' };
  }
  if (item.saleStatus === 'onSale') {
    return { label: '판매중', className: 'text-error border-error' };
  }
  return { label: '미판매', className: 'text-text-tertiary border-border-secondary' };
};

const WishlistItemRow = ({ item, onToggleNotify }: WishlistItemRowProps) => {
  const navigate = useNavigate();
  const badge = getBadge(item);
  const canOffer = item.saleStatus === 'unlisted' && item.tradeStatus === 'none';

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        type="button"
        onClick={() => navigate(`/item/${item.itemId}`)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <img
          src={item.imageUrl}
          alt=""
          className="bg-gray-bg size-20 shrink-0 rounded-lg object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={cn(
              'text-body-4 w-fit rounded-full border px-2 py-0.5 font-semibold',
              badge.className,
            )}
          >
            {badge.label}
          </span>
          <p className="text-body-1 text-text-primary truncate font-semibold">
            {item.brand} / {item.name}
          </p>
          {item.saleStatus === 'onSale' ? (
            <p className="text-body-1 text-text-primary font-semibold">{formatPrice(item.price)}</p>
          ) : canOffer ? (
            <span className="text-body-2 text-text-primary w-fit underline">구매 제안</span>
          ) : null}
          <p className="text-body-3 text-text-tertiary">
            {item.sellerName} · {item.updatedAt}
          </p>
        </div>
      </button>

      <button
        type="button"
        aria-label={item.notifyEnabled ? '알림 끄기' : '알림 켜기'}
        onClick={() => onToggleNotify(item.id)}
        className="flex size-9 shrink-0 items-center justify-center"
      >
        {item.notifyEnabled ? (
          <BellRing size={20} className="text-text-primary" fill="currentColor" />
        ) : (
          <Bell size={20} className="text-text-primary" />
        )}
      </button>
    </div>
  );
};

export default WishlistItemRow;
