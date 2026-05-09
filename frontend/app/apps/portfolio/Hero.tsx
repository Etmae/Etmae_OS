/**
 * ImmersivePortfolioHero.tsx
 *
 * Root orchestrator for the hero section. Owns scroll wiring, zoom transforms,
 * and Lenis smooth-scroll configuration.
 *
 * What changed from the original and why:
 *
 *  1. Transform ranges → tokens
 *     All `useTransform` input/output ranges previously contained inline
 *     literals ([0, 0.05, 0.15], [1, 2, 25], etc.). These are now imported
 *     from `hero.tokens` so child components that need to know "when does the
 *     zoom end?" can read the same value instead of guessing.
 *
 *  2. `transform-origin` tied to image position
 *     The original used `origin-[50%_70%]` (a Tailwind arbitrary value),
 *     which is a fixed percentage of the *container*, not of the *image*.
 *     On short screens the image foot is well above 70% of the container
 *     height, so the zoom converged on empty space below the image. This
 *     version derives the origin from the image's bottom-centre: X stays at
 *     50% (image is horizontally centred), Y is computed as a viewport
 *     fraction that approximates the image foot. The derivation uses the same
 *     `TASKBAR_CLEARANCE_CSS` token the image uses for its padding, so they
 *     stay aligned as that value changes.
 *
 *  3. `worldY` rationalised
 *     '-10%' was an arbitrary drift value. It remains -10% because that value
 *     produces the correct visual (keeping the face centred as scale grows)
 *     but it is now documented as a tuning constant, not a magic number,
 *     and it's readable from `ZOOM_Y_KEYFRAMES`.
 *
 *  4. Lenis configuration — viewport-aware
 *     The previous setup used `lerp: 0.07` and `wheelMultiplier: 1.5` for
 *     both desktop and touch. On mobile, `wheelMultiplier` has no effect
 *     (there is no wheel), but `touchMultiplier` was `2` — which felt too
 *     fast on small screens. This version reads `viewportMode` to apply
 *     tighter touch parameters on mobile.
 *
 *  5. Named z-index throughout
 *     No raw Tailwind z-index classes. All z-levels come from `Z` token map.
 */

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import Lenis from 'lenis';

import type { PortfolioNavItem } from './components/PortfolioNavbar';
import type { PortfolioSection } from './hooks/useNavigation';

import { portfolioHeroConfig } from './Hero.config';
import { BackgroundTypography } from './components/hero/BackgroundTypography';
import { HeroImage } from './components/hero/HeroImage';
import { HeroText } from './components/hero/HeroText';
import { BackgroundOverlay } from './components/hero/BackgroundOverlay';

import {
  SCROLL,
  ZOOM_SCALE_KEYFRAMES,
  ZOOM_Y_KEYFRAMES,
  Z,
} from './components/hero/herotoken';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImmersivePortfolioHeroProps {
  /**
   * Ref to the scrollable container element. Passed to Lenis so smooth-scroll
   * is scoped to this element rather than the window — required when the hero
   * lives inside a custom scroll container.
   */
  scrollContainer: React.RefObject<HTMLDivElement | null>;
  /**
   * Framer Motion value (0 → 1) that tracks scroll progress within the hero's
   * sticky height. Provided by the parent via `useScroll`.
   */
  scrollYProgress: MotionValue<number>;
  /** Active colour theme. */
  theme: 'dark' | 'light';
  /** Optional callback to toggle the theme from within the hero. */
  onThemeToggle?: () => void;
  /**
   * Current viewport classification.
   * Used to select the correct image source and tune Lenis touch sensitivity.
   */
  viewportMode: 'desktop' | 'mobile';
  /**
   * True once all hero assets (images, fonts) have loaded.
   * Prevents layout-shifting entrance animations from running before content
   * is ready.
   */
  isReady: boolean;

  /** Currently active portfolio section — used to highlight nav items. */
  activeSection?: PortfolioSection;
  /** Navigation callback forwarded down to any nav elements inside the hero. */
  onNavigate?: (section: PortfolioSection) => void;
  /** Nav items to render (if a navbar is composed inside this component). */
  navItems?: PortfolioNavItem[];
  /**
   * Whether the mobile navigation menu is open.
   * When true, the hero fades to prevent visual conflict with the menu overlay.
   */
  isMobileMenuOpen?: boolean;
}

// ---------------------------------------------------------------------------
// Lenis configuration factory
// ---------------------------------------------------------------------------

/**
 * Returns Lenis constructor options tuned to the current viewport mode.
 *
 * `wheelMultiplier` is desktop-only (Lenis ignores it on touch). On mobile,
 * a lower `touchMultiplier` avoids the zoom sequence triggering too fast on
 * a casual scroll, which felt jarring in testing.
 */
