import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRelatedOotds } from '@/features/ootd/api/ootdApi';
import type { OotdRelatedCardResponse, OotdRelatedResponse } from '@/features/ootd/api/types';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';

interface RelatedSectionProps {
  title: string;
  subtitle: string;
  ootds: OotdRelatedCardResponse[];
}

const RelatedSection = ({ title, subtitle, ootds }: RelatedSectionProps) => {
  const navigate = useNavigate();

  if (ootds.length === 0) return null;

  return (
    <div className="border-border-secondary border-b px-4 py-6">
      <button type="button" className="flex w-full items-start justify-between text-left">
        <div>
          <h2 className="text-body-1 text-text-primary font-semibold">{title}</h2>
          <p className="text-body-4 text-text-tertiary mt-0.5">{subtitle}</p>
        </div>
        <ArrowRight size={18} className="text-text-tertiary mt-1 shrink-0" />
      </button>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {ootds.map((card) => (
          <button
            key={card.ootdId}
            type="button"
            onClick={() => navigate(`/ootd/${card.ootdId}`)}
            className="shrink-0"
          >
            <img
              src={resolveImageUrl(card.imageUrl)}
              alt=""
              className="bg-gray-bg h-[140px] w-[110px] rounded-lg object-cover"
            />
          </button>
        ))}
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
    <div className="bg-bg-white mx-auto flex min-h-screen w-full max-w-md flex-col">
      <div className="bg-bg-white sticky top-0 z-10 flex items-center px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-text-primary" />
        </button>
      </div>

      <RelatedSection
        title="비슷한 무드 모아보기"
        subtitle="지금 본 착장과 어울리는 스타일을 추천해요."
        ootds={related?.similarMood ?? []}
      />

      {related?.sameItems.map((section) => (
        <RelatedSection
          key={section.itemId}
          title={`${section.brandName} / ${section.itemName}과 비슷한 스타일`}
          subtitle="같은 아이템이 태그된 다른 OOTD예요."
          ootds={section.ootds}
        />
      ))}

      <RelatedSection
        title="함께 참고하기 좋은 코디"
        subtitle="지금 스타일과 이어서 보기 좋은 코디예요."
        ootds={related?.recommended ?? []}
      />
    </div>
  );
};

export default RelatedOotdPage;
