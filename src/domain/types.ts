export type Confidence = 'גבוהה' | 'בינונית' | 'ניסיון ראשון';

export type Thickness = 'normal' | 'thick' | 'thin';

export interface SourceLink {
  title: string;
  url: string;
}

export interface SousVideOption {
  id: string;
  label: string;
  temperatureC: number;
  timeHours: number;
  texture: string;
  recommended?: boolean;
  /** True for options published from approved community suggestions (not from the curated seed). */
  community?: boolean;
  whenToChoose: string;
  prep: string[];
  finish: string[];
  confidence: Confidence;
  sources: SourceLink[];
}

export interface PublishedContribution {
  id: string;
  ingredientName: string;
  temperatureC: number;
  timeHours: number;
  prep: string;
  finish: string;
  notes: string;
  sourceUrl?: string;
}

export interface PreparationRecommendation {
  id: string;
  title: string;
  summary: string;
  ingredients: string[];
  steps: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  aliases: string[];
  availability: string;
  frozenNote?: string;
  thickNote?: string;
  options: SousVideOption[];
  recommendations: PreparationRecommendation[];
}

export interface ClarificationGroup {
  query: string;
  question: string;
  ingredientIds: string[];
}

export type SearchResult =
  | { kind: 'match'; ingredient: Ingredient }
  | { kind: 'clarify'; question: string; choices: Ingredient[] }
  | { kind: 'none'; suggestions: Ingredient[] };

export interface CalculatorResult {
  ingredient: Ingredient;
  options: SousVideOption[];
  adjustments: string[];
}

export interface RatingInput {
  targetId: string;
  stars: number;
  note: string;
  textureFeedback: string;
  nextTime: string;
}

export interface RecipeSuggestionInput {
  ingredientName: string;
  temperatureC?: number;
  timeHours?: number;
  prep: string;
  finish: string;
  notes: string;
  sourceUrl?: string;
}

export type ReviewStatus = 'pending_review' | 'approved' | 'rejected';

export interface StoredSuggestion extends RecipeSuggestionInput {
  id: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
}

export interface CatalogCategory {
  name: string;
  ingredients: CatalogItem[];
}

export interface CatalogResponse {
  totalIngredients: number;
  categories: CatalogCategory[];
}

export interface RatingSummary {
  targetId: string;
  count: number;
  averageStars: number;
  commonNextTime: string[];
  /** Human-readable learning insight derived from the ratings, e.g. "רוב המשתמשים ביקשו יותר צריבה". */
  insight?: string;
}
