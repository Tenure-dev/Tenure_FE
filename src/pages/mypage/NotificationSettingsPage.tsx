import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Toggle } from '@/shared/components';
import { cn } from '@/shared/lib/cn';

type NotificationKey = 'chat' | 'interest' | 'follow' | 'notice' | 'marketing';

interface NotificationItem {
  key: NotificationKey;
  label: string;
  description: string;
  defaultValue: boolean;
}

interface RequiredNotificationItem {
  key: string;
  label: string;
  description: string;
}

const REQUIRED_ITEMS: RequiredNotificationItem[] = [
  {
    key: 'tradeRequest',
    label: '거래 요청',
    description: '상대방에게 거래 요청이 오면 알림을 받아요.',
  },
  {
    key: 'requestStatus',
    label: '요청 상태',
    description: '보낸 거래 요청의 수락/거절 상태를 알려드려요.',
  },
  {
    key: 'requestAutoCancel',
    label: '요청 자동 취소',
    description: '거래 요청이 자동으로 취소되면 알려드려요.',
  },
  {
    key: 'tradeStatus',
    label: '거래 상태',
    description: '진행 중인 거래의 상태가 바뀌면 알려드려요.',
  },
];

const ACTIVITY_ITEMS: NotificationItem[] = [
  {
    key: 'chat',
    label: '채팅 알림',
    description: '상대방에게 새 채팅이 오면 알림을 받아요.',
    defaultValue: true,
  },
  {
    key: 'interest',
    label: '관심 아이템',
    description: '관심 등록한 아이템의 가격 변동이나 거래 상태를 알려드려요.',
    defaultValue: true,
  },
  {
    key: 'follow',
    label: '팔로우 알림',
    description: '누군가 나를 팔로우하면 알림을 받아요.',
    defaultValue: false,
  },
];

const SERVICE_ITEMS: NotificationItem[] = [
  {
    key: 'notice',
    label: '서비스 소식',
    description: '공지사항과 서비스 운영 관련 소식을 받아요.',
    defaultValue: false,
  },
  {
    key: 'marketing',
    label: '혜택 및 마케팅',
    description: '이벤트와 혜택 등 광고성 정보를 받아요.',
    defaultValue: false,
  },
];

const NotificationRow = ({
  label,
  description,
  on,
  onToggle,
  disabled = false,
}: {
  label: string;
  description: string;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3 border-b border-[#F0F0F0] p-[16px]">
    <div className="flex flex-col gap-1">
      <p className="text-[14px] font-semibold text-[#111111]">{label}</p>
      <p className="text-[12px] leading-[1.5] text-[#767676]">{description}</p>
    </div>
    <div
      className={cn('shrink-0', disabled && 'pointer-events-none opacity-40')}
      aria-disabled={disabled}
    >
      <Toggle checked={on} onChange={onToggle} />
    </div>
  </div>
);

const NotificationSettingsPage = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<NotificationKey, boolean>>(() => {
    const initial = {} as Record<NotificationKey, boolean>;
    [...ACTIVITY_ITEMS, ...SERVICE_ITEMS].forEach((item) => {
      initial[item.key] = item.defaultValue;
    });
    return initial;
  });

  const toggle = (key: NotificationKey) => setValues((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center border-b border-[#F0F0F0] px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">알림 설정</h1>
      </header>

      <p className="px-[16px] pt-[24px] pb-[8px] text-[12px] text-[#767676]">필수</p>
      {REQUIRED_ITEMS.map((item) => (
        <NotificationRow
          key={item.key}
          label={item.label}
          description={item.description}
          on
          onToggle={() => {}}
          disabled
        />
      ))}

      <p className="px-[16px] pt-[24px] pb-[8px] text-[12px] text-[#767676]">활동 알림</p>
      {ACTIVITY_ITEMS.map((item) => (
        <NotificationRow
          key={item.key}
          label={item.label}
          description={item.description}
          on={values[item.key]}
          onToggle={() => toggle(item.key)}
        />
      ))}

      <p className="px-[16px] pt-[24px] pb-[8px] text-[12px] text-[#767676]">서비스 알림</p>
      {SERVICE_ITEMS.map((item) => (
        <NotificationRow
          key={item.key}
          label={item.label}
          description={item.description}
          on={values[item.key]}
          onToggle={() => toggle(item.key)}
        />
      ))}
    </div>
  );
};

export default NotificationSettingsPage;
