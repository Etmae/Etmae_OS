/**
 * WidgetsBoard.tsx
 *
 * Windows 11-inspired slide-in widget panel.
 *
 * Data sources — all free, all require zero API keys:
 *  - Weather       : Open-Meteo            https://open-meteo.com
 *  - Market prices : CoinGecko /coins/markets — real 24h % change field included
 *                    https://docs.coingecko.com/reference/coins-markets
 *  - News          : Hacker News Firebase REST API
 *                    https://github.com/HackerNews/API
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Plus,
  RefreshCw,
  Search,
  UserCircle,
  ArrowUpRight,
  ArrowDownRight,
  ListChecks,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface WidgetsBoardProps {
  widgetsOpen: boolean;
  keepWidgetsOpen: () => void;
  scheduleWidgetsClose: () => void;
}

interface WeatherState {
  temp: string;
  condition: string;
  icon: string;
  high: string;
  low: string;
  location: string;
}

/** Relevant subset of the CoinGecko /coins/markets response. */
interface CoinGeckoMarket {
  id: string;
  symbol: string;
  current_price: number;
  /** Real 24-hour price change percentage from the exchange aggregate. */
  price_change_percentage_24h: number | null;
}

interface MarketItem {
  label: string;
  price: number;
  pct24h: number;
}

interface NewsArticle {
  id: number;
  title: string;
  url: string;
  author: string;
  publishedAt: Date | null;
  category: string;
}

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER UTILITIES  (Open-Meteo WMO weather codes)
// ─────────────────────────────────────────────────────────────────────────────

/** Maps WMO weather code → [human-readable condition, representative emoji]. */
const WMO_MAP: Record<number, [string, string]> = {
  0:  ['Clear Sky',        '☀️'],
  1:  ['Mainly Clear',     '🌤️'],
  2:  ['Partly Cloudy',    '⛅'],
  3:  ['Overcast',         '☁️'],
  45: ['Foggy',            '🌫️'],
  48: ['Icy Fog',          '🌫️'],
  51: ['Light Drizzle',    '🌦️'],
  53: ['Drizzle',          '🌧️'],
  55: ['Heavy Drizzle',    '🌧️'],
  61: ['Slight Rain',      '🌦️'],
  63: ['Rain',             '🌧️'],
  65: ['Heavy Rain',       '🌧️'],
  71: ['Slight Snow',      '❄️'],
  73: ['Snow',             '❄️'],
  75: ['Heavy Snow',       '❄️'],
  80: ['Showers',          '🌧️'],
  81: ['Showers',          '🌧️'],
  82: ['Violent Showers',  '⛈️'],
  95: ['Thunderstorm',     '⛈️'],
  96: ['Thunderstorm',     '⛈️'],
  99: ['Thunderstorm',     '⛈️'],
};

const resolveWeatherCode = (code: number): [string, string] =>
  WMO_MAP[code] ?? ['Unknown', '🌡️'];

// ─────────────────────────────────────────────────────────────────────────────
// NEWS UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** Priority-ordered keyword rules for inferring an article category from its title. */
const CATEGORY_RULES: [RegExp, string][] = [
  [/\b(ai|llm|gpt|openai|anthropic|claude|gemini|mistral)\b/i,    'AI'],
  [/\b(bitcoin|crypto|ethereum|solana|blockchain|nft|defi)\b/i,   'Crypto'],
  [/\b(stock|market|economy|inflation|fed|gdp|recession|nasdaq)\b/i, 'Finance'],
  [/\b(nasa|space|rocket|moon|mars|satellite|telescope)\b/i,      'Space'],
  [/\b(health|covid|vaccine|hospital|cancer|fda|drug)\b/i,        'Health'],
  [/\b(game|gaming|xbox|playstation|nintendo|steam|esports)\b/i,  'Gaming'],
  [/\b(election|senate|congress|president|parliament|politics)\b/i,'Politics'],
  [/\b(javascript|python|react|rust|typescript|linux|kernel)\b/i, 'Tech'],
  [/\b(climate|carbon|renewable|solar|wind|emissions)\b/i,        'Climate'],
];

/**
 * Infers a display category for a Hacker News story by matching its title
 * against a prioritised list of keyword patterns.
 */
function inferCategory(title: string): string {
  for (const [pattern, label] of CATEGORY_RULES) {
    if (pattern.test(title)) return label;
  }
  return 'General';
}

const CATEGORY_EMOJI: Record<string, string> = {
  AI: '🤖', Crypto: '🪙', Finance: '💰', Space: '🚀',
  Health: '🏥', Gaming: '🎮', Politics: '🗳️', Tech: '💻',
  Climate: '🌿', General: '📰',
};

