import { useNavigate } from 'react-router-dom';
import BackHeader from '@/shared/components/BackHeader';
import { Search, Settings } from 'lucide-react';

const ChatListHeader = ({ onBack }: { onBack?: () => void }) => {
  const navigate = useNavigate();

  return (
    <BackHeader
      title="채팅"
      onBack={onBack}
      rightActions={
        <>
          <button type="button" aria-label="검색">
            <Search size={24} />
          </button>

          <button type="button" onClick={() => navigate('/settings')}>
            <Settings size={24} aria-label="설정" />
          </button>
        </>
      }
    />
  );
};

export default ChatListHeader;
