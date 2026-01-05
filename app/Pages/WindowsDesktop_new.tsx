import React, { useState } from 'react';

// Components
import { DesktopGrid } from '../components/desktop/DesktopGrid';
import Taskbar from '../components/taskbar/Taskbar';

// Hooks
import { useClock } from '../hooks/useClock';
import { usePowerManagement } from '../hooks/usePowerManagement';

// Data
import { desktopIcons } from '../data/desktopIcons';
import { recentFiles } from '../data/recentFiles';

interface Windows11DesktopProps {
  onLock?: () => void;
  onRestart?: () => void;
  onShutdown?: () => void;
}

export const Windows11Desktop: React.FC<Windows11DesktopProps> = ({
  onLock,
  onRestart,
  onShutdown
}) => {
  const [selectedIconIndex, setSelectedIconIndex] = useState<number | null>(null);

  // Hooks
  const currentTime = useClock();
  const { handleLock, handleRestart, handleShutdown } = usePowerManagement({
    onLock,
    onRestart,
    onShutdown
  });

  const handleIconClick = (route: string) => {
    console.log(`Navigate to ${route}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://wallpapercave.com/wp/wp10363825.jpg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      <div className="absolute inset-0 bg-black/5" />

      {/* Desktop Grid with Icons */}
      <DesktopGrid
        selectedIconIndex={selectedIconIndex}
        onIconSelect={setSelectedIconIndex}
        onIconClick={handleIconClick}
      />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};

export default Windows11Desktop;













