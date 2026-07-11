import cn from '@/shared/lib/cn';
import { profile } from '../mock';

const stats = [
  { label: '피드', value: profile.stats.feed },
  { label: '아이템', value: profile.stats.item },
  { label: '위시', value: profile.stats.wish },
  { label: '팔로워', value: profile.stats.follower },
];

const ProfileStats = () => {
  return (
    <div className="flex p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
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

export default ProfileStats;
