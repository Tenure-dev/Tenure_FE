import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRelatedOotds } from '@/features/ootd/api/ootdApi';
import type { OotdRelatedCardResponse, OotdRelatedResponse } from '@/features/ootd/api/types';
import { cn } from '@/shared/lib/cn';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';

interface RelatedSectionProps {
  ootdId: number;
  title: string;
  subtitle: string;
  ootds: OotdRelatedCardResponse[];
}

// 가로 스크롤 목록이 너무 길어지지 않도록 6번째 카드까지만 보여주고,
// 그 자리를 블러 처리한 "더보기" 카드로 대체해 더보기 페이지로 유도한다.
const MAX_VISIBLE = 6;

const RelatedSection = ({ ootdId, title, subtitle, ootds }: RelatedSectionProps) => {
  const navigate = useNavigate();

  if (ootds.length === 0) return null;

  const handleMoreClick = () => {
    navigate(`/ootd/${ootdId}/related/more`, {
      state: {
        title,
        items: ootds.map((card) => ({ id: card.ootdId, imageUrl: card.imageUrl })),
      },
    });
  };

  const hasMore = ootds.length > MAX_VISIBLE;
  const visibleOotds = ootds.slice(0, MAX_VISIBLE);

  return (
    <div className="border-border-secondary border-b px-4 py-6">
      <button
        type="button"
        onClick={handleMoreClick}
        className="flex w-full items-start justify-between text-left"
      >
        <div>
          <h2 className="text-body-1 text-text-primary font-semibold">{title}</h2>
          <p className="text-body-4 text-text-tertiary mt-0.5">{subtitle}</p>
        </div>
        <ArrowRight size={18} className="text-text-tertiary mt-1 shrink-0" />
      </button>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {visibleOotds.map((card, index) => {
          const isMoreCard = hasMore && index === MAX_VISIBLE - 1;
          return (
            <button
              key={card.ootdId}
              type="button"
              onClick={() => (isMoreCard ? handleMoreClick() : navigate(`/ootd/${card.ootdId}`))}
              className="relative shrink-0"
            >
              <img
                src={resolveImageUrl(card.imageUrl)}
                alt=""
                className={cn(
                  'bg-gray-bg h-[140px] w-[110px] rounded-lg object-cover',
                  isMoreCard && 'blur-[2px] brightness-50',
                )}
              />
              {isMoreCard && (
                <span className="text-body-3 absolute inset-0 flex items-center justify-center font-semibold text-white">
                  더보기
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const RelatedOotdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ootdId = Number(id);

  const [related, setRelated] = useState<OotdRelatedResponse | null>(null);

  useEffect(() => {
    if (!Number.isFinite(ootdId)) return;
    getRelatedOotds(ootdId).then(setRelated);
  }, [ootdId]);

  return (
    <div className="bg-bg-white flex min-h-screen flex-col">
      <div className="bg-bg-white sticky top-0 z-10 flex items-center px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-text-primary" />
        </button>
      </div>

      <RelatedSection
        ootdId={ootdId}
        title="비슷한 무드 모아보기"
        subtitle="지금 본 착장과 어울리는 스타일을 추천해요."
        ootds={related?.similarMood ?? []}
      />

      {related?.sameItems.map((section) => (
        <RelatedSection
          key={section.itemId}
          ootdId={ootdId}
          title={`${section.brandName} / ${section.itemName}과 비슷한 스타일`}
          subtitle="같은 아이템이 태그된 다른 OOTD예요."
          ootds={section.ootds}
        />
      ))}

      <RelatedSection
        ootdId={ootdId}
        title="함께 참고하기 좋은 코디"
        subtitle="지금 스타일과 이어서 보기 좋은 코디예요."
        ootds={related?.recommended ?? []}
      />
    </div>
  );
};

export default RelatedOotdPage;
