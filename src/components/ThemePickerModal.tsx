import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEMES_LIST, ThemeConfig } from '../types/theme';
import { X, Check, Sun, Moon, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThemePickerModal: React.FC = () => {
  const {
    themeId,
    setThemeId,
    mode,
    setMode,
    currentTheme,
    isThemeModalOpen,
    closeThemeModal,
  } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeThemeModal();
    };
    if (isThemeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isThemeModalOpen, closeThemeModal]);

  if (!isThemeModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeThemeModal}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-modal-title"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-theme-primary">
                <Palette className="w-4 h-4" />
                <span>Typing Studio Customizer · थीम चयन</span>
              </div>
              <h2
                id="theme-modal-title"
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
              >
                Choose Your Study Theme
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Click any color palette to personalize your keyboard, buttons, and typing interface.
              </p>
            </div>

            <button
              onClick={closeThemeModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close theme modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Mode Toggle (Light / Dark) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Display Mode (लाइट / डार्क मोड)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Switch between high-contrast day mode or midnight night mode.
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMode('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'light'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'dark'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Themes Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Available Color Palettes ({THEMES_LIST.length} Themes)
              </span>
              <span className="text-[11px] text-slate-400">
                1-Click Instant Activation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {THEMES_LIST.map((theme: ThemeConfig) => {
                const isSelected = themeId === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`relative p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer group ${
                      isSelected
                        ? 'border-2 shadow-md bg-white dark:bg-slate-800/90'
                        : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/60'
                    }`}
                    style={{
                      borderColor: isSelected ? theme.primaryColor : undefined,
                    }}
                  >
                    {/* Top Row: Name, Hindi Name, and Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-theme-primary transition-colors">
                            {theme.name}
                          </span>
                          <span className="text-xs text-slate-400 font-hindi">
                            ({theme.hindiName})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {theme.tagline}
                        </p>
                      </div>

                      {/* Selection Checkmark */}
                      {isSelected ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                      )}
                    </div>

                    {/* Bottom Row: Swatches & Mini Sample Button */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Color Dot Swatches */}
                      <div className="flex items-center gap-1.5">
                        {theme.previewSwatches.map((color, idx) => (
                          <span
                            key={idx}
                            className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shadow-xs"
                            style={{ backgroundColor: color }}
                            title={`Color swatch ${idx + 1}`}
                          />
                        ))}
                        <span className="text-[10px] font-medium text-slate-400 ml-1">
                          {theme.badgeText}
                        </span>
                      </div>

                      {/* Mini Live Preview Badge */}
                      <span
                        className="text-[11px] px-2.5 py-0.5 rounded-lg font-medium text-white shadow-xs"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {isSelected ? 'Active' : 'Preview'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Interface Preview Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
                <span>Live Theme Preview: {currentTheme.name}</span>
              </span>
              <span className="text-[11px]">Instant Apply</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                Sample Action Button
              </button>

              <div
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
                style={{
                  backgroundColor: currentTheme.previewSwatches[2],
                  borderColor: currentTheme.primaryColor,
                  color: currentTheme.primaryColor,
                }}
              >
                Active Keyboard Key
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                WPM: <strong style={{ color: currentTheme.primaryColor }}>48 WPM</strong> · Accuracy: <strong className="text-emerald-500">98%</strong>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeThemeModal}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: currentTheme.primaryColor }}
            >
              Continue Typing with {currentTheme.name}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
