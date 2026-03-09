import React, { useEffect } from 'react';
import { motion, AnimatePresence,  } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Windows11LoaderProps {
  duration?: number;
  onComplete?: () => void;
  mode?: 'boot' | 'shutdown' | 'restart';
}

const Windows11Loader: React.FC<Windows11LoaderProps> = ({
  duration = 4000,
  onComplete,
  mode = 'boot'
}) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  const dotVariants: Variants = {
    animate: (i: number) => ({
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1] as any,
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-9999">
      <div className="flex flex-col items-center">
        
        {/* Windows Logo - Only for Boot and Restart */}
        {mode !== 'shutdown' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-24"
          >
            <div className="grid grid-cols-2 gap-1">
              <div className="w-16 h-16 bg-[#0078d4]"></div>
              <div className="w-16 h-16 bg-[#0078d4]"></div>
              <div className="w-16 h-16 bg-[#0078d4]"></div>
              <div className="w-16 h-16 bg-[#0078d4]"></div>
            </div>
          </motion.div>
        )}

        {/* Loading Spinner */}
        <div className="relative w-12 h-12">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              custom={i}
              variants={dotVariants}
              animate="animate"
            >
              <div 
                className="w-1 h-1 bg-white rounded-full mx-auto" 
                style={{ transformOrigin: '24px 24px' }} 
              />
            </motion.div>
          ))}
        </div>

        {/* Status Text - Only for Shutdown and Restart */}
        <AnimatePresence>
          {mode !== 'boot' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center"
            >
              <p className="text-white text-xl font-light tracking-wide">
                {mode === 'shutdown' ? 'Shutting down' : 'Restarting'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Windows11Loader;


