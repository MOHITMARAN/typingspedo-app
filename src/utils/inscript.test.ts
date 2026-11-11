import test from 'node:test';
import assert from 'node:assert/strict';
import { getCharForPhysicalKey, findKeyForChar } from '../data/keyboardLayouts';
import { HINDI_LESSONS } from '../data/hindiLessons';
import { transliterateToHindi } from './phoneticConverter';

test('InScript Key Mapping - Home Row Consonants', () => {
  // KeyK -> क (unvoiced unaspirated velar)
  assert.equal(getCharForPhysicalKey('KeyK', false, 'inscript'), 'क');
  // Shift + KeyK -> ख (unvoiced aspirated velar)
  assert.equal(getCharForPhysicalKey('KeyK', true, 'inscript'), 'ख');

  // KeyJ -> र
  assert.equal(getCharForPhysicalKey('KeyJ', false, 'inscript'), 'र');
  // KeyL -> त
  assert.equal(getCharForPhysicalKey('KeyL', false, 'inscript'), 'त');
  // Shift + KeyL -> थ
  assert.equal(getCharForPhysicalKey('KeyL', true, 'inscript'), 'थ');

  // KeyH -> प
  assert.equal(getCharForPhysicalKey('KeyH', false, 'inscript'), 'प');
  // Shift + KeyH -> फ
  assert.equal(getCharForPhysicalKey('KeyH', true, 'inscript'), 'फ');
});

test('InScript Key Mapping - Home Row Matras & Vowels', () => {
  // KeyD -> ् (Halant)
  assert.equal(getCharForPhysicalKey('KeyD', false, 'inscript'), '्');
  // Shift + KeyD -> अ (Primary independent vowel)
  assert.equal(getCharForPhysicalKey('KeyD', true, 'inscript'), 'अ');

  // KeyE -> ा
  assert.equal(getCharForPhysicalKey('KeyE', false, 'inscript'), 'ा');
  // Shift + KeyE -> आ
  assert.equal(getCharForPhysicalKey('KeyE', true, 'inscript'), 'आ');

  // KeyF -> ि
  assert.equal(getCharForPhysicalKey('KeyF', false, 'inscript'), 'ि');
  // Shift + KeyF -> इ
  assert.equal(getCharForPhysicalKey('KeyF', true, 'inscript'), 'इ');

  // KeyR -> ी
  assert.equal(getCharForPhysicalKey('KeyR', false, 'inscript'), 'ी');
  // Shift + KeyR -> ई
  assert.equal(getCharForPhysicalKey('KeyR', true, 'inscript'), 'ई');
});

test('InScript Key Mapping - Space and Punctuation', () => {
  assert.equal(getCharForPhysicalKey('Space', false, 'inscript'), ' ');
  assert.equal(getCharForPhysicalKey('Period', true, 'inscript'), '।');
});

test('Phonetic Transliteration Engine', () => {
  assert.equal(transliterateToHindi('namaste'), 'नमस्ते');
  assert.equal(transliterateToHindi('bharat'), 'भारत');
});

test('Course Lessons State - Hindi InScript Curriculum', () => {
  assert.equal(Array.isArray(HINDI_LESSONS), true);
  assert.ok(HINDI_LESSONS.length >= 24, 'Curriculum should have at least 24 lessons');

  const inscriptCourseLessons = HINDI_LESSONS.filter((l) => l.hindiCategory === 'inscript-course');
  assert.ok(inscriptCourseLessons.length >= 20, 'Should have rich InScript progressive lessons');

  const speedDrills = HINDI_LESSONS.filter((l) => l.hindiCategory === 'speed-drills');
  assert.ok(speedDrills.length > 0, 'Should have speed drills');

  const paragraphs = HINDI_LESSONS.filter((l) => l.hindiCategory === 'paragraphs');
  assert.ok(paragraphs.length > 0, 'Should have examination paragraphs');

  // Verify all characters in lessons can be typed or identified
  for (const lesson of HINDI_LESSONS) {
    assert.ok(lesson.id, 'Lesson must have an id');
    assert.ok(lesson.title, 'Lesson must have a title');
    assert.ok(lesson.content.length > 0, 'Lesson must have content');
    assert.ok(lesson.targetWpm && lesson.targetWpm > 0, 'Lesson must have a valid targetWpm');

    // Test a sample of characters in each lesson against key mappings
    for (const char of lesson.content.slice(0, 30)) {
      if (char === ' ') continue;
      const keyInfo = findKeyForChar(char, 'inscript');
      assert.ok(keyInfo !== null, `Character "${char}" in lesson "${lesson.id}" should have a valid key mapping`);
    }
  }
});
