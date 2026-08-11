import { Link } from 'react-router-dom';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { useMyPosts } from '@/features/mypage/api/useMyFeed';
import { useToggleHeart, useToggleSave } from '@/features/mypage/api/useToggleReaction';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import type { MyPostItem } from '@/features/mypage/api/dto';
import cn from '@/shared/lib/cn';
import bookmark from '@/shared/assets/bookmark.svg';
import bookmarkActive from '@/shared/assets/save-active.svg';
import heart from '@/shared/assets/like.svg';
import heartActive from '@/shared/assets/heart-active.svg';

// createdAt 기준으로 "M월" 그룹핑 (응답이 최신순이므로 순서를 유지한다)
const groupByMonth = (items: MyPostItem[]) => {
  const groups: { month: string; items: MyPostItem[] }[] = [];
  for (const item of items) {
    const label = `${new Date(item.createdAt).getMonth() + 1}월`;
    const last = groups.at(-1);
    if (last && last.month === label) last.items.push(item);
    else groups.push({ month: label, items: [item] });
  }
  return groups;
};

// 게시물 그리드 카드. hearted/saved는 서버 캐시(item)를 직접 반영 → 탭 간 상태 일치.
// 토글은 훅에서 캐시를 낙관적으로 갱신(즉시 반영)한다.
const PostGridItem = ({ item }: { item: MyPostItem }) => {
  const hearted = item.hearted;
  const saved = item.saved;
  const heartMutation = useToggleHeart();
  const saveMutation = useToggleSave();

  const toggleHeart = (e: React.MouseEvent) => {
    e.preventDefault(); // 상세 이동 막기
    heartMutation.mutate({ ootdId: item.ootdId, active: !hearted });
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ootdId: item.ootdId, active: !saved });
  };

  return (
    <Link
      to={`/ootd/${item.ootdId}`}
      className={cn(
        'relative mb-2 block break-inside-avoid overflow-hidden rounded-md',
        item.archived && 'opacity-40', // 보관(ARCHIVED) 게시물은 흐리게
      )}
    >
      <img src={resolveFileUrl(item.imageUrl)} alt="" className="block h-auto w-full rounded-md" />
      <button
        type="button"
        aria-label={saved ? '저장 취소' : '저장'}
        onClick={toggleSave}
        className="absolute right-2 bottom-2"
      >
        <img
          src={saved ? bookmarkActive : bookmark}
          width={24}
          height={24}
          alt=""
          className={saved ? 'drop-shadow' : 'brightness-0 drop-shadow invert'}
        />
      </button>
      <button
        type="button"
        aria-label={hearted ? '좋아요 취소' : '좋아요'}
        onClick={toggleHeart}
        className="absolute right-2 bottom-12"
      >
        <img
          src={hearted ? heartActive : heart}
          width={24}
          height={24}
          alt=""
          className={hearted ? 'drop-shadow' : 'brightness-0 drop-shadow invert'}
        />
      </button>
    </Link>
  );
};

const MyPostsFeed = () => {
  const { data, isPending, isError, fetchNextPage, hasNextPage } = useMyPosts();
  // ARCHIVED(미공개 초안)는 마이페이지 게시물에서 숨기고 공개 글만 표시
  const items = (data?.pages.flatMap((page) => page.content) ?? []).filter((it) => !it.archived);
  const sentinelRef = useInfiniteScroll({ hasMore: !!hasNextPage, onLoadMore: fetchNextPage });

  if (isPending)
    return <p className="text-body-3 text-text-secondary px-4 py-10 text-center">불러오는 중…</p>;
  if (isError)
    return (
      <p className="text-body-3 text-text-secondary px-4 py-10 text-center">
        게시물을 불러오지 못했어요.
      </p>
    );
  if (items.length === 0)
    return (
      <p className="text-body-3 text-text-secondary px-4 py-10 text-center">
        아직 게시물이 없어요.
      </p>
    );

  return (
    <div className="px-4 pb-6">
      {groupByMonth(items).map(({ month, items: monthItems }) => (
        <section key={month} className="mt-5">
          <h2 className="text-title-2 mb-2 font-medium">{month}</h2>
          <div className="columns-[160px] gap-2">
            {monthItems.map((it) => (
              <PostGridItem key={it.ootdId} item={it} />
            ))}
          </div>
        </section>
      ))}
      <div ref={sentinelRef} />
    </div>
  );
};

export default MyPostsFeed;
