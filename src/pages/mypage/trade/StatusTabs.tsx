// 마이페이지 구매/판매내역 전용 탭 - shared/components/SegmentedControl과 구조는 같지만
// 활성 탭 표시가 brand(파란색)이 아니라 검은색(text-primary)이어야 해서 로컬로 따로 둔다.
export interface StatusTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const StatusTabs = ({ tabs, activeTab, onChange }: StatusTabsProps) => {
  return (
    <div className="bg-bg-white flex h-[42px] w-full">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`text-body-1 relative flex flex-1 items-center justify-center font-medium ${
              isActive ? 'text-text-primary' : 'text-text-secondary'
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

export default StatusTabs;
