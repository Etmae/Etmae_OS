export type PortfolioThemeMode = 'dark' | 'light';

type PortfolioThemeConfig = {
  bg: string;
  text: string;
  muted: string;
  border: string;
  borderHover: string;
  accent: string;
  inputBg: string;
  cardBg: string;
  selectedBg: string;
  selectedText: string;
};

const PORTFOLIO_THEME: Record<PortfolioThemeMode, PortfolioThemeConfig> = {
  dark: {
    bg: 'bg-[#050505]',
    text: 'text-zinc-100',
    muted: 'text-zinc-500',
    border: 'border-zinc-800',
    borderHover: 'hover:border-zinc-600',
    accent: 'text-green-500',
    inputBg: 'bg-transparent',
    cardBg: 'bg-zinc-900/30',
    selectedBg: 'bg-zinc-100',
    selectedText: 'text-black',
  },
  light: {
    bg: 'bg-zinc-50',
    text: 'text-zinc-900',
    muted: 'text-zinc-400',
    border: 'border-zinc-200',
    borderHover: 'hover:border-zinc-400',
    accent: 'text-green-500',
    inputBg: 'bg-transparent',
    cardBg: 'bg-white',
    selectedBg: 'bg-zinc-900',
    selectedText: 'text-white',
  },
};

export const getPortfolioTheme = (
  theme: PortfolioThemeMode = 'dark',
): PortfolioThemeConfig => PORTFOLIO_THEME[theme];

