import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import chevron from '@/shared/assets/chevron-left.svg';
import type { Bbox } from '@/features/ootd/model/item';
import { usePublishOotd } from '@/features/ootd/api/usePublishOotd';
import { useOotdDraftStore } from '@/store/useOotdDraftStore';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import TagLoading from './component/TagLoading';
import TagBubble, { type TagBubbleTail } from '@/features/ootd/ui/TagBubble';

type Phase = 'loading' | 'preview';

// 태그작성에서 넘어온 태그 (실제 bbox 좌표 포함)
type PreviewTag = { itemId: number; bbox: Bbox; labelText: string };

const OotdPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { photo?: string; ootdId?: number; tags?: PreviewTag[] } | null;
  const photo = state?.photo ?? null;
  const ootdId = state?.ootdId;
  const tags = state?.tags ?? [];

  const [phase, setPhase] = useState<Phase>('loading');
  const { mutate: publish, isPending: posting } = usePublishOotd();
  const clearDraft = useOotdDraftStore((s) => s.clear);
  const { message: toast, show: showToast, hide: hideToast } = useToast();

  // 선택완료 후 로딩 → 미리보기
  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setTimeout(() => setPhase('preview'), 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  // 게시하기: 모아둔 태그를 batch로 일괄 등록 → confirm으로 공개 전환 → 상세로 이동.
  // ootdId는 태그 작성 진입 시 manual-tag로 미리 생성해 둔 값.
  const handlePost = () => {
    if (ootdId == null) return;
    publish(
      { ootdId, tags },
      {
        onSuccess: (id) => {
          clearDraft(); // 게시 완료 → 다음 촬영은 새 임시 OOTD로 시작
          navigate(`/ootd/${id}`, {
            state: { toast: '게시물이 등록되었습니다.', fromPublish: true },
          });
        },
        onError: () => showToast('게시에 실패했어요. 잠시 후 다시 시도해주세요.'),
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

        {/* 태그작성에서 지정한 실제 bbox 위치에 말풍선 표시.
            게시글(TagPin)·편집(TagBBox)과 동일하게 태그 지점에 꼬리를 붙이고 가장자리 반대로 펼친다. */}
        {tags.map((tag) => {
          const cxPct = (tag.bbox.x + tag.bbox.width / 2) * 100;
          const cyPct = (tag.bbox.y + tag.bbox.height / 2) * 100;
          const flipX = cxPct > 65;
          const flipY = cyPct < 25;
          const tail: TagBubbleTail = !flipY ? (flipX ? 'br' : 'bl') : flipX ? 'tr' : 'tl';
          return (
            <div
              key={tag.itemId}
              className="absolute"
              style={{
                left: `${cxPct}%`,
                top: `${cyPct}%`,
                transform: `translate(${flipX ? '-100%' : '0%'}, ${flipY ? '0%' : '-100%'})`,
              }}
            >
              <TagBubble title={tag.labelText} tail={tail} variant="black" />
            </div>
          );
        })}
      </div>
      {/* 여백을 위해 추가, 사진과 버튼 붙는걸 방지*/}
      <p className="text-body-3 text-warning p-4 text-center font-medium"></p>

      {/* 하단 버튼 (하단 고정) */}
      <div className="mt-auto flex gap-2 px-5 pb-6">
        <button
          type="button"
          onClick={() => navigate('/ootd/tag', { state: { photo, ootdId, tags } })}
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

      <Toast message={toast} onClose={hideToast} />
    </div>
  );
};

export default OotdPreviewPage;
