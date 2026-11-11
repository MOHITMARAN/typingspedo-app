import React from 'react';
import { Finger, FINGER_COLORS } from '../data/keyboardLayouts';
import { getFingerInstructionForChar, getShiftFingerForFinger, FingerInstruction } from '../utils/hands';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

export interface FingerConfig {
  id: Finger;
  nameEn: string;
  nameHi: string;
  homeKey: string;
  hand: 'left' | 'right' | 'thumb';
  tipX: number;
  tipY: number;
  width: number;
  height: number;
  baseX: number;
  baseY: number;
  colorHex: string;
}

export const LEFT_FINGERS: FingerConfig[] = [
  {
    id: 'pinky-l',
    nameEn: 'Pinky',
    nameHi: 'कनिष्ठिका',
    homeKey: 'A',
    hand: 'left',
    tipX: 22,
    tipY: 58,
    width: 18,
    height: 70,
    baseX: 13,
    baseY: 125,
    colorHex: '#ef4444',
  },
  {
    id: 'ring-l',
    nameEn: 'Ring',
    nameHi: 'अनामिका',
    homeKey: 'S',
    hand: 'left',
    tipX: 48,
    tipY: 38,
    width: 20,
    height: 90,
    baseX: 38,
    baseY: 122,
    colorHex: '#f97316',
  },
  {
    id: 'middle-l',
    nameEn: 'Middle',
    nameHi: 'मध्यमा',
    homeKey: 'D',
    hand: 'left',
    tipX: 76,
    tipY: 24,
    width: 20,
    height: 104,
    baseX: 66,
    baseY: 120,
    colorHex: '#10b981',
  },
  {
    id: 'index-l',
    nameEn: 'Index',
    nameHi: 'तर्जनी',
    homeKey: 'F',
    hand: 'left',
    tipX: 104,
    tipY: 38,
    width: 20,
    height: 90,
    baseX: 94,
    baseY: 122,
    colorHex: '#0284c7',
  },
  {
    id: 'thumb',
    nameEn: 'Thumb',
    nameHi: 'अंगूठा',
    homeKey: '␣',
    hand: 'left',
    tipX: 140,
    tipY: 112,
    width: 20,
    height: 60,
    baseX: 120,
    baseY: 140,
    colorHex: '#a855f7',
  },
];

export const RIGHT_FINGERS: FingerConfig[] = [
  {
    id: 'thumb',
    nameEn: 'Thumb',
    nameHi: 'अंगूठा',
    homeKey: '␣',
    hand: 'right',
    tipX: 20,
    tipY: 112,
    width: 20,
    height: 60,
    baseX: 20,
    baseY: 140,
    colorHex: '#a855f7',
  },
  {
    id: 'index-r',
    nameEn: 'Index',
    nameHi: 'तर्जनी',
    homeKey: 'J',
    hand: 'right',
    tipX: 56,
    tipY: 38,
    width: 20,
    height: 90,
    baseX: 46,
    baseY: 122,
    colorHex: '#0284c7',
  },
  {
    id: 'middle-r',
    nameEn: 'Middle',
    nameHi: 'मध्यमा',
    homeKey: 'K',
    hand: 'right',
    tipX: 84,
    tipY: 24,
    width: 20,
    height: 104,
    baseX: 74,
    baseY: 120,
    colorHex: '#10b981',
  },
  {
    id: 'ring-r',
    nameEn: 'Ring',
    nameHi: 'अनामिका',
    homeKey: 'L',
    hand: 'right',
    tipX: 112,
    tipY: 38,
    width: 20,
    height: 90,
    baseX: 102,
    baseY: 122,
    colorHex: '#f97316',
  },
  {
    id: 'pinky-r',
    nameEn: 'Pinky',
    nameHi: 'कनिष्ठिका',
    homeKey: ';',
    hand: 'right',
    tipX: 138,
    tipY: 58,
    width: 18,
    height: 70,
    baseX: 129,
    baseY: 125,
    colorHex: '#ef4444',
  },
];

