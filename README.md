# SuVid · מחשבון סו־ויד בעברית 🍳

> A Hebrew, right‑to‑left, mobile‑first sous‑vide assistant. Pick an ingredient and get a
> source‑verified temperature, time, prep, finishing and "when to start" plan — tuned to the
> real thickness of your cut and with a clear food‑safety indicator.

**Live:** https://suvid.dvirai.com

<div dir="rtl">

## בקצרה (עברית)

SuVid עונה על שאלה אחת: *"יש לי נתח X — באיזו טמפרטורה, כמה זמן, ואיך לסיים?"*
בוחרים חומר גלם (מתוך 44 במאגר) או מחפשים בעברית, ומקבלים:

- **טמפרטורה וזמן מומלצים** — מאומתים מול מקורות אמינים (Baldwin, Serious Eats, ChefSteps, Anova).
- **חישוב זמן לפי עובי הנתח** ומצב קפוא (מודל החימום של Baldwin).
- **מחוון בטיחות/פסטור** לכל אופציה (ירוק = מפוסטר, כתום = לאכילה מיידית בלבד).
- **כיווני הכנה** בטאבים (רטבים/תיבולים שונים) + **טיפ צריבה** קונקרטי.
- **"מתי להתחיל"** — מחשב שעת התחלה לפי שעת ההגשה הרצויה.
- **דירוגים** שמלמדים את המאגר, ו**הצעות מתכון מהקהילה** עם אישור מנהל.

</div>

## Features

| Area | What it does |
|------|--------------|
| **Search & catalog** | Hebrew search with alias matching, disambiguation (e.g. "צלעות" → asado / lamb / pork), and a browsable catalog of 44 ingredients ordered beef → poultry → fish → more. |
| **Calculator** | Recommended temperature/time per ingredient, with 1–3 doneness options per cut. |
| **Thickness‑aware timing** | Cook time scales with the square of the cut's thickness (Baldwin slab model); a frozen toggle adds a heating penalty. The trusted base time never changes at the typical thickness. |
| **Food‑safety indicator** | Each option is classified `pasteurized` / `cooked` / `immediate` / `raw` with a plain‑language note. Conservative by design. |
| **Preparation directions** | Tabbed serving directions per cut (signature + category variations) with ingredients and steps, plus concrete sear guidance. |
| **"When to start"** | Given a target serving time, computes when to drop the bag (includes warm‑up and finishing). |
| **Ratings & learning** | Users rate results; the app derives insights (e.g. "most users wanted more sear") shown on the option. |
| **Community recipes** | Visitors submit recipes; an admin approves them; approved suggestions with temp+time become live "community" calculator options. |
| **UX** | Sticky top bar, browser‑back support (back returns to the catalog, never leaves the site), mobile‑first layout, and a two‑column desktop layout. |

## Tech stack

- **Frontend:** React 19 + TypeScript + Vite. Hebrew RTL, mobile‑first (built for a Samsung S25).
- **Backend (prod):** Cloudflare Pages (static hosting) + Pages Functions (serverless) + D1 (serverless SQLite).
- **Backend (dev/test):** Express server sharing the same domain logic, so behaviour can't drift.
- **Read path is client‑side:** search and catalog are computed from a bundled, curated seed; only
  writes (ratings, suggestions) and aggregates (summaries, community) hit `/api`.
- **Tests:** Vitest (unit/API) + Playwright (mobile e2e, Galaxy S9+ device profile).

## Quick start

```bash
npm install

# Run the app + dev API together (http://localhost:5173, API on :3001)
npm run dev

# Unit + API tests
npm run test

# End‑to‑end tests (Playwright spins up the app automatically)
npm run test:e2e

# Everything: unit → build → e2e
npm run verify
```

### Run the serverless stack locally (Cloudflare)

```bash
npm run d1:schema:local      # create local D1 tables
npm run pages:dev            # wrangler pages dev (Functions + local D1)
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server + Express API (concurrently). |
| `npm run build` | Type‑check‑clean production build to `dist/`. |
| `npm run test` | Vitest unit/API suite. |
| `npm run test:e2e` | Playwright end‑to‑end suite. |
| `npm run verify` | `test` → `build` → `test:e2e`. |
| `npm run pages:dev` | `wrangler pages dev` (serverless functions + local D1). |
| `npm run pages:deploy` | Build and deploy to Cloudflare Pages. |
| `npm run d1:schema` / `:local` | Apply `db/schema.sql` to remote/local D1. |

## Project structure

```
src/
  App.tsx               # Single-page UI: search, catalog, calculator, ratings, admin
  api.ts                # Client API: client-side read path + fetch() writes/aggregates
  styles.css            # All styling (RTL, mobile-first, desktop two-column)
  data/
    seed.ts             # Curated ingredient catalog (44 ingredients) — the source of truth
  domain/               # Pure, tested business logic (shared by client + Express + Functions)
    search.ts           # Hebrew search + disambiguation
    catalog.ts          # Catalog grouping/ordering
    cooking.ts          # Thickness→time model, food-safety classification, sear guidance
    directions.ts       # Category-based preparation direction tabs
    schedule.ts         # "When to start" time math
    ratings.ts          # Rating validation + summaries + learning insights
    community.ts        # Approved-suggestion → live community option
    types.ts            # Shared types
server/                 # Express dev/test backend (mirrors the Functions API)
functions/api/          # Cloudflare Pages Functions (prod API over D1)
db/schema.sql           # D1 schema (ratings, suggestions)
tests/e2e/              # Playwright specs
docs/                   # SPEC.md (full spec) + handoff notes
```

## Data reliability

Every recommended temperature/time was cross‑checked against authoritative references
(Douglas Baldwin's guide, Serious Eats / Kenji, ChefSteps, Anova, Amazing Food Made Easy).
A regression test (`src/data/seed.test.ts`) pins ~30 verified values so they can't silently drift,
and every recommended option carries at least two source links. See
[`docs/SPEC.md`](docs/SPEC.md) for the methodology.

## Deployment

Hosted on Cloudflare Pages (project `suvid`, custom domain `suvid.dvirai.com`).

```bash
npm run build
npx wrangler pages deploy dist --project-name suvid
```

The admin key (for the suggestion‑review screen at `/#admin`) is stored as the Pages secret
`SUVID_ADMIN_KEY`. Secrets and tokens are never committed (see `.gitignore`).

## For AI agents / contributors

Working‑agreement, commands, conventions and safety rules live in
[`AGENTS.md`](AGENTS.md). The full functional & technical specification is in
[`docs/SPEC.md`](docs/SPEC.md). Hebrew change history is in
[`docs/handoff-claude-code.md`](docs/handoff-claude-code.md).

## License

Personal project. No open‑source license has been granted yet — please open an issue before reuse.
