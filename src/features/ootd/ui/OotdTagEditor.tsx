import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { OotdItem, Bbox } from '@/features/ootd/model/item';
import { useSimilarItems } from '@/features/ootd/api/useSimilarItems';
import { analyzeTagArea } from '@/features/ootd/api/ootdApi';
import { getItemDetail } from '@/features/mypage/api/itemsApi';
import type { ItemDetailResponse } from '@/features/mypage/model/items';
import { getDaysAgo } from '@/features/mypage/lib/daysAgo';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import TagLoading from '@/pages/camera/component/TagLoading';
import TagResultSheet, {
  MIDDLE as RESULT_SHEET_DEFAULT_H,
} from '@/pages/camera/component/TagResultSheet';
import NewItemSheet from '@/pages/camera/component/NewItemSheet';
import TagBBox from '@/pages/camera/component/TagBBox';
import type { TagBubbleVariant } from './TagBubble';

// 외부(부모)와 주고받는 태그 형태. tagId가 있으면 기존(서버) 태그, 없으면 새로 추가한 태그.
export type EditorTag = { tagId?: number; itemId: number; bbox: Bbox; labelText: string };

// 이미지 위에 그리는 태그 박스. 박스가 먼저 생기고, 나중에 아이템(itemId)이 붙는다.
// tagId: 기존 태그에서 복원된 박스면 원본 서버 tagId를 보존(저장 시 수정/삭제 판별용).
// touched: 이번 편집에서 새로 추가했거나 편집하려고 활성화한 박스 → 검정 말풍선 유지.
type Box = {
  id: string;
  bbox: Bbox;
  itemId?: string;
  label?: string;
  tagId?: number;
  touched?: boolean;
};

type Props = {
  photo: string | null;
  ootdId?: number;
  initialTags?: EditorTag[]; // 기존 태그 복원(상세 편집). 없으면 빈 편집(생성).
  onChange?: (tags: EditorTag[]) => void; // 완성된 태그 셋이 바뀔 때마다 통지(부모가 완료/저장에 사용)
  untouchedVariant?: TagBubbleVariant; // 손 안 댄 기존 태그 말풍선 색(기본 black). 상세 편집은 default(흰색).
  scrollable?: boolean;
  onSheetExpandedChange?: (expanded: boolean) => void; // 결과 시트가 최대 높이일 때 통지
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
};

const MAX_TAGS = 5; // 한 게시물에 붙일 수 있는 최대 태그 수
const BOX_W = 0.26;
const BOX_H = 0.22;
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

const toOotdItemFromDetail = (d: ItemDetailResponse): OotdItem => ({
  id: String(d.itemId),
  brand: d.brandName,
  name: d.itemName,
  thumbnail: resolveFileUrl(d.representativeImageUrl),
  meta: [
    d.lastWornAt ? `최근 착용 ${getDaysAgo(d.lastWornAt)}일 전` : '최근 착용일 없음',
    `OOTD 인증 : ${d.ootdVerifiedWearCount}회`,
  ].join(' · '),
  isNew: false,
  categoryName: d.categorySmall,
});

