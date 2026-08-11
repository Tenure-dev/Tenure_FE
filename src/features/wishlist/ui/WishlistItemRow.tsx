import { useNavigate } from 'react-router-dom';
import { Bell, BellRing } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { getItemDetail } from '@/features/mypage/api/itemsApi';
import { getTradeList } from '@/features/trade/api/tradeApi';
import type { WishlistItem } from '../model/types';

// TradeDetailPage로 보낼 수 있는 건 결제~구매확정 단계뿐 — SETTLED 이후(정산 완료)는
// 거래가 끝난 상태라 위시리스트의 '거래중'(TRADING 상품 상태) 표시와는 이미 어긋난다.
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

  // 위시리스트는 itemId만 내려오므로 상품 상세로 가려면 productId를 먼저 조회해야 한다
  // (판매 전환 이력이 없는 아이템은 productId가 없어 item 모드로 대체한다).
  // 거래중이면 먼저 "내가 참여한 거래" 목록에서 이 아이템을 찾아본다 — GET /trades는
  // 참여자(구매자/판매자)의 거래만 돌려주므로(TradeController.java:42), 여기서 찾아지면
  // 내가 그 거래의 당사자라는 뜻이라 거래 상세로 바로 보낼 수 있다. 못 찾으면(제3자로서
  // 위시만 걸어둔 경우) 상품 상세로 보낸다 — /trade/:id는 참여자가 아니면 404라서
  // 무작정 보낼 수 없다(TradeService.java:170-178).
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
