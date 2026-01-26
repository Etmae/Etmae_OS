import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Power } from 'lucide-react';
import { PowerMenu } from '../system/PowerMenu';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  desktopIcons: Array<{ icon: React.ReactNode; label: string; route: string }>;
  recentFiles: Array<{ name: string; time: string; icon: React.ReactNode }>;
  powerMenuOpen: boolean;
  setPowerMenuOpen: (open: boolean) => void;
  handleLock: () => void;
  handleRestart: () => void;
  handleShutdown: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  desktopIcons,
  recentFiles,
  powerMenuOpen,
  setPowerMenuOpen,
  handleLock,
  handleRestart,
  handleShutdown
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            data-start-menu
            className="fixed bottom-20 left-1/2 z-30 w-[640px] max-w-[90vw]"
            initial={{ opacity: 0, y: 20, scale: 0.96, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 20, scale: 0.96, x: '-50%' }}
            transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.7 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
              }}
            >
              <div className="p-6 pb-5">
                <div
                  className="rounded-lg px-5 py-3 flex items-center gap-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Search size={18} className="text-white/50" />
                  <input
                    type="text"
                    placeholder="Search for apps, settings, and documents"
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                    style={{ fontFamily: 'Segoe UI', fontWeight: 400 }}
                  />
                </div>
              </div>

              <div className="px-6 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Pinned</span>
                  <button className="text-white/50 hover:text-white text-xs transition-colors" style={{ fontFamily: 'Segoe UI' }}>
                    All &gt;
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  {desktopIcons.map((item, index) => (
                    <button
                      key={index}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
                      onClick={() => {
                        console.log(`Open ${item.label}`);
                        onClose();
                      }}
                    >
                      <div className="text-white">
                        {React.cloneElement(item.icon as React.ReactElement, { size: 36 } as any)}
                      </div>
                      <span className="text-white/85 text-xs text-center leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Section */}
              <div className="px-6 pb-5 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Recommended</span>
                  <button className="text-white/50 hover:text-white text-xs transition-colors" style={{ fontFamily: 'Segoe UI' }}>
                    More &gt;
                  </button>
                </div>
                <div className="space-y-1">
                  {recentFiles.map((file, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-[0.98] text-left"
                      onClick={() => {
                        console.log(`Open ${file.name}`);
                        onClose();
                      }}
                    >
                      <div className="flex-shrink-0">
                        {file.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate" style={{ fontFamily: 'Segoe UI' }}>
                          {file.name}
                        </div>
                        <div className="text-white/50 text-xs" style={{ fontFamily: 'Segoe UI' }}>
                          {file.time}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{
                  background: 'rgba(20, 20, 20, 0.7)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 100%)',
                      boxShadow: '0 2px 8px rgba(0, 120, 212, 0.4)',
                    }}
                  >
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-medium" style={{ fontFamily: 'Segoe UI' }}>Elijah Olujimi</span>
                  </div>
                </div>

                  {/* Power Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPowerMenuOpen(!powerMenuOpen);
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-all"
                      title="Power"
                    >
                      <Power size={18} className="text-white/80" />
                    </button>

                    <PowerMenu
                      isOpen={powerMenuOpen}
                      onClose={() => setPowerMenuOpen(false)}
                      onLock={handleLock}
                      onRestart={handleRestart}
                      onShutdown={handleShutdown}
                    />
                  </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StartMenu;