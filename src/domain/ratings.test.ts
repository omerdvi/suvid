import { describe, expect, it } from 'vitest';
import { deriveInsight, isSuggestionInput, summarizeRatings, type StoredRating } from './ratings';
import type { RecipeSuggestionInput } from './types';

const suggestion = (overrides: Partial<RecipeSuggestionInput> = {}): Partial<RecipeSuggestionInput> => ({
  ingredientName: 'קבב פרגית',
  prep: 'מלח',
  finish: 'צריבה',
  notes: 'עסיסי',
  temperatureC: 65,
  timeHours: 2,
  sourceUrl: 'https://example.com',
  ...overrides
});

describe('suggestion validation', () => {
  it('accepts a well-formed suggestion', () => {
    expect(isSuggestionInput(suggestion())).toBe(true);
  });

  it('accepts a suggestion without optional temp/time/source', () => {
    expect(
      isSuggestionInput({ ingredientName: 'אנטריקוט', prep: 'מלח', finish: 'צריבה', notes: 'נחמד' })
    ).toBe(true);
  });

  it('rejects out-of-range temperature and time', () => {
    expect(isSuggestionInput(suggestion({ temperatureC: 500 }))).toBe(false);
    expect(isSuggestionInput(suggestion({ timeHours: 0 }))).toBe(false);
    expect(isSuggestionInput(suggestion({ timeHours: 200 }))).toBe(false);
    expect(isSuggestionInput(suggestion({ temperatureC: Number.NaN }))).toBe(false);
  });

  it('rejects non-https source URLs', () => {
    expect(isSuggestionInput(suggestion({ sourceUrl: 'javascript:alert(1)' }))).toBe(false);
    expect(isSuggestionInput(suggestion({ sourceUrl: 'http://example.com' }))).toBe(false);
  });

  it('rejects empty or oversized text', () => {
    expect(isSuggestionInput(suggestion({ ingredientName: '   ' }))).toBe(false);
    expect(isSuggestionInput(suggestion({ notes: 'x'.repeat(1001) }))).toBe(false);
  });
});

const rating = (overrides: Partial<StoredRating>): StoredRating => ({
  id: Math.random().toString(36).slice(2),
  targetId: 'asado-recommended',
  stars: 5,
  note: '',
  textureFeedback: '',
  nextTime: '',
  createdAt: '2026-06-20T00:00:00.000Z',
  ...overrides
});

describe('rating insights', () => {
  it('returns no insight with fewer than two ratings', () => {
    expect(deriveInsight([rating({ nextTime: 'יותר צריבה' })])).toBeUndefined();
  });

  it('surfaces a dominant "more sear" request from the crowd', () => {
    const insight = deriveInsight([
      rating({ nextTime: 'יותר צריבה' }),
      rating({ nextTime: 'לצרוב יותר חזק' }),
      rating({ nextTime: 'פחות מלח' })
    ]);

    expect(insight).toBe('רוב המשתמשים ביקשו יותר צריבה');
  });

  it('warns when the average rating is low', () => {
    const insight = deriveInsight([
      rating({ stars: 2, note: 'בסדר' }),
      rating({ stars: 1, note: 'לא אהבתי' })
    ]);

    expect(insight).toBe('דירוג נמוך עד כה — שווה לבדוק את הזמן והטמפרטורה');
  });

  it('attaches the insight to the summary', () => {
    const summaries = summarizeRatings([
      rating({ nextTime: 'יותר צריבה' }),
      rating({ textureFeedback: 'חסר קראסט' })
    ]);

    expect(summaries['asado-recommended'].insight).toBe('רוב המשתמשים ביקשו יותר צריבה');
  });
});
