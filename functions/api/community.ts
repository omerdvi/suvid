import type { PublishedContribution } from '../../src/domain/types';
import { json, type PagesContext } from '../_shared';

const SELECT_PUBLISHED =
  "SELECT id, ingredient_name as ingredientName, temperature_c as temperatureC, time_hours as timeHours, prep, finish, notes, source_url as sourceUrl FROM suggestions WHERE status = 'approved' AND temperature_c IS NOT NULL AND time_hours IS NOT NULL ORDER BY created_at DESC";

export const onRequestGet = async ({ env }: PagesContext): Promise<Response> => {
  const { results } = await env.DB.prepare(SELECT_PUBLISHED).all<PublishedContribution>();
  return json({ contributions: results });
};
