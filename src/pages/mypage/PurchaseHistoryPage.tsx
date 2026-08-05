import { useState } from 'react';
import { Toast } from '@/shared/components';
import ConfirmModal from '@/features/ootd/ui/ConfirmModal';
import { usePurchaseHistory } from '@/features/trade/api/usePurchaseHistory';
import { useCancelPurchaseHistory } from '@/features/trade/api/useCancelPurchaseHistory';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { useToast } from '@/shared/hooks/useToast';
import type { MyPagePurchaseResponse, MyPagePurchaseTab } from '@/features/trade/api/types';
import PurchaseHistoryCard from './trade/PurchaseHistoryCard';
import StatusTabs from './trade/StatusTabs';
import HistoryHeader from './trade/HistoryHeader';

const STATUS_TABS: { label: string; value: MyPagePurchaseTab }[] = [
  { label: '전체', value: 'ALL' },
  { label: '대기중', value: 'OFFERING' },
  { label: '거래중', value: 'TRADING' },
  { label: '거래완료', value: 'COMPLETED' },
];

const PurchaseHistoryPage = () => {
  const [statusTab, setStatusTab] = useState<MyPagePurchaseTab>('ALL');
  const [cancelTarget, setCancelTarget] = useState<MyPagePurchaseResponse | null>(null);
  const { message, show, hide } = useToast();

  const { data, fetchNextPage, hasNextPage, isPending, isError } = usePurchaseHistory(statusTab);
  const { mutate: cancelHistory } = useCancelPurchaseHistory();

  const sentinelRef = useInfiniteScroll({ hasMore: !!hasNextPage, onLoadMore: fetchNextPage });

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const activeStatusLabel = STATUS_TABS.find((t) => t.value === statusTab)?.label ?? '전체';

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    cancelHistory(
      {
        historyType: cancelTarget.historyType as 'PURCHASE_INTENT' | 'PURCHASE_OFFER',
        historyId: cancelTarget.historyId,
      },
      {
        onSuccess: () => {
          show('취소되었습니다.');
          setCancelTarget(null);
        },
        onError: () => {
          show('취소에 실패했습니다.');
          setCancelTarget(null);
        },
      },
    );
  };

  const header = (
    <>
      <HistoryHeader title="구매내역" />

      <div className="border-b border-[#F0F0F0] px-[16px] pb-[12px]">
        <StatusTabs
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
          구매내역을 불러오지 못했습니다
        </p>
      ) : items.length === 0 ? (
        <p className="p-[16px] text-center text-[13px] text-[#767676]">구매내역이 없습니다</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-4">
            {items.map((item) => (
              <PurchaseHistoryCard
                key={`${item.historyType}-${item.historyId}`}
                item={item}
                showBadge={statusTab === 'ALL'}
                onCancel={setCancelTarget}
              />
            ))}
          </div>
          <div ref={sentinelRef} />
        </>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        title="취소하시겠어요?"
        description="취소된 내역은 되돌릴 수 없어요."
        confirmLabel="취소하기"
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />

      <Toast message={message} onClose={hide} />
    </div>
  );
};

export default PurchaseHistoryPage;
