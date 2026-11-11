import { KEYBOARD_ROWS, Finger, KeyDefinition, FINGER_COLORS } from '../data/keyboardLayouts';

export interface FingerInstruction {
  finger: Finger;
  hand: 'left' | 'right' | 'thumb';
  fingerName: string;
  fingerNameHindi: string;
  homeKey: string;
  code: string;
  char: string;
  shiftRequired: boolean;
  shiftFinger?: Finger;
  shiftFingerName?: string;
  reachDirection?: 'home' | 'up' | 'down' | 'inward' | 'outward' | 'thumb';
  colorHex?: string;
}

/**
 * Returns the Home-row resting key for a given finger
 */
export function getHomeKeyForFinger(finger: Finger): string {
  switch (finger) {
    case 'pinky-l': return 'A';
    case 'ring-l': return 'S';
    case 'middle-l': return 'D';
    case 'index-l': return 'F';
    case 'thumb': return 'Space';
    case 'index-r': return 'J';
    case 'middle-r': return 'K';
    case 'ring-r': return 'L';
    case 'pinky-r': return ';';
  }
}

/**
 * Friendly display name for a finger in English
 */
export function getFingerDisplayName(finger: Finger): string {
  switch (finger) {
    case 'pinky-l': return 'Left Pinky';
    case 'ring-l': return 'Left Ring Finger';
    case 'middle-l': return 'Left Middle Finger';
    case 'index-l': return 'Left Index Finger';
    case 'thumb': return 'Thumb (Spacebar)';
    case 'index-r': return 'Right Index Finger';
    case 'middle-r': return 'Right Middle Finger';
    case 'ring-r': return 'Right Ring Finger';
    case 'pinky-r': return 'Right Pinky';
  }
}

/**
 * Friendly display name for a finger in Hindi
 */
export function getFingerDisplayNameHindi(finger: Finger): string {
  switch (finger) {
    case 'pinky-l': return 'बायाँ कनिष्ठिका (Little)';
    case 'ring-l': return 'बायाँ अनामिका (Ring)';
    case 'middle-l': return 'बायाँ मध्यमा (Middle)';
    case 'index-l': return 'बायाँ तर्जनी (Index)';
    case 'thumb': return 'अंगूठा (Spacebar)';
    case 'index-r': return 'दायाँ तर्जनी (Index)';
    case 'middle-r': return 'दायाँ मध्यमा (Middle)';
    case 'ring-r': return 'दायाँ अनामिका (Ring)';
    case 'pinky-r': return 'दायाँ कनिष्ठिका (Little)';
  }
}

/**
 * Determines which finger should press Shift:
 * Ergonomic standard: opposite pinky finger!
 * If key is on left hand, use Right Pinky.
 * If key is on right hand, use Left Pinky.
 */
export function getShiftFingerForFinger(finger: Finger): Finger {
  if (finger === 'thumb') return 'pinky-l';
  if (finger.endsWith('-l')) return 'pinky-r';
  return 'pinky-l';
}

/**
 * Saved preference for Virtual Hands guide
 */
export function getSavedVirtualHandsPreference(): boolean {
  try {
    const saved = localStorage.getItem('typeshala_virtual_hands');
    if (saved !== null) {
      return saved === 'true';
    }
  } catch {
    // ignore
  }
  return true; // Default ON for student lessons
}

export function saveVirtualHandsPreference(enabled: boolean): void {
  try {
    localStorage.setItem('typeshala_virtual_hands', String(enabled));
  } catch {
    // ignore
  }
}

/**
 * Given a character and layout, find the full finger instruction
 */
