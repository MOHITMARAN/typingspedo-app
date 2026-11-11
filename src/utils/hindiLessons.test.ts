import test from 'node:test';
import assert from 'node:assert/strict';
import { recordHindiLessonScore, markLessonCompleted, calculateStars, recordHindiUnitProgress } from './storage';
import { HINDI_LESSONS } from '../data/hindiLessons';

test('calculateStars provides accurate 1 to 5 star rating', () => {
  assert.equal(calculateStars(100), 5, '100% accuracy should earn 5 stars');
  assert.equal(calculateStars(98), 5, '98% accuracy should earn 5 stars');
  assert.equal(calculateStars(96), 4, '96% accuracy should earn 4 stars');
  assert.equal(calculateStars(95), 4, '95% accuracy should earn 4 stars');
  assert.equal(calculateStars(92), 3, '92% accuracy should earn 3 stars');
  assert.equal(calculateStars(90), 3, '90% accuracy should earn 3 stars');
  assert.equal(calculateStars(85), 2, '85% accuracy should earn 2 stars');
  assert.equal(calculateStars(80), 2, '80% accuracy should earn 2 stars');
  assert.equal(calculateStars(70), 1, '70% accuracy should earn 1 star');
  assert.equal(calculateStars(0), 1, '0% accuracy completed should earn 1 star');
});

test('recordHindiLessonScore records 5 stars and marks lesson as passed', () => {
  const lesson = HINDI_LESSONS[0];
  const { updatedProgress, passed, stars } = recordHindiLessonScore(lesson.id, lesson.title, {
    wpm: 35,
    netWpm: 32,
    accuracy: 99,
    errors: 1,
    timeElapsed: 45,
  });

  assert.equal(stars, 5, '99% accuracy should award 5 stars');
  assert.equal(passed, true, 'Lesson should be marked passed');
  assert.ok(updatedProgress.completedLessons.includes(lesson.id), 'Lesson ID should be in completedLessons');
  
  const record = updatedProgress.hindiScores?.[lesson.id];
  assert.ok(record, 'hindiScores should have entry for lesson');
  assert.equal(record.stars, 5);
  assert.equal(record.passed, true);
  assert.equal(record.netWpm, 32);
  assert.equal(record.accuracy, 99);
  assert.ok(updatedProgress.highestWpmHindi >= 32);
});

test('markLessonCompleted with hindi updates completedLessons and hindiScores', () => {
  const lesson = HINDI_LESSONS[1];
  const updated = markLessonCompleted(lesson.id, 28, 'hindi', {
    accuracy: 94,
    errors: 2,
    timeElapsed: 60,
    lessonTitle: lesson.title,
  });

  assert.ok(updated.completedLessons.includes(lesson.id));
  const record = updated.hindiScores?.[lesson.id];
  assert.ok(record);
  assert.equal(record.stars, 3); // 94% gives 3 stars
  assert.equal(record.passed, true);
  assert.ok(updated.highestWpmHindi >= 28);
});

test('Every Hindi lesson has exactly 2 units: Unit 1 (वर्ण अभ्यास) and Unit 2 (संपूर्ण शब्द अभ्यास)', () => {
  assert.ok(HINDI_LESSONS.length >= 40, 'Should have at least 40 Hindi lessons');
  
  for (const lesson of HINDI_LESSONS) {
    assert.ok(lesson.units, `Lesson ${lesson.id} must have units defined`);
    assert.equal(lesson.units.length, 2, `Lesson ${lesson.id} must have exactly 2 units`);

    const [u1, u2] = lesson.units;
    assert.equal(u1.unitNumber, 1, `Lesson ${lesson.id} first unit should be unitNumber 1`);
    assert.ok(u1.content.length > 0, `Lesson ${lesson.id} Unit 1 must have content`);
    assert.ok(u1.name.includes('वर्ण') || u1.name.includes('अभ्यास'), `Lesson ${lesson.id} Unit 1 name should indicate practice`);

    assert.equal(u2.unitNumber, 2, `Lesson ${lesson.id} second unit should be unitNumber 2`);
    assert.equal(u2.name, 'संपूर्ण शब्द अभ्यास', `Lesson ${lesson.id} Unit 2 name must be संपूर्ण शब्द अभ्यास`);
    assert.ok(u2.content.length > 0, `Lesson ${lesson.id} Unit 2 must have content`);

    // Verify Unit 2 words are complete words (space separated words, not isolated single characters)
    const words = u2.content.split(/\s+/).filter(Boolean);
    assert.ok(words.length >= 3, `Lesson ${lesson.id} Unit 2 should contain multiple words`);
    // Ensure words have length > 1 (complete words with matras or multiple consonants)
    const multiCharWords = words.filter(w => w.length >= 2);
    assert.ok(
      multiCharWords.length >= words.length * 0.8,
      `Lesson ${lesson.id} Unit 2 should primarily consist of complete words (length >= 2)`
    );
  }
});

test('recordHindiUnitProgress tracks Unit 1 completion before full lesson pass', () => {
  const lesson = HINDI_LESSONS[2];
  
  // Progress Unit 1
  const afterU1 = recordHindiUnitProgress(lesson.id, 1, {
    wpm: 25,
    netWpm: 24,
    accuracy: 96,
    errors: 1,
    timeElapsed: 30,
  });

  const recordU1 = afterU1.hindiScores?.[lesson.id];
  assert.ok(recordU1, 'Record should exist after Unit 1');
  assert.deepEqual(recordU1.completedUnits, [1], 'completedUnits should contain [1]');
  assert.equal(recordU1.passed, false, 'Lesson should not be marked passed with only Unit 1 completed');

  // Complete full lesson (Unit 2 completion)
  const { updatedProgress, passed, stars } = recordHindiLessonScore(lesson.id, lesson.title, {
    wpm: 30,
    netWpm: 28,
    accuracy: 98,
    errors: 1,
    timeElapsed: 35,
  });

  assert.equal(passed, true, 'Lesson should pass after full lesson completion');
  assert.equal(stars, 5, '98% accuracy should award 5 stars');
  const recordFinal = updatedProgress.hindiScores?.[lesson.id];
  assert.ok(recordFinal);
  assert.ok(recordFinal.completedUnits?.includes(1) && recordFinal.completedUnits?.includes(2), 'Both units should be marked completed');
});

test('Unit 1 and Unit 2 are distinct and Unit 2 contains coherent words without isolated matras', () => {
  for (const lesson of HINDI_LESSONS) {
    const [u1, u2] = lesson.units!;
    // Ensure content is not a duplicate
    assert.notEqual(u1.content.trim(), u2.content.trim(), `Lesson ${lesson.id}: Unit 1 and Unit 2 content must be distinct`);
    
    // Verify no isolated standalone matra characters in words
    const words = u2.content.split(/\s+/).filter(Boolean);
    for (const word of words) {
      // Devanagari standalone matras should not appear as standalone words
      assert.ok(
        !/^[ािीुूृेैोौंँ]+$/.test(word),
        `Lesson ${lesson.id} Unit 2 word "${word}" should not be an isolated matra`
      );
    }
  }
});
