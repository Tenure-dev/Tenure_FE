import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyPosts } from '@/features/mypage/api/useMyFeed';
import { useToggleHeart, useToggleSave } from '@/features/mypage/api/useToggleReaction';
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

// 게시물 그리드 카드. 서버에 hearted/saved 플래그가 없어 현재는 로컬 상태로만 토글한다(임시).
const PostGridItem = ({ item }: { item: MyPostItem }) => {
  const [hearted, setHearted] = useState(false);
  const [saved, setSaved] = useState(false);
  const heartMutation = useToggleHeart();
  const saveMutation = useToggleSave();

  const toggleHeart = (e: React.MouseEvent) => {
    e.preventDefault(); // 상세 이동 막기
    const next = !hearted;
    setHearted(next);
    heartMutation.mutate(
      { ootdId: item.ootdId, active: next },
      { onError: () => setHearted(!next) }, // 실패 시 되돌리기
    );
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = !saved;
    setSaved(next);
    saveMutation.mutate({ ootdId: item.ootdId, active: next }, { onError: () => setSaved(!next) });
  };

  return (
    <Link
      to={`/ootd/${item.ootdId}`}
      className={cn(
        'relative mb-2 block break-inside-avoid overflow-hidden rounded-md',
        item.archived && 'opacity-40', // 보관(ARCHIVED) 게시물은 흐리게
      )}
    >
      <img src={item.imageUrl} alt="" className="block h-auto w-full rounded-md" />
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
              <PostGridItem key={it.ootdId} item={it} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MyPostsFeed;
