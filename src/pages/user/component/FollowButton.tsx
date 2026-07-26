import cn from '@/shared/lib/cn';

type Props = {
  following: boolean;
  onToggle: () => void;
};

const FollowButton = ({ following, onToggle }: Props) => {
  return (
    <div className="px-4">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'text-btn-2 flex h-9 w-full items-center justify-center gap-1 rounded-md font-semibold',
          following ? 'bg-bg-secondary text-text-primary' : 'bg-brand text-text-inverse',
        )}
      >
        {following ? '팔로잉' : '+ 팔로우'}
      </button>
    </div>
  );
};

export default FollowButton;
