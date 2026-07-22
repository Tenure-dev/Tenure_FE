import { FollowButton } from '@/shared/components';
import profileDefault from '@/shared/assets/profileDefault.svg';
import type { SearchUserResponse } from '../api/types';

export interface AccountResultRowProps {
  account: SearchUserResponse;
  onToggleFollow: (id: number) => void;
}

const formatCount = (count: number) => {
  if (count >= 10000) {
    const value = count / 10000;
    return `${Number.isInteger(value) ? value : value.toFixed(1)}만`;
  }
  return count.toLocaleString();
};

const AccountResultRow = ({ account, onToggleFollow }: AccountResultRowProps) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <img
        src={account.profileImageUrl || profileDefault}
        alt=""
        className="size-11 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-body-2 text-text-primary truncate font-semibold">{account.username}</p>
        <p className="text-body-4 text-text-tertiary truncate">
          팔로우 {formatCount(account.followerCount)}명 · 게시물 {account.ootdCount}개
        </p>
      </div>
      <FollowButton following={account.following} onToggle={() => onToggleFollow(account.id)} />
    </div>
  );
};

export default AccountResultRow;
