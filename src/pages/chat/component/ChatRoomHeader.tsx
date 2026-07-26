import chevronLeft from '@/shared/assets/chevron-left.svg';
import more from '@/shared/assets/more-userprofile.svg';

const ChatRoomHeader = ({
  name,
  onBack,
  onMenuClick,
}: {
  name: string;
  onBack?: () => void;
  onMenuClick?: () => void;
}) => {
  return (
    <header className="border-border-secondary flex items-center justify-between border-b px-5 py-4">
      <div className="flex items-center gap-3">
        <button type="button" aria-label="뒤로가기" onClick={onBack}>
          <img src={chevronLeft} width={24} height={24} alt="" />
        </button>
        <p className="text-title-2 font-medium">{name}</p>
      </div>
      <button type="button" aria-label="더보기" onClick={onMenuClick}>
        <img src={more} width={24} height={24} alt="더보기" />
      </button>
    </header>
  );
};

export default ChatRoomHeader;
