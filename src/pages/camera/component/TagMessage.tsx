import { cn } from '@/shared/lib/cn';
import dL52 from '@/shared/assets/tag-message/tag-message-left-52.svg';
import dL72 from '@/shared/assets/tag-message/tag-message-left-72.svg';
import dR52 from '@/shared/assets/tag-message/tag-message-right-52.svg';
import dR72 from '@/shared/assets/tag-message/tag-message-right-72.svg';
import bL52 from '@/shared/assets/tag-message/tag-message-black-left-52.svg';
import bL72 from '@/shared/assets/tag-message/tag-message-black-left-72.svg';
import bR52 from '@/shared/assets/tag-message/tag-message-black-right-52.svg';
import bR72 from '@/shared/assets/tag-message/tag-message-black-right-72.svg';

type Side = 'left' | 'right';
type Variant = 'default' | 'black';

type Props = {
  title: string;
  status?: string; // 있으면 72(2줄), 없으면 52(1줄)
  side?: Side;
  variant?: Variant; // 등록 페이지: black / 미리보기: default
  className?: string;
};

// [variant][side][size]
const SRC = {
  default: { left: { 52: dL52, 72: dL72 }, right: { 52: dR52, 72: dR72 } },
  black: { left: { 52: bL52, 72: bL72 }, right: { 52: bR52, 72: bR72 } },
} as const;

const TagMessage = ({ title, status, side = 'right', variant = 'default', className }: Props) => {
  const size: 52 | 72 = status ? 72 : 52;
  const src = SRC[variant][side][size];
  const isBlack = variant === 'black';

  return (
    <div className={cn('relative inline-block', className)}>
      {/* max-w-none: 부모(작은 bbox 박스) 폭에 맞춰 줄어들지 않게 → 항상 원본 크기 고정 */}
      <img src={src} alt="" className="block max-w-none" />
      <div className="absolute inset-0 flex flex-col justify-center px-4">
        <p
          className={cn(
            'text-body-4 truncate font-semibold',
            isBlack ? 'text-text-inverse' : 'text-text-primary',
          )}
        >
          {title}
        </p>
        {status && (
          <p
            className={cn(
              'text-body-4 truncate',
              isBlack ? 'text-white/70' : 'text-text-secondary',
            )}
          >
            #{status}
          </p>
        )}
      </div>
    </div>
  );
};

export default TagMessage;
