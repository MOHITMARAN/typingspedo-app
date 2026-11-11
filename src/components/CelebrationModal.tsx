import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, ArrowRight, RotateCcw, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { playStarsCelebration, playSingleStarChime } from '../utils/sound';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  wpm: number;
  accuracy: number;
  errors: number;
  stars: number;
  soundEnabled?: boolean;
  hasNextLesson?: boolean;
  nextButtonLabel?: string;
  onNextLesson?: () => void;
  onRetry?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  wpm,
  accuracy,
  errors,
  stars,
  soundEnabled = true,
  hasNextLesson = false,
  nextButtonLabel,
  onNextLesson,
  onRetry,
}) => {
  const { currentTheme } = useTheme();

  // Play musical ascending star chime sequence synchronized with star pop-in animation
  useEffect(() => {
    if (isOpen && stars > 0) {
      const cancelCelebration = playStarsCelebration(stars, soundEnabled);
      return cancelCelebration;
    }
  }, [isOpen, stars, soundEnabled]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Particle positions for celebratory confetti
  const confettiParticles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: (i * 17) % 100,
    y: (i * 23) % 40,
    size: 6 + (i % 5) * 2,
    color: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4'][i % 6],
    delay: (i % 8) * 0.1,
    duration: 1.5 + (i % 4) * 0.3,
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Confetti Animation Layer */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confettiParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
              animate={{
                y: '100vh',
                x: `${p.x + (p.id % 2 === 0 ? 5 : -5)}vw`,
                opacity: [1, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute rounded-sm"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
            />
          ))}
        </div>

        {/* Card Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 z-50 text-center space-y-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close celebration dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Trophy Burst */}
          <div className="relative inline-block mx-auto pt-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
              className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/20"
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              }}
            >
              <Trophy className="w-10 h-10 text-amber-600" />
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>

          {/* Star Rating Animation */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <motion.button
                key={starIndex}
                type="button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.18 * starIndex, type: 'spring', stiffness: 350, damping: 15 }}
                onClick={() => {
                  if (starIndex <= stars) {
                    playSingleStarChime(starIndex, soundEnabled);
                  }
                }}
                disabled={starIndex > stars}
                className={`p-1 rounded-full transition-transform focus:outline-hidden ${
                  starIndex <= stars
                    ? 'cursor-pointer hover:scale-125 focus:scale-125'
                    : 'cursor-default opacity-40'
                }`}
                title={starIndex <= stars ? `Star ${starIndex} (Click to replay chime)` : `Star ${starIndex}`}
                aria-label={`Star ${starIndex}`}
              >
                <Star
                  className={`w-7 h-7 ${
                    starIndex <= stars
                      ? 'text-amber-400 fill-amber-400 filter drop-shadow(0 2px 4px rgba(245,158,11,0.3))'
                      : 'text-slate-200 dark:text-slate-700'
                  }`}
                />
              </motion.button>
            ))}
          </div>

          {/* Performance Summary Pill Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="p-2 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Net Speed</span>
              <div
                className="text-xl font-bold font-mono tabular-nums"
                style={{ color: currentTheme.primaryColor }}
              >
                {wpm} <span className="text-xs font-normal">WPM</span>
              </div>
            </div>

            <div className="p-2 space-y-0.5 border-x border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {accuracy}%
              </div>
            </div>

            <div className="p-2 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Errors</span>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-700 dark:text-slate-300">
                {errors}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            {onRetry && (
              <button
                onClick={() => {
                  onRetry();
                  onClose();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>
            )}

            {hasNextLesson && onNextLesson ? (
              <button
                onClick={() => {
                  onNextLesson();
                  onClose();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                <span>{nextButtonLabel || 'Next Lesson'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: currentTheme.primaryColor }}
              >
                <span>Continue</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
