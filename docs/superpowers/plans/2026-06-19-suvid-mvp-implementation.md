# SuVid MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working Hebrew mobile-first sous-vide PWA with clean focused search, calculator results, recommendations, ratings, and recipe suggestions.

**Architecture:** Use a small Node/Express API backed by local JSON files for the first MVP. Use Vite/React for the Hebrew RTL frontend. Keep calculator/search logic in shared pure modules with tests.

**Tech Stack:** Node.js, Express, Vite, React, TypeScript, Vitest, Playwright, local JSON persistence.

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`

- [ ] Create npm scripts for dev, API, build, tests, and preview.
- [ ] Install dependencies.
- [ ] Verify toolchain with `npm run test`.

### Task 2: Domain Logic

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/search.ts`
- Create: `src/domain/calculator.ts`
- Create: `src/domain/schedule.ts`
- Create: `src/domain/*.test.ts`
- Create: `src/data/seed.ts`

- [ ] Write failing tests for Hebrew search, ambiguity handling, up to three options, frozen/thick notes, and ready-at calculation.
- [ ] Implement minimal pure logic to pass tests.
- [ ] Seed representative foods: אסאדו, חזה עוף, סלמון, ביצים, טופו, שרימפס, סטייק אנטריקוט, בריסקט, צלעות חזיר, ירקות שורש.

### Task 3: API And Persistence

**Files:**
- Create: `server/app.ts`
- Create: `server/index.ts`
- Create: `server/store.ts`
- Create: `server/app.test.ts`
- Create: `data/.gitkeep`

- [ ] Write failing API tests for search, ingredient detail, rating submission, and recipe suggestion submission.
- [ ] Implement JSON-backed persistence for ratings and suggestions.
- [ ] Implement API routes.

### Task 4: Frontend PWA

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/api.ts`
- Create: `src/styles.css`
- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`

- [ ] Build a mobile-first RTL UI with clean focused search as the first screen.
- [ ] Show calculator result, up to three options, confidence, preparation, finishing, sources, rating form, recipe suggestion form, and ready-at calculator.
- [ ] Register service worker and manifest for installable PWA behavior.

### Task 5: Verification

**Files:**
- Create: `tests/e2e/suvid.spec.ts`

- [ ] Write and run Playwright smoke test for mobile viewport.
- [ ] Run unit/API tests.
- [ ] Run production build.
- [ ] Start local server and verify the app in a browser.
