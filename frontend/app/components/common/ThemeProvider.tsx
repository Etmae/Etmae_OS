import { useEffect } from 'react';
import { useThemeStore } from '../../state/useThemeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// System-wide theme transition duration (in milliseconds).
// Used by ThemeProvider to temporarily disable visual transitions during a theme swap.
// This avoids a perceived delay in the UI as many highlight/text/background transitions would otherwise animate concurrently.
const THEME_TRANSITION_LOCK_MS = 450;

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply data-theme to the document root, which is the single source of truth for CSS theme variables.
    root.setAttribute('data-theme', theme);

    // Prevent a cross-fading transition effect across many components by temporarily disabling transitions.
    root.classList.add('theme-transition-disabled');

    const timeoutId = window.setTimeout(() => {
      root.classList.remove('theme-transition-disabled');
    }, THEME_TRANSITION_LOCK_MS);

    return () => {
      window.clearTimeout(timeoutId);
      root.classList.remove('theme-transition-disabled');
    };
  }, [theme]);

  return <>{children}</>;
};
