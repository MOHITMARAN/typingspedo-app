export type ThemeId =
  | 'default'
  | 'emerald'
  | 'violet'
  | 'amber'
  | 'rose'
  | 'cyberpunk'
  | 'sepia'
  | 'slate';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  hindiName: string;
  tagline: string;
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  ringColor: string;
  gradientFrom: string;
  gradientTo: string;
  previewSwatches: [string, string, string]; // [primary, accent, background]
  badgeText: string;
}

export const THEMES_LIST: ThemeConfig[] = [
  {
    id: 'default',
    name: 'TypingSpedo Navy',
    hindiName: 'क्लासिक नेवी',
    tagline: 'Professional Navy & Sky Blue — Clean & balanced',
    primaryColor: '#0284c7',
    primaryHover: '#0369a1',
    accentColor: '#1e3a8a',
    ringColor: '#38bdf8',
    gradientFrom: '#1e3a8a',
    gradientTo: '#0284c7',
    previewSwatches: ['#0284c7', '#1e3a8a', '#f8fafc'],
    badgeText: 'Classic',
  },
  {
    id: 'emerald',
    name: 'Emerald Scholar',
    hindiName: 'एमराल्ड ग्रीन',
    tagline: 'Forest Green & Mint — Calming for long study sessions',
    primaryColor: '#059669',
    primaryHover: '#047857',
    accentColor: '#064e3b',
    ringColor: '#34d399',
    gradientFrom: '#064e3b',
    gradientTo: '#059669',
    previewSwatches: ['#059669', '#064e3b', '#ecfdf5'],
    badgeText: 'Focus',
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    hindiName: 'रॉयल पर्पल',
    tagline: 'Imperial Violet & Lavender — Elegant & creative',
    primaryColor: '#7c3aed',
    primaryHover: '#6d28d9',
    accentColor: '#4c1d95',
    ringColor: '#a78bfa',
    gradientFrom: '#4c1d95',
    gradientTo: '#7c3aed',
    previewSwatches: ['#7c3aed', '#4c1d95', '#f5f3ff'],
    badgeText: 'Creative',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    hindiName: 'सनसेट अंबर',
    tagline: 'Warm Gold & Amber — Energizing and high contrast',
    primaryColor: '#d97706',
    primaryHover: '#b45309',
    accentColor: '#78350f',
    ringColor: '#fbbf24',
    gradientFrom: '#78350f',
    gradientTo: '#d97706',
    previewSwatches: ['#d97706', '#78350f', '#fffbeb'],
    badgeText: 'Energy',
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    hindiName: 'रोज़ क्वार्ट्ज़',
    tagline: 'Crimson Rose & Coral — Fresh, modern aesthetic',
    primaryColor: '#e11d48',
    primaryHover: '#be123c',
    accentColor: '#881337',
    ringColor: '#fb7185',
    gradientFrom: '#881337',
    gradientTo: '#e11d48',
    previewSwatches: ['#e11d48', '#881337', '#fff1f2'],
    badgeText: 'Modern',
  },
  {
    id: 'cyberpunk',
    name: 'Cyber Neon',
    hindiName: 'साइबर नियॉन',
    tagline: 'Matrix Cyan & Electric Lime on Obsidian Black',
    primaryColor: '#06b6d4',
    primaryHover: '#0891b2',
    accentColor: '#10b981',
    ringColor: '#22d3ee',
    gradientFrom: '#083344',
    gradientTo: '#06b6d4',
    previewSwatches: ['#06b6d4', '#10b981', '#050811'],
    badgeText: 'High-Tech',
  },
  {
    id: 'sepia',
    name: 'Vintage Sepia',
    hindiName: 'विंटेज सेपिया',
    tagline: 'Warm Parchment & Amber Leather — Gentle on the eyes',
    primaryColor: '#b45309',
    primaryHover: '#92400e',
    accentColor: '#451a03',
    ringColor: '#f59e0b',
    gradientFrom: '#451a03',
    gradientTo: '#b45309',
    previewSwatches: ['#b45309', '#451a03', '#faf6ed'],
    badgeText: 'Eye-Care',
  },
  {
    id: 'slate',
    name: 'Minimal Slate',
    hindiName: 'मिनिमल स्लेट',
    tagline: 'Pure Monochrome Slate & Steel — Zero distraction',
    primaryColor: '#475569',
    primaryHover: '#334155',
    accentColor: '#0f172a',
    ringColor: '#94a3b8',
    gradientFrom: '#0f172a',
    gradientTo: '#475569',
    previewSwatches: ['#475569', '#0f172a', '#f8fafc'],
    badgeText: 'Minimal',
  },
];