const resolveEmoji = (category: string): string =>
  CATEGORY_EMOJI[category] ?? '📰';

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Glassmorphic card base — shared by all widget tiles.
 */
const WidgetCard: React.FC<React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
}>> = ({ children, className = '', style }) => (
  <div
    className={`rounded-xl text-white cursor-pointer transition-all duration-200 hover:bg-white/10 ${className}`}
    style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Single crypto market tile.
 * `pct24h` is the real 24-hour percentage change sourced from CoinGecko —
 * no simulation or random value is applied anywhere in this component.
 */
const MarketTile: React.FC<MarketItem> = ({ label, price, pct24h }) => {
  const isUp = pct24h >= 0;
  return (
    <WidgetCard className="p-3 flex flex-col justify-between" style={{ minHeight: 88 }}>
      <div
        className="text-[9px] font-semibold uppercase tracking-wider"
        style={{ color: 'rgba(255,255,255,.5)' }}
      >
        {label}
      </div>
      <div className="text-base font-semibold mt-1 leading-tight">
        ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </div>
      <div
        className="text-[10px] font-semibold flex items-center gap-0.5 mt-1.5"
        style={{ color: isUp ? '#4ade80' : '#f87171' }}
      >
        {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
        {isUp ? '+' : ''}{pct24h.toFixed(2)}%
      </div>
    </WidgetCard>
  );
};

/**
 * News article card. The first article is featured (horizontal layout);
 * subsequent articles use a vertical tile layout with a category thumbnail.
 */
const NewsCard: React.FC<{ article: NewsArticle; featured?: boolean }> = ({
  article,
  featured = false,
}) => {
  const emoji = resolveEmoji(article.category);
  const timeLabel = article.publishedAt
    ? article.publishedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
      className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex ${featured ? 'flex-row' : 'flex-col'}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
    >
      {/* Thumbnail — emoji icon as category visual */}
      <div
        className="relative flex items-end justify-end flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.1)',
          ...(featured
            ? { width: 120, minHeight: 100 }
            : { height: 85, width: '100%' }),
        }}
      >
        <span
          className="absolute top-1.5 left-1.5 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,.52)', color: 'rgba(255,255,255,.88)' }}
        >
          {featured ? 'Top Story' : article.category}
        </span>
        <span className="p-1.5 text-lg opacity-65">{emoji}</span>
      </div>

      {/* Article body */}
      <div className="p-2 flex flex-col justify-between flex-1">
        <p
          className="text-[11px] font-semibold leading-snug"
          style={{
            color: 'rgba(255,255,255,.88)',
            display: '-webkit-box',
            WebkitLineClamp: featured ? 4 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title}
        </p>
        <div className="flex items-center gap-1 mt-1.5" style={{ color: 'rgba(255,255,255,.4)' }}>
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(255,255,255,.18)' }}
          />
          <span className="text-[9px]">
            {article.author ? `@${article.author} · HN` : 'Hacker News'}
            {timeLabel ? ` · ${timeLabel}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

/** Pulsing skeleton placeholder shown while data is in-flight. */
const Skeleton: React.FC<{ height?: number | string; className?: string }> = ({
  height = 88,
  className = '',
}) => (
  <div
    className={`rounded-xl animate-pulse ${className}`}
    style={{ height, background: 'rgba(255,255,255,0.08)' }}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const WidgetsBoard: React.FC<WidgetsBoardProps> = ({
  widgetsOpen,
  keepWidgetsOpen,
  scheduleWidgetsClose,
}) => {
  const [clockStr, setClockStr]             = useState('');
  const [dateStr, setDateStr]               = useState('');
  const [weather, setWeather]               = useState<WeatherState | null>(null);
  const [markets, setMarkets]               = useState<MarketItem[]>([]);
  const [news, setNews]                     = useState<NewsArticle[]>([]);
  const [marketsLoading, setMarketsLoading] = useState(true);
  const [newsLoading, setNewsLoading]       = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [todos, setTodos]                   = useState<TodoItem[]>([
    { id: 1, text: 'Review Q2 project',   done: true  },
    { id: 2, text: 'Call Mom at 5 PM',    done: false },
    { id: 3, text: 'Renew subscriptions', done: false },
  ]);

  const marketTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clock widget: updates every 30 seconds to display current time and date.
  const updateClock = useCallback(() => {
    const now = new Date();
    setClockStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  useEffect(() => {
    updateClock();
    const id = setInterval(updateClock, 30_000);
    return () => clearInterval(id);
  }, [updateClock]);

  // Weather widget: fetches current conditions from Open-Meteo API (free service, no API key required).
  // Coordinates: Lagos, Nigeria (6.5244° N, 3.3792° E)
  // Data includes: current temperature, WMO weather code, daily high/low forecasts.
  // API documentation: https://open-meteo.com/en/docs
  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast' +
        '?latitude=6.5244&longitude=3.3792' +
        '&current=temperature_2m,weather_code' +
        '&daily=temperature_2m_max,temperature_2m_min' +
        '&timezone=Africa%2FLagos&forecast_days=1'
      );
      const data = await res.json();
      const code: number = data.current.weather_code;
      const [condition, icon] = resolveWeatherCode(code);

      setWeather({
        temp:     `${Math.round(data.current.temperature_2m)}°`,
        condition,
        icon,
        high:     `${Math.round(data.daily.temperature_2m_max[0])}°`,
        low:      `${Math.round(data.daily.temperature_2m_min[0])}°`,
        location: 'Lagos, NG',
      });
    } catch {
      /* Retain previous state; weather card degrades gracefully */
    }
  }, []);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);

  // Markets widget: fetches cryptocurrency price data from CoinGecko API (free service, no API key required).
  // Data includes: Bitcoin, Ethereum, Solana, and Litecoin prices with 24-hour change percentages.
  // Rate limit: 10-30 requests/minute on the free tier; refresh interval is set to 60 seconds.
  // Note: The 24-hour price change data is sourced from exchange aggregates, not simulated.
  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets' +
        '?vs_currency=usd' +
        '&ids=bitcoin,ethereum,solana,litecoin' +
        '&order=market_cap_desc' +
        '&price_change_percentage=24h'
      );
      const coins: CoinGeckoMarket[] = await res.json();

      setMarkets(coins.map(c => ({
        label:  `${c.symbol.toUpperCase()}/USD`,
        price:  c.current_price,
        pct24h: c.price_change_percentage_24h ?? 0,
      })));
    } catch {
      // Preserve previous market data on network failure to maintain UI stability.
    } finally {
      setMarketsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
    marketTimerRef.current = setInterval(fetchMarkets, 60_000);
    return () => {
      if (marketTimerRef.current) clearInterval(marketTimerRef.current);
    };
  }, [fetchMarkets]);

  // News widget: fetches top stories from Hacker News API (free service, no API key required).
  // Retrieves top 6 stories with their metadata and infers category based on title keywords.
  // API documentation: https://github.com/HackerNews/API
  const fetchNews = useCallback(async () => {
    // Step 1: Retrieve ordered list of top story IDs
    // Step 2: Fetch details for top 6 stories in parallel
    setNewsLoading(true);
    try {
      const ids: number[] = await fetch(
        'https://hacker-news.firebaseio.com/v0/topstories.json'
      ).then(r => r.json());

      const raw = await Promise.all(
        ids.slice(0, 6).map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        )
      );

      const articles: NewsArticle[] = raw
        .filter(s => s && s.title)
        .map(s => ({
          id:          s.id,
          title:       s.title as string,
          url:         s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
          author:      s.by ?? '',
          publishedAt: s.time ? new Date((s.time as number) * 1000) : null,
          category:    inferCategory(s.title as string),
        }));

      setNews(articles);
    } catch {
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  // Refresh handler: simultaneously refreshes market data and news feed.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchMarkets(), fetchNews()]);
    setRefreshing(false);
  }, [fetchMarkets, fetchNews]);

  // Todo list toggle: marks individual tasks as complete or incomplete.
  const toggleTodo = (id: number) =>
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes wb-spin { to { transform: rotate(360deg); } }
        .wb-spin { animation: wb-spin 0.65s linear infinite; }
        .wb-no-scroll::-webkit-scrollbar { display: none; }
        .wb-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AnimatePresence>
        {widgetsOpen && (
          <motion.div
            className="fixed top-0 left-0 h-screen z-50"
            style={{ width: 850, maxWidth: '95vw' }}
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: 'circOut', duration: 0.25 }}
            onMouseEnter={keepWidgetsOpen}
            onMouseLeave={scheduleWidgetsClose}
          >
            {/* Mica-style frosted backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(28,28,28,0.96)',
                backdropFilter: 'blur(60px) saturate(150%)',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '10px 0 40px rgba(0,0,0,0.55)',
              }}
            />

            {/* Scrollable content */}
            <div
              className="relative h-full w-full overflow-y-auto overflow-x-hidden wb-no-scroll"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              {/* ── Sticky header ── */}
              <div
                className="sticky top-0 z-20 px-6 py-5 flex flex-col gap-3"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(28,28,28,.97) 0%, rgba(28,28,28,.8) 80%, transparent 100%)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium text-lg leading-none">{clockStr}</div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.42)' }}>
                      {dateStr}
                    </div>
                  </div>
                  <UserCircle size={24} style={{ color: 'rgba(255,255,255,.52)' }} />
                </div>

                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,.42)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search the web"
                    style={{
                      width: '100%',
                      background: '#2a2a2a',
                      border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: 18,
                      color: '#fff',
                      fontSize: 12,
                      padding: '8px 14px 8px 32px',
                      outline: 'none',
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                      transition: 'border-color .2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(90,150,255,.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.1)')}
                  />
                </div>
              </div>

              {/* ── Main dashboard grid ── */}
              <div
                className="px-6 pb-10"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,190px) minmax(0,1fr)',
                  gap: 12,
                }}
              >
                {/* Left column */}
                <div className="flex flex-col gap-2.5">

                  {/* Weather widget */}
                  <WidgetCard
                    className="p-3 flex flex-col justify-between"
                    style={{
                      minHeight: 185,
                      background: 'linear-gradient(155deg, rgba(25,70,150,.38) 0%, rgba(8,25,70,.42) 100%)',
                      borderColor: 'rgba(90,140,255,.16)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.78)' }}
                      >
                        My Location
                      </span>
                      <Settings size={11} style={{ color: 'rgba(255,255,255,.35)' }} />
                    </div>

                    {weather ? (
                      <div className="flex flex-col items-center gap-0.5 py-1">
                        <span style={{ fontSize: 34, lineHeight: 1 }}>{weather.icon}</span>
                        <div className="text-4xl font-light tracking-tighter mt-1">{weather.temp}</div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,.72)' }}>
                          {weather.condition}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-3">
                        <Skeleton height={34} className="w-10" />
                        <Skeleton height={14} className="w-20 mt-1" />
                      </div>
                    )}

                    <div
                      className="flex justify-between text-[10px] pt-2"
                      style={{ borderTop: '1px solid rgba(255,255,255,.08)', color: 'rgba(255,255,255,.45)' }}
                    >
                      <span style={{ color: 'rgba(255,255,255,.72)' }}>
                        {weather?.location ?? 'Lagos, NG'}
                      </span>
                      {weather && <span>H:{weather.high}  L:{weather.low}</span>}
                    </div>
                  </WidgetCard>

                  {/* Market tiles — 2×2 grid, real CoinGecko prices + 24h change */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                    {marketsLoading
                      ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={88} />)
                      : markets.map(m => <MarketTile key={m.label} {...m} />)
                    }
                  </div>

                  {/* Todo widget */}
                  <WidgetCard className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <ListChecks size={13} style={{ color: '#60a5fa' }} />
                        To Do
                      </div>
                      <Plus size={13} style={{ color: 'rgba(255,255,255,.42)', cursor: 'pointer' }} />
                    </div>

                    {todos.map(todo => (
                      <div
                        key={todo.id}
                        onClick={() => toggleTodo(todo.id)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded mb-1.5 cursor-pointer"
                        style={{ background: 'rgba(255,255,255,.04)' }}
                      >
                        <div
                          className="flex items-center justify-center flex-shrink-0"
                          style={{
                            width: 13, height: 13, borderRadius: 3,
                            border: todo.done ? 'none' : '1px solid rgba(255,255,255,.28)',
                            background: todo.done ? 'rgba(90,150,255,.55)' : 'transparent',
                          }}
                        >
                          {todo.done && (
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span
                          className="text-[10px]"
                          style={{
                            color: todo.done ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.82)',
                            textDecoration: todo.done ? 'line-through' : 'none',
                          }}
                        >
                          {todo.text}
                        </span>
                      </div>
                    ))}
                  </WidgetCard>

                  <button
                    className="w-full py-2 rounded-lg text-[11px] font-medium transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,.04)',
                      border: '1px solid rgba(255,255,255,.09)',
                      color: 'rgba(255,255,255,.55)',
                      cursor: 'pointer',
                      fontFamily: "'Segoe UI', system-ui, sans-serif",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.09)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.04)')}
                  >
                    + Add widget
                  </button>
                </div>

                {/* Right column — live news feed */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="font-semibold text-white" style={{ fontSize: 14 }}>
                      Top Stories
                    </h3>
                    <button
                      onClick={handleRefresh}
                      className="flex items-center justify-center rounded-full transition-all duration-200"
                      style={{
                        width: 27, height: 27, background: 'transparent',
                        border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.52)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <RefreshCw size={13} className={refreshing ? 'wb-spin' : ''} />
                    </button>
                  </div>

                  {newsLoading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <Skeleton height={100} />
                      </div>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} height={130} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {news[0] && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <NewsCard article={news[0]} featured />
                        </div>
                      )}
                      {news.slice(1).map(article => (
                        <NewsCard key={article.id} article={article} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WidgetsBoard;