import { useEffect, useState } from 'react';

// style.css의 --breakpoint-md 값(600px)과 맞춰야 함
const WIDE_LAYOUT_QUERY = '(min-width: 600px)';

const useIsWideLayout = () => {
  const [isWideLayout, setIsWideLayout] = useState(
    () => window.matchMedia(WIDE_LAYOUT_QUERY).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(WIDE_LAYOUT_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsWideLayout(event.matches);

    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  return isWideLayout;
};

export default useIsWideLayout;
