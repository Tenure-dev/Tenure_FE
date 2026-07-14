import { chatListFilters } from '../mock';
import cn from '@/shared/lib/cn';

type Props = {
  active: string;
  onChange: (filter: string) => void;
};

const ChatListFilter = ({ active, onChange }: Props) => {
  return (
    <div className="flex [scrollbar-width:none] gap-1 overflow-x-auto px-5 py-4 [-ms-overflow-style:none] md:px-6 [&::-webkit-scrollbar]:hidden">
      {chatListFilters.map((filter) => {
        const isActive = filter === active;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={cn(
              'text-body-2 shrink-0 rounded-full px-3 py-1.5 whitespace-nowrap',
              isActive
                ? 'bg-bg-black text-text-inverse font-medium'
                : 'bg-gray-bg font-regular text-text-secondary',
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default ChatListFilter;
