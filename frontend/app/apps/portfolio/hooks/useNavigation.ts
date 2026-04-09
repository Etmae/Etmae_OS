import { useState, useCallback, useEffect, useRef } from 'react';

export type PortfolioSection = 'home' | 'about' | 'works' | 'contact' | 'project-detail';

interface NavigationState {
  section: PortfolioSection;
  scrollPosition: number;
  timestamp: number;
  projectId?: string;
}

interface UsePortfolioNavigationReturn {
  activeSection: PortfolioSection;
  selectedProjectId: string | null;
  navigate: (section: PortfolioSection, projectId?: string, origin?: 'user' | 'history') => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollCache: Map<PortfolioSection, number>;
  saveScrollPosition: () => void;
}

const VALID_SECTIONS: PortfolioSection[] = ['home', 'about', 'works', 'contact', 'project-detail'];

const getScrollKey = (section: PortfolioSection) => `portfolio-scroll-${section}`;

export const usePortfolioNavigation = (): UsePortfolioNavigationReturn => {
  const [activeSection, setActiveSection] = useState<PortfolioSection>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const scrollCacheRef = useRef<Map<PortfolioSection, number>>(new Map());
  const [scrollCache, setScrollCache] = useState<Map<PortfolioSection, number>>(
    () => new Map()
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ─── Save current scroll position ────────────────────────────────────────
  // Uses a ref snapshot to avoid stale closure issues in navigate().
  const activeSectionRef = useRef<PortfolioSection>('home');
  activeSectionRef.current = activeSection;

  const saveScrollPosition = useCallback(() => {
    try {
      if (!scrollRef.current) return;
      const section = activeSectionRef.current;
      const scrollY = scrollRef.current.scrollTop;

      scrollCacheRef.current.set(section, scrollY);
      setScrollCache(new Map(scrollCacheRef.current));
      sessionStorage.setItem(getScrollKey(section), scrollY.toString());
    } catch (error) {
      console.error('Error saving scroll position:', error);
    }
  }, []);

  // ─── Restore scroll position ──────────────────────────────────────────────
  const restoreScroll = useCallback((section: PortfolioSection) => {
    try {
      if (!scrollRef.current) return;

      const fromCache  = scrollCacheRef.current.get(section);
      const fromSession = parseInt(
        sessionStorage.getItem(getScrollKey(section)) || '0',
        10
      );

      const savedScroll =
        (fromCache !== undefined && Number.isFinite(fromCache) ? fromCache : undefined) ??
        (Number.isFinite(fromSession) ? fromSession : 0) ??
        0;

      scrollRef.current.scrollTo({
        top: Math.max(0, savedScroll),
        behavior: 'auto',
      });
    } catch (error) {
      console.error('Scroll restoration error:', error);
    }
  }, []);

  // ─── Navigate ─────────────────────────────────────────────────────────────
  const navigate = useCallback(
    (target: PortfolioSection, projectId?: string, origin: 'user' | 'history' = 'user') => {
      try {
        const section: PortfolioSection = VALID_SECTIONS.includes(target)
          ? target
          : (() => {
              console.warn(`Invalid section "${target}", defaulting to home`);
              return 'home' as PortfolioSection;
            })();

        // Guard: skip redundant user navigations but always honour history events
        if (origin === 'user' && 
            section === activeSectionRef.current && 
            projectId === selectedProjectId) return;

        // Save current position before leaving
        if (origin === 'user') {
          saveScrollPosition();
        }

        // Update browser history with optional projectId
        if (origin !== 'history') {
          const state: NavigationState = {
            section,
            scrollPosition: scrollCacheRef.current.get(section) ?? 0,
            timestamp: Date.now(),
            projectId,
          };
          const hash = projectId 
            ? `#portfolio/${section}/${projectId}` 
            : `#portfolio/${section}`;
          window.history.pushState(state, '', hash);
        }

        // Update state
        setActiveSection(section);
        if (projectId) {
          setSelectedProjectId(projectId);
        } else if (section !== 'project-detail') {
          setSelectedProjectId(null);
        }

        // Scroll restoration needs the new section to be in the DOM first.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => restoreScroll(section));
        });
      } catch (error) {
        console.error('Navigation error:', error);
        setActiveSection('home');
      }
    },
    [restoreScroll, saveScrollPosition, selectedProjectId]
  );

  // ─── Browser back / forward ───────────────────────────────────────────────
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state as NavigationState | null;

      if (state?.section && VALID_SECTIONS.includes(state.section)) {
        scrollCacheRef.current.set(state.section, state.scrollPosition || 0);
        setScrollCache(new Map(scrollCacheRef.current));
        setActiveSection(state.section);
        if (state.projectId) {
          setSelectedProjectId(state.projectId);
        } else if (state.section !== 'project-detail') {
          setSelectedProjectId(null);
        }
      } else {
        const match = window.location.hash.match(/#portfolio\/(\w+)(?:\/(.+))?/);
        const section = match?.[1] as PortfolioSection | undefined;
        const projectId = match?.[2];
        if (section && VALID_SECTIONS.includes(section)) {
          setActiveSection(section);
          if (projectId) {
            setSelectedProjectId(projectId);
          } else if (section !== 'project-detail') {
            setSelectedProjectId(null);
          }
        } else {
          setActiveSection('home');
          setSelectedProjectId(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ─── Deep-link / initial URL parse ───────────────────────────────────────
  useEffect(() => {
    const match = window.location.hash.match(/#portfolio\/(\w+)(?:\/(.+))?/);
    const section = match?.[1] as PortfolioSection | undefined;
    const projectId = match?.[2];
    const initial: PortfolioSection =
      section && VALID_SECTIONS.includes(section) ? section : 'home';

    setActiveSection(initial);
    if (projectId) {
      setSelectedProjectId(projectId);
    }
    window.history.replaceState(
      {
        section: initial,
        scrollPosition: 0,
        timestamp: Date.now(),
        projectId,
      } satisfies NavigationState,
      '',
      projectId ? `#portfolio/${initial}/${projectId}` : `#portfolio/${initial}`
    );
  }, []);

  return {
    activeSection,
    selectedProjectId,
    navigate,
    scrollRef,
    scrollCache,
    saveScrollPosition,
  };
};