export function getReachLabel(reach?: string) {
  switch (reach) {
    case 'up':
      return { en: 'Reach Up (Top Row)', hi: 'ऊपर की पंक्ति', icon: ArrowUp };
    case 'down':
      return { en: 'Reach Down (Bottom Row)', hi: 'नीचे की पंक्ति', icon: ArrowDown };
    case 'inward':
      return { en: 'Reach Inward (Center Key)', hi: 'अंदर की ओर बढ़ें', icon: ArrowRight };
    case 'thumb':
      return { en: 'Thumb Press (Spacebar)', hi: 'अंगूठे से स्पेस दबाएँ', icon: Sparkles };
    default:
      return { en: 'Home Row (Resting)', hi: 'होम रो (स्थिर स्थिति)', icon: Sparkles };
  }
}

/**
 * Top HUD Banner showing live target finger & key instructions
 */
export const HandsGuidanceHUD: React.FC<{
  instruction: FingerInstruction | null;
  activeShiftFinger?: Finger | null;
  primaryColor?: string;
}> = ({ instruction, activeShiftFinger, primaryColor = '#0284c7' }) => {
  const reachInfo = getReachLabel(instruction?.reachDirection);
  const ReachIcon = reachInfo.icon;

  return (
    <div className="w-full mb-3 bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-wrap items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-3">
        {/* Active Finger Accent Badge */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 transition-all text-base"
          style={{
            backgroundColor: instruction?.colorHex || primaryColor,
          }}
        >
          {instruction?.hand === 'left' ? '👈' : instruction?.hand === 'right' ? '👉' : '␣'}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {instruction ? (
                <>
                  <span>{instruction.fingerNameHindi}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal text-xs ml-1.5">
                    ({instruction.fingerName})
                  </span>
                </>
              ) : (
                'उँगली का मार्गदर्शन (Virtual Hand Guide)'
              )}
            </span>

            {/* Target Character Indicator Pill */}
            {instruction && (
              <span
                className="px-2 py-0.5 rounded-md text-xs font-mono font-bold text-white shadow-xs"
                style={{ backgroundColor: instruction.colorHex || primaryColor }}
              >
                {instruction.char === ' ' ? 'Spacebar ␣' : `कुंजी: '${instruction.char}'`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 font-medium">
              <ReachIcon className="w-3 h-3 text-sky-500" />
              <span>{reachInfo.hi}</span>
              <span className="opacity-75">· {reachInfo.en}</span>
            </span>
            {instruction && (
              <>
                <span>•</span>
                <span>
                  मूल स्थान (Home Key):{' '}
                  <strong className="font-mono text-slate-800 dark:text-slate-200">
                    {instruction.homeKey}
                  </strong>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Opposite Shift Finger Warning if Shift is needed */}
      {instruction?.shiftRequired && activeShiftFinger && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 animate-pulse text-xs font-semibold">
          <span className="text-sm">⚠️</span>
          <span>
            Shift दबाएँ:{' '}
            <strong>
              {activeShiftFinger.endsWith('-l') ? 'बायाँ कनिष्ठिका (Left Pinky)' : 'दायाँ कनिष्ठिका (Right Pinky)'}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Left Hand Visualizer - placed on the LEFT SIDE of the keyboard
 */
export const LeftHandVisualizer: React.FC<{
  activeFinger: Finger | null;
  activeShiftFinger?: Finger | null;
  instruction: FingerInstruction | null;
}> = ({ activeFinger, activeShiftFinger, instruction }) => {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white/70 dark:bg-slate-800/60 rounded-xl p-2 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
        <span>👈</span>
        <span>बायाँ हाथ (Left)</span>
      </div>
      <svg
        viewBox="0 0 160 210"
        className="w-full h-auto max-h-[210px] drop-shadow-sm overflow-visible"
        aria-label="Left Hand Touch Typing Guide"
      >
        {/* Palm Contour */}
        <path
          d="M 14 128 C 10 165, 22 198, 48 205 L 115 205 C 136 198, 144 165, 136 135 C 128 120, 115 125, 102 126 Z"
          className="fill-slate-100 dark:fill-slate-800/80 stroke-slate-300 dark:stroke-slate-700 transition-colors"
          strokeWidth="2.5"
        />

        {/* Palm Crease Lines */}
        <path
          d="M 35 152 Q 68 168 102 145"
          fill="none"
          stroke="currentColor"
          className="text-slate-300/80 dark:text-slate-600/70"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 28 170 Q 60 185 92 170"
          fill="none"
          stroke="currentColor"
          className="text-slate-300/80 dark:text-slate-600/70"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Left Hand Fingers */}
        {LEFT_FINGERS.map((f) => {
          const isActive =
            activeFinger === f.id &&
            (f.id !== 'thumb' || instruction?.hand === 'left' || instruction?.hand === 'thumb');
          const isShift = activeShiftFinger === f.id;
          const radius = f.width / 2;

          const yTop = f.tipY + (isActive ? -6 : 0);
          const xBase = f.baseX;
          const yBase = f.baseY;

          return (
            <g key={f.id} className="transition-transform duration-150">
              {/* Finger Capsule Body */}
              {f.id !== 'thumb' ? (
                <path
                  d={`M ${xBase} ${yBase} L ${xBase} ${yTop + radius} A ${radius} ${radius} 0 0 1 ${
                    xBase + f.width
                  } ${yTop + radius} L ${xBase + f.width} ${yBase} Z`}
                  fill={isActive ? f.colorHex : isShift ? '#f59e0b' : 'currentColor'}
                  stroke={isActive ? f.colorHex : isShift ? '#d97706' : 'currentColor'}
                  strokeWidth={isActive || isShift ? '2.5' : '1.5'}
                  className={`transition-all duration-150 ${
                    isActive
                      ? 'opacity-95 drop-shadow-md'
                      : isShift
                      ? 'opacity-90 animate-pulse'
                      : 'text-slate-200 dark:text-slate-700/60 stroke-slate-300 dark:stroke-slate-600'
                  }`}
                />
              ) : (
                /* Ergonomic Thumb shape angled toward spacebar */
                <path
                  d="M 114 142 C 124 128, 132 116, 140 106 A 11 11 0 0 1 150 122 C 142 142, 134 158, 126 168 Z"
                  fill={isActive ? f.colorHex : 'currentColor'}
                  stroke={isActive ? f.colorHex : 'currentColor'}
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className={`transition-all duration-150 ${
                    isActive
                      ? 'opacity-95 drop-shadow-md'
                      : 'text-slate-200 dark:text-slate-700/60 stroke-slate-300 dark:stroke-slate-600'
                  }`}
                />
              )}

              {/* Joint crease details */}
              {f.id !== 'thumb' && (
                <>
                  <line
                    x1={xBase + 2}
                    y1={yBase - f.height * 0.35}
                    x2={xBase + f.width - 2}
                    y2={yBase - f.height * 0.35}
                    stroke="currentColor"
                    className={isActive ? 'text-white/60' : 'text-slate-300 dark:text-slate-600'}
                    strokeWidth="1.2"
                  />
                  <line
                    x1={xBase + 3}
                    y1={yBase - f.height * 0.65}
                    x2={xBase + f.width - 3}
                    y2={yBase - f.height * 0.65}
                    stroke="currentColor"
                    className={isActive ? 'text-white/60' : 'text-slate-300 dark:text-slate-600'}
                    strokeWidth="1.2"
                  />
                </>
              )}

              {/* Tactile indicator for Index Finger (Home anchor ridge below F letter) */}
              {f.id === 'index-l' && (
                <line
                  x1={f.tipX - 4}
                  y1={yTop + radius * 2 - 2}
                  x2={f.tipX + 4}
                  y2={yTop + radius * 2 - 2}
                  stroke={isActive ? '#ffffff' : '#0284c7'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}

              {/* Fingertip Home Keycap Badge */}
              <circle
                cx={f.id === 'thumb' ? 142 : f.tipX}
                cy={f.id === 'thumb' ? 116 + (isActive ? -6 : 0) : yTop + radius + 1}
                r={radius - 1}
                fill={isActive ? '#ffffff' : isShift ? '#fef3c7' : '#ffffff'}
                stroke={isActive ? f.colorHex : isShift ? '#d97706' : f.colorHex}
                strokeWidth={isActive || isShift ? '2' : '1.5'}
                className="drop-shadow-xs"
              />

              {/* Home Keycap Label (A, S, D, F, Space) */}
              <text
                x={f.id === 'thumb' ? 142 : f.tipX}
                y={f.id === 'thumb' ? 120 + (isActive ? -6 : 0) : yTop + radius + 5}
                textAnchor="middle"
                fill={isActive ? f.colorHex : isShift ? '#92400e' : '#334155'}
                className="font-mono font-extrabold text-[11px]"
              >
                {isShift ? '⇧' : f.homeKey}
              </text>

              {/* Target Floating Indicator above Active Finger */}
              {isActive && instruction && (
                <g className="animate-bounce">
                  <rect
                    x={f.id === 'thumb' ? 124 : f.tipX - 18}
                    y={f.id === 'thumb' ? 78 : yTop - 24}
                    width="36"
                    height="18"
                    rx="5"
                    fill={f.colorHex}
                    className="shadow-md"
                  />
                  <polygon
                    points={`${f.id === 'thumb' ? 138 : f.tipX - 4},${
                      f.id === 'thumb' ? 96 : yTop - 6
                    } ${f.id === 'thumb' ? 146 : f.tipX + 4},${
                      f.id === 'thumb' ? 96 : yTop - 6
                    } ${f.id === 'thumb' ? 142 : f.tipX},${
                      f.id === 'thumb' ? 100 : yTop - 2
                    }`}
                    fill={f.colorHex}
                  />
                  <text
                    x={f.id === 'thumb' ? 142 : f.tipX}
                    y={f.id === 'thumb' ? 91 : yTop - 11}
                    textAnchor="middle"
                    fill="#ffffff"
                    className="font-bold text-[10px]"
                  >
                    {instruction.char === ' ' ? '␣' : instruction.char}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Right Hand Visualizer - placed on the RIGHT SIDE of the keyboard
 * Symmetrically corrected: precise anatomical mirror, no clipped palm edges,
 * comfortable thumb reaching inward toward spacebar, and legible J anchor ridge.
 */
export const RightHandVisualizer: React.FC<{
  activeFinger: Finger | null;
  activeShiftFinger?: Finger | null;
  instruction: FingerInstruction | null;
}> = ({ activeFinger, activeShiftFinger, instruction }) => {
  return (
    <div className="w-full flex flex-col items-center select-none bg-white/70 dark:bg-slate-800/60 rounded-xl p-2 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
        <span>दायाँ हाथ (Right)</span>
        <span>👉</span>
      </div>
      <svg
        viewBox="0 0 160 210"
        className="w-full h-auto max-h-[210px] drop-shadow-sm overflow-visible"
        aria-label="Right Hand Touch Typing Guide"
      >
        {/* Palm Contour - Mathematically exact mirror of left palm, zero clipping */}
        <path
          d="M 146 128 C 150 165, 138 198, 112 205 L 45 205 C 24 198, 16 165, 24 135 C 32 120, 45 125, 58 126 Z"
          className="fill-slate-100 dark:fill-slate-800/80 stroke-slate-300 dark:stroke-slate-700 transition-colors"
          strokeWidth="2.5"
        />

        {/* Palm Crease Lines - Mirrored */}
        <path
          d="M 125 152 Q 92 168 58 145"
          fill="none"
          stroke="currentColor"
          className="text-slate-300/80 dark:text-slate-600/70"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 132 170 Q 100 185 68 170"
          fill="none"
          stroke="currentColor"
          className="text-slate-300/80 dark:text-slate-600/70"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right Hand Fingers */}
        {RIGHT_FINGERS.map((f) => {
          const isActive =
            activeFinger === f.id &&
            (f.id !== 'thumb' || instruction?.hand === 'right' || instruction?.hand === 'thumb');
          const isShift = activeShiftFinger === f.id;
          const radius = f.width / 2;

          const yTop = f.tipY + (isActive ? -6 : 0);
          const xBase = f.baseX;
          const yBase = f.baseY;

          return (
            <g key={f.id} className="transition-transform duration-150">
              {/* Finger Capsule Body */}
              {f.id !== 'thumb' ? (
                <path
                  d={`M ${xBase} ${yBase} L ${xBase} ${yTop + radius} A ${radius} ${radius} 0 0 1 ${
                    xBase + f.width
                  } ${yTop + radius} L ${xBase + f.width} ${yBase} Z`}
                  fill={isActive ? f.colorHex : isShift ? '#f59e0b' : 'currentColor'}
                  stroke={isActive ? f.colorHex : isShift ? '#d97706' : 'currentColor'}
                  strokeWidth={isActive || isShift ? '2.5' : '1.5'}
                  className={`transition-all duration-150 ${
                    isActive
                      ? 'opacity-95 drop-shadow-md'
                      : isShift
                      ? 'opacity-90 animate-pulse'
                      : 'text-slate-200 dark:text-slate-700/60 stroke-slate-300 dark:stroke-slate-600'
                  }`}
                />
              ) : (
                /* Ergonomic Thumb shape angled toward spacebar (Mirrored) */
                <path
                  d="M 46 142 C 36 128, 28 116, 20 106 A 11 11 0 0 0 10 122 C 18 142, 26 158, 34 168 Z"
                  fill={isActive ? f.colorHex : 'currentColor'}
                  stroke={isActive ? f.colorHex : 'currentColor'}
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className={`transition-all duration-150 ${
                    isActive
                      ? 'opacity-95 drop-shadow-md'
                      : 'text-slate-200 dark:text-slate-700/60 stroke-slate-300 dark:stroke-slate-600'
                  }`}
                />
              )}

              {/* Joint crease details */}
              {f.id !== 'thumb' && (
                <>
                  <line
                    x1={xBase + 2}
                    y1={yBase - f.height * 0.35}
                    x2={xBase + f.width - 2}
                    y2={yBase - f.height * 0.35}
                    stroke="currentColor"
                    className={isActive ? 'text-white/60' : 'text-slate-300 dark:text-slate-600'}
                    strokeWidth="1.2"
                  />
                  <line
                    x1={xBase + 3}
                    y1={yBase - f.height * 0.65}
                    x2={xBase + f.width - 3}
                    y2={yBase - f.height * 0.65}
                    stroke="currentColor"
                    className={isActive ? 'text-white/60' : 'text-slate-300 dark:text-slate-600'}
                    strokeWidth="1.2"
                  />
                </>
              )}

              {/* Tactile indicator for Index Finger (Home anchor ridge below J keycap, not crossing through text) */}
              {f.id === 'index-r' && (
                <line
                  x1={f.tipX - 4}
                  y1={yTop + radius * 2 - 2}
                  x2={f.tipX + 4}
                  y2={yTop + radius * 2 - 2}
                  stroke={isActive ? '#ffffff' : '#0284c7'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}

              {/* Fingertip Home Keycap Badge */}
              <circle
                cx={f.id === 'thumb' ? 18 : f.tipX}
                cy={f.id === 'thumb' ? 116 + (isActive ? -6 : 0) : yTop + radius + 1}
                r={radius - 1}
                fill={isActive ? '#ffffff' : isShift ? '#fef3c7' : '#ffffff'}
                stroke={isActive ? f.colorHex : isShift ? '#d97706' : f.colorHex}
                strokeWidth={isActive || isShift ? '2' : '1.5'}
                className="drop-shadow-xs"
              />

              {/* Home Keycap Label (J, K, L, ;, Space) */}
              <text
                x={f.id === 'thumb' ? 18 : f.tipX}
                y={f.id === 'thumb' ? 120 + (isActive ? -6 : 0) : yTop + radius + 5}
                textAnchor="middle"
                fill={isActive ? f.colorHex : isShift ? '#92400e' : '#334155'}
                className="font-mono font-extrabold text-[11px]"
              >
                {isShift ? '⇧' : f.homeKey}
              </text>

              {/* Target Floating Indicator above Active Finger */}
              {isActive && instruction && (
                <g className="animate-bounce">
                  <rect
                    x={f.id === 'thumb' ? 0 : f.tipX - 18}
                    y={f.id === 'thumb' ? 78 : yTop - 24}
                    width="36"
                    height="18"
                    rx="5"
                    fill={f.colorHex}
                    className="shadow-md"
                  />
                  <polygon
                    points={`${f.id === 'thumb' ? 14 : f.tipX - 4},${
                      f.id === 'thumb' ? 96 : yTop - 6
                    } ${f.id === 'thumb' ? 22 : f.tipX + 4},${
                      f.id === 'thumb' ? 96 : yTop - 6
                    } ${f.id === 'thumb' ? 18 : f.tipX},${
                      f.id === 'thumb' ? 100 : yTop - 2
                    }`}
                    fill={f.colorHex}
                  />
                  <text
                    x={f.id === 'thumb' ? 18 : f.tipX}
                    y={f.id === 'thumb' ? 91 : yTop - 11}
                    textAnchor="middle"
                    fill="#ffffff"
                    className="font-bold text-[10px]"
                  >
                    {instruction.char === ' ' ? '␣' : instruction.char}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Bottom color-code legend strip
 */
export const HandsColorLegend: React.FC = () => {
  return (
    <div className="w-full mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium px-2 gap-2 select-none">
      <span className="font-semibold text-slate-700 dark:text-slate-300">
        कुंजी-उँगली रंग संकेत (Touch Typing Colors):
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>कनिष्ठिका (Pinky) A / ;</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>अनामिका (Ring) S / L</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>मध्यमा (Middle) D / K</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>तर्जनी (Index) F / J</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>अंगूठा (Thumbs) Space</span>
        </span>
      </div>
    </div>
  );
};

export interface VirtualHandsProps {
  nextExpectedChar?: string;
  layout?: 'english' | 'inscript' | 'remington' | 'phonetic';
  shiftRequired?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const VirtualHands: React.FC<VirtualHandsProps> = ({
  nextExpectedChar = '',
  layout = 'english',
  shiftRequired: explicitShift,
  className = '',
  children,
}) => {
  const { currentTheme } = useTheme();

  const instruction = React.useMemo(() => {
    if (!nextExpectedChar) return null;
    const inst = getFingerInstructionForChar(nextExpectedChar, layout);
    if (!inst) return null;
    if (explicitShift !== undefined) {
      inst.shiftRequired = explicitShift;
      if (explicitShift) {
        inst.shiftFinger = getShiftFingerForFinger(inst.finger);
      }
    }
    return inst;
  }, [nextExpectedChar, layout, explicitShift]);

  const activeFinger = instruction?.finger || null;
  const activeShiftFinger = instruction?.shiftRequired ? instruction.shiftFinger : null;

  return (
    <div
      className={`w-full bg-slate-900/5 dark:bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner select-none transition-all ${className}`}
    >
      {/* Top Guidance HUD */}
      <HandsGuidanceHUD
        instruction={instruction}
        activeShiftFinger={activeShiftFinger}
        primaryColor={currentTheme.primaryColor}
      />

      {/* Flanked Layout: Left Hand - Keyboard (children) - Right Hand */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 w-full overflow-x-auto py-1">
        <div className="shrink-0 w-28 sm:w-36 md:w-40 flex flex-col items-center">
          <LeftHandVisualizer
            activeFinger={activeFinger}
            activeShiftFinger={activeShiftFinger}
            instruction={instruction}
          />
        </div>

        {children && <div className="shrink-0">{children}</div>}

        <div className="shrink-0 w-28 sm:w-36 md:w-40 flex flex-col items-center">
          <RightHandVisualizer
            activeFinger={activeFinger}
            activeShiftFinger={activeShiftFinger}
            instruction={instruction}
          />
        </div>
      </div>

      {/* Bottom Color Code Legend */}
      <HandsColorLegend />
    </div>
  );
};
