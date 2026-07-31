import { useQuery } from '@tanstack/react-query';
import { getItemDetail } from '@/features/mypage/api/itemsApi';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { getReceivedOffers, getReceivedIntents } from '../api/receivedApi';

export type OfferMode = 'offer' | 'intent';

export interface ReceivedCard {
  id: number;
  avatar: string;
  name: string;
  price: number | null; // offer: 제안 금액 / intent: null(가격 고정이라 카드엔 안 씀)
  timeLeft: string;
}

export interface ReceivedOffersView {
  mode: OfferMode;
  product: {
    thumbnail: string;
    brand: string;
    price: number | null; // 판매중일 때 고정 판매가
  };
  cards: ReceivedCard[];
  count: number;
}

const formatRemaining = (sec: number): string => {
  if (!sec || sec <= 0) return '마감';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 남음`;
};

export const useReceivedOffers = (itemId: number) => {
  // 1) 아이템 상태 조회 → 판매중(ON_SALE)이면 거래 의사, 아니면 구매 제안
  const itemQuery = useQuery({
    queryKey: ['item-detail', itemId],
    queryFn: () => getItemDetail(itemId),
    enabled: Number.isFinite(itemId),
  });

  const item = itemQuery.data;
  const mode: OfferMode = item?.itemStatus === 'ON_SALE' ? 'intent' : 'offer';

  // 2) 모드에 맞는 목록만 조회 (하나만 enabled → 유니온 타입 회피)
  const offerQuery = useQuery({
    queryKey: ['received-offers', itemId],
    enabled: !!item && mode === 'offer',
    queryFn: () => getReceivedOffers(),
  });

  const intentQuery = useQuery({
    queryKey: ['received-intents', itemId],
    enabled: !!item && mode === 'intent',
    queryFn: () => getReceivedIntents(),
  });

  let view: ReceivedOffersView | undefined;
  if (item) {
    const thumbnail = resolveFileUrl(item.representativeImageUrl);
    const brand = `${item.brandName} / ${item.itemName}`;

    if (mode === 'intent' && intentQuery.data) {
      const rows = intentQuery.data.content.filter((r) => r.itemId === itemId);
      view = {
        mode,
        product: { thumbnail, brand, price: item.price ?? null },
        count: rows.length,
        cards: rows.map((r) => ({
          id: r.intentId,
          avatar: resolveFileUrl(r.buyerProfileImageUrl) || profileDefault,
          name: r.buyerUsername,
          price: null,
          timeLeft: formatRemaining(r.remainingSeconds),
        })),
      };
    } else if (mode === 'offer' && offerQuery.data) {
      const rows = offerQuery.data.content.filter((r) => r.itemId === itemId);
      view = {
        mode,
        product: { thumbnail, brand, price: null },
        count: rows.length,
        cards: rows.map((r) => ({
          id: r.offerId,
          avatar: resolveFileUrl(r.proposerProfileImageUrl) || profileDefault,
          name: r.proposerUsername,
          price: r.offerAmount,
          timeLeft: formatRemaining(r.remainingSeconds),
        })),
      };
    }
  }

  const listLoading = mode === 'intent' ? intentQuery.isLoading : offerQuery.isLoading;
  return { view, isLoading: itemQuery.isLoading || listLoading };
};
