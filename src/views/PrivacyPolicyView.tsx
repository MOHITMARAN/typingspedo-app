import React, { useState } from 'react';
import { NavTab } from '../types';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  HardDrive,
  Trash2,
  CheckCircle,
  Server,
  ExternalLink,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PrivacyPolicyViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onSelectTab }) => {
  const { currentTheme } = useTheme();
  const [clearedNotice, setClearedNotice] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleClearLocalStorage = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('typeshala_user_progress_v1');
        localStorage.removeItem('typeshala_theme');
        localStorage.removeItem('typeshala_color_theme');
        localStorage.removeItem('typeshala_virtual_hands');
        localStorage.removeItem('typeshala_mechanical_sound');
      }
      setClearedNotice(true);
      setConfirmClearOpen(false);
      setTimeout(() => {
        setClearedNotice(false);
      }, 5000);
    } catch {
      // Safe fallback if storage access is restricted
    }
  };

  return (
    <div className="py-8 sm:py-12 space-y-12 max-w-4xl mx-auto">
      {/* 1. Header Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy Policy</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Client-Side Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Effective Date: November 2026 · Last Updated: November 10, 2026
        </p>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          This Privacy Policy explains how <strong>TypingSpedo</strong> handles information when you use our website. TypingSpedo is designed as a client-side typing tutor that operates without requiring user accounts or storing personal information on external servers. This document details what data is processed locally in your browser, how external font resources operate, and how technical information is handled by web hosting infrastructure.
        </p>
      </div>

      {/* 2. Key Highlights Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Sign-Up</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            No accounts, passwords, email addresses, or phone numbers are requested or collected.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Local Device Storage</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Your lesson progress, stars, and speed records are stored strictly in your browser's local storage.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">On-Device Calculation</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Typing input and speed calculations are processed in local memory and are not sent to any server.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Ad Trackers</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Zero advertising networks, marketing pixels, or analytics trackers are installed in the application.
          </p>
        </div>
      </div>

      {/* 3. Section: Information We Do Not Collect */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            1. Data Collection
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Information We Do Not Collect
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            TypingSpedo is built as an educational typing platform for students, job candidates, and typing enthusiasts. The application does not maintain a custom user database or collect personal identifiers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">No User Registration</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You do not need to create an account, provide an email address, enter your full name, or create passwords to use any feature of TypingSpedo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">No Contact Information Captured</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The website contains no marketing forms, newsletter subscription popups, or lead capture questionnaires.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">No Payment or Billing Information</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The typing lessons, drills, and typing tests currently available on TypingSpedo are provided without charge or payment processing. The application does not collect credit card numbers, billing addresses, or payment credentials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">No Location or Sensor Tracking</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We do not request browser geolocation permissions, GPS coordinates, device serial numbers, or hardware identifiers.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Section: On-Device Keystroke Processing */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            2. Keystroke Integrity
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            How Typing Input and Keystrokes Are Handled
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            When you type in TypingSpedo's interactive lessons or speed tests:
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">Real-Time Client-Side Calculation:</strong>
                Your keystrokes are received directly by the browser's JavaScript event loop to match target characters, advance the cursor, and compute real-time metrics (WPM, Net Speed, Accuracy, Errors, and Elapsed Time).
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">No Remote Keystroke Logging:</strong>
                The text you type is never transmitted across the network to any external server, third-party cloud service, or artificial intelligence model.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">In-Memory Discard:</strong>
                Upon completing or restarting an exercise, temporary typing buffers are discarded from browser memory. Only statistical summary numbers (such as Net WPM, accuracy percentage, and stars earned) are saved to your browser's local storage.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Section: Browser Local Storage (localStorage) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            3. Local Storage
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Data Stored Locally on Your Device
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            To provide a seamless learning experience so you do not lose progress when refreshing the page, TypingSpedo uses the standard HTML5 Web Storage API (<strong>localStorage</strong>). The application does not use <strong>sessionStorage</strong>. The following records are saved strictly on your local browser:
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                User Progress & Scores (typeshala_user_progress_v1)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Completed lesson IDs, stars earned (1–5), accuracy rate, best English & Hindi WPM, cumulative practice time, and assessment test records.
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 self-start sm:self-auto">
              Progress Persistence
            </span>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                Display & Color Themes (typeshala_theme & typeshala_color_theme)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Your selected accent color palette (TypingSpedo Navy, Indigo, Emerald, Amber, Crimson, Cyberpunk) and Light/Dark appearance mode.
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 self-start sm:self-auto">
              Visual Preferences
            </span>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                Aids & Sound Settings (typeshala_virtual_hands & typeshala_mechanical_sound)
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Whether the visual hand posture guide is toggled ON or OFF, and whether mechanical key audio clicks are enabled.
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 self-start sm:self-auto">
              Practice Settings
            </span>
          </div>
        </div>

        {/* Clear Local Data Controls */}
        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
            <Trash2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>How to Delete or Reset Your Local Data</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Because all progress resides on your device, you maintain full control over your data. You can clear your data at any time either through your browser's site storage settings or by using the reset button below:
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            {!confirmClearOpen ? (
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-100/50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Reset Local Progress & Preferences</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearLocalStorage}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Reset All Data
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearOpen(false)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {clearedNotice && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Local storage data successfully erased.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 6. Section: Cookies Policy */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            4. Cookies & Trackers
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Cookies Policy
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TypingSpedo <strong>does not set or read any HTTP cookies</strong>, tracking cookies, or advertising identifiers. We do not use third-party analytics cookies or cross-site tracking scripts.
        </p>
      </section>

      {/* 7. Section: External Services & Google Fonts */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            5. External Font Services
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Third-Party Services & Web Fonts
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          To ensure accurate display of complex Hindi Devanagari ligatures and clean Latin typography across all operating systems, TypingSpedo loads web fonts from Google Fonts:
        </p>
        <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
          <li><strong>Noto Sans Devanagari</strong> (for Hindi vowels, consonants, matras, and examination passages)</li>
          <li><strong>Plus Jakarta Sans & DM Sans</strong> (for interface typography)</li>
          <li><strong>JetBrains Mono</strong> (for fixed-width speed displays and statistical numbers)</li>
        </ul>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span>How Font Requests Function</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            When your browser downloads font files from Google Fonts (<code className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">fonts.googleapis.com</code> and <code className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">fonts.gstatic.com</code>), your browser transmits standard HTTP/HTTPS request information (such as your IP address, browser User-Agent, and HTTP request headers) directly to Google's content delivery servers. This is standard protocol for loading web assets. Google processes this information in accordance with Google's Privacy Policy. No typing text or lesson scores are included in font requests.
          </p>
        </div>
      </section>

      {/* 8. Section: Hosting Infrastructure & Server Logs */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            6. Hosting Infrastructure
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Server Logs & Hosting Provider Processing
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When you access and browse TypingSpedo, the web hosting provider and edge content delivery networks (CDNs) serving the static web files automatically process standard technical connection logs:
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Server className="w-4 h-4 text-sky-500" />
            <span>Technical Connection Information</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Standard web server logs typically record your internet protocol (IP) address, browser type and version, operating system, referring URL, date and time of the request, and the specific files retrieved. These logs are maintained by the hosting infrastructure provider for network security, DDoS mitigation, and service availability in accordance with the hosting provider's own data practices. TypingSpedo does not operate a custom backend database to inspect, store, or combine these server access logs.
          </p>
        </div>
      </section>

      {/* 9. Section: Children & Student Privacy */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            7. Children & Students
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Children and Student Privacy
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          TypingSpedo is an educational touch typing platform accessible to learners of all ages, including schoolchildren, university students, and job exam candidates. TypingSpedo does not knowingly solicit or collect personally identifiable information from children or any users. Because the platform does not require registration or personal data entry, students can practice typing without submitting personal details.
        </p>
      </section>

      {/* 10. Section: Contact & Inquiries */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.primaryColor }}>
            8. Inquiries & Support
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Questions & Contact
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          If you have any questions or feedback regarding this Privacy Policy or our client-side architecture, please reach out to our team.
        </p>

        {/* Proper Contact Us page link */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Have Questions or Feedback?</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              For inquiries regarding privacy, typing lessons, or website support, please visit our Contact Us page.
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

      {/* 11. Navigation Footer Actions */}
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
            onClick={() => onSelectTab('terms')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            Terms & Conditions
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
