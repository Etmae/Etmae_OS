import React, { useRef } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface PrincipleProps {
  theme?: 'dark' | 'light';
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}

export const CodeManifesto: React.FC<PrincipleProps> = ({ theme = 'dark', scrollContainer, scrollYProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Use the shared scrollYProgress from shell instead of creating our own
  // This ensures synchronization with the Hero's zoom effects

  const textSecondary = isDark ? 'text-zinc-800' : 'text-zinc-200';
  const accentText = isDark ? 'text-green-500' : 'text-blue-600';
  const bgClass = isDark ? 'bg-[#050505]' : 'bg-white';
  const labelColor = isDark ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <section 
      ref={containerRef} 
      className={`relative w-full py-32 md:py-48 overflow-hidden transition-colors duration-700 ${bgClass}`}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-500' : 'bg-blue-600'}`} />
          <span className={`text-[10px] font-mono uppercase tracking-[0.4em] ${labelColor}`}>
            0x01 // Engineering Philosophy
          </span>
        </div>

        {/* The Manifesto Rows */}
        <div className="flex flex-col gap-12 md:gap-20">
          <ManifestoRow 
            progress={scrollYProgress} 
            range={[0, 0.25]} 
            outlineText="SCALABILITY" 
            filledText="SCALABILITY" 
            subText="Building systems that don't just work—they grow without friction."
            accentText={accentText}
            baseText={textSecondary}
          />
          <ManifestoRow 
            progress={scrollYProgress} 
            range={[0.2, 0.45]} 
            outlineText="LOW LATENCY" 
            filledText="LOW LATENCY" 
            subText="Interaction is a conversation. I ensure the response is instantaneous."
            accentText={accentText}
            baseText={textSecondary}
          />
          <ManifestoRow 
            progress={scrollYProgress} 
            range={[0.4, 0.65]} 
            outlineText="ATOMIC LOGIC" 
            filledText="ATOMIC LOGIC" 
            subText="Modular, reusable codebases constructed from the ground up."
            accentText={accentText}
            baseText={textSecondary}
          />
          <ManifestoRow 
            progress={scrollYProgress} 
            range={[0.6, 0.85]} 
            outlineText="ACCESSIBILITY" 
            filledText="ACCESSIBILITY" 
            subText="Universal design is not a feature; it is the baseline for the modern web."
            accentText={accentText}
            baseText={textSecondary}
          />
        </div>
      </div>

      {/* Background Decorative Grid */}
      <div 
        className={`absolute inset-0 z-0 opacity-[0.05] pointer-events-none transition-opacity duration-700`}
        style={{ 
          backgroundImage: `radial-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }}
      />
    </section>
  );
};

// --- Row Component ---
interface RowProps {
  progress: MotionValue<number>;
  range: number[];
  outlineText: string;
  filledText: string;
  subText: string;
  accentText: string;
  baseText: string;
}

const ManifestoRow: React.FC<RowProps> = ({ progress, range, outlineText, filledText, subText, accentText, baseText }) => {
  // Map the global section progress to this specific row's fill animation
  const clipPathValue = useTransform(progress, range, ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  return (
    <div className="relative group">
      <div className="relative z-10">
        {/* Background Outlined Text */}
        <h2 className={`text-6xl md:text-9xl font-black tracking-tighter leading-none select-none transition-colors duration-500 ${baseText}`}
            style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}>
          {outlineText}
        </h2>

        {/* Foreground Filled Text (Revealed on Scroll) */}
        <motion.h2 
          style={{ clipPath: clipPathValue }}
          className={`absolute top-0 left-0 text-6xl md:text-9xl font-black tracking-tighter leading-none select-none ${accentText}`}
        >
          {filledText}
        </motion.h2>
      </div>

      <motion.p 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mt-4 max-w-sm text-xs md:text-sm font-mono uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity text-current"
      >
        // {subText}
      </motion.p>
    </div>
  );
};