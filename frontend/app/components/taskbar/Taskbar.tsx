import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi, Volume2, Battery,
  Maximize2, Minimize2, FileText, Clock,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Store & Data Imports
import { useWindowStore } from '../../state/useWindowStore';
import { taskbarApps } from '../../data/taskbarApps';
import { APP_REGISTRY } from '../../apps/registry';
import { formatTime, formatDate } from '../../utils/datetime';
import { enterFullScreen, exitFullScreen } from '../../utils/fullscreen';

// Component Imports
import StartMenu from './StartMenu';
import WidgetsBoard from '../desktop/WidgetsBoard';
import QuickSettings from '../system/QuickSettings';
import NotificationCenter from '../desktop/NotificationCenter';
import Windows11Loader from '../common/Windows11Loader';
import TaskbarThumbnailPreview from './TaskbarThunbnailPreview';
import { useViewport } from '../../hooks/useViewport';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface TaskbarProps {
  onLock?: () => void;
  onRestart?: () => void;
  onShutdown?: () => void;
}

interface PreviewState {
  appId: string;
  anchorRect: DOMRect;
}

// ─────────────────────────────────────────────────────────────────────────────
// TASKBAR APP BUTTON
// ─────────────────────────────────────────────────────────────────────────────

const TaskbarApp: React.FC<{
  icon: any;
  label: string;
  appId: string;
  isOpen: boolean;
  isFocused: boolean;
  onClick: () => void;
  onHoverEnter: (appId: string, rect: DOMRect) => void;
  onHoverLeave: () => void;
}> = ({ icon, label, appId, isOpen, isFocused, onClick, onHoverEnter, onHoverLeave }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const renderIcon = () => {
    if (typeof icon === 'string') return <img src={icon} alt="" className="w-6 h-6 object-contain" />;
    if (React.isValidElement(icon)) return icon;
    return React.createElement(icon, { size: 24, className: 'w-6 h-6' });
  };

  const handleMouseEnter = () => {
    /* Only open the preview when this app actually has running windows */
    if (!isOpen || !btnRef.current) return;
    onHoverEnter(appId, btnRef.current.getBoundingClientRect());
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      title={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverLeave}
      className={`relative p-2 rounded-md transition-all group ${
        isFocused ? 'bg-white/15' : 'hover:bg-white/8'
      }`}
    >
      <div className={`transition-transform duration-200 ${isFocused ? 'scale-90' : 'scale-100 group-active:scale-75'}`}>
        {renderIcon()}
      </div>

      {isOpen && (
        <motion.div
          layoutId={`taskbar-indicator-${appId}`}
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0078d4]"
          animate={{ width: isFocused ? 16 : 6, height: 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WINDOWS LOGO
// ─────────────────────────────────────────────────────────────────────────────

const WindowsLogo = ({ active }: { active: boolean }) => (
  <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className={`rounded-sm transition-colors ${active ? 'bg-[#00a3ee]' : 'bg-[#0078d4]'}`} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TASKBAR
// ─────────────────────────────────────────────────────────────────────────────

const Taskbar: React.FC<TaskbarProps> = ({ onLock, onRestart, onShutdown }) => {
  const [currentTime, setCurrentTime]             = useState(new Date());
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [notificationOpen, setNotificationOpen]   = useState(false);
  const [widgetsOpen, setWidgetsOpen]             = useState(false);
  const [startMenuOpen, setStartMenuOpen]         = useState(false);
  const [powerMenuOpen, setPowerMenuOpen]         = useState(false);
  const [systemAction, setSystemAction]           = useState<'none' | 'shutdown' | 'restart'>('none');
  const [isFullscreen, setIsFullscreen]           = useState(!!document.fullscreenElement);
  const [brightness, setBrightness]               = useState(100);
  const [volume, setVolume]                       = useState(100);
  const [preview, setPreview]                     = useState<PreviewState | null>(null);

  /**
   * Shared dismiss timer for the thumbnail preview.
   * Passed into TaskbarThumbnailPreview so the panel itself can cancel it
   * when the cursor re-enters — preventing premature dismissal.
   */
  const previewDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Dismiss timer for the WidgetsBoard.
   * Using a ref (not state) prevents a re-render every time we set/clear it.
   */
  const widgetDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate    = useNavigate();
  const { isMobile } = useViewport();

  const { windows, windowOrder, openWindow, focusWindow, toggleMinimize } = useWindowStore();
  const focusedWindowId = windowOrder[windowOrder.length - 1];

  const recentFiles = [
    { name: 'Project_Proposal.docx', time: '17m ago',  icon: <FileText size={16} className="text-blue-400" /> },
    { name: 'Resume.pdf',            time: 'Yesterday', icon: <Clock    size={16} className="text-gray-400" /> },
  ];

  // ── Timers & listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => { clearInterval(timer); document.removeEventListener('fullscreenchange', onFsChange); };
  }, []);

  // ── App click ─────────────────────────────────────────────────────────────
  const handleAppClick = (appId: string) => {
    const instances = Object.values(windows).filter(w => w.appId === appId);
    if (instances.length === 0) {
      openWindow(appId);
    } else {
      const target = instances[0];
      target.id === focusedWindowId && !target.isMinimized
        ? toggleMinimize(target.id)
        : focusWindow(target.id);
    }
  };

  // ── Power ─────────────────────────────────────────────────────────────────
  const handlePowerAction = (type: 'shutdown' | 'restart') => {
    setSystemAction(type);
    setStartMenuOpen(false);
    setTimeout(() => { type === 'shutdown' ? onShutdown?.() : onRestart?.(); }, 4000);
  };

  const toggleFullscreen = () => isFullscreen ? exitFullScreen() : enterFullScreen();

  // ── Thumbnail preview hover handlers ─────────────────────────────────────

  /**
   * Icon mouse-enter: cancel any pending dismiss and show the preview.
   */
  const handleIconHoverEnter = (appId: string, rect: DOMRect) => {
    if (previewDismissTimer.current) {
      clearTimeout(previewDismissTimer.current);
      previewDismissTimer.current = null;
    }
    setPreview({ appId, anchorRect: rect });
  };

  /**
   * Icon mouse-leave: start a 400 ms dismiss timer.
   * The preview component will cancel this if the cursor enters the panel.
   */
  const handleIconHoverLeave = () => {
    previewDismissTimer.current = setTimeout(() => setPreview(null), 400);
  };

  /** Final dismissal — called when the cursor fully leaves the preview panel. */
  const handlePreviewDismiss = () => {
    if (previewDismissTimer.current) clearTimeout(previewDismissTimer.current);
    setPreview(null);
  };

  // ── Widgets board hover handlers ──────────────────────────────────────────

  /**
   * Cancel the widgets dismiss timer and open the board.
   * Both the taskbar button and WidgetsBoard's keepWidgetsOpen call this.
   */
  const handleWidgetsEnter = () => {
    if (widgetDismissTimer.current) {
      clearTimeout(widgetDismissTimer.current);
      widgetDismissTimer.current = null;
    }
    setWidgetsOpen(true);
  };

  /**
   * Schedule the widgets board to close after 600 ms.
   * The longer delay (vs 300 ms previously) gives the user time to move from
   * the taskbar button into the panel and interact with widgets before it closes.
   * Both the taskbar button and WidgetsBoard's scheduleWidgetsClose call this.
   */
  const handleWidgetsLeave = () => {
    widgetDismissTimer.current = setTimeout(() => setWidgetsOpen(false), 600);
  };

  // ── Derived lists ─────────────────────────────────────────────────────────
  const pinnedAppIds = new Set(taskbarApps.map(a => a.appId));
  const runningApps  = Array.from(new Set(Object.values(windows).map(w => w.appId)))
    .filter(id => !pinnedAppIds.has(id))
    .map(id => {
      const config = APP_REGISTRY[id];
      return config ? { appId: id, label: config.title, icon: config.icon } : null;
    })
    .filter(Boolean);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* System action overlay */}
      <AnimatePresence>
        {systemAction !== 'none' && (
          <div className="fixed inset-0 z-10000 bg-black">
            <Windows11Loader mode={systemAction} duration={4000} />
          </div>
        )}
      </AnimatePresence>

      {/* Widgets board — desktop only */}
      {!isMobile && (
        <WidgetsBoard
          widgetsOpen={widgetsOpen}
          keepWidgetsOpen={handleWidgetsEnter}
          scheduleWidgetsClose={handleWidgetsLeave}
        />
      )}

      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => { setStartMenuOpen(false); setPowerMenuOpen(false); }}
        desktopIcons={taskbarApps}
        recentFiles={recentFiles}
        powerMenuOpen={powerMenuOpen}
        setPowerMenuOpen={setPowerMenuOpen}
        handleShutdown={() => handlePowerAction('shutdown')}
        handleRestart={() => handlePowerAction('restart')}
        handleLock={onLock || (() => navigate('/signin'))}
        onAppClick={handleAppClick}
      />

      <QuickSettings
        quickSettingsOpen={quickSettingsOpen}
        setQuickSettingsOpen={setQuickSettingsOpen}
        brightness={brightness}
        setBrightness={setBrightness}
        volume={volume}
        setVolume={setVolume}
      />

      <NotificationCenter isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />

      {/* Thumbnail preview — desktop only */}
      <AnimatePresence>
        {preview && !isMobile && (
          <TaskbarThumbnailPreview
            key={preview.appId}
            appId={preview.appId}
            anchorRect={preview.anchorRect}
            dismissTimerRef={previewDismissTimer}
            onDismiss={handlePreviewDismiss}
          />
        )}
      </AnimatePresence>

      {/* ── Taskbar footer ── */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-[9999] px-0 pb-0.5 select-none"
        style={{
          background:    'rgba(32, 32, 32, 0.75)',
          backdropFilter:'blur(20px) saturate(180%)',
          borderTop:     '1px solid rgba(255, 255, 255, 0.08)',
          height:        '48px',
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center px-2">

          {/* LEFT — widgets / weather button */}
          {!isMobile && (
            <div className="absolute left-2 h-full flex items-center">
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors cursor-default ${
                  widgetsOpen ? 'bg-white/10' : 'hover:bg-white/10'
                }`}
                onMouseEnter={handleWidgetsEnter}
                onMouseLeave={handleWidgetsLeave}
                onClick={() => setWidgetsOpen(v => !v)}
              >
                <div className="text-xl leading-none drop-shadow-md">🌤️</div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-medium text-white leading-none">24°C</span>
                  <span className="text-[10px] text-gray-300 leading-none mt-0.5">Mostly Sunny</span>
                </div>
              </div>
            </div>
          )}

          {/* CENTRE — start button + app icons */}
          <div className="flex items-center gap-1 z-10">
            <button
              onClick={() => setStartMenuOpen(v => !v)}
              className="p-2 rounded-lg hover:bg-white/8 transition-all"
            >
              <WindowsLogo active={startMenuOpen} />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {[...taskbarApps, ...(runningApps as any[])].map((app: any) => {
              const instances = Object.values(windows).filter(w => w.appId === app.appId);
              const isOpen    = instances.length > 0;
              const isFocused = isOpen && instances.some(w => w.id === focusedWindowId);

              return (
                <TaskbarApp
                  key={app.appId}
                  appId={app.appId}
                  icon={app.icon}
                  label={app.label}
                  isOpen={isOpen}
                  isFocused={isFocused}
                  onClick={() => handleAppClick(app.appId)}
                  onHoverEnter={handleIconHoverEnter}
                  onHoverLeave={handleIconHoverLeave}
                />
              );
            })}
          </div>

          {/* RIGHT — fullscreen + system tray */}
          <div className="absolute right-2 h-full flex items-center gap-1">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-md hover:bg-white/10 text-white/80 transition-colors hidden sm:flex"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <div
              className={`flex items-center px-2 py-1.5 rounded-md transition-colors gap-2 cursor-pointer ${
                quickSettingsOpen ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
              onClick={() => setQuickSettingsOpen(v => !v)}
            >
              <Wifi    size={14} className="text-white/80" />
              <Volume2 size={14} className="text-white/80" />
              <Battery size={14} className="text-white/80" />
            </div>

            <div
              className="px-2 py-1 text-right text-white text-[11px] hover:bg-white/10 rounded-md cursor-pointer"
              onClick={() => setNotificationOpen(v => !v)}
            >
              <div>{formatTime(currentTime)}</div>
              <div className="opacity-60 text-[10px]">{formatDate(currentTime)}</div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Taskbar;