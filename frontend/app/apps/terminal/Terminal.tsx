import React, {
  useState, useRef, useEffect, useCallback, useMemo
} from 'react';
import { VscAdd, VscClose } from 'react-icons/vsc';
import {
  TERMINAL_CONFIG,
  resolveCommand,
  generateId,
  COMMANDS,
  type TerminalLine,
} from './commands';
import { useAssistant, type AIResponse } from '../../hooks/useAssistant';

interface TypewriterProps {
  text: string;
  speed?: number; 
  onComplete?: () => void;
  interrupted?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text, speed = 12, onComplete, interrupted = false,
}) => {
  const [shown, setShown] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    if (interrupted) {
      setShown(textRef.current.length);
      onComplete?.();
      return;
    }
    setShown(0);
    lastTimeRef.current = 0;

    const tick = (ts: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = ts;
      const elapsed = ts - lastTimeRef.current;
      const chars = Math.floor(elapsed / speed);
      if (chars > 0) {
        setShown(prev => {
          const next = Math.min(prev + chars, textRef.current.length);
          if (next >= textRef.current.length) onComplete?.();
          return next;
        });
        lastTimeRef.current = ts - (elapsed % speed);
      }
      if (shown < textRef.current.length) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [text, speed, onComplete, interrupted, shown]);

  return (
    <span className="whitespace-pre-wrap">
      {text.slice(0, shown)}
      {shown < text.length && (
        <span className="inline-block w-[1ch] animate-[blink_0.8s_step-end_infinite]">█</span>
      )}
    </span>
  );
};

interface StreamingLineProps {
  text: string;
  onComplete?: () => void;
  interrupted?: boolean;
}

const StreamingLine: React.FC<StreamingLineProps> = ({ text, onComplete, interrupted }) => {
  const [shown, setShown] = useState('');
  const textRef = useRef(text);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    if (interrupted) { setShown(text); onComplete?.(); return; }
    posRef.current = 0;
    setShown('');

    const stream = () => {
      const t = textRef.current;
      if (posRef.current >= t.length) { onComplete?.(); return; }
      const chunk = Math.floor(Math.random() * 4) + 1;
      posRef.current = Math.min(posRef.current + chunk, t.length);
      setShown(t.slice(0, posRef.current));
      const c = t[posRef.current - 1];
      const delay = c === '\n' ? 20 : c === ' ' ? 8 : 4;
      timerRef.current = setTimeout(stream, delay);
    };

    timerRef.current = setTimeout(stream, 60);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, interrupted, onComplete]);

  return (
    <span className="whitespace-pre-wrap">
      {shown}
      {shown.length < text.length && (
        <span className="inline-block opacity-70 animate-[blink_0.6s_step-end_infinite]">▋</span>
      )}
    </span>
  );
};

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const LoadingIndicator: React.FC<{ label: string }> = ({ label }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % SPINNER_FRAMES.length), 80);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[#60cdff]">
      <span className="mr-2 font-bold">{SPINNER_FRAMES[frame]}</span>
      <span className="opacity-70">{label}</span>
    </span>
  );
};

const BOOT_LINES = [
  { text: 'Etmae OS Terminal [Version 10.0.22621.2428]', delay: 0 },
  { text: '© Etmae Corp. All rights reserved.', delay: 180 },
  { text: '', delay: 300 },
  { text: 'Initializing kernel modules...', delay: 380 },
  { text: 'Loading user profile...                  [OK]', delay: 620 },
  { text: 'Mounting virtual filesystem...           [OK]', delay: 820 },
  { text: 'Starting Neural Link daemon...           [OK]', delay: 1050 },
  { text: 'Establishing AI endpoint...              [OK]', delay: 1280 },
  { text: '', delay: 1400 },
  { text: 'Type "help" for available commands.', delay: 1480 },
  { text: '', delay: 1550 },
];

