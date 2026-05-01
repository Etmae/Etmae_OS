// frontend/app/apps/assistant/Assistant.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssistant, type AIResponse } from "../../hooks/useAssistant";
import { useWindowStore } from "../../state/useWindowStore";
import { Cpu, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  "What is your primary tech stack?",
  "Show me your latest project.",
  "Can I see your contact info?",
  "Tell me about your UI/UX philosophy.",
  "Lauch the about page.",
];

const GREETINGS = [
  "How can I assist you today?",
  "How do we Start Exploring?",
  "How can I help you navigate this portfolio?",
  "Ready to dive In?",
  "What's on your mind?",
];

type AssistantAction = "NONE" | "OPEN_PROJECT" | "OPEN_SKILLS" | "OPEN_CONTACT";

interface AssistantProps {
  scrollContainer?: React.RefObject<HTMLDivElement>;
  action?: AIResponse["action"];
}

const TypewriterMessage = ({
  content,
  isAi,
  isLatest,
  onType
}: {
  content: string;
  isAi: boolean;
  isLatest: boolean;
  onType: () => void;
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (isAi && isLatest && !hasCompleted.current) {
      setDisplayedContent("");
      let i = 0;
      const TYPING_TOTAL_MS = 1400;
      const TICK_MS = 20;
      const totalTicks = Math.max(1, Math.ceil(TYPING_TOTAL_MS / TICK_MS));
      const chunkSize = Math.max(1, Math.ceil(content.length / totalTicks));

      const interval = setInterval(() => {
        const next = Math.min(content.length, i + chunkSize);
        setDisplayedContent(content.substring(0, next));
        onType();
        i = next;
        if (i >= content.length) {
          clearInterval(interval);
          hasCompleted.current = true;
        }
      }, TICK_MS);

      return () => clearInterval(interval);
    } else {
      setDisplayedContent(content);
    }
  }, [content, isAi, isLatest, onType]);

  return <span>{displayedContent}</span>;
};

