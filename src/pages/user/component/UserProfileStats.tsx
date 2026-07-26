import cn from '@/shared/lib/cn';
import { userProfile } from '../mock';

const stats = [
  { label: '피드', value: userProfile.stats.feed },
  { label: '아이템', value: userProfile.stats.item },
  { label: '팔로워', value: userProfile.stats.follower },
];

const UserProfileStats = () => {
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
          <span className="text-title-3 font-medium">{stat.value}</span>
          <span className="text-body-3 text-text-secondary">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default UserProfileStats;
