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
        left-6 md:left-10
        bottom-[24dvh] md:bottom-[18dvh]
        transition-colors duration-150
        ${theme === 'dark' ? 'text-white' : 'text-black'}
      `}
      // dvh (dynamic viewport height) scales proportionally to the actual
      // visible viewport on both real devices and DevTools emulation.
      // mobile:  24dvh ≈ 198px on a ~844px tall viewport (iPhone 12)
      // md+:     18dvh ≈ 160px on a ~900px tall viewport (desktop)
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