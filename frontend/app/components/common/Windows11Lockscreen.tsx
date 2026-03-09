import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// LOCKSCREEN COMPONENT
// ============================================================================
interface LockscreenProps {
  backgroundImage?: string;
  onUnlock?: () => void;
}

export const Windows11Lockscreen: React.FC<LockscreenProps> = ({
  backgroundImage = 'https://wallpapercave.com/wp/wp10363825.jpg',
  onUnlock,
}) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    if (onUnlock) {
      // Use callback if provided (workflow mode)
      onUnlock();
    } else {
      // Fallback to navigation (standalone mode)
      navigate('/signin');
    }
  };


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleUnlock();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientY);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;

    if (diff > 50) handleUnlock();
    setTouchStart(null);
  };

  return (
    <div
      className="relative min-h-screen bg-blue-600 overflow-hidden cursor-pointer"
      onClick={handleUnlock}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col text-white px-4">
        {/* Time + Date */}
        <div className="flex flex-col items-center pt-20 sm:pt-24 md:pt-32">
          <div
            className="text-7xl sm:text-8xl md:text-9xl mb-1 tracking-tight"
            style={{
              fontFamily: 'Segoe UI, system-ui, sans-serif',
              fontWeight: 600,
            }}
          >
            {formatTime(currentTime)}
          </div>

          <div
            className="text-xl sm:text-2xl md:text-3xl"
            style={{
              fontFamily: 'Segoe UI, system-ui, sans-serif',
              fontWeight: 400,
            }}
          >
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Icons (Bottom Right) */}
        <div className="absolute bottom-5 sm:bottom-6 right-5 sm:right-6 flex items-center gap-3">
          <button className="text-white opacity-90 hover:opacity-100 transition-opacity">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </button>

          <button className="text-white opacity-90 hover:opacity-100 transition-opacity">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
              <line x1="22" y1="11" x2="22" y2="13" strokeLinecap="round" />
              <rect x="5" y="9.5" width="10" height="5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};















