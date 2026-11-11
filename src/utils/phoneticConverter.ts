/**
 * Lightweight and accurate Hindi phonetic (transliteration) converter.
 * Converts Roman script input (e.g. "namaste") to Devanagari script ("नमस्ते").
 */

const VOWEL_MAP: Record<string, string> = {
  a: 'अ',
  aa: 'आ',
  A: 'आ',
  i: 'इ',
  ee: 'ई',
  I: 'ई',
  u: 'उ',
  oo: 'ऊ',
  U: 'ऊ',
  e: 'ए',
  ai: 'ऐ',
  o: 'ओ',
  au: 'औ',
  ri: 'ऋ',
};

const MATRA_MAP: Record<string, string> = {
  aa: 'ा',
  a: '',
  A: 'ा',
  i: 'ि',
  ee: 'ी',
  I: 'ी',
  u: 'ु',
  oo: 'ू',
  U: 'ू',
  e: 'े',
  ai: 'ै',
  o: 'ो',
  au: 'ौ',
  ri: 'ृ',
};

const CONSONANT_MAP: Record<string, string> = {
  k: 'क',
  kh: 'ख',
  g: 'ग',
  gh: 'घ',
  ng: 'ङ',
  ch: 'च',
  chh: 'छ',
  j: 'ज',
  jh: 'झ',
  ny: 'ञ',
  t: 'ट',
  th: 'ठ',
  d: 'ड',
  dh: 'ढ',
  n: 'ण',
  T: 'त',
  Th: 'थ',
  D: 'द',
  Dh: 'ध',
  N: 'न',
  p: 'प',
  ph: 'फ',
  f: 'फ़',
  b: 'ब',
  bh: 'भ',
  m: 'म',
  y: 'य',
  r: 'र',
  l: 'ल',
  v: 'व',
  w: 'व',
  sh: 'श',
  shh: 'ष',
  s: 'स',
  h: 'ह',
  ksh: 'क्ष',
  tr: 'त्र',
  gy: 'ज्ञ',
  z: 'ज़',
};

// Common direct dictionary words for common words
const COMMON_WORD_MAP: Record<string, string> = {
  namaste: 'नमस्ते',
  namaskar: 'नमस्कार',
  bharat: 'भारत',
  shiksha: 'शिक्षा',
  hindi: 'हिंदी',
  abhyas: 'अभ्यास',
  desh: 'देश',
  pariksha: 'परीक्षा',
  safalta: 'सफलता',
  typing: 'टाइपिंग',
  samay: 'समय',
  gyan: 'ज्ञान',
  koshish: 'कोशिश',
  mehnat: 'मेहनत',
  dhanyawad: 'धन्यवाद',
  shubhkamna: 'शुभकामना',
  shanti: 'शांति',
  sarkar: 'सरकार',
  aaj: 'आज',
  kal: 'कल',
  hum: 'हम',
  aap: 'आप',
  main: 'मैं',
  hai: 'है',
  hain: 'हैं',
  tha: 'था',
  the: 'थे',
  kya: 'क्या',
  kaise: 'कैसे',
  kyun: 'क्यों',
  kripya: 'कृपया',
  vidyarthi: 'विद्यार्थी',
  pustak: 'पुस्तक',
  dost: 'दोस्त',
};

export function transliterateToHindi(input: string): string {
  if (!input) return '';

  const words = input.split(/(\s+)/);
  const convertedWords = words.map(word => {
    if (/^\s+$/.test(word)) return word;

    const lower = word.toLowerCase();
    if (COMMON_WORD_MAP[lower]) {
      return COMMON_WORD_MAP[lower];
    }

    // Heuristic transliterator
    let result = '';
    let i = 0;
    while (i < word.length) {
      // 3-char match
      if (i + 3 <= word.length) {
        const sub3 = word.substring(i, i + 3);
        if (CONSONANT_MAP[sub3]) {
          result += CONSONANT_MAP[sub3];
          i += 3;
          continue;
        }
      }

      // 2-char match
      if (i + 2 <= word.length) {
        const sub2 = word.substring(i, i + 2);
        if (CONSONANT_MAP[sub2]) {
          result += CONSONANT_MAP[sub2];
          i += 2;
          continue;
        }
        if (MATRA_MAP[sub2] && result.length > 0) {
          result += MATRA_MAP[sub2];
          i += 2;
          continue;
        }
        if (VOWEL_MAP[sub2]) {
          result += VOWEL_MAP[sub2];
          i += 2;
          continue;
        }
      }

      // 1-char match
      const char = word[i];
      if (MATRA_MAP[char] !== undefined && result.length > 0 && char !== 'a') {
        result += MATRA_MAP[char];
      } else if (VOWEL_MAP[char] && (result.length === 0 || word[i - 1] === ' ' || word[i - 1] === '-')) {
        result += VOWEL_MAP[char];
      } else if (CONSONANT_MAP[char]) {
        result += CONSONANT_MAP[char];
      } else {
        result += char;
      }
      i++;
    }

    return result;
  });

  return convertedWords.join('');
}
