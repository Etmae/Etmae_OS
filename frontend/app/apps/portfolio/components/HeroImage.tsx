import React from 'react';
import { motion } from 'framer-motion';

type Theme = 'dark' | 'light';
type ViewportMode = 'desktop' | 'mobile';

interface HeroImageProps {
  isLoaded: boolean;
  viewportMode: ViewportMode;
  theme: Theme;
  images: {
    darkDesktop: string;
    lightDesktop: string;
  };
}

export const HeroImage: React.FC<HeroImageProps> = ({
  isLoaded,
  viewportMode,
  theme,
  images
}) => {
  return (
    <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`${viewportMode === 'mobile' ? 'w-[90vw] h-[75vh]' : 'w-[55vw] max-w-[850px] h-[90vh]'}`}
      >
        <img
          src={theme === 'dark' ? images.darkDesktop : images.lightDesktop}
          className="w-full h-full object-cover object-top"
          alt="Portfolio Hero"
        />
      </motion.div>
    </div>
  );
};






