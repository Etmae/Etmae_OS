import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Paperclip,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Loader2,
  X,
} from 'lucide-react';
import { getPortfolioTheme, type PortfolioThemeMode } from './theme';
import { SuccessTransmission } from './components/SuccessTransmission';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactPageProps {
  theme?: PortfolioThemeMode;
  onNavigate: (section: any) => void;
}

interface ContactFormData {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  file: File | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const API_BASE = import.meta.env.VITE_API_URL ?? '';

const INITIAL_DATA: ContactFormData = {
  name: '',
  email: '',
  service: '',
  budget: '',
  message: '',
  file: null,
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Component ────────────────────────────────────────────────────────────────

export const ContactPage: React.FC<ContactPageProps> = ({
  theme = 'dark',
  onNavigate,
}) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [data, setData] = useState<ContactFormData>(INITIAL_DATA);

  // Stores the submitter's name separately so the success screen still has it
  // even after form data is reset on successful submission.
  const [submittedName, setSubmittedName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Guards against double-steps caused by Framer Motion's exit animation.
   *
   * With mode="wait", the exiting step content stays in the DOM for the full
   * duration of its exit animation (~700ms). During that window its buttons
   * are still clickable. A quick second tap on a service/budget button would
   * fire setStep again — e.g. 3 → 4 then immediately 4 → 5, landing on the
   * success screen without the user ever entering their email.
   *
   * The fix: set this ref to `true` the moment any step change is queued,
   * and reset it to `false` only inside onAnimationComplete of the ENTERING
   * motion.div (i.e. after the new step has fully settled). Every
   * step-changing call is gated behind this ref.
   */
  const isTransitioning = useRef(false);

  const colors = getPortfolioTheme(theme);

  // ── Validation ──────────────────────────────────────────────────────────────

  const canProgress = () => {
    switch (step) {
      case 0: return data.name.trim().length > 1;
      case 2: return data.message.trim().length >= 10;
      case 4: return validateEmail(data.email);
      default: return false;
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────────

  const safeSetStep = (updater: (s: number) => number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setStep(updater);
  };

  const handleNext = () => {
    if (canProgress()) safeSetStep((s) => s + 1);
  };

  const handlePrev = () => safeSetStep((s) => Math.max(0, s - 1));

  // ── File helpers ────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError('Unsupported format. Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File is too large. Maximum size is 5 MB.');
      return;
    }

    setFileError(null);
    setData((prev) => ({ ...prev, file }));
  };

  const handleFileClear = () => {
    setData((prev) => ({ ...prev, file: null }));
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submission ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateEmail(data.email) || isLoading) return;

    setIsLoading(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('service', data.service);
      formData.append('budget', data.budget);
      formData.append('message', data.message);
      if (data.file) formData.append('file', data.file);

      const response = await fetch(`${API_BASE}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Something went wrong. Please try again.');
      }

      // Preserve the name for the success screen BEFORE resetting form state.
      // If we reset data first, SuccessTransmission receives name="" because
      // both state updates would be batched in the same render.
      setSubmittedName(data.name);
      setData(INITIAL_DATA);
      safeSetStep(() => 5);

    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-dvh w-full flex flex-col justify-between px-4 pt-12 pb-24 md:px-12 md:pt-16 md:pb-32 ${colors.bg} relative overflow-hidden selection:bg-green-500/30 transition-colors duration-150`}
    >
      
      {/* ── Side navigation ─────────────────────────────────────────────── */}
      {step < 5 && (
        <>
          {/* Back Arrow: Moved closer to center (left-28% vs 20%) and higher (top-65% vs 72%) on mobile */}
          <div className="absolute left-[28%] md:left-20 top-[65%] md:top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() =>
                step === 0 ? onNavigate('home') : handlePrev()
              }
              className={`p-4 md:p-6 rounded-full ${colors.muted} hover:${colors.text} transition-all duration-150 group`}
            >
              <ArrowLeft
                size={28}
                strokeWidth={1}
                className="group-hover:-translate-x-2 transition-transform duration-150"
              />
            </button>
          </div>

          {/* Forward arrow: Moved closer to center (right-28% vs 20%) and higher (top-65% vs 72%) on mobile */}
          {(step === 0 || step === 2) && (
            <div className="absolute right-[28%] md:right-12 top-[65%] md:top-1/2 -translate-y-1/2 z-20">
              <button
                disabled={!canProgress()}
                onClick={handleNext}
                className={`p-4 md:p-6 rounded-full transition-all duration-150 group ${canProgress()
                    ? `${colors.accent}`
                    : `opacity-30 cursor-not-allowed ${colors.muted}`
                  }`}
              >
                <ArrowRight
                  size={28}
                  strokeWidth={1}
                  className={
                    canProgress()
                      ? 'group-hover:translate-x-2 transition-transform duration-150'
                      : ''
                  }
                />
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Main form area ──────────────────────────────────────────────── */}
      <main className="flex-1 relative flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            onAnimationComplete={() => {
              // Unlock navigation only after the entering step has fully settled.
              isTransitioning.current = false;
            }}
            className="w-full max-w-3xl flex flex-col items-center text-center px-4"
          >
            <div
              className={`text-[10px] font-mono uppercase tracking-[0.3em] ${colors.muted} mb-6 md:mb-8`}
            >
              {step < 5 ? `Step 0${step + 1} ` : 'Finalized'}
            </div>

            {/* ── Step 0 · Name ─────────────────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-8 md:space-y-10 w-full">
                <h2
                  className={`text-4xl md:text-8xl font-light tracking-tight ${colors.text}`}
                >
                  What is your{' '}
                  <span className="italic font-serif text-green-500">name?</span>
                </h2>
                <input
                  autoFocus
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' && canProgress() && handleNext()
                  }
                  placeholder="Type here..."
                  className={`w-full ${colors.inputBg} border-b ${colors.border} pb-3 md:pb-4 text-2xl md:text-4xl text-center outline-none focus:border-green-500 transition-all ${colors.text} placeholder:opacity-20`}
                />
              </div>
            )}

            {/* ── Step 1 · Service ──────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-8 md:space-y-12 w-full">
                <h2
                  className={`text-3xl md:text-7xl font-light tracking-tight ${colors.text}`}
                >
                  What's up,{' '}
                  <span className="text-green-500 italic font-serif">
                    {data.name.split(' ')[0]}
                  </span>
                  ?<br />
                  What are we{' '}
                  <span className="italic font-serif">building?</span>
                </h2>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full">
                  {['Frontend', 'Web Systems', 'Backend', 'Full-Stack', 'DB DESIGN'].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setData((prev) => ({ ...prev, service: s }));
                          safeSetStep((prev) => prev + 1);
                        }}
                        className={`px-6 py-3 md:px-8 md:py-4 rounded-full border text-[10px] uppercase tracking-widest transition-all hover:border-green-500 hover:text-green-500 ${data.service === s
                            ? `${colors.selectedBg} ${colors.selectedText} border-transparent`
                            : `${colors.border} ${colors.muted}`
                          }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* ── Step 2 · Message ──────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6 md:space-y-8 w-full">
                <h2
                  className={`text-3xl md:text-6xl font-light tracking-tight ${colors.text}`}
                >
                  Tell me about the{' '}
                  <span className="italic font-serif text-green-500">
                    project.
                  </span>
                </h2>
                <div
                  className={`w-full border ${colors.border} ${colors.cardBg} rounded-2xl p-4 md:p-6 relative transition-colors focus-within:border-green-500 shadow-sm`}
                >
                  <textarea
                    autoFocus
                    value={data.message}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Briefly describe your vision..."
                    className={`w-full ${colors.inputBg} border-none text-lg md:text-xl outline-none resize-none h-32 md:h-40 leading-relaxed font-light ${colors.text} placeholder:opacity-30`}
                  />
                  <div
                    className={`flex justify-between items-center mt-3 md:mt-4 pt-3 md:pt-4 border-t ${colors.border}`}
                  >
                    {data.file ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase tracking-widest ${colors.muted} truncate max-w-[120px] md:max-w-[180px]`}
                        >
                          {data.file.name}
                        </span>
                        <button
                          onClick={handleFileClear}
                          aria-label="Remove attachment"
                          className={`flex items-center gap-1 text-[10px] uppercase tracking-widest ${colors.muted} hover:text-red-400 transition-all`}
                        >
                          <X size={12} />
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-2 text-[10px] uppercase tracking-widest ${colors.muted} hover:text-green-500 transition-all`}
                      >
                        <Paperclip size={14} />
                        Attach Brief (PDF / DOC / DOCX)
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <span className={`text-[9px] font-mono ${colors.muted}`}>
                      {data.message.length} chars
                    </span>
                  </div>
                  {fileError && (
                    <p className="text-red-400 text-xs mt-3">{fileError}</p>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 3 · Budget ───────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-8 md:space-y-12 w-full">
                <h2
                  className={`text-4xl md:text-7xl font-light tracking-tight ${colors.text}`}
                >
                  How should we{' '}
                  <span className="italic font-serif">scale this?</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 w-full">
                  {['$5k+', '$10k+', '$25k+', '$50k+', 'Enterprise', 'TBD'].map(
                    (b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setData((prev) => ({ ...prev, budget: b }));
                          safeSetStep((prev) => prev + 1);
                        }}
                        className={`px-3 py-4 md:px-6 md:py-5 border ${colors.border} text-[10px] font-mono uppercase tracking-widest hover:border-green-500 transition-all rounded-sm ${data.budget === b
                            ? `${colors.selectedBg} ${colors.selectedText} border-transparent`
                            : colors.text
                          }`}
                      >
                        {b}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* ── Step 4 · Email + Submit ───────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-8 md:space-y-10 w-full">
                <h2
                  className={`text-4xl md:text-8xl font-light tracking-tight ${colors.text}`}
                >
                  Where can I{' '}
                  <span className="italic font-serif">reach you?</span>
                </h2>
                <input
                  autoFocus
                  type="email"
                  value={data.email}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, email: e.target.value }));
                    setSubmitError(null);
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      validateEmail(data.email) &&
                      !isLoading
                    ) {
                      handleSubmit();
                    }
                  }}
                  placeholder="email@example.com"
                  className={`w-full ${colors.inputBg} border-b ${colors.border} pb-3 md:pb-4 text-2xl md:text-4xl text-center outline-none focus:border-green-500 transition-all ${colors.text} placeholder:opacity-20`}
                />
                <AnimatePresence>
                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-sm font-mono"
                    >
                      {submitError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {validateEmail(data.email) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="mt-8 md:mt-12 px-8 py-4 md:px-12 md:py-5 rounded-full bg-green-500 text-black text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(34,197,94,0.2)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 mx-auto"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Transmitting...
                          </>
                        ) : (
                          'Confirm & Transmit'
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── Step 5 · Success ──────────────────────────────────────── */}
            {step === 5 && (
              <SuccessTransmission
                name={submittedName}
                colors={{ text: colors.text, muted: colors.muted }}
                onReturn={() => {
                  setSubmittedName('');
                  setStep(0);
                  onNavigate('home');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="w-full max-w-3xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center  relative z-10 pb-22">

      <div className="flex gap-20 md:gap-50">
          {(
            [
              [Twitter, 'https://twitter.com/'],
              [Github, 'https://github.com/'],
              [Linkedin, 'https://linkedin.com/in/'],
            ] as const
          ).map(([Icon, href], i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${colors.muted} hover:${colors.accent} transition-all`}
            >
              <Icon size={18} strokeWidth={1.2} />
            </a>
          ))}
        </div>
      </footer>
    </motion.div>
  );
};