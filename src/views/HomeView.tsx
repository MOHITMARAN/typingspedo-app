import React, { useState, useMemo } from 'react';
import { NavTab, UserProgress } from '../types';
import { CourseProgressCard } from '../components/CourseProgressCard';
import { RecentActivity } from '../components/RecentActivity';
import {
  Clock,
  Zap,
  Target,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Award,
  Compass,
  Cpu,
  TrendingUp,
  LayoutDashboard,
  GraduationCap,
  History,
  Keyboard,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HomeViewProps {
  onSelectTab: (tab: NavTab) => void;
  userProgress: UserProgress;
  onUpdateProgress?: (progress: UserProgress) => void;
}

type DashboardSectionId =
  | 'overview'
  | 'course-progress'
  | 'recent-activity';

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  userProgress,
  onUpdateProgress = () => {},
}) => {
  const { currentTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<DashboardSectionId>('overview');

  // Quick interactive hero demo state
  const demoTarget = 'TypingSpedo helps you master English and Hindi typing speed.';
  const [demoInput, setDemoInput] = useState('');
  const [demoStartTime, setDemoStartTime] = useState<number | null>(null);
  const [warmupCredited, setWarmupCredited] = useState(false);

  // Section 1: Overview Summary Calculations
  const overviewStats = useMemo(() => {
    // 1. Total Practice Time formatted
    const totalSec = userProgress.totalPracticeTime || 0;
    let formattedTime = '0m';
    if (totalSec >= 3600) {
      const hrs = (totalSec / 3600).toFixed(1);
      formattedTime = `${hrs} hrs`;
    } else if (totalSec >= 60) {
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      formattedTime = secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    } else if (totalSec > 0) {
      formattedTime = `${totalSec}s`;
    }

    // 2. Average Typing Speed (WPM) from recent typing tests
    const recentTests = userProgress.recentResults || [];
    let avgSpeed = 0;
    if (recentTests.length > 0) {
      const sumSpeed = recentTests.reduce((acc, curr) => acc + curr.netWpm, 0);
      avgSpeed = Math.round(sumSpeed / recentTests.length);
    } else if (userProgress.highestWpmEnglish > 0 || userProgress.highestWpmHindi > 0) {
      avgSpeed = Math.max(userProgress.highestWpmEnglish, userProgress.highestWpmHindi);
    }

    // 3. Average Accuracy (%) from recent typing tests
    let avgAcc = 0;
    if (recentTests.length > 0) {
      const sumAcc = recentTests.reduce((acc, curr) => acc + curr.accuracy, 0);
      avgAcc = Math.round((sumAcc / recentTests.length) * 10) / 10;
    }

    // 4. Lessons Completed
    const completedEnglish = Object.values(userProgress.beginnerScores || {}).filter(
      (s) => s.passed
    ).length;
    const completedOther = (userProgress.completedLessons || []).filter(
      (id) => !id.startsWith('eng-beg-')
    ).length;
    const totalCompletedLessons = Math.max(
      userProgress.completedLessons?.length || 0,
      completedEnglish + completedOther
    );

    return {
      formattedTime,
      avgSpeed,
      avgAcc,
      totalCompletedLessons,
      bestSpeed: Math.max(userProgress.highestWpmEnglish || 0, userProgress.highestWpmHindi || 0),
    };
  }, [userProgress]);

  // Section Navigation Links
  const navSections: { id: DashboardSectionId; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'course-progress', label: 'Course Progress', icon: GraduationCap },
    { id: 'recent-activity', label: 'Recent Activity', icon: History },
  ];

  const scrollToSection = (id: DashboardSectionId) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!demoStartTime) setDemoStartTime(Date.now());
    setDemoInput(e.target.value);
  };

  const demoElapsedSec = demoStartTime ? Math.max(1, (Date.now() - demoStartTime) / 1000) : 0;
  const demoWpm = demoElapsedSec > 0 ? Math.round((demoInput.length / 5) / (demoElapsedSec / 60)) : 0;

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10 max-w-7xl mx-auto">
      {/* ============================================================== */}
      {/* DASHBOARD SUB-NAVIGATION BAR (Sticky, clean, zero mobile wrap) */}
      {/* ============================================================== */}
      <div className="sticky top-16 z-30 bg-slate-50/95 dark:bg-[#090d16]/95 backdrop-blur-md py-2.5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Desktop/Tablet Segmented Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs text-xs font-semibold">
            {navSections.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${currentTheme.primaryColor}15`,
                          color: currentTheme.primaryColor,
                          borderColor: `${currentTheme.primaryColor}40`,
                        }
                      : undefined
                  }
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'shadow-xs font-bold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Select Dropdown (Zero horizontal scroll on small screens) */}
          <div className="md:hidden w-full">
            <div className="relative">
              <select
                value={activeSection}
                onChange={(e) => scrollToSection(e.target.value as DashboardSectionId)}
                className="w-full py-2.5 px-3.5 pr-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Jump to dashboard section"
              >
                <option value="overview">1. Dashboard Overview</option>
                <option value="course-progress">2. Course Progress</option>
                <option value="recent-activity">3. Recent Activity</option>
              </select>
            </div>
          </div>

          {/* Quick Primary Actions in Nav Strip */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectTab('english')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Practice Now</span>
            </button>
            <button
              onClick={() => onSelectTab('test')}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Speed Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1 – DASHBOARD OVERVIEW */}
      {/* ============================================================== */}
      <section id="overview" className="scroll-mt-28 space-y-6">
        {/* Compact Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>TypingSpedo Professional Typing Tutor</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>Hindi & English</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Master Your Typing Skills
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Welcome to your personal typing dashboard. Track your speed growth, curriculum progression, and typing examination benchmarks.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onSelectTab('english')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>English Lessons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectTab('hindi')}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <span>Hindi Lesson</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Cards Grid (Responsive 2x2 on mobile, 4-column on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Typing Practice Time */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Practice Time
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {overviewStats.formattedTime}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Active time logged
              </span>
            </div>
          </div>

          {/* Card 2: Average Typing Speed */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Average Speed
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {overviewStats.avgSpeed > 0 ? (
                  <>
                    {overviewStats.avgSpeed}{' '}
                    <span className="text-xs font-normal text-slate-400">WPM</span>
                  </>
                ) : (
                  <span className="text-slate-400 text-lg">--</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-mono tabular-nums">
                Peak: <strong className="text-slate-700 dark:text-slate-300">{overviewStats.bestSpeed} WPM</strong>
              </span>
            </div>
          </div>

          {/* Card 3: Average Accuracy */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Average Accuracy
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {overviewStats.avgAcc > 0 ? (
                  <>
                    {overviewStats.avgAcc}
                    <span className="text-xs font-normal text-slate-400">%</span>
                  </>
                ) : (
                  <span className="text-slate-400 text-lg">--</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Target: &ge;90% accuracy
              </span>
            </div>
          </div>

          {/* Card 4: Lessons Completed */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Lessons Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {overviewStats.totalCompletedLessons}{' '}
                <span className="text-xs font-normal text-slate-400">Lessons</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Curriculum progression
              </span>
            </div>
          </div>
        </div>

        {/* Compact Warmup Demo Sandbox */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-sky-600" />
              <span>Instant Warm-up Sandbox:</span>
            </span>
            <span className="font-mono tabular-nums">
              Live Speed:{' '}
              <strong className="text-sky-600 dark:text-sky-400 font-bold">{demoWpm}</strong>{' '}
              WPM
            </span>
          </div>

          <div className="text-xs sm:text-sm font-mono bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            {demoTarget}
          </div>

          <input
            type="text"
            value={demoInput}
            onChange={(e) => {
              handleDemoChange(e);
              if (e.target.value.length >= demoTarget.length && !warmupCredited) {
                setWarmupCredited(true);
              }
            }}
            placeholder="Type the sentence above to warm up your fingers..."
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />

          {demoInput.length >= demoTarget.length && (
            <div className="flex items-center justify-between pt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Great warmup! Fingers ready for practice.
              </span>
              <button
                onClick={() => onSelectTab('english')}
                className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                Go to Full Lessons →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2 – COURSE PROGRESS */}
      {/* ============================================================== */}
      <section id="course-progress" className="scroll-mt-28">
        <CourseProgressCard
          userProgress={userProgress}
          onNavigateTab={onSelectTab}
        />
      </section>

      {/* ============================================================== */}
      {/* SECTION 3 – RECENT ACTIVITY */}
      {/* ============================================================== */}
      <section id="recent-activity" className="scroll-mt-28">
        <RecentActivity
          userProgress={userProgress}
          onNavigateTab={onSelectTab}
        />
      </section>

      {/* ============================================================== */}
      {/* OFFICIAL EXAM ASSESSMENT & SPEED TEST HIGHLIGHT */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 dark:from-[#0d1629] dark:to-[#080d19] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">
              <Award className="w-4 h-4" /> Official Speed Assessment
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Test Your Typing Speed & Accuracy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Take our standardized 1-minute, 2-minute, or 5-minute typing speed test in English or Hindi. Evaluate your Net WPM, Gross Speed, and Error Rate according to official examination criteria.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
              <span>Real-Time WPM Engine</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Detailed Error Breakdown</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>SSC Qualifying Benchmark</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center space-y-4">
            <div>
              <span className="text-xs text-slate-300">Target Qualifying Speed</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono-nums mt-0.5">
                35 <span className="text-lg font-normal text-sky-400">WPM</span>
              </div>
              <span className="text-[11px] text-slate-400">at 95%+ Accuracy for Central & State Exams</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block">English Benchmark</span>
                <span className="text-xs font-bold text-white font-mono-nums">35 WPM / 10500 KDPH</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block">Hindi Benchmark</span>
                <span className="text-xs font-bold text-white font-mono-nums">30 WPM / 9000 KDPH</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('test')}
              style={{ backgroundColor: currentTheme.primaryColor }}
              className="w-full py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-xs hover:opacity-95"
            >
              <span>Take Free Speed Test Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* WHY TYPINGSPEDO & METHODOLOGY */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Designed for Real Exam & Workplace Success
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Professional touch typing architecture for high speed and muscle memory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official InScript & Remington
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Toggle between InScript (Standard SSC layout) and Remington Gail (Typewriter layout) on the fly with live key mapping instructions.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Private Progress Storage
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your test history, high scores, completed lessons, and speed progression are automatically saved safely in your browser’s localStorage.
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Zero Latency Audio Feedback
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Subtle mechanical switch audio generated directly in your browser provides immediate acoustic confirmation for every stroke.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
