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
  // loading state는 업데이트가 비동기라, 마운트 시 자동 호출과 이미 화면에 보이는
  // sentinel의 IntersectionObserver가 거의 동시에 loadMore를 불러도 둘 다 통과해버릴 수 있다.
  // ref는 동기적으로 갱신되므로 이 경쟁을 막는 락으로 쓴다.
  const inFlightRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (inFlightRef.current || !hasNext) return;
    inFlightRef.current = true;
    setLoading(true);
    try {
      const page = await fetchPage(cursor);
      setItems((prev) => [...prev, ...(page.content as ItemOf<TPage>[])]);
      setHasNext(page.hasNext);
      setCursor(page.nextCursor as CursorOf<TPage>);
      setLastPage(page);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [fetchPage, cursor, hasNext]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, setItems, hasNext, loading, loadMore, lastPage };
};
