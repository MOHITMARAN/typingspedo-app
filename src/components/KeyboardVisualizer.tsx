import React from 'react';
import { KEYBOARD_ROWS, KeyDefinition } from '../data/keyboardLayouts';
import { useTheme } from '../context/ThemeContext';
import { getFingerInstructionForChar, getShiftFingerForFinger } from '../utils/hands';
import {
  HandsGuidanceHUD,
  LeftHandVisualizer,
  RightHandVisualizer,
  HandsColorLegend,
} from './VirtualHands';

interface KeyboardVisualizerProps {
  layout: 'english' | 'inscript' | 'remington' | 'phonetic';
  nextExpectedChar?: string;
  activePressedCode?: string | null;
  shiftRequired?: boolean;
  highlightExpectedKey?: boolean;
  customHighlightKeys?: string[];
  onKeyClick?: (char: string) => void;
  showFingerGuide?: boolean;
  showHandsGuide?: boolean;
}

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  layout,
  nextExpectedChar = '',
  activePressedCode = null,
  shiftRequired = false,
  highlightExpectedKey = true,
  customHighlightKeys,
  onKeyClick,
  showHandsGuide = false,
}) => {
  const { currentTheme } = useTheme();

  // Determine current finger instruction for flanked virtual hands
  const instruction = React.useMemo(() => {
    if (!showHandsGuide || !nextExpectedChar) return null;
    const inst = getFingerInstructionForChar(nextExpectedChar, layout);
    if (!inst) return null;
    if (shiftRequired !== undefined) {
      inst.shiftRequired = shiftRequired;
      if (shiftRequired) {
        inst.shiftFinger = getShiftFingerForFinger(inst.finger);
      }
    }
    return inst;
  }, [showHandsGuide, nextExpectedChar, layout, shiftRequired]);

  const activeShiftFinger = instruction?.shiftRequired ? instruction.shiftFinger : null;

  // Determine which key definition matches the expected char
  const isKeyExpected = (key: KeyDefinition): boolean => {
    if (customHighlightKeys && customHighlightKeys.includes(key.code)) {
      return true;
    }

    if (!highlightExpectedKey || !nextExpectedChar) return false;

    if (nextExpectedChar === ' ' && key.code === 'Space') {
      return true;
    }

    if (layout === 'english') {
      if (key.defaultChar.toLowerCase() === nextExpectedChar.toLowerCase()) {
        return true;
      }
      if (key.shiftChar === nextExpectedChar) {
        return true;
      }
    } else if (layout === 'inscript') {
      if (key.inscriptNormal === nextExpectedChar || key.inscriptShift === nextExpectedChar) {
        return true;
      }
    } else if (layout === 'remington') {
      if (key.remingtonNormal === nextExpectedChar || key.remingtonShift === nextExpectedChar) {
        return true;
      }
    } else if (layout === 'phonetic') {
      if (key.defaultChar.toLowerCase() === nextExpectedChar.toLowerCase()) {
        return true;
      }
      if (key.shiftChar === nextExpectedChar) {
        return true;
      }
    }

    return false;
  };

  const getPrimaryLabel = (key: KeyDefinition): string => {
    if (layout === 'english') {
      return key.defaultChar.toUpperCase();
    }
    if (layout === 'inscript') {
      return key.inscriptNormal || key.defaultChar.toUpperCase();
    }
    if (layout === 'remington') {
      return key.remingtonNormal || key.defaultChar.toUpperCase();
    }
    return key.defaultChar.toUpperCase();
  };

  const getSecondaryLabel = (key: KeyDefinition): string | null => {
    if (layout === 'english') {
      return key.shiftChar !== key.defaultChar.toUpperCase() ? key.shiftChar : null;
    }
    if (layout === 'inscript') {
      return key.inscriptShift && key.inscriptShift !== key.inscriptNormal ? key.inscriptShift : null;
    }
    if (layout === 'remington') {
      return key.remingtonShift && key.remingtonShift !== key.remingtonNormal ? key.remingtonShift : null;
    }
    return key.shiftChar;
  };

  return (
    <div className="w-full bg-slate-900/5 dark:bg-slate-900/60 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto">
      {/* Top Guidance HUD when virtual hands are active */}
      {showHandsGuide && (
        <div className="min-w-[940px] max-w-6xl mx-auto">
          <HandsGuidanceHUD
            instruction={instruction}
            activeShiftFinger={activeShiftFinger}
            primaryColor={currentTheme.primaryColor}
          />
        </div>
      )}

      {/* InScript Hand Division Guide (Vowels / Consonants) */}
      {layout === 'inscript' && !showHandsGuide && (
        <div className="min-w-[680px] max-w-4xl mx-auto mb-2 grid grid-cols-2 gap-2 text-xs font-semibold">
          <div className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-between text-[11px]">
            <span>👈 बायाँ हाथ (Left Hand)</span>
            <span className="font-normal text-[10px] sm:text-[11px] opacity-90">स्वर एवं मात्राएँ (Vowels & Matras)</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-sky-800 dark:text-sky-200 flex items-center justify-between text-[11px]">
            <span className="font-normal text-[10px] sm:text-[11px] opacity-90">व्यंजन (Consonants)</span>
            <span>दायाँ हाथ (Right Hand) 👉</span>
          </div>
        </div>
      )}

      {/* Flanked Main Workspace: Left Hand on Left, Keyboard in Center, Right Hand on Right */}
      <div
        className={`flex items-center justify-center gap-3 sm:gap-4 md:gap-5 mx-auto select-none font-sans ${
          showHandsGuide ? 'min-w-[940px] max-w-6xl' : 'min-w-[680px] max-w-4xl'
        }`}
      >
        {/* Left Hand: Placed on the LEFT SIDE of the keyboard */}
        {showHandsGuide && (
          <div className="shrink-0 w-32 sm:w-36 md:w-40 flex flex-col items-center">
            <LeftHandVisualizer
              activeFinger={instruction?.finger || null}
              activeShiftFinger={activeShiftFinger}
              instruction={instruction}
            />
          </div>
        )}

        {/* Physical Keyboard Rows in the Center */}
        <div className="shrink-0 min-w-[620px] max-w-4xl flex-1">
          <div className="space-y-1 sm:space-y-1.5 relative z-0">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center">
                {row.map((key) => {
                  const isExpected = isKeyExpected(key);
                  const isPressed = activePressedCode === key.code;
                  const isShiftKey = key.code === 'ShiftLeft' || key.code === 'ShiftRight';
                  const isExpectedShift = isShiftKey && shiftRequired;

                  const primary = getPrimaryLabel(key);
                  const secondary = getSecondaryLabel(key);

                  const handleKeyClick = () => {
                    if (!onKeyClick) return;
                    if (key.code === 'Space') {
                      onKeyClick(' ');
                    } else if (!key.isSpecial) {
                      const charToEmit = shiftRequired && secondary ? secondary : primary;
                      onKeyClick(charToEmit);
                    }
                  };

                  return (
                    <button
                      key={key.code}
                      type="button"
                      onClick={handleKeyClick}
                      style={
                        isPressed
                          ? { backgroundColor: currentTheme.primaryHover, borderColor: currentTheme.primaryHover }
                          : isExpected || isExpectedShift
                          ? { backgroundColor: currentTheme.primaryColor, borderColor: currentTheme.ringColor }
                          : undefined
                      }
                      className={`relative flex flex-col items-center justify-center rounded-lg transition-all duration-75 text-xs sm:text-sm font-medium cursor-pointer
                        ${key.width || 'flex-1'}
                        ${key.code === 'Space' ? 'h-9 sm:h-10.5' : 'h-9.5 sm:h-11'}
                        ${
                          isPressed
                            ? 'text-white shadow-inner scale-[0.96] translate-y-0.5 animate-key-pop z-10'
                            : isExpected || isExpectedShift
                            ? 'text-white ring-2 ring-offset-2 dark:ring-offset-slate-900 animate-pulse font-bold shadow-md z-10'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      {/* Secondary (Shift) character */}
                      {secondary && !key.isSpecial && (
                        <span
                          className={`text-[9px] sm:text-[10px] leading-none mb-0.5 font-hindi ${
                            isExpected || isPressed ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {secondary}
                        </span>
                      )}

                      {/* Primary Key Label */}
                      <span
                        className={`leading-tight tracking-tight ${
                          layout !== 'english' && !key.isSpecial ? 'font-hindi text-sm sm:text-base' : 'font-semibold'
                        }`}
                      >
                        {primary}
                      </span>

                      {/* Shift helper label when key requires Shift */}
                      {isExpectedShift && (
                        <span className="absolute -top-6 text-[10px] font-semibold bg-sky-600 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                          Hold Shift
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Hand: Placed on the RIGHT SIDE of the keyboard */}
        {showHandsGuide && (
          <div className="shrink-0 w-32 sm:w-36 md:w-40 flex flex-col items-center">
            <RightHandVisualizer
              activeFinger={instruction?.finger || null}
              activeShiftFinger={activeShiftFinger}
              instruction={instruction}
            />
          </div>
        )}
      </div>

      {/* Touch Typing Color Code Legend at bottom */}
      {showHandsGuide && (
        <div className="min-w-[940px] max-w-6xl mx-auto">
          <HandsColorLegend />
        </div>
      )}
    </div>
  );
};
