import { useState } from 'react';

export interface FollowButtonProps {
  following: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const FollowButton = ({ following, onToggle, disabled = false }: FollowButtonProps) => {
  const [pressed, setPressed] = useState(false);

  const getClassName = () => {
    if (following) {
      if (pressed) {
        return 'bg-gray-press text-text-primary';
      }
      return 'bg-bg-200 text-text-primary';
    }

    if (disabled) {
      return 'bg-brand-light text-text-inverse';
    }

    return 'bg-brand text-text-inverse';
  };

  return (
    <button
      type="button"
      disabled={disabled && !following}
      onClick={onToggle}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={`inline-flex h-[28px] w-[62px] items-center justify-center rounded-[8px] font-sans text-[12px] font-semibold ${getClassName()} ${disabled && !following ? 'cursor-not-allowed' : ''}`}
    >
      {following ? '✓ 팔로잉' : '+ 팔로우'}
    </button>
  );
};

export default FollowButton;
