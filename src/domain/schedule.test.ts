import { describe, expect, it } from 'vitest';
import { calculateStartTime } from './schedule';

describe('ready-at calculator', () => {
  it('says to start on the previous day when cooking crosses a date boundary', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-20T20:00:00+03:00',
      cookHours: 24,
      warmupMinutes: 25,
      finishingMinutes: 15
    });

    expect(start.iso).toBe('2026-06-19T16:20:00.000Z');
    expect(start.hebrewSummary).toBe('להתחיל בערך ביום שלפני בשעה 19:20');
  });

  it('says same morning when the start time is on serving day before noon', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-20T20:00:00+03:00',
      cookHours: 10,
      warmupMinutes: 25,
      finishingMinutes: 15
    });

    expect(start.hebrewSummary).toBe('להתחיל בערך באותו הבוקר בשעה 09:20');
  });

  it('says same day when the start time is later than morning', () => {
    const start = calculateStartTime({
      readyAt: '2026-06-20T20:00:00+03:00',
      cookHours: 4,
      warmupMinutes: 25,
      finishingMinutes: 15
    });

    expect(start.hebrewSummary).toBe('להתחיל בערך באותו היום בשעה 15:20');
  });
});
