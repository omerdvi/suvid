import type { CalculatorResult, Ingredient, Thickness } from './types';

interface CalculatorInput {
  thickness?: Thickness;
  frozen?: boolean;
}

export function buildCalculatorResult(
  ingredient: Ingredient,
  input: CalculatorInput = {}
): CalculatorResult {
  const options = ingredient.options.slice(0, 3);
  const adjustments: string[] = [];

  if (input.thickness === 'thick' && ingredient.thickNote) {
    adjustments.push(ingredient.thickNote);
  }

  if (input.frozen && ingredient.frozenNote) {
    adjustments.push(ingredient.frozenNote);
  }

  return {
    ingredient,
    options,
    adjustments
  };
}
