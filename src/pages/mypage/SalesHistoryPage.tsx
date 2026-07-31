import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SegmentedControl } from '@/shared/components';
import { useSalesHistory } from '@/features/trade/api/useSalesHistory';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import type { MyPageSaleResponse, MyPageSalesTab } from '@/features/trade/api/types';
import SalesHistoryCard from './trade/SalesHistoryCard';

const STATUS_TABS: { label: string; value: MyPageSalesTab }[] = [
  { label: '전체', value: 'ALL' },
  { label: '대기중', value: 'OFFER_RECEIVED' },
  { label: '거래중', value: 'TRADING' },
  { label: '거래완료', value: 'COMPLETED' },
];

// 같은 아이템에 여러 명이 제안/거래의사를 보냈어도 하나의 카드로만 보여주고,
// "확인하기"를 누르면 /items/{itemId}/offers에서 전체 목록을 보여준다.
const dedupeByItem = (items: MyPageSaleResponse[]): MyPageSaleResponse[] => {
  const seenItemIds = new Set<number>();
  const result: MyPageSaleResponse[] = [];
  for (const item of items) {
    if (item.historyType === 'TRADE') {
      result.push(item);
      continue;
    }
    if (seenItemIds.has(item.itemId)) continue;
    seenItemIds.add(item.itemId);
    result.push(item);
  }
  return result;
};

const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const [statusTab, setStatusTab] = useState<MyPageSalesTab>('ALL');

  const { data, fetchNextPage, hasNextPage, isPending, isError } = useSalesHistory(statusTab);

  const sentinelRef = useInfiniteScroll({ hasMore: !!hasNextPage, onLoadMore: fetchNextPage });

  const items = dedupeByItem(data?.pages.flatMap((page) => page.content) ?? []);
  const activeStatusLabel = STATUS_TABS.find((t) => t.value === statusTab)?.label ?? '전체';

  const header = (
    <>
      <header className="flex h-[52px] items-center justify-between px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111111]">판매내역</h1>
        <div className="size-[24px]" />
      </header>

      <div className="border-b border-[#F0F0F0] px-[16px]">
        <SegmentedControl
          tabs={['구매내역', '판매내역']}
          activeTab="판매내역"
          onChange={(tab) => {
            if (tab === '구매내역') navigate('/purchase-history', { replace: true });
          }}
        />
      </div>

      <div className="border-b border-[#F0F0F0] px-[16px] pb-[12px]">
        <SegmentedControl
          tabs={STATUS_TABS.map((t) => t.label)}
          activeTab={activeStatusLabel}
          onChange={(label) => {
            const next = STATUS_TABS.find((t) => t.label === label);
            if (next) setStatusTab(next.value);
          }}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] font-sans">
      {header}

      {isPending ? (
        <p className="p-[16px] text-center text-[13px] text-[#767676]">불러오는 중...</p>
      ) : isError ? (
        <p className="p-[16px] text-center text-[13px] text-[#767676]">
          판매내역을 불러오지 못했습니다
        </p>
      ) : items.length === 0 ? (
        <p className="p-[16px] text-center text-[13px] text-[#767676]">판매내역이 없습니다</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-4">
            {items.map((item) => (
              <SalesHistoryCard
                key={`${item.historyType}-${item.historyId}`}
                item={item}
                showBadge={statusTab === 'ALL'}
              />
            ))}
          </div>
          <div ref={sentinelRef} />
        </>
      )}
    </div>
  );
};

export default SalesHistoryPage;
