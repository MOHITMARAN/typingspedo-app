export interface WordToken {
  index: number;
  text: string;
  startIndex: number;
  endIndex: number;
  trailingSpace: boolean;
}

export interface TypingCursorContext {
  words: WordToken[];
  activeWordIndex: number;
  activeTargetWord: string;
  currentTypedWord: string;
  expectedRemaining: string;
  nextExpectedChar: string;
  isTargetCompleted: boolean;
}

export interface EvaluateInputParams {
  cleanTarget: string;
  typedText: string;
  addedText: string;
  isWordMode: boolean;
}

export interface EvaluateInputResult {
  nextTypedText: string;
  isCorrect: boolean;
  isSpace: boolean;
  errorIncrement: number;
  completedAfterInput: boolean;
}

/**
 * Splits clean target text into word tokens with character offsets.
 */
export function tokenizeTargetWords(cleanTarget: string): WordToken[] {
  if (!cleanTarget) return [];
  const rawTokens = cleanTarget.split(' ');
  let charOffset = 0;

  return rawTokens.map((rawWord, idx) => {
    const startIndex = charOffset;
    const endIndex = startIndex + rawWord.length;
    const hasSpace = idx < rawTokens.length - 1;
    charOffset = endIndex + (hasSpace ? 1 : 0);

    return {
      index: idx,
      text: rawWord,
      startIndex,
      endIndex,
      trailingSpace: hasSpace,
    };
  });
}

/**
 * Computes the aligned cursor context for either word-by-word Hindi mode
 * (Hindi Typing Test / Hindi Lesson Unit 2 & Word/Paragraph drills)
 * or character-by-character drill mode.
 */
export function getTypingCursorContext(
  cleanTarget: string,
  typedText: string,
  isWordMode: boolean
): TypingCursorContext {
  if (!isWordMode) {
    const expectedRemaining = cleanTarget.slice(typedText.length);
    return {
      words: [],
      activeWordIndex: -1,
      activeTargetWord: '',
      currentTypedWord: '',
      expectedRemaining,
      nextExpectedChar: expectedRemaining[0] || '',
      isTargetCompleted: cleanTarget.length > 0 && typedText.length >= cleanTarget.length,
    };
  }

  const words = tokenizeTargetWords(cleanTarget);
  if (words.length === 0) {
    return {
      words: [],
      activeWordIndex: 0,
      activeTargetWord: '',
      currentTypedWord: '',
      expectedRemaining: '',
      nextExpectedChar: '',
      isTargetCompleted: false,
    };
  }

  const typedWords = typedText.split(' ');
  const activeWordIndex = Math.min(typedWords.length - 1, words.length - 1);
  const activeTargetWord = words[activeWordIndex]?.text ?? '';
  const currentTypedWord = typedWords[activeWordIndex] ?? '';

  let expectedRemaining = '';
  let nextExpectedChar = '';

  if (currentTypedWord.length < activeTargetWord.length) {
    expectedRemaining = activeTargetWord.slice(currentTypedWord.length);
    nextExpectedChar = expectedRemaining[0] || '';
  } else if (activeWordIndex < words.length - 1) {
    const remainingWords = words
      .slice(activeWordIndex + 1)
      .map((w) => w.text)
      .join(' ');
    expectedRemaining = remainingWords ? ` ${remainingWords}` : ' ';
    nextExpectedChar = ' ';
  }

  const isOnLastWord = activeWordIndex === words.length - 1;
  const isTargetCompleted =
    cleanTarget.length > 0 &&
    isOnLastWord &&
    currentTypedWord.length >= activeTargetWord.length;

  return {
    words,
    activeWordIndex,
    activeTargetWord,
    currentTypedWord,
    expectedRemaining,
    nextExpectedChar,
    isTargetCompleted,
  };
}

/**
 * Evaluates newly typed text (single char, Space, or multi-char Remington/IME sequence)
 * against the aligned target position so mistakes in one word never desync subsequent words.
 */
