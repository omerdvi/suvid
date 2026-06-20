// Minimal Cloudflare D1 / Pages Functions types + helpers.
// Kept local so we don't need to pull in @cloudflare/workers-types for three tiny handlers.

export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = unknown>(): Promise<T | null>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface Env {
  DB: D1Database;
  SUVID_ADMIN_KEY?: string;
}

export interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
}

export const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });

/** Returns an error Response when the request is not an authorized admin, otherwise null. */
export const adminGuard = (request: Request, env: Env): Response | null => {
  const configured = env.SUVID_ADMIN_KEY?.trim();
  if (!configured) return json({ error: 'admin_disabled' }, 403);
  if (request.headers.get('x-admin-key')?.trim() !== configured) return json({ error: 'unauthorized' }, 401);
  return null;
};