export default function Assistant({ scrollContainer }: AssistantProps) {
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage } = useAssistant();
  const { openWindow } = useWindowStore();
  const [fullGreeting, setFullGreeting] = useState("");
  const [displayedGreeting, setDisplayedGreeting] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setFullGreeting(randomGreeting);
    let i = 0;
    const speed = 30;
    const interval = setInterval(() => {
      if (i <= randomGreeting.length) {
        setDisplayedGreeting(randomGreeting.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!isAtBottomRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = messagesListRef.current;
    if (!el) return;
    const updateIsAtBottom = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isAtBottomRef.current = distanceFromBottom < 50;
    };
    updateIsAtBottom();
    el.addEventListener("scroll", updateIsAtBottom, { passive: true });
    return () => el.removeEventListener("scroll", updateIsAtBottom);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const currentInput = input.toLowerCase();
    // Keywords determining if we should AUTO-navigate
    const navigationKeywords = ["open", "go to", "show me", "take me", "view", "launch", "navigate"];
    const hasDirectIntent = navigationKeywords.some(kw => currentInput.includes(kw));

    sendMessage(input, (action, payload) => {
      // ONLY auto-navigate if the user was explicit
      if (hasDirectIntent) {
        if (action === "OPEN_PROJECT" && payload?.projectId) {
          openWindow("projects", { props: { projectId: payload.projectId } });
        } else if (action === "OPEN_SKILLS") {
          openWindow("skills");
        } else if (action === "OPEN_CONTACT") {
          openWindow("contact");
        }
      }
    });

    setInput("");
  };

  const isInitialState = messages.length === 0;

  return (
    <div className="flex flex-col h-full relative z-0 min-h-0 bg-[#050505] text-white overflow-hidden font-sans">
      <motion.div
        layout
        ref={messagesListRef}
        className={`w-full flex flex-col items-center overflow-y-auto transition-opacity duration-500 scroll-smooth min-h-0 ${
          isInitialState ? "h-0 opacity-0 p-0 hidden" : "flex-1 opacity-100 p-4 md:p-8"
        }`}
      >
        <div className="w-full max-w-3xl space-y-8 flex flex-col">
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-6 py-4 max-w-[85%] md:max-w-[80%] text-[15px] leading-relaxed rounded-3xl ${
                  msg.role === "user"
                    ? "bg-zinc-900 text-white border border-white/10 rounded-br-sm"
                    : "bg-transparent text-white/90 border border-white/5 rounded-bl-sm"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-3 mb-3">
                    <Cpu size={14} className="text-green-500" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">System Response</span>
                  </div>
                )}
                
                {msg.role === "assistant" ? (
                  <TypewriterMessage
                    content={msg.content}
                    isAi={true}
                    isLatest={i === messages.length - 1}
                    onType={scrollToBottom}
                  />
                ) : (
                  msg.content
                )}

                {/* THE ACTION BUTTON: Only shows if intent wasn't direct and an action exists */}
                {msg.role === "assistant" && msg.action && msg.action !== "NONE" && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="mt-4 pt-4 border-t border-white/5"
                  >
                    <button
                      onClick={() => {
                        if (msg.action === "OPEN_PROJECT") openWindow("projects", { props: { projectId: msg.payload?.projectId } });
                        if (msg.action === "OPEN_SKILLS") openWindow("skills");
                        if (msg.action === "OPEN_CONTACT") openWindow("contact");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-medium hover:bg-green-500/20 transition-all"
                    >
                      <span>View {msg.action.replace("OPEN_", "").toLowerCase()}</span>
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {/* DOUBLE LOADING FIX: 
              Only show Processing Signal if the last message isn't already an assistant bubble 
          */}
          {loading && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
               <div className="px-6 py-5 rounded-3xl rounded-bl-sm border border-white/5 bg-transparent max-w-[85%]">
                 <div className="flex items-center gap-3 mb-2">
                   <Cpu size={14} className="text-green-500 animate-pulse" />
                   <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Processing Signal</span>
                 </div>
                 <div className="flex gap-1.5 items-center h-4 mt-3">
                   <span className="w-1.5 h-1.5 bg-green-500/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                   <span className="w-1.5 h-1.5 bg-green-500/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                   <span className="w-1.5 h-1.5 bg-green-500/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                 </div>
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4 shrink-0" />
        </div>
      </motion.div>

      <motion.div
        layout
        initial={false}
        animate={{
          flex: isInitialState ? 1 : 0,
          justifyContent: isInitialState ? "center" : "flex-end",
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`w-full flex flex-col items-center px-6 md:px-12 lg:px-24 ${isInitialState ? "" : "pb-20 lg:pb-24 pt-4 border-t border-white/5 bg-[#050505] shrink-0"
          }`}
      >
        <AnimatePresence mode="wait">
          {isInitialState && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6 mb-12 w-full max-w-2xl"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Cpu size={20} className="text-green-500" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/40">System Terminal</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight text-white min-h-16 md:min-h-24 flex items-center justify-center">
                {displayedGreeting}
                {displayedGreeting !== fullGreeting && (
                  <span className="inline-block w-[3px] h-10 md:h-14 ml-2 bg-green-500 animate-pulse" />
                )}
              </h1>
              <p className="text-white/40 text-sm md:text-base font-light leading-relaxed">
                I am your intelligent guide to this workspace. Ask me to open files, check skills, or locate contact info.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="relative w-full max-w-3xl group z-10">
          <div className="absolute -inset-1 bg-green-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-full p-1.5 transition-all duration-300 focus-within:border-green-500/50 focus-within:shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <input
              className="flex-1 bg-transparent px-6 py-3.5 text-[15px] md:text-base text-white outline-none font-light placeholder:text-white/30"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-11 h-11 md:w-12 md:h-12 mr-0.5 rounded-full bg-green-500 text-black flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-green-400 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-green-500 shrink-0"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isInitialState && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mt-10 max-w-3xl"
            >
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="px-5 py-2.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-white/60 hover:text-white text-[13px] md:text-sm font-light transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}