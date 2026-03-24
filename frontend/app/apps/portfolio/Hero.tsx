import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { PortfolioNavbar } from './components/PortfolioNavbar';
import type { PortfolioNavItem } from './components/PortfolioNavbar';
import { portfolioHeroConfig } from './Hero.config';
import Lenis from 'lenis';
import { BackgroundTypography } from './components/BackgroundTypography';
import { HeroImage } from './components/HeroImage';
import { HeroText } from './components/HeroText';
import { BackgroundOverlay } from './components/BackgroundOverlay';
import type { PortfolioSection } from './hooks/useNavigation';

interface ImmersivePortfolioHeroProps {
  scrollContainer: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
  theme: 'dark' | 'light';
  // FIX: made optional — PortfolioShell's sticky navbar owns theme toggling;
  // the hero overlay navbar is a secondary UI that may not need it.
  onThemeToggle?: () => void;
  viewportMode: 'desktop' | 'mobile';
  isReady: boolean;
  // FIX: added so the overlay navbar can show the active state and navigate.
  activeSection?: PortfolioSection;
  onNavigate?: (section: PortfolioSection) => void;
  // FIX: was `Array<{ label: string; href: string }>` which is missing the
  // required `section` field that PortfolioNavbar demands.
  navItems?: PortfolioNavItem[];
  // Hide hero content when mobile menu is open
  isMobileMenuOpen?: boolean;
}

export const ImmersivePortfolioHero: React.FC<ImmersivePortfolioHeroProps> = ({
  scrollContainer,
  scrollYProgress,
  theme,
  onThemeToggle,
  viewportMode,
  isReady,
  activeSection = 'home',
  onNavigate,
  navItems,
  isMobileMenuOpen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. LENIS CONFIGURATION (TUNED FOR REACT) ---
  useLayoutEffect(() => {
    if (!scrollContainer?.current) return;

    const lenis = new Lenis({
      wrapper: scrollContainer.current,
      content: scrollContainer.current.firstElementChild as HTMLElement,
      lerp: 0.07,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1.5,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [scrollContainer]);

  // --- 2. TRANSFORMATION MAPPINGS ---
  const worldScale = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 2, 25]);
  const worldY = useTransform(scrollYProgress, [0, 0.15], ['0%', '-10%']);
  const uiOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const finishFill = useTransform(scrollYProgress, [0.12, 0.15], [0, 1]);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  // FIX: provide a no-op fallback so onNavigate is always callable without
  // optional-chaining at every call site inside PortfolioNavbar.
  const handleNavigate = onNavigate ?? (() => {});

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[250vh]"
    >
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden perspective-1000 z-10"
        style={{
          opacity: isMobileMenuOpen ? 0 : 1,
          pointerEvents: isMobileMenuOpen ? 'none' : 'auto',
          transition: 'opacity 0.3s ease',
        }}
      >

        <motion.div
          className="absolute inset-0 w-full h-full origin-[50%_70%]"
          style={{
            scale: worldScale,
            y: worldY,
            opacity: useTransform(scrollYProgress, [0.14, 0.15], [1, 0]),
          }}
        >
          <BackgroundTypography
            isLoaded={isLoaded}
            uiOpacity={uiOpacity}
            theme={theme}
            typographyName={portfolioHeroConfig.typographyName}
          />

          <HeroImage 
            isLoaded={isLoaded}
            viewportMode={viewportMode}
            theme={theme}
            images={portfolioHeroConfig.images}
          />
        </motion.div>

        {/* UI LAYER — overlay navbar fades out as we zoom */}

        <HeroText
          isLoaded={isLoaded}
          uiOpacity={uiOpacity}
          theme={theme}
          name={portfolioHeroConfig.name}
          title={portfolioHeroConfig.title}
          subtitle={portfolioHeroConfig.subtitle}
        />

        <BackgroundOverlay
          finishFill={finishFill}
          theme={theme}
        />
      </div>
    </div>
  );
};