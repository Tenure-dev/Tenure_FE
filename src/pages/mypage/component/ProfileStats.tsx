import { useNavigate } from 'react-router-dom';
import cn from '@/shared/lib/cn';
import { profile } from '../mock';

const stats = [
  { label: '피드', value: profile.stats.feed, to: null },
  { label: '아이템', value: profile.stats.item, to: '/mypage/items' },
  { label: '위시', value: profile.stats.wish, to: null },
  { label: '팔로워', value: profile.stats.follower, to: null },
];

const ProfileStats = () => {
  const navigate = useNavigate();

  return (
    <div className="flex p-4">
      {stats.map((stat, index) => (
        <button
          key={index}
          type="button"
          onClick={() => stat.to && navigate(stat.to)}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5',
            index !== 0 && 'border-border-secondary border-l',
            !stat.to && 'cursor-default',
          )}
        >
          <span className="text-title-3 font-medium">{stat.value}</span>
          <span className="text-body-3 text-text-secondary">{stat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ProfileStats;
