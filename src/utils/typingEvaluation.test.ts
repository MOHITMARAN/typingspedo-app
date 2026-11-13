import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAddedInput, getTypingCursorContext } from './typingEvaluation';
import { findKeyForExpectedText } from '../data/keyboardLayouts';

test('Hindi Word Mode: typing accurately after a shorter mistyped word plays right sound and stays aligned', () => {
  const target = 'राम सीता आज';
  let typed = '';

  // Type 'र', 'म' (skipped 'ा') -> 'र' matches, 'म' mismatches index 1 ('ा')
  const step1 = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: 'र', isWordMode: true });
  assert.equal(step1.isCorrect, true);
  typed = step1.nextTypedText;

  const step2 = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: 'म', isWordMode: true });
  assert.equal(step2.isCorrect, false);
  typed = step2.nextTypedText;

  // Press Space to move to next word 'सीता'
  const step3 = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: ' ', isWordMode: true });
  assert.equal(step3.isCorrect, false); // 'रम' != 'राम'
  assert.equal(step3.isSpace, true);
  typed = step3.nextTypedText;
  assert.equal(typed, 'रम ');

  // Cursor context must now point to 'सीता' starting with 'स'
  const ctx = getTypingCursorContext(target, typed, true);
  assert.equal(ctx.activeWordIndex, 1);
  assert.equal(ctx.activeTargetWord, 'सीता');
  assert.equal(ctx.nextExpectedChar, 'स');

  // Every character of 'सीता' must now evaluate as CORRECT (right sound!)
  for (const ch of ['स', 'ी', 'त', 'ा']) {
    const res = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: ch, isWordMode: true });
    assert.equal(res.isCorrect, true, `Expected '${ch}' in 'सीता' to be correct after earlier word error`);
    assert.equal(res.errorIncrement, 0);
    typed = res.nextTypedText;
  }

  // Space after correctly typing 'सीता' must be CORRECT
  const spaceAfterSita = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: ' ', isWordMode: true });
  assert.equal(spaceAfterSita.isCorrect, true);
  assert.equal(spaceAfterSita.isSpace, true);
  typed = spaceAfterSita.nextTypedText;

  // Last word 'आज' completes cleanly even though 'राम' was 1 char shorter
  const aaj1 = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: 'आ', isWordMode: true });
  assert.equal(aaj1.isCorrect, true);
  assert.equal(aaj1.completedAfterInput, false);
  typed = aaj1.nextTypedText;

  const aaj2 = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: 'ज', isWordMode: true });
  assert.equal(aaj2.isCorrect, true);
  assert.equal(aaj2.completedAfterInput, true);
});

test('Hindi Word Mode: typing accurately after a longer mistyped word does not desync or complete early', () => {
  const target = 'कर तर पर';
  let typed = 'कखर '; // 3 chars instead of 2 for 'कर'

  const ctx = getTypingCursorContext(target, typed, true);
  assert.equal(ctx.activeWordIndex, 1);
  assert.equal(ctx.activeTargetWord, 'तर');
  assert.equal(ctx.isTargetCompleted, false);

  for (const ch of ['त', 'र', ' ']) {
    const res = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: ch, isWordMode: true });
    assert.equal(res.isCorrect, true);
    assert.equal(res.completedAfterInput, false);
    typed = res.nextTypedText;
  }

  // Now on 'पर' (last word)
  const p1 = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: 'प', isWordMode: true });
  assert.equal(p1.isCorrect, true);
  assert.equal(p1.completedAfterInput, false);
  typed = p1.nextTypedText;

  const p2 = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: 'र', isWordMode: true });
  assert.equal(p2.isCorrect, true);
  assert.equal(p2.completedAfterInput, true);
});

test('Hindi Word Mode: accidental double-space does not skip next word', () => {
  const target = 'राम सीता आज';
  let typed = 'राम '; // Ready at start of 'सीता'

  const doubleSpace = evaluateAddedInput({ cleanTarget: target, typedText: typed, addedText: ' ', isWordMode: true });
  assert.equal(doubleSpace.isCorrect, false);
  assert.equal(doubleSpace.nextTypedText, 'राम '); // Did NOT append second space!

  const ctx = getTypingCursorContext(target, doubleSpace.nextTypedText, true);
  assert.equal(ctx.activeWordIndex, 1);
  assert.equal(ctx.activeTargetWord, 'सीता');

  // Typing 'स' right after double-space succeeds!
  const nextKey = evaluateAddedInput({
    cleanTarget: target,
    typedText: doubleSpace.nextTypedText,
    addedText: 'स',
    isWordMode: true,
  });
  assert.equal(nextKey.isCorrect, true);
  assert.equal(nextKey.errorIncrement, 0);
});

