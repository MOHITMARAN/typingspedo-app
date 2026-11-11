import React, { useState, useEffect } from 'react';
import { ENGLISH_BEGINNER_LESSONS, BeginnerLesson, BeginnerUnit } from '../data/englishBeginnerLessons';
import { UserProgress, TypingStats, Language } from '../types';
import { TypingEngine } from './TypingEngine';
import { KeyboardVisualizer } from './KeyboardVisualizer';
import {
  isLessonUnlocked,
  recordBeginnerUnitProgress,
  recordBeginnerChallengeScore,
} from '../utils/storage';
import {
  CheckCircle2,
  Lock,
  Star,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Play,
} from 'lucide-react';
import { playKeyClick, getSavedSoundPreference } from '../utils/sound';

export interface TypingLessonViewProps {
  lessons?: BeginnerLesson[];
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  language?: Language;
  onLessonComplete?: (lessonId: string, stats: TypingStats) => void;
}

export const TypingLessonView: React.FC<TypingLessonViewProps> = ({
  lessons = ENGLISH_BEGINNER_LESSONS,
  userProgress,
  onUpdateProgress,
  language = 'english',
  onLessonComplete,
}) => {
  // Empty course state
  if (lessons.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curriculum Rebuild</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              English Touch Typing School
            </h2>
            <p className="text-base font-semibold text-sky-600 dark:text-sky-400">
              New lessons coming soon.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              We are preparing structured lessons with step-by-step key progression, interactive drills, and benchmark speed challenges.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span>Lessons: 0</span>
            <span>•</span>
            <span>Progress: 0%</span>
            <span>•</span>
            <span>Stars: 0</span>
          </div>
        </div>
      </div>
    );
  }

  // Active lesson and unit state
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id || 'eng-beg-1');
  const [activeUnitNumber, setActiveUnitNumber] = useState<1 | 2 | 3>(1);

  // Distraction-Free Typing Mode: True during active typing, False when viewing full curriculum list
  const [isPracticing, setIsPracticing] = useState<boolean>(false);

  // Current lesson & unit lookup
  const currentLesson: BeginnerLesson =
    lessons.find((l) => l.id === activeLessonId) || lessons[0];
  const currentUnit: BeginnerUnit =
    currentLesson.units.find((u) => u.unitNumber === activeUnitNumber) || currentLesson.units[0];

  // Active Lesson score record from storage
  const lessonScore = userProgress.beginnerScores?.[currentLesson.id];

  // Next lesson in sequence lookup
  const nextLessonNum = currentLesson.lessonNumber + 1;
  const nextLesson = lessons.find((l) => l.lessonNumber === nextLessonNum);
  const hasNextLessonInCurriculum = !!nextLesson;

  const nextButtonLabel =
    activeUnitNumber < 3
      ? `Proceed to Unit ${activeUnitNumber + 1}`
      : hasNextLessonInCurriculum
      ? `Next: Lesson ${nextLesson.lessonNumber} (${nextLesson.title})`
      : 'Complete Course';

  // When active lesson changes, resume at first incomplete unit
  useEffect(() => {
    const completedUnits = userProgress.beginnerScores?.[currentLesson.id]?.completedUnits || [];
    if (!completedUnits.includes(1)) {
      setActiveUnitNumber(1);
    } else if (!completedUnits.includes(2)) {
      setActiveUnitNumber(2);
    } else if (!completedUnits.includes(3)) {
      setActiveUnitNumber(3);
    } else {
      setActiveUnitNumber(1);
    }
  }, [currentLesson.id]);

  // Handle completing orientation / learn unit
  const handleCompleteUnit1Or2 = () => {
    const updated = recordBeginnerUnitProgress(currentLesson.id, activeUnitNumber);
    onUpdateProgress(updated);
    if (activeUnitNumber < 3) {
      setActiveUnitNumber((prev) => ((prev + 1) as 1 | 2 | 3));
    } else {
      handleProceedNext();
    }
  };

  // Handle completing typing unit (Guided practice or challenge)
  const handleTypingUnitComplete = (stats: TypingStats) => {
    if (activeUnitNumber === 3) {
      // Final Challenge Assessment (Unit 3 - completes the lesson!)
      const { updatedProgress } = recordBeginnerChallengeScore(currentLesson.id, {
        wpm: stats.wpm,
        netWpm: stats.netWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        timeElapsed: stats.timeElapsed,
      });
      onUpdateProgress(updatedProgress);
      if (onLessonComplete) {
        onLessonComplete(currentLesson.id, stats);
      }
    } else {
      // Unit 1 or Unit 2 practice
      const updated = recordBeginnerUnitProgress(currentLesson.id, activeUnitNumber, {
        wpm: stats.wpm,
        netWpm: stats.netWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        timeElapsed: stats.timeElapsed,
      });
      onUpdateProgress(updated);
    }
  };

  // Move to next unit or advance to next unlocked lesson
  const handleProceedNext = () => {
    if (activeUnitNumber < 3) {
      setActiveUnitNumber((prev) => ((prev + 1) as 1 | 2 | 3));
    } else {
      // All 3 units completed! Advance to next lesson in sequence
      if (nextLesson) {
        setActiveLessonId(nextLesson.id);
        setActiveUnitNumber(1);
      } else {
        // Finished all lessons in the curriculum!
        setIsPracticing(false);
      }
    }
  };

  // Course overview metrics
  const totalStars = Object.values(userProgress.beginnerScores || {}).reduce(
    (sum, score) => sum + (score.stars || 0),
    0
  );
  const totalCompletedLessons = lessons.filter(
    (l) => userProgress.beginnerScores?.[l.id]?.passed
  ).length;

  // ===========================================================================
  // SCREEN 1: ACTIVE DISTRACTION-FREE TYPING PRACTICE SCREEN
  // Displays ONLY:
  // 1. Current lesson title and a small progress indicator
  // 2. Typing exercise text
  // 3. Typing practice area
  // 4. Virtual keyboard with 3D hand animation
  // + A small Back button to return to the course lesson list
  // ===========================================================================
  if (isPracticing) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-4 animate-fade-in">
        {/* Clean, Spacious Top Navigation & Unit Controls Header */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 space-y-3">
          {/* Top Row: Back to Course Button, Lesson Title, and Target Benchmark */}
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
                title="Return to Course Lessons List"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Lessons</span>
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-sky-600 text-white tracking-wide shrink-0 font-mono">
                  Lesson {currentLesson.lessonNumber}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {currentLesson.title}
                </h2>
              </div>
            </div>

            {/* Target Accuracy Benchmark */}
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl shrink-0 self-start sm:self-auto">
              Target: ≥{currentUnit.minAccuracyToPass || 90}% Accuracy
            </span>
          </div>

          {/* Unit Stepper Navigation - clean and well-spaced */}
          <div className="flex items-center gap-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto pb-0.5 scrollbar-none">
            {currentLesson.units.map((unit) => {
              const isActive = unit.unitNumber === activeUnitNumber;
              const isCompleted = lessonScore?.completedUnits.includes(unit.unitNumber);

              return (
                <button
                  key={unit.id}
                  onClick={() => {
                    setActiveUnitNumber(unit.unitNumber);
                    try {
                      playKeyClick(getSavedSoundPreference());
                    } catch {
                      // safe fallback
                    }
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none border-2 active:scale-95 active:translate-y-0.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-700 dark:to-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 border-b-[3px] border-b-emerald-400 active:border-b'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b hover:bg-slate-50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">
                      {unit.unitNumber}
                    </span>
                  )}
                  <span>{unit.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Typing Engine (Units 1, 2, 3 with Exercise Text, Area, and Keyboard Hands) */}
        {currentUnit.exerciseText && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
            <TypingEngine
              key={`${currentLesson.id}-${currentUnit.unitNumber}`}
              targetText={currentUnit.exerciseText}
              language={language}
              hideKeyboardHints={currentUnit.hideKeyboardHints || false}
              minAccuracyToPass={currentUnit.minAccuracyToPass}
              onComplete={handleTypingUnitComplete}
              hasNextLesson={activeUnitNumber < 3 || hasNextLessonInCurriculum}
              nextButtonLabel={nextButtonLabel}
              onNextLesson={handleProceedNext}
            />
          </div>
        )}
      </div>
    );
  }

  // ===========================================================================
  // SCREEN 2: COURSE CURRICULUM OVERVIEW
  // Shows full 17 lessons, progress metrics, locked/unlocked status, stars,
  // and clean "Start Practice" action buttons to begin distraction-free typing.
  // ===========================================================================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Course Progress Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Course Progress</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono-nums">
            {totalCompletedLessons} / {lessons.length} <span className="text-xs font-normal text-slate-400">Lessons</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Stars Earned</span>
          <div className="text-lg font-bold text-amber-500 font-mono-nums flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{totalStars}</span> <span className="text-xs font-normal text-slate-400">/ {lessons.length * 5}</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Best Speed</span>
          <div className="text-lg font-bold text-sky-600 dark:text-sky-400 font-mono-nums">
            {userProgress.highestWpmEnglish}{' '}
            <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pass Benchmark</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono-nums">
            90% <span className="text-xs font-normal text-slate-400">Accuracy</span>
          </div>
        </div>
      </div>

      {/* Curriculum Grid: 17 Lessons in Clean, Responsive Layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Course Curriculum ({lessons.length} Lessons)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any unlocked lesson to enter the distraction-free typing practice interface.
            </p>
          </div>

          {/* Quick Continue Button */}
          {(() => {
            const firstIncomplete = lessons.find(
              (l) => !userProgress.beginnerScores?.[l.id]?.passed
            ) || lessons[0];

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
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl border-2 border-sky-400 border-b-sky-700 border-b-[3px] active:border-b active:scale-95 active:translate-y-0.5 shadow-xs transition-all duration-150 cursor-pointer select-none"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Continue Lesson {firstIncomplete.lessonNumber}</span>
              </button>
            );
          })()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {lessons.map((lesson) => {
            const unlockStatus = isLessonUnlocked(lesson.lessonNumber, userProgress);
            const record = userProgress.beginnerScores?.[lesson.id];
            const isPassed = record?.passed || false;
            const stars = record?.stars || 0;

            return (
              <div
                key={lesson.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isPassed
                    ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60 shadow-2xs'
                    : unlockStatus.unlocked
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-300 dark:hover:border-sky-700'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-70'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono">
                      Lesson {lesson.lessonNumber}
                    </span>

                    {isPassed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Passed</span>
                      </span>
                    ) : !unlockStatus.unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400" title={unlockStatus.reason}>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {lesson.subtitle}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    {lesson.newKeys.length > 0 ? (
                      <span className="font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 px-1.5 py-0.2 rounded">
                        Keys: {lesson.newKeys.join(', ').toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-slate-400">Orientation</span>
                    )}
                    <span>·</span>
                    <span>3 Units</span>
                  </div>
                </div>

                {/* Footer with Star rating & Start Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
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
                  </div>

                  {/* Action Button */}
                  {unlockStatus.unlocked ? (
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
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl border-2 border-sky-400 border-b-sky-700 border-b-[3px] active:border-b active:scale-95 active:translate-y-0.5 shadow-2xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      <span>{isPassed ? 'Practice Again' : 'Start Lesson'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Unlocks after L{lesson.lessonNumber - 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
