"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAssistant, type AIResponse } from "../../../hooks/useAssistant";
import type { PortfolioSection } from "../hooks/useNavigation";

interface HeroOrbProps {
  onNavigate?: (section: PortfolioSection, projectId?: string) => void;
}

export default function HeroOrb({ onNavigate }: HeroOrbProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [input, setInput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, loading, sendMessage, clearHistory } = useAssistant();
  const response = messages.filter((m) => m.role === "assistant").pop()?.content || "";

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setIsDone(false);
    await sendMessage(
      input,
      (action: AIResponse["action"], payload?: { projectId?: string }) => {
        if (!onNavigate) return;
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
      { source: "hero" }
    );
    setIsDone(true);
  };

  const handleOpen = () => {
    setIsCentered(true);
    setIsExpanded(true);
  };

  const handleReset = () => {
    setIsExpanded(false);
    setInput("");
    setIsDone(false);
    clearHistory();
    setTimeout(() => setIsCentered(false), 500);
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xl"
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed z-[9999] pointer-events-none ${
          isCentered
            ? "inset-0 flex items-center justify-center p-4"
            // Dynamic bottom padding ensures the orb clears both the taskbar and mobile device safe areas.
            // This calculation is responsive and adapts to the current viewport and taskbar state.
            : "bottom-[calc(60px+env(safe-area-inset-bottom)+1rem)] right-4 sm:right-6 md:right-12"
        }`}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="orb"
              layoutId="ai-orb"
              onClick={handleOpen}
              className="relative flex items-center justify-center w-20 h-20 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full cursor-pointer group pointer-events-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ layout: { type: "spring", stiffness: 250, damping: 30 } }}
            >
              {/* Glow */}
              <motion.div
                layout
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  layout: { type: "spring", stiffness: 250, damping: 30 },
                }}
                className="absolute inset-0 bg-green-500 rounded-full blur-3xl"
              />

              {/* Ring */}
              <motion.div
                layout
                animate={{ rotate: 360 }}
                transition={{
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  layout: { type: "spring", stiffness: 250, damping: 30 },
                }}
                className="absolute inset-0 border border-dashed border-green-400/20 rounded-full"
              />

              {/* Lottie */}
              <motion.div
                layout
                transition={{ layout: { type: "spring", stiffness: 250, damping: 30 } }}
                className="relative w-24 h-24 sm:w-24 sm:h-24 md:w-40 md:h-40 z-10 flex items-center justify-center drop-shadow-[0_0_20px_rgba(74,222,128,0.4)]"
              >
                <DotLottieReact
                  src="https://lottie.host/3858c27a-75e4-4eec-88f5-45bbd6900e03/In8cp5pRbX.lottie"
                  loop
                  autoplay
                />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: -20 }}
                className="absolute right-full mr-6 text-[10px] tracking-[0.4em] uppercase text-green-400/80 whitespace-nowrap hidden md:block"
              >
                System Intelligence
              </motion.span>
            </motion.button>
          ) : (
            <motion.div
              key="pill"
              layoutId="ai-orb"
              className="pointer-events-auto relative w-full max-w-[340px] sm:max-w-[340px] md:max-w-[440px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 md:px-8 pt-5 md:pt-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
                    Etmae AI
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <span className="text-xl leading-none">&times;</span>
                </button>
              </div>

              {/* Chat Thread */}
              <AnimatePresence>
                {(response || loading) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-6 md:px-8 py-5 md:py-6 text-sm text-white/80 font-light leading-relaxed max-h-[260px] md:max-h-[350px] overflow-y-auto"
                  >
                    {loading ? (
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
                      <p className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                        {response}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <div className="p-4 md:p-6">
                {!isDone ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] rounded-3xl border border-white/5 focus-within:border-white/10 transition-all"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      disabled={loading}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/10 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="p-1.5 text-green-400/40 hover:text-green-400 disabled:opacity-10 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                      onClick={() => { setIsDone(false); setInput(""); }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}