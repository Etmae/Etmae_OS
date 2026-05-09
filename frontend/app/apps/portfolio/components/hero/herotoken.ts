/**
 * hero.tokens.ts
 *
 * Single source of truth for every layout constant used across the hero section.
 * Components must never hard-code pixel values that appear here — import the token.
 *
 * Changing a value here propagates to every consumer automatically, which is the
 * entire point: coordinated layout without per-component magic numbers.
 */

// ---------------------------------------------------------------------------
// Taskbar / chrome geometry
// ---------------------------------------------------------------------------

/**
 * Height of the bottom taskbar in pixels.
 * Matches the physical taskbar height rendered by the shell / OS chrome.
 * Used as the baseline clearance for absolutely-positioned elements.
 */
export const TASKBAR_HEIGHT_PX = 60 as const;

/**
 * CSS `calc()` string that accounts for taskbar height AND the device's
 * native safe-area inset (notches, home indicators on mobile).
 * Use this as `bottom` when positioning elements above the taskbar.
 */
export const TASKBAR_CLEARANCE_CSS =
  `calc(${TASKBAR_HEIGHT_PX}px + env(safe-area-inset-bottom, 0px))` as const;

// ---------------------------------------------------------------------------
// Hero image — bounding box
// ---------------------------------------------------------------------------

/**
 * The hero photograph is LANDSCAPE: 1024 × 490px, aspect ratio ≈ 2.09:1.
 * The subject occupies the horizontal centre strip of the frame with dark
 * empty space to the left and right.
 *
 * Correct sizing model for this image:
 *   - WIDTH fills the viewport (100vw) so the subject is always centred
 *     and the landscape composition is shown as intended.
 *   - HEIGHT is capped by a dvh value so the image doesn't become too tall
 *     and push content off screen. Since the image is landscape, its natural
 *     height at full viewport width is:
 *       viewport_width / 2.09 ≈ e.g. 1440px / 2.09 ≈ 689px ≈ 72dvh on a
 *       standard 1080p monitor — which is exactly the right visual weight.
 *   - `object-fit: cover` + `object-position: top center` crops the dark
 *     side padding naturally and keeps the subject centred vertically.
 *
 * On mobile (narrow viewport):
 *   The landscape image at 100vw becomes very short (e.g. 390px / 2.09 ≈
 *   187px ≈ 25dvh on a tall phone). We therefore set a minimum height so
 *   the subject never becomes a tiny strip at the bottom of the screen.
 *   `object-fit: cover` fills the taller min-height by cropping the image
 *   top/bottom — since the subject is in the upper-centre, `top center`
 *   keeps their face and body fully visible.
 */

/**
 * Image container width.
 * Full viewport width on all screen sizes — the landscape composition needs
 * the full horizontal canvas. The subject blends into the dark background
 * so edge-to-edge width is seamless.
 */
export const IMAGE_WIDTH_CSS = '100%' as const;

/**
 * Image container height.
 * Clamped between a minimum (so it's never a thin strip on narrow screens)
 * and a maximum (so it doesn't overflow tall-screen viewports).
 *
 *   min 55dvh — ensures enough vertical presence on portrait mobile phones.
 *               At the image's natural 2.09:1 ratio this would require a
 *               viewport of only ~115px wide — well below any real device.
 *               In practice on mobile, cover fills the height and crops
 *               the dark side padding, keeping the subject visible.
 *   preferred 70dvh — comfortable on most desktop screens. At 1440px wide,
 *               the natural image height is ~689px ≈ 64dvh, so 70dvh adds
 *               a small intentional crop of the dark top/bottom margins.
 *   max 82dvh — prevents the image being taller than the viewport on
 *               small-height screens (landscape tablets, short monitors).
 */
export const IMAGE_HEIGHT_CSS = `calc(100dvh - ${TASKBAR_HEIGHT_PX}px - env(safe-area-inset-bottom, 0px))` as const;

/**
 * Keeps the subject (face, torso) in the upper-centre of the frame when
 * `object-fit: cover` crops the image. The dark margins are cropped first.
 */
export const IMAGE_OBJECT_POSITION = 'top center' as const;

// ---------------------------------------------------------------------------
// Z-index layer map
// ---------------------------------------------------------------------------

/**
 * Named z-index layers for the entire hero section.
 * Components import the value they need — no raw integers in JSX.
 *
 * Layer order (bottom → top):
 *   background typography → world (image + zoom) → ui (text) → overlay → orb
 */
export const Z = {
  /** Full-bleed name watermark behind everything */
  BG_TYPOGRAPHY: 0,
  /** Zoomable world layer containing the hero image */
  WORLD: 10,
  /** HeroText name + title — sits above the world during zoom-out */
  UI_TEXT: 40,
  /** Scroll-driven fill that covers the hero at the end of the zoom sequence */
  OVERLAY: 50,
  /** AI orb — must clear the overlay and any navbar */
  ORB: 60,
} as const;

// ---------------------------------------------------------------------------
// Scroll progress breakpoints (framer-motion `useTransform` input ranges)
// ---------------------------------------------------------------------------

/**
 * Scroll progress thresholds that drive every MotionValue transform in the
 * hero. Centralised here so the zoom, opacity, and overlay animations all
 * reference the same timeline — they were previously spread across components
 * with slightly different values, causing visible mis-timing.
 */
export const SCROLL = {
  /** UI (name / title) begins fading out at this scroll progress */
  UI_FADE_START: 0,
  /** UI is fully invisible by this progress */
  UI_FADE_END: 0.08,

  /** World zoom begins */
  ZOOM_START: 0,
  /** Zoom passes through this intermediate scale at this progress */
  ZOOM_MID: 0.05,
  /** Zoom reaches maximum scale (fills viewport) */
  ZOOM_END: 0.15,

  /** Overlay begins filling */
  OVERLAY_START: 0.12,
  /** Overlay is fully opaque (hero complete) */
  OVERLAY_END: 0.15,

  /** World layer fades out at the very end of the sequence */
  WORLD_FADE_START: 0.14,
  WORLD_FADE_END: 0.15,
} as const;

/**
 * World scale keyframes: [at ZOOM_START, at ZOOM_MID, at ZOOM_END].
 * The initial value (1) → brief pause (2) → full zoom (25).
 */
export const ZOOM_SCALE_KEYFRAMES = [1, 2, 25] as const;

/**
 * World vertical drift during zoom — keeps the image subject centred rather
 * than drifting to the bottom edge as the scale increases.
 */
export const ZOOM_Y_KEYFRAMES = ['0%', '-10%'] as const;

// ---------------------------------------------------------------------------
// Typography scale
// ---------------------------------------------------------------------------

/**
 * Fluid type scale for the hero name heading.
 * `clamp(min, preferred, max)` — scales smoothly between breakpoints
 * without media-query jumps.
 */
export const TYPE_SCALE = {
  /** Large display heading: the person's name */
  heroName: 'clamp(2.75rem, 8vw, 7rem)',
  /** Subtitle / role line beneath the name */
  heroSubtitle: 'clamp(0.55rem, 1.1vw, 0.75rem)',
} as const;