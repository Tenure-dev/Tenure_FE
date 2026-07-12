import { useState } from 'react';

const tabs = ['게시물', '좋아요', '저장'];

// 마이페이지 전용 탭 (공용 SegmentedControl과 달리 검정 밑줄 + 전체 폭)
const ProfileTabs = () => {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="mt-2 flex h-[42px] w-full px-4">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`text-body-1 relative flex flex-1 items-center justify-center font-semibold ${
              isActive ? 'text-text-primary' : 'text-text-tertiary'
            }`}
          >
            {tab}
            {isActive && (
              <span className="bg-text-primary absolute bottom-0 left-0 h-[2px] w-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
