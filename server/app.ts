import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedIngredients } from '../src/data/seed';
import { buildCalculatorResult } from '../src/domain/calculator';
import { buildCatalog } from '../src/domain/catalog';
import { toContribution } from '../src/domain/community';
import { isRatingInput, isReviewStatus, isSuggestionInput } from '../src/domain/ratings';
import { findIngredient } from '../src/domain/search';
import type { Request, Response } from 'express';
import { JsonStore } from './store';

interface AppOptions {
  dataDir?: string;
  adminKey?: string;
}

export function createApp(options: AppOptions = {}) {
  const app = express();
  const store = new JsonStore(options.dataDir ?? path.resolve('data'));
  const adminKey = (options.adminKey ?? process.env.SUVID_ADMIN_KEY)?.trim();

  // Returns true when the request is an authorized admin; otherwise writes the error response.
  const requireAdmin = (request: Request, response: Response): boolean => {
    if (!adminKey) {
      response.status(403).json({ error: 'admin_disabled' });
      return false;
    }
    if (request.header('x-admin-key')?.trim() !== adminKey) {
      response.status(401).json({ error: 'unauthorized' });
      return false;
    }
    return true;
  };

  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true });
  });

  app.get('/api/search', (request, response) => {
    const query = String(request.query.q ?? '');
    response.json(findIngredient(seedIngredients, query));
  });

  app.get('/api/catalog', (_request, response) => {
    response.json(buildCatalog());
  });

  app.get('/api/ingredients/:id', (request, response) => {
    const ingredient = seedIngredients.find((item) => item.id === request.params.id);
    if (!ingredient) {
      response.status(404).json({ error: 'not_found' });
      return;
    }

    response.json({
      ...ingredient,
      calculator: buildCalculatorResult(ingredient)
    });
  });

  app.get('/api/ratings', (_request, response) => {
    response.json({ ratings: store.listRatings() });
  });

  app.get('/api/ratings/summary', (_request, response) => {
    response.json({ summaries: store.ratingSummaries() });
  });

  app.post('/api/ratings', (request, response) => {
    if (!isRatingInput(request.body)) {
      response.status(400).json({ error: 'invalid_rating' });
      return;
    }

    response.status(201).json({ rating: store.addRating(request.body) });
  });

  app.post('/api/suggestions', (request, response) => {
    if (!isSuggestionInput(request.body)) {
      response.status(400).json({ error: 'invalid_suggestion' });
      return;
    }

    response.status(201).json({ suggestion: store.addSuggestion(request.body) });
  });

  app.get('/api/community', (_request, response) => {
    response.json({ contributions: store.listPublishedSuggestions().map(toContribution) });
  });

  app.get('/api/suggestions', (request, response) => {
    if (!requireAdmin(request, response)) return;
    response.json({ suggestions: store.listSuggestions() });
  });

  app.patch('/api/suggestions/:id', (request, response) => {
    if (!requireAdmin(request, response)) return;
    const status = (request.body as { status?: unknown }).status;
    if (!isReviewStatus(status)) {
      response.status(400).json({ error: 'invalid_status' });
      return;
    }

    const updated = store.updateSuggestionStatus(request.params.id, status);
    if (!updated) {
      response.status(404).json({ error: 'not_found' });
      return;
    }

    response.json({ suggestion: updated });
  });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distDir));
  app.get(/.*/, (_request, response) => {
    response.sendFile(path.join(distDir, 'index.html'));
  });

  return app;
}
