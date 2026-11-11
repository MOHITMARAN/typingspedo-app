import { UserProgress, TestResult, LessonHistoryEntry, LessonScoreRecord } from '../types';

const STORAGE_KEY = 'typeshala_user_progress_v1';
const THEME_KEY = 'typeshala_theme';

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  beginnerScores: {},
  hindiScores: {},
  totalPracticeTime: 0,
  highestWpmEnglish: 0,
  highestWpmHindi: 0,
  testsCompleted: 0,
  recentResults: [],
  lessonHistory: [],
  soundEnabled: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeNumber(
  value: unknown,
  fallback: number = 0,
  min: number = 0,
  max: number = 100000000,
  clamp: boolean = false
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  if (clamp) {
    return Math.min(Math.max(value, min), max);
  }
  if (value < min || value > max) return fallback;
  return value;
}

function sanitizeString(value: unknown, fallback: string = '', maxLen: number = 200): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function sanitizeLessonScoreRecord(raw: unknown, defaultId: string): LessonScoreRecord | null {
  if (!isRecord(raw)) return null;
  const completedUnits = Array.isArray(raw.completedUnits)
    ? (raw.completedUnits.filter(u => typeof u === 'number' && Number.isInteger(u) && u >= 1 && u <= 20) as number[])
    : [];

  return {
    lessonId: sanitizeString(raw.lessonId, defaultId, 100),
    completedUnits,
    wpm: sanitizeNumber(raw.wpm, 0, 0, 400, true),
    netWpm: sanitizeNumber(raw.netWpm, 0, 0, 400, true),
    accuracy: sanitizeNumber(raw.accuracy, 0, 0, 100, true),
    errors: sanitizeNumber(raw.errors, 0, 0, 10000, true),
    stars: Math.floor(sanitizeNumber(raw.stars, 0, 0, 5, true)),
    passed: Boolean(raw.passed),
    lastUpdated: typeof raw.lastUpdated === 'string' ? sanitizeString(raw.lastUpdated, '', 50) : undefined,
  };
}

function sanitizeScoresMap(raw: unknown): Record<string, LessonScoreRecord> {
  if (!isRecord(raw)) return {};
  const clean: Record<string, LessonScoreRecord> = {};
  for (const key of Object.keys(raw)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (typeof key !== 'string' || key.length > 100) continue;
    const sanitized = sanitizeLessonScoreRecord(raw[key], key);
    if (sanitized) {
      clean[key] = sanitized;
    }
  }
  return clean;
}

function sanitizeRecentResults(raw: unknown): TestResult[] {
  if (!Array.isArray(raw)) return [];
  const clean: TestResult[] = [];
  for (const item of raw.slice(0, 50)) {
    if (!isRecord(item)) continue;
    const lang = item.language === 'hindi' ? 'hindi' : 'english';
    const diff = item.difficulty === 'hard' || item.difficulty === 'medium' ? item.difficulty : 'easy';
    const layout = item.layout === 'inscript' || item.layout === 'remington' || item.layout === 'phonetic' ? item.layout : undefined;
    clean.push({
      id: sanitizeString(item.id, String(Date.now()), 100),
      date: sanitizeString(item.date, new Date().toLocaleDateString(), 50),
      language: lang,
      layout,
      duration: sanitizeNumber(item.duration, 60, 10, 3600, false),
      wpm: sanitizeNumber(item.wpm, 0, 0, 400, true),
      netWpm: sanitizeNumber(item.netWpm, 0, 0, 400, true),
      accuracy: sanitizeNumber(item.accuracy, 0, 0, 100, true),
      errors: sanitizeNumber(item.errors, 0, 0, 10000, true),
      difficulty: diff,
    });
  }
  return clean;
}

function sanitizeLessonHistory(raw: unknown): LessonHistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  const clean: LessonHistoryEntry[] = [];
  for (const item of raw.slice(0, 100)) {
    if (!isRecord(item)) continue;
    clean.push({
      id: sanitizeString(item.id, String(Date.now()), 100),
      lessonId: sanitizeString(item.lessonId, '', 100),
      lessonNumber: sanitizeNumber(item.lessonNumber, 1, 1, 100),
      lessonTitle: sanitizeString(item.lessonTitle, '', 100),
      wpm: sanitizeNumber(item.wpm, 0, 0, 400),
      netWpm: sanitizeNumber(item.netWpm, 0, 0, 400),
      accuracy: sanitizeNumber(item.accuracy, 0, 0, 100),
      errors: sanitizeNumber(item.errors, 0, 0, 10000),
      stars: Math.floor(sanitizeNumber(item.stars, 0, 0, 5)),
      passed: Boolean(item.passed),
      timestamp: sanitizeNumber(item.timestamp, Date.now(), 0, 4102444800000),
      date: sanitizeString(item.date, new Date().toLocaleDateString(), 50),
    });
  }
  return clean;
}

