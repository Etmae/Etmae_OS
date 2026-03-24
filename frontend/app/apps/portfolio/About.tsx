import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  Cpu, Music, Disc, ArrowLeft, ArrowRight,
  ExternalLink, Plus, Users, Download, ShieldCheck, Github, Linkedin, Twitter, Instagram, Mail
} from 'lucide-react';
import { RevealOnScroll } from './components/RevealOnScroll';

// --- Data ---
const circleNodes = [
  {
    id: 0,
    name: "Serhii Kirkin",
    role: "UI/UX Architect",
    link: "https://portfolio.serhii.com",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    avatar: "https://i.pravatar.cc/150?u=serhii",
    tagline: "The 'Keep Building' Crooner",
    bio: "Architecting visual systems where every pixel has a purpose. If it's not intuitive, it's not finished.",
    work: "Visual Logic / System Design",
    tags: ["#SystemDesign", "#LegoLogic"]
  },
  {
    id: 1,
    name: "Alex Rivera",
    role: "Blockchain Dev",
    link: "https://github.com/alex-rivera",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    avatar: "https://i.pravatar.cc/150?u=alex",
    tagline: "The Gas Fee Whisperer",
    bio: "Writing smart contracts that are actually smart. Obsessed with trustless systems and zero-knowledge proofs.",
    work: "Rust / Solidity / Cryptography",
    tags: ["#Web3", "#Solidity"]
  },
  {
    id: 2,
    name: "Jordan T.",
    role: "Backend Architect",
    link: "https://linkedin.com/in/jordan-t",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    avatar: "https://i.pravatar.cc/150?u=jordan",
    tagline: "The Memory Leak Exorcist",
    bio: "Concurrency is a symphony, and I'm the conductor. Ensuring high-availability for the heaviest stacks.",
    work: "Distributed Systems / Go",
    tags: ["#Concurrency", "#GoLang"]
  },
  {
    id: 3,
    name: "Taylor Chen",
    role: "Product Designer",
    link: "https://dribbble.com/taylor-chen",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    avatar: "https://i.pravatar.cc/150?u=taylor",
    tagline: "The Pixel Perfectionist",
    bio: "Designing experiences that feel as good as they look.",
    work: "Product Design / UX",
    tags: ["#Design", "#UX"]
  },
  {
    id: 4,
    name: "Marcus Lee",
    role: "DevOps Engineer",
    link: "https://linkedin.com/in/marcus-lee",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    tagline: "The Deployment Whisperer",
    bio: "Automating everything that moves—and fixing what breaks.",
    work: "CI/CD / Cloud Infrastructure",
    tags: ["#DevOps", "#Cloud"]
  }
];

// --- Sub-Component: Circular Progress Avatar ---
const NavAvatar = ({ node, isActive, progress, onClick, isDark }: { node: any; isActive: boolean; progress: number; onClick: () => void; isDark: boolean }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button onClick={onClick} className="relative group flex items-center justify-center p-1">
      <svg className="w-14 h-14 transform -rotate-90 absolute">
        <circle cx="28" cy="28" r={radius} fill="transparent" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1.5" />
        {isActive && (
          <motion.circle
            cx="28" cy="28" r={radius} fill="transparent" stroke="#22c55e" strokeWidth="2"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        )}
      </svg>
      <div className={`relative w-10 h-10 rounded-full overflow-hidden border transition-all duration-500 
        ${isActive ? 'border-green-500 scale-110' : 'border-transparent opacity-40 grayscale group-hover:grayscale-0'}`}>
        <img src={node.avatar} alt={node.name} className="w-full h-full object-cover" />
      </div>
    </button>
  );
};

