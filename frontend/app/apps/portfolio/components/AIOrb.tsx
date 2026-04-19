"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssistant } from "../../../hooks/useAssistant";
import type { PortfolioSection } from "../hooks/useNavigation";

interface HeroOrbProps {
  onNavigate?: (section: PortfolioSection, projectId?: string) => void;
}

/**
 * Floating AI entry point component.
 *
 * - Renders a minimized "orb" trigger anchored to the viewport.
 * - Expands into an interactive assistant panel when activated.
 * - Handles user input, assistant responses, and contextual navigation.
 */
export default function HeroOrb({ onNavigate }: HeroOrbProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Assistant hook provides message state, loading state, and interaction methods
  const { messages, loading, sendMessage, clearHistory } = useAssistant();

  // Extract the latest assistant response for display in the compact UI
  const response =
    messages.filter((m) => m.role === "assistant").pop()?.content || "";

  /**
   * Automatically focuses the input field after expansion.
   * A slight delay ensures the animation completes before focus is applied.
   */
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  /**
   * Handles user submission:
   * - Prevents empty submissions or concurrent requests
   * - Sends user input to assistant
   * - Interprets assistant actions and triggers navigation callbacks
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setIsDone(false);

    await sendMessage(
      input,
      (action, payload) => {
        if (!onNavigate) return;

        // Route assistant-driven actions to the appropriate section of the portfolio
        switch (action) {
          case "OPEN_CONTACT":
            onNavigate("contact");
            handleReset();
            break;

          case "OPEN_PROJECT":
            if (payload?.projectId) {
              onNavigate("project-detail", payload.projectId);
              handleReset();
            }
            break;

          case "OPEN_SKILLS":
            onNavigate("home");
            handleReset();
            break;

          default:
            break;
        }
      },
      { source: "hero" } // Identify origin of request for downstream logic/analytics
    );

    // Mark interaction as completed to transition UI state
    setIsDone(true);
  };

  /**
   * Resets the component to its initial collapsed state:
   * - Closes the expanded interface
   * - Clears input and assistant history
   * - Resets completion state
   */
  const handleReset = () => {
    setIsExpanded(false);
    setInput("");
    setIsDone(false);
    clearHistory();
  };

  return (
    <>
      {/* Semi-transparent backdrop overlay displayed when the assistant is expanded.
          Captures outside clicks to allow dismissal of the panel. */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* Root container responsible for positioning and transition between
          minimized (floating orb) and expanded (centered panel) states */}
      <div
        className={`fixed z-[9999] transition-all duration-500 ease-in-out ${
          isExpanded
            ? "inset-0 flex items-center justify-center p-4 pointer-events-none"
            : "bottom-6 right-6 md:bottom-12 md:right-12 pointer-events-auto"
        }`}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Floating trigger button (collapsed state) */
            <motion.button
              key="orb"
              layoutId="ai-orb"
              onClick={() => setIsExpanded(true)}
              className="relative flex items-center justify-center w-20 h-20 rounded-full cursor-pointer group"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              {/* Pulsing glow effect behind the orb */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-green-500 rounded-full blur-2xl"
              />

              {/* Rotating dashed ring to suggest activity */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-dashed border-green-400/30 rounded-full"
              />

              {/* Core node with animated scanning effect */}
              <div className="relative w-5 h-5 bg-white rounded-full shadow-[0_0_15px_2px_rgba(74,222,128,0.8)] flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ x: [-20, 20] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200 to-transparent skew-x-12"
                />
              </div>

              {/* Tooltip label shown on hover (desktop only) */}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: -20 }}
                className="absolute right-full mr-4 text-[10px] tracking-[0.3em] uppercase text-green-400 whitespace-nowrap hidden md:block"
              >
                System Intelligence
              </motion.span>
            </motion.button>
          ) : (
            /* Expanded assistant interface */
            <motion.div
              key="pill"
              layoutId="ai-orb"
              className="pointer-events-auto relative w-full max-w-[420px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)]"
            >
              {/* Header section with system indicator and close control */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  <span className="text-white/40 text-[10px] font-medium tracking-[0.2em] uppercase">
                    Etmae AI
                  </span>
                </div>

                {/* Close button */}
                <button
                  onClick={handleReset}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <span className="text-lg leading-none">&times;</span>
                </button>
              </div>

              {/* Response display area (animated mount/unmount) */}
              <AnimatePresence>
                {(response || loading) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-6 py-5 text-sm text-white/90 font-light leading-relaxed max-h-[300px] overflow-y-auto"
                  >
                    {loading ? (
                      /* Animated loading indicator */
                      <div className="flex gap-2 py-2">
                        {[0, 0.1, 0.2].map((d) => (
                          <motion.span
                            key={d}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: d }}
                            className="w-1.5 h-1.5 bg-green-400/60 rounded-full"
                          />
                        ))}
                      </div>
                    ) : (
                      /* Assistant response text */
                      <p className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                        {response}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input and post-response actions */}
              <div className="p-4">
                {!isDone ? (
                  /* Input form for user queries */
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/10 focus-within:border-white/20 transition-all"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      disabled={loading}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 outline-none"
                    />

                    {/* Submit trigger */}
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="p-1.5 text-green-400/60 hover:text-green-400 disabled:opacity-20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  /* Post-response actions (after message is sent and processed) */
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 justify-center pb-2"
                  >
                    <button
                      onClick={() => { setIsDone(false); setInput(""); }}
                      className="text-[11px] text-white/40 hover:text-white hover:bg-white/5 transition-all border border-white/10 rounded-full px-4 py-1.5"
                    >
                      Ask another
                    </button>

                    <button
                      onClick={handleReset}
                      className="text-[11px] text-white/40 hover:text-white hover:bg-white/5 transition-all border border-white/10 rounded-full px-4 py-1.5"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}