export function getFingerInstructionForChar(
  char: string,
  layout: 'english' | 'inscript' | 'remington' | 'phonetic' = 'english'
): FingerInstruction | null {
  if (!char) return null;

  if (char === ' ') {
    return {
      finger: 'thumb',
      hand: 'thumb',
      fingerName: 'Thumb',
      fingerNameHindi: 'अंगूठा (Spacebar)',
      homeKey: 'Space',
      code: 'Space',
      char: ' ',
      shiftRequired: false,
      reachDirection: 'thumb',
      colorHex: '#a855f7',
    };
  }

  let matchedKey: KeyDefinition | null = null;
  let shiftRequired = false;

  const phoneticMap: Record<string, { char: string; shift?: boolean }> = {
    'क': { char: 'k' }, 'ख': { char: 'K', shift: true },
    'ग': { char: 'g' }, 'घ': { char: 'G', shift: true },
    'च': { char: 'c' }, 'छ': { char: 'C', shift: true },
    'ज': { char: 'j' }, 'झ': { char: 'J', shift: true },
    'ट': { char: 'T', shift: true }, 'ठ': { char: 'T', shift: true },
    'ड': { char: 'D', shift: true }, 'ढ': { char: 'D', shift: true },
    'त': { char: 't' }, 'थ': { char: 't', shift: true },
    'द': { char: 'd' }, 'ध': { char: 'd', shift: true },
    'न': { char: 'n' }, 'प': { char: 'p' }, 'फ': { char: 'f' },
    'ब': { char: 'b' }, 'भ': { char: 'B', shift: true },
    'म': { char: 'm' }, 'य': { char: 'y' }, 'र': { char: 'r' },
    'ल': { char: 'l' }, 'व': { char: 'v' }, 'श': { char: 's', shift: true },
    'ष': { char: 's', shift: true }, 'स': { char: 's' }, 'ह': { char: 'h' },
    'ा': { char: 'a' }, 'ि': { char: 'i' }, 'ी': { char: 'I', shift: true },
    'ु': { char: 'u' }, 'ू': { char: 'U', shift: true }, 'े': { char: 'e' },
    'ै': { char: 'e', shift: true }, 'ो': { char: 'o' }, 'ौ': { char: 'o', shift: true },
    'ं': { char: 'n' }, 'ँ': { char: 'n' }, '्': { char: 'd' },
  };

  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (layout === 'english') {
        if (key.defaultChar.toLowerCase() === char.toLowerCase()) {
          matchedKey = key;
          shiftRequired = char === key.shiftChar || (char >= 'A' && char <= 'Z');
          break;
        }
        if (key.shiftChar === char) {
          matchedKey = key;
          shiftRequired = true;
          break;
        }
      } else if (layout === 'inscript') {
        if (key.inscriptNormal === char) {
          matchedKey = key;
          shiftRequired = false;
          break;
        }
        if (key.inscriptShift === char) {
          matchedKey = key;
          shiftRequired = true;
          break;
        }
      } else if (layout === 'remington') {
        if (key.remingtonNormal === char) {
          matchedKey = key;
          shiftRequired = false;
          break;
        }
        if (key.remingtonShift === char) {
          matchedKey = key;
          shiftRequired = true;
          break;
        }
      } else if (layout === 'phonetic') {
        if (key.defaultChar.toLowerCase() === char.toLowerCase()) {
          matchedKey = key;
          shiftRequired = char === key.shiftChar || (char >= 'A' && char <= 'Z');
          break;
        }
        const mapped = phoneticMap[char];
        if (mapped && key.defaultChar.toLowerCase() === mapped.char.toLowerCase()) {
          matchedKey = key;
          shiftRequired = !!mapped.shift;
          break;
        }
      }
    }
    if (matchedKey) break;
  }

  if (!matchedKey) return null;

  const finger = matchedKey.finger;
  const isLeft = finger.endsWith('-l');
  const isRight = finger.endsWith('-r');
  const hand = isLeft ? 'left' : isRight ? 'right' : 'thumb';

  let shiftFinger: Finger | undefined;
  let shiftFingerName: string | undefined;

  if (shiftRequired) {
    shiftFinger = getShiftFingerForFinger(finger);
    shiftFingerName = getFingerDisplayName(shiftFinger);
  }

  // Determine reach direction
  let reachDirection: FingerInstruction['reachDirection'] = 'home';
  if (['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'].includes(matchedKey.code)) {
    reachDirection = 'up';
  } else if (['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'].includes(matchedKey.code)) {
    reachDirection = 'down';
  } else if (['KeyG', 'KeyH'].includes(matchedKey.code)) {
    reachDirection = 'inward';
  } else if (matchedKey.code === 'Space') {
    reachDirection = 'thumb';
  }

  return {
    finger,
    hand,
    fingerName: getFingerDisplayName(finger),
    fingerNameHindi: getFingerDisplayNameHindi(finger),
    homeKey: getHomeKeyForFinger(finger),
    code: matchedKey.code,
    char,
    shiftRequired,
    shiftFinger,
    shiftFingerName,
    reachDirection,
    colorHex: FINGER_COLORS[finger]?.colorHex || '#0284c7',
  };
}
