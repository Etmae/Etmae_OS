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
      className={`absolute z-40 left-4 bottom-[calc(60px+12dvh)] text-sm transition-colors duration-150 sm:left-6 md:left-10 md:bottom-[calc(60px+15dvh)] md:text-base lg:text-lg xl:text-xl ${
        theme === 'dark' ? 'text-white' : 'text-black'
      }`}
    >
      <h2 className="text-5xl font-light tracking-tighter leading-none whitespace-nowrap sm:text-6xl md:text-8xl">
        {name}
      </h2>
      <p className="mt-3 max-w-[90vw] truncate pl-1 text-[9px] font-bold uppercase tracking-[0.4em] opacity-40 sm:mt-5 sm:text-[10px] sm:tracking-[0.5em]">
        {title} - {subtitle}
      </p>
    </motion.div>
  );
};