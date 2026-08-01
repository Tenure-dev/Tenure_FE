import { useNavigate } from 'react-router-dom';
import { leftArrow } from '@/shared/assets';

export interface BackHeaderProps {
  title: string;
  rightActions?: React.ReactNode;
  onBack?: () => void;
}

const BackHeader = ({ title, rightActions, onBack }: BackHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-border-light bg-bg-white sticky top-0 z-20 flex min-h-[52px] items-start justify-between border-b px-4 py-[14px] md:px-6">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          aria-label="뒤로가기"
          className="shrink-0"
        >
          <img src={leftArrow} alt="" className="size-5" />
        </button>
        <h1 className="text-title-4 text-text-primary font-medium break-words">{title}</h1>
      </div>
      {rightActions && <div className="ml-2 flex shrink-0 items-center gap-2">{rightActions}</div>}
    </header>
  );
};

export default BackHeader;
