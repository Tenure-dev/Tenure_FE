import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import chevon from '@/shared/assets/chevron-left.svg';
import type { OotdItem, Bbox } from '@/features/ootd/model/item';
import { useSimilarItems } from '@/features/ootd/api/useSimilarItems';
import TagLoading from './component/TagLoading';
import TagResultSheet from './component/TagResultSheet';
import NewItemSheet from './component/NewItemSheet';
import TagBBox from './component/TagBBox';

// 이미지 위에 그리는 태그 박스. 박스가 먼저 생기고, 나중에 아이템(itemId)이 붙는다.
type Box = { id: string; bbox: Bbox; itemId?: string; label?: string };

// 미리보기('태그 수정')에서 돌아올 때 넘어오는 state
type NavState = {
  photo?: string;
  tags?: { itemId: number; bbox: Bbox; labelText: string }[];
} | null;

const BOX_W = 0.4;
const BOX_H = 0.35;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

// 클릭 지점을 중심으로 기본 크기 박스 (이미지 밖으로 안 나가게 clamp)
const boxAt = (cx: number, cy: number): Bbox => ({
  x: clamp(cx - BOX_W / 2, 0, 1 - BOX_W),
  y: clamp(cy - BOX_H / 2, 0, 1 - BOX_H),
  width: BOX_W,
  height: BOX_H,
});

let boxSeq = 0;
const newBoxId = () => `box-${Date.now()}-${boxSeq++}`;

const ANALYSIS_DEBOUNCE_MS = 350; // 박스 생성/이동/리사이즈가 잠잠해진 뒤 한 번만 분석

const OotdTagPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nav = location.state as NavState;
  const photo = nav?.photo ?? null;

  // 유사 아이템 분석 결과(현재 API는 bbox/이미지 안 받으므로 목록은 동일하게 옴)
  const { data: recommended = [], isPending, refetch } = useSimilarItems();
  const [addedItems, setAddedItems] = useState<OotdItem[]>([]); // 새로 등록한 아이템
  const items = useMemo(() => [...addedItems, ...recommended], [addedItems, recommended]);

  // '태그 수정'으로 돌아온 경우 기존 태그를 박스로 복원 (label 함께 보존)
  const [boxes, setBoxes] = useState<Box[]>(() =>
    (nav?.tags ?? []).map((t) => ({
      id: newBoxId(),
      bbox: t.bbox,
      itemId: String(t.itemId),
      label: t.labelText,
    })),
  );
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [showBox, setShowBox] = useState(true);

  const activeBox = boxes.find((b) => b.id === activeBoxId) ?? null;
  const tagCount = boxes.filter((b) => b.itemId).length; // 아이템 부착된 박스 = 완성 태그

  const itemLabel = (id?: string) => {
    const it = items.find((i) => i.id === id);
    return it ? `${it.brand} / ${it.name}` : '아이템 선택';
  };

  // 박스 생성/이동/리사이즈가 연달아 일어나도, 멈춘 뒤 한 번만 분석 API 호출(디바운스)
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleAnalysis = () => {
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    analysisTimer.current = setTimeout(() => void refetch(), ANALYSIS_DEBOUNCE_MS);
  };
  useEffect(
    () => () => {
      if (analysisTimer.current) clearTimeout(analysisTimer.current);
    },
    [],
  );

  // 활성 전환: 나가는 활성 박스가 아이템 미선택이면 제거 (미완성 박스 방치 방지)
  const activateBox = (nextId: string | null) => {
    setBoxes((prev) =>
      activeBoxId && activeBoxId !== nextId
        ? prev.filter((b) => b.id !== activeBoxId || b.itemId)
        : prev,
    );
    setActiveBoxId(nextId);
  };

  // 이미지 빈 곳 탭 → 그 위치에 박스 생성 + 활성화 + 분석 API 호출
  const handleAreaClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.tagArea !== 'true') return; // 박스/버튼 클릭은 무시
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    const id = newBoxId();
    // 아이템 미선택 박스는 제거하고 새 박스 추가
    setBoxes((prev) => [...prev.filter((b) => b.itemId), { id, bbox: boxAt(cx, cy) }]);
    setActiveBoxId(id);
    scheduleAnalysis(); // bbox 확정 → 분석(디바운스)
  };

  const updateBox = (id: string, bbox: Bbox) =>
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, bbox } : b)));

  // 활성 박스에 아이템 부착/해제 (같은 아이템 다시 누르면 해제)
  const assignItem = (itemId: string) => {
    if (!activeBoxId) return;
    setBoxes((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoxId) return b;
        if (b.itemId === itemId) return { ...b, itemId: undefined, label: undefined };
        return { ...b, itemId, label: itemLabel(itemId) };
      }),
    );
  };

  // 새 아이템 등록 → 활성 박스에 바로 부착
  const handleRegister = (item: OotdItem) => {
    setAddedItems((prev) => [item, ...prev]);
    if (activeBoxId) {
      setBoxes((prev) =>
        prev.map((b) =>
          b.id === activeBoxId
            ? { ...b, itemId: item.id, label: `${item.brand} / ${item.name}` }
            : b,
        ),
      );
    }
    setNewItemOpen(false);
  };

  // 완료 → 아이템 붙은 박스만 태그로 전달
  const handleComplete = () => {
    const tags = boxes
      .filter((b) => b.itemId)
      .map((b) => ({
        itemId: Number(b.itemId),
        bbox: b.bbox,
        labelText: b.label ?? itemLabel(b.itemId),
      }));
    const selected = items.filter((it) => tags.some((t) => t.itemId === Number(it.id)));
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
            disabled={tagCount === 0}
            className={`text-body-1 ml-auto font-semibold ${
              tagCount > 0 ? 'text-success' : 'text-text-disabled'
            }`}
          >
            완료({tagCount})
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
          {/* 사진 영역: 빈 곳 탭하면 박스 생성 */}
          <div className="relative z-0 w-full overflow-hidden" onClick={handleAreaClick}>
            {photo && (
              <img src={photo} data-tag-area="true" alt="촬영한 사진" className="block w-full" />
            )}

            {/* 태그 박스 보기/숨기기 토글 */}
            <button
              type="button"
              onClick={() => setShowBox((v) => !v)}
              aria-label={showBox ? '태그 박스 숨기기' : '태그 박스 보기'}
              className="absolute top-4 right-4 z-30 flex size-10 items-center justify-center rounded-full bg-black/60"
            >
              {showBox ? (
                <Eye size={20} className="text-white" />
              ) : (
                <EyeOff size={20} className="text-white" />
              )}
            </button>

            {/* 박스들: 표시 중일 때만. 활성 박스만 테두리+스포트라이트+이동/리사이즈 */}
            {showBox &&
              boxes.map((b) => (
                <TagBBox
                  key={b.id}
                  bbox={b.bbox}
                  label={b.label ?? ''}
                  active={activeBoxId === b.id}
                  onActivate={() => activateBox(activeBoxId === b.id ? null : b.id)}
                  onChange={(bb) => updateBox(b.id, bb)}
                  onSettle={scheduleAnalysis}
                />
              ))}
          </div>

          {/* 분석 결과 바텀시트 (활성 박스 기준) */}
          <TagResultSheet
            items={items}
            activeItemId={activeBox?.itemId}
            onSelect={assignItem}
            active={!!activeBox}
            count={tagCount}
            searchMode={searchMode}
            query={query}
            onQueryChange={setQuery}
            onSearchOpen={() => setSearchMode(true)}
            onSearchClose={() => {
              setSearchMode(false);
              setQuery('');
            }}
            onNewItem={() => setNewItemOpen(true)}
            onBbox={() => activateBox(null)}
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
