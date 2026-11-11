import test from 'node:test';
import assert from 'node:assert/strict';
import { THEMES_LIST, ThemeId } from '../types/theme';

test('Theme configuration validation', () => {
  assert.equal(THEMES_LIST.length, 8, 'There should be exactly 8 themes available');
  
  const expectedIds: ThemeId[] = [
    'default',
    'emerald',
    'violet',
    'amber',
    'rose',
    'cyberpunk',
    'sepia',
    'slate',
  ];

  expectedIds.forEach((id) => {
    const theme = THEMES_LIST.find((t) => t.id === id);
    assert.ok(theme, `Theme ${id} must exist in THEMES_LIST`);
    assert.ok(theme.name, `Theme ${id} must have a name`);
    assert.ok(theme.hindiName, `Theme ${id} must have a hindiName`);
    assert.ok(theme.primaryColor.startsWith('#'), `Theme ${id} primary color must be a valid hex`);
    assert.ok(theme.previewSwatches.length === 3, `Theme ${id} must have 3 preview swatches`);
  });
});

test('Default theme properties', () => {
  const defaultTheme = THEMES_LIST.find((t) => t.id === 'default');
  assert.ok(defaultTheme);
  assert.equal(defaultTheme.name, 'TypingSpedo Navy');
  assert.equal(defaultTheme.primaryColor, '#0284c7');
});

test('Cyberpunk theme high-contrast verification', () => {
  const cyber = THEMES_LIST.find((t) => t.id === 'cyberpunk');
  assert.ok(cyber);
  assert.equal(cyber.primaryColor, '#06b6d4');
  assert.equal(cyber.accentColor, '#10b981');
});
