import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

// --- Types ---
interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string; // URL or path
  link: string;
}

interface LatestProjectsProps {
  theme?: 'dark' | 'light';
}

// --- Dummy Data ---
const projects: Project[] = [
  {
    id: '01',
    title: 'Aether Lens',
    category: 'Spatial Computing',
    year: '2024',
    description: 'A mixed-reality interface designed for precision engineering. Focusing on hand-tracking latency and holographic object permanence.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Abstract tech image
    link: '/work/aether-lens',
  },
  {
    id: '02',
    title: 'Onyx Banking',
    category: 'Fintech Mobile App',
    year: '2023',
    description: 'Redefining the mobile banking experience by removing friction. Biometric fluid navigation and zero-UI transaction layers.',
    image: 'https://images.unsplash.com/photo-1481487484168-9b930d940884?q=80&w=2670&auto=format&fit=crop', // Abstract structure
    link: '/work/onyx',
  },
  {
    id: '03',
    title: 'Mute / Mode',
    category: 'E-Commerce Experience',
    year: '2023',
    description: 'A brutally minimalist fashion e-commerce platform. Heavy use of negative space and typographic hierarchy to drive conversion.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2648&auto=format&fit=crop', // Abstract minimalist
    link: '/work/mute-mode',
  },
];

export const LatestProjects: React.FC<LatestProjectsProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  // Theme Classes
  const bgClass = isDark ? 'bg-black' : 'bg-zinc-50';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const borderClass = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const buttonHover = isDark ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white';

  return (
    <section className={`relative w-full py-24 md:py-32 px-6 md:px-12 ${bgClass} ${textPrimary}`}>
      
      {/* Continuity Grain Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative z-10">
        
        {/* --- STICKY HEADER (Left Margin) --- */}
        <aside className="lg:col-span-4 h-fit lg:sticky lg:top-32 flex flex-col justify-between">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <span className={`w-12 h-[1px] ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`}></span>
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

          {/* Navigation to Main Project Page */}
          <div className="hidden lg:block mt-24">
            <a 
              href="/projects" 
              className={`group inline-flex items-center gap-4 px-8 py-4 rounded-full border ${borderClass} transition-all duration-300 ${buttonHover}`}
            >
              <span className="uppercase tracking-[0.2em] text-xs font-bold">View Full Archive</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </aside>

        {/* --- PROJECT LIST (Right Content) --- */}
        <div className="lg:col-span-8 flex flex-col gap-20 md:gap-32">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              theme={theme} 
              index={index}
            />
          ))}

          {/* Mobile Only 'View All' Button */}
          <div className="lg:hidden pt-8 border-t border-zinc-800/50">
             <a 
              href="/projects" 
              className={`flex items-center justify-between w-full py-6 group`}
            >
              <span className="text-2xl font-light tracking-tight">View Full Archive</span>
              <div className={`w-12 h-12 rounded-full border ${borderClass} flex items-center justify-center transition-colors ${buttonHover}`}>
                 <ArrowRight className="w-5 h-5" />
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

// --- Individual Project Card Component ---
const ProjectCard: React.FC<{ project: Project; theme: string; index: number }> = ({ project, theme, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const borderClass = isDark ? 'border-zinc-800' : 'border-zinc-200';

  // Parallax Effect for Image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Image moves slightly slower than container to create depth
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.0]);

  return (
    <div ref={containerRef} className="group relative w-full flex flex-col gap-6">
      
      {/* 1. Header Info (Staggers in) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-zinc-800/20"
      >
        <div>
          <span className={`block font-mono text-xs mb-2 ${textSecondary}`}>0{index + 1} / {project.year}</span>
          <h3 className="text-3xl md:text-4xl font-medium tracking-tight">{project.title}</h3>
        </div>
        <div className="flex items-center gap-2">
           <span className={`text-xs uppercase tracking-wider font-bold ${textSecondary}`}>{project.category}</span>
        </div>
      </motion.div>

      {/* 2. The Image Window (Parallax) */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-zinc-900">
        <motion.div 
            style={{ y, scale }}
            className="w-full h-[120%]" // Height > 100% for parallax room
        >
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-opacity duration-700 hover:opacity-80"
          />
        </motion.div>
        
        {/* Overlay Hover Interaction */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[2px]">
          <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
             <ArrowUpRight size={32} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* 3. Description & Link */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
        <div className="md:col-span-8 md:col-start-1">
          <p className={`text-lg leading-relaxed ${textSecondary} max-w-2xl`}>
            {project.description}
          </p>
        </div>
        <div className="md:col-span-4 flex justify-start md:justify-end items-start">
           <a 
             href={project.link} 
             className={`inline-block text-xs font-mono uppercase underline decoration-1 underline-offset-4 hover:decoration-2 ${textSecondary} hover:${isDark ? 'text-white' : 'text-black'} transition-all`}
           >
             Read Case Study
           </a>
        </div>
      </div>

    </div>
  );
};

export default LatestProjects;