// OOTD 생성/상세 편집이 공유하는 태그 에디터. 사진 위 bbox 박스 편집 + 유사 아이템 시트 + 새 아이템 등록.
// 헤더/저장(완료)/네비게이션은 이 컴포넌트를 쓰는 페이지가 담당한다.
const OotdTagEditor = ({
  photo,
  ootdId,
  initialTags,
  onChange,
  untouchedVariant = 'black',
  scrollable = false,
  onSheetExpandedChange,
  onLoadingChange,
  className,
}: Props) => {
  const { data: recommended = [], isPending } = useSimilarItems();
  useEffect(() => {
    onLoadingChange?.(isPending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);
  const [addedItems, setAddedItems] = useState<OotdItem[]>([]); // 새로 등록한 아이템
  const [analyzedItems, setAnalyzedItems] = useState<Record<string, OotdItem[]>>({});
  const [sheetHeight, setSheetHeight] = useState(RESULT_SHEET_DEFAULT_H);
  // 태그된 아이템 객체 보관 — 추천 목록이 갱신돼도 활성 박스 아이템이 목록에서 사라지지 않게
  const [tagged, setTagged] = useState<Record<string, OotdItem>>({});

  // 기존 태그가 있으면 박스로 복원 (label·tagId 함께 보존)
  const [boxes, setBoxes] = useState<Box[]>(() =>
    (initialTags ?? []).map((t) => ({
      id: newBoxId(),
      bbox: t.bbox,
      itemId: String(t.itemId),
      label: t.labelText,
      tagId: t.tagId,
    })),
  );
  // 편집 진입 시 기존 태그 아이템 상세를 미리 불러와 tagged 맵에 채운다.
  // (그래야 기존 태그 말풍선을 눌렀을 때 그 아이템이 시트에 떠서 해제=태그 삭제가 가능)
  useEffect(() => {
    const ids = (initialTags ?? []).map((t) => t.itemId);
    if (ids.length === 0) return;
    let cancelled = false;
    void Promise.all(ids.map((id) => getItemDetail(id).catch(() => null))).then((details) => {
      if (cancelled) return;
      setTagged((prev) => {
        const next = { ...prev };
        for (const d of details) {
          if (!d) continue;
          const it = toOotdItemFromDetail(d);
          if (!(it.id in next)) next[it.id] = it; // 이번 세션에서 이미 담은 건 유지
        }
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
    // 진입 시 1회만 (initialTags는 매 렌더 새 배열이라 deps에서 제외)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  // 활성 박스의 테두리/스포트라이트/리사이즈 핸들 표시 여부. 사진 빈 곳을 탭해 새 박스를
  // 만들 때만 true — 기존 태그를 말풍선으로 활성화했을 때는 false로 두고 말풍선만 선택 표시한다.
  const [showBoxUi, setShowBoxUi] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [showBox, setShowBox] = useState(true);
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();

  const activeBox = boxes.find((b) => b.id === activeBoxId) ?? null;
  const tagCount = boxes.filter((b) => b.itemId).length; // 아이템 부착된 박스 = 완성 태그

  const activeMatched = activeBoxId ? analyzedItems[activeBoxId] : undefined;
  const baseItems = activeMatched ?? recommended;
  const items = useMemo(() => [...addedItems, ...baseItems], [addedItems, baseItems]);

  const itemLabel = (id?: string) => {
    const it = items.find((i) => i.id === id);
    return it ? `${it.brand} / ${it.name}` : '아이템 선택';
  };

  // 완성된 태그 셋(아이템 부착된 박스)이 바뀔 때마다 부모에 통지 → 부모가 완료/저장에 사용.
  // boxes에만 반응하면 되므로 onChange는 deps에서 제외(매 렌더 호출/루프 방지).
  useEffect(() => {
    const tags: EditorTag[] = boxes
      .filter((b) => b.itemId)
      .map((b) => ({
        tagId: b.tagId,
        itemId: Number(b.itemId),
        bbox: b.bbox,
        labelText: b.label ?? '',
      }));
    onChange?.(tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxes]);

  // 다른 박스에 이미 태그된 아이템은 추천 목록에서 숨긴다 (활성 박스 자신의 아이템은 유지)
  const usedByOthers = new Set(
    boxes.filter((b) => b.id !== activeBoxId && b.itemId).map((b) => b.itemId),
  );
  const filteredItems = items.filter((it) => !usedByOthers.has(it.id));
  // 활성 박스의 태그 아이템이 추천 목록에 없으면(추천 갱신으로 빠졌을 때) 맨 앞에 넣어 해제 가능하게
  const activeItem = activeBox?.itemId ? tagged[activeBox.itemId] : undefined;
  const sheetItems =
    activeItem && !filteredItems.some((it) => it.id === activeItem.id)
      ? [activeItem, ...filteredItems]
      : filteredItems;

  const boxesRef = useRef<Box[]>(boxes);
  useEffect(() => {
    boxesRef.current = boxes;
  }, [boxes]);

  const runAnalysis = async (boxId: string, bbox: Bbox) => {
    if (ootdId == null) return;
    try {
      const res = await analyzeTagArea(ootdId, { bbox });
      if (res.matchedItemIds.length === 0) {
        // 특정 아이템은 못 맞췄을 때: AI가 카테고리를 알아냈으면 그 카테고리 아이템을 앞에 두되,
        // 나머지 보유 아이템도 모두 보여줘서 사용자가 다른 아이템도 고를 수 있게 한다.
        const scoped = res.categorySmall
          ? recommended.filter((item) => item.categoryName === res.categorySmall)
          : [];
        const scopedIds = new Set(scoped.map((it) => it.id));
        const rest = recommended.filter((it) => !scopedIds.has(it.id));
        const merged = [...scoped, ...rest];
        if (merged.length === 0) {
          setAnalyzedItems((prev) => {
            if (!(boxId in prev)) return prev;
            const next = { ...prev };
            delete next[boxId];
            return next;
          });
        } else {
          setAnalyzedItems((prev) => ({ ...prev, [boxId]: merged }));
        }
        return;
      }
      const details = await Promise.all(res.matchedItemIds.map((id) => getItemDetail(id)));
      setAnalyzedItems((prev) => ({ ...prev, [boxId]: details.map(toOotdItemFromDetail) }));
    } catch {
      setAnalyzedItems((prev) => {
        if (!(boxId in prev)) return prev;
        const next = { ...prev };
        delete next[boxId];
        return next;
      });
    }
  };

  // 분석(디바운스 대기 + API 응답 대기) 중인 박스 → 해당 박스가 활성일 때 목록에 스켈레톤 표시
  const [analyzingBoxId, setAnalyzingBoxId] = useState<string | null>(null);

  // 박스 생성/이동/리사이즈가 연달아 일어나도, 멈춘 뒤 한 번만 분석 API 호출(디바운스)
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleAnalysis = (boxId: string) => {
    if (ootdId == null) return;
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    setAnalyzingBoxId(boxId); // 대기~응답 동안 스켈레톤 on
    analysisTimer.current = setTimeout(() => {
      const box = boxesRef.current.find((b) => b.id === boxId);
      if (!box) {
        setAnalyzingBoxId((cur) => (cur === boxId ? null : cur));
        return;
      }
      void runAnalysis(boxId, box.bbox).finally(() => {
        setAnalyzingBoxId((cur) => (cur === boxId ? null : cur)); // 완료 → 스켈레톤 off
      });
    }, ANALYSIS_DEBOUNCE_MS);
  };
  useEffect(
    () => () => {
      if (analysisTimer.current) clearTimeout(analysisTimer.current);
    },
    [],
  );

  // 활성 전환: 나가는 활성 박스가 아이템 미선택이면 제거 (미완성 박스 방치 방지)
  const activateBox = (nextId: string | null) => {
    setBoxes((prev) => {
      const cleaned =
        activeBoxId && activeBoxId !== nextId
          ? prev.filter((b) => b.id !== activeBoxId || b.itemId)
          : prev;
      // 편집하려고 활성화한 태그는 '손 댄' 것으로 표시 → 이후 검정 말풍선 유지
      return nextId ? cleaned.map((b) => (b.id === nextId ? { ...b, touched: true } : b)) : cleaned;
    });
    setActiveBoxId(nextId);
    setShowBoxUi(false); // 말풍선을 통한 활성화라 박스 테두리는 안 띄운다
  };

  // 이미지 빈 곳 탭 → 그 위치에 박스 생성 + 활성화 + 분석 API 호출
  const handleAreaClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.tagArea !== 'true') return; // 박스/버튼 클릭은 무시
    // 완성 태그가 최대치면 새 박스 생성 차단 (기존 태그 편집/이동은 그대로)
    if (tagCount >= MAX_TAGS) {
      showToast(`태그는 최대 ${MAX_TAGS}개까지 추가할 수 있어요.`);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    const id = newBoxId();
    // 아이템 미선택 박스는 제거하고 새 박스 추가 (새로 추가하는 박스 → touched)
    setBoxes((prev) => [
      ...prev.filter((b) => b.itemId),
      { id, bbox: boxAt(cx, cy), touched: true },
    ]);
    setActiveBoxId(id);
    setShowBoxUi(true); // 사진을 탭해 만든 새 박스는 테두리/스포트라이트를 보여준다
    scheduleAnalysis(id); // bbox 확정 → 분석(디바운스)
  };

  const updateBox = (id: string, bbox: Bbox) =>
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, bbox } : b)));

  // 활성 박스에 아이템 부착/해제 (같은 아이템 다시 누르면 해제)
  const assignItem = (itemId: string) => {
    if (!activeBoxId) return;
    const it = items.find((i) => i.id === itemId);
    if (it) setTagged((prev) => ({ ...prev, [itemId]: it })); // 객체 보관
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
    setTagged((prev) => ({ ...prev, [item.id]: item })); // 객체 보관
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

  if (isPending) {
    return (
      <div
        className={cn(
          'bg-bg-white relative flex flex-col',
          !scrollable && 'overflow-hidden',
          className,
        )}
      >
        <TagLoading />
      </div>
    );
  }

  return (
    <div
      className={cn('bg-bg-white relative', !scrollable && 'overflow-hidden', className)}
      style={scrollable && !newItemOpen ? { paddingBottom: sheetHeight } : undefined}
    >
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
              showFrame={activeBoxId === b.id && showBoxUi}
              variant={b.touched ? 'black' : untouchedVariant}
              onActivate={() => activateBox(activeBoxId === b.id ? null : b.id)}
              onChange={(bb) => updateBox(b.id, bb)}
              onSettle={() => scheduleAnalysis(b.id)}
            />
          ))}
      </div>

      {/* 분석 결과 바텀시트 (활성 박스 기준) */}
      <TagResultSheet
        items={sheetItems}
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
        analyzing={analyzingBoxId != null && analyzingBoxId === activeBoxId}
        overlay={scrollable ? 'fixed' : 'absolute'}
        onHeightChange={scrollable ? setSheetHeight : undefined}
        onExpandedChange={onSheetExpandedChange}
      />

      {/* 새 아이템 등록 시트 */}
      {newItemOpen && (
        <NewItemSheet
          bbox={activeBox?.bbox}
          ootdId={ootdId}
          onBack={() => setNewItemOpen(false)}
          onSubmit={handleRegister}
        />
      )}

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default OotdTagEditor;
