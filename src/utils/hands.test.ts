import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getFingerInstructionForChar,
  getHomeKeyForFinger,
  getShiftFingerForFinger,
  getFingerDisplayName,
} from './hands';

test('Virtual Hands - Home Row Finger Mapping', () => {
  // Left Hand Home Row: A S D F
  const fA = getFingerInstructionForChar('a', 'english');
  assert.equal(fA?.finger, 'pinky-l');
  assert.equal(fA?.homeKey, 'A');
  assert.equal(fA?.hand, 'left');

  const fS = getFingerInstructionForChar('s', 'english');
  assert.equal(fS?.finger, 'ring-l');
  assert.equal(fS?.homeKey, 'S');

  const fD = getFingerInstructionForChar('d', 'english');
  assert.equal(fD?.finger, 'middle-l');
  assert.equal(fD?.homeKey, 'D');

  const fF = getFingerInstructionForChar('f', 'english');
  assert.equal(fF?.finger, 'index-l');
  assert.equal(fF?.homeKey, 'F');

  // Right Hand Home Row: J K L ;
  const fJ = getFingerInstructionForChar('j', 'english');
  assert.equal(fJ?.finger, 'index-r');
  assert.equal(fJ?.homeKey, 'J');
  assert.equal(fJ?.hand, 'right');

  const fK = getFingerInstructionForChar('k', 'english');
  assert.equal(fK?.finger, 'middle-r');
  assert.equal(fK?.homeKey, 'K');

  const fL = getFingerInstructionForChar('l', 'english');
  assert.equal(fL?.finger, 'ring-r');
  assert.equal(fL?.homeKey, 'L');

  const fSemi = getFingerInstructionForChar(';', 'english');
  assert.equal(fSemi?.finger, 'pinky-r');
  assert.equal(fSemi?.homeKey, ';');

  // Spacebar -> Thumb
  const fSpace = getFingerInstructionForChar(' ', 'english');
  assert.equal(fSpace?.finger, 'thumb');
  assert.equal(fSpace?.hand, 'thumb');
});

test('Virtual Hands - Shift Key Ergonomic Rules (Opposite Pinky)', () => {
  // Uppercase 'F' (Left Index) requires Right Pinky on Shift
  const fUpperF = getFingerInstructionForChar('F', 'english');
  assert.equal(fUpperF?.finger, 'index-l');
  assert.equal(fUpperF?.shiftRequired, true);
  assert.equal(fUpperF?.shiftFinger, 'pinky-r');

  // Uppercase 'J' (Right Index) requires Left Pinky on Shift
  const fUpperJ = getFingerInstructionForChar('J', 'english');
  assert.equal(fUpperJ?.finger, 'index-r');
  assert.equal(fUpperJ?.shiftRequired, true);
  assert.equal(fUpperJ?.shiftFinger, 'pinky-l');

  // Direct helper test
  assert.equal(getShiftFingerForFinger('index-l'), 'pinky-r');
  assert.equal(getShiftFingerForFinger('middle-l'), 'pinky-r');
  assert.equal(getShiftFingerForFinger('index-r'), 'pinky-l');
  assert.equal(getShiftFingerForFinger('ring-r'), 'pinky-l');
});

test('Virtual Hands - Hindi InScript Finger Mapping', () => {
  // InScript: 'क' is on KeyK -> Right Middle Finger
  const fKa = getFingerInstructionForChar('क', 'inscript');
  assert.equal(fKa?.finger, 'middle-r');
  assert.equal(fKa?.code, 'KeyK');
  assert.equal(fKa?.shiftRequired, false);

  // InScript: 'ख' is on Shift + KeyK -> Right Middle Finger + Left Pinky Shift
  const fKha = getFingerInstructionForChar('ख', 'inscript');
  assert.equal(fKha?.finger, 'middle-r');
  assert.equal(fKha?.code, 'KeyK');
  assert.equal(fKha?.shiftRequired, true);
  assert.equal(fKha?.shiftFinger, 'pinky-l');

  // InScript: 'ि' (Matra) is on KeyF -> Left Index Finger
  const fMatraI = getFingerInstructionForChar('ि', 'inscript');
  assert.equal(fMatraI?.finger, 'index-l');
  assert.equal(fMatraI?.code, 'KeyF');
});

test('Virtual Hands - Display Names & Home Keys', () => {
  assert.equal(getHomeKeyForFinger('index-l'), 'F');
  assert.equal(getHomeKeyForFinger('index-r'), 'J');
  assert.equal(getFingerDisplayName('index-l'), 'Left Index Finger');
  assert.equal(getFingerDisplayName('pinky-r'), 'Right Pinky');
});

test('Virtual Hands - Hindi InScript Purna Viram and Symbols', () => {
  const fViram = getFingerInstructionForChar('।', 'inscript');
  assert.ok(fViram);
  assert.equal(fViram.code, 'Period');
  assert.equal(fViram.finger, 'ring-r');
  assert.equal(fViram.shiftRequired, true);
  assert.equal(fViram.shiftFinger, 'pinky-l');
});

test('Virtual Hands - Hindi Phonetic Layout Finger Mapping', () => {
  // Phonetic: 'क' maps to 'k' -> Right Middle Finger
  const fKa = getFingerInstructionForChar('क', 'phonetic');
  assert.ok(fKa);
  assert.equal(fKa.finger, 'middle-r');
  assert.equal(fKa.code, 'KeyK');

  // Phonetic: 'म' maps to 'm' -> Right Index Finger (KeyM)
  const fMa = getFingerInstructionForChar('म', 'phonetic');
  assert.ok(fMa);
  assert.equal(fMa.finger, 'index-r');
  assert.equal(fMa.code, 'KeyM');
});

