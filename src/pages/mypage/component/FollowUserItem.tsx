import { Link } from 'react-router-dom';
import { profileDefault } from '@/shared/assets';
import FollowButton from '@/shared/components/FollowButton';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';

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
      {/* 아바타·이름 클릭 → 해당 유저 프로필로 이동 (팔로우 버튼은 별도) */}
      <Link to={`/users/${userId}`} className="flex min-w-0 flex-1 items-center gap-3">
        <img
          src={resolveFileUrl(profileImageUrl) || profileDefault}
          alt={username}
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <span className="text-body-1 text-text-primary truncate font-medium">{username}</span>
      </Link>
      <FollowButton
        following={following}
        onToggle={() => onToggle(userId, following)}
        disabled={disabled}
      />
    </div>
  );
};

export default FollowUserItem;
