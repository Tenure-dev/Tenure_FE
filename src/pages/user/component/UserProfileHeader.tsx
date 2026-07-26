import BackHeader from '@/shared/components/BackHeader';
import more from '@/shared/assets/more-userprofile.svg';

const UserProfileHeader = ({ onMoreClick }: { onMoreClick: () => void }) => (
  <BackHeader
    title=""
    rightActions={
      <button type="button" onClick={onMoreClick} aria-label="더보기">
        <img src={more} width={24} height={24} alt="" />
      </button>
    }
  />
);

export default UserProfileHeader;
