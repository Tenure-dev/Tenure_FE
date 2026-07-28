import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import chevon from '@/shared/assets/chevron-left.svg';
import type { OotdItem, Bbox } from '@/features/ootd/model/item';
import { useSimilarItems } from '@/features/ootd/api/useSimilarItems';
import TagLoading from './component/TagLoading';
import TagResultSheet from './component/TagResultSheet';
import NewItemSheet from './component/NewItemSheet';
import TagBBox from './component/TagBBox';

// 새로 선택한 태그의 기본 박스 (이동만 하므로 크기 고정, index별로 겹치지 않게 오프셋)
const BOX_W = 0.4;
const BOX_H = 0.35;
const clampMax = (v: number, max: number) => Math.min(Math.max(v, 0), max);
const defaultBbox = (index: number): Bbox => ({
  x: clampMax(0.08 + (index % 3) * 0.16, 1 - BOX_W),
  y: clampMax(0.08 + (index % 3) * 0.14, 1 - BOX_H),
  width: BOX_W,
  height: BOX_H,
});

const OotdTagPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photo = (location.state as { photo?: string } | null)?.photo ?? null;

  // 추천 아이템(보유 아이템) 조회 — 게시 전이라 ootdId 없이
  const { data: recommended = [], isPending } = useSimilarItems();
  const [addedItems, setAddedItems] = useState<OotdItem[]>([]); // 새로 등록한 아이템
  const items = useMemo(() => [...addedItems, ...recommended], [addedItems, recommended]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bboxes, setBboxes] = useState<Record<string, Bbox>>({});
  const [activeId, setActiveId] = useState<string | null>(null); // 말풍선 누른 태그(=bbox 표시)
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [showBox, setShowBox] = useState(true);

  const toggleSelect = (id: string) => {
    const selecting = !selectedIds.has(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selecting) next.add(id);
      else next.delete(id);
      return next;
    });
    // 선택하면 기본 박스 추가, 해제하면 제거
    setBboxes((prev) => {
      const next = { ...prev };
      if (selecting) next[id] = defaultBbox(Object.keys(prev).length);
      else delete next[id];
      return next;
    });
    if (!selecting && activeId === id) setActiveId(null); // 해제한 게 활성이었으면 해제
  };

  const handleRegister = (item: OotdItem) => {
    setAddedItems((prev) => [item, ...prev]);
    setSelectedIds((prev) => new Set(prev).add(item.id));
    setBboxes((prev) => ({ ...prev, [item.id]: defaultBbox(Object.keys(prev).length) }));
    setNewItemOpen(false);
  };

  // 선택 완료 → 게시물 미리보기로 (사진 + 선택 아이템 + bbox 태그 배열 전달)
  const handleComplete = () => {
    const selected = items.filter((item) => selectedIds.has(item.id));
    // 게시 시 보낼 태그 배열 (itemId + bbox + labelText)
    const tags = selected.map((item) => ({
      itemId: Number(item.id),
      bbox: bboxes[item.id],
      labelText: `${item.brand} / ${item.name}`,
    }));
    navigate('/ootd/preview', { state: { photo, items: selected, tags } });
  };

  const title = isPending ? '새 게시물 작성' : 'OOTD 등록';

  return (
    <div className="bg-bg-white relative flex h-dvh w-full flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="flex items-center gap-2 p-4">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
          <img src={chevon} width={24} height={24} alt="" />
        </button>
        <h1 className="text-title-2 font-semibold">{title}</h1>
        {!isPending && (
          <button
            type="button"
            onClick={handleComplete}
            disabled={selectedIds.size === 0}
            className={`text-body-1 ml-auto font-semibold ${
              selectedIds.size > 0 ? 'text-success' : 'text-text-disabled'
            }`}
          >
            완료({selectedIds.size})
          </button>
        )}
      </header>

      {/* 진행바 */}
      <div className="bg-bg-tertiary h-1 w-full">
        <div className={isPending ? 'bg-brand h-full w-1/3' : 'bg-brand h-full w-2/3'} />
      </div>

      {isPending ? (
        <TagLoading />
      ) : (
        <div className="bg-bg-white relative flex-1 overflow-hidden">
          {/* 사진: 원본 비율 그대로 헤더 아래 (여백 없음).
              z-0으로 스택 컨텍스트 생성 → 태그 말풍선(z-10)이 바텀시트 위로 안 올라옴 */}
          <div className="relative z-0 w-full overflow-hidden">
            {photo && <img src={photo} alt="촬영한 사진" className="block w-full" />}

            {/* 태그 박스 보기/숨기기 토글 */}
            <button
              type="button"
              onClick={() => setShowBox((v) => !v)}
              aria-label={showBox ? '태그 박스 숨기기' : '태그 박스 보기'}
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/60"
            >
              {showBox ? (
                <Eye size={20} className="text-white" />
              ) : (
                <EyeOff size={20} className="text-white" />
              )}
            </button>

            {/* 숨기기(showBox=false)면 말풍선·박스 전부 숨김. 표시 중엔 활성 태그만 박스+스포트라이트 */}
            {showBox &&
              Array.from(selectedIds).map((id) => {
                const item = items.find((it) => it.id === id);
                const bbox = bboxes[id];
                if (!item || !bbox) return null;
                return (
                  <TagBBox
                    key={id}
                    bbox={bbox}
                    label={`${item.brand} / ${item.name}`}
                    active={activeId === id}
                    onActivate={() => setActiveId((cur) => (cur === id ? null : id))}
                    onChange={(b) => setBboxes((prev) => ({ ...prev, [id]: b }))}
                  />
                );
              })}
          </div>

          {/* 분석 결과 바텀시트 */}
          <TagResultSheet
            items={items}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            searchMode={searchMode}
            query={query}
            onQueryChange={setQuery}
            onSearchOpen={() => setSearchMode(true)}
            onSearchClose={() => {
              setSearchMode(false);
              setQuery('');
            }}
            onNewItem={() => setNewItemOpen(true)}
          />

          {/* 새 아이템 등록 시트 */}
          {newItemOpen && (
            <NewItemSheet onBack={() => setNewItemOpen(false)} onSubmit={handleRegister} />
          )}
        </div>
      )}
    </div>
  );
};

export default OotdTagPage;
