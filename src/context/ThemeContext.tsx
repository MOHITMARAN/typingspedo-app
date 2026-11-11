import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, ThemeConfig, THEMES_LIST } from '../types/theme';

interface ThemeContextType {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
  currentTheme: ThemeConfig;
  isThemeModalOpen: boolean;
  openThemeModal: () => void;
  closeThemeModal: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_THEME_KEY = 'typeshala_color_theme';
const MODE_THEME_KEY = 'typeshala_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(COLOR_THEME_KEY) as ThemeId;
      if (saved && THEMES_LIST.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'default';
  });

  const [mode, setModeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(MODE_THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'light';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Apply theme data attribute on root
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem(COLOR_THEME_KEY, themeId);
    } catch {
      // ignore
    }
  }, [themeId]);

  // Apply dark mode class on root
  useEffect(() => {
    try {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(MODE_THEME_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const setThemeId = (newId: ThemeId) => {
    setThemeIdState(newId);
  };

  const setMode = (newMode: 'light' | 'dark') => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentTheme = THEMES_LIST.find((t) => t.id === themeId) || THEMES_LIST[0];

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        setThemeId,
        mode,
        setMode,
        toggleMode,
        currentTheme,
        isThemeModalOpen,
        openThemeModal: () => setIsThemeModalOpen(true),
        closeThemeModal: () => setIsThemeModalOpen(false),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
