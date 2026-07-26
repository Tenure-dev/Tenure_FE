import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import chevron from '@/shared/assets/chevron-left.svg';
import type { OotdItem } from '@/features/ootd/model/item';
import TagLoading from './component/TagLoading';
import TagMessage from './component/TagMessage';

type Phase = 'loading' | 'preview' | 'posting';

// 태그칩 배치 위치 (목업)
const CHIP_POS = ['right-4 top-6', 'left-4 top-1/2', 'right-6 bottom-24', 'left-5 bottom-10'];

const OotdPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { photo?: string; items?: OotdItem[] } | null;
  const photo = state?.photo ?? null;
  const items = state?.items ?? [];

  const [phase, setPhase] = useState<Phase>('loading');

  // 선택완료 후 로딩 → 미리보기
  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setTimeout(() => setPhase('preview'), 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  // 게시하기 후 로딩 → 상세로 이동 (상세는 별도 PR: /ootd/:id)
  useEffect(() => {
    if (phase !== 'posting') return;
    const timer = setTimeout(() => {
      navigate('/ootd/1', { state: { toast: '게시물이 등록되었습니다.' } });
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase, navigate]);

  if (phase === 'loading' || phase === 'posting') {
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

        {items.map((item, i) => {
          const pos = CHIP_POS[i % CHIP_POS.length];
          return (
            <TagMessage
              key={item.id}
              className={cn('absolute', pos)}
              title={`${item.brand} / ${item.name}`}
              status="판매중"
              side={pos.includes('left') ? 'left' : 'right'}
            />
          );
        })}
      </div>

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
          onClick={() => setPhase('posting')}
          className="bg-brand text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
        >
          게시하기
        </button>
      </div>
    </div>
  );
};

export default OotdPreviewPage;
