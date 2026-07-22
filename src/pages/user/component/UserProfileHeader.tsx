import { useNavigate } from 'react-router-dom';
import chevronLeft from '@/shared/assets/chevron-left.svg';
import more from '@/shared/assets/more-userprofile.svg';

type Props = {
  onMoreClick: () => void;
};

const UserProfileHeader = ({ onMoreClick }: Props) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
        <img src={chevronLeft} width={24} height={24} alt="" />
      </button>
      <button type="button" onClick={onMoreClick} aria-label="더보기">
        <img src={more} width={24} height={24} alt="" />
      </button>
    </header>
  );
};

export default UserProfileHeader;