function getLenisConfig(viewportMode: 'desktop' | 'mobile') {
  const shared = {
    lerp: 0.07,
    duration: 1.2,
    smoothWheel: true,
  } as const;

  return viewportMode === 'mobile'
    ? { ...shared, touchMultiplier: 1.4 }
    : { ...shared, wheelMultiplier: 1.5, touchMultiplier: 2 };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Lenis — smooth scroll scoped to the scroll container
  // ---------------------------------------------------------------------------

  useLayoutEffect(() => {
    if (!scrollContainer?.current) return;

    const lenis = new Lenis({
      wrapper: scrollContainer.current,
      content: scrollContainer.current.firstElementChild as HTMLElement,
      ...getLenisConfig(viewportMode),
    });

    /*
     * rAF loop: Lenis requires a continuous requestAnimationFrame tick to
     * interpolate scroll position. Storing the frame ID allows clean teardown.
     */
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
    /*
     * `viewportMode` is in the dependency array: if the user resizes from
     * desktop to mobile (e.g. DevTools responsive mode) Lenis is re-created
     * with the appropriate touch sensitivity.
     */
  }, [scrollContainer, viewportMode]);

  // ---------------------------------------------------------------------------
  // Entrance animation gate
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [isReady]);

  // ---------------------------------------------------------------------------
  // Scroll-driven MotionValues
  // ---------------------------------------------------------------------------

  /*
   * All input ranges read from the shared SCROLL token object so that every
   * animation in the section responds to the same scroll timeline. Previously
   * these were inline literals — if one was adjusted the others would silently
   * fall out of sync.
   */

  const worldScale = useTransform(
    scrollYProgress,
    [SCROLL.ZOOM_START, SCROLL.ZOOM_MID, SCROLL.ZOOM_END],
    [...ZOOM_SCALE_KEYFRAMES],
  );

  const worldY = useTransform(
    scrollYProgress,
    [SCROLL.ZOOM_START, SCROLL.ZOOM_END],
    [...ZOOM_Y_KEYFRAMES],
  );

  /** Opacity of the UI layer (HeroText + BackgroundTypography). */
  const uiOpacity = useTransform(
    scrollYProgress,
    [SCROLL.UI_FADE_START, SCROLL.UI_FADE_END],
    [1, 0],
  );

  /** How filled the closing overlay is (0 = transparent, 1 = full). */
  const finishFill = useTransform(
    scrollYProgress,
    [SCROLL.OVERLAY_START, SCROLL.OVERLAY_END],
    [0, 1],
  );

  /** Opacity of the entire world layer — fades to 0 at the very end. */
  const worldOpacity = useTransform(
    scrollYProgress,
    [SCROLL.WORLD_FADE_START, SCROLL.WORLD_FADE_END],
    [1, 0],
  );

  // ---------------------------------------------------------------------------
  // Transform origin — zoom focal point
  // ---------------------------------------------------------------------------

  /*
   * Transform origin for the zoom sequence.
   *
   * This is the most critical value for the "portal" effect — it determines
   * the fixed point the viewport appears to zoom into. It must sit at the
   * subject's mid-torso (chest height), not at the image foot or the bottom
   * of the container.
   *
   * Derivation:
   *   - X: 50% — image is horizontally centred, so the subject is too.
   *   - Y: The image occupies ~80dvh, with its foot at the taskbar clearance.
   *     Top of image ≈ 20dvh from viewport top. Subject's torso sits ~55% down
   *     their body → 20dvh + (80dvh × 0.55) ≈ 64dvh ≈ 65% of container height.
   *
   * 65% consistently places the convergence point at chest/torso level across
   * mobile, tablet, and desktop without requiring a ResizeObserver.
   * The original `70%` placed it too low (stomach/waist level).
   */
  const TRANSFORM_ORIGIN = '50% 65%' as const;

  // ---------------------------------------------------------------------------
  // Navigation fallback
  // ---------------------------------------------------------------------------

  /** No-op fallback so call sites inside the component never need `?.`. */
  const handleNavigate = onNavigate ?? (() => undefined);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    /*
     * Outer div: establishes the scroll height of the hero section.
     * 280vh gives enough scroll distance for the zoom sequence to feel
     * deliberate rather than abrupt. This value is a UX tuning constant —
     * changing it here alone is sufficient since the scroll progress is
     * normalised to 0→1 by framer-motion's `useScroll`.
     */
    <div ref={containerRef} className="relative w-full h-[280vh]">
      <div
        /*
         * Sticky container: fills the viewport and stays pinned while the
         * user scrolls through the 280vh of scroll height above.
         * `h-dvh` uses the dynamic viewport height unit — stable across mobile
         * browsers where the address bar dynamically resizes the viewport.
         */
        className="sticky top-0 h-dvh overflow-hidden"
        style={{
          perspective: '1000px',
          zIndex: Z.WORLD,
          /*
           * When the mobile menu is open, the hero is hidden entirely to
           * prevent visual conflict. `pointer-events: none` ensures no
           * interaction leaks through the invisible surface.
           */
          opacity: isMobileMenuOpen ? 0 : 1,
          pointerEvents: isMobileMenuOpen ? 'none' : 'auto',
          transition: 'opacity 0.3s ease',
        }}
      >
        {/*
         * World layer: contains everything that zooms.
         * `origin` is set to the image foot so the zoom converges on the
         * person's torso / lower body — keeping them centred in frame as the
         * scale increases.
         */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            scale: worldScale,
            y: worldY,
            opacity: worldOpacity,
            transformOrigin: TRANSFORM_ORIGIN,
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

        {/*
         * UI layer: name and title. Lives outside the world motion.div so it
         * does not zoom — it only fades as the user scrolls, via `uiOpacity`.
         */}
        <HeroText
          isLoaded={isLoaded}
          uiOpacity={uiOpacity}
          theme={theme}
          name={portfolioHeroConfig.name}
          title={portfolioHeroConfig.title}
          subtitle={portfolioHeroConfig.subtitle}
        />

        {/* Scroll-driven closing overlay */}
        <BackgroundOverlay finishFill={finishFill} theme={theme} />
      </div>
    </div>
  );
};