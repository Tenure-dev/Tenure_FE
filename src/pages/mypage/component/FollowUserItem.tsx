import { profileDefault } from '@/shared/assets';
import FollowButton from '@/shared/components/FollowButton';

interface FollowUserItemProps {
  userId: number;
  username: string;
  profileImageUrl: string | null;
  following: boolean;
  onToggle: (userId: number, following: boolean) => void;
  disabled?: boolean;
}

const FollowUserItem = ({
  userId,
  username,
  profileImageUrl,
  following,
  onToggle,
  disabled,
}: FollowUserItemProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <img
        src={profileImageUrl ?? profileDefault}
        alt={username}
        className="size-12 rounded-full object-cover"
      />
      <span className="text-body-1 text-text-primary flex-1 font-medium">{username}</span>
      <FollowButton
        following={following}
        onToggle={() => onToggle(userId, following)}
        disabled={disabled}
      />
    </div>
  );
};

export default FollowUserItem;
