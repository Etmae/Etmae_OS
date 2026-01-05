import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { StaggeredMenu } from './StaggeredMenu/StaggeredMenu';
import type { StaggeredMenuItem } from './StaggeredMenu/StaggeredMenu';

type Theme = 'dark' | 'light';
type ViewportMode = 'desktop' | 'mobile';

interface NavbarProps {
  theme: Theme;
  onThemeToggle: () => void;
  opacity?: any;
  darkLogo?: string;
  lightLogo?: string;
  navItems?: Array<{ label: string; href: string }>;
  className?: string;
}

export const PortfolioNavbar: React.FC<NavbarProps> = ({
  theme,
  onThemeToggle,
  opacity,
  darkLogo = '/app/assets/img/portfolio/dark_logo.png', // Usually white text
  lightLogo = '/app/assets/img/portfolio/light_logo.png', // Usually dark text
  navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ],
  className = ''
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setViewportMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // INTERCEPT THEME TOGGLE CLICK
  useEffect(() => {
    const handleMenuClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.getAttribute('href') === '#theme-toggle') {
        e.preventDefault();
        onThemeToggle();
      }
    };

    document.addEventListener('click', handleMenuClick);
    return () => document.removeEventListener('click', handleMenuClick);
  }, [onThemeToggle]);

  // Navbar logo follows theme (White in Dark mode, Black in Light mode)
  const navbarLogoUrl = theme === 'dark' ? darkLogo : lightLogo;

  // Menu logo MUST be the dark-text version because the Menu Panel is always White
  const menuLogoUrl = lightLogo; 

  const menuItems: StaggeredMenuItem[] = [
    ...navItems.map(item => ({
      label: item.label,
      ariaLabel: item.label,
      link: item.href
    })),
    { label: 'Theme', ariaLabel: 'Toggle Theme', link: '#theme-toggle' }
  ];

  return (
    <>
      <motion.nav 
        style={opacity ? { opacity } : undefined}
        className={`absolute top-0 w-full z-40 flex justify-between px-10 py-10 items-center ${
          theme === 'dark' ? 'text-white' : 'text-black'
        } ${className}`}
      >
        {/* Main Navbar Logo - Fades out when menu opens */}
        <img 
          src={navbarLogoUrl} 
          alt="Logo" 
          className={`h-12 md:h-16 w-auto object-contain relative z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
        />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-12">
          {navItems.map(item => (
            <a 
              key={item.label}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-60 hover:opacity-100 transition-opacity"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Theme Toggle */}
        <button 
          onClick={onThemeToggle}
          className="hidden md:block p-3 rounded-full hover:bg-current/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Container */}
      {viewportMode === 'mobile' && (
        <div className="fixed top-0 right-0 w-full h-full pointer-events-none z-60">
          <StaggeredMenu
            position="right"
            items={menuItems}
            menuButtonColor={theme === 'dark' ? '#fff' : '#000'}
            openMenuButtonColor="#000"
            isFixed={true}
            hideInternalLogo={true} 
            logoUrl={menuLogoUrl} // Passing the high-contrast logo
            accentColor="#5227FF"
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
};