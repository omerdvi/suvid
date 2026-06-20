import { summarizeRatings, type StoredRating } from '../../../src/domain/ratings';
import { json, type PagesContext } from '../../_shared';

export const onRequestGet = async ({ env }: PagesContext): Promise<Response> => {
  const { results } = await env.DB.prepare(
    'SELECT id, target_id as targetId, stars, note, texture_feedback as textureFeedback, next_time as nextTime, created_at as createdAt FROM ratings'
  ).all<StoredRating>();

  return json({ summaries: summarizeRatings(results) });
};
