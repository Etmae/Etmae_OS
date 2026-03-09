import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { Cpu, Music, Disc, ArrowLeft, ArrowRight, ExternalLink, Plus, MoreHorizontal } from 'lucide-react';

// --- Data ---
const circleNodes = [
  {
    id: 0,
    name: "Serhii Kirkin",
    role: "UI/UX Architect",
    link: "https://portfolio.serhii.com",
    video: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1710-large.mp4",
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
    video: "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-vj-loop-background-30084-large.mp4",
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
    video: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-binary-code-streaming-0-large.mp4",
    avatar: "https://i.pravatar.cc/150?u=jordan",
    tagline: "The Memory Leak Exorcist",
    bio: "Concurrency is a symphony, and I'm the conductor. Ensuring high-availability for the heaviest stacks.",
    work: "Distributed Systems / Go",
    tags: ["#Concurrency", "#GoLang"]
  }
];

// --- Sub-Component: Circular Progress Avatar ---
const NavAvatar = ({ node, isActive, progress, onClick, isDark }: any) => {
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
const HeroZoom = ({ scrollContainer, panelHeight, bgClass, textClass }: any) => {
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
          <span className={`text-[10px] font-mono uppercase tracking-[0.8em] opacity-40 ${textClass}`}>System // 01</span>
          <h1 className={`text-[12vw] font-black italic uppercase leading-none ${textClass}`}>IDENTITY</h1>
        </motion.div>
      </motion.div>
      <motion.div style={{ opacity: finishFill }} className={`absolute inset-0 z-20 ${bgClass}`} />
    </div>
  );
};

