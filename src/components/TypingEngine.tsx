import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, HindiLayout, TypingStats } from '../types';
import { KeyboardVisualizer } from './KeyboardVisualizer';
import { findKeyForExpectedText, getCharForPhysicalKey } from '../data/keyboardLayouts';
import { getTypingCursorContext, evaluateAddedInput } from '../utils/typingEvaluation';
import { playKeyClick, playErrorBuzz, playSingleStarChime, getSavedSoundPreference, saveSoundPreference } from '../utils/sound';
import { Volume2, VolumeX, RotateCcw, ArrowRight, CheckCircle2, Zap, Target, Star, AlertCircle, BookOpen, Sparkles, Hand } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CelebrationModal } from './CelebrationModal';
import { VirtualHands } from './VirtualHands';
import { getSavedVirtualHandsPreference, saveVirtualHandsPreference } from '../utils/hands';

interface TypingEngineProps {
  targetText: string;
  language: Language;
  hindiLayout?: HindiLayout;
  onComplete?: (stats: TypingStats) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
  nextButtonLabel?: string;
  timeLimit?: number; // in seconds (for timed tests)
  title?: string;
  subtitle?: string;
  hideKeyboardHints?: boolean;
  minAccuracyToPass?: number;
  customHighlightKeys?: string[];
  isTestMode?: boolean;
  showHandsByDefault?: boolean;
  wordMode?: boolean;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  targetText,
  language,
  hindiLayout = 'inscript',
  onComplete,
  onNextLesson,
  hasNextLesson = false,
  nextButtonLabel = 'Next Lesson',
  timeLimit,
  title,
  subtitle,
  hideKeyboardHints = false,
  minAccuracyToPass,
  customHighlightKeys,
  isTestMode = false,
  showHandsByDefault,
  wordMode = false,
}) => {
  const { currentTheme } = useTheme();
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getSavedSoundPreference());
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showVirtualHands, setShowVirtualHands] = useState<boolean>(() => {
    if (showHandsByDefault !== undefined) return showHandsByDefault;
    if (isTestMode) return false;
    return getSavedVirtualHandsPreference();
  });
  const [hardwareKeyEmulation, setHardwareKeyEmulation] = useState(true);

  const toggleVirtualHands = () => {
    const next = !showVirtualHands;
    setShowVirtualHands(next);
    saveVirtualHandsPreference(next);
  };

  const [composingText, setComposingText] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typedTextRef = useRef('');
  const errorsRef = useRef(0);
  const handledInKeyDownRef = useRef(false);
  const isComposingRef = useRef(false);
  const preCompositionTypedRef = useRef('');

  // Normalize target text
  const cleanTarget = targetText.trim();

  // Pre-calculate character tokens grouped by word for safe line-wrapping
  const words = React.useMemo(() => {
    interface CharToken {
      char: string;
      globalIndex: number;
    }
    const result: { chars: CharToken[] }[] = [];
    let currentWordChars: CharToken[] = [];

    for (let i = 0; i < cleanTarget.length; i++) {
      const c = cleanTarget[i];
      currentWordChars.push({ char: c, globalIndex: i });

      if (c === ' ' || i === cleanTarget.length - 1) {
        result.push({ chars: currentWordChars });
        currentWordChars = [];
      }
    }

    return result;
  }, [cleanTarget]);

  // Natural Hindi Devanagari Word Tokens for Word Practice or Typing Test mode
  // Renders complete words with matras together (e.g. "कार", "राम", "सीता") instead of detached characters
  const isHindiWordMode = language === 'hindi' && (isTestMode || wordMode);
  // Align all Hindi practice (including Unit 1 character drills) by space-separated tokens
  // so an accidental Space or length mismatch in one token never cascades error sounds.
  const useWordAlignment = language === 'hindi';

  const cursorContext = React.useMemo(
    () => getTypingCursorContext(cleanTarget, typedText, useWordAlignment),
    [cleanTarget, typedText, useWordAlignment]
  );

  const testWords = cursorContext.words;

  const typedWords = React.useMemo(() => {
    if (!useWordAlignment) return [];
    return typedText.split(' ');
  }, [typedText, useWordAlignment]);

  const activeWordIndex = useWordAlignment ? cursorContext.activeWordIndex : -1;
  const currentIndex = typedText.length;
  const nextChar = cursorContext.nextExpectedChar;

  // Calculate keyboard shift requirement (supporting multi-char Remington Gail tokens)
  const keyInfo = cursorContext.expectedRemaining
    ? findKeyForExpectedText(
        cursorContext.expectedRemaining,
        language === 'english'
          ? 'english'
          : hindiLayout === 'remington'
          ? 'remington'
          : 'inscript'
      )
    : null;

  // Real-time metrics
  const minutes = Math.max(timeElapsed / 60, 0.016);
  const totalKeystrokes = typedText.length;
  const grossWpm = Math.round((totalKeystrokes / 5) / minutes) || 0;
  const netWpm = Math.max(0, Math.round(((totalKeystrokes - errors) / 5) / minutes)) || 0;
  const accuracy = totalKeystrokes > 0 ? Math.max(0, Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)) : 100;
  const progressPercent = Math.min(100, Math.round((typedText.length / cleanTarget.length) * 100));

  // Toggle sound and save preference
  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    saveSoundPreference(nextVal);
  };

  // Reset engine
  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    typedTextRef.current = '';
    errorsRef.current = 0;
    handledInKeyDownRef.current = false;
    isComposingRef.current = false;
    preCompositionTypedRef.current = '';
    setComposingText(null);
    setTypedText('');
    setStartTime(null);
    setTimeElapsed(0);
    setErrors(0);
    setIsCompleted(false);
    setShowCelebration(false);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus({ preventScroll: true });
    }
  }, []);

  // When target changes, reset
  useEffect(() => {
    handleReset();
  }, [cleanTarget, handleReset]);

  // Smooth internal auto-scroll strictly contained within the text box
  // CRITICAL: NEVER call activeEl.scrollIntoView() which scrolls the window and pushes the keyboard down
  useEffect(() => {
    if (activeCharRef.current && scrollContainerRef.current) {
      const activeEl = activeCharRef.current;
      const container = scrollContainerRef.current;
      const activeRect = activeEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // If active character is approaching or beyond the visible bottom of the scroll container
      if (activeRect.bottom > containerRect.bottom - 24) {
        const delta = activeRect.bottom - containerRect.bottom + 36;
        container.scrollTo({
          top: container.scrollTop + delta,
          behavior: 'smooth',
        });
      } else if (activeRect.top < containerRect.top + 16) {
        const delta = containerRect.top - activeRect.top + 24;
        container.scrollTo({
          top: Math.max(0, container.scrollTop - delta),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Timer loop
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeElapsed(elapsed);

        if (timeLimit && elapsed >= timeLimit) {
          setIsCompleted(true);
          if (timerRef.current) clearInterval(timerRef.current);
          setShowCelebration(true);
          if (onComplete) {
            onComplete({
              wpm: grossWpm,
              netWpm,
              accuracy,
              errors,
              totalKeystrokes,
              timeElapsed: elapsed,
              completed: true,
            });
          }
        }
      }, 250);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted, timeLimit, grossWpm, netWpm, accuracy, errors, totalKeystrokes, minAccuracyToPass, onComplete]);

  // Focus input automatically without triggering viewport scroll
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  // Complete helper so final metrics are computed cleanly
  const finalizeCompletion = useCallback(
    (finalText: string, finalErrors: number) => {
      if (isCompleted) return;
      setIsCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
      setShowCelebration(true);
      if (onComplete) {
        const finalElapsed = startTime ? Math.max(1, Math.floor((Date.now() - startTime) / 1000)) : Math.max(1, timeElapsed);
        const mins = Math.max(finalElapsed / 60, 0.016);
        const keystrokes = finalText.length;
        const finalGrossWpm = Math.round((keystrokes / 5) / mins) || 0;
        const finalNetWpm = Math.max(0, Math.round(((keystrokes - finalErrors) / 5) / mins)) || 0;
        const finalAccuracy =
          keystrokes > 0 ? Math.max(0, Math.round(((keystrokes - finalErrors) / keystrokes) * 100)) : 100;

        onComplete({
          wpm: finalGrossWpm,
          netWpm: finalNetWpm,
          accuracy: finalAccuracy,
          errors: finalErrors,
          totalKeystrokes: keystrokes,
          timeElapsed: finalElapsed,
          completed: true,
        });
      }
    },
    [isCompleted, onComplete, startTime, timeElapsed]
  );

  // Completion check
  useEffect(() => {
    if (cursorContext.isTargetCompleted && cleanTarget.length > 0 && !isCompleted) {
      finalizeCompletion(typedTextRef.current, errorsRef.current);
    }
  }, [cursorContext.isTargetCompleted, cleanTarget.length, isCompleted, finalizeCompletion]);

  // Process newly added text against the aligned target position
  const commitAddedText = useCallback(
    (baseTypedText: string, addedText: string) => {
      if (isCompleted || !addedText) return;

      if (!startTime) {
        setStartTime(Date.now());
      }

      const result = evaluateAddedInput({
        cleanTarget,
        typedText: baseTypedText,
        addedText,
        isWordMode: useWordAlignment,
      });

      if (result.isCorrect) {
        playKeyClick(soundEnabled, result.isSpace);
      } else {
        playErrorBuzz(soundEnabled);
        if (result.errorIncrement > 0) {
          errorsRef.current += result.errorIncrement;
          setErrors(errorsRef.current);
        }
      }

      typedTextRef.current = result.nextTypedText;
      setTypedText(result.nextTypedText);
      if (inputRef.current) {
        inputRef.current.value = result.nextTypedText;
      }

      if (result.completedAfterInput) {
        finalizeCompletion(result.nextTypedText, errorsRef.current);
      }
    },
    [cleanTarget, finalizeCompletion, isCompleted, soundEnabled, startTime, useWordAlignment]
  );

  // Apply an added character directly (Physical InScript/Remington or Virtual Keyboard click)
  const applyNextCharacter = useCallback(
    (addedChar: string) => {
      commitAddedText(typedTextRef.current, addedChar);
    },
    [commitAddedText]
  );

  // Handle OS IME composition lifecycle cleanly without false error buzzes on intermediate keys
  const handleCompositionStart = () => {
    isComposingRef.current = true;
    preCompositionTypedRef.current = typedTextRef.current;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    setComposingText(null);
    if (isCompleted) return;

    const val = e.currentTarget.value;
    const base = preCompositionTypedRef.current;
    if (val === base) return;

    let commonLen = 0;
    const minLen = Math.min(base.length, val.length);
    while (commonLen < minLen && base[commonLen] === val[commonLen]) {
      commonLen++;
    }

    const alignedBase = base.slice(0, commonLen);
    const added = val.slice(commonLen);
    if (added.length > 0) {
      commitAddedText(alignedBase, added);
    } else {
      typedTextRef.current = alignedBase;
      setTypedText(alignedBase);
    }
  };

  // Handle standard Input typing (English, Phonetic, OS Direct, and mobile soft keyboards)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    if (handledInKeyDownRef.current) {
      handledInKeyDownRef.current = false;
      return;
    }

    const val = e.target.value;

    if (isComposingRef.current) {
      setComposingText(val);
      return;
    }

    const prev = typedTextRef.current;
    if (val === prev) return;

    if (val.length < prev.length && prev.startsWith(val)) {
      // Backspace
      playKeyClick(soundEnabled, false);
      typedTextRef.current = val;
      setTypedText(val);
      return;
    }

    if (val.startsWith(prev)) {
      const added = val.slice(prev.length);
      commitAddedText(prev, added);
      return;
    }

    // Replacement / edit diff (e.g. mobile autocorrect or IME update)
    let commonLen = 0;
    const minLen = Math.min(prev.length, val.length);
    while (commonLen < minLen && prev[commonLen] === val[commonLen]) {
      commonLen++;
    }
    const alignedBase = prev.slice(0, commonLen);
    const added = val.slice(commonLen);
    if (added.length > 0) {
      commitAddedText(alignedBase, added);
    } else {
      playKeyClick(soundEnabled, false);
      typedTextRef.current = alignedBase;
      setTypedText(alignedBase);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setActiveCode(e.code);
    handledInKeyDownRef.current = false;

    if (isCompleted) return;

    // Direct hardware emulation for Hindi InScript / Remington
    if (
      hardwareKeyEmulation &&
      language === 'hindi' &&
      (hindiLayout === 'inscript' || hindiLayout === 'remington') &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      if (e.key === 'Backspace') {
        e.preventDefault();
        handledInKeyDownRef.current = true;
        playKeyClick(soundEnabled, false);
        if (typedTextRef.current.length > 0) {
          const nextVal = typedTextRef.current.slice(0, -1);
          typedTextRef.current = nextVal;
          setTypedText(nextVal);
          if (inputRef.current) {
            inputRef.current.value = nextVal;
          }
        }
        return;
      }

      if (e.key === 'Tab' || e.key === 'Escape') {
        return;
      }

      const mappedChar = getCharForPhysicalKey(e.code, e.shiftKey, hindiLayout);
      if (mappedChar) {
        e.preventDefault();
        handledInKeyDownRef.current = true;
        applyNextCharacter(mappedChar);
      }
    }
  };

  const handleKeyUp = () => {
    setActiveCode(null);
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header bar: Title, Live Stats & Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center ${title || subtitle ? 'justify-between' : 'justify-end'} gap-3 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800`}>
        {(title || subtitle) && (
          <div>
            {title && <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        )}

        {/* Live Metrics Pill Strip */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 shadow-2xs">
            <Zap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Speed: </span>
              <strong className="text-sky-700 dark:text-sky-300 font-mono-nums text-sm font-bold">
                {netWpm}
              </strong>{' '}
              <span className="text-[10px] text-slate-400">WPM</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 shadow-2xs">
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Accuracy: </span>
              <strong className="text-emerald-700 dark:text-emerald-300 font-mono-nums text-sm font-bold">
                {accuracy}%
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Time: </span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono-nums text-sm font-bold">
                {timeLimit ? Math.max(0, timeLimit - timeElapsed) : timeElapsed}s
              </strong>
            </div>
          </div>

          {/* Controls: Mechanical Sound Toggle & Reset */}
          <div className="flex items-center gap-1 pl-1">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                soundEnabled
                  ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
              title={soundEnabled ? 'Mechanical Key Clicks: ON (Click to Mute)' : 'Mechanical Key Clicks: MUTED (Click to Enable)'}
              aria-label="Toggle mechanical keyboard sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer"
              title="Restart Exercise"
              aria-label="Restart exercise"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{ width: `${progressPercent}%`, backgroundColor: currentTheme.primaryColor }}
        />
      </div>

      {/* ============================================================== */}
      {/* TYPING.COM STYLE UNIFIED SINGLE TYPING BOX                    */}
      {/* Displays complete practice text in ONE large box.              */}
      {/* Student types directly into this same area.                    */}
      {/* Shows typing progress directly underneath each char.           */}
      {/* Highlight stays strictly in-place on current char in text.      */}
      {/* ============================================================== */}
      <div
        onClick={focusInput}
        className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all cursor-text space-y-2.5"
      >
        {/* Hidden Input for capturing physical keyboard events */}
        <input
          ref={inputRef}
          type="text"
          value={composingText ?? typedText}
          onChange={handleInputChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="opacity-0 absolute inset-0 w-full h-full cursor-text pointer-events-auto"
          aria-label="Typing practice input"
        />

        {/* Top Header Strip inside the Box */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <span className="flex items-center gap-2 uppercase tracking-wider text-[11px] font-bold text-sky-700 dark:text-sky-300">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span>Practice Text</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">(Type directly into this box)</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-nums font-medium">
            {isHindiWordMode && testWords.length > 0
              ? `${Math.min(activeWordIndex + 1, testWords.length)} / ${testWords.length} words · ${typedText.length} / ${cleanTarget.length} chars`
              : `${typedText.length} / ${cleanTarget.length} characters`}
          </span>
        </div>

        {/* Single Scrollable Text Stream */}
        <div
          ref={scrollContainerRef}
          className="max-h-[135px] sm:max-h-[160px] overflow-y-auto scroll-smooth pr-1.5 py-1"
        >
          {isHindiWordMode ? (
            /* Hindi Natural Devanagari Word Stream (Full words with attached matras e.g. "कार", "राम", "सीता") */
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-2.5 sm:gap-y-3 py-1 font-hindi text-xl sm:text-2xl leading-relaxed select-none">
              {testWords.map((token, wIdx) => {
                const isPast = wIdx < activeWordIndex;
                const isCurrent = wIdx === activeWordIndex;
                const typedWord = typedWords[wIdx] || '';
                const isCorrect = isPast && typedWord === token.text;

                if (isPast) {
                  return (
                    <span
                      key={token.index}
                      className={`inline-block px-1.5 py-0.5 rounded-lg transition-colors ${
                        isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-rose-600 dark:text-rose-400 font-semibold line-through decoration-rose-500 bg-rose-50/70 dark:bg-rose-950/40'
                      }`}
                    >
                      {token.text}
                    </span>
                  );
                }

                if (isCurrent) {
                  const matchesSoFar = token.text.startsWith(typedWord);

                  return (
                    <span
                      ref={activeCharRef}
                      key={token.index}
                      className="inline-flex flex-col items-center bg-sky-50 dark:bg-sky-950/70 border-2 border-sky-500 dark:border-sky-400 rounded-xl px-2.5 py-1 shadow-sm ring-2 ring-sky-200 dark:ring-sky-800 transition-all scale-[1.02]"
                    >
                      {/* Complete Hindi Word with naturally combined matras (e.g. कार) */}
                      <span className="font-hindi text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-normal leading-tight">
                        {token.text}
                      </span>

                      {/* Real-time typed letters underneath */}
                      <span
                        className={`font-hindi text-xs sm:text-sm font-semibold leading-tight min-h-[1.25rem] flex items-center justify-center gap-0.5 mt-0.5 ${
                          matchesSoFar
                            ? 'text-sky-600 dark:text-sky-400'
                            : 'text-rose-600 dark:text-rose-400 underline decoration-rose-500'
                        }`}
                      >
                        {typedWord.length > 0 ? (
                          typedWord
                        ) : (
                          <span className="text-[11px] font-sans font-normal text-slate-400 dark:text-slate-500">
                            टाइप करें...
                          </span>
                        )}
                        {!isCompleted && (
                          <span className="inline-block w-1.5 h-3.5 bg-sky-500 dark:bg-sky-400 animate-pulse rounded-xs" />
                        )}
                      </span>
                    </span>
                  );
                }

                // Upcoming words in the test passage
                return (
                  <span
                    key={token.index}
                    className="inline-block text-slate-700 dark:text-slate-300 font-medium px-1 py-0.5 tracking-normal opacity-90"
                  >
                    {token.text}
                  </span>
                );
              })}
            </div>
          ) : (
            /* Standard Drill Character Grid (Used for Lessons) */
            <div className="flex flex-wrap items-start">
              {words.map((word, wordIdx) => {
                const hasTrailingSpace = word.chars[word.chars.length - 1]?.char === ' ';
                const targetCharCount = hasTrailingSpace ? word.chars.length - 1 : word.chars.length;
                const typedWordForToken = useWordAlignment ? (typedWords[wordIdx] ?? '') : '';

                return (
                  <span
                    key={wordIdx}
                    className="inline-flex items-end flex-nowrap mr-2 sm:mr-3 my-1 sm:my-1.5 align-top"
                  >
                    {word.chars.map(({ char, globalIndex }, cIdx) => {
                      let isPassed = false;
                      let isCurrent = false;
                      let typedChar: string | null = null;
                      let isCorrect = false;

                      if (useWordAlignment) {
                        const isSpaceChar = hasTrailingSpace && cIdx === targetCharCount;
                        if (wordIdx < activeWordIndex) {
                          isPassed = true;
                          if (isSpaceChar) {
                            typedChar = ' ';
                            isCorrect = typedWordForToken.length === targetCharCount;
                          } else {
                            typedChar = cIdx < typedWordForToken.length ? typedWordForToken[cIdx] : null;
                            isCorrect = typedChar !== null && typedChar === char;
                          }
                        } else if (wordIdx === activeWordIndex) {
                          if (isSpaceChar) {
                            isCurrent = typedWordForToken.length >= targetCharCount;
                          } else {
                            isPassed = cIdx < typedWordForToken.length;
                            isCurrent = cIdx === typedWordForToken.length;
                            typedChar = isPassed ? typedWordForToken[cIdx] : null;
                            isCorrect = isPassed && typedChar === char;
                          }
                        }
                      } else {
                        isPassed = globalIndex < currentIndex;
                        isCurrent = globalIndex === currentIndex;
                        typedChar = isPassed ? typedText[globalIndex] : null;
                        isCorrect = isPassed && typedChar === char;
                      }

                      return (
                        <span
                          key={globalIndex}
                          className="inline-flex flex-col items-center justify-start min-w-[0.9em] sm:min-w-[1.05em] px-[0.5px] relative"
                        >
                          {/* Target Character (Top) */}
                          <span
                            ref={isCurrent ? activeCharRef : null}
                            className={`relative inline-block leading-none font-mono text-xl sm:text-2xl transition-colors duration-100 ${
                              isPassed
                                ? isCorrect
                                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                  : 'text-rose-600 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/70 rounded px-0.5 font-bold'
                                : isCurrent
                                ? 'text-slate-900 dark:text-white font-bold bg-sky-100 dark:bg-sky-950/90 rounded px-1 border-b-2 border-sky-500 shadow-2xs'
                                : 'text-slate-800 dark:text-slate-200 font-medium'
                            } ${language === 'hindi' ? 'font-hindi text-2xl sm:text-3xl' : ''}`}
                          >
                            {/* High-contrast vertical blinking cursor at the next character */}
                            {isCurrent && !isCompleted && (
                              <span
                                className="absolute -left-[2px] top-0 bottom-0 w-[3px] bg-slate-950 dark:bg-sky-300 rounded-full animate-cursor-blink"
                                aria-hidden="true"
                              />
                            )}
                            {char === ' ' ? '\u00A0' : char}
                          </span>

                          {/* Directly Underneath Typing Progress */}
                          <span
                            className={`h-5 sm:h-6 flex items-center justify-center font-mono text-xs sm:text-sm font-bold leading-none mt-1 transition-all ${
                              isPassed
                                ? isCorrect
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 rounded px-0.5 underline decoration-wavy decoration-rose-500'
                                : isCurrent
                                ? 'text-sky-500 dark:text-sky-400'
                                : 'text-transparent select-none'
                            }`}
                          >
                            {isPassed ? (
                              typedChar === null ? '—' : typedChar === ' ' ? '␣' : typedChar
                            ) : isCurrent ? (
                              <span className="w-2.5 sm:w-3 h-1 bg-sky-500 dark:bg-sky-400 rounded-full animate-pulse" />
                            ) : (
                              char === ' ' ? '\u00A0' : char
                            )}
                          </span>
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer inside the Box */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Click inside to type directly</span>
          </span>
          <div className="flex items-center gap-3">
            <span>Accuracy: <strong className="font-mono text-slate-700 dark:text-slate-300">{accuracy}%</strong></span>
            <span>Errors: <strong className="font-mono text-rose-500">{errors}</strong></span>
          </div>
        </div>
      </div>

      {/* Virtual Keyboard Header & Emulation Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 py-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {language === 'english'
              ? 'QWERTY Touch Typing Keyboard'
              : hindiLayout === 'inscript'
              ? 'InScript Hindi Layout (Official SSC Standard)'
              : hindiLayout === 'remington'
              ? 'Remington Gail Layout'
              : 'Hindi Phonetic Keyboard'}
          </span>

          {language === 'hindi' && (hindiLayout === 'inscript' || hindiLayout === 'remington') && (
            <button
              onClick={() => setHardwareKeyEmulation(!hardwareKeyEmulation)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                hardwareKeyEmulation
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title="Automatically maps your standard hardware keyboard keys to Hindi InScript characters"
            >
              Hardware Key Mapping: {hardwareKeyEmulation ? 'Auto Active' : 'OS Direct'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleVirtualHands}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              showVirtualHands
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
            title="Toggle Virtual Hand Guide"
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Virtual Hand Guide: {showVirtualHands ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="text-sky-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer text-xs"
          >
            {showKeyboard ? 'Hide Virtual Keyboard' : 'Show Virtual Keyboard'}
          </button>
        </div>
      </div>

      {/* On-Screen Keyboard flanked by Virtual Hands (Left Hand on left, Right Hand on right) */}
      {showKeyboard && (
        <KeyboardVisualizer
          layout={language === 'english' ? 'english' : hindiLayout}
          nextExpectedChar={keyInfo?.matchedText || nextChar}
          activePressedCode={activeCode}
          shiftRequired={keyInfo?.shift}
          highlightExpectedKey={!hideKeyboardHints}
          customHighlightKeys={customHighlightKeys}
          showHandsGuide={showVirtualHands}
          onKeyClick={applyNextCharacter}
        />
      )}

      {/* Completion Dialog / Results Banner */}
      {isCompleted && (() => {
        const starCount =
          accuracy >= 98 ? 5 : accuracy >= 95 ? 4 : accuracy >= 90 ? 3 : accuracy >= 80 ? 2 : 1;
        const reachedBenchmark = minAccuracyToPass ? accuracy >= minAccuracyToPass : accuracy >= 90;

        return (
          <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-800/80 dark:to-slate-900 border border-sky-200 dark:border-slate-700 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-md ${
                  reachedBenchmark ? 'bg-emerald-500' : 'bg-sky-500'
                }`}
              >
                {reachedBenchmark ? <CheckCircle2 className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {reachedBenchmark ? 'Exercise Passed!' : 'Exercise Completed!'}
                  </h3>
                  <div className="flex items-center gap-0.5 ml-2" title={`${starCount} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (s <= starCount) {
                            playSingleStarChime(s, soundEnabled);
                          }
                        }}
                        disabled={s > starCount}
                        className={`p-0.5 rounded transition-transform focus:outline-hidden ${
                          s <= starCount
                            ? 'cursor-pointer hover:scale-125 focus:scale-125'
                            : 'cursor-default'
                        }`}
                        title={s <= starCount ? `Star ${s} (Click to replay chime)` : `Star ${s}`}
                        aria-label={`Star ${s}`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            s <= starCount
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Net Speed:{' '}
                  <strong className="text-sky-600 dark:text-sky-400 font-mono-nums font-bold">
                    {netWpm} WPM
                  </strong>{' '}
                  · Accuracy:{' '}
                  <strong
                    className={`font-mono-nums font-bold ${
                      accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {accuracy}%
                  </strong>{' '}
                  · Errors: <strong className="font-mono-nums">{errors}</strong>
                </p>

                {minAccuracyToPass && !reachedBenchmark && (
                  <p className="text-xs text-sky-700 dark:text-sky-300 font-medium">
                    You earned {starCount} star{starCount > 1 ? 's' : ''}! Tip: Reaching {minAccuracyToPass}% accuracy earns 3+ stars. You can proceed or practice again.
                  </p>
                )}
                {minAccuracyToPass && reachedBenchmark && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Excellent! You earned {starCount} stars and met the {minAccuracyToPass}% benchmark.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-all cursor-pointer"
              >
                Practice Again
              </button>
              {hasNextLesson && onNextLesson && (
                <button
                  onClick={onNextLesson}
                  style={{ backgroundColor: currentTheme.primaryColor }}
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm flex items-center gap-2 transition-all hover:shadow hover:opacity-95 cursor-pointer"
                >
                  {nextButtonLabel || 'Next Lesson'} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Completion Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title={accuracy >= 95 ? 'Outstanding Performance!' : 'Exercise Completed!'}
        subtitle={`You completed "${title || 'the typing drill'}" with ${accuracy}% accuracy.`}
        wpm={netWpm}
        accuracy={accuracy}
        errors={errors}
        stars={
          accuracy >= 98 ? 5 : accuracy >= 95 ? 4 : accuracy >= 90 ? 3 : accuracy >= 80 ? 2 : 1
        }
        soundEnabled={soundEnabled}
        hasNextLesson={hasNextLesson}
        nextButtonLabel={nextButtonLabel}
        onNextLesson={onNextLesson}
        onRetry={handleReset}
      />
    </div>
  );
};
