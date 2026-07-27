import { useCallback, useEffect, useRef, useState } from 'react';

export interface CursorPage<TItem, TCursor> {
  content: TItem[];
  hasNext: boolean;
  nextCursor: TCursor;
}

type ItemOf<TPage> = TPage extends CursorPage<infer TItem, unknown> ? TItem : never;
type CursorOf<TPage> = TPage extends CursorPage<unknown, infer TCursor> ? TCursor : never;

// 커서 기반 "더보기" 목록 공통 훅. 검색 조건이 바뀌어 처음부터 다시 불러와야 하는 화면은
// fetchPage를 새로 만들고 해당 컴포넌트를 key로 리마운트시켜 사용한다(React가 상태를 초기화해줌).
export const useCursorList = <TPage extends CursorPage<unknown, object>>(
  fetchPage: (cursor: CursorOf<TPage> | undefined) => Promise<TPage>,
) => {
  const [items, setItems] = useState<ItemOf<TPage>[]>([]);
  const [cursor, setCursor] = useState<CursorOf<TPage>>();
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState<TPage>();
  const startedRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const page = await fetchPage(cursor);
      setItems((prev) => [...prev, ...(page.content as ItemOf<TPage>[])]);
      setHasNext(page.hasNext);
      setCursor(page.nextCursor as CursorOf<TPage>);
      setLastPage(page);
    } finally {
      setLoading(false);
    }
  }, [fetchPage, cursor, hasNext, loading]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, setItems, hasNext, loading, loadMore, lastPage };
};
