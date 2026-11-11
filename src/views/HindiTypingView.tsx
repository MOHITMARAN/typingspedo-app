import React, { useState, useMemo, useEffect } from 'react';
import { HINDI_LESSONS } from '../data/hindiLessons';
import { HindiCategory, HindiLayout, Lesson, LessonUnit, TypingStats, UserProgress } from '../types';
import { TypingEngine } from '../components/TypingEngine';
import { recordHindiLessonScore, recordHindiUnitProgress } from '../utils/storage';
import { playKeyClick, getSavedSoundPreference } from '../utils/sound';
import {
  CheckCircle2,
  Languages,
  BookOpen,
  Keyboard,
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeft,
  Play,
  Star,
} from 'lucide-react';

interface HindiTypingViewProps {
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export const HindiTypingView: React.FC<HindiTypingViewProps> = ({
  userProgress,
  onUpdateProgress,
}) => {
  const [selectedLayout, setSelectedLayout] = useState<HindiLayout>('inscript');
  const [selectedCategory, setSelectedCategory] = useState<HindiCategory | 'all'>('inscript-course');
  const [activeLessonId, setActiveLessonId] = useState<string>(HINDI_LESSONS[0]?.id || '');
  const [activeUnitNumber, setActiveUnitNumber] = useState<number>(1);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  // Distraction-free active typing mode
  const [isPracticing, setIsPracticing] = useState<boolean>(false);

  const handleSelectLayout = (layout: HindiLayout) => {
    setSelectedLayout(layout);
    try {
      playKeyClick(getSavedSoundPreference());
    } catch {
      // safe fallback
    }
  };

  // Filter lessons by category and search
  const filteredLessons = useMemo(() => {
    return HINDI_LESSONS.filter((lesson) => {
      const matchesCategory =
        selectedCategory === 'all' || lesson.hindiCategory === selectedCategory;
      const matchesSearch =
        !lessonSearchQuery.trim() ||
        lesson.title.toLowerCase().includes(lessonSearchQuery.toLowerCase()) ||
        lesson.subtitle.toLowerCase().includes(lessonSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, lessonSearchQuery]);

  const activeLesson =
    HINDI_LESSONS.find((l) => l.id === activeLessonId) || filteredLessons[0] || null;
  const activeLessonIndex = activeLesson ? HINDI_LESSONS.findIndex((l) => l.id === activeLesson.id) : -1;
  const hasNextLesson = activeLessonIndex >= 0 && activeLessonIndex < HINDI_LESSONS.length - 1;
  const nextLesson = hasNextLesson ? HINDI_LESSONS[activeLessonIndex + 1] : null;

  // Resolve units for active lesson (defaulting to Unit 1: Drills, Unit 2: Complete Words)
  const units: LessonUnit[] = useMemo(() => {
    if (!activeLesson) return [];
    if (activeLesson.units && activeLesson.units.length > 0) {
      return activeLesson.units;
    }
    return [
      {
        id: `${activeLesson.id}-u1`,
        unitNumber: 1,
        name: 'वर्ण एवं संयोजन अभ्यास',
        instruction: activeLesson.subtitle,
        content: activeLesson.content,
        targetWpm: activeLesson.targetWpm || 20,
        minAccuracyToPass: 80,
      },
      {
        id: `${activeLesson.id}-u2`,
        unitNumber: 2,
        name: 'संपूर्ण शब्द अभ्यास',
        instruction: 'पूरे सार्थक शब्दों (जैसे राम, सीता आदि) का अभ्यास करें।',
        content: activeLesson.content,
        targetWpm: activeLesson.targetWpm || 20,
        minAccuracyToPass: 85,
      },
    ];
  }, [activeLesson]);

  // When active lesson changes, start at first incomplete unit
  useEffect(() => {
    if (!activeLesson) return;
    const completed = userProgress.hindiScores?.[activeLesson.id]?.completedUnits || [];
    if (!completed.includes(1)) {
      setActiveUnitNumber(1);
    } else if (!completed.includes(2)) {
      setActiveUnitNumber(2);
    } else {
      setActiveUnitNumber(1);
    }
  }, [activeLesson?.id]);

  const currentUnit = units.find((u) => u.unitNumber === activeUnitNumber) || units[0] || null;
  const currentLessonScore = activeLesson ? userProgress.hindiScores?.[activeLesson.id] : undefined;
  const completedUnits = currentLessonScore?.completedUnits || [];

  const handleUnitComplete = (stats: TypingStats) => {
    if (!activeLesson) return;
    if (activeUnitNumber === 1 && units.length > 1) {
      // Completed Unit 1: Record Unit 1 progress and advance to Unit 2 (Complete words)
      const updated = recordHindiUnitProgress(activeLesson.id, 1, {
        wpm: stats.wpm,
        netWpm: stats.netWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        timeElapsed: stats.timeElapsed,
      });
      onUpdateProgress(updated);
      setActiveUnitNumber(2);
    } else {
      // Completed Unit 2: Full Lesson completion!
      const { updatedProgress } = recordHindiLessonScore(activeLesson.id, activeLesson.title, {
        wpm: stats.wpm,
        netWpm: stats.netWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        timeElapsed: stats.timeElapsed,
      });
      onUpdateProgress(updatedProgress);
    }
  };

  const handleNextLesson = () => {
    if (hasNextLesson) {
      setActiveLessonId(HINDI_LESSONS[activeLessonIndex + 1].id);
      setActiveUnitNumber(1);
    }
  };

  const totalHindiStars = Object.values(userProgress.hindiScores || {}).reduce(
    (sum, score) => sum + (score.stars || 0),
    0
  );

  const totalHindiCompleted = HINDI_LESSONS.filter(
    (l) => userProgress.hindiScores?.[l.id]?.passed || userProgress.completedLessons?.includes(l.id)
  ).length;

  const categories: { id: HindiCategory | 'all'; label: string; count: number; badge?: string }[] = [
    {
      id: 'inscript-course',
      label: 'InScript / Remington Gail Course (इन्स्क्रिप्ट / रेमिंगटन गेल)',
      count: HINDI_LESSONS.filter((l) => l.hindiCategory === 'inscript-course').length,
      badge: 'Core Layout',
    },
    {
      id: 'speed-drills',
      label: 'Speed Drills (३०-४० WPM)',
      count: HINDI_LESSONS.filter((l) => l.hindiCategory === 'speed-drills').length,
      badge: 'Speed Booster',
    },
    {
      id: 'all',
      label: 'All Lessons (सभी पाठ)',
      count: HINDI_LESSONS.length,
    },
    {
      id: 'vowels',
      label: 'Vowels (स्वर)',
      count: HINDI_LESSONS.filter((l) => l.hindiCategory === 'vowels').length,
    },
    {
      id: 'consonants',
      label: 'Consonants (व्यंजन)',
      count: HINDI_LESSONS.filter((l) => l.hindiCategory === 'consonants').length,
    },
    {
      id: 'matras',
      label: 'Matras (मात्राएँ)',
      count: HINDI_LESSONS.filter((l) => l.hindiCategory === 'matras').length,
    },
    {
      id: 'words',
      label: 'Words (शब्द)',
      count: HINDI_LESSONS.filter((l) => l.hindiCategory === 'words').length,
    },
    {
      id: 'paragraphs',
      label: 'Exam Passages (परीक्षा गद्यांश)',
      count: HINDI_LESSONS.filter((l) => l.hindiCategory === 'paragraphs').length,
    },
  ];

  // ===========================================================================
  // SCREEN 1: DISTRACTION-FREE ACTIVE TYPING PRACTICE SCREEN
  // Hides the entire lesson sidebar, speed guides, and search panels.
  // ===========================================================================
  if (isPracticing && activeLesson) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-4 py-4 sm:py-6 animate-fade-in">
        {/* Clean, Spacious Navigation & Controls Header */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3">
          {/* Top Row: Back to Lessons, Lesson Title, and Benchmark/Star Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => {
                  setIsPracticing(false);
                  try {
                    playKeyClick(getSavedSoundPreference());
                  } catch {
                    // safe fallback
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b active:translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer select-none shrink-0"
                title="Return to Hindi Lessons List"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Lessons</span>
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono shrink-0">
                  Unit {currentUnit?.unitNumber || activeUnitNumber}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-hindi truncate">
                  {activeLesson.title}
                </h2>
              </div>
            </div>

            {/* Target Speed & Star Rating Badges */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-xl whitespace-nowrap">
                Target: {currentUnit?.targetWpm || activeLesson.targetWpm} WPM
              </span>

              {(() => {
                const lessonScore = userProgress.hindiScores?.[activeLesson.id];
                const stars = lessonScore?.stars || 0;
                return (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono-nums whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{stars > 0 ? `${stars}/5 Stars` : 'Earn 1-5 Stars'}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Controls Row: Unit Navigation & Hindi Keyboard Layout Switcher (cleanly arranged, zero overlap) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
            {/* Units Navigation Tabs */}
            {units.length > 1 ? (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {units.map((unit) => {
                  const isCompleted = completedUnits.includes(unit.unitNumber);
                  const isActive = activeUnitNumber === unit.unitNumber;
                  return (
                    <button
                      key={unit.unitNumber}
                      onClick={() => {
                        setActiveUnitNumber(unit.unitNumber);
                        try {
                          playKeyClick(getSavedSoundPreference());
                        } catch {
                          // safe fallback
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer select-none whitespace-nowrap border-2 active:scale-95 active:translate-y-0.5 ${
                        isActive
                          ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-700 dark:to-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 border-b-[3px] border-b-emerald-400 active:border-b'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600 border-b-[3px] border-b-slate-300 dark:border-b-slate-800 active:border-b'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {unit.unitNumber}
                      </span>
                      <span>{unit.name}</span>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div />
            )}

            {/* Keyboard Layout Selector - InScript, Remington Gail, Phonetic (arranged cleanly with spacious 3D buttons) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-x-auto pb-0.5 shrink-0 self-start md:self-auto">
              {(
                [
                  { id: 'inscript' as HindiLayout, label: 'InScript', badge: 'SSC' },
                  { id: 'remington' as HindiLayout, label: 'Remington Gail', badge: 'Court' },
                  { id: 'phonetic' as HindiLayout, label: 'Phonetic', badge: 'Easy' },
                ] as const
              ).map((layout) => {
                const isSelected = selectedLayout === layout.id;
                return (
                  <button
                    key={layout.id}
                    onClick={() => handleSelectLayout(layout.id)}
                    type="button"
                    title={`Switch to ${layout.label} layout`}
                    className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer select-none active:scale-95 active:translate-y-0.5 border-2 whitespace-nowrap ${
                      isSelected
                        ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-700 dark:to-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isSelected ? 'bg-sky-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span>{layout.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected
                          ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {layout.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Hindi Typing Engine Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
          <TypingEngine
            key={`${activeLesson.id}-u${currentUnit?.unitNumber || 1}-${selectedLayout}`}
            targetText={currentUnit?.content || activeLesson.content}
            language="hindi"
            hindiLayout={selectedLayout}
            wordMode={currentUnit?.unitNumber === 2 || activeLesson.hindiCategory === 'words' || activeLesson.hindiCategory === 'paragraphs'}
            minAccuracyToPass={currentUnit?.minAccuracyToPass || 85}
            onComplete={handleUnitComplete}
            onNextLesson={
              activeUnitNumber === 1 && units.length > 1
                ? () => setActiveUnitNumber(2)
                : handleNextLesson
            }
            hasNextLesson={
              (activeUnitNumber === 1 && units.length > 1) || hasNextLesson
            }
            nextButtonLabel={
              activeUnitNumber === 1 && units.length > 1
                ? 'Proceed to Unit 2'
                : nextLesson
                ? `Next: ${nextLesson.title}`
                : 'Complete Course'
            }
          />
        </div>
      </div>
    );
  }

  // ===========================================================================
  // SCREEN 2: HINDI CURRICULUM OVERVIEW
  // ===========================================================================
  return (
    <div className="py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Title & Layout Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <Languages className="w-4 h-4" /> Hindi Lesson · मानक इन्स्क्रिप्ट एवं रेमिंगटन
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Hindi Lesson
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-hindi">
            सरकारी परीक्षाओं (SSC, High Court, Railway, स्टेनो) के लिए मानक इन्स्क्रिप्ट एवं रेमिंगटन गेल कीबोर्ड सीखें और ३०-४० शब्द प्रति मिनट गति प्राप्त करें।
          </p>
        </div>

        {/* Keyboard Layout Switcher Tabs */}
        <div className="space-y-1.5 self-start sm:self-auto shrink-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Keyboard Layout (कीबोर्ड लेआउट):
            </span>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
            {(
              [
                {
                  id: 'inscript' as HindiLayout,
                  title: 'InScript',
                  sub: 'इन्स्क्रिप्ट',
                  badge: 'SSC Standard',
                  badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
                },
                {
                  id: 'remington' as HindiLayout,
                  title: 'Remington Gail',
                  sub: 'रेमिंगटन गेल',
                  badge: 'High Court',
                  badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
                },
                {
                  id: 'phonetic' as HindiLayout,
                  title: 'Phonetic',
                  sub: 'फोनेटिक',
                  badge: 'Easy Translit',
                  badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
                },
              ] as const
            ).map((layout) => {
              const isSelected = selectedLayout === layout.id;
              return (
                <button
                  key={layout.id}
                  onClick={() => handleSelectLayout(layout.id)}
                  type="button"
                  className={`group relative px-3.5 py-2 rounded-xl text-left font-sans transition-all duration-150 cursor-pointer select-none border-2 active:scale-95 active:translate-y-0.5 ${
                    isSelected
                      ? 'bg-gradient-to-b from-white to-sky-50/90 dark:from-slate-800 dark:to-sky-950/40 border-sky-500 dark:border-sky-400 border-b-[4px] active:border-b-2 text-sky-900 dark:text-sky-200 shadow-md shadow-sky-500/15'
                      : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 border-b-[4px] border-b-slate-300 dark:border-b-slate-900 active:border-b-2 text-slate-700 dark:text-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full transition-transform group-hover:scale-110 ${
                        isSelected ? 'bg-sky-500 shadow-xs shadow-sky-500/50 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span className="text-xs font-bold leading-tight tracking-tight">
                      {layout.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1.5 mt-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-hindi">
                      {layout.sub}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${layout.badgeColor}`}>
                      {layout.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hindi Course Progress & Stars Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Course Progress</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono-nums">
            {totalHindiCompleted} / {HINDI_LESSONS.length} <span className="text-xs font-normal text-slate-400">Lessons</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Stars Earned</span>
          <div className="text-lg font-bold text-amber-500 font-mono-nums flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{totalHindiStars}</span> <span className="text-xs font-normal text-slate-400">/ {HINDI_LESSONS.length * 5}</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Best Hindi Speed</span>
          <div className="text-lg font-bold text-sky-600 dark:text-sky-400 font-mono-nums">
            {userProgress.highestWpmHindi}{' '}
            <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pass Benchmark</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono-nums">
            85% <span className="text-xs font-normal text-slate-400">Accuracy</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs, Quick Continue & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  try {
                    playKeyClick(getSavedSoundPreference());
                  } catch {
                    // safe fallback
                  }
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer select-none flex items-center gap-1.5 shrink-0 border-2 active:scale-95 active:translate-y-0.5 transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-b from-slate-900 to-slate-800 dark:from-sky-600 dark:to-sky-700 text-white border-slate-700 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Continue Button */}
          {(() => {
            const firstIncomplete =
              HINDI_LESSONS.find(
                (l) => !(userProgress.hindiScores?.[l.id]?.passed || userProgress.completedLessons?.includes(l.id))
              ) || HINDI_LESSONS[0];

            return (
              <button
                onClick={() => {
                  setActiveLessonId(firstIncomplete.id);
                  setIsPracticing(true);
                  try {
                    playKeyClick(getSavedSoundPreference());
                  } catch {
                    // safe fallback
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl border-2 border-sky-400 border-b-sky-700 border-b-[3px] active:border-b active:scale-95 active:translate-y-0.5 shadow-2xs transition-all duration-150 cursor-pointer select-none whitespace-nowrap shrink-0"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Continue Lesson</span>
              </button>
            );
          })()}

          <div className="relative shrink-0 w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lessonSearchQuery}
              onChange={(e) => setLessonSearchQuery(e.target.value)}
              placeholder="Search Hindi lessons..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid or Clean Empty State */}
      {filteredLessons.length === 0 ? (
        <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-hindi text-2xl font-bold">
              हि
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hindi Lesson</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Hindi Lesson
              </h2>
              <p className="text-base font-semibold text-amber-700 dark:text-amber-400 font-hindi">
                New lessons coming soon.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-hindi leading-relaxed">
                नये पाठ जल्द आ रहे हैं। हम इनस्क्रिप्ट (InScript) एवं रेमिंगटन गेल (Remington Gail) के नए चरणबद्ध पाठ और परीक्षा अभ्यास तैयार कर रहे हैं।
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <span>Lessons: 0</span>
              <span>•</span>
              <span>Progress: 0%</span>
              <span>•</span>
              <span>Status: Preparing Curriculum</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredLessons.map((lesson) => {
            const isSelected = activeLesson ? lesson.id === activeLesson.id : false;
            const scoreRecord = userProgress.hindiScores?.[lesson.id];
            const stars = scoreRecord?.stars || 0;
            const isPassed = scoreRecord?.passed || userProgress.completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 bg-white dark:bg-slate-900 ${
                  isPassed
                    ? 'border-emerald-200 dark:border-emerald-900/60 shadow-2xs'
                    : isSelected
                    ? 'border-sky-400 dark:border-sky-700 ring-1 ring-sky-300 dark:ring-sky-800 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono">
                        {lesson.hindiCategory === 'inscript-course' ? 'InScript / Remington Gail' : lesson.hindiCategory}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/50">
                        2 Units
                      </span>
                    </div>
                    {isPassed ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                        </span>
                        {scoreRecord && scoreRecord.accuracy > 0 && (
                          <span className="text-[10px] font-mono font-semibold text-slate-400">
                            {scoreRecord.accuracy}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 font-mono">
                        Target: {lesson.targetWpm} WPM
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-hindi">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-hindi">
                    {lesson.subtitle}
                  </p>

                  {/* Unit status pills */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        scoreRecord?.completedUnits?.includes(1) || isPassed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                      title="Unit 1: वर्ण एवं संयोजन अभ्यास"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${scoreRecord?.completedUnits?.includes(1) || isPassed ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      U1: वर्ण
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        scoreRecord?.completedUnits?.includes(2) || isPassed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                      title="Unit 2: संपूर्ण शब्द अभ्यास (पूरे शब्द जैसे राम, सीता)"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${scoreRecord?.completedUnits?.includes(2) || isPassed ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      U2: शब्द
                    </span>
                  </div>
                </div>

                {/* Footer with Star rating, char count & Practice Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {/* 5-Star Rating Display */}
                  <div className="flex items-center gap-0.5" title={`${stars} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                    {stars > 0 && (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 ml-1 font-mono-nums">
                        {stars}/5
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-hindi hidden sm:inline">
                      {lesson.content.length} अक्षर
                    </span>

                    <button
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        setIsPracticing(true);
                        try {
                          playKeyClick(getSavedSoundPreference());
                        } catch {
                          // safe fallback
                        }
                      }}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl border-2 border-sky-400 border-b-sky-700 border-b-[3px] active:border-b active:scale-95 active:translate-y-0.5 shadow-2xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isPassed ? 'Practice Again' : 'Practice'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
