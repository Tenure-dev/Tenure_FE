import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SegmentedControl } from '@/shared/components';
import { PURCHASE_LIST } from './trade/mock';
import TradeListRow from './trade/TradeListRow';

const PurchaseHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center justify-between px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111111]">구매내역</h1>
        <div className="size-[24px]" />
      </header>

      <div className="border-b border-[#F0F0F0] px-[16px] pb-[12px]">
        <SegmentedControl
          tabs={['구매내역', '판매내역']}
          activeTab="구매내역"
          onChange={(tab) => {
            if (tab === '판매내역') navigate('/sales-history');
          }}
        />
      </div>

      <div className="flex flex-col">
        {PURCHASE_LIST.map((item) => (
          <TradeListRow key={item.tradeId} item={item} role="buyer" />
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
