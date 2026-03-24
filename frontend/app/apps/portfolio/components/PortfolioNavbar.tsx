"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  type RefObject,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
  MotionValue,
  type MotionStyle,
} from 'framer-motion';
import { Moon, Sun, Github, Linkedin, Twitter } from "lucide-react";
import { StaggeredMenu } from "./StaggeredMenu/StaggeredMenu";
import type {
  StaggeredMenuItem,
  StaggeredMenuSocialItem,
} from "./StaggeredMenu/StaggeredMenu";
import type { PortfolioSection } from "../hooks/useNavigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Theme = "dark" | "light";

export interface PortfolioNavItem {
  label: string;
  section: PortfolioSection;
  href?: string;
}

const DEFAULT_NAV_ITEMS: PortfolioNavItem[] = [
  { label: "Home",    section: "home",    href: "#portfolio/home"    },
  { label: "Work",    section: "works",   href: "#portfolio/work"    },
  { label: "About",   section: "about",   href: "#portfolio/about"   },
  { label: "Contact", section: "contact", href: "#portfolio/contact" },
];

interface PortfolioNavbarProps {
  theme: Theme;
  activeSection: PortfolioSection;
  onNavigate: (section: PortfolioSection) => void;
  onThemeToggle?: () => void;
  /** Framer Motion MotionValue<number> — e.g. from useTransform(scrollYProgress, …) */
  opacity?: MotionValue<number> | number;
  /** External scrollRef from usePortfolioNavigation — used for scroll detection */
  scrollContainer?: RefObject<HTMLDivElement | null>;
  darkLogo?: string;
  lightLogo?: string;
  navItems?: PortfolioNavItem[];
  className?: string;
  /** Callback to notify parent when mobile menu opens/closes */
  onMobileMenuStateChange?: (isOpen: boolean) => void;
}

// ---------------------------------------------------------------------------
// Utility — cn (lightweight, no extra dep)
// ---------------------------------------------------------------------------

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Desktop nav items  (Aceternity style: shared layoutId hover pill)
// ---------------------------------------------------------------------------

interface NavItemsProps {
  items: PortfolioNavItem[];
  activeSection: PortfolioSection;
  theme: Theme;
  onItemClick: (section: PortfolioSection) => void;
}

