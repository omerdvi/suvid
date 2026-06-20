import { clarificationGroups } from '../data/seed';
import type { Ingredient, SearchResult } from './types';

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[״׳"']/g, '')
    .replace(/\s+/g, ' ');

export function findIngredient(ingredients: Ingredient[], query: string): SearchResult {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return { kind: 'none', suggestions: ingredients.slice(0, 5) };
  }

  const clarification = clarificationGroups.find((group) => normalize(group.query) === normalizedQuery);
  if (clarification) {
    return {
      kind: 'clarify',
      question: clarification.question,
      choices: clarification.ingredientIds
        .map((id) => ingredients.find((ingredient) => ingredient.id === id))
        .filter((ingredient): ingredient is Ingredient => Boolean(ingredient))
    };
  }

  const exact = ingredients.find((ingredient) =>
    [ingredient.name, ...ingredient.aliases].some((alias) => normalize(alias) === normalizedQuery)
  );
  if (exact) return { kind: 'match', ingredient: exact };

  const partial = ingredients.find((ingredient) =>
    [ingredient.name, ...ingredient.aliases].some((alias) => {
      const normalizedAlias = normalize(alias);
      return normalizedAlias.includes(normalizedQuery) || normalizedQuery.includes(normalizedAlias);
    })
  );
  if (partial) return { kind: 'match', ingredient: partial };

  const suggestions = ingredients
    .filter((ingredient) =>
      [ingredient.name, ...ingredient.aliases].some((alias) => normalize(alias).includes(normalizedQuery.slice(0, 3)))
    )
    .slice(0, 5);

  return { kind: 'none', suggestions };
}
