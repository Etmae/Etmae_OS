import React, { lazy, Suspense, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePortfolioLoader } from './hooks/usePortfolioLoader';
import { useViewport } from './hooks/useViewport';
import { usePortfolioNavigation } from './hooks/useNavigation';
import type { PortfolioSection } from './hooks/useNavigation';
import { PortfolioLoader } from './components/PortfolioLoader';
import { PortfolioNavbar } from './components/PortfolioNavbar';

import { ImmersivePortfolioHero } from './Hero';
import NextSection from './NextSection';
import LatestProjects from './components/LatestProject';
import TechStack from './components/TechStack';
import { ContactCompact } from './components/CompactContact';
import { CodeManifesto } from './components/Bridge';
import { SystemFooter } from './components/Footer';
import { useThemeStore } from '../../state/useThemeStore';
import { ContactPage } from './ContactPage';
import { ProjectDetailWrapper } from './ProjectDetailWrapper';
import { RevealOnScroll } from './components/RevealOnScroll';



const AboutPage    = lazy(() => import('./About'));
const ProjectsPage = lazy(() => 
  import('./Works').then(module => ({ default: module.default }))
);
const ContactWindow = React.lazy(() => 
  import('./ContactPage').then(module => ({ default: module.ContactPage }))
);

type Theme = 'dark' | 'light';

type AboutPageType = React.ComponentType<{
  theme: Theme;
  
  onNavigate: (section: PortfolioSection) => void;
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
}>;

type ProjectsPageType = React.ComponentType<{
  theme: Theme;
  onNavigate: (section: PortfolioSection, projectId?: string) => void;
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
}>;

type LatestProjectsType = React.ComponentType<{
  theme: Theme;
  scrollContainer: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  onNavigate: (section: PortfolioSection) => void;
}>;

type ContactCompactType = React.ComponentType<{
  theme: Theme;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  onViewContact: () => void;
}>;

const TypedAboutPage      = AboutPage    as unknown as AboutPageType;
const TypedProjectsPage   = ProjectsPage as unknown as ProjectsPageType;
const TypedLatestProjects = LatestProjects as unknown as LatestProjectsType;
const TypedContactCompact = ContactCompact as unknown as ContactCompactType;

