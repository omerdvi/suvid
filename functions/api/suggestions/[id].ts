import { isReviewStatus } from '../../../src/domain/ratings';
import type { StoredSuggestion } from '../../../src/domain/types';
import { adminGuard, json, type PagesContext } from '../../_shared';

const SELECT_ONE =
  'SELECT id, ingredient_name as ingredientName, temperature_c as temperatureC, time_hours as timeHours, prep, finish, notes, source_url as sourceUrl, status, created_at as createdAt FROM suggestions WHERE id = ?';

export const onRequestPatch = async ({ request, env, params }: PagesContext): Promise<Response> => {
  const denied = adminGuard(request, env);
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as { status?: unknown };
  if (!isReviewStatus(body.status)) return json({ error: 'invalid_status' }, 400);

  const { meta } = (await env.DB.prepare('UPDATE suggestions SET status = ? WHERE id = ?')
    .bind(body.status, params.id)
    .run()) as { meta?: { changes?: number } };

  if (!meta?.changes) return json({ error: 'not_found' }, 404);

  const suggestion = await env.DB.prepare(SELECT_ONE).bind(params.id).first<StoredSuggestion>();
  return json({ suggestion });
};
