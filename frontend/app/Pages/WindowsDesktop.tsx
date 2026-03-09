import React, { useEffect } from 'react';
import { DesktopGrid } from '../components/desktop/DesktopGrid';
import { useWindowStore } from '../state/useWindowStore';
import { useDesktopStore } from '../state/useDesktopStore'; // Import the desktop store

export const Windows11Desktop: React.FC = () => {
  const [selectedIconIndex, setSelectedIconIndex] = React.useState<number | null>(null);
  const openWindow = useWindowStore((s) => s.openWindow);
  
  // 1. Pull the background image from your store
  const backgroundImage = useDesktopStore((s) => s.backgroundImage);

  // 2. Immersive Mode Check (Logic moved from utility to component)
  useEffect(() => {
    const isFullscreenAvailable = document.fullscreenEnabled || 
                                  (document as any).webkitFullscreenEnabled;
  }, []);

  const handleIconClick = (appId: string) => {
    openWindow(appId);
    setSelectedIconIndex(null);
  };

  return (
    <div 
      className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700"
      style={{ 
        // 3. Apply the background image here
        backgroundImage: `url(${backgroundImage})`,
        // Ensures the desktop stays fixed behind windows
        position: 'fixed',
        inset: 0,
        zIndex: -1 
      }}
    >
      <DesktopGrid
        selectedIconIndex={selectedIconIndex}
        onIconSelect={setSelectedIconIndex}
        onIconClick={handleIconClick} 
      />
    </div>
  );
};

export default Windows11Desktop;