import { useNavigate } from 'react-router-dom';
import cn from '@/shared/lib/cn';
import { useMyPage } from '@/features/mypage/api/useMyPage';

const ProfileStats = () => {
  const navigate = useNavigate();
  const { data, isPending, isError } = useMyPage();

  // 로딩/에러 시에도 레이아웃이 흔들리지 않도록 자리를 유지한다
  const placeholder = isPending || isError;

  const stats = [
    { label: '피드', value: data?.feedCount, to: null },
    { label: '아이템', value: data?.itemCount, to: '/mypage/items' },
    { label: '위시', value: data?.wishCount, to: '/wishlist' },
    { label: '팔로워', value: data?.followerCount, to: '/mypage/follow?tab=followers' },
  ];

  return (
    <div className="flex p-4">
      {stats.map((stat, index) => (
        <button
          key={stat.label}
          type="button"
          onClick={() => stat.to && navigate(stat.to)}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5',
            index !== 0 && 'border-border-secondary border-l',
            !stat.to && 'cursor-default',
          )}
        >
          <span className={cn('text-title-3 font-medium', placeholder && 'text-text-disabled')}>
            {placeholder ? '-' : stat.value}
          </span>
          <span className="text-body-3 text-text-secondary">{stat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ProfileStats;