export function sanitizeUserProgress(raw: unknown): UserProgress {
  if (!isRecord(raw)) return { ...DEFAULT_PROGRESS };

  const completedLessons = Array.isArray(raw.completedLessons)
    ? (raw.completedLessons
        .filter(id => typeof id === 'string' && id.trim().length > 0 && id.length <= 100)
        .map(id => id.trim()) as string[])
    : [];

  return {
    completedLessons: Array.from(new Set(completedLessons)),
    beginnerScores: sanitizeScoresMap(raw.beginnerScores),
    hindiScores: sanitizeScoresMap(raw.hindiScores),
    totalPracticeTime: sanitizeNumber(raw.totalPracticeTime, 0, 0, 100000000),
    highestWpmEnglish: sanitizeNumber(raw.highestWpmEnglish, 0, 0, 400),
    highestWpmHindi: sanitizeNumber(raw.highestWpmHindi, 0, 0, 400),
    testsCompleted: sanitizeNumber(raw.testsCompleted, 0, 0, 1000000),
    recentResults: sanitizeRecentResults(raw.recentResults),
    lessonHistory: sanitizeLessonHistory(raw.lessonHistory),
    soundEnabled: typeof raw.soundEnabled === 'boolean' ? raw.soundEnabled : true,
  };
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    return sanitizeUserProgress(parsed);
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}


