import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WAVE_FRAMES = [
  [0.55, 1.00, 0.60], [0.70, 0.80, 0.95], [0.95, 0.55, 0.75],
  [0.75, 0.95, 0.55], [0.55, 0.70, 1.00], [0.90, 0.55, 0.70],
  [0.60, 1.00, 0.55], [0.80, 0.65, 0.90],
];

const BARS = [
  { id: "bar-1", cx: 77.6, cy: 95.6, w: 16.4, h: 58 },
  { id: "bar-2", cx: 99.2, cy: 106.0, w: 16.4, h: 81 },
  { id: "bar-3", cx: 120.4, cy: 118.0, w: 16.4, h: 58 },
];

interface LoaderProps {
  isLoading: boolean;
  onLoopComplete: () => void;
}

export const PortfolioLoader: React.FC<LoaderProps> = ({ isLoading, onLoopComplete }) => {
  const [barScales, setBarScales] = useState([1, 1, 1]);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      // Check if we just finished the last frame of the sequence
      if (frameRef.current === WAVE_FRAMES.length - 1) {
        onLoopComplete(); // Signal the hook that one "loop" is done
      }

      frameRef.current = (frameRef.current + 1) % WAVE_FRAMES.length;
      setBarScales([...WAVE_FRAMES[frameRef.current]]);
    }, 160);

    return () => clearInterval(interval);
  }, [isLoading, onLoopComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-[#050505] pointer-events-none select-none"
        >
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" overflow="visible">
            {/* Left Dot */}
            <motion.circle cx={58.4} cy={82.8} r={8.2} fill="#c8c8c8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

            {/* Animated Pills */}
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
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  style={{ originX: 0.5, originY: 0.5, transformBox: "fill-box" }}
                />
              </g>
            ))}

            {/* Right Dot */}
            <motion.circle cx={140.8} cy={128.0} r={8.2} fill="#c8c8c8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};