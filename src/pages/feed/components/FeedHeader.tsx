import { bellActive, bellInactive, profileDefault } from '@/shared/assets';

export interface FeedHeaderProps {
  userName: string;
  avatarUrl?: string;
  hasUnreadNotification?: boolean;
  onNotificationClick?: () => void;
}

const FeedHeader = ({
  userName,
  avatarUrl,
  hasUnreadNotification = false,
  onNotificationClick,
}: FeedHeaderProps) => {
  return (
    <div className="bg-bg-white sticky top-0 z-20 flex items-center justify-between px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <img
          src={avatarUrl || profileDefault}
          alt="user avatar"
          className="size-9 rounded-full object-cover"
        />
        <span className="text-body-1 text-text-primary translate-y-0.5 font-semibold">
          안녕하세요 {userName}님!
        </span>
      </div>
      <button
        type="button"
        onClick={onNotificationClick}
        aria-label="알림"
        className="flex size-9 items-center justify-center"
      >
        <img
          src={hasUnreadNotification ? bellActive : bellInactive}
          alt="notification icon"
          className="size-6"
        />
      </button>
    </div>
  );
};

export default FeedHeader;
