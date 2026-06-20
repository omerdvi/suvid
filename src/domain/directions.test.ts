import { describe, expect, it } from 'vitest';
import { seedIngredients } from '../data/seed';
import { categoryDirections, withDirections } from './directions';

const find = (id: string) => seedIngredients.find((item) => item.id === id)!;

describe('preparation direction tabs', () => {
  it('adds multiple category directions templated with the ingredient name', () => {
    const directions = categoryDirections(find('ribeye'));
    expect(directions.length).toBeGreaterThanOrEqual(2);
    expect(directions.every((direction) => direction.ingredients[0] === 'אנטריקוט')).toBe(true);
    expect(directions.every((direction) => direction.steps.length > 0)).toBe(true);
  });

  it('gives every seed ingredient at least three preparation directions total', () => {
    for (const ingredient of seedIngredients) {
      const decorated = withDirections(ingredient);
      expect(decorated.recommendations.length, ingredient.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps direction ids unique within an ingredient', () => {
    for (const ingredient of seedIngredients) {
      const decorated = withDirections(ingredient);
      const ids = decorated.recommendations.map((recommendation) => recommendation.id);
      expect(new Set(ids).size, ingredient.id).toBe(ids.length);
    }
  });

  it('returns nothing extra for unknown categories', () => {
    expect(categoryDirections({ ...find('ribeye'), category: 'הצעות קהילה' })).toEqual([]);
  });
});
