import React, { useRef } from 'react';
import type { ProjectFactoryEntry } from '../ProjectDetailWrapper';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Disc } from 'lucide-react';

const textReveal: Variants = {
  hidden: { y: '120%', transition: { ease: [0.45, 0, 0.55, 1], duration: 0.85 } },
  visible: { y: '0%', transition: { ease: [0.19, 1, 0.22, 1], duration: 1.2 } }
};

// Variants for the scroll-triggered description section
const descHeadingVariants: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: '0%',
    transition: { ease: [0.19, 1, 0.22, 1], duration: 1.4 },
  },
};

const descParaVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.19, 1, 0.22, 1], duration: 1.2, delay: 0.2 },
  },
};

interface ProjectDetailProps {
  project: any;
  theme?: 'dark' | 'light';
  onBack: () => void;
  factory: ProjectFactoryEntry;
}

// ─── Components ──────────────────────────────────────────────────────────────

const CustomTag = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full w-fit">
    <Disc size={16} className="animate-spin text-green-500" />
    <span className="text-white font-mono text-[10px] uppercase tracking-widest leading-none">{label}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ProjectDetail = ({ project, theme = 'dark', onBack, factory }: ProjectDetailProps) => {
  const isDark = theme === 'dark';
  const containerRef = useRef(null);

  // Global scroll for hero parallax only
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const scaleParallax = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const colors = {
    bg: isDark ? 'bg-[#050505]' : 'bg-zinc-50',
    text: isDark ? 'text-white' : 'text-zinc-900',
    textMuted: isDark ? 'text-white/40' : 'text-zinc-500',
    border: isDark ? 'border-white/10' : 'border-zinc-200',
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${colors.bg} ${colors.text} selection:bg-green-500 selection:text-black overflow-x-hidden`}
    >
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-16 py-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-200"
        >
          <span className="w-8 h-px bg-current inline-block" />
          Back
        </button>
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{project.number}</span>
      </nav>

      {/* ── HEADER ── */}
      <header className="h-[95vh] w-full flex items-center px-6 md:px-16 pt-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 overflow-hidden">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="text-[16vw] md:text-[12vw] leading-[0.78] font-black uppercase tracking-tighter"
            >
              <motion.div variants={textReveal} className="italic block">
                {project.title.split(' ')[0]}
              </motion.div>
              <motion.div variants={textReveal} className="block">
                {project.title.split(' ').slice(1).join(' ') || 'Vision'}
                <span className="text-green-500 not-italic">.</span>
              </motion.div>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="lg:col-span-4 flex flex-col gap-12 pb-6"
          >
            <p className={`${colors.textMuted} text-lg font-light leading-relaxed max-w-sm`}>
              {project.overview ||
                `Establishing a new digital standard for ${project.role}. Focus on cinematic visual depth.`}
            </p>
            <div className={`flex gap-16 border-t ${colors.border} pt-8`}>
              <div>
                <span className={`text-[9px] font-mono ${colors.textMuted} uppercase tracking-[0.3em] block mb-2`}>Role</span>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase">{project.role}</span>
              </div>
              <div>
                <span className={`text-[9px] font-mono ${colors.textMuted} uppercase tracking-[0.3em] block mb-2`}>Year</span>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase">2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="h-screen w-full px-2 md:px-4 pb-4 relative overflow-hidden">
        <div className="absolute top-12 left-12 z-20">
          <CustomTag label="Master Sequence 01" />
        </div>
        <div className="w-full h-full bg-zinc-900 overflow-hidden relative rounded-sm">
          {(() => {
            const mediaType = project.heroMediaType || (project.video ? 'video' : 'image');
            const mediaSrc = mediaType === 'video' ? project.video : project.image;

            return mediaType === 'video' ? (
              <motion.video
                style={{ y: yParallax, scale: scaleParallax }}
                src={mediaSrc}
                autoPlay
                muted
                loop
                className="w-full h-[130%] object-cover"
              />
            ) : (
              <motion.img
                style={{ y: yParallax, scale: scaleParallax }}
                src={mediaSrc}
                alt={project.title}
                className="w-full h-[130%] object-cover"
              />
            );
          })()}
        </div>
      </section>

      {/* ── CONTINUOUS SCROLL DESCRIPTION ── */}
      {/*
        Root cause of the bug: useScroll({ target: ref }) is unreliable when the
        scrolling container is the window but the component mounts mid-page.
        Fix: use Framer Motion's whileInView + variant system instead.
        - The section itself is the motion element with initial/whileInView states.
        - overflow-hidden is ONLY on the inner heading wrapper div, never the section.
        - amount: 0.15 fires as soon as 15% of the section is visible.
        - once: false lets it re-animate if the user scrolls back up.
      */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="relative py-[30vh] px-6 md:px-16 w-full flex flex-col justify-center border-b border-white/5"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Heading with mask-reveal */}
          <div className="lg:col-span-5">
            {/* overflow-hidden only here — clips the upward-sliding heading */}
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <motion.h2
                variants={descHeadingVariants}
                className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]"
              >
                {project.descriptionTitle || 'Logic & System'}
              </motion.h2>
            </div>
          </div>

          {/* Body copy fade-up */}
          <div className="lg:col-span-7 flex items-end">
            <motion.p
              variants={descParaVariants}
              className={`${colors.textMuted} text-xl md:text-2xl leading-relaxed max-w-2xl font-light`}
            >
              {project.fullDescription || 'Loading narrative...'}
            </motion.p>
          </div>

        </div>
      </motion.section>

      {/* ── CONTENT FACTORY — unique per project ── */}
      <section className="px-2 md:px-4 py-[15vh] space-y-4">

        {/* BLOCK 1 — tall left + two stacked right */}
        <div className="flex flex-col lg:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-7/12 relative"
          >
            <div className="absolute top-8 left-8 z-10">
              <CustomTag label={factory.tags[0]} />
            </div>
            <div className="w-full min-h-[160vh] bg-zinc-900/40 rounded-sm overflow-hidden">
              {factory.media[0].type === 'video' ? (
                <video
                  src={factory.media[0].src}
                  className="w-full h-full object-cover block"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={factory.media[0].src}
                  className="w-full h-full object-cover block"
                  alt={factory.tags[0]}
                />
              )}
            </div>
          </motion.div>

          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-full h-[70vh] bg-zinc-900/40 relative rounded-sm overflow-hidden group"
            >
              <div className="absolute top-6 left-6 z-10">
                <CustomTag label={factory.tags[1]} />
              </div>
              {factory.media[1].type === 'video' ? (
                <video
                  src={factory.media[1].src}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={factory.media[1].src}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt={factory.tags[1]}
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full h-[85vh] bg-zinc-900/40 relative rounded-sm overflow-hidden group"
            >
              <div className="absolute top-6 left-6 z-10">
                <CustomTag label={factory.tags[2]} />
              </div>
              {factory.media[2].type === 'video' ? (
                <video
                  src={factory.media[2].src}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={factory.media[2].src}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt={factory.tags[2]}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* BLOCK 2 — tall right + single tall left */}
        <div className="flex flex-col lg:flex-row-reverse gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-7/12 relative"
          >
            <div className="absolute top-8 left-8 z-10">
              <CustomTag label={factory.tags[3]} />
            </div>
            <div className="w-full min-h-[140vh] bg-zinc-900/40 rounded-sm overflow-hidden">
              {factory.media[3].type === 'video' ? (
                <video
                  src={factory.media[3].src}
                  className="w-full h-full object-cover block"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={factory.media[3].src}
                  className="w-full h-full object-cover block"
                  alt={factory.tags[3]}
                />
              )}
            </div>
          </motion.div>

          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-full h-[135vh] bg-zinc-900/40 relative rounded-sm overflow-hidden group"
            >
              <div className="absolute top-6 left-6 z-10">
                <CustomTag label={factory.tags[4]} />
              </div>
              {factory.media[4].type === 'video' ? (
                <video
                  src={factory.media[4].src}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={factory.media[4].src}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  alt={factory.tags[4]}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* BLOCK 3 — full-width finale */}
        <div className="w-full min-h-screen bg-zinc-900/40 relative rounded-sm overflow-hidden mt-20">
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <h2 className="text-[15vw] font-black uppercase opacity-5 tracking-tighter">Execution</h2>
          </div>
          <div className="absolute top-12 left-12 z-20">
            <CustomTag label="Final Build" />
          </div>
          <img
            src={project.image}
            className="w-full h-auto block"
            alt="Final Build"
          />
        </div>

      </section>
    </motion.div>
  );
};

export default ProjectDetail;