import { describe, expect, it } from 'vitest';
import { seedIngredients } from '../data/seed';
import { findIngredient } from './search';

describe('Hebrew ingredient search', () => {
  it('finds אסאדו by its Hebrew name and returns clean calculator options', () => {
    const result = findIngredient(seedIngredients, 'אסאדו');

    expect(result.kind).toBe('match');
    if (result.kind !== 'match') return;
    expect(result.ingredient.name).toBe('אסאדו');
    expect(result.ingredient.options).toHaveLength(3);
    expect(result.ingredient.options[0]).toMatchObject({
      temperatureC: 75,
      timeHours: 24,
      texture: 'רך מאוד, עדיין מחזיק צורה'
    });
  });

  it('asks for clarification when צלעות can mean very different foods', () => {
    const result = findIngredient(seedIngredients, 'צלעות');

    expect(result.kind).toBe('clarify');
    if (result.kind !== 'clarify') return;
    expect(result.question).toBe('איזה סוג צלעות יש לך?');
    expect(result.choices.map((choice) => choice.name)).toEqual([
      'אסאדו',
      'צלעות טלה',
      'צלעות חזיר'
    ]);
  });

  it('asks which steak when סטייק is ambiguous', () => {
    const result = findIngredient(seedIngredients, 'סטייק');

    expect(result.kind).toBe('clarify');
    if (result.kind !== 'clarify') return;
    expect(result.question).toBe('איזה סטייק יש לך?');
    expect(result.choices.map((choice) => choice.name)).toContain('פיקניה');
  });

  it('finds a newly added cut by Hebrew name', () => {
    const result = findIngredient(seedIngredients, 'דניס');

    expect(result.kind).toBe('match');
    if (result.kind !== 'match') return;
    expect(result.ingredient.category).toBe('דגים');
  });

  it('finds vegetables so users can plan vegetable sides', () => {
    const result = findIngredient(seedIngredients, 'גזר');

    expect(result.kind).toBe('match');
    if (result.kind !== 'match') return;
    expect(result.ingredient.category).toBe('ירקות');
    expect(result.ingredient.options[0].temperatureC).toBeGreaterThan(0);
  });

  it('finds frozen seafood aliases in Hebrew', () => {
    const result = findIngredient(seedIngredients, 'שרימפס קפוא');

    expect(result.kind).toBe('match');
    if (result.kind !== 'match') return;
    expect(result.ingredient.name).toBe('שרימפס');
    expect(result.ingredient.frozenNote).toContain('להפשיר');
  });
});
