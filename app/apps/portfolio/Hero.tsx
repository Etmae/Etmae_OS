import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { usePortfolioLoader } from './hooks/usePortfolioLoader';
import { PortfolioLoader } from './components/PortfolioLoader';
import { ReactLenis } from '@studio-freight/react-lenis';
import { PortfolioNavbar } from './components/PortfolioNavbar';
import { portfolioHeroConfig } from './Hero.config';
import NextSection from './NextSection';
import LatestProjects from './components/LatestProject';
import TechStack from './components/TechStack';
import { ContactCompact } from './components/CompactContact';
import SystemStatus, { CodeManifesto } from './components/Bridge';
import { SystemFooter } from './components/Footer';

// --- Types ---
type Theme = 'dark' | 'light';
type ViewportMode = 'desktop' | 'mobile';

interface HeroProps {
  name?: string;
  typographyName?: string;
  title?: string;
  subtitle?: string;
  theme?: Theme;
  darkDesktopImage?: string;
  lightDesktopImage?: string;
  mobileImage?: string;
  navItems?: Array<{ label: string; href: string }>;
}

export const ImmersivePortfolioHero: React.FC<HeroProps> = ({
  name = portfolioHeroConfig.name,
  typographyName = portfolioHeroConfig.typographyName,
  title = portfolioHeroConfig.title,
  subtitle = portfolioHeroConfig.subtitle,
  theme: initialTheme = 'dark',
  darkDesktopImage = portfolioHeroConfig.images.darkDesktop,
  lightDesktopImage = portfolioHeroConfig.images.lightDesktop,
  mobileImage = portfolioHeroConfig.images.mobile,
  navItems
}) => {
  const { loading, onVideoEnded } = usePortfolioLoader(3);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  
  // Controls the fly-in animations (Typography and Text)
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 150, 
    damping: 30, 
    restDelta: 0.001 
  });

  // --- TRANSFORMATION ENGINE ---
  const worldScale = useTransform(smoothProgress, [0, 1], [1, 12]);
  const worldY = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);
  const uiOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const finishFill = useTransform(smoothProgress, [0.85, 0.98], [0, 1]);

  useEffect(() => {
    const checkViewport = () => setViewportMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    // NEW: Trigger animations only after loader is finished
    if (!loading) {
      const timer = setTimeout(() => setIsLoaded(true), 400); 
      return () => {
        window.removeEventListener('resize', checkViewport);
        clearTimeout(timer);
      };
    }
    
    return () => window.removeEventListener('resize', checkViewport);
  }, [loading]);

  const getCurrentImage = () => {
    if (viewportMode === 'mobile' && mobileImage) return mobileImage;
    return theme === 'dark' ? darkDesktopImage : lightDesktopImage;
  };

  const handleThemeToggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <>
      <PortfolioLoader 
        isLoading={loading} 
        onVideoEnded={onVideoEnded} 
        videoSrc="/app/assets/videos/portfolio-video.mp4"  
      />

      <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 1 }}
          ref={containerRef} 
          className={`relative w-full h-[250vh] transition-colors duration-500 ${
            theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-50'
          }`}
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        >
          <div className="sticky top-0 w-full h-screen overflow-hidden">
            
            {/* --- THE WORLD CONTAINER --- */}
            <motion.div 
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{ scale: worldScale, y: worldY, transformOrigin: '50% 75%' }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.h1 
                  style={{ opacity: uiOpacity }}
                  initial={{ opacity: 0, y: 100 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-[22vw] font-black tracking-tighter uppercase select-none leading-none ${
                    theme === 'dark' ? 'text-white/5' : 'text-black/5'
                  }`}
                >
                  {typographyName.split(' ')[0]}
                </motion.h1>
              </div>

              <div className="absolute inset-0 flex items-end justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`${viewportMode === 'mobile' ? 'w-[90vw] h-[75vh]' : 'w-[55vw] max-w-[850px] h-[90vh]'}`}
                >
                  <img
                    src={getCurrentImage()}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                    style={{
                      maskImage: theme === 'dark' ? 'linear-gradient(to bottom, black 90%, transparent 100%)' : 'none',
                      WebkitMaskImage: theme === 'dark' ? 'linear-gradient(to bottom, black 90%, transparent 100%)' : 'none',
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            <PortfolioNavbar
              theme={theme}
              onThemeToggle={handleThemeToggle}
              opacity={uiOpacity}
              navItems={navItems}
            />

            {/* --- HERO TEXT (FLY-IN) --- */}
            <motion.div 
              style={{ opacity: uiOpacity }}
              initial={{ opacity: 0, x: -50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`absolute bottom-16 left-12 z-40 pointer-events-none ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-none">
                {name}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.5em] mt-5 opacity-40 font-bold pl-1">
                {title} &mdash; {subtitle}
              </p>
            </motion.div>

            <motion.div 
              style={{ opacity: finishFill }}
              className={`absolute inset-0 pointer-events-none z-60 ${
                theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-50'
              }`}
            />
          </div>
        </motion.div>

        {!loading && (
          <>
            <div className="relative z-70"><NextSection theme={theme} /></div>
            <div className="relative z-50"><LatestProjects theme={theme} /></div>
            <div className="relative z-50"><TechStack theme={theme} /></div>
            <div className="relative z-50"><CodeManifesto theme={theme} /></div>  
            <div className="relative z-50"><ContactCompact theme={theme} /></div>
            <div className="relative z-70"><SystemFooter theme={theme} /></div>
          </>
        )}
      </ReactLenis>
    </>
  );
};

export default ImmersivePortfolioHero;