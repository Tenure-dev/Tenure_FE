import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, Eye, EyeOff, Heart } from 'lucide-react';
import { BottomSheet, FollowButton, SpotlightBox, Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { useTapBox } from '@/shared/hooks/useTapBox';
import { USER_ID_STORAGE_KEY } from '@/shared/lib/api';
import {
  MAX_TAGGED_ITEMS,
  type Bbox,
  type ItemStatus,
  type OotdPost,
  type TaggedItem,
} from '@/features/ootd/model/types';
import { useTagNavigation } from '@/features/ootd/lib/useTagNavigation';
import {
  blockUser,
  confirmTags,
  createTag,
  deleteOotd,
  followUser,
  getMyItems,
  getOotdDetail,
  heartOotd,
  saveOotd,
  unfollowUser,
  unheartOotd,
  unsaveOotd,
  unwishItem,
  updateTag,
  wishItem,
} from '@/features/ootd/api/ootdApi';
import { toClosetItem, toOotdPost } from '@/features/ootd/lib/mappers';
import type { ClosetItem } from '@/features/ootd/model/types';
import TagPin from '@/features/ootd/ui/TagPin';
import IntroTagModal from '@/features/ootd/ui/IntroTagModal';
import ConfirmModal from '@/features/ootd/ui/ConfirmModal';
import TaggedItemsSheet from '@/features/ootd/ui/TaggedItemsSheet';
import EditTagSheet, { type EditTagTarget } from '@/features/ootd/ui/EditTagSheet';
import MoreMenu from '@/features/ootd/ui/MoreMenu';
import type { OotdItem } from '@/features/ootd/model/item';
// 카메라 플로우(새 OOTD 작성 시 태그 추가)의 "새 아이템 등록" 시트를 OOTD상세 전용으로 로컬 포크.
// camera/component/NewItemSheet를 직접 쓰지 않는 이유: 이미지 업로드 등 이 화면 전용 수정이
// 카메라 페이지(다른 담당자 영역)에 그대로 번지는 걸 막기 위함.
import NewItemSheet from '@/features/ootd/ui/NewItemSheet';
import ViewHeader from './components/ViewHeader';
import EditHeader from './components/EditHeader';

const INTRO_SEEN_KEY = 'ootd-intro-seen';
const SHEET_DRAG_OPEN_THRESHOLD = 80;
const TAG_ANALYZE_DELAY_MS = 700;
const RESULT_EXPAND_RATIO = 0.8;
// 사진 컨테이너가 항상 aspect-[3/4](세로가 가로의 4/3배)라서, 픽셀상 가로가 넓고 세로가 짧은
// 직사각형으로 보이려면 width/height 퍼센트를 1:1이 아니라 이 비율만큼 크게 벌려야 한다.
// 실제 픽셀 비율 = (width% / height%) * (3/4)
const DEFAULT_TAP_BOX_WIDTH_PERCENT = 45;
const DEFAULT_TAP_BOX_HEIGHT_PERCENT = 8;

type PendingTagOp =
  | { kind: 'add'; itemId: number; labelText: string; bbox: Bbox }
  | { kind: 'edit'; tagId: number; itemId: number; labelText: string; bbox: Bbox };

const getCurrentUserId = (): number | null => {
  const raw = localStorage.getItem(USER_ID_STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
};

const OotdDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const ootdId = Number(id);

  const [post, setPost] = useState<OotdPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const loadRequestIdRef = useRef(0);
  const [showIntro, setShowIntro] = useState(false);
  const [tagsVisible, setTagsVisible] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showTaggedSheet, setShowTaggedSheet] = useState(false);
  const [sheetDragPx, setSheetDragPx] = useState<number | undefined>(undefined);
  const dragStartYRef = useRef<number | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [changeCount, setChangeCount] = useState(0);
  const [editTagsVisible, setEditTagsVisible] = useState(true);
  const [editTarget, setEditTarget] = useState<EditTagTarget>(null);
  const [isAnalyzingTag, setIsAnalyzingTag] = useState(false);
  const [selectedClosetItemId, setSelectedClosetItemId] = useState<number | null>(null);
  const [pendingBbox, setPendingBbox] = useState<Bbox | null>(null);
  const analyzeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [resultExpanded, setResultExpanded] = useState(false);
  const collapsedDragStartYRef = useRef<number | null>(null);
  const expandedDragStartYRef = useRef<number | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // 완료를 누르기 전까지는 서버에 반영하지 않는 임시(로컬) 태그 상태.
  // 뒤로가기/취소 시 API 호출 없이 그대로 버리면 되므로 "원래대로 복구"가 저절로 보장된다.
  const [draftTags, setDraftTags] = useState<TaggedItem[]>([]);
  const pendingOpsRef = useRef<Map<number, PendingTagOp>>(new Map());
  const tempTagIdRef = useRef(-1);

  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);
  const [closetItemsLoading, setClosetItemsLoading] = useState(false);
  const [newItemSheetOpen, setNewItemSheetOpen] = useState(false);

  const clearAnalyzeTimeout = () => {
    if (analyzeTimeoutRef.current !== null) {
      clearTimeout(analyzeTimeoutRef.current);
      analyzeTimeoutRef.current = null;
    }
  };

  useEffect(() => clearAnalyzeTimeout, []);

  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();
  const { goToDetail } = useTagNavigation();

  const initialToastRef = useRef((location.state as { toast?: string } | null)?.toast ?? null);

  useEffect(() => {
    if (initialToastRef.current) {
      const msg = initialToastRef.current;
      initialToastRef.current = null;
      showToast(msg);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, showToast]);

  const currentUserId = getCurrentUserId();

  const refreshPost = useCallback(async () => {
    const detail = await getOotdDetail(ootdId);
    setPost(toOotdPost(detail, currentUserId));
    return detail;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ootdId]);

  const loadPost = useCallback(async () => {
    const requestId = ++loadRequestIdRef.current;
    setLoading(true);
    setLoadError(false);
    if (!Number.isFinite(ootdId)) {
      setLoadError(true);
      setLoading(false);
      return;
    }
    try {
      const detail = await getOotdDetail(ootdId);
      if (loadRequestIdRef.current !== requestId) return;
      setPost(toOotdPost(detail, currentUserId));
      setShowIntro(sessionStorage.getItem(INTRO_SEEN_KEY) !== '1');
    } catch {
      if (loadRequestIdRef.current === requestId) setLoadError(true);
    } finally {
      if (loadRequestIdRef.current === requestId) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ootdId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPost();
  }, [loadPost]);

  const targetId = post?.id ?? ootdId;

  const handlePeekPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    dragStartYRef.current = e.clientY;
    setSheetDragPx(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePeekPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragStartYRef.current === null) return;
    const draggedUp = dragStartYRef.current - e.clientY;
    setSheetDragPx(Math.max(0, draggedUp));
  };

  const handlePeekPointerEnd = () => {
    if (dragStartYRef.current === null) return;
    const finalDrag = sheetDragPx ?? 0;
    dragStartYRef.current = null;
    setSheetDragPx(undefined);
    if (finalDrag > SHEET_DRAG_OPEN_THRESHOLD) {
      setShowTaggedSheet(true);
    }
  };

  const handlePhotoClick = () => {
    setTagsVisible((v) => !v);
  };

  const beginTagAnalysis = (target: EditTagTarget, presetItemId: number | null) => {
    clearAnalyzeTimeout();
    setEditTarget(null);
    setIsAnalyzingTag(true);
    setResultExpanded(false);
    setSelectedClosetItemId(presetItemId);
    analyzeTimeoutRef.current = setTimeout(() => {
      setEditTarget(target);
      setIsAnalyzingTag(false);
      analyzeTimeoutRef.current = null;
    }, TAG_ANALYZE_DELAY_MS);
  };

  const getResultExpandedHeightPx = () => window.innerHeight * RESULT_EXPAND_RATIO;

  const handleCollapsedHandlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    collapsedDragStartYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleCollapsedHandlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const startY = collapsedDragStartYRef.current;
    collapsedDragStartYRef.current = null;
    if (startY === null) return;
    if (startY - e.clientY > SHEET_DRAG_OPEN_THRESHOLD) setResultExpanded(true);
  };

  const handleExpandedHandlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    expandedDragStartYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleExpandedHandlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const startY = expandedDragStartYRef.current;
    expandedDragStartYRef.current = null;
    if (startY === null) return;
    if (e.clientY - startY > SHEET_DRAG_OPEN_THRESHOLD) setResultExpanded(false);
  };

  // 탭한 자리에 고정 크기 박스가 바로 뜨는 인터랙션(드래그 리사이즈 없음)은
  // src/shared/hooks/useTapBox로 공용화되어 있다. 확정(추가하기) 전까지 박스를 계속 보여줘야
  // 하므로 tapBox.rect는 여기서 지우지 않는다 — handleEditSubmit/resetEditState/태그 선택 시 지운다.
  const tapBox = useTapBox({
    widthPercent: DEFAULT_TAP_BOX_WIDTH_PERCENT,
    heightPercent: DEFAULT_TAP_BOX_HEIGHT_PERCENT,
    onPlace: (bbox) => {
      setPendingBbox(bbox);
      beginTagAnalysis({ type: 'add' }, null);
    },
  });

  const handleEditPhotoPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!post || draftTags.length >= MAX_TAGGED_ITEMS) {
      showToast(`태그는 최대 ${MAX_TAGGED_ITEMS}개까지 가능해요.`);
      return;
    }
    tapBox.handlers.onPointerDown(e);
  };

  const handleStartEdit = () => {
    if (!post) return;
    clearAnalyzeTimeout();
    setChangeCount(0);
    setEditTarget(null);
    setIsAnalyzingTag(false);
    setResultExpanded(false);
    setSelectedClosetItemId(null);
    setPendingBbox(null);
    setEditTagsVisible(true);
    setDraftTags(post.taggedItems);
    pendingOpsRef.current = new Map();
    tempTagIdRef.current = -1;
    setMode('edit');
    setShowMoreMenu(false);

    setClosetItemsLoading(true);
    getMyItems({ size: 50 })
      .then((page) => setClosetItems(page.content.map(toClosetItem)))
      .catch(() => showToast('옷장 아이템을 불러오지 못했어요.'))
      .finally(() => setClosetItemsLoading(false));
  };

  // 새 아이템 등록 시트에서 등록 완료 시 호출됨. 페이지 이동 없이 옷장 목록에 바로 추가하고
  // 선택 상태로 만들어서, 등록 직후 이어서 "추가하기"를 누를 수 있게 한다.
  const handleRegisterNewItem = (item: OotdItem) => {
    const newClosetItem: ClosetItem = {
      id: Number(item.id),
      brand: item.brand,
      name: item.name,
      imageUrl: item.thumbnail ?? null,
      lastWornDaysAgo: null,
      verifiedCount: 0,
      purchaseOfferEnabled: false,
    };
    setClosetItems((prev) => [newClosetItem, ...prev]);
    setSelectedClosetItemId(newClosetItem.id);
    setNewItemSheetOpen(false);
  };

  const resetEditState = () => {
    clearAnalyzeTimeout();
    pendingOpsRef.current = new Map();
    setDraftTags([]);
    setMode('view');
    setEditTarget(null);
    setIsAnalyzingTag(false);
    setResultExpanded(false);
    setSelectedClosetItemId(null);
    setPendingBbox(null);
    tapBox.clear();
    setNewItemSheetOpen(false);
    setChangeCount(0);
  };

  const handleCancelEdit = () => {
    if (pendingOpsRef.current.size > 0) {
      setShowDiscardConfirm(true);
      return;
    }
    resetEditState();
  };

  const handleDiscardConfirm = () => {
    setShowDiscardConfirm(false);
    resetEditState();
  };

  const getPreviewStatus = (closetItem: ClosetItem): ItemStatus =>
    closetItem.purchaseOfferEnabled ? '미판매_제안가능' : '미판매_제안불가';

  const bboxToPosition = (bbox: Bbox) => ({
    x: (bbox.x + bbox.width / 2) * 100,
    y: (bbox.y + bbox.height / 2) * 100,
  });

  const handleEditSubmit = () => {
    if (!editTarget || selectedClosetItemId === null || !post) return;

    const closetItem = closetItems.find((item) => item.id === selectedClosetItemId);
    if (!closetItem) return;
    const labelText = `${closetItem.brand} / ${closetItem.name}`;
    const previewStatus = getPreviewStatus(closetItem);

    if (editTarget.type === 'edit') {
      const existingTag = draftTags.find((tag) => tag.id === editTarget.tagId);
      if (!existingTag) return;
      const isUnsavedTag = existingTag.id < 0;

      setDraftTags((prev) =>
        prev.map((tag) =>
          tag.id === existingTag.id
            ? {
                ...tag,
                itemId: selectedClosetItemId,
                brand: closetItem.brand,
                name: closetItem.name,
                status: previewStatus,
                imageUrl: closetItem.imageUrl ?? tag.imageUrl,
              }
            : tag,
        ),
      );

      if (isUnsavedTag) {
        // 이번 편집 세션에서 방금 추가한 태그를 다시 고친 것 -> 'add' 예약을 그대로 갱신한다.
        const prevOp = pendingOpsRef.current.get(existingTag.id);
        pendingOpsRef.current.set(existingTag.id, {
          kind: 'add',
          itemId: selectedClosetItemId,
          labelText,
          bbox: prevOp?.kind === 'add' ? prevOp.bbox : existingTag.bbox,
        });
      } else {
        pendingOpsRef.current.set(existingTag.id, {
          kind: 'edit',
          tagId: existingTag.id,
          itemId: selectedClosetItemId,
          labelText,
          bbox: existingTag.bbox,
        });
      }
      showToast('수정되었습니다.');
    } else {
      if (draftTags.length >= MAX_TAGGED_ITEMS || !pendingBbox) return;
      const localId = tempTagIdRef.current--;
      const newTag: TaggedItem = {
        id: localId,
        itemId: selectedClosetItemId,
        brand: closetItem.brand,
        name: closetItem.name,
        category: '',
        status: previewStatus,
        imageUrl: closetItem.imageUrl ?? undefined,
        wished: false,
        position: bboxToPosition(pendingBbox),
        bbox: pendingBbox,
      };
      setDraftTags((prev) => [...prev, newTag]);
      pendingOpsRef.current.set(localId, {
        kind: 'add',
        itemId: selectedClosetItemId,
        labelText,
        bbox: pendingBbox,
      });
      showToast('추가되었습니다.');
    }

    setChangeCount(pendingOpsRef.current.size);
    setEditTarget(null);
    setSelectedClosetItemId(null);
    setPendingBbox(null);
    tapBox.clear();
    setResultExpanded(false);
  };

  const handleComplete = async () => {
    if (!post) return;
    if (pendingOpsRef.current.size === 0) {
      setMode('view');
      setTagsVisible(true);
      return;
    }
    setIsSaving(true);
    try {
      for (const op of pendingOpsRef.current.values()) {
        if (op.kind === 'add') {
          await createTag(post.id, {
            itemId: op.itemId,
            bbox: op.bbox,
            labelText: op.labelText,
            status: 'CONFIRMED',
          });
        } else {
          await updateTag(op.tagId, { itemId: op.itemId, bbox: op.bbox, labelText: op.labelText });
        }
      }
      await confirmTags(post.id).catch(() => undefined);
      await refreshPost();
      showToast('게시물이 수정되었습니다.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '처리 중 오류가 발생했어요.');
    } finally {
      pendingOpsRef.current = new Map();
      setIsSaving(false);
      setMode('view');
      setTagsVisible(true);
    }
  };

  const toggleHeart = async () => {
    if (!post) return;
    const next = !post.liked;
    setPost((p) => (p ? { ...p, liked: next, likeCount: p.likeCount + (next ? 1 : -1) } : p));
    try {
      await (next ? heartOotd(post.id) : unheartOotd(post.id));
    } catch {
      setPost((p) => (p ? { ...p, liked: !next, likeCount: p.likeCount + (next ? -1 : 1) } : p));
      showToast('처리 중 오류가 발생했어요.');
    }
  };

  const toggleBookmark = async () => {
    if (!post) return;
    const next = !post.bookmarked;
    setPost((p) =>
      p ? { ...p, bookmarked: next, bookmarkCount: p.bookmarkCount + (next ? 1 : -1) } : p,
    );
    try {
      await (next ? saveOotd(post.id) : unsaveOotd(post.id));
    } catch {
      setPost((p) =>
        p ? { ...p, bookmarked: !next, bookmarkCount: p.bookmarkCount + (next ? -1 : 1) } : p,
      );
      showToast('처리 중 오류가 발생했어요.');
    }
  };

  // 신고는 아직 BE reasonType enum이 OOTD 게시물용이 아니라(채팅 신고용 재활용) 화면상으로만 동작한다.
  const toggleFollow = async () => {
    if (!post) return;
    const next = !post.isFollowing;
    setPost((p) => (p ? { ...p, isFollowing: next } : p));
    try {
      await (next ? followUser(post.author.id) : unfollowUser(post.author.id));
    } catch {
      setPost((p) => (p ? { ...p, isFollowing: !next } : p));
      showToast('처리 중 오류가 발생했어요.');
    }
  };

  const toggleTagWish = async (itemId: number, currentlyWished: boolean) => {
    const next = !currentlyWished;
    setPost((p) =>
      p
        ? {
            ...p,
            taggedItems: p.taggedItems.map((t) =>
              t.itemId === itemId ? { ...t, wished: next } : t,
            ),
          }
        : p,
    );
    try {
      await (next ? wishItem(itemId) : unwishItem(itemId));
    } catch {
      setPost((p) =>
        p
          ? {
              ...p,
              taggedItems: p.taggedItems.map((t) =>
                t.itemId === itemId ? { ...t, wished: currentlyWished } : t,
              ),
            }
          : p,
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!post) return;
    setShowDeleteConfirm(false);
    try {
      await deleteOotd(post.id);
      navigate('/', { state: { toast: '게시물이 삭제되었습니다.' } });
    } catch (e) {
      showToast(e instanceof Error ? e.message : '삭제 중 오류가 발생했어요.');
    }
  };

  const handleBlockMenuClick = () => {
    setShowMoreMenu(false);
    setShowBlockConfirm(true);
  };

  const handleBlockConfirm = async () => {
    if (!post) return;
    setShowBlockConfirm(false);
    try {
      await blockUser(post.author.id);
      navigate('/', { state: { toast: '이 사용자의 게시글이 더 이상 표시되지 않아요.' } });
    } catch (e) {
      showToast(e instanceof Error ? e.message : '처리 중 오류가 발생했어요.');
    }
  };

  const handleReportClick = () => {
    setShowMoreMenu(false);
    navigate(`/ootd/${targetId}/report`);
  };

  if (loadError) {
    return (
      <div className="bg-bg-white flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-body-1 text-text-primary font-semibold">게시물을 찾을 수 없어요.</p>
        <p className="text-body-3 text-text-tertiary">삭제되었거나 존재하지 않는 게시물이에요.</p>
        <button type="button" onClick={() => navigate(-1)} className="text-body-2 text-brand mt-2">
          뒤로가기
        </button>
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div className="bg-bg-white flex min-h-screen flex-col items-center justify-center">
        <div className="border-brand size-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  const visibleTags = mode === 'edit' ? draftTags : post.taggedItems;
  const showTags = mode === 'view' ? tagsVisible : editTagsVisible;

  // 같은 아이템이 두 번 태그되지 않도록, 현재 편집 중인 태그 자신을 제외한 나머지가
  // 이미 물고 있는 itemId는 옷장 목록에서 골라낸다.
  const alreadyTaggedItemIds = new Set(
    draftTags
      .filter((tag) => !(editTarget?.type === 'edit' && tag.id === editTarget.tagId))
      .map((tag) => tag.itemId),
  );
  const availableClosetItems = closetItems.filter((item) => !alreadyTaggedItemIds.has(item.id));

  return (
    <div className="bg-bg-white relative flex min-h-screen flex-col">
      {mode === 'view' ? (
        <ViewHeader onBack={() => navigate(-1)} onMoreClick={() => setShowMoreMenu(true)} />
      ) : (
        <EditHeader
          changeCount={changeCount}
          onCancel={handleCancelEdit}
          onComplete={handleComplete}
        />
      )}

      {/* 헤더 아래 영역을 감싸는 relative 컨테이너.
          새 아이템 등록 시트가 이 안에서만 absolute inset-0로 딤 처리되도록 해서
          위쪽 헤더(취소/완료 버튼)까지 검게 덮이지 않게 한다. */}
      <div className="relative flex flex-1 flex-col">
        <div
          className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-black"
          onClick={mode === 'view' ? handlePhotoClick : undefined}
          onPointerDown={mode === 'edit' ? handleEditPhotoPointerDown : undefined}
        >
          <img src={post.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />

          {mode === 'edit' && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setEditTagsVisible((v) => !v);
              }}
              aria-label="태그 표시 전환"
              className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white"
            >
              {editTagsVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}

          {mode === 'edit' && tapBox.rect && <SpotlightBox rect={tapBox.rect} />}

          {showTags &&
            visibleTags.map((tag) => (
              <TagPin
                key={tag.id}
                item={tag}
                selected={
                  mode === 'edit' && editTarget?.type === 'edit' && editTarget.tagId === tag.id
                }
                onClick={
                  mode === 'edit'
                    ? () => {
                        setPendingBbox(null);
                        tapBox.clear();
                        beginTagAnalysis({ type: 'edit', tagId: tag.id }, tag.itemId);
                      }
                    : tag.status === '미판매_제안가능' || tag.status === '미판매_제안불가'
                      ? // 판매 전환 이력이 없는 미판매 태그는 이동할 상세 화면이 없어 탭해도 아무 동작을 하지 않는다.
                        () => {}
                      : () => goToDetail(tag)
                }
                interactive={
                  mode === 'edit' ||
                  !(tag.status === '미판매_제안가능' || tag.status === '미판매_제안불가')
                }
              />
            ))}
        </div>

        {mode === 'view' && (
          <>
            <div className="flex items-center gap-4 px-4 pt-3">
              <button type="button" onClick={toggleHeart} className="flex items-center gap-1">
                <Heart
                  size={20}
                  className={post.liked ? 'fill-brand text-brand' : 'text-text-tertiary'}
                />
                <span className="text-body-3 text-text-secondary">{post.likeCount}</span>
              </button>
              <button type="button" onClick={toggleBookmark} className="flex items-center gap-1">
                <Bookmark
                  size={20}
                  className={
                    post.bookmarked ? 'fill-text-primary text-text-primary' : 'text-text-tertiary'
                  }
                />
                <span className="text-body-3 text-text-secondary">{post.bookmarkCount}</span>
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <button
                type="button"
                onClick={() => navigate(`/users/${post.author.id}`)}
                className="flex items-center gap-2"
              >
                <div className="bg-gray-bg size-9 overflow-hidden rounded-full">
                  {post.author.avatarUrl && (
                    <img src={post.author.avatarUrl} alt="" className="size-full object-cover" />
                  )}
                </div>
                <p className="text-body-2 text-text-primary font-semibold">{post.author.name}</p>
              </button>
              {!post.isOwner && (
                <FollowButton following={post.isFollowing} onToggle={toggleFollow} />
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowTaggedSheet(true)}
              onPointerDown={handlePeekPointerDown}
              onPointerMove={handlePeekPointerMove}
              onPointerUp={handlePeekPointerEnd}
              onPointerCancel={handlePeekPointerEnd}
              className="border-border-secondary mt-auto flex touch-none flex-col items-center gap-2 border-t px-4 pt-2 pb-6"
            >
              <span className="bg-gray-bg h-1 w-9 rounded-full" />
              <span className="w-full text-left">
                <span className="text-body-1 text-text-primary block font-semibold">
                  태그된 아이템
                </span>
                <span className="text-body-3 text-text-tertiary">
                  사진 속에서 태그된 것만 모아봅니다.
                </span>
              </span>
            </button>
          </>
        )}

        {mode === 'edit' && !resultExpanded && (
          <div className="bg-bg-white flex h-60 shrink-0 flex-col overflow-hidden rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
            <div
              className="flex cursor-grab touch-none justify-center py-2 active:cursor-grabbing"
              onClick={() => setResultExpanded(true)}
              onPointerDown={handleCollapsedHandlePointerDown}
              onPointerUp={handleCollapsedHandlePointerUp}
            >
              <span className="bg-border-secondary h-1 w-10 rounded-full" />
            </div>
            <EditTagSheet
              target={editTarget}
              isAnalyzing={isAnalyzingTag || closetItemsLoading}
              closetItems={availableClosetItems}
              selectedClosetItemId={selectedClosetItemId}
              onSelectClosetItem={(item) => setSelectedClosetItemId(item.id)}
              onRegisterNewItem={() => setNewItemSheetOpen(true)}
              onSubmit={handleEditSubmit}
            />
          </div>
        )}

        {mode === 'edit' && (
          <BottomSheet
            open={resultExpanded}
            onClose={() => setResultExpanded(false)}
            variant="plain"
            heightPx={getResultExpandedHeightPx()}
            onHandlePointerDown={handleExpandedHandlePointerDown}
            onHandlePointerUp={handleExpandedHandlePointerUp}
            className="flex flex-col"
          >
            <EditTagSheet
              target={editTarget}
              isAnalyzing={isAnalyzingTag || closetItemsLoading}
              closetItems={availableClosetItems}
              selectedClosetItemId={selectedClosetItemId}
              onSelectClosetItem={(item) => setSelectedClosetItemId(item.id)}
              onRegisterNewItem={() => setNewItemSheetOpen(true)}
              onSubmit={handleEditSubmit}
            />
          </BottomSheet>
        )}

        {mode === 'edit' && newItemSheetOpen && (
          <NewItemSheet
            onBack={() => setNewItemSheetOpen(false)}
            onSubmit={handleRegisterNewItem}
          />
        )}
      </div>

      <IntroTagModal
        open={showIntro}
        onConfirm={() => {
          sessionStorage.setItem(INTRO_SEEN_KEY, '1');
          setShowIntro(false);
        }}
        imageUrl={post.imageUrl}
        previewTags={post.taggedItems.slice(0, 2)}
      />

      <MoreMenu
        open={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        isOwner={post.isOwner}
        onEdit={handleStartEdit}
        onDelete={() => {
          setShowMoreMenu(false);
          setShowDeleteConfirm(true);
        }}
        onBlock={handleBlockMenuClick}
        onReport={handleReportClick}
      />

      <TaggedItemsSheet
        open={showTaggedSheet}
        onClose={() => setShowTaggedSheet(false)}
        items={post.taggedItems}
        isOwner={post.isOwner}
        dragProgressPx={sheetDragPx}
        onViewRelatedOotd={() => navigate(`/ootd/${targetId}/related`)}
        onToggleWish={toggleTagWish}
      />

      <ConfirmModal
        open={showBlockConfirm}
        title="이 사용자를 차단할까요?"
        description="이 사용자의 게시글이 더 이상 표시되지 않아요."
        confirmLabel="차단하기"
        onCancel={() => setShowBlockConfirm(false)}
        onConfirm={handleBlockConfirm}
      />

      <ConfirmModal
        open={showDeleteConfirm}
        title="게시물을 삭제할까요?"
        description="삭제한 게시물은 다시 복구할 수 없어요."
        confirmLabel="삭제하기"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmModal
        open={showDiscardConfirm}
        title="수정 중인 내용이 있어요"
        description="완료를 누르지 않고 나가면 수정한 내용이 저장되지 않아요."
        confirmLabel="나가기"
        cancelLabel="계속 수정"
        onCancel={() => setShowDiscardConfirm(false)}
        onConfirm={handleDiscardConfirm}
      />

      {isSaving && (
        <div className="bg-bg-white fixed inset-0 z-50 flex flex-col items-center justify-center gap-4">
          <div className="border-brand size-10 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-body-2 text-text-secondary">게시물 수정 중입니다!!!</p>
        </div>
      )}

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default OotdDetailPage;
