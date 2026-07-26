import { userFeedByMonth } from '../mock';
import bookmark from '@/shared/assets/bookmark.svg';
import heart from '@/shared/assets/like.svg';

// 타인 프로필 피드: 월별 OOTD 그리드 (탭 없이 게시물만)
const UserFeed = () => {
  return (
    <div className="px-4 pb-6">
      {userFeedByMonth.map(({ month, items }) => (
        <section key={month} className="mt-5">
          <h2 className="text-title-2 mb-2 font-medium">{month}</h2>
          <div className="columns-[160px] gap-2">
            {items.map((it) => (
              <div
                key={it.id}
                className="relative mb-2 break-inside-avoid overflow-hidden rounded-md"
              >
                <img src={it.img} alt="" className="block h-auto w-full rounded-md" />
                <img
                  src={bookmark}
                  width={24}
                  height={24}
                  alt="북마크"
                  className="absolute right-2 bottom-2 brightness-0 drop-shadow invert"
                />
                <img
                  src={heart}
                  width={24}
                  height={24}
                  alt="좋아요"
                  className="absolute right-2 bottom-12 brightness-0 drop-shadow invert"
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default UserFeed;
