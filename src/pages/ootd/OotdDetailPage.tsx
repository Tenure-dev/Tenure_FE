import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, Eye, EyeOff, Heart } from 'lucide-react';
import { BottomSheet, FollowButton, Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { MAX_TAGGED_ITEMS, type TaggedItem, type TagPosition } from '@/features/ootd/model/types';
import { mockClosetItems, mockOotdPost } from '@/features/ootd/model/mocks';
import TagPin from '@/features/ootd/ui/TagPin';
import IntroTagModal from '@/features/ootd/ui/IntroTagModal';
import ConfirmModal from '@/features/ootd/ui/ConfirmModal';
import TaggedItemsSheet from '@/features/ootd/ui/TaggedItemsSheet';
import EditTagSheet, { type EditTagTarget } from '@/features/ootd/ui/EditTagSheet';
import MoreMenu from '@/features/ootd/ui/MoreMenu';
import ViewHeader from './components/ViewHeader';
import EditHeader from './components/EditHeader';

const SHEET_DRAG_OPEN_THRESHOLD = 80;
const TAG_ANALYZE_DELAY_MS = 700;
const RESULT_EXPAND_RATIO = 0.8;

const OotdDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState(mockOotdPost);
  const introKey = `ootd-intro-seen-${post.id}`;
  const [showIntro, setShowIntro] = useState(() => sessionStorage.getItem(introKey) !== '1');
  const [tagsVisible, setTagsVisible] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showTaggedSheet, setShowTaggedSheet] = useState(false);
  const [sheetDragPx, setSheetDragPx] = useState<number | undefined>(undefined);
  const dragStartYRef = useRef<number | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [draftTags, setDraftTags] = useState<TaggedItem[]>([]);
  const [changeCount, setChangeCount] = useState(0);
  const [editTagsVisible, setEditTagsVisible] = useState(true);
  const [editTarget, setEditTarget] = useState<EditTagTarget>(null);
  const [isAnalyzingTag, setIsAnalyzingTag] = useState(false);
  const [selectedClosetItemId, setSelectedClosetItemId] = useState<string | null>(null);
  const [pendingPosition, setPendingPosition] = useState<TagPosition | null>(null);
  const analyzeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [resultExpanded, setResultExpanded] = useState(false);
  const collapsedDragStartYRef = useRef<number | null>(null);
  const expandedDragStartYRef = useRef<number | null>(null);

  const clearAnalyzeTimeout = () => {
    if (analyzeTimeoutRef.current !== null) {
      clearTimeout(analyzeTimeoutRef.current);
      analyzeTimeoutRef.current = null;
    }
  };

  useEffect(() => clearAnalyzeTimeout, []);

  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();

  const initialToastRef = useRef((location.state as { toast?: string } | null)?.toast ?? null);

  useEffect(() => {
    if (initialToastRef.current) {
      const msg = initialToastRef.current;
      initialToastRef.current = null;
      showToast(msg);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, showToast]);

  const targetId = id ?? post.id;

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

  const beginTagAnalysis = (target: EditTagTarget, presetClosetItemId: string | null) => {
    clearAnalyzeTimeout();
    setEditTarget(null);
    setIsAnalyzingTag(true);
    setResultExpanded(false);
    setSelectedClosetItemId(presetClosetItemId);
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

  const handleEditPhotoClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (draftTags.length >= MAX_TAGGED_ITEMS) {
      showToast(`태그는 최대 ${MAX_TAGGED_ITEMS}개까지 가능해요.`);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    setPendingPosition({ x, y });
    beginTagAnalysis({ type: 'add' }, null);
  };

  const handleStartEdit = () => {
    clearAnalyzeTimeout();
    setDraftTags(post.taggedItems.map((tag) => ({ ...tag })));
    setChangeCount(0);
    setEditTarget(null);
    setIsAnalyzingTag(false);
    setResultExpanded(false);
    setSelectedClosetItemId(null);
    setPendingPosition(null);
    setEditTagsVisible(true);
    setMode('edit');
    setShowMoreMenu(false);
  };

  const handleCancelEdit = () => {
    clearAnalyzeTimeout();
    setMode('view');
    setEditTarget(null);
    setIsAnalyzingTag(false);
    setResultExpanded(false);
    setSelectedClosetItemId(null);
    setPendingPosition(null);
    setChangeCount(0);
  };

  const handleEditSubmit = () => {
    if (!editTarget || !selectedClosetItemId) return;

    const closetItem = mockClosetItems.find((item) => item.id === selectedClosetItemId);
    const brand = closetItem?.brand ?? '';
    const name = closetItem?.name ?? '';
    const category = closetItem?.category ?? '';

    if (editTarget.type === 'edit') {
      setDraftTags((prev) =>
        prev.map((tag) =>
          tag.id === editTarget.tagId
            ? {
                ...tag,
                brand,
                name,
                category,
                status: '미판매',
                canOffer: true,
                price: undefined,
                closetItemId: selectedClosetItemId,
              }
            : tag,
        ),
      );
      showToast('수정되었습니다.');
    } else {
      setDraftTags((prev) => {
        if (prev.length >= MAX_TAGGED_ITEMS) return prev;
        const newTag: TaggedItem = {
          id: `tag-${Date.now()}`,
          brand,
          name,
          category,
          status: '미판매',
          canOffer: true,
          position: pendingPosition ?? { x: 50, y: 50 },
          closetItemId: selectedClosetItemId,
        };
        return [...prev, newTag];
      });
      showToast('추가되었습니다.');
    }

    setChangeCount((c) => c + 1);
  };

  const handleComplete = () => {
    setIsSaving(true);
    setTimeout(() => {
      setPost((prev) => ({ ...prev, taggedItems: draftTags }));
      setIsSaving(false);
      setMode('view');
      setTagsVisible(true);
      showToast('게시물이 수정되었습니다.');
    }, 1200);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    navigate('/', { state: { toast: '게시물이 삭제되었습니다.' } });
  };

  const handleBlockMenuClick = () => {
    setShowMoreMenu(false);
    if (post.isBlocked) {
      setPost((prev) => ({ ...prev, isBlocked: false }));
      showToast('이 사용자의 게시글을 다시 볼 수 있어요.');
    } else {
      setShowBlockConfirm(true);
    }
  };

  const handleBlockConfirm = () => {
    setShowBlockConfirm(false);
    setPost((prev) => ({ ...prev, isBlocked: true }));
    showToast('이 사용자의 게시글이 더 이상 표시되지 않아요.');
  };

  const handleReportClick = () => {
    setShowMoreMenu(false);
    navigate(`/ootd/${targetId}/report`);
  };

  const visibleTags = mode === 'view' ? post.taggedItems : draftTags;
  const showTags = mode === 'view' ? tagsVisible : editTagsVisible;

  return (
    <div className="bg-bg-white relative mx-auto flex min-h-screen w-full max-w-md flex-col">
      {mode === 'view' ? (
        <ViewHeader onBack={() => navigate(-1)} onMoreClick={() => setShowMoreMenu(true)} />
      ) : (
        <EditHeader
          changeCount={changeCount}
          onCancel={handleCancelEdit}
          onComplete={handleComplete}
        />
      )}

      {mode === 'view' && (
        <button
          type="button"
          onClick={() => setPost((p) => ({ ...p, isOwner: !p.isOwner }))}
          className="absolute top-14 right-4 z-20 rounded-full bg-black/70 px-3 py-1.5 text-[11px] text-white"
        >
          {post.isOwner ? '작성자 시점 (전환)' : '방문자 시점 (전환)'}
        </button>
      )}

      <div
        className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-black"
        onClick={mode === 'view' ? handlePhotoClick : handleEditPhotoClick}
      >
        <img src={post.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />

        {mode === 'edit' && (
          <button
            type="button"
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
                      setPendingPosition(null);
                      beginTagAnalysis({ type: 'edit', tagId: tag.id }, tag.closetItemId ?? null);
                    }
                  : undefined
              }
            />
          ))}
      </div>

      {mode === 'view' && (
        <>
          <div className="flex items-center gap-4 px-4 pt-3">
            <button
              type="button"
              onClick={() => setPost((p) => ({ ...p, liked: !p.liked }))}
              className="flex items-center gap-1"
            >
              <Heart
                size={20}
                className={post.liked ? 'fill-brand text-brand' : 'text-text-tertiary'}
              />
              <span className="text-body-3 text-text-secondary">{post.likeCount}</span>
            </button>
            <button
              type="button"
              onClick={() => setPost((p) => ({ ...p, bookmarked: !p.bookmarked }))}
              className="flex items-center gap-1"
            >
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
            <div className="flex items-center gap-2">
              <div className="bg-gray-bg size-9 rounded-full" />
              <div>
                <p className="text-body-2 text-text-primary font-semibold">{post.author.name}</p>
                <p className="text-body-4 text-text-tertiary">
                  팔로우 {post.author.followerCount}명 · 피드 {post.author.feedCount}개
                </p>
              </div>
            </div>
            <FollowButton
              following={post.isFollowing}
              onToggle={() => setPost((p) => ({ ...p, isFollowing: !p.isFollowing }))}
            />
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
            isAnalyzing={isAnalyzingTag}
            closetItems={mockClosetItems}
            selectedClosetItemId={selectedClosetItemId}
            onSelectClosetItem={(item) => setSelectedClosetItemId(item.id)}
            onRegisterNewItem={() => showToast('새 아이템 등록은 추후 지원될 예정이에요.')}
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
          className="flex max-w-md flex-col"
        >
          <EditTagSheet
            target={editTarget}
            isAnalyzing={isAnalyzingTag}
            closetItems={mockClosetItems}
            selectedClosetItemId={selectedClosetItemId}
            onSelectClosetItem={(item) => setSelectedClosetItemId(item.id)}
            onRegisterNewItem={() => showToast('새 아이템 등록은 추후 지원될 예정이에요.')}
            onSubmit={handleEditSubmit}
          />
        </BottomSheet>
      )}

      <IntroTagModal
        open={showIntro}
        onConfirm={() => {
          sessionStorage.setItem(introKey, '1');
          setShowIntro(false);
        }}
        imageUrl={post.imageUrl}
        previewTags={post.taggedItems.slice(0, 2)}
      />

      <MoreMenu
        open={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        isOwner={post.isOwner}
        isBlocked={post.isBlocked}
        onEdit={handleStartEdit}
        onDelete={() => {
          setShowMoreMenu(false);
          setShowDeleteConfirm(true);
        }}
        onBlockToggle={handleBlockMenuClick}
        onReport={handleReportClick}
      />

      <TaggedItemsSheet
        open={showTaggedSheet}
        onClose={() => setShowTaggedSheet(false)}
        items={post.taggedItems}
        dragProgressPx={sheetDragPx}
        onViewRelatedOotd={() => navigate(`/ootd/${targetId}/related`)}
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
