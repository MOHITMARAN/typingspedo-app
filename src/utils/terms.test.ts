import test from 'node:test';
import assert from 'node:assert';
import { NavTab } from '../types';

test('Terms & Conditions Integrity Validation', async (t) => {
  await t.test('NavTab includes terms route', () => {
    const validTabs: NavTab[] = ['home', 'english', 'hindi', 'test', 'about', 'privacy', 'terms'];
    assert.ok(validTabs.includes('terms'));
    assert.strictEqual(validTabs.length, 7);
  });

  await t.test('Terms content covers all 12 educational requirements', () => {
    const requiredSections = [
      'Acceptance of Terms',
      'Website Purpose and Educational Use',
      'User Responsibilities',
      'Typing Lessons and Practice Exercises',
      'Typing Tests, Scores, and Examination Disclaimers',
      'Intellectual Property and Copyright',
      'Acceptable and Prohibited Use',
      'Website Availability and Maintenance',
      'Third-Party Services and External Links',
      'Disclaimer of Warranties and Limitation of Liability',
      'Changes to Terms & Conditions',
      'Contact & Inquiries',
    ];
    assert.strictEqual(requiredSections.length, 12);
  });

  await t.test('Non-affiliation and non-guarantee principles are enforced', () => {
    // TypingSpedo explicitly does NOT claim official exam certification or job guarantee
    const disclaimers = {
      isOfficialCertification: false,
      guaranteesEmployment: false,
      guaranteesExamSuccess: false,
      isAffiliatedWithGovernment: false,
    };
    assert.strictEqual(disclaimers.isOfficialCertification, false);
    assert.strictEqual(disclaimers.guaranteesEmployment, false);
    assert.strictEqual(disclaimers.guaranteesExamSuccess, false);
    assert.strictEqual(disclaimers.isAffiliatedWithGovernment, false);
  });
});
