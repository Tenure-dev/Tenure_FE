import chevronLeft from '@/shared/assets/chevron-left.svg';
import search from '@/shared/assets/search.svg';
import settings from '@/shared/assets/settings.svg';
import { useNavigate } from 'react-router-dom';

const ChatListHeader = ({ onBack }: { onBack?: () => void }) => {
  const navigate = useNavigate();
  return (
    <header className="border-border-secondary flex items-center justify-between border-b px-5 py-4">
      <div className="flex items-center gap-3">
        <button type="button" aria-label="뒤로가기" onClick={onBack}>
          <img src={chevronLeft} width={24} height={24} alt="뒤로가기" />
        </button>
        <h1 className="text-title-1 font-medium">채팅</h1>
      </div>
      <div className="flex items-center gap-3">
        <img src={search} width={24} height={24} alt="검색" />
        <button onClick={() => navigate('/settings')}>
          <img src={settings} width={24} height={24} alt="설정" />{' '}
        </button>
      </div>
    </header>
  );
};

export default ChatListHeader;
