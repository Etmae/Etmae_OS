import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface SuccessTransmissionProps {
  name: string;
  colors: {
    text: string;
    muted: string;
  };
  onReturn: () => void;
}

export const SuccessTransmission = ({
  name,
  colors,
  onReturn
}: SuccessTransmissionProps) => {
  const firstName = name.split(" ")[0];
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      buttonRef.current?.focus();
    }, 800);
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
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center w-full px-4"
    >
      {/* LOTTIE ANIMATION */}
      <motion.div
        variants={item}
        className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-2 md:mb-4"
      >
        <DotLottieReact
          src="https://lottie.host/11b12252-ed41-49af-a539-4b0c5e42c328/hwHcnJNxAA.lottie"
          autoplay
          aria-hidden="true"
        />
      </motion.div>

      {/* TEXT CONTENT */}
      <div className="flex flex-col items-center text-center mb-8 md:mb-12">
        <motion.h2
          variants={item}
          transition={{ duration: 0.6 }}
          className={`text-5xl sm:text-7xl md:text-8xl font-light tracking-tight ${colors.text}`}
        >
          Message
          <span className="block sm:inline sm:ml-4 italic font-serif text-green-500">
            Sent
          </span>
        </motion.h2>

        <motion.p
          variants={item}
          transition={{ duration: 0.6 }}
          className={`mt-4 text-[10px] sm:text-xs uppercase tracking-[0.4em] max-w-xs leading-relaxed ${colors.muted}`}
        >
          Message received. I’ll respond shortly, {firstName}.
        </motion.p>
      </div>

      {/* CTA BUTTON */}
      <motion.button
        ref={buttonRef}
        variants={item}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReturn}
        className="mt-2 md:mt-4 px-10 py-4 rounded-full bg-green-500 text-black text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(34,197,94,0.3)] focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
      >
        Return Home
      </motion.button>
    </motion.div>
  );
};