// One-off / repeatable migration: convert data/suvid-store.json into D1 INSERT statements.
// Usage:  node db/json-to-sql.mjs > db/seed-data.sql
//         wrangler d1 execute suvid --remote --file db/seed-data.sql
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const store = JSON.parse(readFileSync(path.join(root, 'data', 'suvid-store.json'), 'utf8'));

const q = (value) => {
  if (value === null || value === undefined || value === '') return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
};

const lines = [];
for (const r of store.ratings ?? []) {
  lines.push(
    `INSERT OR IGNORE INTO ratings (id, target_id, stars, note, texture_feedback, next_time, created_at) VALUES (${q(r.id)}, ${q(r.targetId)}, ${q(r.stars)}, ${q(r.note ?? '')}, ${q(r.textureFeedback ?? '')}, ${q(r.nextTime ?? '')}, ${q(r.createdAt)});`
  );
}
for (const s of store.suggestions ?? []) {
  lines.push(
    `INSERT OR IGNORE INTO suggestions (id, ingredient_name, temperature_c, time_hours, prep, finish, notes, source_url, status, created_at) VALUES (${q(s.id)}, ${q(s.ingredientName)}, ${q(s.temperatureC)}, ${q(s.timeHours)}, ${q(s.prep)}, ${q(s.finish)}, ${q(s.notes)}, ${q(s.sourceUrl)}, ${q(s.status ?? 'pending_review')}, ${q(s.createdAt)});`
  );
}

process.stdout.write(
  lines.length ? lines.join('\n') + '\n' : '-- no ratings or suggestions to migrate\n'
);
