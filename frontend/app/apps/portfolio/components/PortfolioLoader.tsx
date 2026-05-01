import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reduced frame count to shorten one full animation cycle.
 * This directly decreases perceived wait time without removing animation.
 */
const WAVE_FRAMES = [
  [0.6, 1.0, 0.65],
  [0.85, 0.7, 0.95],
  [0.95, 0.6, 0.75],
  [0.7, 0.95, 0.6],
  [0.6, 0.75, 1.0],
  [0.85, 0.6, 0.7],
];

/**
 * Static geometry for animated bars.
 */
const BARS = [
  { id: 'bar-1', cx: 77.6, cy: 95.6, w: 16.4, h: 58 },
  { id: 'bar-2', cx: 99.2, cy: 106.0, w: 16.4, h: 81 },
  { id: 'bar-3', cx: 120.4, cy: 118.0, w: 16.4, h: 58 },
];

interface LoaderProps {
  isLoading: boolean;
  onLoopComplete: () => void;
}

export const PortfolioLoader: React.FC<LoaderProps> = ({
  isLoading,
  onLoopComplete
}) => {
  const [barScales, setBarScales] = useState([1, 1, 1]);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!isLoading) return;

    /**
     * Faster frame interval:
     * - Reduced from 160ms → 110ms for snappier animation
     * - Combined with fewer frames, loop completes significantly quicker
     */
    const interval = setInterval(() => {
      if (frameRef.current === WAVE_FRAMES.length - 1) {
        onLoopComplete();
      }

      frameRef.current = (frameRef.current + 1) % WAVE_FRAMES.length;
      setBarScales(WAVE_FRAMES[frameRef.current]);
    }, 110);

    return () => clearInterval(interval);
  }, [isLoading, onLoopComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          /**
           * Faster exit transition to avoid lingering after loading completes
           */
          exit={{
            y: '-100%',
            transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-[#050505] pointer-events-none select-none"
        >
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" overflow="visible">
            
            {/* Left Dot */}
            <motion.circle
              cx={58.4}
              cy={82.8}
              r={8.2}
              fill="#c8c8c8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }} // quicker fade-in
            />

            {/* Animated Bars */}
            {BARS.map((b, i) => (
              <g key={b.id} transform={`translate(${b.cx}, ${b.cy}) rotate(36)`}>
                <motion.rect
                  x={-b.w / 2}
                  y={-b.h / 2}
                  width={b.w}
                  height={b.h}
                  rx={b.w / 2}
                  fill="#c8c8c8"
                  animate={{ scaleY: barScales[i] }}
                  /**
                   * Reduced transition duration for tighter, more responsive motion
                   */
                  transition={{ duration: 0.1, ease: 'easeInOut' }}
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                    transformBox: 'fill-box'
                  }}
                />
              </g>
            ))}

            {/* Right Dot */}
            <motion.circle
              cx={140.8}
              cy={128.0}
              r={8.2}
              fill="#c8c8c8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};