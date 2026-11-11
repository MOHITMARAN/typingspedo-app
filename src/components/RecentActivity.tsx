import React, { useState, useMemo } from 'react';
import { UserProgress, NavTab } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  History,
} from 'lucide-react';

interface RecentActivityProps {
  userProgress: UserProgress;
  onNavigateTab?: (tab: NavTab) => void;
  className?: string;
}

interface ActivitySession {
  id: string;
  title: string;
  language: 'English' | 'Hindi';
  date: string;
  durationText: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  errors: number;
  passed?: boolean;
  type: 'test' | 'lesson';
  timestamp: number;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  userProgress,
  onNavigateTab,
  className = '',
}) => {
  const [showAll, setShowAll] = useState(false);

  // Combine test results and lesson history
  const allSessions: ActivitySession[] = useMemo(() => {
    const sessions: ActivitySession[] = [];

    // 1. Tests
    (userProgress.recentResults || []).forEach((t) => {
      sessions.push({
        id: t.id,
        title: `${t.language === 'english' ? 'English' : 'Hindi'} Speed Test`,
        language: t.language === 'english' ? 'English' : 'Hindi',
        date: t.date,
        durationText: `${t.duration}s`,
        netWpm: Math.round(t.netWpm),
        grossWpm: Math.round(t.wpm),
        accuracy: Math.round(t.accuracy * 10) / 10,
        errors: t.errors,
        passed: t.netWpm >= 35 && t.accuracy >= 90,
        type: 'test',
        timestamp: new Date(t.date).getTime() || Date.now(),
      });
    });

    // 2. Lessons History
    (userProgress.lessonHistory || []).forEach((h) => {
      sessions.push({
        id: h.id,
        title: h.lessonTitle,
        language: 'English',
        date: h.date,
        durationText: 'Practice',
        netWpm: Math.round(h.netWpm),
        grossWpm: Math.round(h.wpm),
        accuracy: Math.round(h.accuracy * 10) / 10,
        errors: h.errors,
        passed: h.passed,
        type: 'lesson',
        timestamp: h.timestamp,
      });
    });

    // Sort newest first
    return sessions.sort((a, b) => b.timestamp - a.timestamp);
  }, [userProgress.recentResults, userProgress.lessonHistory]);

  const visibleSessions = showAll ? allSessions : allSessions.slice(0, 5);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>Recent Activity</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A comprehensive history of your latest typing tests and completed lesson exercises.
          </p>
        </div>

        {allSessions.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{showAll ? 'Show Fewer (5)' : `View All (${allSessions.length})`}</span>
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Empty State */}
      {allSessions.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Typing Sessions Recorded Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your test results, completed lessons, net WPM, accuracy, and error logs will appear here as soon as you finish your first session.
            </p>
          </div>
          {onNavigateTab && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('test')}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <span>Take Speed Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('english')}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all"
              >
                Start Lesson 1
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {/* Desktop/Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Activity</th>
                  <th className="py-3 px-4 font-semibold">Language</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Speed</th>
                  <th className="py-3 px-4 font-semibold text-right">Accuracy</th>
                  <th className="py-3 px-4 font-semibold text-right">Errors</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono tabular-nums">
                {visibleSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">
                      {session.title}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">
                      {session.language}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-500 dark:text-slate-400">
                      {session.date}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {session.durationText}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-sky-600 dark:text-sky-400">
                      {session.netWpm} WPM
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-bold ${
                        session.accuracy >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-500'
                      }`}
                    >
                      {session.accuracy}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">
                      {session.errors}
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      {session.passed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          <span>Completed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Strictly avoids horizontal scrolling) */}
          <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {visibleSessions.map((session) => (
              <div key={session.id} className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {session.title}
                  </span>
                  <span className="text-[11px] text-slate-400">{session.date}</span>
                </div>

                <div className="flex items-center justify-between font-mono tabular-nums text-slate-600 dark:text-slate-300">
                  <span>
                    Lang: <strong className="font-sans text-slate-800 dark:text-slate-200">{session.language}</strong>
                  </span>
                  <span>
                    Duration: <strong className="text-slate-800 dark:text-slate-200">{session.durationText}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono tabular-nums text-center">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block font-sans">Net WPM</span>
                    <strong className="text-sky-600 dark:text-sky-400 text-sm">{session.netWpm}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block font-sans">Accuracy</span>
                    <strong
                      className={`text-sm ${
                        session.accuracy >= 90
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-500'
                      }`}
                    >
                      {session.accuracy}%
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block font-sans">Errors</span>
                    <strong className="text-slate-700 dark:text-slate-300 text-sm">{session.errors}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer View All Toggle */}
          {allSessions.length > 5 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{showAll ? 'Collapse to 5 recent sessions' : `View all ${allSessions.length} recorded sessions`}</span>
                {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