export const PortfolioShell: React.FC = () => {
  const { loading, onLoopComplete } = usePortfolioLoader(3);
  const viewportMode = useViewport();
  const { theme: globalTheme, toggleTheme } = useThemeStore();
  const theme = globalTheme as Theme;

  const { activeSection, selectedProjectId, navigate, scrollRef } = usePortfolioNavigation();

  const { scrollYProgress } = useScroll({
    container: scrollRef,
    offset: ['start start', 'end end'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0.12, 0.20], [0, 1]);
  const contentY       = useTransform(scrollYProgress, [0.12, 0.25], [100, 0]);
  const contentScale   = useTransform(scrollYProgress, [0.12, 0.25], [0.98, 1]);
  const contentPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.12 ? 'auto' : 'none'
  );

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // ── KEY FIX: reset scroll BEFORE the section state update ────────────────
  //
  // If we reset inside a useEffect(,[activeSection]) the new section component
  // mounts FIRST, its scroll listener reads a stale non-zero scrollTop, and
  // the animation starts mid-progress. By resetting synchronously here —
  // before navigate() triggers the re-render — the scroll container is already
  // at 0 when the new component's useEffect runs.
  const handleNavigate = (section: PortfolioSection, projectId?: string) => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    navigate(section, projectId);
  };

  return (
    <>
      <PortfolioLoader
        isLoading={loading}
        onLoopComplete={onLoopComplete}
      />

      <div
        ref={scrollRef}
        className={`relative w-full h-dvh overflow-y-auto overflow-x-hidden ${
          theme === 'dark' ? 'bg-[#050505]' : 'bg-zinc-50'
        }`}
        style={{
          opacity: loading ? 0 : 1,
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        {/* Sticky Navbar — lives inside scrollRef, so heroTrackRef in child
            pages starts at offsetTop ≈ navbarHeight. AboutPage's raw scroll
            listener uses scrollTop directly (not Framer Motion's offset-based
            system) so this offset is irrelevant to the zoom animation. */}
        <div className="sticky top-0 z-50 w-full">
          <PortfolioNavbar
            theme={theme}
            activeSection={activeSection}
            onNavigate={handleNavigate}   // ← handleNavigate, not navigate
            onThemeToggle={handleThemeToggle}
            scrollContainer={scrollRef}
            onMobileMenuStateChange={setIsMobileMenuOpen}
          />
        </div>

        <Suspense fallback={<PortfolioLoader isLoading onLoopComplete={() => {}} />}>
          {activeSection === 'home' && (
            <HomeContent
              theme={theme}
              viewportMode={viewportMode}
              loading={loading}
              scrollRef={scrollRef}
              scrollYProgress={scrollYProgress}
              contentOpacity={contentOpacity}
              contentY={contentY}
              contentScale={contentScale}
              contentPointerEvents={contentPointerEvents}
              activeSection={activeSection}
              onNavigate={handleNavigate}   // ← handleNavigate
              onThemeToggle={handleThemeToggle}
              isMobileMenuOpen={isMobileMenuOpen}
            />
          )}

          {activeSection === 'about' && (
            <TypedAboutPage
              theme={theme}
              onNavigate={handleNavigate}   // ← handleNavigate
              scrollContainer={scrollRef}
            />
          )}

          {activeSection === 'works' && (
            <TypedProjectsPage
              theme={theme}
              onNavigate={handleNavigate}   // ← handleNavigate
              scrollContainer={scrollRef}
            />
          )}

          {activeSection === 'contact' && (
            <ContactPage theme={theme} onNavigate={handleNavigate} />
          )}

          {activeSection === 'project-detail' && selectedProjectId && (
            <ProjectDetailWrapper
              projectId={selectedProjectId}
              theme={theme}
              onBack={() => handleNavigate('works')}
            />
          )}
        </Suspense>

        {/* Footer Section */}
        <SystemFooter
          theme={theme}
          scrollContainer={scrollRef}
        />
      </div>
    </>
  );
};

// ─── HomeContent ──────────────────────────────────────────────────────────────

interface HomeContentProps {
  theme: Theme;
  viewportMode: ReturnType<typeof useViewport>;
  loading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  contentOpacity: any;
  contentY: any;
  contentScale: any;
  contentPointerEvents: any;
  activeSection: PortfolioSection;
  onNavigate: (section: PortfolioSection) => void;
  onThemeToggle: () => void;
  isMobileMenuOpen: boolean;
}

// ─── HomeContent ──────────────────────────────────────────────────────────────
const HomeContent: React.FC<HomeContentProps> = ({
  theme,
  viewportMode,
  loading,
  scrollRef,
  scrollYProgress,
  contentOpacity,
  contentY,
  contentScale,
  contentPointerEvents,
  activeSection,
  onNavigate,
  onThemeToggle,
  isMobileMenuOpen,
}) => (
  <>
    <div className="relative z-50 w-full block">
      <ImmersivePortfolioHero
        scrollContainer={scrollRef}
        scrollYProgress={scrollYProgress}
        theme={theme}
        viewportMode={viewportMode}
        isReady={!loading}
        onThemeToggle={onThemeToggle}
        activeSection={activeSection}
        onNavigate={onNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
      />
    </div>

    <motion.main
      className="relative z-40 w-full origin-top"
      style={{
        opacity: contentOpacity,
        y: contentY,
        scale: contentScale,
        pointerEvents: contentPointerEvents,
      }}
    >
      <div className="relative z-10 bg-inherit">
        <RevealOnScroll initialY={40} initialScale={0.98} initialBlur={12} duration={1.1} margin="-80px">
          <NextSection theme={theme} />
        </RevealOnScroll>

        <RevealOnScroll initialY={40} initialScale={0.98} initialBlur={12} duration={1.1} margin="-80px">
          <TypedLatestProjects
            theme={theme}
            scrollContainer={scrollRef}
            scrollYProgress={scrollYProgress}
            onNavigate={onNavigate}
          />
        </RevealOnScroll>

        <RevealOnScroll initialY={40} initialScale={0.98} initialBlur={12} duration={1.1} margin="-80px">
          <TechStack theme={theme} />
        </RevealOnScroll>

        <RevealOnScroll initialY={40} initialScale={0.98} initialBlur={12} duration={1.1} margin="-80px">
          <TypedContactCompact
            theme={theme}
            scrollYProgress={scrollYProgress}
            onViewContact={() => onNavigate('contact')}
          />
        </RevealOnScroll>

        <div className="h-24 w-full" />
      </div>
    </motion.main>
  </>
);


export default PortfolioShell;