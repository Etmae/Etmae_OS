import React, { useState, useCallback } from 'react';
import { DesktopIcon } from './DesktopIcon';
import { desktopIcons } from '../../data/desktopIcons';
import type { Position } from '../../common/desktopUtils';

interface DesktopGridProps {
  selectedIconIndex: number | null;
  onIconSelect: (index: number | null) => void;
  onIconClick: (route: string) => void;
}

export const DesktopGrid: React.FC<DesktopGridProps> = ({
  selectedIconIndex,
  onIconSelect,
  onIconClick
}) => {
  const [iconPositions, setIconPositions] = useState<Position[]>([
    { x: 32, y: 32 },
    { x: 32, y: 140 },
    { x: 32, y: 248 },
    { x: 32, y: 356 },
    { x: 32, y: 464 },
    { x: 32, y: 572 },
    { x: 32, y: 680 },
    { x: 32, y: 788 },
    { x: 32, y: 896 },
    
  ]);

  const updateIconPosition = useCallback((index: number, position: Position) => {
    setIconPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = position;
      return newPositions;
    });
  }, []);

  const handleDesktopClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
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
          key={index}
          index={index}
          icon={item.icon}
          label={item.label}
          isSelected={selectedIconIndex === index}
          onSelect={() => onIconSelect(index)}
          onClick={() => onIconClick(item.route)}
          position={iconPositions[index]}
          onPositionChange={(pos) => updateIconPosition(index, pos)}
        />
      ))}
    </div>
  );
};