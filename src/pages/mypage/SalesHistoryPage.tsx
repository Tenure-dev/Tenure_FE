import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SegmentedControl } from '@/shared/components';
import { useSalesHistory } from '@/features/trade/api/useSalesHistory';
import TradeListRow from './trade/TradeListRow';

const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const { data, isPending, isError } = useSalesHistory('ALL', 1);

  const header = (
    <>
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
    </>
  );

  if (isPending) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
        {header}
        <p className="p-[16px] text-center text-[13px] text-[#767676]">불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
        {header}
        <p className="p-[16px] text-center text-[13px] text-[#767676]">
          판매내역을 불러오지 못했습니다
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
        {header}
        <p className="p-[16px] text-center text-[13px] text-[#767676]">
          판매내역을 불러오지 못했습니다
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      {header}
      {data.content.length === 0 ? (
        <p className="p-[16px] text-center text-[13px] text-[#767676]">판매내역이 없습니다</p>
      ) : (
        <div className="flex flex-col">
          {data.content.map((item) => (
            <TradeListRow key={item.historyId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesHistoryPage;
