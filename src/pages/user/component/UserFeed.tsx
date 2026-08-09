import { Link } from 'react-router-dom';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { useUserPostsQuery } from '@/features/user/model/useUserPostsQuery';
import {
  useToggleUserFeedHeart,
  useToggleUserFeedSave,
} from '@/features/user/model/useUserFeedReactions';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import type { MyPostItem } from '@/features/mypage/api/dto';
import bookmark from '@/shared/assets/bookmark.svg';
import bookmarkActive from '@/shared/assets/save-active.svg';
import heart from '@/shared/assets/like.svg';
import heartActive from '@/shared/assets/heart-active.svg';

// createdAt 기준 "M월" 그룹핑 (응답이 최신순이라 순서 유지)
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

const PostGridItem = ({
  item,
  onToggleHeart,
  onToggleSave,
}: {
  item: MyPostItem;
  onToggleHeart: (ootdId: number, active: boolean) => void;
  onToggleSave: (ootdId: number, active: boolean) => void;
}) => (
  <Link
    to={`/ootd/${item.ootdId}`}
    className="relative mb-2 block break-inside-avoid overflow-hidden rounded-md"
  >
    <img src={resolveFileUrl(item.imageUrl)} alt="" className="block h-auto w-full rounded-md" />
    <button
      type="button"
      aria-label={item.saved ? '저장 취소' : '저장'}
      onClick={(e) => {
        e.preventDefault(); // 상세 이동 막고 토글만
        onToggleSave(item.ootdId, !item.saved);
      }}
      className="absolute right-2 bottom-2"
    >
      <img
        src={item.saved ? bookmarkActive : bookmark}
        width={24}
        height={24}
        alt=""
        className={item.saved ? 'drop-shadow' : 'brightness-0 drop-shadow invert'}
      />
    </button>
    <button
      type="button"
      aria-label={item.hearted ? '좋아요 취소' : '좋아요'}
      onClick={(e) => {
        e.preventDefault();
        onToggleHeart(item.ootdId, !item.hearted);
      }}
      className="absolute right-2 bottom-12"
    >
      <img
        src={item.hearted ? heartActive : heart}
        width={24}
        height={24}
        alt=""
        className={item.hearted ? 'drop-shadow' : 'brightness-0 drop-shadow invert'}
      />
    </button>
  </Link>
);

// 타인 프로필 피드: 월별 OOTD 그리드 (GET /users/{userId}/ootds, 무한 스크롤 + 하트/저장)
const UserFeed = ({ userId }: { userId: number }) => {
  const { data, isPending, isError, fetchNextPage, hasNextPage } = useUserPostsQuery(userId);
  const { mutate: toggleHeart } = useToggleUserFeedHeart(userId);
  const { mutate: toggleSave } = useToggleUserFeedSave(userId);
  const items = data?.pages.flatMap((page) => page.content) ?? [];
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
              <PostGridItem
                key={it.ootdId}
                item={it}
                onToggleHeart={(ootdId, active) => toggleHeart({ ootdId, active })}
                onToggleSave={(ootdId, active) => toggleSave({ ootdId, active })}
              />
            ))}
          </div>
        </section>
      ))}
      <div ref={sentinelRef} />
    </div>
  );
};

export default UserFeed;
