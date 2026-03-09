import React, { useState, useCallback } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { desktopIcons } from '../../data/desktopIcons';
import type { Position } from '../../common/desktopUtils';

interface DesktopGridProps {
  selectedIconIndex: number | null;
  onIconSelect: (index: number | null) => void;
  // Renamed parameter to appId for clarity
  onIconClick: (appId: string) => void; 
}

export const DesktopGrid: React.FC<DesktopGridProps> = ({
  selectedIconIndex,
  onIconSelect,
  onIconClick
}) => {
  // Using the same initial positions from your existing logic
  const [iconPositions, setIconPositions] = useState<Position[]>([
    { x: 0, y: 20 },
    { x: 0, y: 120 },
    { x: 0, y: 220 },
    { x: 0, y: 320 },
    { x: 0, y: 420 },
    { x: 0, y: 520 },
    { x: 0, y: 620 },
    { x: 100, y: 20 },
    { x: 100, y: 120 },
  ])

  const updateIconPosition = useCallback((index: number, position: Position) => {
    setIconPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = position;
      return newPositions;
    });
  }, []);

  const handleDesktopClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Standard Windows behavior: clicking the wallpaper deselects icons
    if (!target.closest('[data-desktop-icon]') &&
        !target.closest('[data-taskbar]') &&
        !target.closest('[data-start-menu]') &&
        !target.closest('[data-quick-settings]') &&
        !target.closest('[data-notification]')) {
      onIconSelect(null);
    }
  }, [onIconSelect]);

  React.useEffect(() => {
    window.addEventListener('click', handleDesktopClick);
    return () => window.removeEventListener('click', handleDesktopClick);
  }, [handleDesktopClick]);

  return (
    <div className="relative z-10 w-full h-full">
      {desktopIcons.map((item, index) => (
        <DesktopIcon
          key={item.appId} // Unique appId is a better key than index
          appId={item.appId}
          icon={item.icon}
          label={item.label}
          isSelected={selectedIconIndex === index}
          onSelect={() => onIconSelect(index)}
          // Pass the appId back up to the WindowsManager
          onClick={() => onIconClick(item.appId)} 
          position={iconPositions[index]}
          onPositionChange={(pos) => updateIconPosition(index, pos)}
        />
      ))}
    </div>
  );
};