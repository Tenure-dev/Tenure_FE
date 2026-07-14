import type { FeedItem, FollowedUser } from './types';

const RATIO_SEQUENCE: FeedItem['ratio'][] = [
  '3:4',
  '4:5',
  '1:1',
  '4:5',
  '3:4',
  '1:1',
  '4:5',
  '3:4',
  '1:1',
  '4:5',
  '3:4',
  '4:5',
  '1:1',
  '3:4',
];

export const mockFollowedUsers: FollowedUser[] = [
  { id: '1', name: 'seoyeon', avatarUrl: 'https://picsum.photos/seed/user-1/100/100' },
  { id: '2', name: 'seofjeofm...', avatarUrl: 'https://picsum.photos/seed/user-2/100/100' },
  { id: '3', name: '서연', avatarUrl: 'https://picsum.photos/seed/user-3/100/100' },
  { id: '4', name: 'dksdks', avatarUrl: 'https://picsum.photos/seed/user-4/100/100' },
  { id: '5', name: 'eunhye', avatarUrl: 'https://picsum.photos/seed/user-5/100/100' },
  { id: '6', name: 'tenure_official', avatarUrl: 'https://picsum.photos/seed/user-6/100/100' },
];

export const mockFeedItems: FeedItem[] = RATIO_SEQUENCE.map((ratio, index) => ({
  id: `feed-${index}`,
  imageUrl: `https://picsum.photos/seed/feed-${index}/600/800`,
  ratio,
  liked: false,
  bookmarked: false,
  authorId: mockFollowedUsers[index % mockFollowedUsers.length].id,
}));
