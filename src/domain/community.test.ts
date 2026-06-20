import { describe, expect, it } from 'vitest';
import { seedIngredients } from '../data/seed';
import { COMMUNITY_CATEGORY, isPublishable, mergeCommunity, toCommunityIngredient } from './community';
import type { PublishedContribution, StoredSuggestion } from './types';

const suggestion = (overrides: Partial<StoredSuggestion>): StoredSuggestion => ({
  id: 'sug-1',
  ingredientName: 'בroot',
  temperatureC: 60,
  timeHours: 2,
  prep: 'מלח',
  finish: 'צריבה',
  notes: 'יצא מצוין',
  status: 'approved',
  createdAt: '2026-06-20T00:00:00.000Z',
  ...overrides
});

const contribution = (overrides: Partial<PublishedContribution> = {}): PublishedContribution => ({
  id: 'sug-1',
  ingredientName: 'קבב פרגית',
  temperatureC: 65,
  timeHours: 2,
  prep: 'מלח, כמון',
  finish: 'צריבה חזקה',
  notes: 'עסיסי',
  ...overrides
});

describe('community contributions', () => {
  it('only publishes approved suggestions that have a temperature and time', () => {
    expect(isPublishable(suggestion({}))).toBe(true);
    expect(isPublishable(suggestion({ status: 'pending_review' }))).toBe(false);
    expect(isPublishable(suggestion({ temperatureC: undefined }))).toBe(false);
    expect(isPublishable(suggestion({ timeHours: undefined }))).toBe(false);
  });

  it('builds a usable calculator ingredient from a contribution', () => {
    const ingredient = toCommunityIngredient(contribution());

    expect(ingredient.category).toBe(COMMUNITY_CATEGORY);
    expect(ingredient.name).toBe('קבב פרגית');
    expect(ingredient.options).toHaveLength(1);
    const [option] = ingredient.options;
    expect(option.community).toBe(true);
    expect(option.recommended).toBe(true);
    expect(option.temperatureC).toBe(65);
    expect(option.prep).toEqual(['מלח', 'כמון']);
  });

  it('appends contributions to the curated catalog without touching the seed', () => {
    const merged = mergeCommunity(seedIngredients, [contribution()]);
    expect(merged.length).toBe(seedIngredients.length + 1);
    expect(merged.some((ingredient) => ingredient.id === 'community-sug-1')).toBe(true);
    expect(seedIngredients.some((ingredient) => ingredient.category === COMMUNITY_CATEGORY)).toBe(false);
  });
});
