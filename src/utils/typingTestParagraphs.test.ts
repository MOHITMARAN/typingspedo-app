import test from 'node:test';
import assert from 'node:assert';
import { TEST_PARAGRAPHS } from '../data/typingTests';

test('Typing Test Paragraphs Library Validation', async (t) => {
  await t.test('has at least 25 total test paragraphs', () => {
    assert.ok(TEST_PARAGRAPHS.length >= 25, `Expected >= 25 paragraphs, got ${TEST_PARAGRAPHS.length}`);
  });

  const languages = ['english', 'hindi'] as const;
  const difficulties = ['easy', 'medium', 'hard'] as const;

  for (const lang of languages) {
    for (const diff of difficulties) {
      await t.test(`contains multiple paragraphs for ${lang} (${diff} level)`, () => {
        const matching = TEST_PARAGRAPHS.filter(
          (p) => p.language === lang && p.difficulty === diff
        );
        assert.ok(
          matching.length >= 4,
          `Expected at least 4 paragraphs for ${lang} - ${diff}, but found ${matching.length}`
        );

        // Every paragraph must have a valid title, source, text, and id
        for (const p of matching) {
          assert.ok(p.id.length > 0, 'Paragraph must have an ID');
          assert.ok(p.title.length > 0, 'Paragraph must have a Title');
          assert.ok(p.source.length > 0, 'Paragraph must have a Source');
          assert.ok(p.text.length >= 80, `Paragraph "${p.title}" text must have substantial content (got length ${p.text.length})`);
        }
      });
    }
  }

  await t.test('all paragraph IDs are unique', () => {
    const ids = TEST_PARAGRAPHS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(ids.length, uniqueIds.size, 'Every paragraph ID must be unique');
  });

  await t.test('Hindi paragraphs contain proper Devanagari characters and punctuation', () => {
    const hindiParas = TEST_PARAGRAPHS.filter((p) => p.language === 'hindi');
    for (const p of hindiParas) {
      // Must contain Devanagari characters
      const hasDevanagari = /[\u0900-\u097F]/.test(p.text);
      assert.strictEqual(hasDevanagari, true, `Hindi paragraph "${p.title}" must contain Devanagari script`);
      // Must have standard purna viram or punctuation
      assert.ok(p.text.includes('।') || p.text.includes('.'), `Hindi paragraph "${p.title}" should have punctuation`);
    }
  });

  await t.test('English paragraphs contain valid words and proper sentence structure', () => {
    const englishParas = TEST_PARAGRAPHS.filter((p) => p.language === 'english');
    for (const p of englishParas) {
      const words = p.text.split(/\s+/);
      assert.ok(words.length >= 30, `English paragraph "${p.title}" should have >= 30 words`);
      assert.ok(p.text.includes('.'), `English paragraph "${p.title}" should end with punctuation`);
    }
  });
});
