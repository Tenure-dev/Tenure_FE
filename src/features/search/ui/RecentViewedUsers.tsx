import { X } from 'lucide-react';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import type { RecentViewedUser } from '../model/types';

export interface RecentViewedUsersProps {
  users: RecentViewedUser[];
  onRemove: (id: number) => void;
  onClearAll: () => void;
}

const RecentViewedUsers = ({ users, onRemove, onClearAll }: RecentViewedUsersProps) => {
  if (users.length === 0) return null;

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-body-1 text-text-primary font-semibold">최근 본 사용자</h2>
        <button type="button" onClick={onClearAll} className="text-body-3 text-text-tertiary">
          지우기
        </button>
      </div>

      <div className="divide-border-secondary mt-1 divide-y">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 py-3">
            <img
              src={resolveImageUrl(user.avatarUrl) || profileDefault}
              alt=""
              className="size-11 shrink-0 rounded-full object-cover"
            />
            <p className="text-body-2 text-text-primary min-w-0 flex-1 truncate font-semibold">
              {user.name}
            </p>
            <button
              type="button"
              onClick={() => onRemove(user.id)}
              aria-label={`${user.name} 삭제`}
              className="text-text-tertiary shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentViewedUsers;
