import React, { useState, useRef, useEffect } from 'react';
import { VscAdd, VscChevronDown, VscClose } from 'react-icons/vsc';
import { COMMANDS, TERMINAL_CONFIG } from './commands';

interface Tab {
  id: string;
  title: string;
  history: string[];
}

export const Terminal = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Command Prompt', history: ['Microsoft Windows [Version 10.0.22621.2428]', '(c) Microsoft Corporation. All rights reserved.', '', 'Type "help" to see available commands.'] }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Scroll to bottom on history change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTab.history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let newHistory = [...activeTab.history, `${TERMINAL_CONFIG.path}> ${input}`];

    if (cmd === 'clear') {
      newHistory = [];
    } else if (COMMANDS[cmd]) {
      newHistory.push(COMMANDS[cmd]);
    } else {
      newHistory.push(`'${cmd}' is not recognized as an internal or external command.`);
    }

    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, history: newHistory } : t));
    setInput('');
  };

  const addTab = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setTabs([...tabs, { 
      id: newId, 
      title: `Command Prompt (${tabs.length + 1})`, 
      history: ['Microsoft Windows [Version 10.0.22621.2428]', '', 'Type "help" to start.'] 
    }]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close last tab
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) setActiveTabId(newTabs[0].id);
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[220px] bg-[#0c0c0ce6] backdrop-blur-xl text-[#cccccc] font-['Cascadia_Code',monospace] text-[11px] sm:text-xs md:text-sm overflow-hidden shadow-2xl">
      
      {/* Tab Bar (Windows 11 Style) */}
      <div className="flex items-center bg-[#1e1e1e] px-2 pt-1 h-8 sm:h-9 md:h-10 select-none overflow-x-auto">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group relative flex items-center h-full px-3 sm:px-4 min-w-[96px] sm:min-w-[120px] max-w-[180px] sm:max-w-[200px] rounded-t-lg transition-colors cursor-default border-b-2 whitespace-nowrap ${
              activeTabId === tab.id 
              ? 'bg-[#0c0c0c] border-[#60cdff] text-white' 
              : 'hover:bg-[#2b2b2b] border-transparent text-gray-400'
            }`}
          >
            <span className="truncate text-xs">{tab.title}</span>
            <button 
              onClick={(e) => closeTab(tab.id, e)}
              className="ml-auto p-0.5 rounded-md hover:bg-[#ffffff20] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <VscClose size={14} />
            </button>
          </div>
        ))}
        
        <button 
          onClick={addTab}
          className="p-2 ml-1 text-gray-400 hover:bg-[#ffffff10] rounded-md transition-colors"
        >
          <VscAdd size={16} />
        </button>
        <button className="p-2 text-gray-400 hover:bg-[#ffffff10] rounded-md">
          <VscChevronDown size={16} />
        </button>
      </div>

      {/* Terminal Body */}
      <div 
        className="flex-1 p-3 overflow-y-auto custom-scrollbar scroll-smooth" 
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="whitespace-pre-wrap mb-2 text-[11px] sm:text-xs md:text-sm">
          {activeTab.history.join('\n')}
        </div>
        
        <form onSubmit={handleCommand} className="flex items-center">
          <span className="text-[#60cdff] mr-2 shrink-0">{TERMINAL_CONFIG.path}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            autoFocus
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-white caret-[#60cdff]"
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;


