import settings from '@/shared/assets/settings.svg';
import notificationActive from '@/shared/assets/notification-active.svg';
import notificationInactive from '@/shared/assets/notification-inactive.svg';
import { useNavigate } from 'react-router-dom';
import { useHasUnreadNotifications } from '@/features/notification/api/useHasUnreadNotifications';

const MyPageHeader = () => {
  const navigate = useNavigate();
  const { data: hasUnread } = useHasUnreadNotifications();
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-title-2">마이페이지</div>
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/notifications')}>
          <img
            src={hasUnread ? notificationActive : notificationInactive}
            width={24}
            height={24}
            alt={hasUnread ? '읽지 않은 알림 있음' : '알림'}
          />
        </button>
        <button onClick={() => navigate('/settings')}>
          <img src={settings} width={24} height={24} alt="설정" />
        </button>
      </div>
    </div>
  );
};

export default MyPageHeader;
