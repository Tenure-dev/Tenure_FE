import { useEffect, useState } from 'react';

/**
 * 모바일 키보드가 뜨면 visualViewport 높이가 줄어드는 것을 추적한다.
 * 반환값(px)을 컨테이너 height에 적용하면 입력창이 키보드 위로 올라오고,
 * 키보드가 닫히면 원래 높이로 복원된다. (미지원 환경/데스크탑은 null)
 */
export function useVisualViewportHeight() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setHeight(vv.height);
      // iOS가 포커스 시 window를 위로 스크롤하는 것을 되돌려 레이아웃을 고정
      window.scrollTo(0, 0);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return height;
}

export default useVisualViewportHeight;