test('Remington Gail multi-character keys match expected sequences cleanly', () => {
  const target = 'क्या धर्म';
  // First key in Remington for 'क्या' is Shift+D -> 'क्' (2 code units)
  const keyInfo = findKeyForExpectedText(target, 'remington');
  assert.deepEqual(keyInfo, { code: 'KeyD', shift: true, matchedText: 'क्' });

  const step1 = evaluateAddedInput({
    cleanTarget: target,
    typedText: '',
    addedText: 'क्',
    isWordMode: false,
  });
  assert.equal(step1.isCorrect, true);
  assert.equal(step1.errorIncrement, 0);
  assert.equal(step1.nextTypedText, 'क्');

  // Next char is 'य'
  const step2 = evaluateAddedInput({
    cleanTarget: target,
    typedText: step1.nextTypedText,
    addedText: 'य',
    isWordMode: false,
  });
  assert.equal(step2.isCorrect, true);
  assert.equal(step2.errorIncrement, 0);
});

test('Character Drill Mode: wrong key plays error, Backspace + right key plays click', () => {
  const target = 'कि कु के';
  const err = evaluateAddedInput({ cleanTarget: target, typedText: '', addedText: 'त', isWordMode: false });
  assert.equal(err.isCorrect, false);
  assert.equal(err.errorIncrement, 1);

  // Simulate Backspace (slice last char)
  const afterBackspace = err.nextTypedText.slice(0, -1);
  assert.equal(afterBackspace, '');

  // Retype correctly
  const fix = evaluateAddedInput({ cleanTarget: target, typedText: afterBackspace, addedText: 'क', isWordMode: false });
  assert.equal(fix.isCorrect, true);
  assert.equal(fix.errorIncrement, 0);
});

test('Hindi Word Mode: Space after same-length mistyped word plays Space click without double-penalizing', () => {
  const target = 'आज के समय';
  // Mistype 'आ' as 'त', then 'ज' accurately -> 'तज' (same length as 'आज')
  const s1 = evaluateAddedInput({ cleanTarget: target, typedText: '', addedText: 'त', isWordMode: true });
  assert.equal(s1.isCorrect, false);
  assert.equal(s1.errorIncrement, 1);

  const s2 = evaluateAddedInput({ cleanTarget: target, typedText: s1.nextTypedText, addedText: 'ज', isWordMode: true });
  assert.equal(s2.isCorrect, true);
  assert.equal(s2.errorIncrement, 0);

  // Cursor is now on Space; pressing Space moves cleanly to 'के' without an extra error buzz
  const s3 = evaluateAddedInput({ cleanTarget: target, typedText: s2.nextTypedText, addedText: ' ', isWordMode: true });
  assert.equal(s3.isCorrect, true);
  assert.equal(s3.isSpace, true);
  assert.equal(s3.errorIncrement, 0);
  assert.equal(s3.nextTypedText, 'तज ');

  const ctx = getTypingCursorContext(target, s3.nextTypedText, true);
  assert.equal(ctx.activeTargetWord, 'के');
  assert.equal(ctx.nextExpectedChar, 'क');
});

test('Hindi Unit 1 token alignment: premature Space or Remington length mismatch does not cascade errors', () => {
  const target = 'क् रि रु';
  // User accidentally hits 1-char 'क' instead of 2-char Remington 'क्', then Space
  const e1 = evaluateAddedInput({ cleanTarget: target, typedText: '', addedText: 'क', isWordMode: true });
  assert.equal(e1.isCorrect, true); // 'क्'.startsWith('क')

  const e2 = evaluateAddedInput({ cleanTarget: target, typedText: e1.nextTypedText, addedText: ' ', isWordMode: true });
  assert.equal(e2.isCorrect, false); // skipped '्' before Space
  assert.equal(e2.nextTypedText, 'क ');

  // Next token 'रि' must align cleanly at index 0
  const r1 = evaluateAddedInput({ cleanTarget: target, typedText: e2.nextTypedText, addedText: 'र', isWordMode: true });
  assert.equal(r1.isCorrect, true);
  assert.equal(r1.errorIncrement, 0);

  const r2 = evaluateAddedInput({ cleanTarget: target, typedText: r1.nextTypedText, addedText: 'ि', isWordMode: true });
  assert.equal(r2.isCorrect, true);
  assert.equal(r2.errorIncrement, 0);
});

test('OS IME multi-character commit with trailing space evaluates cleanly word-by-word', () => {
  const target = 'आज के समय';
  const imeCommit = evaluateAddedInput({
    cleanTarget: target,
    typedText: '',
    addedText: 'आज ',
    isWordMode: true,
  });
  assert.equal(imeCommit.isCorrect, true);
  assert.equal(imeCommit.errorIncrement, 0);
  assert.equal(imeCommit.nextTypedText, 'आज ');

  const ctx = getTypingCursorContext(target, imeCommit.nextTypedText, true);
  assert.equal(ctx.activeWordIndex, 1);
  assert.equal(ctx.activeTargetWord, 'के');
});

