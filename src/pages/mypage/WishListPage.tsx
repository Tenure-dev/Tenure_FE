import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BackHeader, SegmentedControl } from '@/shared/components';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { getWishes } from '@/features/wishlist/api/wishApi';
import type { ApiProductStatus } from '@/features/wishlist/api/dto';
import { toWishlistItem } from '@/features/wishlist/lib/mappers';
import type { WishlistItem, WishlistTab } from '@/features/wishlist/model/types';
import { useUpdateWishNotification } from '@/features/wishlist/model/useUpdateWishNotification';
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

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['wishes', tab],
    queryFn: ({ pageParam }) =>
      getWishes({ saleStatus: TAB_TO_SALE_STATUS[tab], page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
  });

  const items = useMemo(
    () => (data?.pages.flatMap((page) => page.content) ?? []).map(toWishlistItem),
    [data],
  );

  const sentinelRef = useInfiniteScroll({
    hasMore: Boolean(hasNextPage),
    onLoadMore: fetchNextPage,
  });

  const { mutate: toggleNotify } = useUpdateWishNotification();

  const handleTabChange = (nextTab: string) => setTab(nextTab as WishlistTab);

  const handleToggleNotify = (item: WishlistItem) => {
    toggleNotify({ itemId: item.itemId, notificationEnabled: !item.notifyEnabled });
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
