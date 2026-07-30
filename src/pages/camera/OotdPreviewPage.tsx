import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import chevron from '@/shared/assets/chevron-left.svg';
import type { Bbox } from '@/features/ootd/model/item';
import { dataUrlToFile } from '@/shared/lib/dataUrlToFile';
import { usePublishOotd } from '@/features/ootd/api/usePublishOotd';
import TagLoading from './component/TagLoading';
import TagMessage from './component/TagMessage';

type Phase = 'loading' | 'preview';

// 태그작성에서 넘어온 태그 (실제 bbox 좌표 포함)
type PreviewTag = { itemId: number; bbox: Bbox; labelText: string };

const OotdPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { photo?: string; tags?: PreviewTag[] } | null;
  const photo = state?.photo ?? null;
  const tags = state?.tags ?? [];

  const [phase, setPhase] = useState<Phase>('loading');
  const { mutate: publish, isPending: posting } = usePublishOotd();

  // 선택완료 후 로딩 → 미리보기
  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setTimeout(() => setPhase('preview'), 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  // 게시하기: 이미지 게시 → ootdId 받고 → 태그 일괄 등록 → 상세로 이동
  const handlePost = () => {
    if (!photo) return;
    const image = dataUrlToFile(photo, 'ootd.jpg');
    publish(
      { image, tags },
      {
        onSuccess: (ootdId) => {
          navigate(`/ootd/${ootdId}`, { state: { toast: '게시물이 등록되었습니다.' } });
        },
        onError: (e) => console.error('[게시 실패]', e),
      },
    );
  };

  if (phase === 'loading' || posting) {
    return (
      <div className="bg-bg-white flex h-dvh w-full flex-col">
        <TagLoading />
      </div>
    );
  }

  return (
    <div className="bg-bg-white text-text-primary flex min-h-dvh w-full flex-col">
      {/* 헤더 */}
      <header className="flex items-center gap-3 px-5 py-4">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
          <img src={chevron} width={24} height={24} alt="뒤로가기" />
        </button>
        <h1 className="text-title-2 font-medium">게시물 미리보기</h1>
      </header>

      {/* 진행바 (마지막 단계) */}
      <div className="bg-bg-tertiary h-1 w-full">
        <div className="bg-brand size-full" />
      </div>

      {/* 사진 + 태그칩: 원본 비율 그대로 헤더 아래 (여백 없음) */}
      <div className="relative w-full">
        {photo && <img src={photo} alt="촬영한 사진" className="block w-full" />}

        {/* 태그작성에서 지정한 실제 bbox 위치에 말풍선 표시 */}
        {tags.map((tag) => (
          <div
            key={tag.itemId}
            className="absolute"
            style={{ left: `${tag.bbox.x * 100}%`, top: `${tag.bbox.y * 100}%` }}
          >
            <TagMessage
              title={tag.labelText}
              side={tag.bbox.x > 0.5 ? 'right' : 'left'}
              variant="black"
            />
          </div>
        ))}
      </div>
      {/* 여백을 위해 추가, 사진과 버튼 붙는걸 방지*/}
      <p className="text-body-3 text-warning p-4 text-center font-medium"></p>

      {/* 하단 버튼 (하단 고정) */}
      <div className="mt-auto flex gap-2 px-5 pb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-bg text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
        >
          태그 수정
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

export default OotdPreviewPage;
