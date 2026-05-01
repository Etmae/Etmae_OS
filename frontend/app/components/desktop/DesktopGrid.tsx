import React, { useState, useCallback, useEffect } from 'react';
import { DesktopIcon, type Position } from './DesktopIcon';
import { desktopIcons } from '../../data/desktopIcons';

interface DesktopGridProps {
  selectedIconIndex: number | null;
  onIconSelect: (index: number | null) => void;
  onIconClick: (appId: string) => void; 
}

export const DesktopGrid: React.FC<DesktopGridProps> = ({
  selectedIconIndex,
  onIconSelect,
  onIconClick
}) => {
  const [iconPositions, setIconPositions] = useState<Position[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Grid Constants
  const COLUMN_WIDTH = 100;
  const ROW_HEIGHT = 110;
  const TASKBAR_HEIGHT = 56;
  const MARGIN_TOP = 10;
  const MARGIN_LEFT = 10;

  const calculateGrid = useCallback(() => {
    const availableHeight = window.innerHeight - TASKBAR_HEIGHT - MARGIN_TOP;
    const maxRows = Math.floor(availableHeight / ROW_HEIGHT) || 1;

    return desktopIcons.map((_, i) => {
      const col = Math.floor(i / maxRows);
      const row = i % maxRows;
      return {
        x: MARGIN_LEFT + (col * COLUMN_WIDTH),
        y: MARGIN_TOP + (row * ROW_HEIGHT),
      };
    });
  }, []);

  // Initialize and handle window scaling/resizing
  useEffect(() => {
    setIconPositions(calculateGrid());
    setIsInitialized(true);

    const handleResize = () => {
      setIconPositions(prev => {
        const maxX = window.innerWidth - COLUMN_WIDTH;
        const maxY = window.innerHeight - TASKBAR_HEIGHT - ROW_HEIGHT;
        
        // Push icons back into view if scale change/resize hides them
        return prev.map(pos => ({
          x: Math.max(5, Math.min(pos.x, maxX)),
          y: Math.max(5, Math.min(pos.y, maxY))
        }));
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateGrid]);

  const updateIconPosition = useCallback((index: number, position: Position) => {
    setIconPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = position;
      return newPositions;
    });
  }, []);

  const handleDesktopClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const selectors = [
      '[data-desktop-icon]',
      '[data-taskbar]',
      '[data-start-menu]',
      '[data-quick-settings]',
      '[data-notification]'
    ];
    
    if (!selectors.some(selector => target.closest(selector))) {
      onIconSelect(null);
    }
  }, [onIconSelect]);

  useEffect(() => {
    window.addEventListener('click', handleDesktopClick);
    return () => window.removeEventListener('click', handleDesktopClick);
  }, [handleDesktopClick]);

  if (!isInitialized) return null;

  return (
    <div className="relative z-10 w-full h-[calc(100vh-56px)] overflow-hidden">
      {desktopIcons.map((item, index) => (
        <DesktopIcon
          key={item.appId}
          appId={item.appId}
          icon={item.icon}
          label={item.label}
          isSelected={selectedIconIndex === index}
          onSelect={() => onIconSelect(index)}
          onClick={() => onIconClick(item.appId)} 
          position={iconPositions[index]}
          onPositionChange={(pos) => updateIconPosition(index, pos)}
        />
      ))}
    </div>
  );
};