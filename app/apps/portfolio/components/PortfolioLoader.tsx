import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  isLoading: boolean;
  videoSrc: string;
  onVideoEnded: (v: HTMLVideoElement) => void;
}

export const PortfolioLoader: React.FC<LoaderProps> = ({ isLoading, videoSrc, onVideoEnded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#050505] pointer-events-none select-none"
          translate="no"
        >
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
            onEnded={() => videoRef.current && onVideoEnded(videoRef.current)}
            className="w-[85vw] max-w-[500px] h-auto object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};