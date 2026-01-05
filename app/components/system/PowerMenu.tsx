import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, RotateCw, Power } from 'lucide-react';

interface PowerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLock: () => void;
  onRestart: () => void;
  onShutdown: () => void;
}

export const PowerMenu: React.FC<PowerMenuProps> = ({
  isOpen,
  onClose,
  onLock,
  onRestart,
  onShutdown
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full right-0 mb-2 w-48 rounded-lg overflow-hidden"
          style={{
            background: 'rgba(40, 40, 40, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          <button
            onClick={onLock}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all text-left"
          >
            <Lock size={16} className="text-white/80" />
            <span className="text-white text-sm" style={{ fontFamily: 'Segoe UI' }}>Lock</span>
          </button>

          <div className="h-px bg-white/10 mx-2" />

          <button
            onClick={onRestart}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all text-left"
          >
            <RotateCw size={16} className="text-white/80" />
            <span className="text-white text-sm" style={{ fontFamily: 'Segoe UI' }}>Restart</span>
          </button>

          <div className="h-px bg-white/10 mx-2" />

          <button
            onClick={onShutdown}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all text-left"
          >
            <Power size={16} className="text-white/80" />
            <span className="text-white text-sm" style={{ fontFamily: 'Segoe UI' }}>Shut down</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
