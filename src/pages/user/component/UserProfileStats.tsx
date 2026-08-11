import { useNavigate } from 'react-router-dom';
import cn from '@/shared/lib/cn';

const stats = [{ label: '피드' }, { label: '아이템' }, { label: '팔로워' }] as const;
type Props = { feed: number; item: number; follower: number; userId: number; username: string };

const UserProfileStats = ({ feed, item, follower, userId, username }: Props) => {
  const navigate = useNavigate();
  const value: Record<string, number> = { 피드: feed, 아이템: item, 팔로워: follower };

  const goFollowList = () => {
    // 팔로워 클릭 → 해당 유저의 팔로우 목록 (팔로워 탭). 제목용 이름은 state로 전달.
    navigate(`/users/${userId}/follow?tab=followers`, { state: { username } });
  };

  return (
    <div className="flex p-4">
      {stats.map((stat, index) => {
        const isFollower = stat.label === '팔로워';
        return (
          <button
            key={stat.label}
            type="button"
            onClick={isFollower ? goFollowList : undefined}
            disabled={!isFollower}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5',
              index !== 0 && 'border-border-secondary border-l',
              isFollower && 'cursor-pointer',
            )}
          >
            <span className="text-title-3 font-medium">{value[stat.label]}</span>
            <span className="text-body-3 text-text-secondary">{stat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default UserProfileStats;
