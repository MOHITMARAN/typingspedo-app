import React, { useState } from 'react';
import { NavTab, UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { EnglishTypingView } from './views/EnglishTypingView';
import { HindiTypingView } from './views/HindiTypingView';
import { TypingTestView } from './views/TypingTestView';
import { AboutView } from './views/AboutView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsView } from './views/TermsView';
import { loadUserProgress } from './utils/storage';
import { ThemeProvider } from './context/ThemeContext';
import { ThemePickerModal } from './components/ThemePickerModal';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress());

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation Bar with Integrated Theme Switcher */}
      <Navbar currentTab={currentTab} onSelectTab={handleSelectTab} />

      {/* 1-Click Interactive Theme Picker Modal */}
      <ThemePickerModal />

      {/* Main Content Area with Animated Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {currentTab === 'home' && (
              <HomeView
                onSelectTab={handleSelectTab}
                userProgress={userProgress}
                onUpdateProgress={setUserProgress}
              />
            )}

            {currentTab === 'english' && (
              <EnglishTypingView
                userProgress={userProgress}
                onUpdateProgress={setUserProgress}
              />
            )}

            {currentTab === 'hindi' && (
              <HindiTypingView
                userProgress={userProgress}
                onUpdateProgress={setUserProgress}
              />
            )}

            {currentTab === 'test' && (
              <TypingTestView
                userProgress={userProgress}
                onUpdateProgress={setUserProgress}
              />
            )}

            {currentTab === 'about' && (
              <AboutView onSelectTab={handleSelectTab} />
            )}

            {currentTab === 'privacy' && (
              <PrivacyPolicyView onSelectTab={handleSelectTab} />
            )}

            {currentTab === 'terms' && (
              <TermsView onSelectTab={handleSelectTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
