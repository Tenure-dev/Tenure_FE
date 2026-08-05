import type { PercentRect } from '@/shared/hooks/useTapBox';

export type SpotlightBoxProps = {
  rect: PercentRect; // 0~100, top-left + size
  className?: string;
};

// 선택 영역만 밝게 남기고 나머지를 어둡게: 부모의 overflow-hidden 경계로 잘리는
// 초대형 box-shadow를 이용해 별도 마스크 레이어 없이 스포트라이트 효과를 낸다.
const SpotlightBox = ({ rect, className }: SpotlightBoxProps) => (
  <div
    className={`pointer-events-none absolute rounded-md border-2 border-black ${className ?? ''}`}
    style={{
      left: `${rect.x}%`,
      top: `${rect.y}%`,
      width: `${rect.width}%`,
      height: `${rect.height}%`,
      boxShadow: '0 0 0 100vmax rgba(0, 0, 0, 0.55)',
    }}
  />
);

export default SpotlightBox;
