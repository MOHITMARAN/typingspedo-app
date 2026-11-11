export type Finger = 'pinky-l' | 'ring-l' | 'middle-l' | 'index-l' | 'thumb' | 'index-r' | 'middle-r' | 'ring-r' | 'pinky-r';

export interface KeyDefinition {
  code: string;
  defaultChar: string;
  shiftChar: string;
  inscriptNormal?: string;
  inscriptShift?: string;
  remingtonNormal?: string;
  remingtonShift?: string;
  finger: Finger;
  width?: string; // e.g. 'flex-1', 'w-16', 'w-20'
  isSpecial?: boolean;
}

// Finger theme color mappings (Red, Orange, Green, Blue, Purple)
export const FINGER_COLORS: Record<Finger, { bg: string; text: string; label: string; hand: 'Left' | 'Right' | 'Thumb'; colorHex: string }> = {
  'pinky-l': { bg: 'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300', text: 'text-red-600 dark:text-red-400', label: 'Left Pinky', hand: 'Left', colorHex: '#ef4444' },
  'ring-l': { bg: 'bg-orange-100 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300', text: 'text-orange-600 dark:text-orange-400', label: 'Left Ring', hand: 'Left', colorHex: '#f97316' },
  'middle-l': { bg: 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400', label: 'Left Middle', hand: 'Left', colorHex: '#10b981' },
  'index-l': { bg: 'bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300', text: 'text-blue-600 dark:text-blue-400', label: 'Left Index', hand: 'Left', colorHex: '#0284c7' },
  'thumb': { bg: 'bg-purple-100 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300', text: 'text-purple-600 dark:text-purple-400', label: 'Thumbs', hand: 'Thumb', colorHex: '#a855f7' },
  'index-r': { bg: 'bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300', text: 'text-blue-600 dark:text-blue-400', label: 'Right Index', hand: 'Right', colorHex: '#0284c7' },
  'middle-r': { bg: 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400', label: 'Right Middle', hand: 'Right', colorHex: '#10b981' },
  'ring-r': { bg: 'bg-orange-100 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300', text: 'text-orange-600 dark:text-orange-400', label: 'Right Ring', hand: 'Right', colorHex: '#f97316' },
  'pinky-r': { bg: 'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300', text: 'text-red-600 dark:text-red-400', label: 'Right Pinky', hand: 'Right', colorHex: '#ef4444' },
};

export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1 (Number row)
  [
    { code: 'Backquote', defaultChar: '`', shiftChar: '~', inscriptNormal: 'ॊ', inscriptShift: 'ऒ', remingtonNormal: '`', remingtonShift: '~', finger: 'pinky-l' },
    { code: 'Digit1', defaultChar: '1', shiftChar: '!', inscriptNormal: '१', inscriptShift: '!', remingtonNormal: '१', remingtonShift: '!', finger: 'pinky-l' },
    { code: 'Digit2', defaultChar: '2', shiftChar: '@', inscriptNormal: '२', inscriptShift: '@', remingtonNormal: '२', remingtonShift: '@', finger: 'ring-l' },
    { code: 'Digit3', defaultChar: '3', shiftChar: '#', inscriptNormal: '३', inscriptShift: '#', remingtonNormal: '३', remingtonShift: '#', finger: 'middle-l' },
    { code: 'Digit4', defaultChar: '4', shiftChar: '$', inscriptNormal: '४', inscriptShift: '$', remingtonNormal: '४', remingtonShift: '₹', finger: 'index-l' },
    { code: 'Digit5', defaultChar: '5', shiftChar: '%', inscriptNormal: '५', inscriptShift: '%', remingtonNormal: '५', remingtonShift: '%', finger: 'index-l' },
    { code: 'Digit6', defaultChar: '6', shiftChar: '^', inscriptNormal: '६', inscriptShift: '^', remingtonNormal: '६', remingtonShift: '^', finger: 'index-r' },
    { code: 'Digit7', defaultChar: '7', shiftChar: '&', inscriptNormal: '७', inscriptShift: '&', remingtonNormal: '७', remingtonShift: '&', finger: 'index-r' },
    { code: 'Digit8', defaultChar: '8', shiftChar: '*', inscriptNormal: '८', inscriptShift: '*', remingtonNormal: '८', remingtonShift: '*', finger: 'middle-r' },
    { code: 'Digit9', defaultChar: '9', shiftChar: '(', inscriptNormal: '९', inscriptShift: '(', remingtonNormal: '९', remingtonShift: '(', finger: 'ring-r' },
    { code: 'Digit0', defaultChar: '0', shiftChar: ')', inscriptNormal: '०', inscriptShift: ')', remingtonNormal: '०', remingtonShift: ')', finger: 'pinky-r' },
    { code: 'Minus', defaultChar: '-', shiftChar: '_', inscriptNormal: '-', inscriptShift: 'ः', remingtonNormal: '-', remingtonShift: 'ऋ', finger: 'pinky-r' },
    { code: 'Equal', defaultChar: '=', shiftChar: '+', inscriptNormal: 'ृ', inscriptShift: 'ऋ', remingtonNormal: '=', remingtonShift: '+', finger: 'pinky-r' },
    { code: 'Backspace', defaultChar: 'Backspace', shiftChar: 'Backspace', finger: 'pinky-r', width: 'flex-[1.5]', isSpecial: true },
  ],
  // Row 2 (Top row: Q W E R T Y U I O P [ ])
  [
    { code: 'Tab', defaultChar: 'Tab', shiftChar: 'Tab', finger: 'pinky-l', width: 'flex-[1.3]', isSpecial: true },
    { code: 'KeyQ', defaultChar: 'q', shiftChar: 'Q', inscriptNormal: 'ौ', inscriptShift: 'औ', remingtonNormal: 'ु', remingtonShift: 'फ', finger: 'pinky-l' },
    { code: 'KeyW', defaultChar: 'w', shiftChar: 'W', inscriptNormal: 'ै', inscriptShift: 'ऐ', remingtonNormal: 'ू', remingtonShift: 'ॅ', finger: 'ring-l' },
    { code: 'KeyE', defaultChar: 'e', shiftChar: 'E', inscriptNormal: 'ा', inscriptShift: 'आ', remingtonNormal: 'म', remingtonShift: 'म्', finger: 'middle-l' },
    { code: 'KeyR', defaultChar: 'r', shiftChar: 'R', inscriptNormal: 'ी', inscriptShift: 'ई', remingtonNormal: 'त', remingtonShift: 'त्', finger: 'index-l' },
    { code: 'KeyT', defaultChar: 't', shiftChar: 'T', inscriptNormal: 'ू', inscriptShift: 'ऊ', remingtonNormal: 'ज', remingtonShift: 'ज्', finger: 'index-l' },
    { code: 'KeyY', defaultChar: 'y', shiftChar: 'Y', inscriptNormal: 'ब', inscriptShift: 'भ', remingtonNormal: 'ल', remingtonShift: 'ल्', finger: 'index-r' },
    { code: 'KeyU', defaultChar: 'u', shiftChar: 'U', inscriptNormal: 'ह', inscriptShift: 'ङ', remingtonNormal: 'न', remingtonShift: 'न्', finger: 'index-r' },
    { code: 'KeyI', defaultChar: 'i', shiftChar: 'I', inscriptNormal: 'ग', inscriptShift: 'घ', remingtonNormal: 'प', remingtonShift: 'प्', finger: 'middle-r' },
    { code: 'KeyO', defaultChar: 'o', shiftChar: 'O', inscriptNormal: 'द', inscriptShift: 'ध', remingtonNormal: 'व', remingtonShift: 'व्', finger: 'ring-r' },
    { code: 'KeyP', defaultChar: 'p', shiftChar: 'P', inscriptNormal: 'ज', inscriptShift: 'झ', remingtonNormal: 'च', remingtonShift: 'च्', finger: 'pinky-r' },
    { code: 'BracketLeft', defaultChar: '[', shiftChar: '{', inscriptNormal: 'ड', inscriptShift: 'ढ', remingtonNormal: 'ख', remingtonShift: 'ख्', finger: 'pinky-r' },
    { code: 'BracketRight', defaultChar: ']', shiftChar: '}', inscriptNormal: '़', inscriptShift: 'ञ', remingtonNormal: ',', remingtonShift: '?', finger: 'pinky-r' },
    { code: 'Backslash', defaultChar: '\\', shiftChar: '|', inscriptNormal: 'ॉ', inscriptShift: 'ऑ', remingtonNormal: '।', remingtonShift: '|', finger: 'pinky-r' },
  ],
  // Row 3 (Home row: A S D F G H J K L ; ')
  [
    { code: 'CapsLock', defaultChar: 'Caps', shiftChar: 'Caps', finger: 'pinky-l', width: 'flex-[1.6]', isSpecial: true },
    { code: 'KeyA', defaultChar: 'a', shiftChar: 'A', inscriptNormal: 'ो', inscriptShift: 'ओ', remingtonNormal: 'ं', remingtonShift: 'ँ', finger: 'pinky-l' },
    { code: 'KeyS', defaultChar: 's', shiftChar: 'S', inscriptNormal: 'े', inscriptShift: 'ए', remingtonNormal: 'े', remingtonShift: 'ै', finger: 'ring-l' },
    { code: 'KeyD', defaultChar: 'd', shiftChar: 'D', inscriptNormal: '्', inscriptShift: 'अ', remingtonNormal: 'क', remingtonShift: 'क्', finger: 'middle-l' },
    { code: 'KeyF', defaultChar: 'f', shiftChar: 'F', inscriptNormal: 'ि', inscriptShift: 'इ', remingtonNormal: 'ि', remingtonShift: 'थ', finger: 'index-l' },
    { code: 'KeyG', defaultChar: 'g', shiftChar: 'G', inscriptNormal: 'ु', inscriptShift: 'उ', remingtonNormal: 'ह', remingtonShift: 'भ', finger: 'index-l' },
    { code: 'KeyH', defaultChar: 'h', shiftChar: 'H', inscriptNormal: 'प', inscriptShift: 'फ', remingtonNormal: 'ी', remingtonShift: 'भ', finger: 'index-r' },
    { code: 'KeyJ', defaultChar: 'j', shiftChar: 'J', inscriptNormal: 'र', inscriptShift: 'ऋ', remingtonNormal: 'र', remingtonShift: 'श्र', finger: 'index-r' },
    { code: 'KeyK', defaultChar: 'k', shiftChar: 'K', inscriptNormal: 'क', inscriptShift: 'ख', remingtonNormal: 'ा', remingtonShift: 'ज्ञा', finger: 'middle-r' },
    { code: 'KeyL', defaultChar: 'l', shiftChar: 'L', inscriptNormal: 'त', inscriptShift: 'थ', remingtonNormal: 'स', remingtonShift: 'रू', finger: 'ring-r' },
    { code: 'Semicolon', defaultChar: ';', shiftChar: ':', inscriptNormal: 'च', inscriptShift: 'छ', remingtonNormal: 'य', remingtonShift: 'श्', finger: 'pinky-r' },
    { code: 'Quote', defaultChar: "'", shiftChar: '"', inscriptNormal: 'ट', inscriptShift: 'ठ', remingtonNormal: 'श', remingtonShift: 'ष्', finger: 'pinky-r' },
    { code: 'Enter', defaultChar: 'Enter', shiftChar: 'Enter', finger: 'pinky-r', width: 'flex-[1.9]', isSpecial: true },
  ],
  // Row 4 (Bottom row: Z X C V B N M , . /)
  [
    { code: 'ShiftLeft', defaultChar: 'Shift', shiftChar: 'Shift', finger: 'pinky-l', width: 'flex-[2.1]', isSpecial: true },
    { code: 'KeyZ', defaultChar: 'z', shiftChar: 'Z', inscriptNormal: 'ॆ', inscriptShift: 'ऒ', remingtonNormal: '्र', remingtonShift: 'र्', finger: 'pinky-l' },
    { code: 'KeyX', defaultChar: 'x', shiftChar: 'X', inscriptNormal: 'ं', inscriptShift: 'ँ', remingtonNormal: 'ग', remingtonShift: 'ग्', finger: 'ring-l' },
    { code: 'KeyC', defaultChar: 'c', shiftChar: 'C', inscriptNormal: 'म', inscriptShift: 'ण', remingtonNormal: 'ब', remingtonShift: 'ब्', finger: 'middle-l' },
    { code: 'KeyV', defaultChar: 'v', shiftChar: 'V', inscriptNormal: 'न', inscriptShift: 'ऩ', remingtonNormal: 'अ', remingtonShift: 'ट', finger: 'index-l' },
    { code: 'KeyB', defaultChar: 'b', shiftChar: 'B', inscriptNormal: 'व', inscriptShift: 'व', remingtonNormal: 'इ', remingtonShift: 'ठ', finger: 'index-l' },
    { code: 'KeyN', defaultChar: 'n', shiftChar: 'N', inscriptNormal: 'ल', inscriptShift: 'ळ', remingtonNormal: 'द', remingtonShift: 'छ', finger: 'index-r' },
    { code: 'KeyM', defaultChar: 'm', shiftChar: 'M', inscriptNormal: 'स', inscriptShift: 'श', remingtonNormal: 'उ', remingtonShift: 'ड', finger: 'index-r' },
    { code: 'Comma', defaultChar: ',', shiftChar: '<', inscriptNormal: ',', inscriptShift: 'ष', remingtonNormal: 'ए', remingtonShift: 'ढ', finger: 'middle-r' },
    { code: 'Period', defaultChar: '.', shiftChar: '>', inscriptNormal: '.', inscriptShift: '।', remingtonNormal: 'ण्', remingtonShift: 'झ', finger: 'ring-r' },
    { code: 'Slash', defaultChar: '/', shiftChar: '?', inscriptNormal: 'य', inscriptShift: 'य़', remingtonNormal: 'ध', remingtonShift: 'ध्', finger: 'pinky-r' },
    { code: 'ShiftRight', defaultChar: 'Shift', shiftChar: 'Shift', finger: 'pinky-r', width: 'flex-[2.1]', isSpecial: true },
  ],
  // Row 5 (Space row)
  [
    { code: 'ControlLeft', defaultChar: 'Ctrl', shiftChar: 'Ctrl', finger: 'pinky-l', width: 'flex-[1.2]', isSpecial: true },
    { code: 'AltLeft', defaultChar: 'Alt', shiftChar: 'Alt', finger: 'thumb', width: 'flex-[1.2]', isSpecial: true },
    { code: 'Space', defaultChar: 'Space', shiftChar: 'Space', inscriptNormal: ' ', inscriptShift: ' ', remingtonNormal: ' ', remingtonShift: ' ', finger: 'thumb', width: 'flex-[6.5]', isSpecial: true },
    { code: 'AltRight', defaultChar: 'Alt', shiftChar: 'Alt', finger: 'thumb', width: 'flex-[1.2]', isSpecial: true },
    { code: 'ControlRight', defaultChar: 'Ctrl', shiftChar: 'Ctrl', finger: 'pinky-r', width: 'flex-[1.2]', isSpecial: true },
  ]
];

// Map a character to the physical key and shift requirement
export function findKeyForChar(char: string, layout: 'english' | 'inscript' | 'remington'): { code: string; shift: boolean } | null {
  if (char === ' ') {
    return { code: 'Space', shift: false };
  }

  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (layout === 'english') {
        if (key.defaultChar.toLowerCase() === char.toLowerCase()) {
          const isShift = char === key.shiftChar || (char >= 'A' && char <= 'Z');
          return { code: key.code, shift: isShift };
        }
        if (key.shiftChar === char) {
          return { code: key.code, shift: true };
        }
      } else if (layout === 'inscript') {
        if (key.inscriptNormal === char) {
          return { code: key.code, shift: false };
        }
        if (key.inscriptShift === char) {
          return { code: key.code, shift: true };
        }
      } else if (layout === 'remington') {
        if (key.remingtonNormal === char) {
          return { code: key.code, shift: false };
        }
        if (key.remingtonShift === char) {
          return { code: key.code, shift: true };
        }
      }
    }
  }
  return null;
}

// Convert hardware key code and shift state to Hindi InScript or Remington character
export function getCharForPhysicalKey(
  code: string,
  shift: boolean,
  layout: 'inscript' | 'remington'
): string | null {
  if (code === 'Space') return ' ';

  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (key.code === code) {
        if (layout === 'inscript') {
          const char = shift ? key.inscriptShift : key.inscriptNormal;
          return char || null;
        } else if (layout === 'remington') {
          const char = shift ? key.remingtonShift : key.remingtonNormal;
          return char || null;
        }
      }
    }
  }
  return null;
}