interface BootSequenceProps { onComplete: () => void; }

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const doneRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach(({ text, delay }, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, text]);
        if (i === BOOT_LINES.length - 1 && !doneRef.current) {
          doneRef.current = true;
          setTimeout(onComplete, 300);
        }
      }, delay);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="p-4 font-['Cascadia_Code','Fira_Code',monospace] text-xs">
      {visibleLines.map((line, i) => (
        <div key={i} className={`leading-relaxed ${line.includes('[OK]') ? 'text-[#4ade80]' : line.startsWith('Type') ? 'text-[#60cdff]' : 'text-gray-400'}`}>
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  );
};

const ALL_COMMANDS = [...Object.keys(COMMANDS), 'clear', 'exit', '-ai'];
const SUBCOMMANDS: Record<string, string[]> = {
  ls: ['skillset'],
  whereis: ['live'],
};

function getCompletions(input: string): string[] {
  const parts = input.trim().split(/\s+/);
  if (parts.length === 1) {
    const q = parts[0].toLowerCase();
    return ALL_COMMANDS.filter(c => c.startsWith(q) && c !== q);
  }
  if (parts.length === 2) {
    const cmd = parts[0].toLowerCase();
    const arg = parts[1].toLowerCase();
    const subs = SUBCOMMANDS[cmd] ?? [];
    return subs.filter(s => s.startsWith(arg) && s !== arg);
  }
  return [];
}

const getInitialHistory = (): TerminalLine[] => [
  { id: generateId(), type: 'system', content: 'Terminal initialized.', isAnimated: false },
  { id: generateId(), type: 'output', content: '', isAnimated: false },
  { id: generateId(), type: 'output', content: '[SYSTEM] Type "help" to view available standard commands.', isAnimated: false },
  { id: generateId(), type: 'ai', content: '[INTELLIGENCE] AI assistant active. Prefix prompts with "-ai" to interact.', isAnimated: false },
  { id: generateId(), type: 'output', content: '', isAnimated: false },
];

interface Tab {
  id: string;
  title: string;
  history: TerminalLine[];
  cmdHistory: string[];   
  histIdx: number;        
}

export const Terminal: React.FC<{ onNavigate?: (s: string, p?: any) => void }> = ({ onNavigate }) => {
  const { sendMessage } = useAssistant();

  const [booted, setBooted] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Command Prompt', history: getInitialHistory(), cmdHistory: [], histIdx: -1 }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const [completions, setCompletions] = useState<string[]>([]);
  const [completionIdx, setCompletionIdx] = useState(0);
  const [activeLoadingId, setActiveLoadingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputSavedRef = useRef('');

  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId) || tabs[0], [tabs, activeTabId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTab.history, activeLoadingId]);

  const focusInput = () => inputRef.current?.focus();

  const updateTab = useCallback((id: string, patch: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const pushLines = useCallback((lines: TerminalLine[]) => {
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, history: [...t.history, ...lines] } : t
    ));
  }, [activeTabId]);

  const replaceLoadingWith = useCallback((loadingId: string, lines: TerminalLine[]) => {
    setTabs(prev => prev.map(t =>
      t.id === activeTabId
        ? { ...t, history: [...t.history.filter((l: TerminalLine) => l.id !== loadingId), ...lines] }
        : t
    ));
    setActiveLoadingId(null);
  }, [activeTabId]);

  const addTab = () => {
    const id = generateId();
    setTabs(prev => [...prev, {
      id, title: `Command Prompt (${prev.length + 1})`,
      history: getInitialHistory(), cmdHistory: [], histIdx: -1,
    }]);
    setActiveTabId(id);
    setInput('');
    setBooted(false);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const next = tabs.filter(t => t.id !== id);
    setTabs(next);
    if (activeTabId === id) setActiveTabId(next[0].id);
  };

  const handleInterrupt = useCallback(() => {
    if (!isExecuting) return;
    setInterrupted(true);
    setActiveLoadingId(null);
    pushLines([{ id: generateId(), type: 'error', content: '^C', isAnimated: false }]);
    setIsExecuting(false);
    setTimeout(() => setInterrupted(false), 200);
  }, [isExecuting, pushLines]);

  const handleTab = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    const matches = getCompletions(input);
    if (matches.length === 0) return;
    if (completions.length === 0 || JSON.stringify(completions) !== JSON.stringify(matches)) {
      setCompletions(matches);
      setCompletionIdx(0);
      if (matches.length === 1) {
        const parts = input.trim().split(/\s+/);
        if (parts.length === 1) setInput(matches[0] + ' ');
        else { parts[parts.length - 1] = matches[0]; setInput(parts.join(' ') + ' '); }
        setCompletions([]);
        return;
      }
      pushLines([{ id: generateId(), type: 'system', content: matches.join('    '), isAnimated: false }]);
    } else {
      const idx = (completionIdx + 1) % matches.length;
      setCompletionIdx(idx);
      const parts = input.trim().split(/\s+/);
      if (parts.length === 1) setInput(matches[idx]);
      else { parts[parts.length - 1] = matches[idx]; setInput(parts.join(' ')); }
    }
  }, [input, completions, completionIdx, pushLines]);

  const navigateHistory = useCallback((dir: 'up' | 'down') => {
    const hist = activeTab.cmdHistory;
    if (hist.length === 0) return;
    let idx = activeTab.histIdx;
    if (dir === 'up') {
      if (idx === -1) { inputSavedRef.current = input; idx = hist.length - 1; }
      else if (idx > 0) idx--;
    } else {
      if (idx === -1) return;
      if (idx < hist.length - 1) idx++;
      else { idx = -1; updateTab(activeTabId, { histIdx: -1 }); setInput(inputSavedRef.current); return; }
    }
    updateTab(activeTabId, { histIdx: idx });
    setInput(hist[idx]);
  }, [activeTab, activeTabId, input, updateTab]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'c' && e.ctrlKey) { handleInterrupt(); return; }
    if (e.key === 'Tab') { handleTab(e); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); navigateHistory('up'); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); navigateHistory('down'); return; }
    if (e.key !== 'Tab') setCompletions([]);
  }, [handleInterrupt, handleTab, navigateHistory]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw || isExecuting) return;

    setInput('');
    setCompletions([]);
    setIsExecuting(true);
    setInterrupted(false);

    const newCmdHistory = [...activeTab.cmdHistory.filter(c => c !== raw), raw];
    updateTab(activeTabId, { cmdHistory: newCmdHistory, histIdx: -1 });

    pushLines([{ id: generateId(), type: 'input', content: `${TERMINAL_CONFIG.path}> ${raw}`, isAnimated: false }]);

    if (raw.toLowerCase() === 'exit') {
      pushLines([{ id: generateId(), type: 'system', content: 'Goodbye.', isAnimated: true }]);
      setIsExecuting(false);
      return;
    }

    if (raw.toLowerCase() === 'clear') {
      updateTab(activeTabId, { history: [], cmdHistory: newCmdHistory, histIdx: -1 });
      setIsExecuting(false);
      return;
    }

    if (raw.toLowerCase().startsWith('-ai')) {
      const query = raw.slice(3).trim();
      if (!query) {
        pushLines([{ id: generateId(), type: 'error', content: 'Usage: -ai <query>', isAnimated: false }]);
        setIsExecuting(false);
        return;
      }

      const loadId = generateId();
      setActiveLoadingId(loadId);
      setTabs(prev => prev.map(t => t.id === activeTabId
        ? { ...t, history: [...t.history, { id: loadId, type: 'loading' as const, content: 'Neural link established. Thinking...', isAnimated: false }] }
        : t
      ));

      await sendMessage(query, (action: AIResponse["action"], payload?: { projectId?: string }, msg?: string) => {
        replaceLoadingWith(loadId, [{
          id: generateId(), type: 'ai', content: msg || "", isAnimated: true,
        }]);
        if (action && action !== 'NONE' && onNavigate) {
          const map: Record<string, string> = { OPEN_PROJECT: 'project-detail', OPEN_SKILLS: 'home', OPEN_CONTACT: 'contact' };
          if (map[action]) onNavigate(map[action], payload?.projectId);
        }
      });
      setIsExecuting(false);
      return;
    }

    const output = await resolveCommand(raw);
    if (raw.toLowerCase() === 'neofetch') {
      const loadId = generateId();
      setActiveLoadingId(loadId);
      setTabs(prev => prev.map(t => t.id === activeTabId
        ? { ...t, history: [...t.history, { id: loadId, type: 'loading' as const, content: 'Polling hardware...', isAnimated: false }] }
        : t
      ));
      await new Promise(r => setTimeout(r, 500));
      replaceLoadingWith(loadId, output);
    } else {
      pushLines(output);
    }
    setIsExecuting(false);
  };

  const colorMap: Record<string, string> = {
    input: 'text-white', error: 'text-red-400', loading: 'text-[#60cdff]',
    system: 'text-gray-500', ai: 'text-[#9cdcfe]', output: 'text-[#cccccc]',
    success: 'text-[#4ade80]',
  };

  const renderLine = useCallback((line: TerminalLine, idx: number) => {
    const cls = colorMap[line.type] ?? 'text-[#cccccc]';
    const isLast = idx === activeTab.history.length - 1;
    if (line.type === 'loading') {
      return <div key={line.id} className={`${cls} leading-relaxed`}><LoadingIndicator label={line.content} /></div>;
    }
    return (
      <div key={line.id} className={`${cls} leading-relaxed`}>
        {line.isAnimated && isLast ? (
          line.type === 'ai'
            ? <StreamingLine text={line.content} interrupted={interrupted} />
            : <Typewriter text={line.content} interrupted={interrupted} />
        ) : (
          <span className="whitespace-pre-wrap">{line.content}</span>
        )}
      </div>
    );
  }, [activeTab.history.length, interrupted]);

  return (
    <div
      className="flex flex-col w-full h-full bg-[#0c0c0ce6] backdrop-blur-xl text-[#cccccc] font-['Cascadia_Code','Fira_Code',monospace] text-xs overflow-hidden shadow-2xl"
      onClick={focusInput}
    >
      <div className="flex items-center bg-[#1e1e1e] px-2 pt-1 h-9 select-none overflow-x-auto">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => { setActiveTabId(tab.id); setInput(''); }}
            className={`group relative flex items-center px-4 h-full min-w-[120px] rounded-t-lg border-b-2 transition-all cursor-default ${activeTabId === tab.id ? 'bg-[#0c0c0c] border-[#60cdff] text-white' : 'hover:bg-[#2b2b2b] border-transparent text-gray-400'}`}
          >
            <span className="truncate text-[11px]">{tab.title}</span>
            <button onClick={(e) => closeTab(tab.id, e)} className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-opacity"><VscClose size={14} /></button>
          </div>
        ))}
        <button onClick={addTab} className="p-2 ml-1 text-gray-400 hover:bg-white/10 rounded-md transition-colors"><VscAdd size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar" ref={scrollRef} onClick={focusInput} style={{ scrollBehavior: 'smooth' }}>
        {!booted ? (
          <BootSequence onComplete={() => setBooted(true)} />
        ) : (
          <div className="p-3">
            <div className="flex flex-col gap-0.5 mb-2">
              {activeTab.history.map((line: TerminalLine, i: number) => renderLine(line, i))}
            </div>
            <form onSubmit={handleCommand} className="flex items-center">
              <span className="text-[#60cdff] mr-2 shrink-0 select-none">{TERMINAL_CONFIG.path}&gt;</span>
              <input
                ref={inputRef} type="text" autoFocus spellCheck={false} autoComplete="off" value={input}
                onChange={e => { setInput(e.target.value); setCompletions([]); }}
                onKeyDown={handleKeyDown} disabled={isExecuting}
                className="bg-transparent border-none outline-none flex-1 text-white caret-[#60cdff] disabled:opacity-40"
              />
            </form>
            {completions.length > 1 && (
              <div className="mt-1 ml-[9ch] flex gap-4 text-gray-500">
                {completions.map((c, i) => (
                  <span key={c} className={i === completionIdx ? 'text-[#60cdff]' : ''}>{c}</span>
                ))}
              </div>
            )}
            <div className="mt-2 text-gray-600 text-[10px] select-none">
              <span className="mr-4">↑↓ history</span><span className="mr-4">TAB complete</span><span>Ctrl+C interrupt</span>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
};

export default Terminal;