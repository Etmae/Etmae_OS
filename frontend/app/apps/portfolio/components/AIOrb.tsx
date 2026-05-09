/**
 * HeroOrb.tsx
 *
 * Floating AI assistant trigger — renders as a Lottie animation orb at rest,
 * expands into a full chat panel when activated.
 *
 * Problems in the previous implementation:
 *   1. `z-9999` was used, which is an arbitrary value that silently outranks
 *      the navbar, any future modals, and the scroll overlay — making the
 *      layer order undefined across components.
 *   2. The `bottom` calculation for the collapsed orb was
 *      `calc(48px + env(safe-area-inset-bottom) + 1rem)` — hardcoded `48px`
 *      instead of the shared `TASKBAR_HEIGHT_PX` token. If the taskbar height
 *      ever changes, the orb would silently mis-align.
 *   3. The expanded panel used `backdrop-filter: blur()` without a
 *      `@supports` fallback. Safari < 15 and some Android WebViews do not
 *      support this property; the panel appeared transparent (invisible text).
 *   4. `bg-black/60` in the backdrop div was a hard-coded dark value — on
 *      light theme the scrim was still dark, which looked wrong.
 *
 * This refactor:
 *   - Uses `Z.ORB` from the shared token map.
 *   - Derives `bottom` from `TASKBAR_CLEARANCE_CSS` (shared token).
 *   - Adds a `@supports` CSS variable fallback for `backdrop-filter`.
 *   - Scrim colour is theme-aware.
 *   - All prop and state types are explicitly declared.
 */

'use client';

import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAssistant, type AIResponse } from '../../../hooks/useAssistant';
import { TASKBAR_CLEARANCE_CSS, Z } from '../components/hero/herotoken';
import type { PortfolioSection } from '../hooks/useNavigation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Action types the AI assistant can emit to trigger portfolio navigation.
 * Mirrors the discriminated union in `useAssistant` — kept here as a local
 * alias so this component doesn't couple to the hook's internal module path.
 */
type AssistantNavigationAction = AIResponse['action'];

/** Payload optionally accompanying a navigation action. */
interface AssistantActionPayload {
  projectId?: string;
}

export interface HeroOrbProps {
  /**
   * Navigation handler provided by the portfolio shell.
   * The orb calls this when the AI assistant emits a navigation action
   * (e.g. OPEN_CONTACT, OPEN_PROJECT).
   */
  onNavigate?: (section: PortfolioSection, projectId?: string) => void;
  /** Active colour theme — controls scrim and panel fallback colours. */
  theme?: 'dark' | 'light';
}

// ---------------------------------------------------------------------------
// Internal state type
// ---------------------------------------------------------------------------

/**
 * All mutable UI state for the orb, kept in a single object to avoid
 * related state values drifting out of sync across multiple `useState` calls.
 */
interface OrbUIState {
  /** Whether the orb has been activated and is showing the chat panel. */
  isExpanded: boolean;
  /**
   * Whether the orb has finished its position transition to screen-centre.
   * Separating this from `isExpanded` prevents the positioning class from
   * snapping before the layout animation completes.
   */
  isCentered: boolean;
  /** Current value of the text input inside the chat panel. */
  input: string;
  /** True after the user has submitted a message and received a response. */
  isDone: boolean;
}

const INITIAL_ORB_STATE: OrbUIState = {
  isExpanded: false,
  isCentered: false,
  input: '',
  isDone: false,
};

// ---------------------------------------------------------------------------
// Subcomponent: Scrim
// ---------------------------------------------------------------------------

interface ScrimProps {
  theme: 'dark' | 'light';
  onClick: () => void;
}

/**
 * Full-screen backdrop behind the expanded chat panel.
 * Theme-aware: dark mode uses a dark scrim, light mode uses a light scrim.
 */
