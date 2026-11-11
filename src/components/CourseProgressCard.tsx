import React from 'react';
import { UserProgress, NavTab } from '../types';
import { ENGLISH_BEGINNER_LESSONS } from '../data/englishBeginnerLessons';
import { HINDI_LESSONS } from '../data/hindiLessons';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  GraduationCap,
  Star,
} from 'lucide-react';

interface CourseProgressCardProps {
  userProgress: UserProgress;
  onNavigateTab: (tab: NavTab) => void;
  className?: string;
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  userProgress,
  onNavigateTab,
  className = '',
}) => {
  // 1. English Beginner Course Progress
  const totalEnglishLessons = ENGLISH_BEGINNER_LESSONS.length;
  const englishCompletedCount = totalEnglishLessons > 0
    ? ENGLISH_BEGINNER_LESSONS.filter(
        (l) => userProgress.beginnerScores?.[l.id]?.passed || userProgress.completedLessons?.includes(l.id)
      ).length
    : 0;

  const totalEnglishStars = Object.values(userProgress.beginnerScores || {}).reduce(
    (sum, score) => sum + (score.stars || 0),
    0
  );

  const englishPercentage = totalEnglishLessons > 0
    ? Math.round((englishCompletedCount / totalEnglishLessons) * 100)
    : 0;

  // Determine current lesson
  const currentEnglishLesson = totalEnglishLessons > 0
    ? ENGLISH_BEGINNER_LESSONS.find(
        (l) => !(userProgress.beginnerScores?.[l.id]?.passed || userProgress.completedLessons?.includes(l.id))
      ) || ENGLISH_BEGINNER_LESSONS[ENGLISH_BEGINNER_LESSONS.length - 1]
    : null;

  const englishLockedCount = totalEnglishLessons > 0
    ? Math.max(0, totalEnglishLessons - englishCompletedCount - 1)
    : 0;

  // 2. Hindi Course Progress
  const totalHindiLessons = HINDI_LESSONS.length;
  const hindiCompletedCount = totalHindiLessons > 0
    ? HINDI_LESSONS.filter(
        (l) => userProgress.hindiScores?.[l.id]?.passed || userProgress.completedLessons?.includes(l.id)
      ).length
    : 0;

  const totalHindiStars = Object.values(userProgress.hindiScores || {}).reduce(
    (sum, score) => sum + (score.stars || 0),
    0
  );

  const hindiPercentage = totalHindiLessons > 0
    ? Math.min(100, Math.round((hindiCompletedCount / totalHindiLessons) * 100))
    : 0;
  const currentHindiLesson = totalHindiLessons > 0
    ? HINDI_LESSONS.find(
        (l) => !(userProgress.hindiScores?.[l.id]?.passed || userProgress.completedLessons?.includes(l.id))
      ) || HINDI_LESSONS[HINDI_LESSONS.length - 1]
    : null;
  const currentHindiModule = currentHindiLesson ? currentHindiLesson.title : 'New lessons coming soon.';
  const hindiLockedCount = totalHindiLessons > 0
    ? Math.max(0, totalHindiLessons - hindiCompletedCount - 1)
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>Course Progress</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Track your ongoing progress across English and Hindi touch typing curricula.
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums self-start sm:self-auto">
          Total Completed: <strong className="text-slate-900 dark:text-white">{englishCompletedCount + hindiCompletedCount}</strong> Lessons
        </div>
      </div>

      {/* Two Responsive Course Cards (English & Hindi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: English Course Progress */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5 transition-all hover:border-sky-300 dark:hover:border-sky-700">
          <div className="space-y-4">
            {/* Top Row: Icon & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-base border border-sky-100 dark:border-sky-900 font-mono">
                  EN
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    English Touch Typing
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    QWERTY Beginner Touch Typing School
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-900">
                {englishPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>Progress: {englishCompletedCount} of {totalEnglishLessons} Lessons</span>
                <span>{englishCompletedCount === totalEnglishLessons ? 'Completed' : `${totalEnglishLessons - englishCompletedCount} remaining`}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 dark:bg-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, englishPercentage)}%` }}
                />
              </div>
            </div>

            {/* Detailed Lesson Status Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Completed</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {englishCompletedCount}
                </span>
              </div>

              <div className="p-3 bg-sky-50/50 dark:bg-sky-950/30 rounded-xl border border-sky-100 dark:border-sky-900/40 space-y-0.5">
                <span className="text-[10px] text-sky-600 dark:text-sky-400 block uppercase font-semibold">Current</span>
                <span className="text-base font-bold text-sky-700 dark:text-sky-300 font-mono tabular-nums">
                  {currentEnglishLesson ? `L${currentEnglishLesson.lessonNumber}` : '—'}
                </span>
              </div>

              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900/40 space-y-0.5">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block uppercase font-semibold">Stars</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {totalEnglishStars}
                </span>
              </div>
            </div>

            {/* Current Lesson Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Current Learning Target:
              </span>
              <div className="font-bold text-slate-900 dark:text-white truncate">
                {currentEnglishLesson ? currentEnglishLesson.title : 'New lessons coming soon.'}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                {currentEnglishLesson ? currentEnglishLesson.subtitle : 'Upcoming touch typing lessons are being prepared.'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigateTab('english')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Continue English Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 2: Hindi Course Progress */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5 transition-all hover:border-sky-300 dark:hover:border-sky-700">
          <div className="space-y-4">
            {/* Top Row: Icon & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xl border border-sky-100 dark:border-sky-900 font-hindi">
                  हि
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Hindi Lesson
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    InScript · Remington Gail · Phonetic
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-900">
                {hindiPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>Progress: {hindiCompletedCount} of {totalHindiLessons} Modules</span>
                <span>{hindiCompletedCount === totalHindiLessons ? 'Completed' : `${totalHindiLessons - hindiCompletedCount} remaining`}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 dark:bg-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, hindiPercentage)}%` }}
                />
              </div>
            </div>

            {/* Detailed Lesson Status Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Completed</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {hindiCompletedCount}
                </span>
              </div>

              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900/40 space-y-0.5">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block uppercase font-semibold">Stars</span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {totalHindiStars}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">All Lessons</span>
                <span className="text-base font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  {totalHindiLessons}
                </span>
              </div>
            </div>

            {/* Current Module Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                Current Module Focus:
              </span>
              <div className="font-bold text-slate-900 dark:text-white truncate">
                {currentHindiModule}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                Official Government of India & SSC standard examination format
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigateTab('hindi')}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Continue Hindi Lesson</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
