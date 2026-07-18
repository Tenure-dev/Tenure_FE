import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CarouselSectionProps {
  title: string;
  subtitle: string;
  images: string[];
  ootdId: string;
}

const CarouselSection = ({ title, subtitle, images, ootdId }: CarouselSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="border-border-secondary border-b px-4 py-6">
      <div className="flex w-full items-start justify-between">
        <div>
          <h2 className="text-body-1 text-text-primary font-semibold">{title}</h2>
          <p className="text-body-4 text-text-tertiary mt-0.5">{subtitle}</p>
        </div>
        <ArrowRight size={18} className="text-text-tertiary mt-1 shrink-0" />
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => navigate(`/ootd/${ootdId}`)}
            className="shrink-0"
          >
            <img
              src={src}
              alt=""
              className="bg-gray-bg h-[140px] w-[110px] rounded-lg object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarouselSection;
