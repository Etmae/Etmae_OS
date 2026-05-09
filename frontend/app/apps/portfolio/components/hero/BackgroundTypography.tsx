/**
 * BackgroundTypography.tsx
 *
 * Full-bleed first-name watermark that sits behind the hero image and UI layers.
 * Intentionally oversized — the text bleeds past the viewport edges to create
 * depth between the background and foreground layers.
 *
 * Original behaviour preserved:
 *   - Only the first word of `typographyName` is rendered (`.split(' ')[0]`),
 *     keeping the watermark tight regardless of full-name length.
 *   - `motion.h1` — semantically correct; this is the primary visual heading
 *     even though it sits behind all other content.
 *   - `font-black` (weight 900) + `uppercase` — the design relies on the mass
 *     of a heavy uppercase letterform to create the background layer effect.
 *   - Entrance animation includes `y: 100 → 0` (slides up from below) with a
 *     custom cubic-bezier ease, matching the original motion design intent.
 *
 * Refactor additions:
 *   - `overflow: hidden` on the container — the text is intentionally wider than
 *     the viewport but must not create horizontal scroll or affect layout width.
 *   - Font size moved from the fixed `text-[22vw]` Tailwind class to a `clamp()`
 *     value using `svw` units. `svw` (small viewport width) is stable on mobile
 *     browsers where the address bar dynamically resizes `vw`, preventing the
 *     watermark from jumping in size when the browser chrome appears/disappears.
 *     22svw matches the original 22vw intent on desktop; the clamp floor (8rem)
 *     prevents it becoming invisible on very narrow viewports.
 *   - `uiOpacity` MotionValue is the same instance passed to HeroText — both
 *     layers fade on an identical scroll curve with no synchronisation overhead.
 *   - Named z-index from the shared token map (`Z.BG_TYPOGRAPHY`).
 *   - `pointer-events: none` moved from the Tailwind class to an inline style
 *     so it is not accidentally purged by Tailwind's content scanner on build.
 */

import React from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { Z } from './herotoken';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HeroTheme = 'dark' | 'light';

export interface BackgroundTypographyProps {
  /** Drives the entrance animation — text animates in once the parent signals ready. */
  isLoaded: boolean;
  /**
   * Scroll-driven opacity MotionValue shared with HeroText.
   * Passing the same MotionValue instance to both components guarantees they
   * fade on an identical scroll curve — no risk of the two drifting apart if
   * the scroll range is ever adjusted in the parent.
   */
  uiOpacity: MotionValue<number>;
  /** Active colour theme. Controls watermark opacity colour variant. */
  theme: HeroTheme;
  /**
   * Full display name from config.
   * Only the first word is rendered — kept as a prop (rather than pre-slicing
   * in the parent) so the component remains self-documenting about the intent.
   */
  typographyName: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Custom cubic-bezier ease matching the original motion design.
 * `[0.16, 1, 0.3, 1]` is an expo-out-like curve — fast initial movement
 * that decelerates sharply, giving the watermark a weighty, physical feel
 * as it rises into position.
 */
const ENTRANCE_EASE = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const BackgroundTypography: React.FC<BackgroundTypographyProps> = ({
  isLoaded,
  uiOpacity,
  theme,
  typographyName,
}) => {
  /*
   * Only the first word is used as the watermark. A full name like
   * "Erioluwa Elijah" renders as "ERIOLUWA" — filling the viewport width
   * at 22svw without the second word pushing the layout wider.
   */
  const displayWord = typographyName.split(' ')[0];

  return (
    /*
     * Overflow container: clips horizontal bleed from the oversized text
     * without affecting the sticky hero's scroll behaviour. This is the key
     * structural fix — the original had no overflow guard, allowing the wide
     * letterforms to silently extend the document scroll-width on some browsers.
     */
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        zIndex: Z.BG_TYPOGRAPHY,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <motion.h1
        /*
         * Entrance: slides up from 100px below its resting position and fades
         * in. The `y` offset creates the sense that the watermark is rising
         * from behind the image as the page loads — part of the original
         * layered-depth motion design.
         */
        initial={{ opacity: 0, y: 100 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 1.5, ease: ENTRANCE_EASE }}
        style={{
          /*
           * Scroll-driven opacity — same MotionValue instance as HeroText.
           * Framer Motion bypasses React's render cycle for MotionValue
           * subscriptions, so this fades on the compositor thread.
           *
           * Note: Framer Motion merges `style.opacity` (a MotionValue) with the
           * `animate` opacity correctly — the scroll value takes over after the
           * entrance animation completes without conflict.
           */
          opacity: uiOpacity,
          /*
           * `svw` (small viewport width) is used instead of `vw` for stability
           * on mobile browsers — `vw` reacts to the browser chrome appearing
           * and disappearing, causing a visible size jump. `svw` is fixed to
           * the smallest viewport dimension and doesn't jump.
           *
           * The clamp floor (8rem) prevents the watermark from becoming
           * illegibly small on very narrow screens (< ~145px wide), though in
           * practice the narrowest supported viewport is 320px.
           */
          fontSize: 'clamp(8rem, 22svw, 36rem)',
          lineHeight: 1,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
        /*
         * `font-black` (900) + `uppercase` are preserved from the original.
         * The visual effect depends on maximum letterform mass — a lighter
         * weight would not create sufficient contrast between the BG text and
         * the foreground image at 5% opacity.
         */
        className={`
          font-black uppercase tracking-tighter
          ${theme === 'dark' ? 'text-white/5' : 'text-black/5'}
        `}
      >
        {displayWord}
      </motion.h1>
    </div>
  );
};