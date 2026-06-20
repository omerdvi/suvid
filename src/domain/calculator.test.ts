import { describe, expect, it } from 'vitest';
import { seedIngredients } from '../data/seed';
import { buildCalculatorResult } from './calculator';

describe('Sous-vide calculator result', () => {
  it('keeps only three meaningful options and marks the recommended one', () => {
    const asado = seedIngredients.find((ingredient) => ingredient.name === 'אסאדו');
    expect(asado).toBeDefined();

    const result = buildCalculatorResult(asado!);

    expect(result.options).toHaveLength(3);
    expect(result.options.filter((option) => option.recommended)).toHaveLength(1);
    expect(result.options[0].label).toBe('מומלץ');
  });

  it('adds practical notes for unusually thick or frozen ingredients', () => {
    const salmon = seedIngredients.find((ingredient) => ingredient.name === 'סלמון');
    expect(salmon).toBeDefined();

    const result = buildCalculatorResult(salmon!, { thickness: 'thick', frozen: true });

    expect(result.adjustments).toContain('נתח עבה: להוסיף 20-30 דקות או לחלק למנות דקות יותר.');
    expect(result.adjustments).toContain('קפוא: להפשיר במקרר ולייבש היטב לפני השקית.');
  });
});
