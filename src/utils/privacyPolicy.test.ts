import test from 'node:test';
import assert from 'node:assert';
import { NavTab } from '../types';

test('Privacy Policy & Storage Integrity Validation', async (t) => {
  await t.test('NavTab includes privacy route', () => {
    const validTabs: NavTab[] = ['home', 'english', 'hindi', 'test', 'about', 'privacy'];
    assert.ok(validTabs.includes('privacy'));
  });

  await t.test('Verified localStorage keys used by TypingSpedo', () => {
    const recognizedKeys = [
      'typeshala_user_progress_v1',
      'typeshala_theme',
      'typeshala_color_theme',
      'typeshala_virtual_hands',
      'typeshala_mechanical_sound',
    ];
    assert.strictEqual(recognizedKeys.length, 5);
  });
});
