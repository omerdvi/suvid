import { describe, expect, it } from 'vitest';
import {
  assessSafety,
  recommendedCookHours,
  referenceThicknessCm,
  searGuide,
  thicknessExtraHours
} from './cooking';

describe('thickness-based cook time', () => {
  it('keeps the trusted base time at the reference thickness', () => {
    const steak = { timeHours: 1.5 };
    expect(recommendedCookHours(steak, 2.5, referenceThicknessCm('בקר'), false)).toBe(1.5);
  });

  it('adds time for cuts thicker than the reference', () => {
    const steak = { timeHours: 1.5 };
    const thick = recommendedCookHours(steak, 5, referenceThicknessCm('בקר'), false);
    expect(thick).toBeGreaterThan(1.5);
    // a 5cm steak needs several extra hours of heating
    expect(thick).toBeGreaterThanOrEqual(5);
  });

  it('never goes below the base time for thinner cuts', () => {
    const steak = { timeHours: 1.5 };
    expect(recommendedCookHours(steak, 1, referenceThicknessCm('בקר'), false)).toBe(1.5);
  });

  it('barely changes long collagen cooks with thickness', () => {
    const shortRibs = { timeHours: 24 };
    expect(recommendedCookHours(shortRibs, 5, 2.5, false)).toBe(24);
  });

  it('adds a frozen penalty', () => {
    const steak = { timeHours: 1.5 };
    const fresh = recommendedCookHours(steak, 2.5, 2.5, false);
    const frozen = recommendedCookHours(steak, 2.5, 2.5, true);
    expect(frozen).toBeGreaterThan(fresh);
  });

  it('extra hours grow with the square of thickness', () => {
    const ref = 2.5;
    const at4 = thicknessExtraHours(4, ref, false);
    const at6 = thicknessExtraHours(6, ref, false);
    expect(at6).toBeGreaterThan(at4 * 2);
  });
});

describe('food-safety assessment', () => {
  it('marks pasteurized poultry as safe for everyone', () => {
    expect(assessSafety('עוף', 63, 1.5).level).toBe('pasteurized');
    expect(assessSafety('עוף', 74, 2).level).toBe('pasteurized');
  });

  it('flags low-temperature poultry as risky', () => {
    expect(assessSafety('עוף', 55, 2).level).not.toBe('pasteurized');
  });

  it('treats medium-rare steak as safe to eat immediately, not pasteurized', () => {
    expect(assessSafety('בקר', 54, 1.5).level).toBe('immediate');
    expect(assessSafety('בקר', 55, 1.5).level).toBe('pasteurized');
  });

  it('pasteurizes tough cuts cooked long and low', () => {
    expect(assessSafety('בקר', 75, 24).level).toBe('pasteurized');
  });

  it('treats duck and goose as poultry: no pasteurization claim below 57°C', () => {
    expect(assessSafety('ברווז', 55, 2).level).toBe('immediate');
    expect(assessSafety('ברווז', 58, 1.5).level).toBe('pasteurized');
    expect(assessSafety('אווז', 55, 2.5).level).toBe('immediate');
  });

  it('classifies fish by temperature', () => {
    expect(assessSafety('דגים', 45, 0.5).level).toBe('raw');
    expect(assessSafety('דגים', 52, 0.5).level).toBe('immediate');
    expect(assessSafety('דגים', 55, 0.5).level).toBe('cooked');
  });

  it('treats vegetables and tofu as having no meat-style risk', () => {
    expect(assessSafety('ירקות', 85, 1).level).toBe('cooked');
    expect(assessSafety('טופו', 82, 1).level).toBe('cooked');
  });
});

describe('sear guidance', () => {
  it('gives concrete sear seconds per category', () => {
    expect(searGuide('בקר')).toMatch(/45-60 שניות/);
    expect(searGuide('דגים')).toMatch(/צד העור/);
    expect(searGuide('עוף')).toMatch(/דקות/);
  });
});
