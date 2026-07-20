import { useNavigate } from 'react-router-dom';
import { leftArrow } from '@/shared/assets';

export interface BackHeaderProps {
  title: string;
  rightActions?: React.ReactNode;
}

const BackHeader = ({ title, rightActions }: BackHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-border-light bg-bg-white sticky top-0 z-20 flex h-[52px] items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={leftArrow} alt="" className="size-5" />
        </button>
        <h1 className="text-title-4 text-text-primary translate-y-0.25 font-medium">{title}</h1>
      </div>
      {rightActions && <div className="flex items-center gap-2">{rightActions}</div>}
    </header>
  );
};

export default BackHeader;
