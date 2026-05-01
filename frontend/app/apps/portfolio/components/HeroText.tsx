import React from 'react';
import { motion, MotionValue } from 'framer-motion';

type Theme = 'dark' | 'light';

interface HeroTextProps {
  isLoaded: boolean;
  uiOpacity: MotionValue<number>;
  theme: Theme;
  name: string;
  title: string;
  subtitle: string;
}

export const HeroText: React.FC<HeroTextProps> = ({
  isLoaded,
  uiOpacity,
  theme,
  name,
  title,
  subtitle
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 1, delay: 0.2 }}
      style={{ opacity: uiOpacity }}
      className={`
        absolute z-40
        left-4 sm:left-6 md:left-10
        text-sm md:text-base lg:text-lg xl:text-xl
        /* FIX: Use calc() to guarantee it sits above a ~60px taskbar + padding */
        bottom-[calc(60px+12dvh)] md:bottom-[calc(60px+15dvh)]
        transition-colors duration-150
        ${theme === 'dark' ? 'text-white' : 'text-black'}
      `}
    >
      {/* FIX: Smoother responsive text sizing to prevent wrapping breaks */}
      <h2 className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tighter leading-none whitespace-nowrap">
        {name}
      </h2>
      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] mt-3 sm:mt-5 opacity-40 font-bold pl-1 max-w-[90vw] truncate">
        {title} &mdash; {subtitle}
      </p>
    </motion.div>
  );
};