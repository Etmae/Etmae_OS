import React, { useState, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DesktopIconProps {
  appId: string; // Changed from 'index' to 'appId' to match your registry
  icon: React.ReactNode;
  label: string;
  onClick: () => void; // Triggered on Double Click
  isSelected?: boolean;
  onSelect?: () => void; // Triggered on Single Click
  position: Position;
  onPositionChange: (position: Position) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  appId,
  icon,
  label,
  onClick,
  isSelected = false,
  onSelect,
  position,
  onPositionChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click (button 0)
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    onSelect?.();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep icons within viewport bounds (minus taskbar)
      const maxX = window.innerWidth - 110;
      const maxY = window.innerHeight - 150;

      onPositionChange({
        x: Math.max(5, Math.min(newX, maxX)),
        y: Math.max(5, Math.min(newY, maxY))
      });
    }
  }, [isDragging, dragStart, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
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
      data-appid={appId}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
        zIndex: isSelected ? 50 : 10,
        transition: isDragging ? 'none' : 'all 0.15s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        // Windows standard: Launch only on Double Click
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
        className={`flex flex-col items-center gap-1.5 p-2 rounded-md group w-28 border border-transparent transition-all duration-200 ${
          isSelected 
            ? 'bg-white/10 border-white/20 backdrop-blur-md shadow-lg' 
            : 'hover:bg-white/5 hover:border-white/10'
        }`}
      >
        {/* Icon Container */}
        <div
          className="flex items-center justify-center transition-transform duration-200"
          style={{
            width: '40px',
            height: '40px',
            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
            filter: isSelected ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' : 'none'
          }}
        >
          {React.isValidElement(icon) && icon.type === 'img'
            ? React.cloneElement(icon as React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>, { 
                style: { width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }
              })
            : React.cloneElement(icon as React.ReactElement, { 
                size: 32,
                className: 'text-white pointer-events-none'
              } as any)
          }
        </div>

        {/* Label */}
        <span
          className={`text-[11px] text-center font-normal leading-tight px-1.5 py-0.5 rounded-sm transition-colors duration-200 ${
            isSelected ? 'bg-[#0078d4] text-white' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
          }`}
          style={{
            fontFamily: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};