export function resetCourseProgress(): UserProgress {
  const current = loadUserProgress();
  const updated: UserProgress = {
    ...current,
    completedLessons: [],
    beginnerScores: {},
    hindiScores: {},
    lessonHistory: [],
  };
  saveUserProgress(updated);
  return updated;
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function calculateStars(accuracy: number): number {
  if (accuracy >= 98) return 5;
  if (accuracy >= 95) return 4;
  if (accuracy >= 90) return 3;
  if (accuracy >= 80) return 2;
  return 1;
}

export function isLessonUnlocked(_lessonNumber: number, _progress: UserProgress): { unlocked: boolean; reason?: string } {
  // All English lessons are unlocked so learners can practice any lesson freely
  return { unlocked: true };
}

export function recordBeginnerUnitProgress(
  lessonId: string,
  unitNumber: number,
  stats?: { wpm: number; netWpm: number; accuracy: number; errors: number; timeElapsed?: number }
): UserProgress {
  const current = loadUserProgress();
  const existingScores = current.beginnerScores || {};
  const currentLessonScore = existingScores[lessonId] || {
    lessonId,
    completedUnits: [],
    wpm: 0,
    netWpm: 0,
    accuracy: 0,
    errors: 0,
    stars: 0,
    passed: false,
  };

  const completedUnits = Array.from(new Set([...currentLessonScore.completedUnits, unitNumber]));
  const allUnitsDone = completedUnits.length >= 3;
  const passed = currentLessonScore.passed || allUnitsDone;

  const earnedStars = stats ? calculateStars(stats.accuracy) : 0;
  const bestStars = Math.max(currentLessonScore.stars, earnedStars);

  const updatedScores = {
    ...existingScores,
    [lessonId]: {
      ...currentLessonScore,
      completedUnits,
      passed,
      wpm: stats ? Math.max(currentLessonScore.wpm, stats.wpm) : currentLessonScore.wpm,
      netWpm: stats ? Math.max(currentLessonScore.netWpm, stats.netWpm) : currentLessonScore.netWpm,
      accuracy: stats ? Math.max(currentLessonScore.accuracy, stats.accuracy) : currentLessonScore.accuracy,
      errors: stats ? stats.errors : currentLessonScore.errors,
      stars: bestStars,
      lastUpdated: new Date().toISOString(),
    },
  };

  const completedLessons = passed
    ? Array.from(new Set([...current.completedLessons, lessonId]))
    : current.completedLessons;

  const updated: UserProgress = {
    ...current,
    beginnerScores: updatedScores,
    completedLessons,
    highestWpmEnglish: stats ? Math.max(current.highestWpmEnglish, stats.netWpm) : current.highestWpmEnglish,
    totalPracticeTime: stats?.timeElapsed ? current.totalPracticeTime + stats.timeElapsed : current.totalPracticeTime,
  };

  saveUserProgress(updated);
  return updated;
}

export function recordBeginnerChallengeScore(
  lessonId: string,
  stats: { wpm: number; netWpm: number; accuracy: number; errors: number; timeElapsed: number }
): { updatedProgress: UserProgress; passed: boolean; stars: number } {
  const current = loadUserProgress();
  const existingScores = current.beginnerScores || {};
  const currentLessonScore = existingScores[lessonId] || {
    lessonId,
    completedUnits: [],
    wpm: 0,
    netWpm: 0,
    accuracy: 0,
    errors: 0,
    stars: 0,
    passed: false,
  };

  const stars = calculateStars(stats.accuracy);
  const passed = true; // Lesson is passed upon finishing all units
  const completedUnits = Array.from(new Set([...currentLessonScore.completedUnits, 1, 2, 3]));

  // Keep best score
  const isBetter = stats.accuracy >= currentLessonScore.accuracy;
  const bestWpm = Math.max(currentLessonScore.wpm, stats.wpm);
  const bestNetWpm = Math.max(currentLessonScore.netWpm, stats.netWpm);
  const bestAccuracy = Math.max(currentLessonScore.accuracy, stats.accuracy);
  const bestStars = Math.max(currentLessonScore.stars, stars);
  const bestPassed = true;

  const updatedScores = {
    ...existingScores,
    [lessonId]: {
      lessonId,
      completedUnits,
      wpm: isBetter ? stats.wpm : bestWpm,
      netWpm: isBetter ? stats.netWpm : bestNetWpm,
      accuracy: bestAccuracy,
      errors: stats.errors,
      stars: bestStars,
      passed: bestPassed,
      lastUpdated: new Date().toISOString(),
    },
  };

  const completedLessons = Array.from(new Set([...current.completedLessons, lessonId]));

  const lessonMatch = lessonId.match(/(\d+)$/);
  const lessonNumber = lessonMatch ? parseInt(lessonMatch[1], 10) : 1;
  const now = new Date();
  const historyEntry: LessonHistoryEntry = {
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    lessonId,
    lessonNumber,
    lessonTitle: `Lesson ${lessonNumber}`,
    wpm: stats.wpm,
    netWpm: stats.netWpm,
    accuracy: stats.accuracy,
    errors: stats.errors,
    stars,
    passed,
    timestamp: now.getTime(),
    date: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };

  const existingHistory = current.lessonHistory || [];
  const updatedHistory = [...existingHistory, historyEntry];

  const updated: UserProgress = {
    ...current,
    beginnerScores: updatedScores,
    completedLessons,
    lessonHistory: updatedHistory,
    highestWpmEnglish: Math.max(current.highestWpmEnglish, stats.netWpm),
    totalPracticeTime: current.totalPracticeTime + stats.timeElapsed,
  };

  saveUserProgress(updated);
  return { updatedProgress: updated, passed, stars };
}

export function recordHindiUnitProgress(
  lessonId: string,
  unitNumber: number,
  stats?: {
    wpm: number;
    netWpm: number;
    accuracy: number;
    errors: number;
    timeElapsed: number;
  }
): UserProgress {
  const current = loadUserProgress();
  const existingScores = current.hindiScores || {};
  const currentLessonScore = existingScores[lessonId] || {
    lessonId,
    completedUnits: [],
    wpm: 0,
    netWpm: 0,
    accuracy: 0,
    errors: 0,
    stars: 0,
    passed: false,
  };

  const completedUnits = Array.from(
    new Set([...(currentLessonScore.completedUnits || []), unitNumber])
  ).sort((a, b) => a - b);

  const updatedScore: LessonScoreRecord = {
    ...currentLessonScore,
    completedUnits,
    lastUpdated: new Date().toISOString(),
    ...(stats
      ? {
          wpm: Math.max(currentLessonScore.wpm || 0, stats.wpm),
          netWpm: Math.max(currentLessonScore.netWpm || 0, stats.netWpm),
          accuracy: Math.max(currentLessonScore.accuracy || 0, stats.accuracy),
          errors: stats.errors,
        }
      : {}),
  };

  const updated: UserProgress = {
    ...current,
    hindiScores: {
      ...existingScores,
      [lessonId]: updatedScore,
    },
    totalPracticeTime: stats ? current.totalPracticeTime + stats.timeElapsed : current.totalPracticeTime,
    highestWpmHindi: stats ? Math.max(current.highestWpmHindi, stats.netWpm) : current.highestWpmHindi,
  };

  saveUserProgress(updated);
  return updated;
}

export function recordHindiLessonScore(
  lessonId: string,
  lessonTitle: string,
  stats: {
    wpm: number;
    netWpm: number;
    accuracy: number;
    errors: number;
    timeElapsed: number;
  }
): { updatedProgress: UserProgress; passed: boolean; stars: number } {
  const current = loadUserProgress();
  const existingScores = current.hindiScores || {};
  const currentLessonScore = existingScores[lessonId] || {
    lessonId,
    completedUnits: [],
    wpm: 0,
    netWpm: 0,
    accuracy: 0,
    errors: 0,
    stars: 0,
    passed: false,
  };

  const completedUnits = Array.from(
    new Set([...(currentLessonScore.completedUnits || []), 1, 2])
  ).sort((a, b) => a - b);

  const stars = calculateStars(stats.accuracy);
  const bestStars = Math.max(currentLessonScore.stars || 0, stars);
  const passed = stats.accuracy >= 80;

  const updatedScore: LessonScoreRecord = {
    lessonId,
    completedUnits,
    wpm: Math.max(currentLessonScore.wpm || 0, stats.wpm),
    netWpm: Math.max(currentLessonScore.netWpm || 0, stats.netWpm),
    accuracy: Math.max(currentLessonScore.accuracy || 0, stats.accuracy),
    errors: stats.errors,
    stars: bestStars,
    passed: currentLessonScore.passed || passed,
    lastUpdated: new Date().toISOString(),
  };

  const updatedScores = {
    ...existingScores,
    [lessonId]: updatedScore,
  };

  const completedLessons = Array.from(new Set([...current.completedLessons, lessonId]));

  const now = new Date();
  const historyEntry: LessonHistoryEntry = {
    id: `hin-${lessonId}-${now.getTime()}`,
    lessonId,
    lessonNumber: 0,
    lessonTitle,
    wpm: stats.wpm,
    netWpm: stats.netWpm,
    accuracy: stats.accuracy,
    errors: stats.errors,
    stars,
    passed,
    timestamp: now.getTime(),
    date: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };

  const existingHistory = current.lessonHistory || [];
  const updatedHistory = [...existingHistory, historyEntry];

  const updated: UserProgress = {
    ...current,
    hindiScores: updatedScores,
    completedLessons,
    lessonHistory: updatedHistory,
    highestWpmHindi: Math.max(current.highestWpmHindi, stats.netWpm),
    totalPracticeTime: current.totalPracticeTime + (stats.timeElapsed || 0),
  };

  saveUserProgress(updated);
  return { updatedProgress: updated, passed, stars };
}

export function markLessonCompleted(
  lessonId: string,
  wpm: number,
  language: 'english' | 'hindi',
  stats?: { accuracy?: number; errors?: number; timeElapsed?: number; lessonTitle?: string }
): UserProgress {
  const current = loadUserProgress();
  const completedLessons = Array.from(new Set([...current.completedLessons, lessonId]));
  const accuracy = stats?.accuracy ?? 90;
  const stars = calculateStars(accuracy);

  let updatedHindiScores = current.hindiScores || {};
  if (language === 'hindi') {
    const existing = updatedHindiScores[lessonId];
    updatedHindiScores = {
      ...updatedHindiScores,
      [lessonId]: {
        lessonId,
        completedUnits: [1],
        wpm: Math.max(existing?.wpm || 0, wpm),
        netWpm: Math.max(existing?.netWpm || 0, wpm),
        accuracy: Math.max(existing?.accuracy || 0, accuracy),
        errors: stats?.errors ?? (existing?.errors || 0),
        stars: Math.max(existing?.stars || 0, stars),
        passed: true,
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  const updated: UserProgress = {
    ...current,
    completedLessons,
    hindiScores: updatedHindiScores,
    highestWpmEnglish: language === 'english' ? Math.max(current.highestWpmEnglish, wpm) : current.highestWpmEnglish,
    highestWpmHindi: language === 'hindi' ? Math.max(current.highestWpmHindi, wpm) : current.highestWpmHindi,
    totalPracticeTime: current.totalPracticeTime + (stats?.timeElapsed || 0),
  };

  saveUserProgress(updated);
  return updated;
}

export function recordTestResult(result: TestResult): UserProgress {
  const current = loadUserProgress();
  const recentResults = [result, ...current.recentResults].slice(0, 20); // Keep last 20

  const updated: UserProgress = {
    ...current,
    testsCompleted: current.testsCompleted + 1,
    recentResults,
    highestWpmEnglish: result.language === 'english' ? Math.max(current.highestWpmEnglish, result.netWpm) : current.highestWpmEnglish,
    highestWpmHindi: result.language === 'hindi' ? Math.max(current.highestWpmHindi, result.netWpm) : current.highestWpmHindi,
  };

  saveUserProgress(updated);
  return updated;
}

export function getThemePreference(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to light mode (as requested: "White background with navy blue and light blue accents")
    return 'light';
  } catch {
    return 'light';
  }
}

export function setThemePreference(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Failed to set theme in localStorage', err);
  }
}

