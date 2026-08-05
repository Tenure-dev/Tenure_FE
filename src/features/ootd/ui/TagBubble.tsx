import { cn } from '@/shared/lib/cn';

// 꼬리(각진 모서리) 위치. 나머지 세 모서리는 둥글게 처리된다.
export type TagBubbleTail = 'bl' | 'br' | 'tl' | 'tr';
export type TagBubbleVariant = 'default' | 'black';

type Props = {
  title: string;
  status?: string; // 있으면 2줄
  statusClassName?: string; // status 줄 색 커스텀(예: 판매중 강조). 없으면 variant 기본색.
  tail: TagBubbleTail; // 태그 지점과 맞닿는 모서리 = 꼬리
  variant?: TagBubbleVariant; // 색만 다름: default(흰색) / black(편집용)
  selected?: boolean; // 편집 중 선택된 태그 강조(ring)
  className?: string;
};

// 태그 지점과 맞닿는 한 모서리만 뾰족하게(각지게) 남기고 나머지 세 모서리는 둥글게 → 그 뾰족 모서리가 꼬리
const CORNER: Record<TagBubbleTail, string> = {
  bl: 'rounded-tl-lg rounded-tr-lg rounded-br-lg',
  br: 'rounded-tl-lg rounded-tr-lg rounded-bl-lg',
  tl: 'rounded-tr-lg rounded-bl-lg rounded-br-lg',
  tr: 'rounded-tl-lg rounded-bl-lg rounded-br-lg',
};

// 게시글 상세(TagPin)·태그 편집(TagBBox)·미리보기(OotdPreviewPage)가 공유하는 말풍선 비주얼.
// 모양은 완전히 동일하고 variant로 색만 다르다. 위치·상호작용은 사용하는 쪽이 담당한다.
const TagBubble = ({
  title,
  status,
  statusClassName,
  tail,
  variant = 'default',
  selected = false,
  className,
}: Props) => {
  const isBlack = variant === 'black';
  return (
    <div
      className={cn(
        'inline-flex max-h-[72px] min-h-[52px] w-[168px] flex-col justify-center px-3 py-1.5 text-left shadow-md',
        CORNER[tail],
        isBlack
          ? 'border-brand-primary border bg-black/60'
          : 'border-border-primary bg-bg-white/60 border',
        selected && 'ring-brand ring-2',
        className,
      )}
    >
      <p
        className={cn(
          'text-body-3 truncate font-semibold',
          isBlack ? 'text-text-inverse' : 'text-text-primary',
        )}
      >
        {title}
      </p>
      {status && (
        <p
          className={cn(
            'text-body-4 truncate',
            statusClassName ?? (isBlack ? 'text-white/70' : 'text-text-secondary'),
          )}
        >
          #{status}
        </p>
      )}
    </div>
  );
};

export default TagBubble;
