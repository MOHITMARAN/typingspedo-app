import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ENGLISH_BEGINNER_LESSONS } from '../data/englishBeginnerLessons';
import { ENGLISH_LESSONS } from '../data/englishLessons';

describe('English Typing Curriculum', () => {
  it('should have 12 structured beginner lessons', () => {
    assert.strictEqual(ENGLISH_BEGINNER_LESSONS.length, 12);
  });

  it('every beginner lesson should have exactly 3 units and valid properties', () => {
    const ids = new Set<string>();

    ENGLISH_BEGINNER_LESSONS.forEach((lesson, idx) => {
      assert.ok(lesson.id, `Lesson at index ${idx} must have an id`);
      assert.ok(!ids.has(lesson.id), `Duplicate lesson id: ${lesson.id}`);
      ids.add(lesson.id);

      assert.strictEqual(lesson.lessonNumber, idx + 1);
      assert.ok(lesson.title.length > 0, `Lesson ${lesson.id} must have a title`);
      assert.ok(lesson.subtitle.length > 0, `Lesson ${lesson.id} must have a subtitle`);
      assert.ok(Array.isArray(lesson.newKeys), `Lesson ${lesson.id} must have newKeys array`);
      assert.ok(Array.isArray(lesson.learnedKeys), `Lesson ${lesson.id} must have learnedKeys array`);

      assert.strictEqual(lesson.units.length, 3, `Lesson ${lesson.id} must have 3 units`);

      // Unit 1: Orientation / Learn
      assert.strictEqual(lesson.units[0].unitNumber, 1);
      assert.ok(lesson.units[0].name.length > 0);
      assert.ok(lesson.units[0].instruction.length > 0);

      // Unit 2: Guided practice
      assert.strictEqual(lesson.units[1].unitNumber, 2);
      assert.strictEqual(lesson.units[1].type, 'guided_practice');
      assert.ok(lesson.units[1].exerciseText && lesson.units[1].exerciseText.length > 0);

      // Unit 3: Speed challenge
      assert.strictEqual(lesson.units[2].unitNumber, 3);
      assert.strictEqual(lesson.units[2].type, 'challenge');
      assert.ok(lesson.units[2].exerciseText && lesson.units[2].exerciseText.length > 0);
      assert.ok(
        (lesson.units[2].minAccuracyToPass ?? 0) >= 80,
        `Lesson ${lesson.id} unit 3 must require passing accuracy >= 80%`
      );
    });
  });

  it('should have intermediate and advanced lessons in ENGLISH_LESSONS', () => {
    const intermediate = ENGLISH_LESSONS.filter((l) => l.level === 'intermediate');
    const advanced = ENGLISH_LESSONS.filter((l) => l.level === 'advanced');

    assert.ok(intermediate.length >= 6, 'Should have at least 6 intermediate lessons');
    assert.ok(advanced.length >= 6, 'Should have at least 6 advanced lessons');

    ENGLISH_LESSONS.forEach((lesson) => {
      assert.strictEqual(lesson.language, 'english');
      assert.ok(lesson.title.length > 0);
      assert.ok(lesson.subtitle.length > 0);
      assert.ok(lesson.content.length > 100, `Lesson ${lesson.id} content should be substantial`);
      assert.ok((lesson.targetWpm ?? 0) >= 30, `Lesson ${lesson.id} target WPM should be >= 30`);
    });
  });

  it('all English beginner lessons should be unlocked by default', async () => {
    const { isLessonUnlocked } = await import('./storage');
    const dummyProgress = {
      completedLessons: [],
      totalPracticeTime: 0,
      highestWpmEnglish: 0,
      highestWpmHindi: 0,
      testsCompleted: 0,
      recentResults: [],
      lessonHistory: [],
      soundEnabled: true,
      beginnerScores: {},
    };

    for (let i = 1; i <= 12; i++) {
      const status = isLessonUnlocked(i, dummyProgress);
      assert.strictEqual(status.unlocked, true, `Lesson ${i} must be unlocked`);
    }
  });

  it('calculateStars should award 1-5 stars based on accuracy performance', async () => {
    const { calculateStars } = await import('./storage');
    assert.strictEqual(calculateStars(100), 5, '100% accuracy should give 5 stars');
    assert.strictEqual(calculateStars(98), 5, '98% accuracy should give 5 stars');
    assert.strictEqual(calculateStars(96), 4, '96% accuracy should give 4 stars');
    assert.strictEqual(calculateStars(92), 3, '92% accuracy should give 3 stars');
    assert.strictEqual(calculateStars(85), 2, '85% accuracy should give 2 stars');
    assert.strictEqual(calculateStars(75), 1, '75% accuracy should give 1 star');
  });

  it('recordBeginnerChallengeScore should complete the lesson and assign accurate stars', async () => {
    const { recordBeginnerChallengeScore } = await import('./storage');
    const res = recordBeginnerChallengeScore('eng-beg-1', {
      wpm: 35,
      netWpm: 34,
      accuracy: 99,
      errors: 1,
      timeElapsed: 40,
    });

    assert.strictEqual(res.passed, true);
    assert.strictEqual(res.stars, 5);
    assert.ok(res.updatedProgress.completedLessons.includes('eng-beg-1'));
    assert.strictEqual(res.updatedProgress.beginnerScores?.['eng-beg-1']?.stars, 5);
    assert.strictEqual(res.updatedProgress.beginnerScores?.['eng-beg-1']?.passed, true);
    assert.deepStrictEqual(res.updatedProgress.beginnerScores?.['eng-beg-1']?.completedUnits, [1, 2, 3]);
  });
});
