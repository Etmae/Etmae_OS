import React, { useRef, useCallback } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { PortfolioSection } from '../hooks/useNavigation';
import { PROJECTS_DATA, type Project } from '../ProjectDetailWrapper';

// --- Types ---
interface LatestProjectsProps {
  theme?: 'dark' | 'light';
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
  onNavigate: (section: PortfolioSection) => void;
}

// Use only the first 3 projects for the "latest" showcase
const projects = PROJECTS_DATA.slice(0, 3);

export const LatestProjects: React.FC<LatestProjectsProps> = ({ 
  theme = 'dark', 
  scrollContainer, 
  scrollYProgress, 
  onNavigate 
}) => {
  const isDark = theme === 'dark';
  
  const bgClass = isDark ? 'bg-[#050505]' : 'bg-zinc-50';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const borderClass = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const buttonHover = isDark ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white';

  // ─── Section Navigation Handler ────────────────────────────────────────
  // This is the CORE pattern for in-page CTAs that lead to other sections
  const handleViewAllProjects = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent any default anchor behavior
      onNavigate('works'); // Trigger section switch via navigation hook
    },
    [onNavigate]
  );

  return (
    <section className={`relative w-full py-24 md:py-32 px-6 md:px-12 transition-colors duration-150 ${bgClass} ${textPrimary}`}>
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative z-10">
        
        <aside className="lg:col-span-4 h-fit lg:sticky lg:top-32 flex flex-col justify-between">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <span className={`w-12 h-px ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`}></span>
              <span className={`text-xs font-mono uppercase tracking-widest ${textSecondary}`}>Selected Work</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[0.9] mb-8">
              Recent<br />
              <span className={textSecondary}>Explorations</span>
            </h2>

            <p className={`max-w-xs text-sm leading-relaxed ${textSecondary}`}>
              A curated selection of digital products where function meets sensory design.
            </p>
          </div>

          {/* ─── DESKTOP "View Full Archive" Button ────────────────────── */}
          <div className="hidden lg:block mt-24">
            <button
              onClick={handleViewAllProjects}
              className={`group inline-flex items-center gap-4 px-8 py-4 rounded-full border ${borderClass} transition-all duration-150 ${buttonHover}`}
            >
              <span className="uppercase tracking-[0.2em] text-xs font-bold">View Full Archive</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </button>
          </div>
        </aside>

        <div className="lg:col-span-8 flex flex-col gap-20 md:gap-32">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              theme={theme}
              index={index}
              onNavigate={onNavigate}
            />
          ))}

          {/* ─── MOBILE "View Full Archive" Button ────────────────────── */}
          <div className="lg:hidden pt-8 border-t border-zinc-800/50">
            <button
              onClick={handleViewAllProjects}
              className={`flex items-center justify-between w-full py-6 group`}
            >
              <span className="text-2xl font-light tracking-tight">View Full Archive</span>
              <div className={`w-12 h-12 rounded-full border ${borderClass} flex items-center justify-center transition-colors ${buttonHover}`}>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- ProjectCard Sub-component ---
const ProjectCard: React.FC<{ 
  project: Project; 
  theme: string; 
  index: number;
  scrollContainer?: React.RefObject<HTMLDivElement>;
  onNavigate: (section: PortfolioSection) => void;
}> = ({ project, theme, index, scrollContainer, onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div ref={containerRef} className="group relative w-full flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-zinc-800/20"
      >
        <div>
          <span className={`block font-mono text-xs mb-2 ${textSecondary}`}>{project.number} / 2024</span>
          <h3 className="text-3xl md:text-4xl font-medium tracking-tight">{project.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs uppercase tracking-wider font-bold ${textSecondary}`}>{project.role}</span>
        </div>
      </motion.div>

      <div className="relative w-full aspect-4/3 md:aspect-video overflow-hidden bg-zinc-900">
        <motion.div className="w-full h-[120%]">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-opacity duration-150 hover:opacity-80"
          />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black/20 backdrop-blur-[2px]">
          <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-150">
            <ArrowUpRight size={32} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
        <div className="md:col-span-8 md:col-start-1">
          <p className={`text-lg leading-relaxed ${textSecondary} max-w-2xl`}>
            {project.fullDescription}
          </p>
        </div>
        <div className="md:col-span-4 flex justify-start md:justify-end items-start">
          <button 
            onClick={() => onNavigate('project-detail')}
            className={`inline-block text-xs font-mono uppercase underline decoration-1 underline-offset-4 hover:decoration-2 ${textSecondary} hover:${isDark ? 'text-white' : 'text-black'} transition-all`}
          >
            View Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestProjects;