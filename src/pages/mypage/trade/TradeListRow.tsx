import { useNavigate } from 'react-router-dom';
import { formatPrice, getListBadge } from './mock';
import type { TradeListItem, TradeRole } from './types';

interface TradeListRowProps {
  item: TradeListItem;
  role: TradeRole;
}

const TradeListRow = ({ item, role }: TradeListRowProps) => {
  const navigate = useNavigate();
  const badge = getListBadge(item.status);
  const isTrading = badge === '거래중';

  return (
    <button
      type="button"
      onClick={() => navigate(`/trade/${item.tradeId}?role=${role}`)}
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
          {item.brand} {item.itemName}
        </p>
        <p className="text-[15px] text-[#111111]">{formatPrice(item.price)}</p>
        <p className="text-[13px] text-[#767676]">{item.date}</p>
      </div>
    </button>
  );
};

export default TradeListRow;
