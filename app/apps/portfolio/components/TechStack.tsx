import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Cpu, Globe, Database, Layout, Terminal, GitBranch } from 'lucide-react';

interface TechStackProps {
  theme?: 'dark' | 'light';
}

export const TechStack: React.FC<TechStackProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-black' : 'bg-zinc-50';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <section className={`relative w-full py-24 md:py-32 px-6 md:px-12 ${bgClass} ${textPrimary}`}>
      {/* Background Noise Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <Terminal className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-xs font-mono uppercase tracking-widest ${textSecondary}`}>
              System Architecture
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1]"
          >
            The technology powering <br />
            <span className={textSecondary}>the next generation.</span>
          </motion.h2>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Col 1: Frontend (Tall) */}
          <SpotlightCard className="md:row-span-2" theme={theme}>
            <div className="h-full flex flex-col justify-between p-8">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-black'}`}>
                <Layout size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Frontend Engineering</h3>
                <p className={`text-sm mb-6 ${textSecondary}`}>
                  Focusing on sub-millisecond interaction and webgl-powered interfaces.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React 18', 'Next.js', 'TypeScript', 'Tailwind', 'Three.js', 'Framer Motion', 'Zustand'].map(tag => (
                    <Badge key={tag} text={tag} theme={theme} />
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Col 2: Backend (Wide) */}
          <SpotlightCard className="md:col-span-2" theme={theme}>
            <div className="flex flex-col md:flex-row p-8 gap-8">
               <div className="flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-black'}`}>
                    <Database size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Backend & Infrastructure</h3>
                  <p className={`text-sm ${textSecondary}`}>
                    Scalable microservices and serverless architectures designed for high concurrency.
                  </p>
               </div>
               <div className="flex-1 flex content-end items-end">
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS Lambda', 'GraphQL', 'Supabase'].map(tag => (
                      <Badge key={tag} text={tag} theme={theme} />
                    ))}
                  </div>
               </div>
            </div>
          </SpotlightCard>

          {/* Col 2, Row 2: Left (DevOps/Tools) */}
          <SpotlightCard theme={theme}>
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-black'}`}>
                  <GitBranch size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium mb-2">CI/CD & Workflow</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                 {['Git', 'GitHub Actions', 'Turborepo', 'Vercel'].map(tag => (
                    <Badge key={tag} text={tag} theme={theme} />
                  ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Col 2, Row 2: Right (Currently Learning/Experimenting) */}
          <SpotlightCard theme={theme}>
             <div className="p-8 h-full flex flex-col justify-between relative overflow-hidden">
               {/* Decorative "Live" Pulse */}
               <div className="absolute top-8 right-8 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${textSecondary}`}>Exploring</span>
               </div>

               <div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-black'}`}>
                  <Cpu size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium mb-2">Current Focus</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                 {['Rust', 'WebAssembly', 'Solidity'].map(tag => (
                    <Badge key={tag} text={tag} theme={theme} />
                  ))}
              </div>
             </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
};

// --- Sub-Components ---

// 1. The Badge (Small Pill)
const Badge = ({ text, theme }: { text: string; theme: string }) => {
  const isDark = theme === 'dark';
  return (
    <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider border rounded-md transition-colors 
      ${isDark 
        ? 'border-zinc-800 text-zinc-400 bg-zinc-900/50 hover:border-zinc-600 hover:text-white' 
        : 'border-zinc-300 text-zinc-600 bg-white hover:border-zinc-400 hover:text-black'
      }`}
    >
      {text}
    </span>
  );
};

// 2. The Spotlight Card (The Magic)
// This tracks the mouse position to create a radial gradient border effect
const SpotlightCard = ({ children, className = "", theme }: { children: React.ReactNode; className?: string; theme: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    position.x.set(e.clientX - rect.left);
    position.y.set(e.clientY - rect.top);
  };

  const isDark = theme === 'dark';
  const baseBg = isDark ? 'bg-zinc-950' : 'bg-white';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const spotlightColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative rounded-xl border ${borderColor} ${baseBg} overflow-hidden group ${className}`}
    >
      {/* The Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${position.x}px ${position.y}px,
              ${spotlightColor},
              transparent 40%
            )
          `,
        }}
      />
      
      {/* Content */}
      <div className="relative h-full">
        {children}
      </div>
    </div>
  );
};

export default TechStack;