const NavItems: React.FC<NavItemsProps> = ({
  items,
  activeSection,
  theme,
  onItemClick,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className="hidden md:flex items-center gap-1"
    >
      {items.map((item) => {
        const isActive = activeSection === item.section;
        return (
          <a
            key={item.section}
            href={item.href ?? `#portfolio/${item.section}`}
            onClick={(e) => {
              e.preventDefault();
              onItemClick(item.section);
            }}
            onMouseEnter={() => setHovered(item.section)}
            aria-current={isActive ? "page" : undefined}
            className="relative px-4 py-2 rounded-full"
          >
            {/* Hover pill */}
            {hovered === item.section && (
              <motion.span
                layoutId="nav-hover-pill"
                className={cn(
                  "absolute inset-0 rounded-full",
                  theme === "dark" ? "bg-white/10" : "bg-black/5"
                )}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            {/* Active dot */}
            {isActive && (
              <motion.span
                layoutId="nav-active-dot"
                className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                  theme === "dark" ? "bg-white" : "bg-black"
                )}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <span
              className={cn(
                "relative z-10 text-[11px] uppercase tracking-[0.35em] font-bold transition-opacity duration-200",
                isActive
                  ? theme === "dark"
                    ? "text-white opacity-100"
                    : "text-black opacity-100"
                  : theme === "dark"
                  ? "text-white opacity-50 hover:opacity-80"
                  : "text-black opacity-40 hover:opacity-70"
              )}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Theme toggle button
// ---------------------------------------------------------------------------

const ThemeToggle: React.FC<{
  theme: Theme;
  onToggle?: () => void;
  className?: string;
}> = ({ theme, onToggle, className }) => (
  <button
    onClick={onToggle}
    className={cn(
      // FIX 3: shrink-0 ensures this button never gets squeezed out of the pill
      "hidden md:flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 shrink-0",
      theme === "dark"
        ? "text-white hover:bg-white/10"
        : "text-black hover:bg-black/5",
      className
    )}
    aria-label="Toggle theme"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.span>
    </AnimatePresence>
  </button>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const PortfolioNavbar: React.FC<PortfolioNavbarProps> = ({
  theme,
  activeSection,
  onNavigate,
  onThemeToggle,
  opacity,
  scrollContainer,
  darkLogo  = "/app/assets/img/portfolio/dark_logo.png",
  lightLogo = "/app/assets/img/portfolio/light_logo.png",
  navItems  = DEFAULT_NAV_ITEMS,
  className = "",
  onMobileMenuStateChange,
}) => {
  // ── Scroll-shrink state (mirrors Aceternity's pattern) ──────────────────
  const internalRef = useRef<HTMLDivElement>(null);

  // Prefer the external scrollContainer; fall back to window scroll
  const { scrollY } = useScroll(
    scrollContainer?.current
      ? { container: scrollContainer as RefObject<HTMLElement> }
      : {}
  );

  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    setScrolled(latest > 80);
  });

  // ── Animated pill geometry ───────────────────────────────────────────────
  // FIX 2: navWidth shrink target uses clamp() so the pill never gets so
  // narrow that logo + links + toggle overflow it.
  //   - Mobile/tablet: 100% → 90%  (logo + hamburger, safe at any width)
  //   - Desktop: 100% → clamp(520px, 60%, 100%)  (520px is the minimum that
  //     comfortably fits logo ~56px + 4 links ~280px + toggle ~36px + padding)
  // navY and navRadius are unchanged — the animation feel is identical.
  const navWidth  = useTransform(scrollY, [0, 120], ["100%", "clamp(520px, 60%, 100%)"]);
  const navY      = useTransform(scrollY, [0, 120], [0, 16]);
  const navRadius = useTransform(scrollY, [0, 120], [0, 40]);

  // ── Mobile menu state ───────────────────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // FIX 4: threshold raised from 768px to 1024px so iPad landscape (768–1023px)
  // gets the hamburger menu instead of trying to fit all nav links in a narrow
  // pill. The desktop layout (links visible) only kicks in at 1024px+.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Nav click ────────────────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (section: PortfolioSection) => {
      onNavigate(section);
    },
    [onNavigate]
  );

  // ── Mobile StaggeredMenu items ───────────────────────────────────────────
  const menuItems: StaggeredMenuItem[] = navItems.map((item) => ({
    label:     item.label,
    ariaLabel: item.label,
    link:      item.href ?? `#portfolio/${item.section}`,
    data:      item.section,
  }));

  const socialItems: StaggeredMenuSocialItem[] = [
    { label: "GitHub",   link: "#", icon: <Github size={18} />,   ariaLabel: "Visit GitHub profile"   },
    { label: "LinkedIn", link: "#", icon: <Linkedin size={18} />, ariaLabel: "Visit LinkedIn profile" },
    { label: "Twitter",  link: "#", icon: <Twitter size={18} />,  ariaLabel: "Visit Twitter profile"  },
  ];

  const handleMobileItemClick = useCallback(
    (item: StaggeredMenuItem) => {
      if (item.data) onNavigate(item.data as PortfolioSection);
      setIsMenuOpen(false);
      onMobileMenuStateChange?.(false);
    },
    [onNavigate, onMobileMenuStateChange]
  );

  // ── Logo ─────────────────────────────────────────────────────────────────
  const logoSrc = theme === "dark" ? darkLogo : lightLogo;
  // Menu panel is always white, so always use the dark logo inside it
  const menuLogoSrc = lightLogo;

  // ── Colors based on theme ────────────────────────────────────────────────
  const glassColor  = theme === "dark"
    ? "bg-black/60  border-white/10"
    : "bg-white/70  border-black/8";

  // ── Outer wrapper motion style ───────────────────────────────────────────
  //   Respects the external `opacity` MotionValue passed from PortfolioShell
  const wrapperStyle: MotionStyle = opacity !== undefined ? { opacity } : {};

  return (
    <>
      {/*
       * Sticky wrapper — matches Aceternity's sticky + z-40 pattern.
       * The inner motion.div handles all the pill animation.
       */}
      <motion.div
        ref={internalRef}
        style={wrapperStyle}
        className={cn(
          "sticky top-0 inset-x-0 z-50 w-full flex justify-center",
          className
        )}
      >
        {/* ── Aceternity-style animated pill ── */}
        <motion.div
          style={{
            width:        navWidth,
            y:            navY,
            borderRadius: navRadius,
          }}
          animate={{
            backdropFilter: scrolled ? "blur(12px)" : "none",
            boxShadow: scrolled
              ? theme === "dark"
                ? "0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)"
                : "0 0 0 1px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)"
              : "none",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 40 }}
          className={cn(
            // FIX 3: min-w-0 prevents flex children from overflowing the pill.
            // Without it, a flexbox row can exceed its container's width.
            "relative flex items-center justify-between px-6 md:px-10 py-4 transition-colors duration-300 min-w-0",
            scrolled ? glassColor + " border" : "bg-transparent border-transparent"
          )}
        >
          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className={cn(
              "relative z-50 transition-opacity duration-300 shrink-0",
              isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            aria-label="Go to home"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={logoSrc}
                src={logoSrc}
                alt="Logo"
                className="h-10 md:h-12 w-auto object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
          </button>

          {/* Desktop nav links */}
          <NavItems
            items={navItems}
            activeSection={activeSection}
            theme={theme}
            onItemClick={handleNavClick}
          />

          {/* Right-side slot: desktop → theme toggle, mobile/tablet → hamburger */}
          {/* FIX 3: shrink-0 so this slot is always the last to yield space */}
          <div className="flex items-center shrink-0">
            {/* Desktop theme toggle — hidden below md (1024px via fix 4) */}
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />

            {/* Hamburger — visible below 1024px (mobile + iPad) */}
            {isMobile && (
              <button
                onClick={() => {
                  const newState = !isMenuOpen;
                  setIsMenuOpen(newState);
                  onMobileMenuStateChange?.(newState);
                }}
                className={cn(
                  "md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200",
                  theme === "dark"
                    ? "text-white hover:bg-white/10"
                    : "text-black hover:bg-black/5"
                )}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ opacity: 0, rotate: -45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.18 }}
                      className="relative w-5 h-5 flex items-center justify-center"
                    >
                      <span className="absolute block w-5 h-0.5 rounded-full bg-current rotate-45" />
                      <span className="absolute block w-5 h-0.5 rounded-full bg-current -rotate-45" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ opacity: 0, rotate: 45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -45 }}
                      transition={{ duration: 0.18 }}
                      className="relative w-5 h-5 flex flex-col items-center justify-center gap-[5px]"
                    >
                      <span className="block w-5 h-0.5 rounded-full bg-current" />
                      <span className="block w-5 h-0.5 rounded-full bg-current" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Mobile StaggeredMenu ──
          hideToggleButton suppresses StaggeredMenu's own button entirely.
          externalOpen drives open/close from the pill hamburger above.
          isFixed=true so the panel covers the full screen correctly. */}
      {isMobile && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            hideToggleButton={true}
            externalOpen={isMenuOpen}
            menuButtonColor={theme === "dark" ? "#fff" : "#000"}
            openMenuButtonColor="#000"
            isFixed={true}
            hideInternalLogo={true}
            logoUrl={menuLogoSrc}
            accentColor="#5227FF"
            onMenuOpen={() => {
              setIsMenuOpen(true);
              onMobileMenuStateChange?.(true);
            }}
            onMenuClose={() => {
              setIsMenuOpen(false);
              onMobileMenuStateChange?.(false);
            }}
            onItemClick={handleMobileItemClick}
            onThemeToggle={onThemeToggle}
            themeToggleLabel={theme === "dark" ? "Light mode" : "Dark mode"}
            themeToggleIcon={
              theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
            }
          />
        </div>
      )}
    </>
  );
};

export default PortfolioNavbar;