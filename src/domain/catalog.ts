import { seedIngredients } from '../data/seed';
import { COMMUNITY_CATEGORY } from './community';
import type { CatalogResponse, Ingredient } from './types';

/** Categories surfaced first, in this order. The rest sit behind an "עוד…" toggle in the UI. */
export const PRIMARY_CATEGORIES = ['בקר', 'עוף', 'דגים'];

// [bucket, withinBucketIndex] — lower sorts first. Primary categories, then the rest, then community.
const categoryRank = (name: string): [number, number] => {
  const primary = PRIMARY_CATEGORIES.indexOf(name);
  if (primary !== -1) return [0, primary];
  if (name === COMMUNITY_CATEGORY) return [2, 0];
  return [1, 0];
};

export function buildCatalog(ingredients: Ingredient[] = seedIngredients): CatalogResponse {
  const grouped = new Map<string, { id: string; name: string; category: string }[]>();
  for (const ingredient of ingredients) {
    grouped.set(ingredient.category, [
      ...(grouped.get(ingredient.category) ?? []),
      { id: ingredient.id, name: ingredient.name, category: ingredient.category }
    ]);
  }

  return {
    totalIngredients: ingredients.length,
    categories: [...grouped.entries()]
      .map(([name, items]) => ({
        name,
        ingredients: items.sort((a, b) => a.name.localeCompare(b.name, 'he'))
      }))
      .sort((a, b) => {
        const [bucketA, indexA] = categoryRank(a.name);
        const [bucketB, indexB] = categoryRank(b.name);
        if (bucketA !== bucketB) return bucketA - bucketB;
        if (indexA !== indexB) return indexA - indexB;
        return a.name.localeCompare(b.name, 'he');
      })
  };
}
