import buy from '@/shared/assets/buy.svg';
import sell from '@/shared/assets/sell.svg';
import tag from '@/shared/assets/tag_inactive.svg';
import { Button } from '@/shared/components';
import { useNavigate } from 'react-router-dom';

const ProfileActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="36"
          className="text-body-2 w-full! flex-1"
          leftIcon={<img src={buy} width={18} height={18} alt="구매 내역" />}
          onClick={() => navigate('/purchase-history')}
        >
          구매 내역
        </Button>
        <Button
          variant="ghost"
          size="36"
          className="text-body-2 w-full! flex-1"
          leftIcon={<img src={sell} width={18} height={18} alt="판매 내역" />}
          onClick={() => navigate('/sales-history')}
        >
          판매 내역
        </Button>
      </div>
      <Button
        variant="solid"
        size="36"
        className="text-body-2 w-full!"
        leftIcon={<img src={tag} width={18} height={18} alt="태그 확인" />}
      >
        태그 확인
      </Button>
    </div>
  );
};

export default ProfileActions;
