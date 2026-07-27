import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackHeader, Input } from '@/shared/components';
import { plus } from '@/shared/assets';
import { RegisteredItemListSection } from '@/features/mypage/ui';
import { useItemsQuery } from '@/features/mypage/model/useItemsQuery';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

const RegisteredItemsPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);

  const { data, fetchNextPage, hasNextPage } = useItemsQuery({
    query: debouncedQuery || undefined,
  });
  const items = data?.pages.flatMap((page) => page.content) ?? [];

  const sentinelRef = useInfiniteScroll({ hasMore: !!hasNextPage, onLoadMore: fetchNextPage });

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md">
      <BackHeader
        title="등록한 아이템"
        rightActions={
          <button type="button" aria-label="아이템 추가">
            <img src={plus} className="size-5.5" alt="" />
          </button>
        }
      />
      <div className="px-4 py-3">
        <Input
          size={44}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="검색"
          className="!bg-gray-bg !border-transparent"
        />
      </div>
      {items.length === 0 ? (
        <p className="text-body-3 text-text-secondary px-4 py-10 text-center">
          등록된 아이템이 없어요
        </p>
      ) : (
        <>
          <RegisteredItemListSection
            items={items}
            onItemClick={(id) => navigate(`/mypage/items/${id}`)}
            onSaleConvert={(id) => navigate(`/mypage/items/${id}/sell`)}
          />
          <div ref={sentinelRef} />
        </>
      )}
    </div>
  );
};

export default RegisteredItemsPage;
