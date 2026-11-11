import React, { useState } from 'react';
import { ENGLISH_BEGINNER_LESSONS } from '../data/englishBeginnerLessons';
import { ENGLISH_LESSONS } from '../data/englishLessons';
import { UserProgress } from '../types';
import { TypingLessonView } from '../components/TypingLessonView';
import { TypingEngine } from '../components/TypingEngine';
import { markLessonCompleted } from '../utils/storage';
import { BookOpen, Sparkles, CheckCircle2, ArrowLeft, ArrowRight, Play, Zap, Trophy } from 'lucide-react';
import { playKeyClick, getSavedSoundPreference } from '../utils/sound';

interface EnglishTypingViewProps {
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export const EnglishTypingView: React.FC<EnglishTypingViewProps> = ({
  userProgress,
  onUpdateProgress,
}) => {
  // Course Mode: Beginner, Intermediate, or Advanced
  const [activeCourseTier, setActiveCourseTier] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Intermediate / Advanced State
  const [activeTierLessonId, setActiveTierLessonId] = useState<string>(
    ENGLISH_LESSONS.find((l) => l.level === 'intermediate')?.id || ENGLISH_LESSONS[0]?.id || ''
  );
  const [isTierPracticing, setIsTierPracticing] = useState<boolean>(false);

  const handleSelectTier = (tier: 'beginner' | 'intermediate' | 'advanced') => {
    setActiveCourseTier(tier);
    setIsTierPracticing(false);
    try {
      playKeyClick(getSavedSoundPreference());
    } catch {
      // safe fallback
    }
  };

  const tierLessons = ENGLISH_LESSONS.filter((l) => l.level === activeCourseTier);
  const activeLesson =
    tierLessons.find((l) => l.id === activeTierLessonId) || tierLessons[0] || null;
  const activeLessonIdx = activeLesson ? tierLessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const hasNextTierLesson = activeLessonIdx >= 0 && activeLessonIdx < tierLessons.length - 1;

  const handleNextTierLesson = () => {
    if (hasNextTierLesson) {
      setActiveTierLessonId(tierLessons[activeLessonIdx + 1].id);
    }
  };

  return (
    <div className="py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Course Level Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <BookOpen className="w-4 h-4" /> English Typing Curriculum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            English Touch Typing School
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Structured touch typing curriculum — guided practice, accuracy drills, and benchmark tests.
          </p>
        </div>

        {/* Tier Tabs (Beginner School, Intermediate, Advanced) with Tactile 3D Buttons */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner self-start sm:self-auto">
          {(
            [
              { id: 'beginner' as const, label: 'Beginner Course', icon: Sparkles, badge: '12 Lessons' },
              { id: 'intermediate' as const, label: 'Intermediate', icon: Zap, badge: 'Speed Drills' },
              { id: 'advanced' as const, label: 'Advanced', icon: Trophy, badge: 'Paragraphs' },
            ] as const
          ).map((tier) => {
            const isSelected = activeCourseTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => handleSelectTier(tier.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap flex items-center gap-1.5 border-2 select-none cursor-pointer active:scale-95 active:translate-y-0.5 transition-all duration-150 ${
                  isSelected
                    ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-800 dark:to-sky-950/40 border-sky-500 dark:border-sky-400 border-b-[4px] active:border-b-2 text-sky-900 dark:text-sky-200 shadow-md shadow-sky-500/15'
                    : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 border-b-[4px] border-b-slate-300 dark:border-b-slate-900 active:border-b-2 text-slate-700 dark:text-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                {tier.icon && <tier.icon className="w-3.5 h-3.5 text-sky-500" />}
                <span>{tier.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    isSelected
                      ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {tier.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Complete Beginner School using Reusable TypingLessonView */}
      {activeCourseTier === 'beginner' && (
        <TypingLessonView
          lessons={ENGLISH_BEGINNER_LESSONS}
          userProgress={userProgress}
          onUpdateProgress={onUpdateProgress}
          language="english"
        />
      )}

      {/* 2. Intermediate & Advanced Tiers with Distraction-Free Active Practice Screen */}
      {activeCourseTier !== 'beginner' && (
        tierLessons.length === 0 ? (
          <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900 capitalize">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeCourseTier} Level</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white capitalize">
                  {activeCourseTier} Typing Drills
                </h2>
                <p className="text-base font-semibold text-sky-600 dark:text-sky-400">
                  New lessons coming soon.
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  New {activeCourseTier} practice paragraphs, speed sprints, and benchmark tests are being prepared.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
                <span>Lessons: 0</span>
                <span>•</span>
                <span>Status: Preparing Curriculum</span>
              </div>
            </div>
          </div>
        ) : isTierPracticing && activeLesson ? (
          /* Active Distraction-Free Practice View */
          <div className="w-full max-w-5xl mx-auto space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsTierPracticing(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b active:translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer select-none shrink-0"
                  title="Return to Tier Lessons List"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to {activeCourseTier} Lessons</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-600 text-white font-mono">
                    {activeCourseTier.toUpperCase()}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {activeLesson.title}
                  </h2>
                </div>
              </div>

              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-xl self-start sm:self-auto">
                Target: {activeLesson.targetWpm} WPM
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs">
              <TypingEngine
                key={activeLesson.id}
                targetText={activeLesson.content}
                language="english"
                onComplete={(stats) => {
                  const updated = markLessonCompleted(activeLesson.id, stats.netWpm, 'english');
                  onUpdateProgress(updated);
                }}
                onNextLesson={handleNextTierLesson}
                hasNextLesson={hasNextTierLesson}
              />
            </div>
          </div>
        ) : (
          /* Tier Catalog Overview Grid */
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                  {activeCourseTier} Drills ({tierLessons.length} Lessons)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a practice passage to start typing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {tierLessons.map((lesson) => {
                const isCompleted = userProgress.completedLessons.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-300 dark:hover:border-sky-700"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-mono">
                          {lesson.level}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                            Target: {lesson.targetWpm} WPM
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {lesson.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {lesson.content.split(' ').length} words
                      </span>

                      <button
                        onClick={() => {
                          setActiveTierLessonId(lesson.id);
                          setIsTierPracticing(true);
                          try {
                            playKeyClick(getSavedSoundPreference());
                          } catch {
                            // safe fallback
                          }
                        }}
                        className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl border-2 border-sky-400 border-b-sky-700 border-b-[3px] active:border-b active:scale-95 active:translate-y-0.5 shadow-2xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Start Practice</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};
