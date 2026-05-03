import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SEAMLESS LOOP LOGIC:
 * To eliminate the pause, we add the first value to the end of the array.
 * Each array now has 7 points, creating 6 equal "beats" of motion.
 */
const BAR_1 = [0.6, 0.85, 0.95, 0.7, 0.6, 0.85, 0.6];
const BAR_2 = [1.0, 0.7, 0.6, 0.95, 0.75, 0.6, 1.0];
const BAR_3 = [0.65, 0.95, 0.75, 0.6, 1.0, 0.7, 0.65];

/**
 * Precision timing: 0 to 1 divided into 6 equal segments.
 */
const FRAME_TIMES = [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1];

const BARS = [
  { id: 'bar-1', cx: 77.6, cy: 95.6, w: 16.4, h: 58, keyframes: BAR_1 },
  { id: 'bar-2', cx: 99.2, cy: 106.0, w: 16.4, h: 81, keyframes: BAR_2 },
  { id: 'bar-3', cx: 120.4, cy: 118.0, w: 16.4, h: 58, keyframes: BAR_3 },
];

interface LoaderProps {
  isLoading: boolean;
  onLoopComplete: () => void;
}

export const PortfolioLoader: React.FC<LoaderProps> = ({
  isLoading,
  onLoopComplete
}) => {
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      onLoopComplete();
    }, 660);

    return () => clearInterval(interval);
  }, [isLoading, onLoopComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="portfolio-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%', 
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] pointer-events-none select-none"
        >
          <svg 
            width="200" 
            height="200" 
            viewBox="0 0 200 200" 
            fill="none" 
            overflow="visible"
          >
            <circle cx={58.4} cy={82.8} r={8.2} fill="#c8c8c8" />
            <circle cx={140.8} cy={128.0} r={8.2} fill="#c8c8c8" />

            {BARS.map((b) => (
              <g key={b.id} transform={`translate(${b.cx}, ${b.cy}) rotate(36)`}>
                <motion.rect
                  x={-b.w / 2}
                  y={-b.h / 2}
                  width={b.w}
                  height={b.h}
                  rx={b.w / 2}
                  fill="#c8c8c8"
                  initial={{ scaleY: b.keyframes[0] }}
                  animate={{ 
                    scaleY: b.keyframes 
                  }}
                  transition={{
                    duration: 0.66,
                    repeat: Infinity,
                    repeatType: "loop", // Explicitly loop back to start
                    times: FRAME_TIMES,
                    ease: "linear", // Mandatory for rhythmic spacing
                  }}
                  style={{
                    originY: 0.5,
                    transformBox: 'fill-box'
                  }}
                />
              </g>
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};