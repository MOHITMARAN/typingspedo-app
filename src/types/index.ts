export type Language = 'english' | 'hindi';

export type HindiLayout = 'inscript' | 'remington' | 'phonetic';

export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export type HindiCategory =
  | 'all'
  | 'inscript-course'
  | 'speed-drills'
  | 'vowels'
  | 'consonants'
  | 'matras'
  | 'words'
  | 'paragraphs';

export interface LessonUnit {
  id: string;
  unitNumber: number;
  name: string;
  instruction: string;
  content: string;
  targetWpm?: number;
  minAccuracyToPass?: number;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  language: Language;
  level?: EnglishLevel;
  hindiCategory?: HindiCategory;
  layout?: HindiLayout;
  content: string;
  targetWpm?: number;
  units?: LessonUnit[];
}

export interface TypingStats {
  wpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  totalKeystrokes: number;
  timeElapsed: number; // in seconds
  completed: boolean;
}

export interface TestResult {
  id: string;
  date: string;
  language: Language;
  layout?: HindiLayout;
  duration: number; // in seconds
  wpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonScoreRecord {
  lessonId: string;
  completedUnits: number[]; // e.g. [1, 2, 3]
  wpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  stars: number; // 0 to 5
  passed: boolean; // accuracy >= 90% (or completed for Lesson 1)
  lastUpdated?: string;
}

export interface LessonHistoryEntry {
  id: string;
  lessonId: string;
  lessonNumber: number;
  lessonTitle: string;
  wpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  stars: number;
  passed: boolean;
  timestamp: number;
  date: string;
}

export interface UserProgress {
  completedLessons: string[];
  beginnerScores?: Record<string, LessonScoreRecord>;
  hindiScores?: Record<string, LessonScoreRecord>;
  lessonHistory?: LessonHistoryEntry[];
  totalPracticeTime: number; // in seconds
  highestWpmEnglish: number;
  highestWpmHindi: number;
  testsCompleted: number;
  recentResults: TestResult[];
  soundEnabled: boolean;
}

export type NavTab = 'home' | 'english' | 'hindi' | 'test' | 'about' | 'privacy' | 'terms';

