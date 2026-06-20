import { seedIngredients } from './data/seed';
import { buildCatalog } from './domain/catalog';
import { mergeCommunity } from './domain/community';
import { withDirections } from './domain/directions';
import { findIngredient } from './domain/search';
import type {
  CatalogResponse,
  Ingredient,
  PublishedContribution,
  RatingInput,
  RatingSummary,
  RecipeSuggestionInput,
  ReviewStatus,
  SearchResult,
  StoredSuggestion
} from './domain/types';

const jsonHeaders = { 'Content-Type': 'application/json' };

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

// --- Read path: pure functions over the curated seed plus approved community contributions. ---

// Each ingredient is decorated with extra "serving direction" tabs by category.
const decorate = (list: Ingredient[]): Ingredient[] => list.map(withDirections);

// The catalog the read path searches: seed by default, extended once community data loads.
let catalogIngredients: Ingredient[] = decorate(seedIngredients);

/** Fetches approved community contributions and merges them into the searchable catalog. */
export const loadCommunity = async (): Promise<void> => {
  try {
    const { contributions } = await requestJson<{ contributions: PublishedContribution[] }>('/api/community');
    catalogIngredients = decorate(mergeCommunity(seedIngredients, contributions));
  } catch {
    catalogIngredients = decorate(seedIngredients);
  }
};

export const searchIngredients = (query: string): Promise<SearchResult> =>
  Promise.resolve(findIngredient(catalogIngredients, query));

export const getIngredient = (id: string): Promise<Ingredient> => {
  const ingredient = catalogIngredients.find((item) => item.id === id);
  return ingredient ? Promise.resolve(ingredient) : Promise.reject(new Error('not_found'));
};

export const listCatalog = (): Promise<CatalogResponse> => Promise.resolve(buildCatalog(catalogIngredients));

// --- Write path + aggregates: served by Cloudflare Pages Functions (D1) in prod,
//     by the Express dev server locally. Same URLs in both. ---

export const getRatingSummaries = () =>
  requestJson<{ summaries: Record<string, RatingSummary> }>('/api/ratings/summary');

export const submitRating = (rating: RatingInput) =>
  requestJson<{ rating: RatingInput & { id: string } }>('/api/ratings', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(rating)
  });

export const submitSuggestion = (suggestion: RecipeSuggestionInput) =>
  requestJson<{ suggestion: RecipeSuggestionInput & { id: string; status: string } }>('/api/suggestions', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(suggestion)
  });

// --- Admin (gated by x-admin-key) ---

export const adminListSuggestions = (adminKey: string) =>
  requestJson<{ suggestions: StoredSuggestion[] }>('/api/suggestions', {
    headers: { 'x-admin-key': adminKey }
  });

export const adminSetSuggestionStatus = (id: string, status: ReviewStatus, adminKey: string) =>
  requestJson<{ suggestion: StoredSuggestion }>(`/api/suggestions/${id}`, {
    method: 'PATCH',
    headers: { ...jsonHeaders, 'x-admin-key': adminKey },
    body: JSON.stringify({ status })
  });
