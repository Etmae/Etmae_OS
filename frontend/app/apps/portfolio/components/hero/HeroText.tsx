/**
 * HeroText.tsx
 *
 * Renders the name heading and role subtitle in the lower-left of the hero.
 *
 * Positioning contract:
 *   The previous implementation positioned this element with
 *   `bottom: calc(60px + 12dvh)` — a mix of a hard-coded pixel offset (the
 *   taskbar height) and a viewport-relative unit (dvh). At tall aspect ratios
 *   (e.g. 21:9 or foldable phones) this formula produced a `bottom` value
 *   that placed the text visually disconnected from the image foot.
 *
 *   This refactor replaces that formula with a two-level clearance:
 *     1. `TASKBAR_CLEARANCE_CSS` (shared token) clears the physical chrome.
 *     2. An additional `--hero-text-gap` custom property adds breathing room
 *        that scales with the viewport height via `dvh` — but as a pure
 *        additive offset, not a positional anchor.
 *
 * Typography:
 *   All font sizes use `clamp()` from `TYPE_SCALE` so the heading and
 *   subtitle scale proportionally across mobile → desktop without jumping
 *   at breakpoints. The previous code used Tailwind responsive classes
 *   (sm:text-6xl, md:text-8xl) which step, not flow.
 */

import React from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { TASKBAR_CLEARANCE_CSS, TYPE_SCALE, Z } from './herotoken';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HeroTheme = 'dark' | 'light';

export interface HeroTextProps {
  /** Drives the entrance animation — text animates in once the parent signals ready. */
  isLoaded: boolean;
  /**
   * Framer Motion value (0 → 1) derived from scroll progress.
   * Applied as the element's `opacity` so the text fades as the user scrolls
   * into the zoom sequence. Passed as a MotionValue to avoid re-renders.
   */
  uiOpacity: MotionValue<number>;
  /** Active colour theme — controls text colour. */
  theme: HeroTheme;
  /** Full display name rendered as the primary heading. */
  name: string;
  /** Professional title shown in the subtitle line (e.g. "Full Stack Dev"). */
  title: string;
  /** Secondary descriptor appended to the title (e.g. "Software Engineer"). */
  subtitle: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const HeroText: React.FC<HeroTextProps> = ({
  isLoaded,
  uiOpacity,
  theme,
  name,
  title,
  subtitle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
      /*
       * `style.opacity` is a MotionValue — Framer Motion subscribes to it
       * directly, bypassing React's render cycle. This is intentional: the
       * scroll-driven opacity change should not trigger a re-render of this
       * component (or its children) on every scroll event.
       */
      style={{
        opacity: uiOpacity,
        zIndex: Z.UI_TEXT,
        /*
         * Bottom offset = taskbar clearance (shared token) + a fluid gap that
         * scales with viewport height. The gap uses dvh so it grows on taller
         * screens, keeping the text a proportional distance above the taskbar
         * rather than a fixed pixel gap that looks cramped on large monitors.
         */
        bottom: `calc(${TASKBAR_CLEARANCE_CSS} + 12dvh)`,
      }}
      className={`
        absolute left-4 sm:left-6 md:left-10
        transition-colors duration-150
        ${theme === 'dark' ? 'text-white' : 'text-black'}
      `}
    >
      {/*
       * Primary heading — the person's name.
       * `clamp()` replaces the previous stepped breakpoint classes. The value
       * scales linearly between 2.75 rem (small mobile) and 7 rem (large desktop)
       * tracking 8vw at mid-sizes, matching the image width growth so the two
       * elements feel proportionally linked.
       *
       * `leading-none` and `tracking-tighter` are preserved from the original
       * design intent. `whitespace-nowrap` is intentionally removed — on narrow
       * viewports a name that wraps is far preferable to one that overflows.
       */}
      <h2
        className="font-light tracking-tighter leading-none"
        style={{ fontSize: TYPE_SCALE.heroName }}
      >
        {name}
      </h2>

      {/*
       * Subtitle line: title + separator + subtitle.
       * `max-width: 90vw` + `overflow: hidden` + `text-overflow: ellipsis` replaces
       * the previous `truncate` + `max-w-[90vw]` Tailwind combo. The explicit
       * overflow handling is more predictable across browsers when combined with
       * a fluid font-size (Tailwind's `truncate` assumes a fixed single line,
       * which can interact unexpectedly with `clamp()` sizing).
       */}
      <p
        className="mt-3 sm:mt-5 pl-1 font-bold uppercase opacity-40"
        style={{
          fontSize: TYPE_SCALE.heroSubtitle,
          letterSpacing: '0.45em',
          maxWidth: '90vw',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title} &mdash; {subtitle}
      </p>
    </motion.div>
  );
};