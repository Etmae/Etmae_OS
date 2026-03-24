import { motion } from 'framer-motion';
import React from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  initialY?: number;
  initialScale?: number;
  initialBlur?: number;
  duration?: number;
  margin?: string;
}

export const RevealOnScroll = ({
  children,
  delay = 0,
  initialY = 30,
  initialScale = 1,
  initialBlur = 10,
  duration = 1,
  margin = "-100px"
}: RevealOnScrollProps) => (
  <motion.div
    initial={{ opacity: 0, y: initialY, scale: initialScale, filter: `blur(${initialBlur}px)` }}
    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    viewport={{ once: true, margin }}
    transition={{
      duration,
      delay,
      ease: [0.21, 0.47, 0.32, 0.98],
    }}
  >
    {children}
  </motion.div>
);