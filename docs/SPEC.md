# SuVid — Full Specification

This document is the single source of truth for **what SuVid is, how it behaves, and how it is
built**. It is written so that a person or an AI agent can understand the product end‑to‑end and
safely continue working on it. Hebrew change history lives in `handoff-claude-code.md`.

---

## 1. Purpose & goals

SuVid answers one question for a home cook: **"I have this ingredient — what temperature, how long,
and how do I finish it for sous‑vide?"**

Design goals, in priority order:

1. **Trustworthy data.** Times/temperatures must match authoritative sources; safety must never be
   over‑stated.
2. **Fast for the kitchen.** Hebrew, RTL, mobile‑first (designed on a Samsung S25). One ingredient →
   a complete, actionable answer with minimal taps.
3. **Always online, zero home dependency.** Fully serverless; no machine at home needs to be on.
4. **Self‑improving.** Learns from user ratings and grows via moderated community submissions.

## 2. Target user & principles

- **User:** Hebrew‑speaking home cook with a sous‑vide circulator.
- **Voice:** Hebrew only in the UI. Practical, concise, no jargon.
- **Principles:**
  - The curated seed is the source of truth; the read path is deterministic and offline‑capable.
  - Domain logic is pure and shared, so the dev (Express) and prod (Functions) backends can't drift.
  - Conservative on safety: when uncertain, classify *down*, not up.

## 3. Information architecture & user flows

Routes (hash‑based):

- `#` (default) — Home: hero + search + catalog.
- `#admin` — Admin: review/approve/reject community suggestions (gated by an admin key).

Primary flow:

1. **Find** — type a Hebrew name (or tap an example/catalog item).
2. **Disambiguate** — if the term is ambiguous (e.g. "צלעות", "סטייק"), choose the specific cut.
3. **Read the result** — doneness option(s) with temperature, thickness‑adjusted time, a safety
   badge, prep/finish steps, a sear tip, and source links.
4. **Adjust** — set the cut's thickness (cm) and a "from frozen" toggle; time updates live.
5. **Schedule** — enter the desired serving time → "when to start".
6. **Direction tabs** — switch between serving directions (sauces/seasonings).
7. **Rate** — submit stars + feedback; aggregates and insights appear on the option.
8. **Contribute** — submit a new recipe for moderation.

Navigation: opening any result pushes a browser‑history entry, so the device/browser **Back** button
returns to the catalog instead of leaving the site. An explicit "→ חזרה לכל חומרי הגלם" button and a
clickable wordmark also return home.

## 4. Domain model

Defined in `src/domain/types.ts`.

- **`Ingredient`** — `id`, `name`, `category`, `aliases[]`, `availability`, optional `frozenNote` /
  `thickNote`, `options[]`, `recommendations[]`.
- **`SousVideOption`** — `id`, `label`, `temperatureC`, `timeHours`, `texture`, `recommended?`,
  `community?`, `whenToChoose`, `prep[]`, `finish[]`, `confidence`, `sources[]`. Exactly one option
  per ingredient is `recommended`; 1–3 options per ingredient.
- **`PreparationRecommendation`** — `id`, `title`, `summary`, `ingredients[]`, `steps[]` (rendered as
  direction tabs).
- **`ClarificationGroup`** — maps an ambiguous query to a question + candidate ingredient ids.
- **`RatingInput` / `RatingSummary`**, **`RecipeSuggestionInput` / `StoredSuggestion`**,
  **`PublishedContribution`**, **`SearchResult`**, **`CatalogResponse`**.

## 5. Ingredient data & verification methodology

- **Source of truth:** `src/data/seed.ts` — 44 curated ingredients across categories
  `בקר, עוף, דגים, ביצים, ברווז, חזיר, טופו, טלה, ירקות, פירות ים`.
- **Sourcing rule:** every *recommended* option carries **≥2 reliable source links**
  (`https://…`). References used: Douglas Baldwin's *Practical Guide to Sous Vide*, Serious Eats /
  J. Kenji López‑Alt, ChefSteps, Anova, Amazing Food Made Easy.
- **Verification:** all recommended temperatures/times were cross‑checked against those sources.
  Items found at the soft/low edge of their range were nudged to the widely‑recommended value
  (e.g. shrimp 55→57 °C, sea bream/bass 50→52 °C, duck‑breast time 1.5→2 h).
