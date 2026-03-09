import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Github, Linkedin, Twitter } from 'lucide-react';
import { StaggeredMenu } from './StaggeredMenu/StaggeredMenu';
import type {
  StaggeredMenuItem,
  StaggeredMenuSocialItem,
} from './StaggeredMenu/StaggeredMenu';
import type { PortfolioSection } from '../hooks/useNavigation';

type Theme = 'dark' | 'light';
type ViewportMode = 'desktop' | 'mobile';

// Nav items now carry a section ID instead of a raw href.
// The href is kept only as a fallback for right-click / open-in-new-tab UX.
export interface PortfolioNavItem {
  label: string;
  section: PortfolioSection;
  href?: string; // optional fallback
}

const DEFAULT_NAV_ITEMS: PortfolioNavItem[] = [
  {label: "home",  section: 'home', href: '#portfolio/home'},
  { label: 'Work',    section: 'works', href: '#portfolio/work' },
  { label: 'About',   section: 'about',    href: '#portfolio/about'    },
  { label: 'Contact', section: 'contact',  href: '#portfolio/contact'  },
];

interface NavbarProps {
  theme: Theme;
  activeSection: PortfolioSection;
  onNavigate: (section: PortfolioSection) => void;
  onThemeToggle?: () => void;
  opacity?: any;
  darkLogo?: string;
  lightLogo?: string;
  navItems?: PortfolioNavItem[];
  className?: string;
}

export const PortfolioNavbar: React.FC<NavbarProps> = ({
  theme,
  activeSection,
  onNavigate,
  onThemeToggle,
  opacity,
  darkLogo  = '/app/assets/img/portfolio/dark_logo.png',
  lightLogo = '/app/assets/img/portfolio/light_logo.png',
  navItems  = DEFAULT_NAV_ITEMS,
  className = '',
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const check = () =>
      setViewportMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── Desktop nav click ────────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (e: React.MouseEvent, section: PortfolioSection) => {
      e.preventDefault(); // prevent hash jump; navigation hook handles history
      onNavigate(section);
    },
    [onNavigate]
  );

  // ─── Mobile menu items ────────────────────────────────────────────────────
  // StaggeredMenu still works with links; we intercept the click via its
  // onItemClick callback instead of relying on href navigation.
  const menuItems: StaggeredMenuItem[] = navItems.map((item) => ({
    label:     item.label,
    ariaLabel: item.label,
    link:      item.href ?? `#portfolio/${item.section}`,
    // Pass section as data so we can identify it in the handler
    data:      item.section,
  }));

  const socialItems: StaggeredMenuSocialItem[] = [
    {
      label: 'GitHub',
      link: '#',
      icon: <Github size={18} />,
      ariaLabel: 'Visit GitHub profile',
    },
    {
      label: 'LinkedIn',
      link: '#',
      icon: <Linkedin size={18} />,
      ariaLabel: 'Visit LinkedIn profile',
    },
    {
      label: 'Twitter',
      link: '#',
      icon: <Twitter size={18} />,
      ariaLabel: 'Visit Twitter profile',
    },
  ];

  const handleMobileMenuItemClick = useCallback(
    (item: StaggeredMenuItem) => {
      if (item.data) {
        onNavigate(item.data as PortfolioSection);
      }
    },
    [onNavigate, onThemeToggle]
  );

  const navbarLogoUrl = theme === 'dark' ? darkLogo : lightLogo;
  const menuLogoUrl   = lightLogo; // menu panel is always white

  return (
    <>
      <motion.nav
        style={opacity ? { opacity } : undefined}
        className={`absolute top-0 w-full z-40 flex justify-between px-10 py-10 items-center ${
          theme === 'dark' ? 'text-white' : 'text-black'
        } ${className}`}
      >
        {/* Logo — navigates home on click */}
        <button
          onClick={() => onNavigate('home')}
          className={`relative z-50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Go to home"
        >
          <img
            src={navbarLogoUrl}
            alt="Logo"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-12">
          {navItems.map((item) => (
            <a
              key={item.section}
              href={item.href ?? `#portfolio/${item.section}`}
              onClick={(e) => handleNavClick(e, item.section)}
              aria-current={activeSection === item.section ? 'page' : undefined}
              className={`text-[11px] uppercase tracking-[0.4em] font-bold transition-opacity ${
                activeSection === item.section
                  ? 'opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop theme toggle */}
        <button
          onClick={() => onThemeToggle?.()}
          className="hidden md:block p-3 rounded-full hover:bg-current/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      {viewportMode === 'mobile' && (
        // push the full-screen menu down a bit so it doesn't overlap the navbar
        <div
          className={`fixed top-12 right-0 w-full h-[calc(100%-5rem)] z-60 ${
            isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            menuButtonColor={theme === 'dark' ? '#fff' : '#000'}
            openMenuButtonColor="#000"
            isFixed={false}
            hideInternalLogo={true}
            logoUrl={menuLogoUrl}
            accentColor="#5227FF"
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
            // Wire mobile item clicks to use the same hybrid section navigation as desktop
            onItemClick={handleMobileMenuItemClick}
            onThemeToggle={onThemeToggle}
            themeToggleLabel={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            themeToggleIcon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          />
        </div>
      )}
    </>
  );
};