import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Coffee, MessageSquare, MapPin, ArrowLeft, Send } from 'lucide-react';

interface ContactPageProps {
  theme?: 'dark' | 'light';
  onBack?: () => void; // If using a state-based router
}

export const FullContactPage: React.FC<ContactPageProps> = ({ theme = 'dark', onBack }) => {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#050505]' : 'bg-zinc-50';
  const textPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const cardBg = isDark ? 'bg-zinc-900/40' : 'bg-white';
  const borderClass = isDark ? 'border-zinc-800' : 'border-zinc-200';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen w-full ${bgClass} ${textPrimary} font-sans selection:bg-green-500/30`}
    >
      {/* 1. Header / Navigation */}
      <nav className="p-8 md:p-12 flex justify-between items-center">
        <button 
          onClick={handleBack}
          className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest ${textSecondary} hover:text-orange-500 transition-colors group`}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>
        <div className={`text-[10px] font-mono uppercase tracking-[0.3em] ${textSecondary}`}>
          Availability: Q1 2025
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* 2. Left Column: The Welcome */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter leading-none mb-8">
              Let's grab a <br />
              <span className="italic font-serif text-green-500">virtual</span> coffee.
            </h1>
            <p className={`text-lg md:text-xl leading-relaxed ${textSecondary} max-w-md`}>
              Whether you have a fully-formed brief or just a seedling of an idea, my door is always open. I love talking about systems, motion, and the future of the web.
            </p>

            {/* Personal Details */}
            <div className="mt-16 space-y-8">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${borderClass}`}>
                  <MapPin size={18} className={textSecondary} />
                </div>
                <div>
                  <span className={`block text-[10px] font-mono uppercase tracking-widest ${textSecondary}`}>Based In</span>
                  <span className="text-lg">Ibadan, Nigeria — (GMT+1)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${borderClass}`}>
                  <Coffee size={18} className={textSecondary} />
                </div>
                <div>
                  <span className={`block text-[10px] font-mono uppercase tracking-widest ${textSecondary}`}>Meeting Preference</span>
                  <span className="text-lg">Google Meet or Discord</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. Right Column: The "Warm" Contact Method */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-3xl border ${borderClass} ${cardBg} backdrop-blur-xl p-8 md:p-12`}
          >
            <h2 className="text-2xl font-medium mb-8">Send a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-mono uppercase tracking-widest ${textSecondary}`}>What's your name?</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className={`w-full bg-transparent border-b ${borderClass} py-3 outline-none focus:border-green-500 transition-colors`}
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] font-mono uppercase tracking-widest ${textSecondary}`}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className={`w-full bg-transparent border-b ${borderClass} py-3 outline-none focus:border-green-500 transition-colors`}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className={`text-[10px] font-mono uppercase tracking-widest ${textSecondary}`}>What's on your mind?</label>
                <div className="flex flex-wrap gap-3 py-4">
                  {['New Project', 'Freelance', 'Consulting', 'Just Saying Hi'].map((choice) => (
                    <button 
                      key={choice}
                      type="button"
                      className={`px-4 py-2 rounded-full border ${borderClass} text-xs uppercase tracking-wider hover:border-green-500 hover:text-orange-500 transition-all`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                 <label className={`text-[10px] font-mono uppercase tracking-widest ${textSecondary}`}>Message</label>
                 <textarea 
                    rows={4}
                    placeholder="Tell me a bit about your project..." 
                    className={`w-full bg-transparent border-b ${borderClass} py-3 outline-none focus:border-green-500 transition-colors resize-none`}
                 />
              </div>

              <button className="w-full mt-8 py-5 rounded-full bg-green-500 text-white font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
                <Send size={14} />
                Transmit Message
              </button>
            </form>
          </motion.div>

          {/* Alternative Contact */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <p className={`text-sm ${textSecondary}`}>Prefer your own client?</p>
            <a 
              href="mailto:hello@developer.com" 
              className="flex items-center gap-3 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${borderClass} group-hover:bg-orange-500 group-hover:border-orange-500 transition-all`}>
                <Mail size={16} className="group-hover:text-white" />
              </div>
              <span className="text-sm font-medium">hello@developer.com</span>
            </a>
          </div>
        </div>
      </main>

      {/* 4. Subtle Background Detail */}
      <div className="fixed bottom-0 right-0 p-12 opacity-10 pointer-events-none">
        <MessageSquare size={300} strokeWidth={0.5} />
      </div>
    </motion.div>
  );
};