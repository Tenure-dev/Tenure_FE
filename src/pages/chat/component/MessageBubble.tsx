import type { ChatMessage } from '@/features/chat/model/types';

type Props = { message: ChatMessage; avatar: string; name: string };

const MessageBubble = ({ message, avatar, name }: Props) => {
  // 내 메시지 (오른쪽)
  if (message.mine) {
    return (
      <div className="flex items-end justify-end gap-1.5">
        <div className="flex flex-col items-end">
          {message.unread ? <span className="text-body-4 text-brand">{message.unread}</span> : null}
          <span className="text-body-4 text-text-tertiary">{message.time}</span>
        </div>
        <div className="flex max-w-[70%] flex-col items-end gap-1">
          {message.text && (
            <p className="bg-brand-pale text-body-2 font-regular rounded-2xl rounded-tr-sm px-3 py-2">
              {message.text}
            </p>
          )}
          {message.images && (
            <div className="flex flex-wrap justify-end gap-1">
              {message.images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt="첨부 이미지"
                  className="size-24 rounded-md object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 상대 메시지 (왼쪽)
  return (
    <div className="flex items-start gap-2">
      <img src={avatar} alt={name} className="size-8 shrink-0 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="text-body-3 text-text-secondary mb-1">{name}</p>
        <div className="flex items-end gap-1.5">
          <p className="bg-bg-white text-body-2 font-regular max-w-[70%] rounded-2xl rounded-tl-sm px-3 py-2">
            {message.text}
          </p>
          <span className="text-body-4 text-text-tertiary shrink-0">{message.time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
