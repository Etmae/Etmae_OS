import React from 'react';
import { motion, MotionValue } from 'framer-motion';

type Theme = 'dark' | 'light';

interface BackgroundOverlayProps {
  finishFill: MotionValue<number>;
  theme: Theme;
}

export const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({
  finishFill,
  theme
}) => {
  return (
    <motion.div
      style={{ opacity: finishFill }}
      className={`absolute inset-0 z-45 pointer-events-none transition-colors duration-150 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-50'}`}
    />
  );
};






