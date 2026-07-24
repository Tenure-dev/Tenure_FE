import { Link } from 'react-router-dom';
import { useReactedOotds } from '@/features/mypage/api/useMyFeed';
import { useRemoveReaction } from '@/features/mypage/api/useRemoveReaction';
import heartActive from '@/shared/assets/heart-active.svg';
import saveActive from '@/shared/assets/save-active.svg';

type Props = {
  tab: '좋아요' | '저장';
};

// 좋아요·저장 탭: 응답에 날짜·카운트가 없어 월 구분 없이 썸네일만 그리드로 깐다.
// 오버레이 아이콘을 누르면 좋아요/저장을 취소한다(DELETE).
const ReactedFeed = ({ tab }: Props) => {
  const { data, isPending, isError } = useReactedOotds(tab);
  const { mutate: remove, isPending: isRemoving } = useRemoveReaction(tab);

  if (isPending)
    return <p className="text-body-3 text-text-secondary px-4 py-10 text-center">불러오는 중…</p>;
  if (isError)
    return (
      <p className="text-body-3 text-text-secondary px-4 py-10 text-center">
        목록을 불러오지 못했어요.
      </p>
    );
  if (data.content.length === 0)
    return (
      <p className="text-body-3 text-text-secondary px-4 py-10 text-center">
        {tab === '좋아요' ? '좋아요한 게시물이 없어요.' : '저장한 게시물이 없어요.'}
      </p>
    );

  const icon = tab === '좋아요' ? heartActive : saveActive;
  const iconLabel = tab === '좋아요' ? '좋아요 취소' : '저장 취소';

  return (
    <div className="px-4 pb-6">
      <div className="mt-5 columns-[160px] gap-2">
        {data.content.map((it) => (
          <Link
            key={it.ootdId}
            to={`/ootd/${it.ootdId}`}
            className="relative mb-2 block break-inside-avoid overflow-hidden rounded-md"
          >
            <img src={it.imageUrl} alt="" className="block h-auto w-full rounded-md" />
            <button
              type="button"
              aria-label={iconLabel}
              disabled={isRemoving}
              onClick={(e) => {
                // 아이콘 클릭은 상세 이동 막고 취소만 실행
                e.preventDefault();
                remove(it.ootdId);
              }}
              className="absolute right-2 bottom-2 disabled:opacity-50"
            >
              <img src={icon} width={24} height={24} alt="" className="drop-shadow" />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReactedFeed;
