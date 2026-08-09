import { Link } from 'react-router-dom';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { useUserPostsQuery } from '@/features/user/model/useUserPostsQuery';
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

// 타인 프로필 피드: 월별 OOTD 그리드 (GET /users/{userId}/ootds). 표시 전용.
const UserFeed = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useUserPostsQuery(userId);

  if (isPending)
    return <p className="text-body-3 text-text-secondary px-4 py-10 text-center">불러오는 중…</p>;
  if (isError)
    return (
      <p className="text-body-3 text-text-secondary px-4 py-10 text-center">
        게시물을 불러오지 못했어요.
      </p>
    );
  if (data.content.length === 0)
    return (
      <p className="text-body-3 text-text-secondary px-4 py-10 text-center">
        아직 게시물이 없어요.
      </p>
    );

  return (
    <div className="px-4 pb-6">
      {groupByMonth(data.content).map(({ month, items }) => (
        <section key={month} className="mt-5">
          <h2 className="text-title-2 mb-2 font-medium">{month}</h2>
          <div className="columns-[160px] gap-2">
            {items.map((it) => (
              <Link
                key={it.ootdId}
                to={`/ootd/${it.ootdId}`}
                className="relative mb-2 block break-inside-avoid overflow-hidden rounded-md"
              >
                <img
                  src={resolveFileUrl(it.imageUrl)}
                  alt=""
                  className="block h-auto w-full rounded-md"
                />
                <img
                  src={it.saved ? bookmarkActive : bookmark}
                  width={24}
                  height={24}
                  alt=""
                  className={
                    it.saved
                      ? 'absolute right-2 bottom-2 drop-shadow'
                      : 'absolute right-2 bottom-2 brightness-0 drop-shadow invert'
                  }
                />
                <img
                  src={it.hearted ? heartActive : heart}
                  width={24}
                  height={24}
                  alt=""
                  className={
                    it.hearted
                      ? 'absolute right-2 bottom-12 drop-shadow'
                      : 'absolute right-2 bottom-12 brightness-0 drop-shadow invert'
                  }
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default UserFeed;
