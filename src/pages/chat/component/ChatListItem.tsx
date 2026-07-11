import type { ChatRoom } from '@/features/chat/model/types';

const ChatListItem = ({ room }: { room: ChatRoom }) => {
  return (
    <div className="border-border-secondary flex items-center gap-3 border-b px-5 py-4">
      <img
        src={room.avatar}
        alt={room.name}
        className="size-12 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-body-1 font-medium">{room.name}</p>
        <p className="text-body-4 text-text-secondary truncate">{room.message}</p>
        <p className="text-body-4 text-text-tertiary mt-0.5 truncate font-medium">
          {room.product} · {room.date}
        </p>
      </div>
      {room.unread > 0 && (
        <span className="bg-error text-text-inverse flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium">
          {room.unread}
        </span>
      )}
    </div>
  );
};

export default ChatListItem;
