import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, RefreshCw, Sun, Calendar, ListChecks, ArrowUpRight, ArrowDownRight, Search, UserCircle } from 'lucide-react';

// --- SIMULATED DATA ---

const simulatedMarketData = [
  { symbol: 'S&P 500', name: 'S&P 500', price: 4012.61 },
  { symbol: 'DOW', name: 'DOW', price: 33141.28 },
  { symbol: 'NASDAQ', name: 'NASDAQ', price: 13779.88 },
  { symbol: 'RUT', name: 'Russell 2000', price: 1862.32 },
];

const generateRandomChange = () => {
  const change = (Math.random() * 0.8 - 0.4) / 100;
  const sign = change >= 0 ? '+' : '-';
  const percentage = Math.abs(change * 100).toFixed(2) + '%';
  return { change, sign, percentage };
};

const getSimulatedMarketWidgets = () => {
    return simulatedMarketData.map(stock => {
        const { change, sign, percentage } = generateRandomChange();
        const newPrice = (stock.price * (1 + change)).toFixed(2);
        const trend = change >= 0 ? 'up' : 'down';
        
        return {
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: `${sign}${percentage}`,
            value: newPrice,
            trend: trend as 'up' | 'down',
        };
    });
};

const simulatedNewsData = [
  { id: 1, title: 'New AI Model Achieves Breakthrough in Material Science Prediction', source: 'Tech Insights • 2h ago', category: 'Technology' },
  { id: 2, title: 'Global Markets Stabilize After Week of Volatility; Oil Prices Tick Up', source: 'Financial Times • 1h ago', category: 'Finance' },
  { id: 3, title: 'Top 5 Home Workout Gear for the New Year', source: 'Health & Wellness • 3h ago', category: 'Lifestyle' },
  { id: 4, title: 'Porsches across Russia suddenly stop working after software update.', source: 'The Independent • 1h', category: 'Auto' },
  { id: 5, title: 'Microsoft Copilot goes down in major outage.', source: 'The Independent • 1h', category: 'Tech' },
  { id: 6, title: 'NASA reveals stunning new images of the Pillars of Creation.', source: 'Space.com • 4h ago', category: 'Science' },
];

// --- INTERFACES ---

interface WidgetData {
  label?: string;
  title?: string;
  change?: string;
  value?: string;
  source?: string;
  symbol?: string;
  name?: string;
  price?: number; 
  trend?: 'up' | 'down'; 
}

interface WidgetsBoardProps {
  widgetsOpen: boolean;
  keepWidgetsOpen: () => void;
  scheduleWidgetsClose: () => void;
}

// --- HELPER COMPONENTS ---

