import { useState, useEffect, useRef, useCallback } from 'react';

export type NavbarScrollState = 'top' | 'floating' | 'hidden';

interface UseNavbarScrollOptions {
  /**
   * The scroll container ref (scrollRef from usePortfolioNavigation).
   * Must be passed so we listen to the right element — NOT window.
   * Can be undefined on first render — the hook handles this safely.
   */
  scrollContainer: React.RefObject<HTMLDivElement | null> | undefined;
  /** How many px past the top before the navbar "floats" (default: 80). */
  floatThreshold?: number;
  /**
   * How many px the user must scroll down before the navbar hides (default: 60).
   * Scrolling up by any amount reveals it immediately.
   */
  hideThreshold?: number;
}

interface NavbarScrollReturn {
  /** 'top' = at hero, 'floating' = scrolled but pill visible, 'hidden' = scrolled down fast */
  navState: NavbarScrollState;
  /** true once the user has scrolled past floatThreshold */
  isFloating: boolean;
  /** true when the navbar should be invisible (sliding up out of view) */
  isHidden: boolean;
  /** 0–1 progress within the float zone */
  floatProgress: number;
}

export function useNavbarScroll({
  scrollContainer,
  floatThreshold = 80,
  hideThreshold = 60,
}: UseNavbarScrollOptions): NavbarScrollReturn {
  const [navState, setNavState] = useState<NavbarScrollState>('top');
  const [floatProgress, setFloatProgress] = useState(0);

  const lastScrollTop = useRef(0);
  const scrollDelta   = useRef(0);
  const ticking       = useRef(false);

  const update = useCallback(() => {
    // Guard: ref object might be undefined, or .current might be null
    const el = scrollContainer?.current;
    if (!el) {
      ticking.current = false;
      return;
    }

    const scrollTop = el.scrollTop;
    const delta     = scrollTop - lastScrollTop.current;
    lastScrollTop.current = scrollTop;

    const progress = Math.min(1, Math.max(0, scrollTop / floatThreshold));
    setFloatProgress(progress);

    if (scrollTop <= floatThreshold) {
      scrollDelta.current = 0;
      setNavState('top');
    } else if (delta > 0) {
      // Scrolling DOWN
      scrollDelta.current += delta;
      setNavState(scrollDelta.current > hideThreshold ? 'hidden' : 'floating');
    } else {
      // Scrolling UP — reveal immediately
      scrollDelta.current = 0;
      setNavState('floating');
    }

    ticking.current = false;
  }, [scrollContainer, floatThreshold, hideThreshold]);

  useEffect(() => {
    // The scroll container's DOM element may not be attached yet on the first
    // render pass (ref.current is null while React is still committing).
    // We poll with a short interval until it appears, then attach once.
    let el: HTMLDivElement | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    const attach = () => {
      // Guard both the ref object and its .current value
      const candidate = scrollContainer?.current ?? null;
      if (!candidate) return false;

      el = candidate;
      el.addEventListener('scroll', onScroll, { passive: true });
      return true;
    };

    // Try immediately — will succeed on re-renders after the ref is populated
    if (!attach()) {
      // Not ready yet — poll every 50 ms until the element mounts
      pollId = setInterval(() => {
        if (attach() && pollId !== null) {
          clearInterval(pollId);
          pollId = null;
        }
      }, 50);
    }

    return () => {
      if (pollId !== null) clearInterval(pollId);
      if (el) el.removeEventListener('scroll', onScroll);
    };
  }, [scrollContainer, update]);

  return {
    navState,
    isFloating: navState !== 'top',
    isHidden:   navState === 'hidden',
    floatProgress,
  };
}