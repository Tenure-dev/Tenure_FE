import { ArrowRight } from 'lucide-react';
import type { PopularUser } from '../model/mocks';

export interface PopularUsersSectionProps {
  users: PopularUser[];
}

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

      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto">
        {users.map((user) => (
          <div key={user.id} className="flex w-15 shrink-0 flex-col items-center gap-1">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="ring-border-secondary size-13 rounded-full object-cover ring-2 ring-offset-1"
            />
            <span className="text-body-4 text-text-secondary w-full truncate text-center font-medium">
              {user.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularUsersSection;
