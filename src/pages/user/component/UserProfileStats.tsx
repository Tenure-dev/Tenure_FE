import cn from '@/shared/lib/cn';

const stats = [{ label: '피드' }, { label: '아이템' }, { label: '팔로워' }];
type Props = { feed: number; item: number; follower: number };

const UserProfileStats = ({ feed, item, follower }: Props) => {
  return (
    <div className="flex p-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5',
            index !== 0 && 'border-border-secondary border-l',
          )}
        >
          <span className="text-title-3 font-medium">
            {stat.label === '피드' && feed}
            {stat.label === '아이템' && item}
            {stat.label === '팔로워' && follower}
          </span>
          <span className="text-body-3 text-text-secondary">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default UserProfileStats;
