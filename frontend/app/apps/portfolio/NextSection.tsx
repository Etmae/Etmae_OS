import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface NextSectionProps {
  theme?: 'dark' | 'light';
}

const NextSection: React.FC<NextSectionProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  // Color matching is critical here. 
  // If the hero image fades to black, this must be black.
  const bgColor = isDark ? 'bg-black' : 'bg-zinc-100';
  const textColor = isDark ? 'text-zinc-200' : 'text-zinc-800';
  const subTextColor = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-300';

  return (
    <section className={`relative w-full min-h-screen px-6 py-24 md:px-12 md:py-32 ${bgColor} ${textColor}`}>
      
      {/* Continuity Grain Layer - Keeps the texture from the hero alive */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header - Staggers in as you arrive */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-8">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight"
            >
              Designing digital interfaces that feel <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>physical</span>, <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>reactive</span>, and <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>human</span>.
            </motion.h2>
          </div>
          <div className="md:col-span-4 flex items-end justify-start md:justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1 }}
              className={`flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase ${subTextColor}`}
            >
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-500' : 'bg-green-600'} animate-pulse`} />
              Available for work
            </motion.div>
          </div>
        </div>

        {/* Selected Works Grid */}
        <div className="w-full border-t border-b border-zinc-800/50">
           {projects.map((project, index) => (
             <ProjectRow 
               key={index} 
               index={index} 
               project={project} 
               isDark={isDark} 
               subTextColor={subTextColor}
               borderColor={borderColor}
             />
           ))}
        </div>
      </div>
    </section>
  );
};

// Sub-component for clean rows
const ProjectRow = ({ index, project, isDark, subTextColor, borderColor }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`group relative flex flex-col md:flex-row items-baseline md:items-center justify-between py-12 md:py-16 border-b ${borderColor} cursor-pointer transition-colors hover:bg-white/5`}
    >
      <div className="flex items-baseline gap-8 md:gap-16">
        <span className={`text-xs font-mono opacity-50 ${subTextColor}`}>0{index + 1}</span>
        <h3 className="text-3xl md:text-5xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out">
          {project.title}
        </h3>
      </div>
      
      <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
        <span className={`text-sm tracking-wider ${subTextColor} uppercase`}>{project.category}</span>
        <ArrowRight className={`w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ${isDark ? 'text-white' : 'text-black'}`} />
      </div>
    </motion.div>
  );
};

const projects = [
  { title: "Lumina Interface", category: "Fintech App" },
  { title: "Vesper Architecture", category: "Web Design" },
  { title: "Apex Systems", category: "Design System" },
];

export default NextSection;