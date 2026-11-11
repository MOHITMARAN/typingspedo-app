import React, { useState } from 'react';
import { TEST_PARAGRAPHS, TestParagraph } from '../data/typingTests';
import { Language, HindiLayout, TypingStats, UserProgress, TestResult } from '../types';
import { TypingEngine } from '../components/TypingEngine';
import { recordTestResult } from '../utils/storage';
import { Award, Timer, Target, Zap, RotateCcw, CheckCircle, BarChart3, ShieldCheck, Shuffle, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { playKeyClick, getSavedSoundPreference } from '../utils/sound';

interface TypingTestViewProps {
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

export const TypingTestView: React.FC<TypingTestViewProps> = ({
  userProgress,
  onUpdateProgress,
}) => {
  const { currentTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [selectedHindiLayout, setSelectedHindiLayout] = useState<HindiLayout>('inscript');
  const [durationSeconds, setDurationSeconds] = useState<number>(60);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedParagraphId, setSelectedParagraphId] = useState<string>('test-eng-med');
  const [testState, setTestState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  const handleSelectHindiLayout = (layout: HindiLayout) => {
    setSelectedHindiLayout(layout);
    try {
      playKeyClick(getSavedSoundPreference());
    } catch {
      // safe fallback
    }
  };

  // Filter available test paragraphs by language and difficulty
  const availableParagraphs = TEST_PARAGRAPHS.filter(
    (p) => p.language === selectedLanguage && p.difficulty === difficulty
  );

  // Active paragraph resolution
  const activeParagraph =
    availableParagraphs.find((p) => p.id === selectedParagraphId) ||
    availableParagraphs[0] ||
    TEST_PARAGRAPHS[0];

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    const matching = TEST_PARAGRAPHS.filter(
      (p) => p.language === lang && p.difficulty === difficulty
    );
    if (matching.length > 0) {
      setSelectedParagraphId(matching[0].id);
    }
    try {
      playKeyClick(getSavedSoundPreference());
    } catch {
      // safe fallback
    }
  };

  const handleDifficultyChange = (diff: 'easy' | 'medium' | 'hard') => {
    setDifficulty(diff);
    const matching = TEST_PARAGRAPHS.filter(
      (p) => p.language === selectedLanguage && p.difficulty === diff
    );
    if (matching.length > 0) {
      setSelectedParagraphId(matching[0].id);
    }
    try {
      playKeyClick(getSavedSoundPreference());
    } catch {
      // safe fallback
    }
  };

  const handleSelectParagraph = (id: string) => {
    setSelectedParagraphId(id);
    try {
      playKeyClick(getSavedSoundPreference());
    } catch {
      // safe fallback
    }
  };

  const handleShuffleParagraph = () => {
    if (availableParagraphs.length <= 1) return;
    const others = availableParagraphs.filter((p) => p.id !== activeParagraph.id);
    const randomPick = others[Math.floor(Math.random() * others.length)];
    if (randomPick) {
      setSelectedParagraphId(randomPick.id);
      try {
        playKeyClick(getSavedSoundPreference());
      } catch {
        // safe fallback
      }
    }
  };

  const handleStartTest = () => {
    setTestState('running');
    setLastResult(null);
  };

  const handleTestComplete = (stats: TypingStats) => {
    const result: TestResult = {
      id: `test-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      language: selectedLanguage,
      layout: selectedLanguage === 'hindi' ? selectedHindiLayout : undefined,
      duration: durationSeconds,
      wpm: stats.wpm,
      netWpm: stats.netWpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      difficulty,
    };

    setLastResult(result);
    setTestState('finished');
    const updated = recordTestResult(result);
    onUpdateProgress(updated);
  };

  const isQualifying = lastResult
    ? lastResult.language === 'english'
      ? lastResult.netWpm >= 35 && lastResult.accuracy >= 90
      : lastResult.netWpm >= 30 && lastResult.accuracy >= 90
    : false;

  return (
    <div className="py-6 sm:py-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          <Award className="w-4 h-4" /> Certification & Exam Benchmark
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Typing Speed Assessment Test
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Test your Net Words Per Minute and accuracy against official SSC, High Court, and Civil Services standards.
        </p>
      </div>

      {/* Test Setup Controls */}
      {testState !== 'running' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Language */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                1. Language
              </label>
              <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 gap-1.5 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('english')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 active:scale-95 active:translate-y-0.5 transition-all duration-150 cursor-pointer select-none ${
                    selectedLanguage === 'english'
                      ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-700 dark:to-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b hover:bg-slate-50'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('hindi')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 active:scale-95 active:translate-y-0.5 transition-all duration-150 cursor-pointer select-none font-hindi ${
                    selectedLanguage === 'hindi'
                      ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-700 dark:to-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b hover:bg-slate-50'
                  }`}
                >
                  Hindi (हिंदी)
                </button>
              </div>

              {/* Hindi Layout Sub-Option */}
              {selectedLanguage === 'hindi' && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    Hindi Layout (लेआउट चुनें):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'inscript' as HindiLayout, label: 'InScript', badge: 'SSC', sub: 'इन्स्क्रिप्ट' },
                        { id: 'remington' as HindiLayout, label: 'Remington', badge: 'Court', sub: 'रेमिंगटन गेल' },
                        { id: 'phonetic' as HindiLayout, label: 'Phonetic', badge: 'Easy', sub: 'फोनेटिक' },
                      ] as const
                    ).map((layout) => {
                      const isSelected = selectedHindiLayout === layout.id;
                      return (
                        <button
                          key={layout.id}
                          type="button"
                          onClick={() => handleSelectHindiLayout(layout.id)}
                          className={`p-2 rounded-xl text-left border-2 active:scale-95 active:translate-y-0.5 transition-all duration-150 cursor-pointer select-none ${
                            isSelected
                              ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-800 dark:to-sky-950/40 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b-2 text-sky-900 dark:text-sky-200 shadow-xs'
                              : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b-2 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{layout.label}</span>
                            <span
                              className={`text-[9px] font-semibold px-1 py-0.2 rounded ${
                                isSelected
                                  ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                              }`}
                            >
                              {layout.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-hindi mt-0.5">
                            {layout.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                2. Test Duration
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                {[
                  { sec: 60, label: '1 Min' },
                  { sec: 120, label: '2 Mins' },
                  { sec: 300, label: '5 Mins' },
                ].map((d) => (
                  <button
                    key={d.sec}
                    type="button"
                    onClick={() => {
                      setDurationSeconds(d.sec);
                      try {
                        playKeyClick(getSavedSoundPreference());
                      } catch {
                        // safe fallback
                      }
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border-2 active:scale-95 active:translate-y-0.5 transition-all duration-150 cursor-pointer select-none ${
                      durationSeconds === d.sec
                        ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-700 dark:to-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b hover:bg-slate-50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                3. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => handleDifficultyChange(diff)}
                    className={`py-2 text-xs font-bold capitalize rounded-xl border-2 active:scale-95 active:translate-y-0.5 transition-all duration-150 cursor-pointer select-none ${
                      difficulty === diff
                        ? 'bg-gradient-to-b from-white to-sky-50 dark:from-slate-700 dark:to-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400 border-b-[3px] active:border-b shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b hover:bg-slate-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Select Test Passage (विद्यार्थी अपनी पसंद से पैराग्राफ चुन सकते हैं) */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  4. Choose Passage ({availableParagraphs.length} Available in {difficulty.toUpperCase()})
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your preferred passage from the list below or click shuffle to practice randomly.
                </p>
              </div>

              <button
                type="button"
                onClick={handleShuffleParagraph}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 border-b-[3px] border-b-slate-300 dark:border-b-slate-900 active:border-b active:translate-y-0.5 active:scale-95 transition-all cursor-pointer select-none"
                title="Randomly pick another paragraph"
              >
                <Shuffle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Shuffle Passage</span>
              </button>
            </div>

            {/* Paragraph Choice Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {availableParagraphs.map((para, index) => {
                const isSelected = activeParagraph.id === para.id;
                return (
                  <button
                    key={para.id}
                    type="button"
                    onClick={() => handleSelectParagraph(para.id)}
                    className={`text-left p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none active:scale-98 active:translate-y-0.5 flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-b from-white to-sky-50/80 dark:from-slate-800 dark:to-sky-950/40 border-sky-500 dark:border-sky-400 border-b-[4px] active:border-b-2 shadow-md shadow-sky-500/10'
                        : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200 dark:border-slate-700 border-b-[4px] border-b-slate-300 dark:border-b-slate-900 active:border-b-2'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Passage {index + 1}
                        </span>
                        {para.category && (
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                            {para.category}
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-xs font-bold leading-tight line-clamp-1 ${
                          isSelected ? 'text-sky-950 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {para.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {para.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span className="truncate max-w-[140px]">{para.source}</span>
                      <span className="font-mono-nums font-semibold shrink-0">
                        {para.wordCount ? `${para.wordCount} words` : `${para.text.split(' ').length} words`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Paragraph Live Preview Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Active Text Preview: <span className="text-sky-700 dark:text-sky-300">"{activeParagraph.title}"</span>
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 uppercase">
                  {difficulty} Level
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans line-clamp-3">
                {activeParagraph.text}
              </p>
            </div>
          </div>

          {/* Launch CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Selected Passage:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                "{activeParagraph.title}"
              </strong>{' '}
              · <span className="text-sky-600 dark:text-sky-400 font-semibold">{activeParagraph.category || activeParagraph.source}</span>
            </div>

            <button
              onClick={() => {
                try {
                  playKeyClick(getSavedSoundPreference());
                } catch {
                  // safe fallback
                }
                handleStartTest();
              }}
              style={{ backgroundColor: currentTheme.primaryColor }}
              className="w-full sm:w-auto px-8 py-3 text-white font-bold text-sm rounded-xl border-2 border-white/20 border-b-black/30 border-b-[4px] active:border-b-2 active:scale-95 active:translate-y-0.5 shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer select-none hover:opacity-95"
            >
              <Timer className="w-4 h-4" /> Start {durationSeconds / 60}-Minute Test
            </button>
          </div>
        </div>
      )}

      {/* Running Test Interface */}
      {testState === 'running' && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
          <TypingEngine
            key={`test-${activeParagraph.id}-${durationSeconds}`}
            targetText={activeParagraph.text}
            language={selectedLanguage}
            hindiLayout={selectedHindiLayout}
            timeLimit={durationSeconds}
            isTestMode={true}
            title={`${selectedLanguage === 'english' ? 'English' : 'Hindi'} Typing Assessment (${durationSeconds}s)`}
            subtitle={`Passage: ${activeParagraph.title} · Difficulty: ${difficulty}`}
            onComplete={handleTestComplete}
          />
        </div>
      )}

      {/* Scorecard Display (Finished) */}
      {testState === 'finished' && lastResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-md space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="text-center sm:text-left">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Official Scorecard
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Assessment Results
              </h2>
            </div>

            {/* Qualifying Status Badge */}
            <div
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                isQualifying
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}
            >
              {isQualifying ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Exam Qualifying Grade Achieved!</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Practice Target: 35 WPM / 90% Acc</span>
                </>
              )}
            </div>
          </div>

          {/* Metric Big Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 rounded-2xl text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Net Speed</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-700 dark:text-sky-300 font-mono-nums mt-1">
                {lastResult.netWpm}
              </div>
              <span className="text-[11px] text-slate-400">WPM</span>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-2xl text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Accuracy</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono-nums mt-1">
                {lastResult.accuracy}%
              </div>
              <span className="text-[11px] text-slate-400">Keystroke Precision</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Gross Speed</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-200 font-mono-nums mt-1">
                {lastResult.wpm}
              </div>
              <span className="text-[11px] text-slate-400">Raw WPM</span>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 rounded-2xl text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Errors</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 font-mono-nums mt-1">
                {lastResult.errors}
              </div>
              <span className="text-[11px] text-slate-400">Mistakes Made</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStartTest}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" /> Retake Test
            </button>
            <button
              onClick={() => setTestState('idle')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm"
            >
              Change Test Options
            </button>
          </div>
        </div>
      )}

      {/* Test History Leaderboard */}
      {userProgress.recentResults.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Recent Test History ({userProgress.recentResults.length})
            </h3>
            <span className="text-xs text-slate-400">Saved in browser</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Net WPM</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Errors</th>
                  <th className="py-2.5 px-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userProgress.recentResults.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-slate-500">{item.date}</td>
                    <td className="py-2.5 px-3 capitalize font-medium text-slate-800 dark:text-slate-200">
                      {item.language} {item.layout ? `(${item.layout})` : ''}
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums">{item.duration}s</td>
                    <td className="py-2.5 px-3 font-mono-nums font-bold text-sky-600 dark:text-sky-400">
                      {item.netWpm} WPM
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.accuracy}%
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums text-slate-500">{item.errors}</td>
                    <td className="py-2.5 px-3">
                      {item.netWpm >= 35 ? (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Qualified
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">Developing</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
