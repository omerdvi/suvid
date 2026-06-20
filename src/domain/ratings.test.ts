import { describe, expect, it } from 'vitest';
import { deriveInsight, summarizeRatings, type StoredRating } from './ratings';

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
