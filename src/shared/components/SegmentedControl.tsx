export interface SegmentedControlProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const SegmentedControl = ({ tabs, activeTab, onChange }: SegmentedControlProps) => {
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
            {isActive && <span className="bg-brand absolute bottom-0 left-0 h-[2px] w-full" />}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
