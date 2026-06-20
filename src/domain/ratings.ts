import { seedIngredients } from '../data/seed';
import type { RatingInput, RatingSummary, RecipeSuggestionInput, ReviewStatus } from './types';

export const reviewStatuses: ReviewStatus[] = ['pending_review', 'approved', 'rejected'];

export const isReviewStatus = (value: unknown): value is ReviewStatus =>
  typeof value === 'string' && (reviewStatuses as string[]).includes(value);

export interface StoredRating extends RatingInput {
  id: string;
  createdAt: string;
}

/** Every valid calculator-option id, used to reject ratings for unknown targets. */
export const validOptionIds = new Set(
  seedIngredients.flatMap((ingredient) => ingredient.options.map((option) => option.id))
);

export const isRatingInput = (value: Partial<RatingInput>): value is RatingInput =>
  typeof value.targetId === 'string' &&
  validOptionIds.has(value.targetId) &&
  typeof value.stars === 'number' &&
  value.stars >= 1 &&
  value.stars <= 5 &&
  typeof value.note === 'string' &&
  typeof value.textureFeedback === 'string' &&
  typeof value.nextTime === 'string';

/** Non-empty trimmed string within a length cap. */
const isBoundedText = (value: unknown, maxLength: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;

export const isSuggestionInput = (value: Partial<RecipeSuggestionInput>): value is RecipeSuggestionInput =>
  isBoundedText(value.ingredientName, 80) &&
  isBoundedText(value.prep, 1000) &&
  isBoundedText(value.finish, 1000) &&
  isBoundedText(value.notes, 1000) &&
  // Optional temp/time: absent, or a finite value inside the plausible sous-vide range.
  (value.temperatureC === undefined ||
    (Number.isFinite(value.temperatureC) && value.temperatureC >= 45 && value.temperatureC <= 90)) &&
  (value.timeHours === undefined ||
    (Number.isFinite(value.timeHours) && value.timeHours > 0 && value.timeHours <= 72)) &&
  // Optional source: must be an https URL so it's safe to render as a link.
  (value.sourceUrl === undefined ||
    (typeof value.sourceUrl === 'string' && value.sourceUrl.startsWith('https://') && value.sourceUrl.length <= 500));

/** Theme buckets used to turn free-text feedback into a shared learning insight. */
const insightThemes: { key: string; match: RegExp }[] = [
  { key: 'יותר צריבה', match: /צר[יוו]?ב|לצרוב|השח|קראסט|crust|פריך|חום|שזוף/ },
  { key: 'פחות מלח', match: /פחות מלח|מלוח|יותר מדי מלח/ },
  { key: 'יותר מלח', match: /יותר מלח|תפל|חסר מלח|פחות מדי מלח/ },
  { key: 'פחות זמן', match: /פחות זמן|רך מדי|נופל|התפרק|מתפרק מדי|רירי/ },
  { key: 'יותר זמן', match: /יותר זמן|זמן ארוך|לא מספיק רך|קשה|נוקשה/ }
];

/** Derives one shared learning insight from a target's ratings, or undefined when there is no signal. */
export function deriveInsight(ratings: StoredRating[]): string | undefined {
  if (ratings.length < 2) return undefined;

  const counts = new Map<string, number>();
  for (const rating of ratings) {
    const text = `${rating.note} ${rating.textureFeedback} ${rating.nextTime}`;
    for (const theme of insightThemes) {
      if (theme.match.test(text)) counts.set(theme.key, (counts.get(theme.key) ?? 0) + 1);
    }
  }

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] >= 2) {
    const ratio = top[1] / ratings.length;
    const lead = ratio >= 0.5 ? 'רוב המשתמשים ביקשו' : 'כמה משתמשים ביקשו';
    return `${lead} ${top[0]}`;
  }

  const averageStars = ratings.reduce((sum, rating) => sum + rating.stars, 0) / ratings.length;
  if (averageStars < 3) return 'דירוג נמוך עד כה — שווה לבדוק את הזמן והטמפרטורה';

  return undefined;
}

/** Aggregates raw ratings into per-target summaries. Pure: shared by Express and Pages Functions. */
export function summarizeRatings(ratings: StoredRating[]): Record<string, RatingSummary> {
  const grouped = new Map<string, StoredRating[]>();
  for (const rating of ratings) {
    grouped.set(rating.targetId, [...(grouped.get(rating.targetId) ?? []), rating]);
  }

  const summaries: Record<string, RatingSummary> = {};
  for (const [targetId, group] of grouped) {
    const averageStars =
      Math.round((group.reduce((sum, rating) => sum + rating.stars, 0) / group.length) * 10) / 10;
    const commonNextTime = [...new Set(group.map((rating) => rating.nextTime).filter(Boolean))].slice(0, 3);
    summaries[targetId] = {
      targetId,
      count: group.length,
      averageStars,
      commonNextTime,
      insight: deriveInsight(group)
    };
  }

  return summaries;
}
