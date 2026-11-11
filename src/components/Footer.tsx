import React from 'react';
import { NavTab } from '../types';
import { Keyboard, Heart, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-white dark:bg-[#070c18] border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 to-sky-600 dark:from-sky-500 dark:to-blue-700 flex items-center justify-center text-white shadow-xs">
                <Keyboard className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Typing<span className="text-sky-600 dark:text-sky-400">Spedo</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              India's free bilingual typing platform. Master English touch typing and Hindi InScript & Remington Gail keyboards for competitive exams, office jobs, and digital fluency.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Free Forever
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-sky-500" /> SSC & Govt Exam Standard
              </span>
            </div>
          </div>

          {/* Column 1: English Typing */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              English Typing
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('english')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Beginner Home Row
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('english')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  A-Z Alphabet Drills
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('english')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Common Words & Numbers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('english')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Advanced Paragraphs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Hindi Typing */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Hindi Typing (हिंदी)
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400 font-hindi">
              <li>
                <button
                  onClick={() => onSelectTab('hindi')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-sans"
                >
                  InScript Keyboard (इन्स्क्रिप्ट)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('hindi')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-sans"
                >
                  Remington Gail (रेमिंगटन गेल)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('hindi')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-sans"
                >
                  Hindi Phonetic (फोनेटिक)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('hindi')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left font-sans"
                >
                  स्वर, व्यंजन एवं मात्रा अभ्यास
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Typing Tests & Guides */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Tests & Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('test')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  1-Minute Speed Test
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('test')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  SSC CHSL/CGL Test Passage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  InScript vs Remington Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Touch Typing Posture Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('privacy')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('terms')}
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p>© {new Date().getFullYear()} TypingSpedo. Dedicated to free bilingual education.</p>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <button
              onClick={() => onSelectTab('privacy')}
              className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <button
              onClick={() => onSelectTab('terms')}
              className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for typists across India and beyond</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
