import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Paperclip,
  Github, 
  Twitter, 
  Linkedin, 
  Globe 
} from 'lucide-react';

interface ContactPageProps {
  theme?: 'dark' | 'light';
  onNavigate: (section: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ theme = 'dark', onNavigate }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: '', service: '', budget: '', message: '', email: '', file: null as File | null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';
  
  // Robust Theme Dictionary
  const colors = {
    bg: isDark ? 'bg-zinc-950' : 'bg-zinc-50',
    text: isDark ? 'text-zinc-100' : 'text-zinc-900',
    muted: isDark ? 'text-zinc-500' : 'text-zinc-400',
    border: isDark ? 'border-zinc-800' : 'border-zinc-200',
    borderHover: isDark ? 'hover:border-zinc-600' : 'hover:border-zinc-400',
    accent: 'text-green-500',
    inputBg: 'bg-transparent',
    cardBg: isDark ? 'bg-zinc-900/30' : 'bg-white',
    selectedBg: isDark ? 'bg-zinc-100' : 'bg-zinc-900',
    selectedText: isDark ? 'text-black' : 'text-white',
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const canProgress = () => {
    switch(step) {
      case 0: return data.name.trim().length > 1;
      case 1: return data.service !== '';
      case 2: return data.message.trim().length >= 10;
      case 3: return data.budget !== '';
      case 4: return validateEmail(data.email);
      default: return false;
    }
  };

  const handleNext = () => canProgress() && setStep(s => s + 1);
  const handlePrev = () => setStep(s => Math.max(0, s - 1));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-dvh w-full flex flex-col justify-between px-4 pt-12 pb-24 md:px-12 md:pt-16 md:pb-32 ${colors.bg} relative overflow-hidden selection:bg-green-500/30 transition-colors duration-500`}
    >

      {/* 1. SIDE NAVIGATION (Vertical Center) */}
      {step < 5 && (
        <>
          <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-20">
            <button 
              onClick={() => step === 0 ? onNavigate('home') : handlePrev()}
              className={`p-4 md:p-6 rounded-full ${colors.muted} hover:${colors.text} transition-all duration-300 group`}
            >
              <ArrowLeft size={28} strokeWidth={1} className="group-hover:-translate-x-2 transition-transform duration-300" />
            </button>
          </div>

          <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-20">
            <button 
              disabled={!canProgress()}
              onClick={handleNext}
              className={`p-4 md:p-6 rounded-full transition-all duration-300 group ${
                canProgress() ? `${colors.accent}` : `opacity-30 cursor-not-allowed ${colors.muted}`
              }`}
            >
              <ArrowRight size={28} strokeWidth={1} className={canProgress() ? "group-hover:translate-x-2 transition-transform duration-300" : ""} />
            </button>
          </div>
        </>
      )}

      {/* 2. DYNAMIC FORM CANVAS */}
      <main className="flex-1 relative flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            // Expanded to max-w-3xl to create the wider boundary for alignment
            className="w-full max-w-3xl flex flex-col items-center text-center px-4"
          >
            {/* INLINE STEP COUNTER */}
            <div className={`text-[10px] font-mono uppercase tracking-[0.3em] ${colors.muted} mb-8`}>
              {step < 5 ? `Step 0${step + 1} — 05` : 'Finalized'}
            </div>

            {/* STEP 0: NAME */}
            {step === 0 && (
              <div className="space-y-10 w-full">
                <h2 className={`text-5xl md:text-8xl font-light tracking-tight ${colors.text}`}>
                  What is your <span className="italic font-serif">name?</span>
                </h2>
                <input 
                  autoFocus
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({...data, name: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && canProgress() && handleNext()}
                  placeholder="Type here..."
                  // Spans full width of max-w-3xl
                  className={`w-full ${colors.inputBg} border-b ${colors.border} pb-4 text-3xl md:text-4xl text-center outline-none focus:border-green-500 transition-all ${colors.text} placeholder:opacity-20`}
                />
              </div>
            )}

            {/* STEP 1: SERVICE */}
            {step === 1 && (
              <div className="space-y-12 w-full">
                <h2 className={`text-4xl md:text-7xl font-light tracking-tight ${colors.text}`}>
                  What's up, <span className="text-green-500 italic font-serif">{data.name.split(' ')[0]}</span>? <br/>
                  What are we <span className="italic font-serif">building?</span>
                </h2>
                <div className="flex flex-wrap justify-center gap-3 w-full">
                  {['Product Design', 'Web Systems', 'Motion ID', 'Visual Branding'].map(s => (
                    <button 
                      key={s}
                      onClick={() => { setData({...data, service: s}); handleNext(); }}
                      className={`px-8 py-4 rounded-full border text-[10px] uppercase tracking-widest transition-all hover:border-green-500 hover:text-green-500 
                      ${data.service === s ? `${colors.selectedBg} ${colors.selectedText} border-transparent` : `${colors.border} ${colors.muted}`}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: THE BRIEF */}
            {step === 2 && (
              <div className="space-y-8 w-full">
                <h2 className={`text-4xl md:text-6xl font-light tracking-tight ${colors.text}`}>
                  Tell me about the <span className="italic font-serif text-green-500">project.</span>
                </h2>
                <div className={`w-full border ${colors.border} ${colors.cardBg} rounded-2xl p-6 relative transition-colors focus-within:border-green-500 shadow-sm`}>
                  <textarea 
                    autoFocus
                    value={data.message}
                    onChange={(e) => setData({...data, message: e.target.value})}
                    placeholder="Briefly describe your vision..."
                    className={`w-full ${colors.inputBg} border-none text-xl outline-none resize-none h-40 leading-relaxed font-light ${colors.text} placeholder:opacity-30`}
                  />
                  <div className={`flex justify-between items-center mt-4 pt-4 border-t ${colors.border}`}>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-2 text-[10px] uppercase tracking-widest ${colors.muted} hover:text-green-500 transition-all`}
                    >
                      <Paperclip size={14} />
                      {data.file ? data.file.name : 'Attach Brief (PDF/DOC)'}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setData({...data, file: e.target.files?.[0] || null})} />
                    <span className={`text-[9px] font-mono ${colors.muted}`}>{data.message.length} chars</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BUDGET */}
            {step === 3 && (
                <div className="space-y-12 w-full">
                   <h2 className={`text-5xl md:text-7xl font-light tracking-tight ${colors.text}`}>
                    How should we <span className="italic font-serif">scale this?</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                    {['$5k+', '$10k+', '$25k+', '$50k+', 'Enterprise', 'TBD'].map(b => (
                      <button 
                        key={b} 
                        onClick={() => {setData({...data, budget: b}); handleNext();}} 
                        className={`px-6 py-5 border ${colors.border} text-[10px] font-mono uppercase tracking-widest hover:border-green-500 transition-all rounded-sm
                        ${data.budget === b ? `${colors.selectedBg} ${colors.selectedText} border-transparent` : colors.text}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
            )}

