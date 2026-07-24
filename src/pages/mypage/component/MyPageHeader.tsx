import settings from '@/shared/assets/settings.svg';
import notification from '@/shared/assets/notification_inactive.svg';
import { useNavigate } from 'react-router-dom';

const MyPageHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-title-2">마이페이지</div>
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/notifications')}>
          <img src={notification} width={24} height={24} alt="알림" />
        </button>
        <button onClick={() => navigate('/settings')}>
          <img src={settings} width={24} height={24} alt="설정" />
        </button>
      </div>
    </div>
  );
};

export default MyPageHeader;
