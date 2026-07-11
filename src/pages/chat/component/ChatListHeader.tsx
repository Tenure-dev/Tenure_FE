import chevronLeft from '@/shared/assets/chevron-left.svg';
import search from '@/shared/assets/search.svg';
import settings from '@/shared/assets/settings.svg';

const ChatListHeader = () => {
  return (
    <header className="border-border-secondary flex items-center justify-between border-b px-5 py-4">
      <div className="flex items-center gap-3">
        <img src={chevronLeft} width={24} height={24} alt="뒤로가기" />
        <h1 className="text-title-1 font-medium">채팅</h1>
      </div>
      <div className="flex items-center gap-3">
        <img src={search} width={24} height={24} alt="검색" />
        <img src={settings} width={24} height={24} alt="설정" />
      </div>
    </header>
  );
};

export default ChatListHeader;