export const AboutPage = ({ theme = 'dark', scrollContainer }: any) => {
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const [panelHeight, setPanelHeight] = useState(0);

  // --- Mouse Tilt State ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 20 });
  const tiltY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const handleManualNav = (index: number, dir: number) => {
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

  return (
    <div className={`relative w-full ${colors.bg} transition-colors duration-700`}>
      {/* 1. HERO ZOOM */}
      <div style={{ height: panelHeight * 2.5 || '250vh' }} className="relative w-full">
        <HeroZoom scrollContainer={scrollContainer} panelHeight={panelHeight} bgClass={colors.bg} textClass={colors.text} />
      </div>

      <div className="relative z-30 w-full">
        {/* 2. CORE BIO */}
        <section className={`py-32 px-6 md:px-24 border-t ${colors.border}`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-8">
                <Cpu size={18} className="text-green-500" />
                <span className={`text-xs font-mono uppercase tracking-widest ${colors.textMuted}`}>Process Specs</span>
              </div>
              <h2 className={`text-5xl md:text-8xl font-light tracking-tighter leading-tight ${colors.text}`}>
                Architecting <span className="text-green-500 italic">resilience</span> through code.
              </h2>
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <p className={`text-xl opacity-60 ${colors.text} leading-relaxed`}>
                I view every project as a living system. My work is defined by modularity, high-performance logic, and a refusal to accept "good enough".
              </p>
            </div>
          </div>
        </section>

        {/* 3. SONIC ENGINE */}
        <section className={`py-40 px-6 md:px-24 border-y ${colors.border} relative overflow-hidden`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 z-10">
              <div className="flex items-center gap-3 mb-8">
                <Music size={20} className="text-green-500" />
                <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${colors.textMuted}`}>Sonic Signal</span>
              </div>
              <h3 className={`text-6xl md:text-8xl font-black italic uppercase leading-[0.8] mb-10 ${colors.text}`}>
                The <br /><span className="text-green-500">Rhythm</span> <br />of Code
              </h3>
              <div className="mt-12 flex items-end gap-1 h-12">
                {[...Array(20)].map((_, i) => (
                  <motion.div key={i} animate={{ height: [10, 40, 15, 48, 10] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} className="w-1.5 bg-green-500/30 rounded-full" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/5 group">
                <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                  <Disc className="animate-spin text-white" />
                  <span className="text-white font-mono text-[10px] uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full">Active Playback</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. MY CIRCLE (Redesigned 3D Prism + Sidebar Progress) */}
        <section onMouseMove={handleMouseMove} className={`py-40 px-6 md:px-24 border-t ${colors.border}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 min-h-[750px]">
            
            {/* Left: Info */}
            <div className="lg:col-span-5 flex flex-col justify-between py-12 order-2 lg:order-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div 
                  key={activeIndex}
                  initial={{ opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -20 }}
                  className="h-full flex flex-col justify-between"
                >
                  <div>
                    <h3 className={`text-6xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 ${colors.text}`}>{circleNodes[activeIndex].name}</h3>
                    <p className="text-xl text-green-500 font-medium italic">{circleNodes[activeIndex].tagline}</p>
                  </div>
                  <div className="border-l border-green-500/30 pl-8 my-10">
                    <p className={`text-2xl font-light leading-relaxed ${colors.text} mb-6`}>{circleNodes[activeIndex].bio}</p>
                    <p className={`font-mono text-[10px] uppercase tracking-widest ${colors.textMuted}`}>{circleNodes[activeIndex].role} // {circleNodes[activeIndex].work}</p>
                  </div>
                  <div className="flex gap-2">
                    {circleNodes[activeIndex].tags.map(tag => (
                      <span key={tag} className={`px-4 py-1 rounded-full border ${colors.border} text-[10px] font-mono uppercase ${colors.textMuted}`}>{tag}</span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: The 3D Prism */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-end order-1 lg:order-2">
              <div className="flex items-center gap-10 w-full justify-center lg:justify-end">
                <motion.div 
                  style={{ perspective: '2000px', rotateX: tiltX, rotateY: tiltY }} 
                  className="w-full max-w-[400px] aspect-9/16 relative"
                >
                  <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={{
                        enter: (dir: number) => ({ rotateY: dir > 0 ? 90 : -90, x: dir > 0 ? '50%' : '-50%', opacity: 0, scale: 0.8 }),
                        center: { rotateY: 0, x: 0, opacity: 1, scale: 1, zIndex: 1 },
                        exit: (dir: number) => ({ rotateY: dir > 0 ? -90 : 90, x: dir > 0 ? '-50%' : '50%', opacity: 0, scale: 0.8, zIndex: 0 })
                      }}
                      initial="enter" animate="center" exit="exit"
                      transition={{ rotateY: { type: "spring", stiffness: 60, damping: 15 }, opacity: { duration: 0.3 } }}
                      style={{ transformStyle: 'preserve-3d', originX: 0.5 }}
                      className={`absolute inset-0 rounded-[3.5rem] overflow-hidden border-10 border-zinc-900 ${colors.sliderBg} shadow-2xl`}
                    >
                      <video src={circleNodes[activeIndex].video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover grayscale brightness-75" />
                      
                      {/* Top Story Bar */}
                      <div className="absolute top-8 left-8 right-8 z-50 flex gap-1.5">
                        <div className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div key={activeIndex} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 7.5, ease: 'linear' }} className="h-full bg-white origin-left" />
                        </div>
                      </div>

                      {/* Bottom Details Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-10 left-8 right-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={circleNodes[activeIndex].avatar} className="w-12 h-12 rounded-full border-2 border-white/20" alt="" />
                          <div className="text-white">
                            <p className="text-sm font-bold leading-none mb-1">{circleNodes[activeIndex].name}</p>
                            <p className="text-[10px] font-mono uppercase opacity-60">{circleNodes[activeIndex].role}</p>
                          </div>
                        </div>
                        <a href={circleNodes[activeIndex].link} target="_blank" className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-green-500 hover:text-black transition-all">
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Sidebar Circular Nav (Returned!) */}
                <div className="hidden md:flex flex-col gap-6 items-center">
                  {circleNodes.map((node, i) => (
                    <NavAvatar key={node.id} node={node} isDark={isDark} isActive={activeIndex === i} progress={activeIndex === i ? progress : 0} onClick={() => handleManualNav(i, i > activeIndex ? 1 : -1)} />
                  ))}
                  <button className={`w-10 h-10 rounded-full border border-dashed ${colors.border} flex items-center justify-center opacity-20 hover:opacity-100 transition-all`}><Plus size={14} className={colors.text} /></button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-10 w-full max-w-[400px] lg:mr-24">
                <div className="flex gap-3">
                  <button onClick={() => handleManualNav((activeIndex - 1 + circleNodes.length) % circleNodes.length, -1)} className={`p-5 rounded-full border ${colors.border} ${colors.text} hover:bg-green-500 hover:text-black transition-all`}><ArrowLeft size={18} /></button>
                  <button onClick={() => handleManualNav((activeIndex + 1) % circleNodes.length, 1)} className={`p-5 rounded-full border ${colors.border} ${colors.text} hover:bg-green-500 hover:text-black transition-all`}><ArrowRight size={18} /></button>
                </div>
                <p className="font-mono text-xs text-green-500">Node_0{activeIndex + 1} / 0{circleNodes.length}</p>
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