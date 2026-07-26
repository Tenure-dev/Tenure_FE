import type { NotificationItem } from '../model/types';

export interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDateLabel = (date: Date, now: Date) => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return '오늘';
  if (isSameDay(date, yesterday)) return '어제';
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const formatNotificationTime = (timestamp: number) =>
  new Date(timestamp)
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();

export const groupNotificationsByDate = (
  items: NotificationItem[],
  now: Date = new Date(),
): NotificationGroup[] => {
  const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);
  const groups: NotificationGroup[] = [];

  for (const item of sorted) {
    const label = formatDateLabel(new Date(item.createdAt), now);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  return groups;
};
