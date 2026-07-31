import { useNavigate } from 'react-router-dom';
import type { MyPagePurchaseResponse, MyPageSaleResponse } from '@/features/trade/api/types';

interface TradeListRowProps {
  item: MyPagePurchaseResponse | MyPageSaleResponse;
}

const formatPrice = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const formatListDate = (iso: string) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const TradeListRow = ({ item }: TradeListRowProps) => {
  const navigate = useNavigate();

  // PURCHASE_INTENT/PURCHASE_OFFER 상세 화면은 #87(제안 단계 연동)에서 추가된다.
  if (item.historyType !== 'TRADE') {
    return (
      <div className="flex min-h-[88px] w-full items-center gap-3 border-b border-[#F0F0F0] p-[16px] text-left">
        <div className="size-[64px] shrink-0 rounded-[8px] bg-[#F5F6F8]" />
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-[15px] font-semibold text-[#111111]">
            {item.brandName} {item.itemName}
          </p>
          <p className="text-[15px] text-[#111111]">{formatPrice(item.price)}</p>
          <p className="text-[13px] text-[#767676]">{formatListDate(item.createdAt)}</p>
        </div>
        <span className="text-[12px] text-[#767676]">상세보기 준비 중</span>
      </div>
    );
  }

  const isTrading = item.status !== 'COMPLETED' && item.status !== 'TRANSFERRED';
  const badge = isTrading ? '거래중' : '거래완료';

  return (
    <button
      type="button"
      onClick={() => navigate(`/trade/${item.historyId}`)}
      className="flex min-h-[88px] w-full items-center gap-3 border-b border-[#F0F0F0] p-[16px] text-left"
    >
      <div className="size-[64px] shrink-0 rounded-[8px] bg-[#F5F6F8]" />
      <div className="flex flex-1 flex-col gap-1">
        <span
          className={`w-fit rounded-full px-[8px] py-[2px] text-[12px] ${
            isTrading ? 'bg-[#E8F4FF] text-[#00AAFF]' : 'bg-[#F5F6F8] text-[#767676]'
          }`}
        >
          {badge}
        </span>
        <p className="text-[15px] font-semibold text-[#111111]">
          {item.brandName} {item.itemName}
        </p>
        <p className="text-[15px] text-[#111111]">{formatPrice(item.price)}</p>
        <p className="text-[13px] text-[#767676]">{formatListDate(item.createdAt)}</p>
      </div>
    </button>
  );
};

export default TradeListRow;
