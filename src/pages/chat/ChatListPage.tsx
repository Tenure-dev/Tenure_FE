import ChatListFilter from './component/ChatListFilter';
import ChatListHeader from './component/ChatListHeader';
import ChatListItem from './component/ChatListItem';
import { chatRooms } from './mock';

const ChatListPage = () => {
  return (
    <div className="bg-bg-white text-text-primary relative flex min-h-screen flex-col">
      <ChatListHeader />
      <ChatListFilter />
      <div>
        {chatRooms.map((room) => (
          <ChatListItem key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
