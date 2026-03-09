import { useEffect, useState } from 'react';

type ViewportMode = 'mobile' | 'tablet' | 'desktop';

interface ViewportInfo {
  width: number;
  mode: ViewportMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useViewport(): ViewportInfo {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mode: ViewportMode =
    width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';

  return {
    width,
    mode,
    isMobile: mode === 'mobile',
    isTablet: mode === 'tablet',
    isDesktop: mode === 'desktop',
  };
}

