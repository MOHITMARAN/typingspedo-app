import { Lesson } from '../types';

export const ENGLISH_LESSONS: Lesson[] = [
  // ===========================================================================
  // INTERMEDIATE TIER (Target WPM: 30 - 40 WPM)
  // Focus: Common bigrams/trigrams, top 100 words, business emails, punctuation flow
  // ===========================================================================
  {
    id: 'eng-int-01',
    title: 'Common N-Grams & Fluid Transitions',
    subtitle: 'Master the most frequent letter pairs and triples (th, he, in, er, an, re, on, tion).',
    language: 'english',
    level: 'intermediate',
    targetWpm: 30,
    content:
      'The quick flow of typing comes from repeating common patterns. High frequency clusters like th, he, in, er, an, re, on, at, en, nd, ed, and tion form the backbone of English prose. When you practice these combinations repeatedly, your fingers learn to glide in smooth motions rather than striking isolated keys. Maintain a calm, continuous rhythm without pausing between letters.',
  },
  {
    id: 'eng-int-02',
    title: 'Top 100 High-Frequency English Words',
    subtitle: 'Build instantaneous muscle memory for core vocabulary used in over 50% of English text.',
    language: 'english',
    level: 'intermediate',
    targetWpm: 32,
    content:
      'A typist who can write the most frequent words with zero hesitation will instantly achieve higher speed. Words like the, of, and, a, to, in, is, you, that, it, he, was, for, on, are, as, with, his, they, at, be, this, have, from, or, one, had, by, word, but, not, what, all, were, we, when, your, can, said, there, each, which, she, do, how, their, if, will, up, other, about, out, many, then, them, these, so, some, her, would, make, like, him, into, time, has, look, two, more, write, go, see, number, no, way, could, people, my, than, first, water, been, call, who, oil, its, now, find, long, down, day, did, get, come, made, may, and part.',
  },
  {
    id: 'eng-int-03',
    title: 'Workplace & Professional Email Drafts',
    subtitle: 'Type realistic business communications, meeting minutes, and professional memos.',
    language: 'english',
    level: 'intermediate',
    targetWpm: 35,
    content:
      'Dear Project Team, Please find attached the updated project milestone schedule for the second quarter. All department leads are requested to review the deliverables and submit feedback by Thursday afternoon. We will convene a summary meeting in Conference Hall B to finalize the action items and allocate resources for the upcoming release. Your timely cooperation is greatly appreciated.',
  },
  {
    id: 'eng-int-04',
    title: 'Complex Punctuation & Sentence Rhythm',
    subtitle: 'Practice seamless integration of commas, semicolons, quotation marks, and hyphens.',
    language: 'english',
    level: 'intermediate',
    targetWpm: 36,
    content:
      'Typing fluency requires mastery over punctuation marks: commas, periods, colons, and semicolons; each serves a vital grammatical purpose. As the saying goes, "Practice makes perfect" - but thoughtful, deliberate practice yields true excellence. Notice how the shift key coordinates with your pinky fingers while the opposite hand strikes the required symbol. Precision must precede speed in every disciplined endeavor.',
  },
  {
    id: 'eng-int-05',
    title: 'Digital Technology & Modern Workflows',
    subtitle: 'Vocabulary covering software architecture, cloud platforms, and cybersecurity.',
    language: 'english',
    level: 'intermediate',
    targetWpm: 38,
    content:
      'Modern organizations depend upon cloud computing, secure network protocols, and distributed software systems. Agile teams utilize automated continuous integration pipelines to deploy robust web applications. Data integrity, encryption standards, and responsive user interface design form the bedrock of dependable modern software products. Continual learning and technological literacy are essential in today\'s digital economy.',
  },
  {
    id: 'eng-int-06',
    title: 'Intermediate Speed Sprint (40 WPM Benchmark)',
    subtitle: 'Test your continuous rhythm and steady cadence on a standard non-stop passage.',
    language: 'english',
    level: 'intermediate',
    targetWpm: 40,
    content:
      'True typing speed is not measured in short bursts of wild key strikes, but in consistent, measured rhythm over minutes of focused effort. Keep your shoulders relaxed, wrists hovering slightly above the table, and breathing steady. Each word should flow smoothly into the next without hesitation. When you maintain high accuracy, speed develops naturally without added strain.',
  },

  // ===========================================================================
  // ADVANCED TIER (Target WPM: 45 - 60 WPM)
  // Focus: SSC/Clerical exam passages, legal transcription, scientific/economic prose
  // ===========================================================================
  {
    id: 'eng-adv-01',
    title: 'SSC CGL & CHSL Exam Standard Passage',
    subtitle: 'Official government clerical speed test standard focusing on accuracy and stamina.',
    language: 'english',
    level: 'advanced',
    targetWpm: 45,
    content:
      'The administrative efficiency of public governance relies upon accurate record keeping, timely dispatch of official communications, and rigorous compliance with statutory regulations. Every official secretariat must maintain organized archives, track citizen grievances systematically, and execute policy directives with transparent accountability. A proficient typist serves as an indispensable pillar in ensuring that government correspondence is produced without errors and transmitted within stipulated deadlines.',
  },
  {
    id: 'eng-adv-02',
    title: 'Constitutional Law & Judicial Proceedings',
    subtitle: 'High-level legal transcription with intricate clauses, formal diction, and precise punctuation.',
    language: 'english',
    level: 'advanced',
    targetWpm: 48,
    content:
      'The Constitution enshrines fundamental rights and directive principles to ensure justice, liberty, equality, and fraternity for all citizens. In judicial proceedings, accuracy of transcription is of paramount importance; a single misplaced comma or inaccurate phrase can fundamentally alter the interpretation of a statutory provision. Learned counsel presented extensive arguments regarding substantive due process and administrative oversight before the bench.',
  },
  {
    id: 'eng-adv-03',
    title: 'Scientific Research & Economic Analysis',
    subtitle: 'Complex terminology, fiscal metrics, indices, and academic prose.',
    language: 'english',
    level: 'advanced',
    targetWpm: 50,
    content:
      'Empirical research indicates that sustainable macroeconomic growth is intrinsically tied to capital investment, technological innovation, and workforce productivity. In the agricultural sector, climate-resilient crop varieties and precision irrigation have stabilized yield volatility across agrarian economies. Simultaneously, financial markets monitor central bank interest rates, inflationary indicators, and sovereign debt yields to assess market liquidity and overall fiscal stability.',
  },
  {
    id: 'eng-adv-04',
    title: 'Literary Prose & Cognitive Endurance',
    subtitle: 'Rich, descriptive vocabulary designed to challenge cognitive speed and finger dexterity.',
    language: 'english',
    level: 'advanced',
    targetWpm: 52,
    content:
      'The ancient library stood silently atop the windswept promontory, its towering stone arches safeguarding centuries of philosophical inquiry and literary treasures. Scholars from distant continents traversed vast oceans to decipher illuminated manuscripts, transcribe forgotten languages, and debate foundational metaphysical questions. In the quiet sanctum of the reading hall, the gentle rustle of parchment mirrored the timeless pursuit of human wisdom.',
  },
  {
    id: 'eng-adv-05',
    title: 'Public Administration & Policy Formulation',
    subtitle: 'Executive resolutions, committee proceedings, and civil service documentation.',
    language: 'english',
    level: 'advanced',
    targetWpm: 55,
    content:
      'The Parliamentary Standing Committee on Urban Infrastructure convened to evaluate the comprehensive transportation reform proposal. The members deliberated extensively on multimodal connectivity, sustainable municipal budgeting, environmental impact assessments, and inter-agency coordination mechanisms. All stakeholders agreed that decentralized execution combined with rigorous digital monitoring would accelerate project completion while maintaining fiscal responsibility.',
  },
  {
    id: 'eng-adv-06',
    title: 'Grand Master Speed Benchmark (60 WPM)',
    subtitle: 'The ultimate test of typing mastery — high cadence, sustained accuracy, and flawless rhythm.',
    language: 'english',
    level: 'advanced',
    targetWpm: 60,
    content:
      'Mastery of touch typing transforms the keyboard into an effortless extension of human thought. At sixty words per minute, your fingers anticipate whole words and sentence structures before the conscious mind finishes formulating them. Errors diminish to near zero as muscle memory governs every keystroke with rhythmic perfection. You have attained true keyboard fluency, combining speed, precision, and confidence into an artful discipline.',
  },
];
