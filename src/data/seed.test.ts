import { describe, expect, it } from 'vitest';
import { seedIngredients } from './seed';

const allOptions = seedIngredients.flatMap((ingredient) =>
  ingredient.options.map((option) => ({ ingredient, option }))
);

describe('seed recipe database quality', () => {
  it('includes pargit as a core Israeli poultry cut', () => {
    expect(seedIngredients.some((ingredient) => ingredient.id === 'pargit')).toBe(true);
  });

  it('offers a broad catalog of Israeli-available ingredients', () => {
    expect(seedIngredients.length).toBeGreaterThanOrEqual(40);
    for (const id of [
      'picanha',
      'sinta',
      'beef-fillet',
      'chicken-thighs',
      'turkey-breast',
      'denis',
      'levrak',
      'tuna',
      'chuck-beef',
      'tri-tip',
      'duck-breast',
      'scallops',
      'calamari',
      'potato',
      'carrot',
      'asparagus',
      'corn',
      'beef-tongue',
      'roast-beef',
      'chicken-wings',
      'tilapia',
      'cod',
      'trout',
      'octopus',
      'lobster',
      'pork-tenderloin',
      'pork-shoulder',
      'lamb-shank',
      'lamb-shoulder',
      'cauliflower'
    ]) {
      expect(seedIngredients.some((ingredient) => ingredient.id === id)).toBe(true);
    }
  });

  it('groups tofu under its own label and keeps a vegetables category', () => {
    expect(seedIngredients.find((ingredient) => ingredient.id === 'tofu')?.category).toBe('טופו');
    expect(seedIngredients.filter((ingredient) => ingredient.category === 'ירקות').length).toBeGreaterThanOrEqual(5);
  });

  it('keeps ingredient ids and option ids unique', () => {
    const ingredientIds = seedIngredients.map((ingredient) => ingredient.id);
    expect(new Set(ingredientIds).size).toBe(ingredientIds.length);

    const optionIds = seedIngredients.flatMap((ingredient) => ingredient.options.map((option) => option.id));
    expect(new Set(optionIds).size).toBe(optionIds.length);
  });

  it('keeps every ingredient usable as a calculator answer', () => {
    for (const ingredient of seedIngredients) {
      expect(ingredient.name).toBeTruthy();
      expect(ingredient.category).toBeTruthy();
      expect(ingredient.aliases.length).toBeGreaterThan(0);
      expect(ingredient.options.length).toBeGreaterThan(0);
      expect(ingredient.options.length).toBeLessThanOrEqual(3);
      expect(ingredient.options.filter((option) => option.recommended).length).toBe(1);
      expect(ingredient.recommendations.length).toBeGreaterThan(0);
    }
  });

  it('backs every recommended option with at least two reliable sources', () => {
    for (const ingredient of seedIngredients) {
      const recommended = ingredient.options.find((option) => option.recommended);
      expect(recommended, ingredient.id).toBeTruthy();
      expect(recommended!.sources.length, ingredient.id).toBeGreaterThanOrEqual(2);
    }
  });

  // These recommended values were cross-checked against Baldwin, Serious Eats,
  // ChefSteps, Anova and Amazing Food Made Easy. Treat changes here as deliberate.
  it('matches verified temperatures/times from reliable sources for recommended options', () => {
    const verified: Record<string, { temperatureC: number; timeHours: number }> = {
      asado: { temperatureC: 68, timeHours: 36 },
      ribeye: { temperatureC: 54, timeHours: 1.5 },
      brisket: { temperatureC: 68, timeHours: 36 },
      picanha: { temperatureC: 54, timeHours: 2 },
      sinta: { temperatureC: 54, timeHours: 1.5 },
      'beef-fillet': { temperatureC: 54, timeHours: 1.5 },
      'beef-tongue': { temperatureC: 70, timeHours: 24 },
      'chicken-breast': { temperatureC: 63, timeHours: 1.5 },
      pargit: { temperatureC: 64, timeHours: 2 },
      'chicken-thighs': { temperatureC: 74, timeHours: 3 },
      'turkey-breast': { temperatureC: 63, timeHours: 2.5 },
      'chicken-wings': { temperatureC: 75, timeHours: 2 },
      'duck-breast': { temperatureC: 55, timeHours: 2 },
      salmon: { temperatureC: 50, timeHours: 0.75 },
      denis: { temperatureC: 52, timeHours: 0.5 },
      levrak: { temperatureC: 52, timeHours: 0.5 },
      tuna: { temperatureC: 45, timeHours: 0.5 },
      cod: { temperatureC: 55, timeHours: 0.5 },
      trout: { temperatureC: 51, timeHours: 0.5 },
      shrimp: { temperatureC: 57, timeHours: 0.5 },
      scallops: { temperatureC: 50, timeHours: 0.5 },
      octopus: { temperatureC: 77, timeHours: 5 },
      lobster: { temperatureC: 56, timeHours: 0.75 },
      'pork-ribs': { temperatureC: 74, timeHours: 12 },
      'pork-tenderloin': { temperatureC: 59, timeHours: 1.5 },
      'pork-shoulder': { temperatureC: 74, timeHours: 20 },
      'lamb-ribs': { temperatureC: 56, timeHours: 2 },
      'lamb-shank': { temperatureC: 68, timeHours: 24 },
      'lamb-shoulder': { temperatureC: 70, timeHours: 24 },
      eggs: { temperatureC: 63, timeHours: 1 },
      'beef-neck': { temperatureC: 68, timeHours: 36 },
      'beef-shin': { temperatureC: 62, timeHours: 48 },
      'goose-breast': { temperatureC: 55, timeHours: 2.5 },
      carrot: { temperatureC: 85, timeHours: 1 },
      asparagus: { temperatureC: 85, timeHours: 0.25 }
    };

    for (const [id, expected] of Object.entries(verified)) {
      const ingredient = seedIngredients.find((item) => item.id === id);
      expect(ingredient, id).toBeTruthy();
      const recommended = ingredient!.options.find((option) => option.recommended);
      expect(recommended, id).toBeTruthy();
      expect(recommended!.temperatureC, `${id} temperature`).toBe(expected.temperatureC);
      expect(recommended!.timeHours, `${id} time`).toBe(expected.timeHours);
    }
  });

  it('keeps every option practical, sourced, and within sous-vide ranges', () => {
    for (const { option } of allOptions) {
      expect(option.temperatureC).toBeGreaterThanOrEqual(45);
      expect(option.temperatureC).toBeLessThanOrEqual(90);
      expect(option.timeHours).toBeGreaterThan(0);
      expect(option.timeHours).toBeLessThanOrEqual(72);
      expect(option.texture).toBeTruthy();
      expect(option.whenToChoose).toBeTruthy();
      expect(option.prep.length).toBeGreaterThan(0);
      expect(option.finish.length).toBeGreaterThan(0);
      expect(option.sources.length).toBeGreaterThan(0);
      for (const source of option.sources) {
        expect(source.title).toBeTruthy();
        expect(source.url).toMatch(/^https:\/\//);
      }
    }
  });
});
