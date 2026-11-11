import React from 'react';
import { NavTab } from '../types';
import {
  Scale,
  BookOpen,
  Award,
  AlertTriangle,
  Ban,
  ShieldAlert,
  Server,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TermsViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onSelectTab }) => {
  const { currentTheme } = useTheme();

  return (
    <div className="py-8 sm:py-12 space-y-12 max-w-4xl mx-auto">
      {/* 1. Header Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300">
          <Scale className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Terms & Conditions</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Educational Platform Guidelines</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Effective Date: November 2026 · Last Updated: November 10, 2026
        </p>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Welcome to <strong>TypingSpedo</strong>. These Terms & Conditions govern your access to and use of the TypingSpedo website, typing lessons, interactive keyboard exercises, and practice tools. Please read these terms carefully before using the platform.
        </p>
      </div>

      {/* 2. Key Highlights Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Educational Purpose</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Self-paced typing practice for students, competitive exam aspirants, and general typists.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Practice Simulation</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Speed metrics are informational self-evaluations and not official exam certifications.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Free Access</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Practice lessons and tests without registration fees, paywalls, or account sign-ups.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Ban className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fair Usage</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Automated scripts, bots, scrapers, and denial-of-service attempts are strictly prohibited.
          </p>
        </div>
      </div>

      {/* 3. Section 1: Acceptance of Terms */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            1. Agreement
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Acceptance of Terms
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          By accessing, browsing, or using the TypingSpedo website (available at this web address), you acknowledge that you have read, understood, and agree to be legally bound by these Terms & Conditions and our Privacy Policy. If you do not agree with any portion of these terms, you should immediately discontinue the use of this website.
        </p>
      </section>

      {/* 4. Section 2: Website Purpose and Educational Use */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            2. Platform Scope
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Website Purpose and Educational Use
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TypingSpedo is an independent, free bilingual typing education platform. Our mission is to promote digital literacy, computer keyboard familiarity, and touch typing proficiency in both English and Hindi.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The website provides interactive lessons, key-by-key exercises, speed tests, and reference guides covering the standard QWERTY layout for English and official Indian keyboard layouts for Hindi (including InScript, Remington Gail, and Phonetic transliteration). All materials are provided exclusively for personal educational and self-practice use.
        </p>
      </section>

      {/* 5. Section 3: User Responsibilities */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            3. User Obligations
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            User Responsibilities
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When using TypingSpedo, you agree to the following responsibilities:
        </p>
        <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
          <li>You are responsible for obtaining and maintaining your own computer hardware, keyboard, web browser, and internet connectivity required to access the website.</li>
          <li>You agree to use the platform in compliance with all applicable local, national, and international laws and regulations.</li>
          <li>You acknowledge that clearing your browser cache or site storage will delete locally stored progress records (such as completed lessons and star scores).</li>
          <li>You are responsible for your own ergonomics and posture while practicing touch typing to avoid strain or fatigue.</li>
        </ul>
      </section>

      {/* 6. Section 4: Typing Lessons and Practice */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            4. Learning Content
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Typing Lessons and Practice Exercises
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The English and Hindi typing lessons are designed as self-paced instructional exercises to develop muscle memory and keyboard familiarity.
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            While curricula are structured following standardized conventions (including the Department of Electronics InScript layout and mechanical typewriter Remington layouts), TypingSpedo does not warrant that completing our lessons will meet the specific or changing syllabi of any particular external training institute, university, or examining body.
          </p>
        </div>
      </section>

      {/* 7. Section 5: Typing Tests, Scores and Accuracy Limitations */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            5. Disclaimers & Scoring
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Typing Tests, Scores, and Examination Disclaimers
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Please carefully review the following limitations regarding typing test scores, speed calculations, and examination benchmarks:
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>No Official Examination Certification</span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
              TypingSpedo is an independent practice tool. <strong>We are NOT affiliated with, sponsored by, or endorsed by any government entity, recruitment commission, or examination authority</strong>, including the Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), High Courts, District Courts, State Public Service Commissions (PSCs), or banking recruitment agencies (IBPS). Test results generated on this website are for self-assessment and do NOT constitute official test certificates, scorecards, or qualifications.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Award className="w-4 h-4 text-sky-500 shrink-0" />
              <span>No Guarantee of Employment, Selection, or Speed Growth</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              TypingSpedo does not guarantee employment, selection in government or private job examinations, or attainment of a specific typing speed (e.g., 30 WPM or 35 WPM). Individual typing progress depends upon consistent personal practice, hand ergonomics, keyboard quality, and official examination conditions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Scale className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Mathematical Calculation Variations</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Typing metrics (Gross WPM, Net WPM, Accuracy, Keystrokes, and Errors) are computed algorithmically in the browser based on standard 5-character word averages. Different external examination bodies may apply different error calculation formulas (such as full mistake vs. half mistake penalties) or use custom software that evaluates keystrokes differently.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Section 6: Intellectual Property and Copyright */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            6. Intellectual Property
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Intellectual Property and Copyright
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          All original website design elements, user interface components, software source code, lesson sequencing, interactive visual guides, illustrations, and compilations on TypingSpedo are the intellectual property of TypingSpedo or its contributors and are protected by applicable copyright and intellectual property laws.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Standard keyboard layouts (such as the Government of India InScript standard, mechanical typewriter Remington layouts, and the QWERTY standard) belong to their respective public standards or copyright holders. You are granted a personal, non-exclusive, non-transferable, revocable license to access the website for individual practice. You may not scrape, mirror, commercially reproduce, sell, or redistribute website materials without prior written authorization.
        </p>
      </section>

      {/* 9. Section 7: Acceptable and Prohibited Use */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            7. Acceptable Conduct
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Acceptable and Prohibited Use
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          To preserve a fair and reliable environment for all learners, you agree NOT to engage in any of the following prohibited activities:
        </p>
        <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
          <li>Using automated scripts, keystroke emulators, bots, macro recorders, or browser extensions to falsify typing speed or bypass lessons.</li>
          <li>Scraping, crawling, or extracting lesson content, test passages, or application assets using automated software without permission.</li>
          <li>Attempting to interfere with, disrupt, or compromise the stability, security, or network infrastructure of the website or hosting servers.</li>
          <li>Decompiling, reverse engineering, or attempting to extract source code for commercial redistribution.</li>
          <li>Using the website for any fraudulent, unlawful, or harmful purpose under applicable laws.</li>
        </ul>
      </section>

      {/* 10. Section 8: Website Availability and Maintenance */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            8. Availability
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Website Availability and Maintenance
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          While we endeavor to provide continuous and reliable access to TypingSpedo, we do not warrant that the website will always be available, uninterrupted, timely, or completely error-free.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TypingSpedo reserves the right to modify, suspend, update, or discontinue any feature, lesson, test module, or part of the website at any time without prior notice or liability.
        </p>
      </section>

      {/* 11. Section 9: Third-Party Services and External Links */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            9. External Resources
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Third-Party Services and External Links
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TypingSpedo loads static web fonts from Google Fonts (hosted by Google LLC) to display Devanagari ligatures and clean Latin typography. Your use of such external services is governed by the respective third-party terms of service and privacy policies.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          If the website contains links to external websites, articles, or resources, they are provided solely for reference and user convenience. TypingSpedo has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party websites.
        </p>
      </section>

      {/* 12. Section 10: Limitation of Liability */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            10. Legal Disclaimer
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Disclaimer of Warranties and Limitation of Liability
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          To the fullest extent permitted by applicable law in India, TypingSpedo and its operators provide the website and all related educational content, software, and services on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis, without warranties of any kind, whether express, statutory, or implied.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Under no circumstances shall TypingSpedo, its developers, or its operators be liable for any direct, indirect, incidental, consequential, special, or exemplary damages—including but not limited to loss of data, lost opportunities, examination outcomes, employment results, or hardware failures—arising out of or in connection with your use of or inability to use this website.
        </p>
      </section>

      {/* 13. Section 11: Changes to Terms */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            11. Amendments
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Changes to Terms & Conditions
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          We reserve the right to revise, update, or amend these Terms & Conditions at our discretion at any time. When modifications are made, the "Last Updated" date at the top of this page will be revised accordingly.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Your continued access to or use of TypingSpedo after revised terms are posted constitutes your explicit acknowledgment and acceptance of the revised Terms & Conditions. We encourage you to review this page periodically.
        </p>
      </section>

      {/* 14. Section 12: Contact Information */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            12. Contact
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Contact & Inquiries
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          If you have any questions, clarifications, or feedback regarding these Terms & Conditions or our educational platform, please reach out through our official Contact Us channel.
        </p>

        {/* Proper Contact Us page link */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Need Help or Have Inquiries?</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              For inquiries regarding terms, typing lessons, technical issues, or general suggestions, please visit our Contact Us page.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shrink-0 w-fit cursor-pointer"
          >
            <span>Contact Us</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </section>

      {/* 15. Navigation Footer Actions */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onSelectTab('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Return to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectTab('privacy')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onSelectTab('english')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            English Lessons
          </button>
          <button
            onClick={() => onSelectTab('hindi')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            Hindi Lesson
          </button>
          <button
            onClick={() => onSelectTab('test')}
            style={{ backgroundColor: currentTheme.primaryColor }}
            className="px-4 py-1.5 text-xs font-bold text-white rounded-xl shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
          >
            Typing Test
          </button>
        </div>
      </div>
    </div>
  );
};
