import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SuccessTransmissionProps {
  name: string;
  colors: {
    text: string;
    muted: string;
  };
  onReturn: () => void;
}

export const SuccessTransmission = ({ name, colors, onReturn }: SuccessTransmissionProps) => {
  const firstName = name.split(" ")[0];
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Auto-focus the return button for keyboard/screen reader users
  useEffect(() => {
    const timer = setTimeout(() => {
      buttonRef.current?.focus();
    }, 800); // Focus after the main entrance animations
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      // Added ARIA roles so screen readers announce this success state automatically
      role="status" 
      aria-live="polite"
      className="flex flex-col items-center justify-center space-y-10 md:space-y-14 w-full px-4"
    >
      {/* CORE */}
      <div className="relative flex items-center justify-center">
        {/* SIGNAL RINGS */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 rounded-full border border-green-500/60 pointer-events-none"
            initial={{ scale: 0.4, opacity: 0.7 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{
              duration: 1.8,
              delay: 0.4 + i * 0.25,
              ease: "easeOut"
            }}
          />
        ))}

        {/* ENERGY CORE */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12
          }}
          className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_80px_rgba(34,197,94,0.7)]"
        >
          {/* CHECKMARK DRAW */}
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24"
            aria-hidden="true" // Hidden from screen readers as the text explains the success
          >
            <motion.path
              d="M5 13l4 4L19 7"
              fill="transparent"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.7,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>

        {/* FLOATING PARTICLES */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 bg-green-400 rounded-full pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.4, 0],
              x: Math.cos(i * 60 * (Math.PI / 180)) * 90,
              y: Math.sin(i * 60 * (Math.PI / 180)) * 90
            }}
            transition={{
              delay: 0.8 + i * 0.05,
              duration: 1.6,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* HEADLINE */}
      <motion.h2
        variants={item}
        transition={{ duration: 0.6 }}
        className={`text-5xl sm:text-7xl md:text-9xl font-light tracking-tight text-center ${colors.text}`}
      >
        Transmission
        <span className="block sm:inline sm:ml-4 italic font-serif text-green-500">
          Complete
        </span>
      </motion.h2>

      {/* SUBTEXT */}
      <motion.p
        variants={item}
        transition={{ duration: 0.6 }}
        className={`text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.45em] text-center ${colors.muted}`}
      >
        Message received. I’ll respond shortly, {firstName}.
      </motion.p>

      {/* CTA */}
      <motion.button
        ref={buttonRef}
        variants={item}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReturn}
        // Focus ring added for accessibility navigation
        className="px-10 py-4 md:px-12 md:py-5 rounded-full bg-green-500 text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(34,197,94,0.35)] focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow"
      >
        Return Home
      </motion.button>
    </motion.div>
  );
};