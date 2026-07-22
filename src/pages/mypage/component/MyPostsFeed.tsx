import { useMyPosts } from '@/features/mypage/api/useMyFeed';
import type { MyPostItem } from '@/features/mypage/api/dto';
import cn from '@/shared/lib/cn';
import bookmark from '@/shared/assets/bookmark.svg';
import heart from '@/shared/assets/like.svg';

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

const MyPostsFeed = () => {
  const { data, isPending, isError } = useMyPosts();

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
              <div
                key={it.ootdId}
                className={cn(
                  'relative mb-2 break-inside-avoid overflow-hidden rounded-md',
                  it.archived && 'opacity-40', // 보관(ARCHIVED) 게시물은 흐리게
                )}
              >
                <img src={it.imageUrl} alt="" className="block h-auto w-full rounded-md" />
                <img
                  src={bookmark}
                  width={24}
                  height={24}
                  alt="북마크"
                  className="absolute right-2 bottom-2 brightness-0 drop-shadow invert"
                />
                <img
                  src={heart}
                  width={24}
                  height={24}
                  alt="좋아요"
                  className="absolute right-2 bottom-12 brightness-0 drop-shadow invert"
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MyPostsFeed;
