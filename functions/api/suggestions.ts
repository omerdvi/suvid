import { isSuggestionInput } from '../../src/domain/ratings';
import type { RecipeSuggestionInput, StoredSuggestion } from '../../src/domain/types';
import { adminGuard, json, type PagesContext } from '../_shared';

const SELECT_SUGGESTIONS =
  'SELECT id, ingredient_name as ingredientName, temperature_c as temperatureC, time_hours as timeHours, prep, finish, notes, source_url as sourceUrl, status, created_at as createdAt FROM suggestions ORDER BY created_at DESC';

export const onRequestGet = async ({ request, env }: PagesContext): Promise<Response> => {
  const denied = adminGuard(request, env);
  if (denied) return denied;

  const { results } = await env.DB.prepare(SELECT_SUGGESTIONS).all<StoredSuggestion>();
  return json({ suggestions: results });
};

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  const body = (await request.json().catch(() => ({}))) as Partial<RecipeSuggestionInput>;
  if (!isSuggestionInput(body)) return json({ error: 'invalid_suggestion' }, 400);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const status = 'pending_review';
  await env.DB.prepare(
    'INSERT INTO suggestions (id, ingredient_name, temperature_c, time_hours, prep, finish, notes, source_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(
      id,
      body.ingredientName,
      body.temperatureC ?? null,
      body.timeHours ?? null,
      body.prep,
      body.finish,
      body.notes,
      body.sourceUrl ?? null,
      status,
      createdAt
    )
    .run();

  return json({ suggestion: { id, status, createdAt, ...body } }, 201);
};