export function evaluateAddedInput({
  cleanTarget,
  typedText,
  addedText,
  isWordMode,
}: EvaluateInputParams): EvaluateInputResult {
  if (!addedText) {
    const ctx = getTypingCursorContext(cleanTarget, typedText, isWordMode);
    return {
      nextTypedText: typedText,
      isCorrect: true,
      isSpace: false,
      errorIncrement: 0,
      completedAfterInput: ctx.isTargetCompleted,
    };
  }

  // If an IME or paste/swipe commits multiple characters containing spaces,
  // evaluate each segment sequentially so word boundaries stay aligned.
  if (isWordMode && addedText.length > 1 && addedText.includes(' ')) {
    let workingTyped = typedText;
    let allCorrect = true;
    let totalErrorInc = 0;
    let completed = false;
    const segments = addedText.match(/[^\s]+|\s/g) || [addedText];

    for (const seg of segments) {
      if (completed) break;
      const step = evaluateAddedInput({
        cleanTarget,
        typedText: workingTyped,
        addedText: seg,
        isWordMode: true,
      });
      workingTyped = step.nextTypedText;
      if (!step.isCorrect) allCorrect = false;
      totalErrorInc += step.errorIncrement;
      completed = step.completedAfterInput;
    }

    return {
      nextTypedText: workingTyped,
      isCorrect: allCorrect,
      isSpace: addedText.endsWith(' '),
      errorIncrement: totalErrorInc,
      completedAfterInput: completed,
    };
  }

  const isSpace = addedText === ' ';

  if (!isWordMode) {
    const expectedRemaining = cleanTarget.slice(typedText.length);
    const isCorrect =
      expectedRemaining.length > 0 && expectedRemaining.startsWith(addedText);
    const nextTypedText = typedText + addedText;
    const completedAfterInput =
      cleanTarget.length > 0 && nextTypedText.length >= cleanTarget.length;

    return {
      nextTypedText,
      isCorrect,
      isSpace,
      errorIncrement: isCorrect ? 0 : 1,
      completedAfterInput,
    };
  }

  const ctx = getTypingCursorContext(cleanTarget, typedText, true);
  const { words, activeWordIndex, activeTargetWord, currentTypedWord } = ctx;
  const isOnLastWord = words.length > 0 && activeWordIndex === words.length - 1;

  if (addedText === ' ') {
    // Guard against accidental double-space or empty-word Space skipping the next word
    if (currentTypedWord.length === 0) {
      return {
        nextTypedText: typedText,
        isCorrect: false,
        isSpace: true,
        errorIncrement: 1,
        completedAfterInput: false,
      };
    }

    // Space is expected once at least activeTargetWord.length chars have been entered
    // (mistyped letters inside the word already produced their own error buzz).
    const spaceExpectedNow = currentTypedWord.length >= activeTargetWord.length;

    if (isOnLastWord) {
      return {
        nextTypedText: typedText,
        isCorrect: spaceExpectedNow,
        isSpace: true,
        errorIncrement: spaceExpectedNow ? 0 : 1,
        completedAfterInput: true,
      };
    }

    const nextTypedText = typedText + ' ';
    return {
      nextTypedText,
      isCorrect: spaceExpectedNow,
      isSpace: true,
      errorIncrement: spaceExpectedNow ? 0 : 1,
      completedAfterInput: false,
    };
  }

  // Non-space input in Word Mode: evaluate against activeTargetWord from currentTypedWord.length
  const targetSlice =
    currentTypedWord.length < activeTargetWord.length
      ? activeTargetWord.slice(currentTypedWord.length)
      : '';
  const isCorrect = targetSlice.length > 0 && targetSlice.startsWith(addedText);
  const nextTypedText = typedText + addedText;
  const nextCtx = getTypingCursorContext(cleanTarget, nextTypedText, true);

  return {
    nextTypedText,
    isCorrect,
    isSpace: false,
    errorIncrement: isCorrect ? 0 : 1,
    completedAfterInput: nextCtx.isTargetCompleted,
  };
}
