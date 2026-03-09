import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Default to dark theme
      setTheme: (theme) => set({ theme }),
  toggleTheme: () => {
    const currentTheme = get().theme;
    set({ theme: currentTheme === 'dark' ? 'light' : 'dark' });
  },
    }),
    {
      name: 'theme-storage', // Key for localStorage
    }
  )
);
