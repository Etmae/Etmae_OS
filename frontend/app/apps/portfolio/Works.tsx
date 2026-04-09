import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, LayoutGrid, List as ListIcon } from 'lucide-react';
import { PROJECTS_DATA } from './ProjectDetailWrapper';

type ViewMode = 'grid' | 'list';

// Apply layout configurations for grid view
const PROJECTS_WITH_LAYOUT = PROJECTS_DATA.map((project, index) => {
  const layoutConfigs = [
    { gridSpan: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/10]', marginT: 'mt-0' },
    { gridSpan: 'col-span-12 md:col-span-3 md:col-start-9', aspect: 'aspect-[10/16]', marginT: 'md:mt-[25vh]' },
    { gridSpan: 'col-span-12 md:col-span-12', aspect: 'aspect-[21/9]', marginT: 'mt-0' },
    { gridSpan: 'col-span-12 md:col-span-6', aspect: 'aspect-[4/5]', marginT: 'mt-[10vh]' },
    { gridSpan: 'col-span-12 md:col-span-5 md:col-start-7', aspect: 'aspect-[4/5]', marginT: 'md:mt-0' },
  ];
  return { ...project, ...layoutConfigs[index] };
});

export const WorksPage = ({ theme = 'dark', onNavigate }: { theme?: string; onNavigate?: (section: any, projectId?: string) => void }) => {
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const colors = {
    bg: isDark ? 'bg-[#050505]' : 'bg-zinc-50',
    text: isDark ? 'text-white' : 'text-zinc-900',
    textMuted: isDark ? 'text-white/40' : 'text-zinc-500',
    border: isDark ? 'border-white/10' : 'border-zinc-200',
    switchBg: isDark ? 'bg-white/5' : 'bg-zinc-900/5',
    activeTab: isDark ? 'bg-white' : 'bg-zinc-900',
    activeText: isDark ? 'text-black' : 'text-white',
  };

  useEffect(() => {
    const saved = localStorage.getItem('rhumb-mode') as ViewMode;
    if (saved) setViewMode(saved);
  }, []);

  const handleToggle = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('rhumb-mode', mode);
    setActiveListId(null);
  };

  const handleMouseEnter = (id: string) => {
    if (window.innerWidth < 768) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setActiveListId(id), 150);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveListId(null);
  };

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} font-sans overflow-x-hidden transition-colors duration-150`}>
      <main className="w-full">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full pb-[20vh] px-6 md:px-16"
            >
              {/* HEADING AREA */}
              <div className="pt-[20vh] flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                <div className="max-w-4xl">
                  <span className={`text-[10px] font-mono uppercase tracking-[0.6em] mb-6 block ${colors.textMuted}`}>Selected Archives</span>
                  <h1 className="text-[14vw] md:text-[11vw] font-black italic uppercase leading-[0.75] tracking-tighter">
                    Works<span className="text-green-500 not-italic">.</span>
                  </h1>
                </div>
                
                {/* SWITCHER (GRID VIEW) */}
                <div className={`${colors.switchBg} backdrop-blur-2xl border ${colors.border} p-1.5 rounded-full flex gap-1 h-fit mb-4`}>
                  <button onClick={() => handleToggle('grid')} className={`relative px-6 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest transition-colors duration-150 flex items-center gap-2 z-10 ${colors.activeText}`}>
                    <LayoutGrid size={11} /> Gallery
                    <motion.div layoutId="activeTab" className={`absolute inset-0 ${colors.activeTab} rounded-full -z-10`} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  </button>
                  <button onClick={() => handleToggle('list')} className={`relative px-6 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest transition-colors duration-150 flex items-center gap-2 z-10 ${colors.textMuted}`}>
                    <ListIcon size={11} /> Index
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-y-[12vh] md:gap-y-[20vh] gap-x-6 md:gap-x-12">
                {PROJECTS_WITH_LAYOUT.map((project) => (
                  <div key={project.id} className={`${project.gridSpan} ${project.marginT} group cursor-pointer flex flex-col`} onClick={() => onNavigate?.('project-detail', project.id)}>
                    <div className={`relative w-full ${project.aspect} overflow-hidden ${isDark ? 'bg-[#111]' : 'bg-zinc-200'}`}>
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        src={project.image} alt={project.title} 
                        className="w-full h-full object-cover  group-hover:grayscale-0 group-hover:opacity-100 opacity-80 transition-all duration-150" 
                      />
                      <span className="absolute top-6 left-6 md:top-8 md:left-8 text-[11px] font-mono opacity-40 mix-blend-difference">{project.number}</span>
                      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                    <div className="mt-8 md:mt-10 max-w-2xl">
                      <h2 className="text-4xl md:text-7xl font-light tracking-tighter uppercase leading-[0.9]">{project.title}</h2>
                      <div className="flex items-center gap-6 mt-4 md:mt-6">
                        <span className={`text-[10px] md:text-[12px] font-mono uppercase tracking-[0.3em] ${colors.textMuted}`}>{project.role}</span>
                        {project.ongoing && <span className="text-[9px] font-mono text-green-500 uppercase border border-green-500/20 px-2 py-1 rounded-sm">Active</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-dvh flex flex-col overflow-hidden"
            >
              {/* SWITCHER (LIST VIEW) */}
              <div className="pt-32 px-12 md:px-24 mb-10 flex justify-between items-end">
                 <h1 className="text-4xl font-black uppercase italic tracking-tighter opacity-20">Index</h1>
                 <div className={`${colors.switchBg} backdrop-blur-2xl border ${colors.border} p-1.5 rounded-full flex gap-1 h-fit`}>
                    <button onClick={() => handleToggle('grid')} className={`relative px-6 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest transition-colors duration-150 flex items-center gap-2 z-10 ${colors.textMuted}`}>
                      <LayoutGrid size={11} /> Gallery
                    </button>
                    <button onClick={() => handleToggle('list')} className={`relative px-6 py-2 rounded-full text-[9px] font-mono uppercase tracking-widest transition-colors duration-150 flex items-center gap-2 z-10 ${colors.activeText}`}>
                      <ListIcon size={11} /> Index
                      <motion.div layoutId="activeTab" className={`absolute inset-0 ${colors.activeTab} rounded-full -z-10`} />
                    </button>
                </div>
              </div>

              {PROJECTS_WITH_LAYOUT.map((project) => {
                const isActive = activeListId === project.id;
                const isAnotherActive = activeListId !== null && activeListId !== project.id;
                return (
                  <motion.div
                    key={project.id}
                    onMouseEnter={() => handleMouseEnter(project.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onNavigate?.('project-detail', project.id)}
                    animate={{ 
                      height: isActive ? '100dvh' : isAnotherActive ? '0dvh' : `${70 / PROJECTS_WITH_LAYOUT.length}dvh`,
                      opacity: isAnotherActive ? 0 : 1
                    }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className={`relative w-full border-b ${colors.border} flex items-center overflow-hidden cursor-pointer group`}
                  >
                    <motion.img 
                      src={project.image} 
                      animate={{ scale: isActive ? 1 : 1.1, opacity: isActive ? 0.7 : 0 }}
                      className="absolute inset-0 w-full h-full object-cover z-0" 
                    />
                    <div className="relative z-10 w-full px-12 md:px-24 flex justify-between items-center mix-blend-difference pointer-events-none">
                      <h2 className={`text-3xl md:text-8xl font-light tracking-tighter uppercase transition-transform duration-150 ${isActive ? 'translate-x-6' : 'translate-x-0'}`}>
                        {project.title}
                      </h2>
                      <div className="hidden md:flex items-center gap-4 text-[12px] font-mono uppercase tracking-[0.4em] opacity-40">
                        <span>{project.role}</span>
                        {project.ongoing && <span className="text-green-500 border border-green-500/20 px-2 py-1 rounded-sm">In Devlopment</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default WorksPage;