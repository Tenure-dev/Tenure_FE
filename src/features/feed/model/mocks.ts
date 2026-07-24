import type { FeedItem, FollowedUser } from './types';

export const mockFollowedUsers: FollowedUser[] = [
  { id: '1', name: 'seoyeon', avatarUrl: 'https://picsum.photos/seed/user-1/100/100' },
  { id: '2', name: 'seofjeofm...', avatarUrl: 'https://picsum.photos/seed/user-2/100/100' },
  { id: '3', name: '서연', avatarUrl: 'https://picsum.photos/seed/user-3/100/100' },
  { id: '4', name: 'dksdks', avatarUrl: 'https://picsum.photos/seed/user-4/100/100' },
  { id: '5', name: 'eunhye', avatarUrl: 'https://picsum.photos/seed/user-5/100/100' },
  { id: '6', name: 'tenure_official', avatarUrl: 'https://picsum.photos/seed/user-6/100/100' },
];

export const mockFeedItems: FeedItem[] = Array.from({ length: 14 }, (_, index) => ({
  id: `feed-${index}`,
  imageUrl: `https://picsum.photos/seed/feed-${index}/600/800`,
  liked: false,
  bookmarked: false,
  authorId: mockFollowedUsers[index % mockFollowedUsers.length].id,
}));
