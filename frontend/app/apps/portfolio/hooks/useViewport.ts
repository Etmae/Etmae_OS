import { useState, useEffect } from 'react';

export const useViewport = () => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const updateViewport = () => {
      setViewportMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };
    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewportMode;
};