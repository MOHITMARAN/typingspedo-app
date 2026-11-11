import React from 'react';
import { NavTab } from '../types';
import { ShieldCheck, Keyboard, Heart, Award, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AboutViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  const { currentTheme } = useTheme();

  return (
    <div className="py-8 sm:py-12 space-y-16 max-w-4xl mx-auto">
      {/* 1. Mission Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Our Mission & Vision</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Bilingual Empowerment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering Bilingual Typing Fluency
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          TypingSpedo is built to make English touch typing and Hindi Devanagari typing accessible to everyone for free. Designed specifically for students preparing for competitive government examinations and digital workplace careers.
        </p>
      </div>

      {/* 2. InScript vs Remington Gail Breakdown */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            Exam Guide
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            InScript vs Remington Gail: Which Should You Learn?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Many aspirants are confused between the two major Hindi typing layouts. Here is a clear breakdown:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* InScript */}
          <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                InScript Layout (इन्स्क्रिप्ट)
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Recommended Choice
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Standardized by the Department of Electronics (Govt. of India). Vowels are placed on the left hand and consonants on the right hand.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Default choice for SSC CGL, CHSL, Railway (RRB)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pre-installed on every Windows, macOS, Android, and Linux system</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Unified layout works identically across all Indian scripts</span>
              </li>
            </ul>
          </div>

          {/* Remington Gail */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Remington Gail (रेमिंगटन गेल)
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Traditional Typewriter Layout
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on the mechanical typewriter layout. Popularized by legacy Kruti Dev fonts, now standardized with Unicode.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Widely requested in High Courts, District Courts, CPWD</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Favored by candidates with prior typewriter training</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Supported in TypingSpedo with live visual keyboard aids</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Proper Posture & Finger Ergonomics */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Ergonomics & Posture
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Golden Rules of Touch Typing
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Speed is a natural byproduct of good habits and muscle memory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-2xl font-extrabold text-sky-600 font-mono">01.</div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Home Row Bumps</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Locate the tactile raised ridges on keys <strong className="text-slate-900 dark:text-white">F</strong> and <strong className="text-slate-900 dark:text-white">J</strong> with your index fingers. Your hands should always return here.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-2xl font-extrabold text-sky-600 font-mono">02.</div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Never Look Down</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Keep your eyes fixed on the screen. Looking at the keys slows down memory transfer. Use our on-screen keyboard guide to locate keys.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-2xl font-extrabold text-sky-600 font-mono">03.</div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Accuracy Before Speed</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Focus on 95%+ accuracy first. Speed builds exponentially once your hands eliminate hesitation and repeated backspaces.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'Is TypingSpedo completely free to use?',
              a: 'Yes! 100% free with no subscriptions, paid API gates, or artificial locks. All English and Hindi lessons, tests, and layouts are openly available.',
            },
            {
              q: 'How are my test scores and lesson progress saved?',
              a: 'Your progress is saved securely in your browser’s local storage. You do not need to register an account or enter passwords.',
            },
            {
              q: 'What typing speed is needed for government exams in India?',
              a: 'Most Central (SSC CGL/CHSL) and State clerical exams require 35 WPM in English or 30 WPM in Hindi, with minimum 90% to 95% accuracy.',
            },
            {
              q: 'Can I practice Hindi typing even if I do not have a special keyboard?',
              a: 'Yes! You can use our interactive on-screen keyboard, use Hindi Phonetic transliteration mode, or enable the standard Hindi keyboard in your operating system.',
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-xs"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div
        className="p-8 text-white rounded-3xl text-center space-y-4 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.gradientFrom} 0%, ${currentTheme.gradientTo} 100%)`,
        }}
      >
        <h3 className="text-2xl font-bold">Ready to Elevate Your Typing?</h3>
        <p className="text-sm text-white/90 max-w-lg mx-auto">
          Start your first lesson now or test your current speed in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSelectTab('english')}
            className="px-5 py-2.5 bg-white text-slate-900 font-semibold text-xs rounded-xl shadow hover:bg-slate-100 transition-colors cursor-pointer"
          >
            English Lessons
          </button>
          <button
            onClick={() => onSelectTab('hindi')}
            className="px-5 py-2.5 bg-black/20 hover:bg-black/30 border border-white/20 text-white font-semibold text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            Hindi Lesson
          </button>
        </div>
      </div>
    </div>
  );
};