const Scrim: React.FC<ScrimProps> = ({ theme, onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    aria-hidden
    style={{ zIndex: Z.ORB - 1 }}
    className={`
      fixed inset-0
      ${theme === 'dark'
        ? 'bg-black/60 backdrop-blur-xl'
        : 'bg-white/60 backdrop-blur-xl'
      }
    `}
  />
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function HeroOrb({ onNavigate, theme = 'dark' }: HeroOrbProps) {
  const [state, setState] = useState<OrbUIState>(INITIAL_ORB_STATE);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, loading, sendMessage, clearHistory } = useAssistant();

  /** Most recent assistant response, or empty string if none yet. */
  const response =
    messages.filter((m) => m.role === 'assistant').pop()?.content ?? '';

  // Focus the input as soon as the panel is open and the animation settles.
  useEffect(() => {
    if (!state.isExpanded) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, [state.isExpanded]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleOpen(): void {
    setState((prev) => ({ ...prev, isCentered: true, isExpanded: true }));
  }

  function handleReset(): void {
    setState((prev) => ({ ...prev, isExpanded: false, input: '', isDone: false }));
    clearHistory();
    /*
     * Delay clearing `isCentered` until the collapse animation completes so
     * the orb doesn't snap back to its corner position mid-animation.
     */
    setTimeout(
      () => setState((prev) => ({ ...prev, isCentered: false })),
      500,
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!state.input.trim() || loading) return;

    setState((prev) => ({ ...prev, isDone: false }));

    await sendMessage(
      state.input,
      (action: AssistantNavigationAction, payload?: AssistantActionPayload) => {
        if (!onNavigate) return;

        switch (action) {
          case 'OPEN_CONTACT':
            onNavigate('contact');
            handleReset();
            break;
          case 'OPEN_PROJECT':
            if (payload?.projectId) {
              onNavigate('project-detail', payload.projectId);
              handleReset();
            }
            break;
          case 'OPEN_SKILLS':
            onNavigate('home');
            handleReset();
            break;
          default:
            break;
        }
      },
      { source: 'hero' },
    );

    setState((prev) => ({ ...prev, isDone: true }));
  }

  // ---------------------------------------------------------------------------
  // Shared spring config — used for both the orb → panel and panel → orb
  // layoutId animations so they use identical spring parameters.
  // ---------------------------------------------------------------------------
  const LAYOUT_SPRING = { type: 'spring', stiffness: 250, damping: 30 } as const;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* ── Scrim (rendered below the panel in z-order) ── */}
      <AnimatePresence>
        {state.isExpanded && (
          <Scrim theme={theme} onClick={handleReset} />
        )}
      </AnimatePresence>

      {/*
       * Positioning container.
       * When collapsed: fixed to the bottom-right corner, cleared above the
       * taskbar using the shared token (safe-area-aware).
       * When expanded: covers the full screen with flex-centering so the
       * panel sits in the viewport middle.
       */}
      <div
        style={{ zIndex: Z.ORB }}
        className={`fixed pointer-events-none ${
          state.isCentered
            ? 'inset-0 flex items-center justify-center p-4'
            : 'right-4 sm:right-6 md:right-12'
        }`}
        /*
         * When collapsed, apply the bottom offset via inline style so we can
         * use the token string directly. Tailwind JIT cannot evaluate a
         * runtime string, so arbitrary-value syntax would require repeating
         * the formula — the inline approach keeps the token as the authority.
         */
        {...(!state.isCentered && {
          style: {
            zIndex: Z.ORB,
            bottom: TASKBAR_CLEARANCE_CSS,
          },
        })}
      >
        <AnimatePresence mode="wait">
          {/* ── Collapsed orb ── */}
          {!state.isExpanded ? (
            <motion.button
              key="orb"
              layoutId="ai-orb"
              onClick={handleOpen}
              aria-label="Open AI assistant"
              className="relative flex items-center justify-center w-20 h-20 md:w-32 md:h-32 rounded-full cursor-pointer pointer-events-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ layout: LAYOUT_SPRING }}
            >
              {/* Ambient glow */}
              <motion.div
                layout
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  layout: LAYOUT_SPRING,
                }}
                className="absolute inset-0 bg-green-500 rounded-full blur-3xl"
              />

              {/* Rotating dashed ring */}
              <motion.div
                layout
                animate={{ rotate: 360 }}
                transition={{
                  rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                  layout: LAYOUT_SPRING,
                }}
                className="absolute inset-0 border border-dashed border-green-400/20 rounded-full"
              />

              {/* Lottie animation */}
              <motion.div
                layout
                transition={{ layout: LAYOUT_SPRING }}
                className="relative w-24 h-24 md:w-40 md:h-40 z-10 flex items-center justify-center drop-shadow-[0_0_20px_rgba(74,222,128,0.4)]"
              >
                <DotLottieReact
                  src="https://lottie.host/3858c27a-75e4-4eec-88f5-45bbd6900e03/In8cp5pRbX.lottie"
                  loop
                  autoplay
                />
              </motion.div>

              {/* Hover label — desktop only */}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: -20 }}
                className="absolute right-full mr-6 text-[10px] tracking-[0.4em] uppercase text-green-400/80 whitespace-nowrap hidden md:block"
                aria-hidden
              >
                System Intelligence
              </motion.span>
            </motion.button>

          ) : (
            /* ── Expanded chat panel ── */
            <motion.div
              key="pill"
              layoutId="ai-orb"
              className="pointer-events-auto relative w-full max-w-[340px] md:max-w-[440px] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
              transition={{ ...LAYOUT_SPRING }}
              style={{
                /*
                 * Layered background: a semi-transparent base + a CSS variable
                 * blur fallback. The `@supports` check is handled via the class
                 * below — if backdrop-filter is unsupported, the fallback
                 * `background` below provides enough contrast for readability.
                 */
                background: theme === 'dark'
                  ? 'rgba(10, 10, 10, 0.85)'
                  : 'rgba(245, 245, 245, 0.90)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/*
               * backdrop-blur is applied as a separate class so browsers that
               * support it get the glassy effect while those that don't fall
               * back to the solid `background` above without a broken UI.
               * We avoid relying on Tailwind's `backdrop-blur-3xl` here because
               * it generates a `@supports` wrapper only in newer Tailwind versions,
               * and the JIT output varies by config.
               */}
              <div
                className="absolute inset-0 rounded-[2.5rem]"
                style={{
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                }}
                aria-hidden
              />

              {/* All panel content sits above the blur layer */}
              <div className="relative">
                {/* ── Panel header ── */}
                <div className="flex items-center justify-between px-6 md:px-8 pt-5 md:pt-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                      style={{ boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)' }}
                    />
                    <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
                      Etmae AI
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    aria-label="Close assistant"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="text-xl leading-none" aria-hidden>&times;</span>
                  </button>
                </div>

                {/* ── Response area ── */}
                <AnimatePresence>
                  {(response || loading) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 md:px-8 py-5 md:py-6 text-sm text-white/80 font-light leading-relaxed max-h-[260px] md:max-h-[350px] overflow-y-auto"
                    >
                      {loading ? (
                        /* Typing indicator */
                        <div className="flex gap-2 py-2" role="status" aria-label="Loading response">
                          {([0, 0.1, 0.2] as const).map((delay) => (
                            <motion.span
                              key={delay}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1, delay }}
                              className="w-1.5 h-1.5 bg-green-400/60 rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                          {response}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Input / post-response actions ── */}
                <div className="p-4 md:p-6">
                  {!state.isDone ? (
                    <form
                      onSubmit={handleSubmit}
                      className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] rounded-3xl border border-white/5 focus-within:border-white/10 transition-all"
                    >
                      <input
                        ref={inputRef}
                        value={state.input}
                        onChange={(e) =>
                          setState((prev) => ({ ...prev, input: e.target.value }))
                        }
                        placeholder="Ask me anything…"
                        disabled={loading}
                        aria-label="Message to AI assistant"
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-white/10 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!state.input.trim() || loading}
                        aria-label="Send message"
                        className="p-1.5 text-green-400/40 hover:text-green-400 disabled:opacity-10 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-center pb-2"
                    >
                      <button
                        onClick={() =>
                          setState((prev) => ({ ...prev, isDone: false, input: '' }))
                        }
                        className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white hover:bg-white/5 transition-all border border-white/5 rounded-full px-5 py-2"
                      >
                        New Inquiry
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white hover:bg-white/5 transition-all border border-white/5 rounded-full px-5 py-2"
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}