import { useState, useCallback } from 'react';

export const usePortfolioLoader = (loopTarget: number = 3) => {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('portfolio_intro_seen');
    }
    return true;
  });
  const [currentLoop, setCurrentLoop] = useState(1);

  const onVideoEnded = useCallback((video: HTMLVideoElement) => {
    if (currentLoop < loopTarget) {
      setCurrentLoop(prev => prev + 1);
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      sessionStorage.setItem('portfolio_intro_seen', 'true');
      setLoading(false);
    }
  }, [currentLoop, loopTarget]);

  return { loading, onVideoEnded };
};