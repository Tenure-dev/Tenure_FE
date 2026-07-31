import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import type { MyPagePurchaseResponse } from '@/features/trade/api/types';

export interface PurchaseHistoryCardProps {
  item: MyPagePurchaseResponse;
  showBadge: boolean;
  onCancel: (item: MyPagePurchaseResponse) => void;
}

type PurchaseCategory = 'OFFERING' | 'TRADING' | 'COMPLETED';

const FINAL_TRADE_STATUSES = ['COMPLETED', 'TRANSFERRED'];

const getCategory = (item: MyPagePurchaseResponse): PurchaseCategory => {
  if (item.historyType !== 'TRADE') return 'OFFERING';
  return FINAL_TRADE_STATUSES.includes(item.status) ? 'COMPLETED' : 'TRADING';
};

const BADGE_LABEL: Record<PurchaseCategory, string> = {
  OFFERING: '대기중',
  TRADING: '거래중',
  COMPLETED: '거래 완료',
};

const formatPrice = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const PurchaseHistoryCard = ({ item, showBadge, onCancel }: PurchaseHistoryCardProps) => {
  const navigate = useNavigate();
  const category = getCategory(item);

  const goToDetail = () => {
    if (category === 'OFFERING') {
      const segment = item.historyType === 'PURCHASE_OFFER' ? 'offer' : 'intent';
      navigate(`/purchase/${segment}/${item.historyId}`);
    } else {
      navigate(`/trade/${item.historyId}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={goToDetail} className="flex flex-col gap-2 text-left">
        <div className="bg-gray-bg relative aspect-square overflow-hidden rounded-lg">
          {showBadge && (
            <span className="text-body-4 absolute top-2 left-2 rounded bg-black/60 px-2 py-1 font-medium text-white">
              {BADGE_LABEL[category]}
            </span>
          )}
          <img src={resolveImageUrl(item.imageUrl)} alt="" className="size-full object-cover" />
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-body-2 text-text-primary truncate font-semibold">
            {item.brandName} / {item.itemName}
          </p>
          <p className="text-body-3 text-text-secondary">
            {formatPrice(item.price)} · {formatDate(item.createdAt)}
          </p>
        </div>
      </button>

      {category === 'OFFERING' && (
        <button
          type="button"
          onClick={() => onCancel(item)}
          className="border-error text-body-3 text-error rounded-md border py-2 font-semibold"
        >
          취소하기
        </button>
      )}
      {category === 'TRADING' && (
        <button
          type="button"
          onClick={goToDetail}
          className="border-info text-body-3 text-info rounded-md border py-2 font-semibold"
        >
          거래 상세
        </button>
      )}
      {category === 'COMPLETED' && (
        <button
          type="button"
          onClick={goToDetail}
          className="border-border text-body-3 text-text-primary rounded-md border py-2 font-semibold"
        >
          거래 내역
        </button>
      )}
    </div>
  );
};

export default PurchaseHistoryCard;
