import { describe, expect, it } from 'vitest';
import { calculateStartTime } from './schedule';

const now = '2026-06-15T08:00:00+03:00';

describe('ready-at calculator', () => {
  it('says to start on the previous day when cooking crosses a date boundary', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-20T20:00:00+03:00',
      cookHours: 24,
      warmupMinutes: 25,
      finishingMinutes: 15,
      now
    });

    expect(start.iso).toBe('2026-06-19T16:20:00.000Z');
    expect(start.hebrewSummary).toBe('להתחיל בערך ביום שלפני בשעה 19:20');
  });

  it('says same morning when the start time is on serving day before noon', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-20T20:00:00+03:00',
      cookHours: 10,
      warmupMinutes: 25,
      finishingMinutes: 15,
      now
    });

    expect(start.hebrewSummary).toBe('להתחיל בערך באותו הבוקר בשעה 09:20');
  });

  it('says same day when the start time is later than morning', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-20T20:00:00+03:00',
      cookHours: 4,
      warmupMinutes: 25,
      finishingMinutes: 15,
      now
    });

    expect(start.hebrewSummary).toBe('להתחיל בערך באותו היום בשעה 15:20');
  });

  it('counts the days for multi-day cooks instead of saying "the day before"', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-20T20:00:00+03:00',
      cookHours: 48,
      warmupMinutes: 25,
      finishingMinutes: 15,
      now
    });

    // 2026-06-18 is a Thursday
    expect(start.hebrewSummary).toBe('להתחיל בערך יומיים לפני, ביום חמישי בשעה 19:20');
  });

  it('tells the user when it would be ready if the start time already passed', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-16T20:00:00+03:00',
      cookHours: 36,
      warmupMinutes: 25,
      finishingMinutes: 15,
      now
    });

    expect(start.startInPast).toBe(true);
    expect(start.hebrewSummary).toContain('אם מתחילים עכשיו');
    // now (Mon 08:00) + 36h40m => Tuesday 20:40
    expect(start.hebrewSummary).toContain('מחר בשעה 20:40');
  });

  it('says "today" when starting now still finishes on the same day', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-15T09:00:00+03:00',
      cookHours: 2,
      warmupMinutes: 25,
      finishingMinutes: 15,
      now
    });

    expect(start.startInPast).toBe(true);
    expect(start.hebrewSummary).toContain('היום בשעה 10:40');
  });
});