            {/* STEP 4: EMAIL */}
            {step === 4 && (
               <div className="space-y-10 w-full">
                <h2 className={`text-5xl md:text-8xl font-light tracking-tight ${colors.text}`}>
                  Where can I <span className="italic font-serif">reach you?</span>
                </h2>
                <input 
                  autoFocus
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({...data, email: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && canProgress() && handleNext()}
                  placeholder="email@example.com"
                  // Spans full width of max-w-3xl
                  className={`w-full ${colors.inputBg} border-b ${colors.border} pb-4 text-3xl md:text-4xl text-center outline-none focus:border-green-500 transition-all ${colors.text} placeholder:opacity-20`}
                />
                
                <AnimatePresence>
                  {validateEmail(data.email) && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <button 
                        onClick={handleNext}
                        className="mt-12 px-12 py-5 rounded-full bg-green-500 text-black text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(34,197,94,0.2)]"
                      >
                        Confirm & Transmit
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <div className="space-y-6 w-full">
                <h2 className={`text-6xl md:text-9xl font-light tracking-tight ${colors.text}`}>
                  Sent <span className="italic font-serif text-green-500">Successfully.</span>
                </h2>
                <p className={`text-[10px] uppercase tracking-[0.4em] ${colors.muted} leading-loose`}>
                  I'll be in touch shortly, {data.name.split(' ')[0]}.
                </p>
                <button 
                  onClick={() => onNavigate('home')} 
                  className={`mt-8 text-[10px] font-mono uppercase tracking-widest border-b border-transparent hover:border-green-500 ${colors.muted} hover:text-green-500 transition-all pb-1`}
                >
                  Return to Origin
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. CONTENT-ALIGNED FOOTER */}
      {/* Matches the max-w-3xl and px-4 of the form container for perfect vertical alignment */}
      <footer className="w-full max-w-3xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-mono uppercase tracking-widest text-green-500">
                 <Globe size={12} />
                 <span>Ibadan, NG // GMT+1</span>
               </div>
               <span className={`text-[9px] font-mono uppercase tracking-widest ${colors.muted}`}>Lat: 7.3775° N, Long: 3.9470° E</span>
            </div>
          </div>

          <div className="flex gap-8">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className={`${colors.muted} hover:${colors.accent} transition-all`}>
                <Icon size={18} strokeWidth={1.2} />
              </a>
            ))}
          </div>
      </footer>
    </motion.div>
  );
};