- **Anti‑drift:** `src/data/seed.test.ts` includes `matches verified temperatures/times from
  reliable sources`, pinning ~30 recommended values. Other seed tests enforce ≥2 sources, unique
  ids, exactly one recommended option, and sous‑vide‑sane ranges (45–90 °C, 0–72 h).

## 6. Algorithms

### 6.1 Search & disambiguation (`domain/search.ts`)
Matches the query against names and aliases. Ambiguous queries resolve via `ClarificationGroup`
to a `clarify` result; misses return a `none` result with nearby suggestions.

### 6.2 Catalog ordering (`domain/catalog.ts`)
`PRIMARY_CATEGORIES = ['בקר','עוף','דגים']` are shown first; the community category
(`COMMUNITY_CATEGORY = 'הצעות קהילה'`) is shown last; everything else is alphabetical. The UI reveals
non‑primary categories behind an "עוד…" expander.

### 6.3 Thickness → time (`domain/cooking.ts`)
Baldwin's slab heating model: time to heat a slab's core scales with thickness².
`SLAB_COEFF_MIN_PER_MM2 = 0.14` (minutes per mm²). The curated `timeHours` is treated as correct for
a **reference thickness** (`referenceThicknessCm`: 2 cm for fish/seafood, 2.5 cm otherwise), so:

- At the reference thickness, the shown time **equals the trusted base time** (no surprise change).
- Thicker cuts **add** heating time: `extra = 0.14·(d² − ref²)/60` hours (`d`,`ref` in mm).
- **From frozen** adds `0.14·d²·0.5/60` hours.
- **Long collagen cooks** (`timeHours ≥ 6`, e.g. short ribs) are tenderness‑bound, not
  heating‑bound, so thickness is ignored (only a small capped frozen penalty applies).
- Result is rounded to the nearest 0.25 h, floored at 0.25 h.

### 6.4 Food‑safety classification (`domain/cooking.ts → assessSafety`)
Returns `{ level, label, note }` where level ∈ `pasteurized | cooked | immediate | raw`:

- **Vegetables / tofu** → `cooked` ("no meat‑style risk").
- **Eggs** → `pasteurized` at the seeded temp/time.
- **Poultry** → `pasteurized` at ≥60 °C, else flagged risky.
- **Pork** → `pasteurized` at ≥58 °C, else `immediate`.
- **Beef / lamb / duck** → `pasteurized` if (≥55 °C and ≥4 h, i.e. long cook) or ≥54.5 °C; otherwise
  `immediate` (safe to eat right away with a seared surface, **not** for at‑risk groups or storage).
- **Fish / seafood** → `cooked` at ≥55 °C, `immediate` at ≥50 °C, `raw` below 50 °C (sushi‑grade only).

Deliberately conservative; the UI shows green for `pasteurized`/`cooked` and amber for
`immediate`/`raw` with an explicit warning note.

### 6.5 Sear guidance (`domain/cooking.ts → searGuide`)
Concrete per‑category finishing instructions including sear seconds (e.g. beef "45–60 s per side";
fish "skin side only, 30–60 s"; poultry "1–2 min per side").

### 6.6 "When to start" (`domain/schedule.ts`)
Given a target serving time and the (thickness‑adjusted) cook hours, computes the start time
including warm‑up (25 min) and finishing (15 min), returning a Hebrew summary.

### 6.7 Ratings & insights (`domain/ratings.ts`)
Validates rating/suggestion input, summarizes ratings per option (`averageStars`, `count`), and
derives a human‑readable **insight** from free‑text feedback via themed regexes
(e.g. detecting "more sear" requests).

### 6.8 Preparation directions (`domain/directions.ts`)
`CATEGORY_DIRECTIONS` defines 2 serving directions per category, templated with the ingredient name.
`withDirections(ingredient)` appends them to the ingredient's own signature recommendation, so every
ingredient exposes **≥3 direction tabs**. Applied in `src/api.ts` via `decorate()` on both seed and
community ingredients.

### 6.9 Community pipeline (`domain/community.ts`)
`isPublishable()` (approved + has temp & time) → `toCommunityIngredient()` builds a standalone
ingredient with a single `community: true` option (confidence "ניסיון ראשון"); `mergeCommunity()`
folds approved contributions into the searchable catalog under the community category.

