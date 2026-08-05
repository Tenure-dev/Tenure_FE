import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { formatNotificationTime } from '../lib/groupByDate';
import type { NotificationItem } from '../model/types';

export interface NotificationRowProps {
  item: NotificationItem;
  onRead: (id: number) => void;
}

const TARGET_PATH: Partial<Record<NotificationItem['targetType'], (id: number) => string>> = {
  ITEM: (id) => `/item/${id}`,
  PRODUCT: (id) => `/item/${id}`,
  OOTD: (id) => `/ootd/${id}`,
  TRADE: (id) => `/trade/${id}`,
  CHAT: (id) => `/chat/${id}`,
  USER: (id) => `/users/${id}`,
  FOLLOW: (id) => `/users/${id}`,
  PURCHASE_OFFER: (id) => `/purchase/offer/${id}`,
  PURCHASE_INTENT: (id) => `/purchase/intent/${id}`,
};

const NotificationRow = ({ item, onRead }: NotificationRowProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onRead(item.id);
    const path = TARGET_PATH[item.targetType]?.(item.targetId);
    if (path) navigate(path);
  };

  const title =
    item.brandName && item.itemName
      ? `${item.brandName} / ${item.itemName}`
      : (item.senderUsername ?? '');

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-start gap-3 px-4 py-3 text-left"
    >
      <div className="relative shrink-0">
        <img
          src={item.imageUrl ?? profileDefault}
          alt=""
          className="bg-gray-bg size-11 rounded-full object-cover"
        />
        <span
          className={cn(
            'ring-bg-white absolute top-0 right-0 size-2.5 rounded-full ring-2',
            item.urgent ? 'bg-error' : 'bg-warning',
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-1 text-text-primary truncate font-semibold">{title}</p>
          <span className="text-body-3 text-text-tertiary shrink-0">
            {formatNotificationTime(item.createdAt)}
          </span>
        </div>
        <p className="text-body-2 text-text-secondary mt-0.5">{item.message}</p>
      </div>
    </button>
  );
};

export default NotificationRow;
