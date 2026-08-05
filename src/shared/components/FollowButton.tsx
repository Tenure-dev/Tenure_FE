import { useState } from 'react';
import cn from '@/shared/lib/cn';

export interface FollowButtonProps {
  following: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const FollowButton = ({ following, onToggle, disabled = false }: FollowButtonProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled && !following}
      onClick={onToggle}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={cn(
        'inline-flex h-[32px] w-[69px] items-center justify-center rounded-[8px] font-sans text-[12px] font-semibold',
        following
          ? pressed
            ? 'border-text-tertiary bg-gray-press text-text-primary border-2'
            : 'bg-bg-200 border-text-tertiary text-text-primary border-1'
          : disabled
            ? 'bg-brand-light text-text-inverse cursor-not-allowed'
            : 'bg-brand text-text-inverse',
      )}
    >
      {following ? '✓ 팔로잉' : '+ 팔로우'}
    </button>
  );
};

export default FollowButton;
