export interface OrientationSection {
  title: string;
  description: string;
  keyPoints: string[];
  interactiveHighlightKeys?: string[];
}

export interface BeginnerUnit {
  id: string;
  unitNumber: 1 | 2 | 3;
  name: string;
  type: 'orientation' | 'learn' | 'guided_practice' | 'challenge';
  instruction: string;
  orientationSections?: OrientationSection[];
  fingerTips?: {
    key: string;
    finger: string;
    hand: 'Left' | 'Right';
    reach: string;
  }[];
  exerciseText?: string;
  minAccuracyToPass?: number;
  hideKeyboardHints?: boolean;
}

export interface BeginnerLesson {
  id: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  newKeys: string[];
  learnedKeys: string[];
  units: [BeginnerUnit, BeginnerUnit, BeginnerUnit];
}

export const ENGLISH_BEGINNER_LESSONS: BeginnerLesson[] = [
  // ===========================================================================
  // LESSON 1: HOME ROW ANCHOR KEYS (A S D F J K L ; and Space)
  // ===========================================================================
  {
    id: 'eng-beg-1',
    lessonNumber: 1,
    title: 'Home Row Foundation',
    subtitle: 'Master your primary anchor keys: F, J, D, K, S, L, A, ; and Spacebar',
    newKeys: ['F', 'J', 'D', 'K', 'S', 'L', 'A', ';', 'Space'],
    learnedKeys: ['F', 'J', 'D', 'K', 'S', 'L', 'A', ';', ' '],
    units: [
      {
        id: 'eng-beg-1-u1',
        unitNumber: 1,
        name: 'Ergonomic Home Row Placement',
        type: 'orientation',
        instruction: 'Feel the tactile ridges on F and J to position your index fingers without looking.',
        orientationSections: [
          {
            title: 'Natural Hand Arch & Resting Posture',
            description: 'Curve your fingers naturally like holding a baseball. Lightly rest your left fingers on A-S-D-F and right fingers on J-K-L-;. Thumbs hover gently above the spacebar.',
            keyPoints: [
              'Left Hand: Pinky on A, Ring on S, Middle on D, Index on F',
              'Right Hand: Index on J, Middle on K, Ring on L, Pinky on Semicolon (;)',
              'Always return to this home position after reaching for any key.',
            ],
            interactiveHighlightKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Space'],
          },
          {
            title: 'Tactile Navigation Without Looking',
            description: 'Notice the tiny raised ridges on the F and J keycaps. They allow you to locate home row instantly by touch alone.',
            keyPoints: [
              'Keep your eyes on the screen, never down at your fingers.',
              'Tap keys lightly with quick, springy finger motions.',
              'Use your thumb to press the spacebar with a quick flick.',
            ],
            interactiveHighlightKeys: ['KeyF', 'KeyJ', 'Space'],
          },
        ],
        exerciseText: 'f j d k s l a ; f j d k s l a ; fj dk sl a; fff jjj ddd kkk sss lll aaa ;;;',
        minAccuracyToPass: 85,
      },
      {
        id: 'eng-beg-1-u2',
        unitNumber: 2,
        name: 'Home Key Repetitions',
        type: 'guided_practice',
        instruction: 'Type each group in steady rhythm. Keep your palms slightly elevated above the desk.',
        exerciseText: 'fff jjj ddd kkk sss lll aaa ;;; asdf jkl; fdsa ;lkj fjdk sla; fads jalk lads alas fall salad flask',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-1-u3',
        unitNumber: 3,
        name: 'Home Row Benchmark Challenge',
        type: 'challenge',
        instruction: 'Complete this test with at least 90% accuracy to unlock Lesson 2.',
        exerciseText: 'a sad lad; all lads fall; dad asks a lad; flash a flask; salads and fall; dad had a salad; alas a sad fall;',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 2: CENTER HOME ROW KEYS (G & H)
  // ===========================================================================
  {
    id: 'eng-beg-2',
    lessonNumber: 2,
    title: 'Center Home Keys (G & H)',
    subtitle: 'Learn the horizontal index reaches: Left index to G, Right index to H',
    newKeys: ['G', 'H'],
    learnedKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', ' '],
    units: [
      {
        id: 'eng-beg-2-u1',
        unitNumber: 1,
        name: 'G and H Reach Drills',
        type: 'learn',
        instruction: 'Reach your left index sideways to G and right index sideways to H, then snap back to home position.',
        exerciseText: 'fgf jhj fgf jhj ggg hhh gag hah fgh jhg gas had has glad half shag dash flash',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-2-u2',
        unitNumber: 2,
        name: 'Word Building with G & H',
        type: 'guided_practice',
        instruction: 'Maintain consistent speed across words. Snap your fingers right back to F and J.',
        exerciseText: 'had has flag glad half dash flash glass shall hall fall gala dash half glass flags',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-2-u3',
        unitNumber: 3,
        name: 'Home Row Complete Challenge',
        type: 'challenge',
        instruction: 'Demonstrate complete home row mastery with 90%+ accuracy.',
        exerciseText: 'a glad lad had a flag; dad had a glass flask; flash a half salad; all lads had flags; a glad dad had gas;',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 3: TOP ROW VOWELS (E & I)
  // ===========================================================================
  {
    id: 'eng-beg-3',
    lessonNumber: 3,
    title: 'Top Row Vowels (E & I)',
    subtitle: 'Reaching up: Left middle finger to E, Right middle finger to I',
    newKeys: ['E', 'I'],
    learnedKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', 'E', 'I', ' '],
    units: [
      {
        id: 'eng-beg-3-u1',
        unitNumber: 1,
        name: 'E and I Vertical Reaches',
        type: 'learn',
        instruction: 'Reach your middle fingers straight up from D to E and from K to I.',
        exerciseText: 'ded kik ded kik ede iki eee iii fed kid see lie die see fee ill fill dill silk',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-3-u2',
        unitNumber: 2,
        name: 'Vocabulary with E & I',
        type: 'guided_practice',
        instruction: 'Type real words smoothly without looking down at the keyboard.',
        exerciseText: 'like life lead file side fish desk heal seal lake fake fade hide slide dial fell tell kill',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-3-u3',
        unitNumber: 3,
        name: 'Vowel Speed Challenge',
        type: 'challenge',
        instruction: 'Keep accuracy above 90% while typing smooth English sentences.',
        exerciseText: 'she fed all his fish; he likes a fresh dish; life is like a sail; she said he is safe; he fills a silk file;',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 4: TOP ROW CONSONANTS (R & U)
  // ===========================================================================
  {
    id: 'eng-beg-4',
    lessonNumber: 4,
    title: 'Top Row Index Keys (R & U)',
    subtitle: 'Reaching up: Left index to R, Right index to U',
    newKeys: ['R', 'U'],
    learnedKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', 'E', 'I', 'R', 'U', ' '],
    units: [
      {
        id: 'eng-beg-4-u1',
        unitNumber: 1,
        name: 'R and U Reach Exercises',
        type: 'learn',
        instruction: 'Reach left index up-left to R, right index up-left to U, snapping back to F and J.',
        exerciseText: 'frf juj frf juj rrr uuu red rug fur run ear use sir her jar far rule user cure',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-4-u2',
        unitNumber: 2,
        name: 'R & U Word Expansion',
        type: 'guided_practice',
        instruction: 'Combine newly learned keys into practical English words.',
        exerciseText: 'rule user dark surf pure hard girl rush sure true fire ride dear fear hear near fair care',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-4-u3',
        unitNumber: 3,
        name: 'Fluid Sentence Sprint',
        type: 'challenge',
        instruction: 'Pass with at least 90% accuracy to unlock Lesson 5.',
        exerciseText: 'the girl said her rule is pure; dark clouds rush far ahead; user ride is hard; hear her fear; true fire is pure;',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 5: TOP ROW CENTER KEYS (T & Y)
  // ===========================================================================
  {
    id: 'eng-beg-5',
    lessonNumber: 5,
    title: 'Top Row Center Reaches (T & Y)',
    subtitle: 'Reach left index up-right to T, right index up-left to Y',
    newKeys: ['T', 'Y'],
    learnedKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', 'E', 'I', 'R', 'U', 'T', 'Y', ' '],
    units: [
      {
        id: 'eng-beg-5-u1',
        unitNumber: 1,
        name: 'T and Y Reach Drills',
        type: 'learn',
        instruction: 'Extend your index finger to T and Y without lifting your palms excessively.',
        exerciseText: 'ftf jyj ftf jyj ttt yyy try toy yet let the try day say get pay they that stay your',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-5-u2',
        unitNumber: 2,
        name: 'High-Frequency T & Y Words',
        type: 'guided_practice',
        instruction: 'Build muscle memory for very common words like that, they, year, stay.',
        exerciseText: 'today yesterday youth trust style light truth stay duty play star year city study party story',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-5-u3',
        unitNumber: 3,
        name: 'Confidence Sprint',
        type: 'challenge',
        instruction: 'Achieve 90%+ accuracy on real conversational sentences.',
        exerciseText: 'trust the true youth today; stay right and play your part; yesterday was light; they study their city party;',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 6: TOP ROW OUTER KEYS (W, O, Q, P)
  // ===========================================================================
  {
    id: 'eng-beg-6',
    lessonNumber: 6,
    title: 'Top Row Outer Reaches (W, O, Q, P)',
    subtitle: 'Master W & Q on left hand, O & P on right hand',
    newKeys: ['W', 'O', 'Q', 'P'],
    learnedKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', 'E', 'I', 'R', 'U', 'T', 'Y', 'W', 'O', 'Q', 'P', ' '],
    units: [
      {
        id: 'eng-beg-6-u1',
        unitNumber: 1,
        name: 'W, O, Q, P Key Patterns',
        type: 'learn',
        instruction: 'Left ring reaches up to W, left pinky to Q. Right ring reaches to O, right pinky to P.',
        exerciseText: 'sws lol aqa ;p; www ooo qqq ppp who owl pop top quote power word work hope open equip',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-6-u2',
        unitNumber: 2,
        name: 'Complete Top Row Vocabulary',
        type: 'guided_practice',
        instruction: 'Type with steady keystrokes. Focus on accuracy over raw speed.',
        exerciseText: 'quick quote power quiet world write proud phone paper plant point report people water order',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-6-u3',
        unitNumber: 3,
        name: 'Two-Row Benchmark Challenge',
        type: 'challenge',
        instruction: 'Complete this test to unlock the bottom row lessons.',
        exerciseText: 'a quick brown fox jumps over; work with quiet power and proud hope; write words well; people report proper water orders;',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 7: BOTTOM ROW PRIMARY KEYS (V, M, C, N)
  // ===========================================================================
  {
    id: 'eng-beg-7',
    lessonNumber: 7,
    title: 'Bottom Row Core Keys (V, M, C, N)',
    subtitle: 'Downward reaches: Left hand to V and C, Right hand to M and N',
    newKeys: ['V', 'M', 'C', 'N'],
    learnedKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', 'E', 'I', 'R', 'U', 'T', 'Y', 'W', 'O', 'Q', 'P', 'V', 'M', 'C', 'N', ' '],
    units: [
      {
        id: 'eng-beg-7-u1',
        unitNumber: 1,
        name: 'Downward Reaches (V, M, C, N)',
        type: 'learn',
        instruction: 'Reach down lightly without changing your wrist angle. Return to home position immediately.',
        exerciseText: 'fvf jmj dcd jnj vvv mmm ccc nnn van man can now men name come move voice mind clean',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-7-u2',
        unitNumber: 2,
        name: 'Core Word Fluency',
        type: 'guided_practice',
        instruction: 'Practice essential common words that rely on the bottom row keys.',
        exerciseText: 'move come voice mind clean make form nice fine view mean calm line music never common number machine',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-7-u3',
        unitNumber: 3,
        name: 'Sentence Accuracy Challenge',
        type: 'challenge',
        instruction: 'Achieve 90%+ accuracy on full natural sentences.',
        exerciseText: 'can a calm man move mountains; come now and make a clean view; form a firm voice; clean lines make fine music;',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 8: BOTTOM ROW OUTER KEYS & PUNCTUATION (B, X, Z, Comma, Period)
  // ===========================================================================
  {
    id: 'eng-beg-8',
    lessonNumber: 8,
    title: 'Bottom Row Complete & Punctuation',
    subtitle: 'Reaching B, X, Z and essential punctuation keys: Comma (,) and Period (.)',
    newKeys: ['B', 'X', 'Z', ',', '.'],
    learnedKeys: ['A-Z', ',', '.', ' '],
    units: [
      {
        id: 'eng-beg-8-u1',
        unitNumber: 1,
        name: 'B, X, Z and Punctuation Reaches',
        type: 'learn',
        instruction: 'Left index reaches down-right to B, left ring to X, left pinky to Z. Right middle to comma, right ring to period.',
        exerciseText: 'fbf sxs aza k,k l.l bbb xxx zzz box zip buzz next text fact back size zero calm, wise. true, clear.',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-8-u2',
        unitNumber: 2,
        name: 'Full Alphabet Sentences',
        type: 'guided_practice',
        instruction: 'Type with commas and periods. Remember: always press space after a comma or period.',
        exerciseText: 'be brave, calm, and wise. zebras, foxes, and bears graze in peace. text books, quiz papers, and size zero boxes.',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-8-u3',
        unitNumber: 3,
        name: 'Full Alphabet Benchmark',
        type: 'challenge',
        instruction: 'Master all 26 lowercase English letters and basic punctuation.',
        exerciseText: 'pack my box with five dozen jugs. zinc, bronze, and copper are strong metals. quick lazy dogs bark, jump, and run.',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 9: SHIFT KEYS & CAPITALIZATION
  // ===========================================================================
  {
    id: 'eng-beg-9',
    lessonNumber: 9,
    title: 'Shift Keys & Capitalization',
    subtitle: 'Learn the opposite-shift rule for ergonomic and effortless capital letters',
    newKeys: ['ShiftLeft', 'ShiftRight'],
    learnedKeys: ['A-Z', 'a-z', ',', '.', ' '],
    units: [
      {
        id: 'eng-beg-9-u1',
        unitNumber: 1,
        name: 'Opposite-Hand Shift Technique',
        type: 'learn',
        instruction: 'For letters typed by the right hand, hold Shift with the left pinky. For letters on the left hand, hold Shift with the right pinky.',
        exerciseText: 'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-9-u2',
        unitNumber: 2,
        name: 'Proper Nouns & Capitalization',
        type: 'guided_practice',
        instruction: 'Type names of places, months, and formal sentences with proper capitals.',
        exerciseText: 'India, Delhi, London, Paris, New York, Tokyo. Monday, Friday, July, August. John, Mary, David, Sarah, Peter.',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-9-u3',
        unitNumber: 3,
        name: 'Capitalization Speed Challenge',
        type: 'challenge',
        instruction: 'Maintain rhythm while shifting between lowercase and uppercase letters.',
        exerciseText: 'Success comes to those who persevere. Honest effort brings lasting pride. Always strive for excellence in every task.',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 10: NUMBER ROW & DIGITS (1 TO 0)
  // ===========================================================================
  {
    id: 'eng-beg-10',
    lessonNumber: 10,
    title: 'Number Row & Numerals (1 to 0)',
    subtitle: 'Reaching from home row up to the top number keys without glancing down',
    newKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    learnedKeys: ['All letters', '1-0', ',', '.', ' '],
    units: [
      {
        id: 'eng-beg-10-u1',
        unitNumber: 1,
        name: 'Number Row Reaches',
        type: 'learn',
        instruction: 'Extend fingers upward: A to 1, S to 2, D to 3, F to 4 and 5; J to 6 and 7, K to 8, L to 9, ; to 0.',
        exerciseText: '1 2 3 4 5 6 7 8 9 0 10 20 30 40 50 60 70 80 90 100 2026 365 24 7 45 90 12 34 56 78 90',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-10-u2',
        unitNumber: 2,
        name: 'Dates, Times & Statistics',
        type: 'guided_practice',
        instruction: 'Type real-world numbers embedded in natural English sentences.',
        exerciseText: 'room 101, class 12, year 2026, 45 words per minute, 100 percent accuracy, 24 hours a day, 365 days a year.',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-10-u3',
        unitNumber: 3,
        name: 'Alphanumeric Challenge',
        type: 'challenge',
        instruction: 'Achieve 90%+ accuracy on mixed letters and numbers.',
        exerciseText: 'in 2026, 500 students typed 1500 words in 30 days. top score was 98 percent on test 4 with 55 wpm speed.',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 11: COMMON SYMBOLS & SPECIAL PUNCTUATION (! ? " ' - :)
  // ===========================================================================
  {
    id: 'eng-beg-11',
    lessonNumber: 11,
    title: 'Symbols & Special Punctuation',
    subtitle: 'Exclamation (!), Question mark (?), Quotes ("), Apostrophe (\'), Hyphen (-), Colon (:)',
    newKeys: ['!', '?', '"', "'", '-', ':'],
    learnedKeys: ['All letters', 'Numbers', 'All punctuation'],
    units: [
      {
        id: 'eng-beg-11-u1',
        unitNumber: 1,
        name: 'Symbol Identification Drills',
        type: 'learn',
        instruction: 'Use Shift with Digit1 for (!), Slash for (?), Quote for ("), and Semicolon for (:).',
        exerciseText: '! ? : " \' - what? why! how? well-done: "great job!" it\'s time; high-speed touch-typing: ready, set, go!',
        minAccuracyToPass: 88,
      },
      {
        id: 'eng-beg-11-u2',
        unitNumber: 2,
        name: 'Dialogue & Quotation Practice',
        type: 'guided_practice',
        instruction: 'Type expressive English sentences with accurate quotation marks and apostrophes.',
        exerciseText: '"Knowledge is power," she said. Don\'t give up! Are you ready? Yes, absolutely! Work hard; achieve more.',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-11-u3',
        unitNumber: 3,
        name: 'Punctuation Precision Challenge',
        type: 'challenge',
        instruction: 'Demonstrate flawless punctuation control with 90%+ accuracy.',
        exerciseText: '"To be or not to be: that is the question!" Take note-every single keystroke counts towards 100% precision.',
        minAccuracyToPass: 90,
      },
    ],
  },

  // ===========================================================================
  // LESSON 12: BEGINNER TOUCH TYPING GRADUATION
  // ===========================================================================
  {
    id: 'eng-beg-12',
    lessonNumber: 12,
    title: 'Beginner School Graduation',
    subtitle: 'Comprehensive full-keyboard benchmark assessment across all letters, numbers, and symbols',
    newKeys: ['All Keys Review'],
    learnedKeys: ['Full Keyboard Mastery'],
    units: [
      {
        id: 'eng-beg-12-u1',
        unitNumber: 1,
        name: 'Full Keyboard Warmup Sprint',
        type: 'learn',
        instruction: 'Warm up all fingers across all three letter rows, number row, and punctuation keys.',
        exerciseText: 'The quick brown fox jumps over 10 lazy dogs! Pack my box with five dozen liquor jugs: 100% precision.',
        minAccuracyToPass: 90,
      },
      {
        id: 'eng-beg-12-u2',
        unitNumber: 2,
        name: 'Cadence & Rhythm Drill',
        type: 'guided_practice',
        instruction: 'Type smoothly without pausing between letters. Maintain a calm, relaxed posture.',
        exerciseText: 'Patience and persistence are the foundation of professional touch typing. With regular daily practice, your fingers move automatically without conscious thought.',
        minAccuracyToPass: 92,
      },
      {
        id: 'eng-beg-12-u3',
        unitNumber: 3,
        name: 'Official Graduation Benchmark',
        type: 'challenge',
        instruction: 'Pass with at least 92% accuracy to complete the Beginner Touch Typing School.',
        exerciseText: 'Congratulations on reaching the final graduation milestone of the Beginner Touch Typing School! You have trained all ten fingers across home row, top row, bottom row, numerals, and punctuation. Continue forward to the Intermediate speed sprints and official examination challenges.',
        minAccuracyToPass: 92,
      },
    ],
  },
];
