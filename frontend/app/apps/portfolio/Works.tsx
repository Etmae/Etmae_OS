import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe } from 'lucide-react';

interface Project {
  id: string;
  number: string;
  title: string;
  role: string;
  ongoing?: boolean;
  image: string;
  column: 'left' | 'right';
  aspect: string; // e.g., 'aspect-[4/3]' or 'aspect-square'
}

const PROJECTS: Project[] = [
  { 
    id: 'pipeline', 
    number: '01', 
    title: 'PIPELINE GARDEN', 
    role: 'Full-Stack Integration', 
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964', 
    column: 'left',
    aspect: 'aspect-[4/3]'
  },
  { 
    id: 'squadron', 
    number: '02', 
    title: 'SQUADRON', 
    role: 'Frontend & 3D WebGL', 
    ongoing: true, 
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070', 
    column: 'right',
    aspect: 'aspect-square'
  },
  { 
    id: 'looms', 
    number: '03', 
    title: 'LOOMS & AURA', 
    role: 'Frontend & Motion Physics', 
    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2070', 
    column: 'left',
    aspect: 'aspect-[16/10]'
  },
  { 
    id: 'hospital', 
    number: '04', 
    title: 'HOSPITAL CORE', 
    role: 'Database Architecture (3NF)', 
    ongoing: true,
    image: 'https://images.unsplash.com/photo-1504813184591-01592fd03cfd?q=80&w=2070', 
    column: 'right',
    aspect: 'aspect-[3/4]'
  }
];

export const WorksPage = () => {
  return (
    <div className="bg-black min-h-screen w-full text-white selection:bg-white selection:text-black">
      {/* HEADER: Positioned as per edited-image.png annotations */}
      <nav className="fixed top-0 left-0 w-full z-50 p-8 md:p-12 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono tracking-[0.4em] opacity-40 uppercase">Step 01 — 05</span>
          <h1 className="text-xl font-light tracking-tighter uppercase">Index ’25—’26</h1>
        </div>
        <div className="hidden md:flex gap-12 font-mono text-[10px] uppercase tracking-[0.3em] pointer-events-auto">
          <span className="cursor-pointer hover:opacity-50 transition-opacity">Home</span>
          <span className="cursor-pointer hover:opacity-50 transition-opacity underline underline-offset-8">Work</span>
          <span className="cursor-pointer hover:opacity-50 transition-opacity">About</span>
          <span className="cursor-pointer hover:opacity-50 transition-opacity">Contact</span>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto pt-[25vh] pb-[20vh] px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 md:gap-x-24">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-[15vh]">
            {PROJECTS.filter(p => p.column === 'left').map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>

          {/* RIGHT COLUMN (Lowered as per Home.png rhythm) */}
          <div className="flex flex-col gap-[15vh] mt-[20vh]">
            {PROJECTS.filter(p => p.column === 'right').map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER: Fixed at bottom with coordinates from edited-image.png */}
      <footer className="w-full p-8 md:p-12 flex justify-between items-end border-t border-white/5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-green-500">
            <Globe size={12} />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Ibadan, NG // GMT+1</span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest opacity-30">Lat: 7.3775° N, Long: 3.9470° E</span>
        </div>
        <div className="flex gap-8 text-[11px] font-mono uppercase tracking-[0.2em] opacity-40">
          <span>Twitter</span><span>Github</span><span>LinkedIn</span>
        </div>
      </footer>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      {/* IMAGE CONTAINER WITH HIGH-END HOVER */}
      <div className={`relative w-full ${project.aspect} overflow-hidden bg-zinc-900`}>
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
        />
        
        {/* NUMBER OVERLAY */}
        <span className="absolute top-6 left-6 text-[10px] font-mono opacity-50 uppercase tracking-[0.3em] mix-blend-difference">{project.number}</span>

        {/* SWEEPING ARROW HOVER */}
        <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out">
          <ArrowUpRight size={20} strokeWidth={1.5} />
        </div>
      </div>

      {/* STACKED DETAILS AT LEFT MARGIN */}
      <div className="mt-8 flex flex-col items-start">
        <h2 className="text-3xl md:text-4xl font-light tracking-tighter uppercase leading-none">
          {project.title}
        </h2>
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] opacity-40 mt-3">
          {project.role}
        </span>
        
        {/* ONGOING INDICATOR */}
        {project.ongoing && (
          <div className="mt-6 flex items-center gap-3">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping absolute opacity-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span className="text-[9px] font-mono text-green-500 uppercase tracking-[0.3em] font-medium">In Development</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WorksPage;