// --- HeroZoom (Sticky Logic) ---
const HeroZoom = ({ scrollContainer, panelHeight, bgClass, textClass }: { scrollContainer: React.RefObject<HTMLDivElement>; panelHeight: number; bgClass: string; textClass: string }) => {
  const rawProgress = useMotionValue(0);
  const smooth = useSpring(rawProgress, { stiffness: 150, damping: 30 });
  const worldScale = useTransform(smooth, [0, 0.4, 0.9, 1], [1, 1, 25, 40]);
  const uiOpacity = useTransform(smooth, [0, 0.7, 0.9], [1, 1, 0]);
  const finishFill = useTransform(smooth, [0.85, 0.95], [0, 1]);

  useEffect(() => {
    const el = scrollContainer?.current || window;
    const update = () => {
      const scrollY = scrollContainer?.current ? scrollContainer.current.scrollTop : window.scrollY;
      rawProgress.set(Math.min(1, Math.max(0, scrollY / panelHeight)));
    };
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [scrollContainer, panelHeight]);

  return (
    <div style={{ height: panelHeight }} className="sticky top-0 w-full overflow-hidden z-10 flex items-center justify-center pointer-events-none">
      <motion.div style={{ scale: worldScale }} className="absolute inset-0 flex items-center justify-center">
        <motion.div style={{ opacity: uiOpacity }} className="text-center">
          <span className={`text-[10px] font-mono uppercase tracking-[0.8em] opacity-40 ${textClass}`}>System // ABOUT</span>
          <h1 className={`text-[12vw] font-black italic uppercase leading-none ${textClass}`}>IDENTITY</h1>
        </motion.div>
      </motion.div>
      <motion.div style={{ opacity: finishFill }} className={`absolute inset-0 z-20 ${bgClass}`} />
    </div>
  );
};

// --- X (Twitter) Icon SVG ---
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.735-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const AboutPage = ({ theme = 'dark', scrollContainer }: { theme?: string; scrollContainer: React.RefObject<HTMLDivElement> }) => {
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const [panelHeight, setPanelHeight] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 20 });
  const tiltY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: { currentTarget: { getBoundingClientRect: () => any; }; clientX: number; clientY: number; }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  useEffect(() => {
    const h = scrollContainer?.current ? scrollContainer.current.clientHeight : window.innerHeight;
    setPanelHeight(h);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleManualNav((activeIndex + 1) % circleNodes.length, 1);
          return 0;
        }
        return prev + 0.35;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [activeIndex, scrollContainer]);

  const handleManualNav = (index: React.SetStateAction<number>, dir: React.SetStateAction<number>) => {
    setDirection(dir);
    setActiveIndex(index);
    setProgress(0);
  };

  const colors = {
    bg: isDark ? 'bg-[#050505]' : 'bg-zinc-50',
    text: isDark ? 'text-white' : 'text-zinc-900',
    textMuted: isDark ? 'text-white/40' : 'text-zinc-500',
    border: isDark ? 'border-white/10' : 'border-zinc-200',
    sliderBg: isDark ? 'bg-zinc-900' : 'bg-zinc-200'
  };

  // Social links data matching reference image style
  const socialLinks = [
    { icon: <XIcon size={18} />, label: 'Follow on X', href: '#' },
    { icon: <Instagram size={18} />, label: 'Follow on Instagram', href: '#' },
    { icon: <Github size={18} />, label: 'Follow on GitHub', href: '#' },
    { icon: <Linkedin size={18} />, label: 'Follow on LinkedIn', href: '#' },
  ];

  return (
    <div className={`relative w-full ${colors.bg} transition-colors duration-700`}>
      {/* 1. HERO ZOOM */}
      <div style={{ height: panelHeight * 2.5 || '250vh' }} className="relative w-full">
        <HeroZoom scrollContainer={scrollContainer} panelHeight={panelHeight} bgClass={colors.bg} textClass={colors.text} />
      </div>

      <div className="relative z-30 w-full">

        {/* 2. SPOTLIGHT INTRODUCTION */}
        <section className={`py-40 px-6 md:px-24 ${colors.bg}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

            {/* LEFT: Visual Stack — image card + social links */}
            <div className="lg:col-span-5 order-1 lg:order-1 lg:sticky lg:top-32">
              <RevealOnScroll>
                <div className="relative">
                  {/* Tilted Image Frame */}
                  <div className="relative group">
                    <div className="absolute -inset-4 border border-green-500/10 rounded-3xl rotate-3 group-hover:rotate-0 transition-transform duration-1000" />

                    <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-1000">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974"
                        alt="Elijah Olujimi"
                        className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                      />

                      <div className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-green-500 shadow-2xl">
                        <ShieldCheck size={24} />
                      </div>
                    </div>
                  </div>
                  {/* ── Social Links — reference image style ── */}
                  <div className={`mt-10 rounded-2xl border ${colors.border} overflow-hidden divide-y ${isDark ? 'divide-white/10' : 'divide-zinc-200'}`}>
                    {socialLinks.map(({ icon, label, href }, i) => (
                      <a
                        key={i}
                        href={href}
                        className={`
                          flex items-center gap-4 px-5 py-4
                          ${isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'}
                          transition-all duration-200 group/link
                        `}
                      >
                        <span className="text-green-500 shrink-0">{icon}</span>
                        <span className={`text-sm font-medium flex-1`}>{label}</span>
                        <ExternalLink
                          size={13}
                          className="opacity-0 group-hover/link:opacity-40 transition-opacity shrink-0"
                        />
                      </a>
                    ))}
                  </div>

                  {/* Email row — separated, matching reference */}
                  <div className={`mt-3 flex items-center gap-4 px-5 py-4 rounded-2xl border ${colors.border} ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                    <Mail size={16} className="text-green-500 shrink-0" />
                    <span className="text-sm font-mono">elijah@signal.dev</span>
                  </div>

                  {/* Mobile CV Button */}
                  <div className="mt-8 lg:hidden">
                    <button className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-green-500 text-black font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                      <Download size={18} /> Download CV
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* RIGHT: Text Content */}
            {/* RIGHT: Text Content */}
            <div className="lg:col-span-7 order-2 lg:order-2">
              <RevealOnScroll>
                <h2 className={`text-5xl md:text-8xl font-bold tracking-tighter ${colors.text} mb-12`}>
                  I'm Elijah. I build digital systems that <span className="text-green-500 italic">last</span>.
                </h2>

                <div className={`max-w-xl space-y-8 text-lg md:text-xl leading-relaxed ${colors.text} opacity-75 font-light`}>
                  <p>
                    I'm a full-stack engineer with a deep focus on
                    <span className="text-green-500 font-medium"> security-first architecture</span> and
                    <span className="text-green-500 font-medium"> immersive interface design</span>. I don't just ship features — I engineer systems that are resilient under pressure and elegant under scrutiny.
                  </p>
                  <p>
                    My work spans the full spectrum: from crafting pixel-precise frontends with fluid motion, to designing distributed backends where uptime is non-negotiable. Every layer of the stack gets the same obsessive attention.
                  </p>
                  <p>
                    Whether I'm locking down an authentication flow, architecting a real-time data pipeline, or refining a micro-interaction — my standard is the same:
                    <span className="italic text-green-500/80"> if the seams show, it's not done.</span>
                  </p>
                </div>

                <div className="mt-20 hidden lg:block">
                  <button className={`group flex items-center gap-4 px-10 py-5 rounded-full border ${colors.border} ${colors.text} hover:bg-white hover:text-black transition-all duration-700 font-mono text-[10px] tracking-[0.3em] uppercase`}>
                    <Download size={16} className="group-hover:-translate-y-1 transition-transform" />
                    Download Curriculum Vitae
                  </button>
                </div>
              </RevealOnScroll>
            </div>

          </div>
        </section>

        {/* 3. SONIC ENGINE */}
        <section className={`py-40 px-6 md:px-24 border-y ${colors.border} relative overflow-hidden`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

            {/* LEFT: Text Content */}
            <div className="lg:col-span-6 z-10 lg:sticky lg:top-32">
              <RevealOnScroll>
                <div className="flex items-center gap-3 mb-8">
                  <Music size={20} className="text-green-500" />
                  <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${colors.textMuted}`}>Sonic Signal</span>
                </div>

                <h3 className={`text-6xl md:text-8xl font-black italic uppercase leading-[0.85] mb-12 ${colors.text}`}>
                  The <br /><span className="text-green-500">Rhythm</span> <br />of Code
                </h3>

                <div className={`space-y-7 text-lg md:text-xl leading-relaxed ${colors.text} opacity-75 font-light max-w-lg`}>
                  <p>
                    Before there was ever a line of code, there was sound. I grew up fluent in three instruments — the warm tension of
                    <span className="text-green-500 font-medium"> guitar strings</span>, the soaring precision of a
                    <span className="text-green-500 font-medium"> violin</span>, and the bold, chest-filling resonance of a
                    <span className="text-green-500 font-medium"> trumpet</span>.
                  </p>
                  <p>
                    Music taught me that silence is not empty — it's structural. That tension exists to be resolved. That the space between notes is just as intentional as the notes themselves.
                  </p>
                  <p>
                    I perform whenever the room will have me. Sometimes in studios, sometimes in dim-lit venues where the audience feels the bass before they hear it. That communion between sound and soul never gets old.
                  </p>
                </div>

                {/* Animated waveform */}
                <div className="mt-14 flex items-end gap-1 h-10">
                  {[...Array(28)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [6, 32 + Math.sin(i) * 10, 10, 40, 6] }}
                      transition={{ duration: 1.8 + i * 0.05, repeat: Infinity, delay: i * 0.07 }}
                      className="w-1 bg-green-500/40 rounded-full shrink-0"
                    />
                  ))}
                </div>
              </RevealOnScroll>
            </div>

            {/* RIGHT: Image Card */}
            <div className="lg:col-span-6 order-first lg:order-0">
              <RevealOnScroll>
                <div className="relative group">
                  {/* Decorative border frame */}
                  <div className="absolute -inset-4 border border-green-500/10 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-1000" />

                  {/* Main image */}
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-1000">
                    <img
                      src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070"
                      alt="Playing an instrument"
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                    {/* Now Playing badge */}
                    <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full">
                        <Disc size={16} className="animate-spin text-green-500" />
                        <span className="text-white font-mono text-[10px] uppercase tracking-widest">Live Session</span>
                      </div>
                      <div className="flex items-end gap-0.5 h-6 bg-black/50 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-full">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 16, 6, 20, 4] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                            className="w-0.5 bg-green-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Top label */}
                    <div className="absolute top-6 left-6">
                      <span className="bg-green-500 text-black text-[9px] font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                        Multi-Instrumentalist
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

          </div>
        </section>

        {/* 4. MY CIRCLE */}
        <section onMouseMove={handleMouseMove} className={`py-24 px-6 md:px-24 border-t ${colors.border}`}>

          {/* Section Header - Scaled down to establish context without overpowering */}
          <div className="max-w-7xl mx-auto mb-16">
            
            <div className="flex items-center gap-3 mb-4">
              <Users size={16} className="text-green-500" />
              <span className={`text-xs font-mono uppercase tracking-widest ${colors.textMuted}`}>Network Sync</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className={`text-4xl md:text-5xl font-light tracking-tight leading-tight ${colors.text}`}>
                My <span className="text-green-500 italic font-medium">Circle</span>.
              </h2>
              <p className={`text-lg opacity-60 ${colors.text} leading-relaxed max-w-md md:text-right`}>
                "Show me your friend and I would show you who you are." Meet my circle.
              </p>
            </div>
            
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 min-h-[650px]">

            {/* Left: Info */}
            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -20 }}
                  className="flex flex-col"
                >
                  {/* Node Name & Tagline */}
                  <div className="mb-8">
                    <h3 className={`text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-2 ${colors.text}`}>
                      {circleNodes[activeIndex].name}
                    </h3>
                    <p className="text-lg md:text-xl text-green-500 font-medium italic">
                      {circleNodes[activeIndex].tagline}
                    </p>
                  </div>

                  {/* Grouped Bio, Role, and Tags */}
                  <div className="border-l-2 border-green-500/30 pl-6 flex flex-col gap-6">
                    <p className={`text-xl md:text-2xl font-light leading-relaxed ${colors.text}`}>
                      {circleNodes[activeIndex].bio}
                    </p>

                    <div className="flex flex-col gap-4">
                      <p className={`font-mono text-[11px] uppercase tracking-widest ${colors.textMuted}`}>
                        <span className="text-white">{circleNodes[activeIndex].role}</span>
                        <span className="text-green-500 mx-2">//</span>
                        {circleNodes[activeIndex].work}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-1">
                        {circleNodes[activeIndex].tags.map(tag => (
                          <span
                            key={tag}
                            className={`px-3 py-1.5 rounded-full border ${colors.border} text-[10px] font-mono uppercase ${colors.textMuted}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: The 3D Prism & Controls */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-end order-1 lg:order-2">
              <div className="flex items-center gap-8 w-full justify-center lg:justify-end">

                {/* 3D Card */}
                <motion.div
                  style={{ perspective: '2000px', rotateX: tiltX, rotateY: tiltY }}
                  className="w-full max-w-[380px] aspect-[9/16] relative"
                >
                  <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={{
                        enter: (dir) => ({ rotateY: dir > 0 ? 90 : -90, x: dir > 0 ? '50%' : '-50%', opacity: 0, scale: 0.8 }),
                        center: { rotateY: 0, x: 0, opacity: 1, scale: 1, zIndex: 1 },
                        exit: (dir) => ({ rotateY: dir > 0 ? -90 : 90, x: dir > 0 ? '-50%' : '50%', opacity: 0, scale: 0.8, zIndex: 0 })
                      }}
                      initial="enter" animate="center" exit="exit"
                      transition={{ rotateY: { type: "spring", stiffness: 60, damping: 15 }, opacity: { duration: 0.3 } }}
                      style={{ transformStyle: 'preserve-3d', originX: 0.5 }}
                      className={`absolute inset-0 rounded-[3rem] overflow-hidden border-8 border-zinc-900 ${colors.sliderBg} shadow-2xl`}
                    >
                      <video src={circleNodes[activeIndex].video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover grayscale brightness-75" />

                      {/* Top Story Bar */}
                      <div className="absolute top-6 left-6 right-6 z-50 flex gap-1.5">
                        <div className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div key={activeIndex} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 7.5, ease: 'linear' }} className="h-full bg-white origin-left" />
                        </div>
                      </div>

                      {/* Bottom Details Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                          <img src={circleNodes[activeIndex].avatar} className="w-10 h-10 rounded-full border border-white/30" alt="" />
                          <div className="text-white">
                            <p className="text-sm font-bold leading-none mb-1">{circleNodes[activeIndex].name}</p>
                            <p className="text-[10px] font-mono uppercase text-green-400">{circleNodes[activeIndex].role}</p>
                          </div>
                        </div>
                        <a href={circleNodes[activeIndex].link} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-green-500 hover:text-black hover:border-green-500 transition-all">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Sidebar Circular Nav */}
                <div className="hidden md:flex flex-col gap-4 items-center">
                  {circleNodes.map((node, i) => (
                    <NavAvatar key={node.id} node={node} isDark={isDark} isActive={activeIndex === i} progress={activeIndex === i ? progress : 0} onClick={() => handleManualNav(i, i > activeIndex ? 1 : -1)} />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-8 w-full max-w-[380px] lg:mr-[4.5rem]">
                <div className="flex gap-2">
                  <button onClick={() => handleManualNav((activeIndex - 1 + circleNodes.length) % circleNodes.length, -1)} className={`p-4 rounded-full border ${colors.border} ${colors.text} hover:bg-green-500 hover:text-black hover:border-green-500 transition-all`}>
                    <ArrowLeft size={16} />
                  </button>
                  <button onClick={() => handleManualNav((activeIndex + 1) % circleNodes.length, 1)} className={`p-4 rounded-full border ${colors.border} ${colors.text} hover:bg-green-500 hover:text-black hover:border-green-500 transition-all`}>
                    <ArrowRight size={16} />
                  </button>
                </div>
                <p className="font-mono text-[10px] tracking-widest text-green-500 uppercase">
                  Node_0{activeIndex + 1} / 0{circleNodes.length}
                </p>
              </div>
            </div>

          </div>
        </section>
        <div className="h-[20vh] w-full" />
      </div>
    </div>
  );
};

export default AboutPage;