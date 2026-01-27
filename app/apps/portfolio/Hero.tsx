import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { usePortfolioLoader } from './hooks/usePortfolioLoader';
import { PortfolioLoader } from './components/PortfolioLoader';
import { PortfolioNavbar } from './components/PortfolioNavbar';
import { portfolioHeroConfig } from './Hero.config';
import Lenis from '@studio-freight/lenis';

// Components
import NextSection from './NextSection';
import LatestProjects from './components/LatestProject';
import TechStack from './components/TechStack';
import { ContactCompact } from './components/CompactContact';
import { CodeManifesto } from './components/Bridge'; 
import { SystemFooter } from './components/Footer';

type Theme = 'dark' | 'light';
type ViewportMode = 'desktop' | 'mobile';

interface HeroProps {
  scrollContainer?: React.RefObject<HTMLDivElement>;
  theme?: Theme;
  navItems?: Array<{ label: string; href: string }>;
}

export const ImmersivePortfolioHero: React.FC<HeroProps> = ({
  scrollContainer,
  theme: initialTheme = 'dark',
  navItems
}) => {
  const { loading, onVideoEnded } = usePortfolioLoader(3);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // --- FLY-IN ANIMATION STATE ---
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. LENIS INITIALIZATION ---
  useLayoutEffect(() => {
    if (!scrollContainer?.current || loading) return;

    const lenis = new Lenis({
      wrapper: scrollContainer.current,
      content: containerRef.current || undefined,
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [scrollContainer, loading]);

  // --- 2. SCROLL ANIMATIONS ---
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 150, damping: 30, restDelta: 0.001 
  });

  const worldScale = useTransform(smoothProgress, [0, 0.4], [1, 12]);
  const worldY = useTransform(smoothProgress, [0, 0.4], ["0%", "-15%"]);
  const uiOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const finishFill = useTransform(smoothProgress, [0.35, 0.45], [0, 1]);

  // --- 3. VIEWPORT & LOADING LOGIC ---
  useEffect(() => {
    const checkViewport = () => setViewportMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    // Trigger animations only after loader is finished
    if (!loading) {
      const timer = setTimeout(() => setIsLoaded(true), 400); 
      return () => {
        window.removeEventListener('resize', checkViewport);
        clearTimeout(timer);
      };
    }

    return () => window.removeEventListener('resize', checkViewport);
  }, [loading]);

  const handleThemeToggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <>
      <PortfolioLoader 
        isLoading={loading} 
        onVideoEnded={onVideoEnded} 
        videoSrc="/app/assets/videos/portfolio-video.mp4"  
      />

      <motion.div 
        ref={containerRef}
        className={`relative w-full min-h-full overflow-visible transition-colors duration-700 pointer-events-auto ${
          theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-50'
        }`}
        style={{ 
          opacity: loading ? 0 : 1,
          visibility: loading ? 'hidden' : 'visible'
        }}
      >
        {/* --- STICKY SECTION --- */}
        <div 
          className="sticky top-0 w-full overflow-hidden z-10"
          style={{ height: 'calc(100vh - 48px)' }}
        >
          <motion.div 
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ scale: worldScale, y: worldY, transformOrigin: '50% 75%' }}
          >
            {/* Background Text (FLY-IN) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ opacity: uiOpacity }}
                className={`text-[22vw] font-black uppercase transition-colors duration-700 ${
                  theme === 'dark' ? 'text-white/5' : 'text-black/5'
                }`}
              >
                {portfolioHeroConfig.typographyName.split(' ')[0]}
              </motion.h1>
            </div>

            {/* Main Character/Image (FADE & SCALE-IN) */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`${viewportMode === 'mobile' ? 'w-[90vw] h-[75vh]' : 'w-[55vw] max-w-[850px] h-[90vh]'}`}
              >
                <img
                  src={theme === 'dark' ? portfolioHeroConfig.images.darkDesktop : portfolioHeroConfig.images.lightDesktop}
                  className="w-full h-full object-cover object-top"
                  alt="Portfolio Hero"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="relative z-50 pointer-events-auto">
            <PortfolioNavbar 
              theme={theme} 
              onThemeToggle={handleThemeToggle} 
              opacity={uiOpacity} 
              navItems={navItems} 
            />
          </div>

          {/* HERO TEXT (FLY-IN FROM LEFT) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ opacity: uiOpacity }}
            className={`absolute bottom-12 left-10 z-40 transition-colors duration-700 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
          >
            <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">
              {portfolioHeroConfig.name}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.5em] mt-5 opacity-40 font-bold pl-1">
              {portfolioHeroConfig.title} &mdash; {portfolioHeroConfig.subtitle}
            </p>
          </motion.div>

          {/* Background Fade-in Overlay (During Zoom) */}
          <motion.div 
            style={{ opacity: finishFill }} 
            className={`absolute inset-0 z-45 pointer-events-none transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-50'}`} 
          />
        </div>

        {/* --- SCROLLABLE TRACK --- */}
        <div className="relative z-60 w-full">
          <div className="h-[150vh] pointer-events-none" />

          <div className="relative w-full bg-inherit">
            <NextSection theme={theme} />
            <LatestProjects theme={theme} scrollContainer={scrollContainer} />
            <TechStack theme={theme} />
            <CodeManifesto theme={theme} scrollContainer={scrollContainer} />
            <ContactCompact theme={theme} />
            <SystemFooter theme={theme} scrollContainer={scrollContainer} />
            <div className="h-12 w-full" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ImmersivePortfolioHero;