import { isRatingInput } from '../../src/domain/ratings';
import type { RatingInput } from '../../src/domain/types';
import { json, type PagesContext } from '../_shared';

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  const body = (await request.json().catch(() => ({}))) as Partial<RatingInput>;
  if (!isRatingInput(body)) return json({ error: 'invalid_rating' }, 400);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    'INSERT INTO ratings (id, target_id, stars, note, texture_feedback, next_time, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, body.targetId, body.stars, body.note, body.textureFeedback, body.nextTime, createdAt)
    .run();

  return json({ rating: { id, createdAt, ...body } }, 201);
};
