import { EllipsisVertical } from 'lucide-react';
import BackHeader from '@/shared/components/BackHeader';

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
    <BackHeader
      title={name}
      onBack={onBack}
      rightActions={
        <button type="button" aria-label="더보기" onClick={onMenuClick}>
          <EllipsisVertical size={24} />
        </button>
      }
    />
  );
};

export default ChatRoomHeader;
