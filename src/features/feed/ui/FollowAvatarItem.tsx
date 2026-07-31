import { cn } from '@/shared/lib/cn';
import type { FollowedUser } from '@/features/feed/model/types';
import profileDefault from '@/shared/assets/profileDefault.svg';

export interface FollowAvatarItemProps {
  user: FollowedUser;
  selected: boolean;
  onSelect: (id: string) => void;
}

const FollowAvatarItem = ({ user, selected, onSelect }: FollowAvatarItemProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(String(user.userId))}
      className="flex w-15 shrink-0 flex-col items-center gap-1 md:w-19"
    >
      <img
        src={user.profileImageUrl || profileDefault}
        alt="followed user avatar"
        className={cn(
          'size-13 rounded-full object-cover ring-2 ring-offset-1 md:size-16',
          selected ? 'ring-brand' : 'ring-border-secondary',
        )}
      />
      <span
        className={cn(
          'text-body-4 w-full truncate text-center font-medium',
          selected ? 'text-text-primary' : 'text-text-secondary',
        )}
      >
        {user.username}
      </span>
    </button>
  );
};

export default FollowAvatarItem;
