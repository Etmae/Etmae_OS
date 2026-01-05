import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, ArrowUp, ShieldCheck } from 'lucide-react';

export const SystemFooter = ({ theme = 'dark' }: { theme?: 'dark' | 'light' }) => {
  const isDark = theme === 'dark';
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const borderClass = isDark ? 'border-zinc-800' : 'border-zinc-200';

  return (
    <footer className={`w-full py-12 px-6 md:px-12 border-t ${borderClass} ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Row: Terminal Readout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${textSecondary}`}>
                System Status: Operational
              </span>
            </div>
            <p className="text-xs font-mono leading-relaxed opacity-60">
              Build: 2025.04.12_v2 <br />
              Environment: Production <br />
              Latency: 24ms
            </p>
          </div>

          <div className="space-y-4">
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${textSecondary}`}>Navigation</span>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-green-500 transition-colors">Work</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Lab</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">About</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${textSecondary}`}>Socials</span>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-green-500 transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">Read.cv</a></li>
            </ul>
          </div>

          <div className="flex flex-col justify-between items-start md:items-end">
             <button 
              onClick={scrollToTop}
              className={`group flex items-center gap-3 px-4 py-2 border ${borderClass} rounded-full hover:border-green-500/50 transition-all`}
             >
               <span className="text-[10px] font-mono uppercase tracking-widest group-hover:text-green-500 transition-colors">Reboot to top</span>
               <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform group-hover:text-green-500" />
             </button>
          </div>
        </div>

        {/* Bottom Row: The "Physical" License Plate */}
        <div className={`pt-8 border-t ${borderClass} flex flex-col md:flex-row justify-between items-center gap-6`}>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Cpu size={14} className={textSecondary} />
              <span className={`text-[10px] font-mono uppercase tracking-tighter ${textSecondary}`}>
                Engineered for Performance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className={textSecondary} />
              <span className={`text-[10px] font-mono uppercase tracking-tighter ${textSecondary}`}>
                Secure Architecture
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <span className={`text-[10px] font-mono uppercase tracking-[0.4em] ${textSecondary}`}>
              © 2025 // Etmae
            </span>
            <span className="text-[9px] font-mono opacity-30 mt-1 uppercase">
              Designed as a living system. All rights reserved.
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};