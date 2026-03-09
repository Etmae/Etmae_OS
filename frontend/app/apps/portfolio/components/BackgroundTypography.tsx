import React from 'react';
import { motion, MotionValue } from 'framer-motion';

type Theme = 'dark' | 'light';

interface BackgroundTypographyProps {
  isLoaded: boolean;
  uiOpacity: MotionValue<number>;
  theme: Theme;
  typographyName: string;
}

export const BackgroundTypography: React.FC<BackgroundTypographyProps> = ({
  isLoaded,
  uiOpacity,
  theme,
  typographyName
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.h1
        initial={{ opacity: 0, y: 100 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: uiOpacity }}
        className={`text-[22vw] font-black uppercase transition-colors duration-700 ${
          theme === 'dark' ? 'text-white/5' : 'text-black/5'
        }`}
      >
        {typographyName.split(' ')[0]}
      </motion.h1>
    </div>
  );
};






