import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Volume2, Battery, LayoutGrid, Maximize2, Minimize2, FileText, Clock, Shield } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Store & Data Imports
import { useWindowStore } from '../../state/useWindowStore';
import { taskbarApps } from '../../data/taskbarApps';
import { formatTime, formatDate } from '../../utils/datetime';
import { enterFullScreen, exitFullScreen } from '../../utils/fullscreen';

// Component Imports
import StartMenu from './StartMenu';
import WidgetsBoard from '../desktop/WidgetsBoard';
import QuickSettings from '../system/QuickSettings';
import NotificationCenter from '../desktop/NotificationCenter';
import Windows11Loader from '../common/Windows11Loader';

// --- Types ---
interface TaskbarProps {
  onLock?: () => void;
  onRestart?: () => void;
  onShutdown?: () => void;
}

// --- Sub-Components ---
const TaskbarApp: React.FC<{
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isFocused: boolean;
  onClick: () => void;
}> = ({ icon, label, isOpen, isFocused, onClick }) => (
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
    {isOpen && (
      <div
        className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${
          isFocused ? 'w-4 h-1 bg-[#0078d4]' : 'w-1 h-1 bg-white/50'
        }`}
      />
    )}
  </button>
);

const WindowsLogo = ({ active }: { active: boolean }) => (
  <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
    {[1, 2, 3, 4].map(i => (
      <div 
        key={i} 
        className={`rounded-sm transition-colors duration-300 ${active ? 'bg-[#00a3ee]' : 'bg-[#0078d4]'}`} 
      />
    ))}
  </div>
);

// --- Main Component ---
const Taskbar: React.FC<TaskbarProps> = ({ onLock, onRestart, onShutdown }) => {
  // UI State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [widgetsOpen, setWidgetsOpen] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  
  // Settings & System State
  const [systemAction, setSystemAction] = useState<'none' | 'shutdown' | 'restart'>('none');
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(100);

  const navigate = useNavigate();
  const widgetHoverTimeout = useRef<number | null>(null);
  
  // Window Store logic
  const { windows, windowOrder, openWindow, focusWindow, toggleMinimize } = useWindowStore();
  const focusedWindowId = windowOrder[windowOrder.length - 1];

  // Mock data for Recommended section in Start Menu
  const recentFiles = [
    { name: 'Project_Proposal.docx', time: '17m ago', icon: <FileText size={16} className="text-blue-400" /> },
    { name: 'System_Architecture.png', time: '2h ago', icon: <Shield size={16} className="text-purple-400" /> },
    { name: 'Meeting_Notes.txt', time: 'Yesterday', icon: <Clock size={16} className="text-gray-400" /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      clearInterval(timer);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // --- Core Handlers ---
  const handleAppClick = (appId: string) => {
    const openInstances = Object.values(windows).filter(w => w.appId === appId);
    if (openInstances.length === 0) {
      openWindow(appId);
    } else {
      const target = openInstances[0];
      if (target.id === focusedWindowId && !target.isMinimized) {
        toggleMinimize(target.id);
      } else {
        focusWindow(target.id);
      }
    }
  };

  const handlePowerAction = (type: 'shutdown' | 'restart') => {
    setSystemAction(type);
    setStartMenuOpen(false);
    setPowerMenuOpen(false);
    setTimeout(() => {
      if (type === 'shutdown') onShutdown?.();
      else onRestart?.();
    }, 4000);
  };

  const handleLockAction = () => {
    setStartMenuOpen(false);
    setPowerMenuOpen(false);
    onLock ? onLock() : navigate('/signin');
  };

  const isSystemOverlayActive = systemAction !== 'none';

  return (
    <>
      <AnimatePresence>
        {isSystemOverlayActive && (
          <div className="fixed inset-0 z-10000 bg-black">
             <Windows11Loader mode={systemAction} duration={4000} />
          </div>
        )}
      </AnimatePresence>

      {!isSystemOverlayActive && (
        <>
          <QuickSettings 
            quickSettingsOpen={quickSettingsOpen} setQuickSettingsOpen={setQuickSettingsOpen} 
            brightness={brightness} setBrightness={setBrightness} 
            volume={volume} setVolume={setVolume} 
          />
          
          <NotificationCenter isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />

          <WidgetsBoard
            widgetsOpen={widgetsOpen}
            keepWidgetsOpen={() => {
              if (widgetHoverTimeout.current) window.clearTimeout(widgetHoverTimeout.current);
              setWidgetsOpen(true);
            }}
            scheduleWidgetsClose={() => {
              widgetHoverTimeout.current = window.setTimeout(() => setWidgetsOpen(false), 200);
            }}
          />

          <StartMenu 
            isOpen={startMenuOpen} 
            onClose={() => { setStartMenuOpen(false); setPowerMenuOpen(false); }} 
            desktopIcons={taskbarApps} // Maps taskbar apps to Start Menu pinned section
            recentFiles={recentFiles}
            powerMenuOpen={powerMenuOpen}
            setPowerMenuOpen={setPowerMenuOpen}
            handleShutdown={() => handlePowerAction('shutdown')}
            handleRestart={() => handlePowerAction('restart')}
            handleLock={handleLockAction}
            onAppClick={(appId) => handleAppClick(appId)} // Ensures Start Menu apps actually open
          />
        </>
      )}

      <footer 
        className={`fixed bottom-0 left-0 right-0 z-9999 px-0 pb-0.5 select-none transition-opacity duration-500 ${
          isSystemOverlayActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`} 
        data-taskbar
      >
        <div className="px-3 py-2 flex items-center justify-between"
          style={{
            background: 'rgba(30, 30, 30, 0.85)',
            backdropFilter: 'blur(30px) saturate(150%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            height: '48px',
          }}
        >
          {/* Left: Widgets */}
          <div className="flex items-center w-40">
            <button 
              onClick={() => setWidgetsOpen(!widgetsOpen)}
              className={`p-2 rounded-lg transition-all ${widgetsOpen ? 'bg-white/15' : 'hover:bg-white/8'}`}
            >
              <LayoutGrid size={20} className="text-white/80" />
            </button>
          </div>

          {/* Center: Start & Apps */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setStartMenuOpen(!startMenuOpen); setPowerMenuOpen(false); }}
              className={`p-2 rounded-lg transition-all ${startMenuOpen ? 'bg-white/15' : 'hover:bg-white/8'}`}
            >
              <WindowsLogo active={startMenuOpen} />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {taskbarApps.map((app) => {
              const instances = Object.values(windows).filter(w => w.appId === app.appId);
              const isOpen = instances.length > 0;
              const isFocused = isOpen && instances.some(w => w.id === focusedWindowId);

              return (
                <TaskbarApp
                  key={app.appId}
                  icon={app.icon}
                  label={app.label}
                  isOpen={isOpen}
                  isFocused={isFocused}
                  onClick={() => handleAppClick(app.appId)}
                />
              );
            })}
          </div>

          {/* Right: System Tray */}
          <div className="flex items-center gap-1 w-40 justify-end">
            <button 
              onClick={() => (!isFullscreen ? enterFullScreen() : exitFullScreen())}
              className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <div className="w-px h-6 bg-white/10 mx-0.5" />

            <button 
              onClick={() => setQuickSettingsOpen(!quickSettingsOpen)}
              className={`flex items-center px-2 py-1 rounded-md transition-colors gap-2 ${quickSettingsOpen ? 'bg-white/15' : 'hover:bg-white/10'}`}
            >
              <Wifi size={14} className="text-white/80" />
              <Volume2 size={14} className="text-white/80" />
              <Battery size={14} className="text-white/80" />
            </button>

            <button 
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`px-2 py-1 rounded-md transition-colors text-right ${notificationOpen ? 'bg-white/15' : 'hover:bg-white/10'}`}
            >
              <div className="text-white text-[11px] font-sans leading-tight">
                <div>{formatTime(currentTime)}</div>
                <div className="opacity-60 text-[10px]">{formatDate(currentTime)}</div>
              </div>
            </button>
            <div className="w-0.5 h-full ml-1 border-l border-white/10 hover:bg-white/10 transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Taskbar;