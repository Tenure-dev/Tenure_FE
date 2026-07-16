import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockOotdPost } from '@/features/ootd/model/mocks';

interface RelatedSectionProps {
  title: string;
  subtitle: string;
  images: string[];
}

const RelatedSection = ({ title, subtitle, images }: RelatedSectionProps) => (
  <div className="border-border-secondary border-b px-4 py-6">
    <button type="button" className="flex w-full items-start justify-between text-left">
      <div>
        <h2 className="text-body-1 text-text-primary font-semibold">{title}</h2>
        <p className="text-body-4 text-text-tertiary mt-0.5">{subtitle}</p>
      </div>
      <ArrowRight size={18} className="text-text-tertiary mt-1 shrink-0" />
    </button>

    <div className="mt-4 flex gap-2 overflow-x-auto">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="bg-gray-bg h-[140px] w-[110px] shrink-0 rounded-lg object-cover"
        />
      ))}
    </div>
  </div>
);

// TODO(API 연동): 태그된 아이템과 같은 category의 상품을 서버에서 받아와 각 섹션 이미지로 채운다.
const buildMockImages = (seed: string) =>
  Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/300/400`);

const RelatedOotdPage = () => {
  const navigate = useNavigate();
  const post = mockOotdPost;

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
        images={buildMockImages('mood')}
      />

      {post.taggedItems.map((item) => (
        <RelatedSection
          key={item.id}
          title={`${item.brand} / ${item.name}과 비슷한 스타일`}
          subtitle={`비슷한 ${item.category} 스타일을 모아봤어요.`}
          images={buildMockImages(item.id)}
        />
      ))}

      <RelatedSection
        title="함께 참고하기 좋은 코디"
        subtitle="지금 스타일과 이어서 보기 좋은 코디예요."
        images={buildMockImages('coordi')}
      />
    </div>
  );
};

export default RelatedOotdPage;
