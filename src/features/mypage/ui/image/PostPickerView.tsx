import { leftArrow } from '@/shared/assets';
import { useMyPosts } from '@/features/mypage/api/useMyFeed';

const MOCK_POSTS = Array.from({ length: 12 }, (_, i) => ({
  ootdId: i + 1,
  imageUrl: `https://picsum.photos/seed/postpicker${i + 1}/400/400`,
}));

export interface PostPickerViewProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

const PostPickerView = ({ open, onClose, onSelect }: PostPickerViewProps) => {
  const { data } = useMyPosts(open);
  const loaded = data?.pages.flatMap((page) => page.content) ?? [];
  const posts = loaded.length ? loaded : MOCK_POSTS;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col bg-white">
      <header className="border-border-light flex h-[52px] shrink-0 items-center gap-3 border-b px-4">
        <button type="button" onClick={onClose} aria-label="뒤로가기">
          <img src={leftArrow} alt="" className="size-5" />
        </button>
        <h2 className="text-title-4 text-text-primary translate-y-0.25 font-medium">나의 게시물</h2>
      </header>

      <div className="grid flex-1 grid-cols-2 gap-0.5 overflow-y-auto">
        {posts.map((post) => (
          <button
            key={post.ootdId}
            type="button"
            className="aspect-square w-full overflow-hidden"
            onClick={() => onSelect(post.imageUrl)}
          >
            <img src={post.imageUrl} alt="" className="size-full object-cover" />
          </button>
        ))}
        {posts.length === 0 && (
          <p className="text-body-2 text-text-disabled col-span-2 py-16 text-center">
            게시물이 없습니다
          </p>
        )}
      </div>
    </div>
  );
};

export default PostPickerView;
