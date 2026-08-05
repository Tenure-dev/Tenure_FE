import TagBubble, { type TagBubbleVariant } from '@/features/ootd/ui/TagBubble';

type Side = 'left' | 'right';

type Props = {
  title: string;
  status?: string; // 있으면 2줄
  side?: Side; // 꼬리 방향: 왼쪽 절반=left, 오른쪽 절반=right
  variant?: TagBubbleVariant; // 등록/편집: black / 미리보기: default
  className?: string;
};

// 카메라 플로우 어댑터. 말풍선은 항상 태그 지점 위(-translate-y-full)에 뜨므로 꼬리는 하단 모서리.
// side(좌/우) → TagBubble의 tail(bl/br)로 변환만 하고 비주얼은 TagBubble에 위임한다.
const TagMessage = ({ title, status, side = 'right', variant = 'default', className }: Props) => (
  <TagBubble
    title={title}
    status={status}
    tail={side === 'left' ? 'bl' : 'br'}
    variant={variant}
    className={className}
  />
);

export default TagMessage;
