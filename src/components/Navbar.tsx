import React, { useState } from 'react';
import { NavTab } from '../types';
import { Sun, Moon, Keyboard, Menu, X, Sparkles, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTheme, mode, toggleMode, openThemeModal } = useTheme();

  const navItems: { id: NavTab; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'english', label: 'English Typing' },
    { id: 'hindi', label: 'Hindi Lesson' },
    { id: 'test', label: 'Typing Test' },
    { id: 'about', label: 'About' },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 rounded-lg group whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="TypingSpedo Home"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.gradientFrom} 0%, ${currentTheme.gradientTo} 100%)`,
              }}
            >
              <Keyboard className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Typing<span style={{ color: currentTheme.primaryColor }}>Spedo</span>
            </span>
          </button>

          {/* Zone 2: Navigation Links (single-line, clean hover states) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  style={{
                    backgroundColor: isActive ? `${currentTheme.primaryColor}14` : undefined,
                    color: isActive ? currentTheme.primaryColor : undefined,
                  }}
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-hindi">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Switcher + Light/Dark + Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1-Click Theme Customizer Trigger */}
            <button
              onClick={openThemeModal}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center gap-2 text-xs font-semibold shadow-2xs cursor-pointer group"
              title={`Active Theme: ${currentTheme.name} (Click to change)`}
              aria-label="Open Theme Picker"
            >
              <Palette className="w-4 h-4 text-theme-primary group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">{currentTheme.badgeText}</span>
              <span
                className="w-3 h-3 rounded-full border border-black/10 dark:border-white/20 shrink-0"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {mode === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-700" />
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleTabClick('test')}
              style={{ backgroundColor: currentTheme.primaryColor }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all hover:shadow active:scale-[0.98] whitespace-nowrap cursor-pointer hover:opacity-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
              <span>Speed Test</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1324] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  backgroundColor: isActive ? `${currentTheme.primaryColor}14` : undefined,
                  color: isActive ? currentTheme.primaryColor : undefined,
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-hindi">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                openThemeModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800"
            >
              <Palette className="w-4 h-4 text-theme-primary" />
              <span>Theme: {currentTheme.badgeText}</span>
            </button>
            <button
              onClick={toggleMode}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800"
            >
              {mode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleTabClick('test')}
              style={{ backgroundColor: currentTheme.primaryColor }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              Take Free Speed Test
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

