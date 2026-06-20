import type { Ingredient, PublishedContribution, SousVideOption, StoredSuggestion } from './types';

export const COMMUNITY_CATEGORY = 'הצעות קהילה';

/** A suggestion is publishable to the calculator once approved and given a temperature + time. */
export const isPublishable = (
  suggestion: Pick<StoredSuggestion, 'status' | 'temperatureC' | 'timeHours'>
): boolean =>
  suggestion.status === 'approved' &&
  typeof suggestion.temperatureC === 'number' &&
  typeof suggestion.timeHours === 'number';

export const toContribution = (suggestion: StoredSuggestion): PublishedContribution => ({
  id: suggestion.id,
  ingredientName: suggestion.ingredientName,
  temperatureC: suggestion.temperatureC as number,
  timeHours: suggestion.timeHours as number,
  prep: suggestion.prep,
  finish: suggestion.finish,
  notes: suggestion.notes,
  sourceUrl: suggestion.sourceUrl
});

const toSteps = (value: string): string[] => {
  const parts = value
    .split(/[\n;,]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [value.trim()].filter(Boolean);
};

/** Turns an approved community contribution into a standalone calculator ingredient. */
export function toCommunityIngredient(contribution: PublishedContribution): Ingredient {
  const option: SousVideOption = {
    id: `community-${contribution.id}`,
    label: 'הצעת קהילה',
    temperatureC: contribution.temperatureC,
    timeHours: contribution.timeHours,
    texture: contribution.notes || 'הצעה מהקהילה',
    recommended: true,
    community: true,
    whenToChoose: contribution.notes || 'הצעה שאושרה על ידי הקהילה.',
    prep: toSteps(contribution.prep),
    finish: toSteps(contribution.finish),
    confidence: 'ניסיון ראשון',
    sources: contribution.sourceUrl ? [{ title: 'מקור קהילה', url: contribution.sourceUrl }] : []
  };

  return {
    id: `community-${contribution.id}`,
    name: contribution.ingredientName,
    category: COMMUNITY_CATEGORY,
    aliases: [contribution.ingredientName],
    availability: 'הצעה שאושרה ונוספה על ידי הקהילה.',
    options: [option],
    recommendations: []
  };
}

/** Appends approved community contributions to the curated catalog as their own ingredients. */
export function mergeCommunity(
  ingredients: Ingredient[],
  contributions: PublishedContribution[]
): Ingredient[] {
  return [...ingredients, ...contributions.map(toCommunityIngredient)];
}
