import React, { useState } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import loom_img from '../../assets/img/portfolio/worls2.png';

const PROJECTS = [
  { 
    id: '01', 
    title: 'LOOMS & AURA', 
    category: 'Luxury E-commerce', 
    year: '2026',
    image: loom_img
  },
  { 
    id: '02', 
    title: 'TECHU-COMFORT', 
    category: 'Institutional System', 
    year: '2026',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974' 
  },
  { 
    id: '03', 
    title: 'IMMERSIVE PORTFOLIO', 
    category: 'Motion Design', 
    year: '2025',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964' 
  },
  { 
    id: '04', 
    title: 'HOSPITAL CORE', 
    category: 'System Architecture', 
    year: '2026',
    image: 'https://images.unsplash.com/photo-1504813184591-01592fd03cfd?q=80&w=2070' 
  },
];

export const WorksPage = ({ theme = 'dark' }) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? 'bg-zinc-950' : 'bg-zinc-50',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    muted: isDark ? 'text-zinc-500' : 'text-zinc-400',
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen w-full overflow-hidden ${colors.bg} flex flex-col`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* BACKGROUND PORTAL (Pushed back and darkened) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {activeProject !== null && (
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.div 
                // Added heavier darkening and a slight blur to suppress background text
                className="w-full h-full bg-cover bg-center brightness-[0.35] blur-[2px] contrast-125"
                style={{ 
                  backgroundImage: `url(${PROJECTS[activeProject].image})`,
                  clipPath: `circle(350px at ${springX}px ${springY}px)` 
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <header className="relative z-10 w-full max-w-3xl mx-auto pt-24 px-4 flex justify-between items-end mix-blend-difference text-white">
        <div>
          <h1 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-2 opacity-60`}>
            Selected Works
          </h1>
          <p className={`text-4xl font-light tracking-tight`}>
            Index <span className="italic font-serif">’25—’26</span>
          </p>
        </div>
        <div className={`text-[10px] font-mono opacity-60`}>
          {PROJECTS.length} RELEASES
        </div>
      </header>

      {/* EDITORIAL INDEX LIST */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-3xl mx-auto px-4 py-20">
        <div className={`border-t ${colors.border}`}>
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              onMouseEnter={() => setActiveProject(index)}
              onMouseLeave={() => setActiveProject(null)}
              // mix-blend-difference forces the text to contrast perfectly with the background image
              className={`group relative flex items-center justify-between py-10 border-b ${colors.border} cursor-none transition-opacity duration-300 mix-blend-difference text-white ${activeProject !== null && activeProject !== index ? 'opacity-20' : 'opacity-100'}`}
            >
              <div className="flex flex-col gap-2">
                <span className={`text-[10px] font-mono opacity-60 group-hover:text-green-400 transition-colors`}>
                  {project.id}
                </span>
                <h2 className={`text-5xl md:text-7xl font-light tracking-tighter transition-transform duration-500 group-hover:translate-x-4`}>
                  {project.title}
                </h2>
              </div>

              <div className="text-right hidden md:block opacity-80 group-hover:opacity-100 transition-opacity">
                <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 opacity-60`}>
                  {project.category}
                </div>
                <div className={`font-light italic font-serif flex items-center justify-end gap-2`}>
                  View Project <ArrowUpRight size={16} strokeWidth={1} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-3xl mx-auto pb-12 px-4 flex justify-between items-center mix-blend-difference text-white opacity-60">
        <div className={`text-[9px] font-mono uppercase tracking-widest`}>
          Archive // Localized Access Only
        </div>
        <div className={`text-[9px] font-mono uppercase tracking-widest`}>
          Scroll to Explore
        </div>
      </footer>
    </motion.div>
  );
};

export default WorksPage;