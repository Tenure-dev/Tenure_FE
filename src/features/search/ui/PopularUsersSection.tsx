import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import type { SearchHomePopularUserResponse } from '../api/types';

export interface PopularUsersSectionProps {
  users: SearchHomePopularUserResponse[];
}

const PopularUsersSection = ({ users }: PopularUsersSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="border-border-secondary border-b px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('/search/popular-users')}
        className="flex w-full items-start justify-between text-left"
      >
        <div>
          <h2 className="text-body-1 text-text-primary font-semibold">인기 사용자</h2>
          <p className="text-body-4 text-text-tertiary mt-0.5">좋아요를 많이 받는 사용자예요.</p>
        </div>
        <ArrowRight size={18} className="text-text-tertiary mt-1 shrink-0" />
      </button>

      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto py-1">
        {users.map((user) => (
          <div key={user.id} className="flex w-15 shrink-0 flex-col items-center gap-1">
            <img
              src={resolveImageUrl(user.profileImageUrl) || profileDefault}
              alt={user.username}
              className="ring-border-secondary size-13 rounded-full object-cover ring-2 ring-offset-1"
            />
            <span className="text-body-4 text-text-secondary w-full truncate text-center font-medium">
              {user.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularUsersSection;
