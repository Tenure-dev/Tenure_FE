import { useNavigate } from 'react-router-dom';
import { Bell, BellRing } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { getItemDetail } from '@/features/mypage/api/itemsApi';
import { getTradeList } from '@/features/trade/api/tradeApi';
import type { WishlistItem } from '../model/types';

const ACTIVE_TRADE_STATUSES = ['PAID', 'SHIPPED', 'DELIVERED', 'PURCHASE_CONFIRMED'] as const;

export interface WishlistItemRowProps {
  item: WishlistItem;
  onToggleNotify: (item: WishlistItem) => void;
}

const formatPrice = (price: number) => `${price.toLocaleString()}원`;

const getBadge = (saleStatus: WishlistItem['saleStatus']) => {
  if (saleStatus === 'TRADING') return { label: '거래중', className: 'text-brand border-brand' };
  if (saleStatus === 'ON_SALE') return { label: '판매중', className: 'text-error border-error' };
  return { label: '미판매', className: 'text-text-tertiary border-border-secondary' };
};

const WishlistItemRow = ({ item, onToggleNotify }: WishlistItemRowProps) => {
  const navigate = useNavigate();
  const badge = getBadge(item.saleStatus);

  // 거래중이면 내가 참여한 거래인지 먼저 확인해 거래 상세로, 아니면(제3자 위시) 상품 상세로 보낸다.
  const handleClick = async () => {
    try {
      if (item.saleStatus === 'TRADING') {
        const { content } = await getTradeList({
          status: [...ACTIVE_TRADE_STATUSES],
          size: 50,
        });
        const myTrade = content.find((trade) => trade.itemId === item.itemId);
        if (myTrade) {
          navigate(`/trade/${myTrade.tradeId}`);
          return;
        }
      }

      const detail = await getItemDetail(item.itemId);
      if (detail.productId) {
        navigate(`/product/${detail.productId}`);
      } else {
        navigate(`/product?itemId=${item.itemId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOfferClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${item.itemId}/offer/price`);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="bg-gray-bg size-20 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="bg-gray-bg size-20 shrink-0 rounded-lg" />
        )}
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
          {(item.saleStatus === 'ON_SALE' || item.saleStatus === 'TRADING') &&
          item.price != null ? (
            <p className="text-body-1 text-text-primary font-semibold">{formatPrice(item.price)}</p>
          ) : item.purchaseOfferEnabled ? (
            <button
              type="button"
              onClick={handleOfferClick}
              className="text-body-2 text-text-primary w-fit underline"
            >
              구매 제안
            </button>
          ) : null}
          <span className="text-body-4 text-text-tertiary">
            {item.sellerUsername ? `${item.sellerUsername} · ` : ''}
            {item.wishedDaysAgo}일 전
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label={item.notifyEnabled ? '알림 끄기' : '알림 켜기'}
        onClick={() => onToggleNotify(item)}
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
