

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MessageSquare, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

interface ContactProps {
  theme?: 'dark' | 'light';
}

export const ContactCompact: React.FC<ContactProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle parallax for the background text
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });
  const xTranslate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const bgClass = isDark ? 'bg-black' : 'bg-zinc-50';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const accentColor = isDark ? 'bg-zinc-100 text-black' : 'bg-black text-white';



  const navigate = useNavigate();

  return (
    <section 
      ref={containerRef}
      className={`relative w-full overflow-hidden py-20 md:py-32 ${bgClass} ${textPrimary}`}
    >
      {/* Playful Moving Background Text */}
      <motion.div 
        style={{ x: xTranslate }}
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none opacity-[0.03] select-none"
      >
        <span className="text-[20vw] font-black uppercase tracking-tighter"
        >
          Let's Build Something Better Together — Let's Build Something Better Together —
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Status Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Inbox Open</span>
        </motion.div>

        {/* Main Pitch */}
        <h2 className="text-5xl md:text-8xl font-light tracking-tighter mb-12">
          Got an idea?<br />
          <span className="italic font-serif">Don't be a stranger.</span>
        </h2>

        {/* Magnetic-style CTA Button */}
        <motion.div
          onClick={() => navigate("/fullcontact")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative flex items-center gap-4 px-10 py-6 rounded-full text-xl font-medium transition-all duration-300 ${accentColor}`}
        >
          <span
          >
            Hit me up
            </span>
          <div className="bg-green-500 rounded-full p-1 group-hover:-rotate-45 transition-transform duration-300">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* Simple Footer Links */}
        <div className="mt-24 w-full pt-12 border-t border-zinc-800/20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8">
            <SocialLink href="#" icon={<Github size={20} />} label="GitHub" theme={theme} />
            <SocialLink href="#" icon={<Linkedin size={20} />} label="LinkedIn" theme={theme} />
            <SocialLink href="#" icon={<Twitter size={20} />} label="Twitter" theme={theme} />
          </div>
          
          <div className={`text-[10px] font-mono uppercase tracking-widest ${textSecondary}`}>
            Handcrafted in 2025 • Stay Curious
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialLink = ({ href, icon, label, theme }: { href: string, icon: React.ReactNode, label: string, theme: string }) => {
  const isDark = theme === 'dark';
  return (
    <a 
      href={href} 
      className={`group flex items-center gap-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </span>
    </a>
  );
};

export default ContactCompact;