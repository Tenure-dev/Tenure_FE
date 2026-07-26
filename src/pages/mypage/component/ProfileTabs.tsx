import { FEED_TABS, type FeedTab } from '@/features/mypage/api/useMyFeed';

type Props = {
  active: FeedTab;
  onChange: (tab: FeedTab) => void;
};

const ProfileTabs = ({ active, onChange }: Props) => {
  return (
    <div className="mt-2 flex h-[42px] w-full px-4">
      {FEED_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
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
