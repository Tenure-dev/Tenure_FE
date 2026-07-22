import { ArrowRight } from 'lucide-react';
import profileDefault from '@/shared/assets/profileDefault.svg';
import type { SearchHomePopularUserResponse } from '../api/types';

export interface PopularUsersSectionProps {
  users: SearchHomePopularUserResponse[];
}

// "더보기" 목적지는 BE가 SearchHomePopularUserResponse에 followerCount/ootdCount를 추가할 때까지 보류.
const PopularUsersSection = ({ users }: PopularUsersSectionProps) => {
  return (
    <div className="border-border-secondary border-b px-4 py-6">
      <div className="flex w-full items-start justify-between">
        <div>
          <h2 className="text-body-1 text-text-primary font-semibold">인기 사용자</h2>
          <p className="text-body-4 text-text-tertiary mt-0.5">좋아요를 많이 받는 사용자예요.</p>
        </div>
        <ArrowRight size={18} className="text-text-tertiary mt-1 shrink-0" />
      </div>

      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto py-1">
        {users.map((user) => (
          <div key={user.id} className="flex w-15 shrink-0 flex-col items-center gap-1">
            <img
              src={user.profileImageUrl || profileDefault}
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
