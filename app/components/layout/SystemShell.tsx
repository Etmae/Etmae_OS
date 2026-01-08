import React, { useRef } from 'react';
import Taskbar from '../taskbar/Taskbar';
import { WindowsManager } from '../windows/WindowsManager';
import { useDesktopStore } from '../../state/useDesktopStore';
import { useLocation } from 'react-router-dom';

interface SystemShellProps {
  children: React.ReactNode;
  onLock?: () => void;
  onRestart?: () => void;
  onShutdown?: () => void;
}

export const SystemShell: React.FC<SystemShellProps> = ({ 
  children, 
  onLock, 
  onRestart, 
  onShutdown 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const backgroundImage = useDesktopStore((s) => s.backgroundImage);

  const location = useLocation();

  // 1. Define paths where the Taskbar MUST NOT appear
  const hideTaskbarPaths = ['/signin', '/lockscreen', '/'];
  
  // 2. Check if we are on an excluded screen
  const isExcluded = hideTaskbarPaths.includes(location.pathname);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-black selection:bg-blue-500/30">
      {/* 1. Global Background Layer */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000 pointer-events-none" 
        style={{ backgroundImage: `url(${backgroundImage})`, zIndex: 0 }}
      />

      {/* 2. Workspace Area */}
      <main 
        ref={scrollContainerRef}
        className={`relative w-full z-10 transition-all duration-300 ${
          isExcluded 
            ? 'h-full overflow-hidden' // Full screen for Lockscreen/Signin
            : 'flex-1 overflow-y-auto overflow-x-hidden' // Normal desktop workspace
        }`}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { 
              scrollContainer: scrollContainerRef 
            });
          }
          return child;
        })}
        
        {/* Only show WindowsManager on Desktop (non-excluded paths) */}
        {!isExcluded && <WindowsManager />}
      </main>

      {/* 3. Taskbar Layer */}
      {/* Logic: If excluded, height is 0. 
          If not excluded, height is h-12 (48px) to house the taskbar.
      */}
      <footer 
        className={`w-full shrink-0 z-50 transition-all duration-300 ${
          isExcluded ? 'h-0 opacity-0 pointer-events-none' : 'h-12 opacity-100'
        }`}
      >
        {!isExcluded && (
          <Taskbar 
            onLock={onLock}           
            onRestart={onRestart}
            onShutdown={onShutdown}
          />
        )}
      </footer>
    </div>
  );
};