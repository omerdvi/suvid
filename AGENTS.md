# AGENTS.md — working agreement for AI agents

Guidance for any AI tool (Claude Code, Cursor, etc.) continuing work on **SuVid**.
Read this first, then [`docs/SPEC.md`](docs/SPEC.md) for the full specification.

## Golden rules

1. **Hebrew is the product language.** All user‑facing UI text is Hebrew (RTL). Keep it that way.
2. **Never over‑state food safety.** Times/temps and the safety classifier are correctness‑critical.
   Any change to `src/data/seed.ts` recommended values must be backed by a reliable source and must
   keep `seed.test.ts` (the verified‑values regression) green.
3. **Keep domain logic pure and shared.** Business rules live in `src/domain/*` and are imported by
   the browser, the Express dev server (`server/`), and the Cloudflare Functions (`functions/`).
   Don't fork logic between backends — change the shared module.
4. **Never commit secrets.** `.dev.vars`, `.admin-key.txt`, `.cloudflare-token.txt`, `data/*.json`
   and `.wrangler/` are gitignored. Keep it so. Don't paste tokens/keys into tracked files or docs.
5. **Always run `npm run verify` before declaring done.** It runs unit → build → e2e.

## Commands

```bash
npm install
npm run dev          # Vite + Express API (local development)
npm run test         # Vitest unit/API
npm run test:e2e     # Playwright e2e (auto-starts the app)
npm run verify       # test → build → test:e2e   ← run before finishing
npm run build        # production build to dist/
npm run pages:dev    # serverless stack locally (Functions + local D1)
```

Deploy (Cloudflare Pages project `suvid`, live at `suvid.dvirai.com`):

```bash
npm run build
npx wrangler pages deploy dist --project-name suvid
# CLOUDFLARE_API_TOKEN must be set; on the owner's machine it lives in the
# gitignored .cloudflare-token.txt (do NOT commit or print it).
```

## Where things live

| Need to change… | Edit |
|---|---|
| Ingredient data (temps/times/sources) | `src/data/seed.ts` (+ update `seed.test.ts`) |
| Search / disambiguation | `src/domain/search.ts` |
| Catalog grouping/order | `src/domain/catalog.ts` |
| Thickness model / safety / sear text | `src/domain/cooking.ts` |
| Preparation direction tabs | `src/domain/directions.ts` |
| "When to start" math | `src/domain/schedule.ts` |
| Ratings / insights | `src/domain/ratings.ts` |
| Community pipeline | `src/domain/community.ts` |
| UI / layout | `src/App.tsx`, `src/styles.css` |
| Prod API | `functions/api/*` (+ mirror in `server/app.ts`) |
| Dev/test API | `server/app.ts`, `server/store.ts` |
| DB schema | `db/schema.sql` |
| E2E specs | `tests/e2e/suvid.spec.ts` |

## Conventions

- **Match surrounding style.** TypeScript, 2‑space indent, no semicolon gymnastics — follow the file.
- **Read path stays client‑side.** Search/catalog/community merge run in the browser over the seed;
  only writes and aggregates use `/api`. Don't move reads to the server.
- **Every recommended option needs ≥2 `https` sources** and exactly one `recommended: true`.
- **Tests are the contract.** Add/update tests with behaviour changes; pin new verified data values.
- **Admin key comparison uses `.trim()`** on both sides — keep that when touching auth.

## Definition of done

- `npm run verify` is green (56+ unit, 8+ e2e at time of writing).
- New/changed behaviour is covered by a test.
- No secrets added to tracked files.
- If data changed: the source URLs were checked and `seed.test.ts` reflects the new values.
- Deployed (if requested) and the Hebrew change log `docs/handoff-claude-code.md` updated.

## Do NOT touch (owner's other infrastructure)

This repo is one of several on the owner's setup. Do not modify or reference unrelated tunnels or
domains (e.g. `365.dvirai.com`, `ronfilter.dvirai.com`, the `mundial-predictor` tunnel). Stay within
this repository.
