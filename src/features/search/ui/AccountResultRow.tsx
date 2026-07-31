import { FollowButton } from '@/shared/components';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import type { SearchUserResponse } from '../api/types';

export interface AccountResultRowProps {
  account: SearchUserResponse;
  onToggleFollow: (id: number) => void;
  onClick: (id: number) => void;
}

const formatCount = (count: number) => {
  if (count >= 10000) {
    const value = count / 10000;
    return `${Number.isInteger(value) ? value : value.toFixed(1)}만`;
  }
  return count.toLocaleString();
};

const AccountResultRow = ({ account, onToggleFollow, onClick }: AccountResultRowProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(account.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(account.id);
      }}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <img
        src={resolveImageUrl(account.profileImageUrl) || profileDefault}
        alt=""
        className="size-11 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-body-2 text-text-primary truncate font-semibold">{account.username}</p>
        <p className="text-body-4 text-text-tertiary truncate">
          팔로우 {formatCount(account.followerCount)}명 · 게시물 {account.ootdCount}개
        </p>
      </div>
      <span onClick={(e) => e.stopPropagation()} className="inline-flex shrink-0">
        <FollowButton following={account.following} onToggle={() => onToggleFollow(account.id)} />
      </span>
    </div>
  );
};

export default AccountResultRow;
