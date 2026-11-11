import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STAR_FREQUENCIES,
  playSingleStarChime,
  playStarsCelebration,
  playKeyClick,
  playErrorBuzz,
  getSavedSoundPreference,
  saveSoundPreference,
} from './sound';

test('STAR_FREQUENCIES contains 5 ascending musical pitch frequencies', () => {
  assert.equal(STAR_FREQUENCIES.length, 5, 'Should have exactly 5 frequencies for 5 stars');
  // Check strictly increasing pitch (C5 to E6)
  for (let i = 1; i < STAR_FREQUENCIES.length; i++) {
    assert.ok(
      STAR_FREQUENCIES[i] > STAR_FREQUENCIES[i - 1],
      `Frequency at index ${i} (${STAR_FREQUENCIES[i]}Hz) should be higher than index ${i - 1} (${STAR_FREQUENCIES[i - 1]}Hz)`
    );
  }
  assert.equal(STAR_FREQUENCIES[0], 523.25, 'Star 1 frequency should be C5 (523.25Hz)');
  assert.equal(STAR_FREQUENCIES[4], 1318.51, 'Star 5 frequency should be E6 (1318.51Hz)');
});

test('playSingleStarChime runs safely without throwing in headless/SSR environments', () => {
  assert.doesNotThrow(() => {
    playSingleStarChime(1, false);
    playSingleStarChime(3, false);
    playSingleStarChime(5, false);
    // Even when enabled=true without AudioContext in node
    playSingleStarChime(1, true);
    playSingleStarChime(5, true);
    // Boundary conditions
    playSingleStarChime(0, true);
    playSingleStarChime(99, true);
  });
});

test('playStarsCelebration returns a working cancellation function', () => {
  // Disabled sound returns a no-op function immediately
  const cancelDisabled = playStarsCelebration(5, false);
  assert.equal(typeof cancelDisabled, 'function');
  assert.doesNotThrow(() => cancelDisabled());

  // Zero or negative stars returns a no-op function
  const cancelZero = playStarsCelebration(0, true);
  assert.equal(typeof cancelZero, 'function');
  assert.doesNotThrow(() => cancelZero());

  // Active celebration returns cancel function that clears timeouts
  const cancelActive = playStarsCelebration(5, true);
  assert.equal(typeof cancelActive, 'function');
  assert.doesNotThrow(() => cancelActive());
});

test('playKeyClick and playErrorBuzz execute safely', () => {
  assert.doesNotThrow(() => {
    playKeyClick(false);
    playKeyClick(true, false);
    playKeyClick(true, true);
    playErrorBuzz(false);
    playErrorBuzz(true);
  });
});

test('Sound preferences fallback gracefully in non-browser environment', () => {
  assert.doesNotThrow(() => {
    const pref = getSavedSoundPreference();
    assert.equal(typeof pref, 'boolean');
    saveSoundPreference(false);
    saveSoundPreference(true);
  });
});
