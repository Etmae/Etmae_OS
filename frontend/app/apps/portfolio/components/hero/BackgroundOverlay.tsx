/**
 * BackgroundOverlay.tsx
 *
 * Full-screen colour fill that covers the hero at the end of the zoom sequence,
 * providing a clean transition into the next portfolio section.
 *
 * Problems in the previous implementation:
 *   1. The fill colour was applied via a Tailwind conditional class
 *      (`bg-[#050505]` / `bg-zinc-50`). Framer Motion's `opacity` MotionValue
 *      was applied on top via `style`, which is correct — but the className
 *      colour approach means the value lives in two places (class + style object)
 *      and Tailwind's JIT can resolve the class *after* Framer Motion has already
 *      measured the element, causing a one-frame blink on initial mount in dark mode.
 *   2. `z-45` is not a default Tailwind utility (Tailwind ships z-40 and z-50) —
 *      this silently falls back to `z-auto` in configurations without a custom
 *      `zIndex` extension, meaning the overlay may render below the image layer.
 *   3. `transition-colors duration-150` on a Framer Motion element whose colour
 *      is never programmatically changed has no effect and adds unnecessary CSS.
 *
 * This refactor:
 *   - Moves `backgroundColor` into the `style` object alongside `opacity` so
 *     both are resolved by Framer Motion in the same paint pass — no JIT race.
 *   - Preserves the exact original colour values:
 *       dark  → `#050505` (near-black, not pure black — intentional warmth)
 *       light → zinc-50   → `#fafafa` (warm off-white, not pure white)
 *     These are site-specific colours that match the page background, ensuring
 *     the transition is seamless rather than jarring with a pure black/white flash.
 *   - Replaces `z-45` with `Z.OVERLAY` from the shared token map (value: 50),
 *     which is a real Tailwind default and also explicitly declared in CSS.
 *   - `finishFill` scroll range is created in the parent from `SCROLL` tokens —
 *     this component does not own any scroll thresholds.
 */

import React from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { Z } from './herotoken';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HeroTheme = 'dark' | 'light';

export interface BackgroundOverlayProps {
  /**
   * Framer Motion value (0 → 1) representing how much the overlay has filled.
   * 0 = fully transparent, 1 = fully opaque.
   * Created in the parent via `useTransform(scrollYProgress, [...], [0, 1])`.
   */
  finishFill: MotionValue<number>;
  /** Active colour theme. Determines the overlay fill colour. */
  theme: HeroTheme;
}

// ---------------------------------------------------------------------------
// Theme colour map
// ---------------------------------------------------------------------------

/**
 * Overlay fill colours keyed by theme.
 *
 * These values are deliberately site-specific and must match the background
 * colour of the section that follows the hero — so the scroll transition feels
 * like the page is revealing the next section rather than cutting to black/white.
 *
 *   dark  → `#050505`: near-black with a very slight warmth. Pure `#000000`
 *           reads as "off" next to the dark page background; this matches it.
 *   light → `#fafafa`: Tailwind's `zinc-50`. Warmer than pure white, matching
 *           the light-mode page surface colour.
 *
 * If the site's background colour changes, update these values to match.
 */
const OVERLAY_COLOUR: Record<HeroTheme, string> = {
  dark: '#050505',
  light: '#fafafa',
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({
  finishFill,
  theme,
}) => {
  return (
    <motion.div
      /*
       * `pointer-events: none` ensures the invisible overlay does not intercept
       * clicks or hover events during the zoom sequence. Even at opacity 0 an
       * absolutely-positioned element can block interaction with elements below it.
       */
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: Z.OVERLAY,
        /*
         * Both `backgroundColor` and `opacity` are declared in the same `style`
         * object — Framer Motion resolves the full style object in one paint pass,
         * eliminating the one-frame blink that occurred when colour was in a
         * Tailwind class and opacity was in the style prop separately.
         */
        backgroundColor: OVERLAY_COLOUR[theme],
        /*
         * The scroll-driven fill: 0 → 1 as `finishFill` progresses through its
         * mapped scroll range. Framer Motion subscribes to this MotionValue on the
         * compositor thread — no JS re-renders on every scroll event.
         */
        opacity: finishFill,
      }}
      aria-hidden
    />
  );
};