import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BackHeader, SegmentedControl } from '@/shared/components';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { getWishes } from '@/features/wishlist/api/wishApi';
import type { ApiProductStatus } from '@/features/wishlist/api/dto';
import { toWishlistItem } from '@/features/wishlist/lib/mappers';
import type { WishlistTab } from '@/features/wishlist/model/types';
import WishlistItemRow from '@/features/wishlist/ui/WishlistItemRow';

const TABS: WishlistTab[] = ['전체', '판매중', '거래중'];
const PAGE_SIZE = 8;

const TAB_TO_SALE_STATUS: Record<WishlistTab, ApiProductStatus | undefined> = {
  전체: undefined,
  판매중: 'ON_SALE',
  거래중: 'TRADING',
};

const WishListPage = () => {
  const [tab, setTab] = useState<WishlistTab>('전체');
  // 위시 알림 on/off를 저장하는 API가 아직 없어(BE 요청 목록 참고) 로컬 상태에만 반영한다.
  const [notifyOverrides, setNotifyOverrides] = useState<Record<number, boolean>>({});

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['wishes', tab],
    queryFn: ({ pageParam }) =>
      getWishes({ saleStatus: TAB_TO_SALE_STATUS[tab], page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
  });

  const items = useMemo(
    () =>
      (data?.pages.flatMap((page) => page.content) ?? []).map(toWishlistItem).map((item) => ({
        ...item,
        notifyEnabled: notifyOverrides[item.wishId] ?? item.notifyEnabled,
      })),
    [data, notifyOverrides],
  );

  const sentinelRef = useInfiniteScroll({
    hasMore: Boolean(hasNextPage),
    onLoadMore: fetchNextPage,
  });

  const handleTabChange = (nextTab: string) => setTab(nextTab as WishlistTab);

  const handleToggleNotify = (wishId: number) => {
    setNotifyOverrides((prev) => {
      const current = items.find((item) => item.wishId === wishId)?.notifyEnabled ?? true;
      return { ...prev, [wishId]: !current };
    });
  };

  return (
    <div className="bg-bg-white mx-auto flex h-screen w-full max-w-md flex-col">
      <BackHeader title="위시리스트" />

      <SegmentedControl tabs={TABS} activeTab={tab} onChange={handleTabChange} />

      <div className="no-scrollbar divide-border-secondary flex-1 divide-y overflow-y-auto">
        {!isLoading && items.length === 0 && (
          <p className="text-body-2 text-text-tertiary px-4 py-10 text-center">
            위시리스트가 비어있습니다
          </p>
        )}
        {items.map((item) => (
          <WishlistItemRow key={item.wishId} item={item} onToggleNotify={handleToggleNotify} />
        ))}
        {hasNextPage && <div ref={sentinelRef} className="h-1" />}
      </div>
    </div>
  );
};

export default WishListPage;
