import type { FollowedUser } from '@/features/feed/model/types';
import FollowAvatarItem from './FollowAvatarItem';

export interface FollowAvatarRowProps {
  users: FollowedUser[];
  selectedUserId: string | null;
  onSelect: (id: string) => void;
}

const FollowAvatarRow = ({ users, selectedUserId, onSelect }: FollowAvatarRowProps) => {
  return (
    <div className="no-scrollbar bg-bg-white flex gap-3 overflow-x-auto px-4 pt-3 pb-2 md:gap-6 md:px-6">
      {users.map((user) => (
        <FollowAvatarItem
          key={user.id}
          user={user}
          selected={user.id === selectedUserId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default FollowAvatarRow;
