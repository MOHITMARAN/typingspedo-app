import test from 'node:test';
import assert from 'node:assert';
import { sanitizeUserProgress, loadUserProgress } from './storage';

test('LocalStorage Security & Schema Sanitization Validation', async (t) => {
  await t.test('Falls back safely when input is not a record object', () => {
    assert.deepStrictEqual(sanitizeUserProgress(null).completedLessons, []);
    assert.deepStrictEqual(sanitizeUserProgress(undefined).totalPracticeTime, 0);
    assert.deepStrictEqual(sanitizeUserProgress('corrupted string').highestWpmEnglish, 0);
    assert.deepStrictEqual(sanitizeUserProgress(12345).testsCompleted, 0);
    assert.deepStrictEqual(sanitizeUserProgress(true).soundEnabled, true);
    assert.deepStrictEqual(sanitizeUserProgress(['array', 'injection']).completedLessons, []);
  });

  await t.test('Guards against prototype pollution attempts', () => {
    const maliciousPayload = JSON.parse(`{
      "__proto__": { "polluted": true },
      "constructor": { "prototype": { "isAdmin": true } },
      "completedLessons": ["lesson-1"],
      "beginnerScores": {
        "__proto__": { "wpm": 999 },
        "lesson-1": { "wpm": 45, "accuracy": 96, "stars": 4, "passed": true }
      }
    }`);

    const clean = sanitizeUserProgress(maliciousPayload);
    assert.strictEqual((Object.prototype as unknown as Record<string, unknown>).polluted, undefined);
    assert.strictEqual((Object.prototype as unknown as Record<string, unknown>).isAdmin, undefined);
    assert.strictEqual(Object.hasOwn(clean.beginnerScores || {}, '__proto__'), false);
    assert.strictEqual(clean.completedLessons.length, 1);
    assert.strictEqual(clean.completedLessons[0], 'lesson-1');
  });

  await t.test('Sanitizes out-of-bounds, NaN, and Infinity numeric metrics', () => {
    const corruptedPayload = {
      totalPracticeTime: -500,
      highestWpmEnglish: NaN,
      highestWpmHindi: Infinity,
      testsCompleted: -10,
      beginnerScores: {
        'lesson-1': {
          lessonId: 'lesson-1',
          completedUnits: [1, 2, 'invalid' as unknown as number, -4],
          wpm: 9999, // Should be clamped to 400
          netWpm: -50, // Should be clamped to 0
          accuracy: 150, // Should be clamped to 100
          errors: NaN, // Should fallback to 0
          stars: 8, // Should be clamped to 5
          passed: 'yes' as unknown as boolean, // Should be converted to boolean true
        },
      },
    };

    const clean = sanitizeUserProgress(corruptedPayload);
    assert.strictEqual(clean.totalPracticeTime, 0);
    assert.strictEqual(clean.highestWpmEnglish, 0);
    assert.strictEqual(clean.highestWpmHindi, 0);
    assert.strictEqual(clean.testsCompleted, 0);

    const score = clean.beginnerScores ? clean.beginnerScores['lesson-1'] : undefined;
    assert.ok(score);
    assert.deepStrictEqual(score.completedUnits, [1, 2]);
    assert.strictEqual(score.wpm, 400);
    assert.strictEqual(score.netWpm, 0);
    assert.strictEqual(score.accuracy, 100);
    assert.strictEqual(score.errors, 0);
    assert.strictEqual(score.stars, 5);
    assert.strictEqual(score.passed, true);
  });

  await t.test('Sanitizes recentResults and lessonHistory arrays', () => {
    const raw = {
      recentResults: [
        {
          id: 'valid-test-1',
          language: 'hindi',
          difficulty: 'medium',
          duration: 120,
          wpm: 35,
          netWpm: 32,
          accuracy: 94,
          errors: 3,
        },
        null, // Should be dropped
        'corrupted string', // Should be dropped
        {
          id: 'invalid-diff',
          difficulty: 'extreme_hacked', // Should normalize to easy
          language: 'russian', // Should normalize to english
          duration: -5,
        },
      ],
      lessonHistory: [
        {
          id: 'hist-1',
          lessonId: 'lesson-1',
          lessonNumber: 1,
          lessonTitle: 'Home Row',
          wpm: 28,
          netWpm: 25,
          accuracy: 92,
          errors: 4,
          stars: 3,
          passed: true,
          timestamp: 1700000000000,
          date: '11/10/2026',
        },
      ],
    };

    const clean = sanitizeUserProgress(raw);
    assert.strictEqual(clean.recentResults.length, 2);
    assert.strictEqual(clean.recentResults[0].language, 'hindi');
    assert.strictEqual(clean.recentResults[0].difficulty, 'medium');
    assert.strictEqual(clean.recentResults[1].language, 'english');
    assert.strictEqual(clean.recentResults[1].difficulty, 'easy');
    assert.strictEqual(clean.recentResults[1].duration, 60);

    const history = clean.lessonHistory || [];
    assert.strictEqual(history.length, 1);
    assert.strictEqual(history[0].lessonId, 'lesson-1');
  });

  await t.test('loadUserProgress operates safely in headless/SSR environments', () => {
    const progress = loadUserProgress();
    assert.ok(Array.isArray(progress.completedLessons));
    assert.strictEqual(typeof progress.totalPracticeTime, 'number');
    assert.strictEqual(typeof progress.soundEnabled, 'boolean');
  });
});
