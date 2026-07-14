export interface SegmentedControlProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const SegmentedControl = ({ tabs, activeTab, onChange }: SegmentedControlProps) => {
  return (
    <div className="flex h-[42px] w-[375px]">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`relative flex flex-1 items-center justify-center font-sans text-[14px] font-semibold ${
              isActive ? 'text-text-primary' : 'text-text-secondary'
            }`}
          >
            {tab}
            {isActive && <span className="bg-brand absolute bottom-0 left-0 h-[2px] w-full" />}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
