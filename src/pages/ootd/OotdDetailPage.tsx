import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, Heart } from 'lucide-react';
import { FollowButton, Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { cn } from '@/shared/lib/cn';
import { USER_ID_STORAGE_KEY } from '@/shared/lib/api';
import { type Bbox, type OotdPost, type TaggedItem } from '@/features/ootd/model/types';
import { useTagNavigation } from '@/features/ootd/lib/useTagNavigation';
import {
  confirmTags,
  createTagsBatch,
  deleteOotd,
  followUser,
  getOotdDetail,
  heartOotd,
  saveOotd,
  unfollowUser,
  unheartOotd,
  unsaveOotd,
  unwishItem,
  wishItem,
} from '@/features/ootd/api/ootdApi';
import { toOotdPost } from '@/features/ootd/lib/mappers';
import TagPin from '@/features/ootd/ui/TagPin';
import IntroTagModal from '@/features/ootd/ui/IntroTagModal';
import ConfirmModal from '@/features/ootd/ui/ConfirmModal';
import TaggedItemsSheet, { TAGGED_ITEMS_PEEK_HEIGHT_PX } from '@/features/ootd/ui/TaggedItemsSheet';
import MoreMenu from '@/features/ootd/ui/MoreMenu';
import OotdTagEditor, { type EditorTag } from '@/features/ootd/ui/OotdTagEditor';
import ViewHeader from './components/ViewHeader';
import EditHeader from './components/EditHeader';

// 계정당 한 번만 보여주는 안내 모달. 로그인 세션이 아니라 계정(userId) 단위로 영구 기록한다.
const INTRO_SEEN_KEY_PREFIX = 'ootd-intro-seen';
const getIntroSeenKey = (userId: number | null) => `${INTRO_SEEN_KEY_PREFIX}:${userId ?? 'anon'}`;

const getCurrentUserId = (): number | null => {
  const raw = localStorage.getItem(USER_ID_STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
};

// 서버 태그 → 에디터 태그(tagId 보존)
const toEditorTag = (t: TaggedItem): EditorTag => ({
  tagId: t.id,
  itemId: t.itemId,
  bbox: t.bbox,
  labelText: `${t.brand} / ${t.name}`,
});

const bboxEq = (a: Bbox, b: Bbox) =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

const OotdDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
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
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  // 편집 중 결과 시트가 최대치로 올라가면 EditHeader를 접어 숨긴다.
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  // 편집 중 태그 상태(에디터가 onChange로 통지). 완료 전까지 서버 미반영 → 뒤로가기/취소 시 그대로 버림.
  const [editorTags, setEditorTags] = useState<EditorTag[]>([]);

  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();
  const { goToDetail } = useTagNavigation();

  const initialToastRef = useRef((location.state as { toast?: string } | null)?.toast ?? null);
  // 게시 직후 상세로 진입한 경우: 뒤로가기를 작성 화면이 아니라 피드로 보낸다.
  const fromPublishRef = useRef(
    (location.state as { fromPublish?: boolean } | null)?.fromPublish ?? false,
  );
  const handleBack = () => {
    if (fromPublishRef.current) navigate('/feed', { replace: true });
    else navigate(-1);
  };

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
    setPost((prev) => toOotdPost(detail, currentUserId, prev ?? undefined));
    return detail;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ootdId]);

  // 자동태그 글 자동 확정: 내 글이고 AI 태그가 준비되면(AUTO_UNCONFIRMED) 조회 시점에 confirm 처리.
  // ANALYZING이면 준비될 때까지 폴링. (별도 '확인완료' 버튼 없이 "봤으면 확정")
  useEffect(() => {
    if (!Number.isFinite(ootdId) || currentUserId == null) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      try {
        const detail = await getOotdDetail(ootdId);
        if (cancelled) return;
        if (detail.author.userId !== currentUserId) return; // 내 글 아니면 확정 안 함
        if (detail.tagStatus === 'ANALYZING') {
          timer = setTimeout(tick, 1500); // AI 분석 중 → 준비될 때까지 폴링
          return;
        }
        if (detail.tagStatus === 'AUTO_UNCONFIRMED') {
          // 태그 0개면 확정할 것도 없음(백엔드 confirm 불필요) → 스킵
          if ((detail.tags?.length ?? 0) === 0) return;
          try {
            await confirmTags(ootdId);
            if (!cancelled) await refreshPost(); // CONFIRMED 반영
          } catch {
            // 확정 실패는 무시
          }
        }
      } catch {
        // 조회 실패는 무시
      }
    };

    void tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ootdId, currentUserId]);

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
      setShowIntro(localStorage.getItem(getIntroSeenKey(currentUserId)) !== '1');
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

  // 원본 대비 변경 수(신규 + 수정 + 삭제). 저장은 배치(전체 교체)라 삭제도 반영된다.
  const changeCount = useMemo(() => {
    if (!post) return 0;
    const origById = new Map(post.taggedItems.map((t) => [t.id, t]));
    const editedTagIds = new Set(editorTags.filter((t) => t.tagId != null).map((t) => t.tagId));
    let n = 0;
    for (const t of editorTags) {
      if (t.tagId == null) {
        n += 1;
        continue;
      }
      const o = origById.get(t.tagId);
      if (!o || o.itemId !== t.itemId || !bboxEq(o.bbox, t.bbox)) n += 1;
    }
    // 제거된 태그(원본엔 있는데 편집 결과엔 없음)도 변경으로 카운트
    for (const o of post.taggedItems) {
      if (!editedTagIds.has(o.id)) n += 1;
    }
    return n;
  }, [post, editorTags]);

  // 완료 버튼 활성: 변경이 있을 때. 태그 0개면 눌렀을 때 토스트로 막는다(handleComplete).
  const canComplete = changeCount > 0;

  const handlePhotoClick = () => {
    setTagsVisible((v) => !v);
  };

  const handleStartEdit = () => {
    if (!post) return;
    setEditorTags(post.taggedItems.map(toEditorTag));
    setSheetExpanded(false);
    setMode('edit');
    setShowMoreMenu(false);
  };

  const resetEditState = () => {
    setEditorTags([]);
    setSheetExpanded(false);
    setMode('view');
  };

  const handleCancelEdit = () => {
    if (changeCount > 0) {
      setShowDiscardConfirm(true);
      return;
    }
    resetEditState();
  };

  const handleDiscardConfirm = () => {
    setShowDiscardConfirm(false);
    resetEditState();
  };

  // 완료 → 배치(전체 교체) 한 번으로 추가·수정·삭제 반영. confirm 불필요(배치가 CONFIRMED 저장).
  const handleComplete = async () => {
    if (!post) return;
    if (changeCount === 0) {
      resetEditState();
      setTagsVisible(true);
      return;
    }
    if (editorTags.length === 0) {
      showToast('1개 이상의 태그가 필요합니다.');
      return;
    }
    setIsSaving(true);
    try {
      await createTagsBatch(post.id, {
        tags: editorTags.map((t) => ({ itemId: t.itemId, bbox: t.bbox, labelText: t.labelText })),
      });
      await refreshPost();
      showToast('게시물이 수정되었습니다.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '처리 중 오류가 발생했어요.');
    } finally {
      setIsSaving(false);
      setEditorTags([]);
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

  // 차단/신고는 아직 BE API가 없어(요청 목록 참고) 화면상으로만 동작한다.
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
      // 삭제된 글이 목록 캐시에 남지 않도록 관련 목록 무효화 (마이페이지·피드·유저 프로필 피드)
      queryClient.invalidateQueries({ queryKey: ['ootds'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/', { state: { toast: '게시물이 삭제되었습니다.' } });
    } catch (e) {
      showToast(e instanceof Error ? e.message : '삭제 중 오류가 발생했어요.');
    }
  };

  const handleBlockMenuClick = () => {
    setShowMoreMenu(false);
    if (post?.isBlocked) {
      setPost((p) => (p ? { ...p, isBlocked: false } : p));
      showToast('이 사용자의 게시글을 다시 볼 수 있어요.');
    } else {
      setShowBlockConfirm(true);
    }
  };

  const handleBlockConfirm = () => {
    setShowBlockConfirm(false);
    setPost((p) => (p ? { ...p, isBlocked: true } : p));
    showToast('이 사용자의 게시글이 더 이상 표시되지 않아요.');
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

  const isDeadEnd = (status: TaggedItem['status']) => status === '삭제됨';

  return (
    <div
      className="bg-bg-white relative flex min-h-screen flex-col"
      style={mode === 'view' ? { paddingBottom: TAGGED_ITEMS_PEEK_HEIGHT_PX } : undefined}
    >
      {mode === 'view' ? (
        <ViewHeader onBack={handleBack} onMoreClick={() => setShowMoreMenu(true)} />
      ) : (
        // 결과 시트를 최대치로 올리면 EditHeader가 위로 접혀 사라진다.
        <div
          className={cn(
            'shrink-0 overflow-hidden transition-all duration-300 ease-out',
            sheetExpanded
              ? 'max-h-0 -translate-y-full opacity-0'
              : 'max-h-24 translate-y-0 opacity-100',
          )}
        >
          <EditHeader
            changeCount={changeCount}
            canComplete={canComplete}
            onCancel={handleCancelEdit}
            onComplete={handleComplete}
          />
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        {mode === 'view' ? (
          <>
            {/* 태그 좌표(bbox 0~1)는 원본 이미지 기준 → 에디터/미리보기와 동일하게 원본 비율로 렌더해야
                뷰/편집 태그 위치가 일치한다. (aspect-[3/4]+object-cover는 크롭돼 좌표가 어긋남) */}
            <div
              className="relative w-full shrink-0 overflow-hidden bg-black"
              onClick={handlePhotoClick}
            >
              <img src={post.imageUrl} alt="" className="block w-full" />

              {tagsVisible &&
                post.taggedItems.map((tag) => (
                  <TagPin
                    key={tag.id}
                    item={tag}
                    onClick={isDeadEnd(tag.status) ? () => {} : () => goToDetail(tag, post.isOwner)}
                    interactive={!isDeadEnd(tag.status)}
                  />
                ))}
            </div>

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
          </>
        ) : (
          <OotdTagEditor
            photo={post.imageUrl}
            ootdId={post.id}
            scrollable
            initialTags={post.taggedItems.map(toEditorTag)}
            onChange={setEditorTags}
            onSheetExpandedChange={setSheetExpanded}
            // 새 아이템 등록 시 bbox 영역을 대표 이미지로 크롭·업로드(cropImage가 crossOrigin으로 원격 이미지 지원).
            // 손 안 댄 기존 태그는 게시글처럼 흰색 말풍선, 누르거나 새로 추가한 것만 검정.
            untouchedVariant="default"
            className="flex-1"
          />
        )}
      </div>

      <IntroTagModal
        open={showIntro}
        onConfirm={() => {
          localStorage.setItem(getIntroSeenKey(currentUserId), '1');
          setShowIntro(false);
        }}
      />

      <div className="relative z-50">
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
      </div>

      {mode === 'view' && (
        <TaggedItemsSheet
          open={showTaggedSheet}
          onOpen={() => setShowTaggedSheet(true)}
          onClose={() => setShowTaggedSheet(false)}
          items={post.taggedItems}
          isOwner={post.isOwner}
          onViewRelatedOotd={() => navigate(`/ootd/${targetId}/related`)}
          onToggleWish={toggleTagWish}
        />
      )}

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