## 7. Frontend

- **`src/App.tsx`** — one component tree: top bar, hero/search, catalog accordions, clarify/none
  panels, the result view (result header with thickness + frozen controls, option tabs, `OptionPanel`
  with safety badge + sear tip, schedule panel, direction tabs, rating form, suggestion form), and a
  separate `AdminPanel` for `#admin`.
- **State:** local React state (selected ingredient, active option/direction, thickness, frozen,
  ratings, route). No global store needed.
- **Read calls:** `searchIngredients`, `getIngredient`, `listCatalog`, `loadCommunity` resolve
  client‑side from the decorated catalog. Writes/aggregates go over `fetch()` to `/api`.
- **Styling:** `src/styles.css` — CSS variables, RTL, mobile‑first; a `≥920px` two‑column detail
  layout and a `≥720px` two‑column catalog grid.

## 8. Backend architecture & API

**Hybrid, drift‑proof:**
- **Read path** (search, catalog, community merge) runs **in the browser** over the bundled seed.
- **Writes & aggregates** are served by **Cloudflare Pages Functions** (prod, over D1) and by an
  **Express** server (dev/test) — both import the same `domain/*` logic.

API (same URLs in both backends):

| Method & path | Auth | Purpose |
|---|---|---|
| `GET /api/community` | – | Approved, publishable contributions. |
| `GET /api/ratings/summary` | – | Aggregated rating summaries per option id. |
| `POST /api/ratings` | – | Submit a rating. |
| `POST /api/suggestions` | – | Submit a recipe suggestion (status `pending_review`). |
| `GET /api/suggestions` | `x-admin-key` | List all suggestions (admin). |
| `PATCH /api/suggestions/:id` | `x-admin-key` | Set status `approved`/`rejected` (admin). |

**Data store:** D1 (serverless SQLite), `db/schema.sql` — tables `ratings` and `suggestions`.
In dev, Express uses a JSON store (`server/store.ts`) under `SUVID_DATA_DIR`.

## 9. Security model

- **Admin gating:** suggestion management requires the `x-admin-key` header to equal the configured
  `SUVID_ADMIN_KEY` (compared with `.trim()` to tolerate stray whitespace/newlines). In prod it's a
  Pages secret; in dev it's read from `.dev.vars`; in e2e it's `e2e-admin-key`.
- **Secrets are never committed.** `.gitignore` excludes `.dev.vars`, `.admin-key.txt`,
  `.cloudflare-token.txt`, `data/*.json`, and `.wrangler/`.
- The D1 `database_id` in `wrangler.toml` is an identifier, not a credential (access still requires
  the Cloudflare API token).

## 10. Testing strategy

- **Unit/API (Vitest):** domain modules (`search`, `cooking`, `directions`, `ratings`, `schedule`,
  `community`, `calculator`), seed quality + verified‑values regression, and the Express API
  (`server/app.test.ts` via supertest). ~56 tests.
- **E2E (Playwright, Galaxy S9+ profile):** ~8 specs covering the full mobile journey — search →
  thickness → schedule → rate → suggest, admin approval → live community option, back‑navigation,
  direction tabs, disambiguation, catalog browse, and compact time‑picker layout.
- **Aggregate:** `npm run verify` runs unit → build → e2e.
- **Test hygiene:** e2e uses an isolated data dir and the e2e admin key; production D1 is never
  polluted; never write to `data/suvid-store.json` from tests.

## 11. Deployment & operations

- **Host:** Cloudflare Pages project `suvid`; custom domain `suvid.dvirai.com`;
  `pages_build_output_dir = dist`; D1 binding `DB`.
- **Deploy:** `npm run build && npx wrangler pages deploy dist --project-name suvid`.
- **Schema:** `npm run d1:schema` (remote) / `:local`.
- **Validate locally first:** `npm run pages:dev` with a local D1.

## 12. Roadmap (proposed, not yet built)

- Cooking timer with browser notifications (done / time‑to‑sear).
- Deep links per cut (`#cut/<id>`), favorites, and recently‑viewed history.
- PWA / offline + a high‑contrast "kitchen mode" (large numbers, screen‑on).
- Smarter default thickness per cut; richer desktop states for clarify/none.
