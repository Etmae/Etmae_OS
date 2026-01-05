import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Volume2, Battery, LayoutGrid, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Store & Data Imports
import { useWindowStore } from '../../state/useWindowStore';
import { taskbarApps } from '../../data/taskbarApps';
import { formatTime, formatDate } from '../../utils/datetime';

// Component Imports
import StartMenu from './StartMenu';
import WidgetsBoard from '../desktop/WidgetsBoard';
import QuickSettings from '../system/QuickSettings';
import NotificationCenter from '../desktop/NotificationCenter';
import Windows11Loader from '../common/Windows11Loader';

interface TaskbarAppProps {
  icon: React.ReactNode;
  label: string;
  appId: string; // Changed from 'route' to 'appId'
  isOpen: boolean;
  isFocused: boolean;
  onClick: () => void;
}

const TaskbarApp: React.FC<TaskbarAppProps> = ({ icon, label, isOpen, isFocused, onClick }) => (
  <button
    onClick={onClick}
    className={`relative p-2 rounded-md transition-all duration-200 group ${
      isFocused ? 'bg-white/15' : 'hover:bg-white/8'
    }`}
    title={label}
  >
    <div className={`transition-transform duration-200 ${isFocused ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    
    {/* The Indicator Dot/Line */}
    {isOpen && (
      <div
        className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${
          isFocused ? 'w-4 h-1 bg-[#0078d4]' : 'w-1 h-1 bg-white/50'
        }`}
      />
    )}
  </button>
);

const Taskbar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [widgetsOpen, setWidgetsOpen] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [systemAction, setSystemAction] = useState<'none' | 'shutdown' | 'restart'>('none');
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(100);

  const navigate = useNavigate();
  
  // --- Kernel Subscription ---
  const { windows, windowOrder, openWindow, focusWindow, toggleMinimize } = useWindowStore();
  const focusedWindowId = windowOrder[windowOrder.length - 1];

  // --- Clock Logic ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- App Click Handler (The Core OS Logic) ---
  const handleAppClick = (appId: string) => {
    // 1. Check if an instance of this app is already open
    const openInstances = Object.values(windows).filter(w => w.appId === appId);
    
    if (openInstances.length === 0) {
      // If not open, launch it
      openWindow(appId);
    } else {
      // If open, handle toggle logic
      const target = openInstances[0]; // For simplicity, target the first instance
      if (target.id === focusedWindowId && !target.isMinimized) {
        // If it's already focused and visible, minimize it
        toggleMinimize(target.id);
      } else {
        // Otherwise, focus/restore it
        focusWindow(target.id);
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {systemAction !== 'none' && <Windows11Loader mode={systemAction} duration={4000} />}
      </AnimatePresence>

      <QuickSettings quickSettingsOpen={quickSettingsOpen} setQuickSettingsOpen={setQuickSettingsOpen} brightness={brightness} setBrightness={setBrightness} volume={volume} setVolume={setVolume} />
      <NotificationCenter isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
      <StartMenu isOpen={startMenuOpen} onClose={() => setStartMenuOpen(false)} handleShutdown={() => setSystemAction('shutdown')} /* ...other props */ desktopIcons={[]} recentFiles={[]} powerMenuOpen={false} setPowerMenuOpen={function (open: boolean): void {
        throw new Error('Function not implemented.');
      } } handleLock={function (): void {
        throw new Error('Function not implemented.');
      } } handleRestart={function (): void {
        throw new Error('Function not implemented.');
      } } /* ...other props */ />

      <div className="fixed bottom-0 left-0 right-0 z-[9999] px-0 pb-0.5 select-none" data-taskbar>
        <div
          className="px-3 py-2 flex items-center justify-between"
          style={{
            background: 'rgba(30, 30, 30, 0.85)',
            backdropFilter: 'blur(30px) saturate(150%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            height: '48px',
          }}
        >
          {/* Left: Widgets */}
          <div className="flex items-center w-32">
             <button onClick={() => setWidgetsOpen(!widgetsOpen)} className="p-2 hover:bg-white/8 rounded-lg">
                <LayoutGrid size={20} className="text-white/80" />
             </button>
          </div>

          {/* Center: Start & Apps */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStartMenuOpen(!startMenuOpen)}
              className={`p-2 rounded-lg transition-all ${startMenuOpen ? 'bg-white/15' : 'hover:bg-white/8'}`}
            >
              <WindowsLogo active={startMenuOpen} />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* pinned and running apps */}
            {taskbarApps.map((app) => {
              const instances = Object.values(windows).filter(w => w.appId === app.appId);
              const isOpen = instances.length > 0;
              const isFocused = isOpen && instances.some(w => w.id === focusedWindowId);

              return (
                <TaskbarApp
                  key={app.appId}
                  icon={app.icon}
                  label={app.label}
                  appId={app.appId}
                  isOpen={isOpen}
                  isFocused={isFocused}
                  onClick={() => handleAppClick(app.appId)}
                />
              );
            })}
          </div>

          {/* Right: System Tray */}
          <div className="flex items-center gap-1 w-32 justify-end">
            <div className="flex items-center px-2 py-1 hover:bg-white/10 rounded-md cursor-default gap-2">
              <Wifi size={14} className="text-white/80" />
              <Volume2 size={14} className="text-white/80" />
              <Battery size={14} className="text-white/80" />
            </div>
            <div className="text-white text-[11px] text-right font-sans pr-1">
              <div>{formatTime(currentTime)}</div>
              <div className="opacity-60">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const WindowsLogo = ({ active }: { active: boolean }) => (
  <div className="w-5 h-5 grid grid-cols-2 gap-[2px]">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className={`rounded-sm ${active ? 'bg-blue-400' : 'bg-blue-500'}`} />
    ))}
  </div>
);

export default Taskbar;