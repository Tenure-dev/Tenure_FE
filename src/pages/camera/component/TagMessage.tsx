import { cn } from '@/shared/lib/cn';

type Side = 'left' | 'right';
type Variant = 'default' | 'black';

type Props = {
  title: string;
  status?: string; // 있으면 2줄
  side?: Side; // 뾰족 모서리(꼬리) 방향: 왼쪽 절반=left, 오른쪽 절반=right
  variant?: Variant; // 등록/편집: black / 미리보기: default
  className?: string;
};

// TagPin(게시글 상세)과 동일한 디자인. 색/테두리만 편집용으로 다르게.
const TagMessage = ({ title, status, side = 'right', variant = 'default', className }: Props) => {
  const isBlack = variant === 'black';

  // 태그 지점과 맞닿는 하단 모서리만 뾰족하게(각지게), 나머지 세 모서리는 둥글게 → 그 뾰족 모서리가 꼬리
  const cornerClass =
    side === 'left'
      ? 'rounded-tl-lg rounded-tr-lg rounded-br-lg'
      : 'rounded-tl-lg rounded-tr-lg rounded-bl-lg';

  return (
    <div
      className={cn(
        'inline-flex max-h-[72px] min-h-[52px] w-[168px] flex-col justify-center px-3 py-1.5 text-left shadow-md',
        cornerClass,
        isBlack ? 'border-brand-primary border bg-black/60' : 'bg-bg-white/60',
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
          className={cn('text-body-4 truncate', isBlack ? 'text-white/70' : 'text-text-secondary')}
        >
          #{status}
        </p>
      )}
    </div>
  );
};

export default TagMessage;
