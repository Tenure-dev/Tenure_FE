import { useNavigate } from 'react-router-dom';
import { leftArrow } from '@/shared/assets';

// shared/components/BackHeader와 레이아웃은 같지만, 구매/판매내역 타이틀만 볼드로 써야 해서
// title을 string으로만 받는 BackHeader 대신 로컬로 따로 둔다.
export interface HistoryHeaderProps {
  title: string;
}

const HistoryHeader = ({ title }: HistoryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-border-light bg-bg-white sticky top-0 z-20 flex h-[52px] items-center border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={leftArrow} alt="" className="size-5" />
        </button>
        <h1 className="text-title-4 text-text-primary translate-y-0.25 font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default HistoryHeader;
