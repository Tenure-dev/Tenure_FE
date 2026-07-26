import { useMemo, useState } from 'react';
import { BackHeader, SegmentedControl } from '@/shared/components';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { mockWishlistItems } from '@/features/wishlist/model/mocks';
import type { WishlistTab } from '@/features/wishlist/model/types';
import WishlistItemRow from '@/features/wishlist/ui/WishlistItemRow';

const TABS: WishlistTab[] = ['전체', '판매중', '거래중'];
const PAGE_SIZE = 8;

const WishListPage = () => {
  const [tab, setTab] = useState<WishlistTab>('전체');
  const [items, setItems] = useState(mockWishlistItems);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredItems = useMemo(() => {
    if (tab === '전체') return items;
    if (tab === '판매중') return items.filter((item) => item.tradeStatus === 'none');
    return items.filter((item) => item.tradeStatus === 'waiting' || item.tradeStatus === 'created');
  }, [items, tab]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const sentinelRef = useInfiniteScroll({
    hasMore,
    onLoadMore: () => setVisibleCount((prev) => prev + PAGE_SIZE),
  });

  const handleTabChange = (nextTab: string) => {
    setTab(nextTab as WishlistTab);
    setVisibleCount(PAGE_SIZE);
  };

  const handleToggleNotify = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notifyEnabled: !item.notifyEnabled } : item)),
    );
  };

  return (
    <div className="bg-bg-white mx-auto flex h-screen w-full max-w-md flex-col">
      <BackHeader title="위시리스트" />

      <SegmentedControl tabs={TABS} activeTab={tab} onChange={handleTabChange} />

      <div className="no-scrollbar divide-border-secondary flex-1 divide-y overflow-y-auto">
        {visibleItems.map((item) => (
          <WishlistItemRow key={item.id} item={item} onToggleNotify={handleToggleNotify} />
        ))}
        {hasMore && <div ref={sentinelRef} className="h-1" />}
      </div>
    </div>
  );
};

export default WishListPage;
