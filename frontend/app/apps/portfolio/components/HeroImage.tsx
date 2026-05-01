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
    // Padding calculation ensures the image bottom position clears the taskbar height (60px)
    // plus standard spacing (2rem) for proper visual breathing room.
    <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-[calc(60px+2rem)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`
          w-[85vw] h-[70dvh]
          sm:w-[70vw] sm:h-[75dvh]
          md:w-[55vw] md:h-[80dvh] md:max-w-[850px]
          lg:h-[85dvh]
        `}
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