const WidgetCard: React.FC<React.PropsWithChildren<{ size?: 'small' | 'medium' | 'large', className?: string }>> = ({ children, size = 'medium', className = '' }) => {
  return (
    <div
      className={`p-4 rounded-xl text-white backdrop-blur-md transition-shadow duration-300 ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        // Standardizing heights for the grid
        height: size === 'medium' ? '150px' : size === 'large' ? '316px' : 'auto', 
        cursor: 'pointer',
        fontFamily: 'Segoe UI',
      }}
    >
      {children}
    </div>
  );
};

const MarketWidgetCard: React.FC<WidgetData> = ({ name, change, value, trend }) => {
    const isUp = trend === 'up';
    return (
        <WidgetCard size="medium" className="flex flex-col justify-between !h-[120px]">
            <div>
                <div className="text-white/60 text-xs font-medium">{name}</div>
                <div className="text-2xl font-semibold mt-1 leading-tight">{value}</div>
            </div>
            <div className="text-sm font-medium flex items-center gap-1"
                 style={{ color: isUp ? '#4ade80' : '#f87171' }}>
                {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change}
            </div>
        </WidgetCard>
    );
};

// Updated News Card to look like a "Tile" (Image Top, Text Bottom)
const NewsCard: React.FC<{ title: string; source: string; category: string }> = ({ title, source, category }) => (
    <div className="group flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all hover:bg-white/5"
         style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        
        {/* Large Image Placeholder */}
        <div className="h-32 w-full bg-white/10 relative group-hover:bg-white/15 transition-colors">
            {/* Category Tag */}
            <span className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white/90 text-[10px] px-2 py-0.5 rounded-sm font-medium uppercase tracking-wider">
                {category}
            </span>
        </div>
        
        <div className="p-3 flex flex-col gap-2">
            <div className="text-white text-sm font-semibold leading-snug line-clamp-2">{title}</div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
                 {/* Source Icon Placeholder */}
                 <div className="w-4 h-4 rounded-full bg-white/20"></div>
                 {source}
            </div>
        </div>
    </div>
);


// --- MAIN COMPONENT ---

const WidgetsBoard: React.FC<WidgetsBoardProps> = ({
  widgetsOpen,
  keepWidgetsOpen,
  scheduleWidgetsClose,
}) => {

    const [marketWidgets, setMarketWidgets] = useState<WidgetData[]>([]);

    // Simulated Weather Data
    const weatherData = {
        location: 'Shaki, NG',
        temp: '28°',
        condition: 'Sunny',
        highLow: 'H:31° L:24°',
        icon: <Sun size={48} className="text-yellow-400" />,
    }

    // Dynamic Market Data Simulation
    useEffect(() => {
        setMarketWidgets(getSimulatedMarketWidgets());
        const intervalId = setInterval(() => {
            setMarketWidgets(getSimulatedMarketWidgets());
        }, 30000); 
        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = useCallback(() => {
        setMarketWidgets(getSimulatedMarketWidgets());
    }, []);


    return (
        <AnimatePresence>
        {widgetsOpen && (
            <motion.div
            className="fixed top-0 left-0 h-screen z-50"
            // Ensure panel is wide enough (66vw is good, max 900px is good)
            style={{ width: '850px', maxWidth: '90vw' }} 
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ type: "tween", ease: "circOut", duration: 0.25 }}
            onMouseEnter={keepWidgetsOpen}
            onMouseLeave={scheduleWidgetsClose}
            >
            {/* 1. Backdrop/Mica Effect */}
            <div
                className="absolute inset-0 bg-[#202020]/95"
                style={{
                backdropFilter: 'blur(60px) saturate(150%)', // Heavier blur for realism
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '10px 0 30px rgba(0, 0, 0, 0.5)',
                }}
            />

            {/* 2. Main Scrollable Content */}
            <div className="relative h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar">
                
                {/* Header Section */}
                <div className="sticky top-0 z-20 px-8 py-6 flex flex-col gap-4"
                     style={{ background: 'linear-gradient(to bottom, rgba(32,32,32,0.95) 0%, rgba(32,32,32,0.8) 80%, transparent 100%)', backdropFilter: 'blur(8px)' }}>
                    
                    {/* Time and Profile Row */}
                    <div className="flex justify-between items-center">
                        <div className="text-white/90 font-medium text-lg">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-3">
                            <UserCircle size={28} className="text-white/60" />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search the web" 
                            className="w-full bg-[#303030] text-white text-sm py-2.5 pl-10 pr-4 rounded-full border border-white/10 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                </div>

                {/* DASHBOARD LAYOUT: 3 Columns Grid */}
                <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* --- COLUMN 1: PINNED WIDGETS (Left Side) --- */}
                    <div className="flex flex-col gap-4">
                        
                        {/* Weather - Large */}
                        <WidgetCard size="medium" className="!h-auto aspect-square flex flex-col justify-between bg-gradient-to-br from-blue-600/20 to-blue-900/20">
                            <div className="flex justify-between items-start">
                                <span className="bg-white/10 text-[10px] px-2 py-0.5 rounded text-white/90">My Location</span>
                                <button className="text-white/60 hover:text-white"><Settings size={14}/></button>
                            </div>
                            <div className="flex flex-col items-center gap-1 my-2">
                                {weatherData.icon}
                                <div className="text-5xl font-light text-white tracking-tighter">{weatherData.temp}</div>
                                <div className="text-white/90 font-medium">{weatherData.condition}</div>
                            </div>
                            <div className="flex justify-between text-xs text-white/60 border-t border-white/10 pt-3">
                                <span>{weatherData.location}</span>
                                <span>{weatherData.highLow}</span>
                            </div>
                        </WidgetCard>

                        {/* Market Widgets Stack */}
                        <div className="grid grid-cols-2 gap-3">
                             {marketWidgets.slice(0, 2).map((widget, index) => (
                                <MarketWidgetCard key={index} {...widget} />
                            ))}
                        </div>

                         {/* To Do Widget */}
                         <WidgetCard size="medium" className="!h-auto min-h-[140px]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <ListChecks size={16} className="text-blue-400" />
                                    <span className="text-sm font-semibold">To Do</span>
                                </div>
                                <Plus size={16} className="text-white/50 cursor-pointer" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 p-2 rounded bg-white/5">
                                    <div className="w-4 h-4 rounded border border-white/30"></div>
                                    <span className="text-xs text-white/80 line-through decoration-white/50">Review project</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded bg-white/5">
                                    <div className="w-4 h-4 rounded border border-white/30"></div>
                                    <span className="text-xs text-white">Call Mom</span>
                                </div>
                            </div>
                        </WidgetCard>

                         {/* Add Widget Button */}
                         <button className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-colors">
                            Add widgets
                         </button>
                    </div>

                    {/* --- COLUMN 2 & 3: NEWS FEED (Right Side) --- */}
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white/90">Top Stories</h3>
                            <button onClick={handleRefresh} className="p-1.5 hover:bg-white/10 rounded-full text-white/60 transition-colors">
                                <RefreshCw size={14} />
                            </button>
                        </div>
                        
                        {/* News Grid */}
                        <div className="grid grid-cols-2 gap-4">
                             {/* First item large (Featured) */}
                             <div className="col-span-2">
                                <NewsCard 
                                    title={simulatedNewsData[0].title} 
                                    source={simulatedNewsData[0].source} 
                                    category="Top Story" 
                                />
                             </div>

                             {/* Rest of items */}
                             {simulatedNewsData.slice(1).map((news) => (
                                <NewsCard key={news.id} title={news.title} source={news.source} category={news.category || 'News'} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

export default WidgetsBoard;