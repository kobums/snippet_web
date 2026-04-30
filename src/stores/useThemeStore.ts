import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveDark: () => boolean;
}

function applyTheme(theme: Theme) {
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem('snippet-theme', theme);
  } catch {}
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'system',

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  effectiveDark: () => {
    const { theme } = get();
    if (typeof window === 'undefined') return false;
    return (
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  },
}));
