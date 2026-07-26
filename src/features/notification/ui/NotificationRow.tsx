import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { formatNotificationTime } from '../lib/groupByDate';
import type { NotificationItem } from '../model/types';

export interface NotificationRowProps {
  item: NotificationItem;
}

const NotificationRow = ({ item }: NotificationRowProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/item/${item.itemId}`)}
      className="flex w-full items-start gap-3 px-4 py-3 text-left"
    >
      <div className="relative shrink-0">
        <img src={item.imageUrl} alt="" className="bg-gray-bg size-11 rounded-full object-cover" />
        <span
          className={cn(
            'ring-bg-white absolute top-0 right-0 size-2.5 rounded-full ring-2',
            item.urgent ? 'bg-error' : 'bg-warning',
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-body-1 text-text-primary truncate font-semibold">
            {item.brand} / {item.name}
          </p>
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
