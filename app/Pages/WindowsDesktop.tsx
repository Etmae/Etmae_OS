import React, { useState, useEffect } from 'react';
import { DesktopGrid } from '../components/desktop/DesktopGrid';
import Taskbar from '../components/taskbar/Taskbar';
import { WindowsManager } from '../components/windows/WindowsManager'; // New!

import { useClock } from '../hooks/useClock';
import { usePowerManagement } from '../hooks/usePowerManagement';
import { useDesktopStore } from '../state/useDesktopStore';
import { useThemeStore } from '../state/useThemeStore';
import { useWindowStore } from '../state/useWindowStore'; // New!

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
  
  // New: Grab the openWindow action from our Kernel
  const openWindow = useWindowStore((s) => s.openWindow);

  const { theme } = useThemeStore();
  const { darkBackgroundImage, lightBackgroundImage, setBackgroundImage } = useDesktopStore();

  useEffect(() => {
    const backgroundImage = theme === 'dark' ? darkBackgroundImage : lightBackgroundImage;
    setBackgroundImage(backgroundImage);
  }, [theme, darkBackgroundImage, lightBackgroundImage, setBackgroundImage]);

  // REPLACED: Instead of navigating to a new page, we open a window
  const handleIconClick = (appId: string) => {
    openWindow(appId); // appId should match keys in your APP_REGISTRY (e.g., 'terminal')
    setSelectedIconIndex(null); // Deselect icon after opening
  };

  const currentBackgroundImage = theme === 'dark' ? darkBackgroundImage : lightBackgroundImage;

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none" style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      {/* 1. Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ backgroundImage: `url(${currentBackgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* 2. Desktop Icons Layer */}
      <DesktopGrid
        selectedIconIndex={selectedIconIndex}
        onIconSelect={setSelectedIconIndex}
        onIconClick={handleIconClick} 
      />

      {/* 3. Window Management Layer (The DWM) */}
      <WindowsManager />

      {/* 4. Taskbar Layer */}
      <Taskbar />
    </div>
  );
};

export default Windows11Desktop;