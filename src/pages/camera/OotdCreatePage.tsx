import { useLocation, useNavigate } from 'react-router-dom';
import chevon from '@/shared/assets/chevron-left.svg';
import TagLoading from './component/TagLoading';
import { useCreateOotd } from '@/features/ootd/api/useCreateOotd';
import { dataUrlToFile } from '@/shared/lib/dataUrlToFile';

const OotdCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photo = (location.state as { photo?: string } | null)?.photo ?? null;
  const { mutate: createOotd, isPending } = useCreateOotd();

  const handlePost = () => {
    if (!photo) return;
    const image = dataUrlToFile(photo, 'ootd.jpg');
    createOotd(image, {
      onSuccess: () => {
        navigate('/feed', { state: { toast: '게시되었습니다.' } });
      },
      onError: () => {
        navigate('/feed', { state: { toast: '게시에 실패하였습니다.' } });
      },
    });
  };

  if (isPending) {
    return (
      <div className="bg-bg-white flex h-dvh w-full flex-col">
        <TagLoading title="태그를 작성할 준비를 하고 있어요!" subtitle="잠시만 기다려 주세요!" />
      </div>
    );
  }

  return (
    <div className="bg-bg-white text-text-primary flex min-h-dvh flex-col">
      {/* 헤더 */}
      <header className="flex items-center gap-3 px-5 py-4">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
          <img src={chevon} width={24} height={24} alt="뒤로가기" />
        </button>
        <h1 className="text-title-2 font-medium">새 게시물 작성</h1>
      </header>

      {/* 진행바 */}
      <div className="bg-bg-tertiary h-1 w-full">
        <div className="bg-brand h-full w-1/3" />
      </div>

      {/* 사진: 원본 비율 그대로 헤더 아래에 붙임 (여백 없음) */}
      {photo ? (
        <img src={photo} alt="촬영한 사진" className="block w-full" />
      ) : (
        <div className="bg-gray-bg flex aspect-square items-center justify-center">
          <span className="text-body-3 text-text-secondary">사진이 없어요</span>
        </div>
      )}

      {/* 안내 문구 (사진 바로 아래) */}
      <p className="text-body-3 text-warning p-4 text-center font-medium">
        게시하기를 누르면 사진 속 아이템이 자동으로 태그돼요.
      </p>

      {/* 하단 버튼 (하단 고정) */}
      <div className="mt-auto flex gap-2 px-5 pb-6">
        <button
          type="button"
          onClick={() => navigate('/ootd/tag', { state: { photo } })}
          className="bg-gray-bg text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
        >
          태그 작성
        </button>
        <button
          type="button"
          onClick={handlePost}
          className="bg-brand text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
        >
          게시하기
        </button>
      </div>
    </div>
  );
};

export default OotdCreatePage;
