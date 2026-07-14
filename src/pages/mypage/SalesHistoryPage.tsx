import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SegmentedControl } from '@/shared/components';
import { SALES_LIST } from './trade/mock';
import TradeListRow from './trade/TradeListRow';

const SalesHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center justify-between px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111111]">판매내역</h1>
        <div className="size-[24px]" />
      </header>

      <div className="border-b border-[#F0F0F0] px-[16px] pb-[12px]">
        <SegmentedControl
          tabs={['구매내역', '판매내역']}
          activeTab="판매내역"
          onChange={(tab) => {
            if (tab === '구매내역') navigate('/purchase-history');
          }}
        />
      </div>

      <div className="flex flex-col">
        {SALES_LIST.map((item) => (
          <TradeListRow key={item.tradeId} item={item} role="seller" />
        ))}
      </div>
    </div>
  );
};

export default SalesHistoryPage;
