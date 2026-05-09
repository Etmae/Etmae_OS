/**
 * HeroImage.tsx
 *
 * Renders the hero photograph anchored to the bottom of the viewport.
 *
 * ── What the image actually is ───────────────────────────────────────────────
 *
 * Source image: 1024 × 490 px — LANDSCAPE (aspect ratio ≈ 2.09 : 1).
 * The subject (person) is centred horizontally with dark empty space on both
 * sides and below. This is a wide studio shot, not a portrait cutout.
 *
 * This single fact invalidates every portrait-oriented sizing strategy that
 * was previously attempted in this refactor:
 *
 *   ✗ height-driven, width: auto
 *     At 80dvh height, natural intrinsic width = 80dvh × 2.09 ≈ 167vw on a
 *     1080p monitor — wider than the viewport. The subject appears squeezed
 *     into a narrow vertical strip because the image overflows horizontally.
 *
 *   ✗ width: 55vw cap, height: dvh, object-fit: cover
 *     Container forced narrower than the image's natural width at that height.
 *     Cover zooms in to fill → crops the subject's arms and body sides.
 *
 *   ✗ width: 100% of max-width cap + cover
 *     Same problem — any cap narrower than natural width forces cover to zoom.
 *
 *   ✗ aspect-ratio + object-fit: contain
 *     Eliminated cropping but shrank the image to a floating box.
 *
 * ── Correct model for a 2.09:1 landscape hero image ──────────────────────────
 *
 *   WIDTH  → 100% of the sticky container (≈ viewport width, avoids scrollbar
 *            overflow that 100vw causes on desktop).
 *   HEIGHT → clamped dvh range (55dvh → 82dvh). See IMAGE_HEIGHT_CSS token.
 *   OBJECT-FIT → cover.  OBJECT-POSITION → top center.
 *
 * On desktop (e.g. 1440 × 1080px):
 *   Natural height at full width = 1440 / 2.09 ≈ 689px ≈ 64dvh.
 *   Clamp preferred (70dvh) is slightly taller — cover trims a small amount
 *   of dark top margin. Subject is perfectly framed, no side cropping.
 *
 * On mobile portrait (e.g. 390 × 844px):
 *   Natural height at full width = 390 / 2.09 ≈ 187px ≈ 22dvh — too short.
 *   Clamp min (55dvh) forces the container taller. Cover scales up and crops
 *   dark top/bottom margins. `top center` keeps face and torso visible.
 *   Strongly recommended: provide a portrait-cropped `mobile` source in config
 *   to avoid cover zoom on phones entirely.
 *
 * ── Bottom anchor ────────────────────────────────────────────────────────────
 *
 *   `items-end` + `paddingBottom: TASKBAR_CLEARANCE_CSS` pins the image foot
 *   above the taskbar on every device, including notched iPhones
 *   (env(safe-area-inset-bottom) is embedded in the token value).
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  IMAGE_HEIGHT_CSS,
  IMAGE_OBJECT_POSITION,
  IMAGE_WIDTH_CSS,
  TASKBAR_CLEARANCE_CSS,
} from './herotoken';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Theme options mirroring the parent portfolio's theme system. */
export type HeroTheme = 'dark' | 'light';

/** Viewport mode derived from a media-query hook in the parent. */
export type HeroViewportMode = 'desktop' | 'mobile';

/**
 * Image source variants.
 *
 * The desktop source is a landscape photograph (1024×490, ratio ≈ 2.09:1).
 * Strongly consider providing a portrait-cropped `mobile` source (e.g.
 * 600×900px, subject centred) — this gives phones the best image quality
 * without relying on cover to compensate for the landscape aspect ratio.
 */
export interface HeroImageSources {
  /** Landscape source for desktop in dark theme. */
  darkDesktop: string;
  /** Landscape source for desktop in light theme. */
  lightDesktop: string;
  /**
   * Optional portrait-cropped mobile source.
   * Falls back to the theme-matched desktop source when absent.
   */
  mobile?: string;
}

export interface HeroImageProps {
  /** Controls the entrance animation — fires once the parent signals ready. */
  isLoaded: boolean;
  /** Current viewport classification from the parent's media-query hook. */
  viewportMode: HeroViewportMode;
  /** Active colour theme — selects the correct image source variant. */
  theme: HeroTheme;
  /** All available image src variants. */
  images: HeroImageSources;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the correct image `src` for the current viewport and theme.
 * Mobile source is preferred on small viewports when available.
 */
function resolveImageSrc(
  viewportMode: HeroViewportMode,
  theme: HeroTheme,
  images: HeroImageSources,
): string {
  if (viewportMode === 'mobile' && images.mobile) return images.mobile;
  return theme === 'dark' ? images.darkDesktop : images.lightDesktop;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const HeroImage: React.FC<HeroImageProps> = ({
  isLoaded,
  viewportMode,
  theme,
  images,
}) => {
  const src = resolveImageSrc(viewportMode, theme, images);

  return (
    /*
     * Bottom-anchor wrapper.
     * `absolute inset-0` spans the full sticky viewport.
     * `items-end` aligns the image container to the bottom edge.
     * `paddingBottom` lifts it above the taskbar + device safe-area inset.
     * `overflow: hidden` clips any cover-derived bleed at the edges.
     */
    <div
      className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden"
      style={{ paddingBottom: TASKBAR_CLEARANCE_CSS }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          /*
           * Full viewport width via `%` (not `100vw`).
           * `100vw` includes the scrollbar width on desktop, causing a
           * 15–17px horizontal overflow. `100%` fills the parent container
           * which is already correctly bounded to the visible viewport.
           *
           * The landscape composition needs the full horizontal canvas —
           * the subject is centred; the dark margins blend into the bg.
           */
          width: IMAGE_WIDTH_CSS,

          /*
           * Clamped height — forces a minimum on narrow/tall screens where
           * the image's natural landscape height would be too short to create
           * visual impact. See IMAGE_HEIGHT_CSS token for full derivation.
           */
          height: IMAGE_HEIGHT_CSS,

          /*
           * Clips cover bleed on mobile where min-height forces the container
           * taller than the image's natural height at viewport width.
           */
          overflow: 'hidden',
        }}
      >
        <img
          src={src}
          alt="Erioluwa Elijah — portfolio hero"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            /*
             * `cover` fills the container while preserving intrinsic ratio.
             * On desktop: container ≈ natural image height → dark margins
             *   trimmed slightly at top, no side cropping at all.
             * On mobile: container taller than natural → cover zooms in,
             *   cropping dark margin top/bottom, subject stays centred.
             */
            objectFit: 'cover',
            /*
             * Anchors to the upper-centre so cover always trims dark
             * background margin before it ever touches the subject.
             */
            objectPosition: IMAGE_OBJECT_POSITION,
          }}
        />
      </motion.div>
    </div>
  );
};