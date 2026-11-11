/**
 * Web Audio API synthesizer for realistic mechanical keyboard switch sound effects
 * Provides tactile clicks, spacebar bottom-out thuds, and subtle error feedback.
 * 100% client-side, zero latency, no external audio files required.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch {
    // AudioContext initialization fallback
  }
  return audioCtx;
}

/**
 * Check or persist sound enabled setting in localStorage
 */
export function getSavedSoundPreference(): boolean {
  try {
    const saved = localStorage.getItem('typeshala_mechanical_sound');
    if (saved !== null) {
      return saved === 'true';
    }
  } catch {
    // ignore
  }
  return true;
}

export function saveSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem('typeshala_mechanical_sound', String(enabled));
  } catch {
    // ignore
  }
}

/**
 * Synthesizes a satisfying mechanical keyboard click (Cherry MX Blue / Brown tactile feel)
 */
export function playKeyClick(enabled: boolean, isSpace: boolean = false): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (isSpace) {
      // Spacebar: deeper, richer acoustic resonance (thud + click)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } else {
      // Standard Key: sharp high-frequency transient click + body thud
      // 1. High-frequency click snap
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1400 + Math.random() * 200, now);
      clickOsc.frequency.exponentialRampToValueAtTime(350, now + 0.025);

      clickGain.gain.setValueAtTime(0.045, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.026);

      // 2. Mechanical bottom-out thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();

      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(500 + Math.random() * 60, now);
      thudOsc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      thudGain.gain.setValueAtTime(0.035, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);

      thudOsc.start(now);
      thudOsc.stop(now + 0.036);
    }
  } catch {
    // Ignore audio restrictions
  }
}

/**
 * Soft error audio cue (gentle low buzz, non-jarring)
 */
export function playErrorBuzz(enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  } catch {
    // Ignore audio restrictions
  }
}

/**
 * Musical frequencies for ascending star chime progression (Pentatonic/Major Arpeggio):
 * Star 1: C5 (523.25 Hz)
 * Star 2: E5 (659.25 Hz)
 * Star 3: G5 (783.99 Hz)
 * Star 4: C6 (1046.50 Hz)
 * Star 5: E6 (1318.51 Hz) + shimmer G6 (1567.98 Hz)
 */
export const STAR_FREQUENCIES = [523.25, 659.25, 783.99, 1046.50, 1318.51];

/**
 * Plays a single crystal-clear musical star chime for the given star index (1 to 5).
 */
export function playSingleStarChime(starIndex: number, enabled: boolean = true): void {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const clampedIndex = Math.max(1, Math.min(5, starIndex));
    const freq = STAR_FREQUENCIES[clampedIndex - 1];
    const now = ctx.currentTime;

    // 1. Fundamental chime tone (bright bell sine)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Fast pleasant bell envelope
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.09, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0005, now + 0.45);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.46);

    // 2. Bell overtone harmonic (glockenspiel sparkle at 2.76x)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.756, now);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.035, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0005, now + 0.25);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now);
    osc2.stop(now + 0.26);

    // 3. For 5th star: additional celebratory shimmer chord (G6)
    if (clampedIndex === 5) {
      const shimmerOsc = ctx.createOscillator();
      const shimmerGain = ctx.createGain();

      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(1567.98, now + 0.04);

      shimmerGain.gain.setValueAtTime(0.001, now + 0.04);
      shimmerGain.gain.linearRampToValueAtTime(0.05, now + 0.06);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.6);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);

      shimmerOsc.start(now + 0.04);
      shimmerOsc.stop(now + 0.62);
    }
  } catch {
    // Ignore audio restrictions in non-interactive/test contexts
  }
}

/**
 * Plays the sequential star reveal chimes according to the number of stars earned.
 * Perfectly synced with the modal star pop-in animations (180ms stagger).
 * Returns a cancel function to clear scheduled timers if unmounted.
 */
export function playStarsCelebration(earnedStars: number, enabled: boolean = true): () => void {
  if (!enabled || earnedStars <= 0) return () => {};

  const clampedStars = Math.max(1, Math.min(5, earnedStars));
  const timeouts: Array<ReturnType<typeof setTimeout>> = [];

  for (let i = 1; i <= clampedStars; i++) {
    const t = setTimeout(() => {
      playSingleStarChime(i, enabled);
    }, (i - 1) * 180 + 120);
    timeouts.push(t);
  }

  return () => {
    timeouts.forEach((id) => clearTimeout(id));
  };
}
