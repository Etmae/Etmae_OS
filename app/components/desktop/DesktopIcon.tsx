import React, { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  index: number;
  position: Position;
  onPositionChange: (position: Position) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon,
  label,
  onClick,
  isSelected = false,
  onSelect,
  index,
  position,
  onPositionChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.detail === 1) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      onSelect?.();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 120;

      onPositionChange({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging, dragStart, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      data-desktop-icon
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'pointer',
        userSelect: 'none',
        zIndex: isSelected ? 50 : 10,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (e.detail === 2) {
          onClick();
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <div
        className="flex flex-col items-center gap-1.5 p-2 rounded-md transition-all w-28"
        style={{
          backgroundColor: isSelected ? 'rgba(0, 120, 212, 0.35)' : 'transparent',
          outline: isSelected ? '2px solid rgba(0, 120, 212, 0.7)' : 'none',
          boxShadow: isSelected ? '0 4px 12px rgba(0, 120, 212, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)' : 'none',
        }}
      >
        <div
          className="text-white transition-transform duration-200"
          style={{
            filter: isSelected
              ? 'drop-shadow(0 4px 8px rgba(0, 120, 212, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))'
              : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.isValidElement(icon) && icon.type === 'img'
            ? icon
            : React.cloneElement(icon as React.ReactElement, { size: 32 } as any)
          }
        </div>
        <span
          className="text-white text-xs text-center font-normal leading-tight px-1 py-0.5 rounded"
          style={{
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            textShadow: isSelected
              ? '0 1px 3px rgba(0, 120, 212, 0.6), 0 1px 2px rgba(0, 0, 0, 0.6)'
              : '0 1px 2px rgba(0, 0, 0, 0.5)',
            backgroundColor: isSelected ? 'rgba(0, 120, 212, 0.5)' : 'transparent',
            pointerEvents: 'none',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
