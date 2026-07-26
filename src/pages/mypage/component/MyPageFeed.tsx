import type { FeedTab } from '@/features/mypage/api/useMyFeed';
import MyPostsFeed from './MyPostsFeed';
import ReactedFeed from './ReactedFeed';

type Props = {
  active: FeedTab;
};

const MyPageFeed = ({ active }: Props) => {
  if (active === '게시물') return <MyPostsFeed />;
  return <ReactedFeed tab={active} />;
};

export default MyPageFeed;
