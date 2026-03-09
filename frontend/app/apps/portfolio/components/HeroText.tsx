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
      className={`absolute bottom-[150px] md:bottom-[112px] left-6 md:left-10 z-40 transition-colors duration-700 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
    >
      <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">
        {name}
      </h2>
      <p className="text-[10px] uppercase tracking-[0.5em] mt-5 opacity-40 font-bold pl-1">
        {title} &mdash; {subtitle}
      </p>
    </motion.div>
  );
};






