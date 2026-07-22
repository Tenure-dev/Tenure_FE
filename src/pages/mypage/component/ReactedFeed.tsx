import { useReactedOotds } from '@/features/mypage/api/useMyFeed';

type Props = {
  tab: '좋아요' | '저장';
};

// 좋아요·저장 탭: 응답에 날짜·카운트가 없어 월 구분 없이 썸네일만 그리드로 깐다.
const ReactedFeed = ({ tab }: Props) => {
  const { data, isPending, isError } = useReactedOotds(tab);

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

  return (
    <div className="px-4 pb-6">
      <div className="mt-5 columns-[160px] gap-2">
        {data.content.map((it) => (
          <div key={it.ootdId} className="mb-2 break-inside-avoid overflow-hidden rounded-md">
            <img src={it.imageUrl} alt="" className="block h-auto w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactedFeed;
