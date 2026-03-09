import React from 'react';
import { useWindowStore, type WindowLayout } from '../../state/useWindowStore';

export const SnapLayouts: React.FC<{ 
  windowId: string; 
  onClose: () => void;
  buttonRect: DOMRect | null;
}> = ({ windowId, onClose, buttonRect }) => {
  const snapWindow = useWindowStore((s) => s.snapWindow);

  if (!buttonRect) return null;

  const handleSelect = (layout: WindowLayout) => {
    snapWindow(windowId, layout);
    onClose();
  };

  return (
    <div 
      className="fixed bg-[#2c2c2c] rounded-lg shadow-2xl border border-white/10 p-4 z-9999 animate-in fade-in zoom-in duration-150"
      style={{ 
        width: '260px',
        top: `${buttonRect.bottom + 8}px`,
        left: `${buttonRect.right - 260}px`
      }}
      onMouseLeave={onClose}
    >
      <div className="text-[11px] font-medium text-gray-400 mb-3 uppercase tracking-wider">Snap Layouts</div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Full Snap */}
        <SnapButton 
          onClick={() => handleSelect('maximized')}
          activeZones={[true]}
          label="Maximize"
        />

        {/* Floating Snap */}
        <SnapButton 
          onClick={() => handleSelect('floating')}
          activeZones={[false]}
          innerClass="w-1/2 h-1/2 m-auto"
          label="Restore"
        />

        {/* Split Left */}
        <SnapButton 
          onClick={() => handleSelect('snap-left')}
          activeZones={[true, false]}
          label="Left Half"
        />

        {/* Split Right */}
        <SnapButton 
          onClick={() => handleSelect('snap-right')}
          activeZones={[false, true]}
          label="Right Half"
        />
      </div>
    </div>
  );
};

// Sub-component for the visual icons
const SnapButton = ({ onClick, activeZones, innerClass = "", label }: any) => (
  <button
    onClick={onClick}
    title={label}
    className="aspect-3/2 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-md transition-all p-1.5 flex gap-1 group"
  >
    {activeZones.length === 1 ? (
        <div className={`w-full h-full bg-white/20 group-hover:bg-blue-400 rounded-sm transition-colors ${innerClass}`} />
    ) : (
        activeZones.map((active: boolean, i: number) => (
            <div key={i} className={`flex-1 rounded-sm transition-colors ${active ? 'bg-white/20 group-hover:bg-blue-400' : 'bg-white/5'}`} />
        ))
    )}
  </button>
);