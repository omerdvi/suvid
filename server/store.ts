import fs from 'node:fs';
import path from 'node:path';
import { summarizeRatings, type StoredRating } from '../src/domain/ratings';
import { isPublishable } from '../src/domain/community';
import type { RatingInput, RecipeSuggestionInput, ReviewStatus, StoredSuggestion } from '../src/domain/types';

export type { StoredRating, StoredSuggestion };

interface StoreState {
  ratings: StoredRating[];
  suggestions: StoredSuggestion[];
}

const emptyState = (): StoreState => ({ ratings: [], suggestions: [] });

export class JsonStore {
  private state: StoreState;
  private filePath: string | null;

  constructor(dataDir: string) {
    this.filePath = dataDir === ':memory:' ? null : path.join(dataDir, 'suvid-store.json');
    this.state = this.filePath ? this.loadFromDisk(this.filePath) : emptyState();
  }

  addRating(input: RatingInput): StoredRating {
    const rating: StoredRating = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this.state.ratings.push(rating);
    this.save();
    return rating;
  }

  addSuggestion(input: RecipeSuggestionInput): StoredSuggestion {
    const suggestion: StoredSuggestion = {
      ...input,
      id: crypto.randomUUID(),
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };
    this.state.suggestions.push(suggestion);
    this.save();
    return suggestion;
  }

  listRatings() {
    return this.state.ratings;
  }

  ratingSummaries() {
    return summarizeRatings(this.state.ratings);
  }

  listSuggestions(): StoredSuggestion[] {
    return [...this.state.suggestions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  listPublishedSuggestions(): StoredSuggestion[] {
    return this.state.suggestions.filter(isPublishable);
  }

  updateSuggestionStatus(id: string, status: ReviewStatus): StoredSuggestion | null {
    const suggestion = this.state.suggestions.find((item) => item.id === id);
    if (!suggestion) return null;
    suggestion.status = status;
    this.save();
    return suggestion;
  }

  private loadFromDisk(filePath: string): StoreState {
    if (!fs.existsSync(filePath)) return emptyState();
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as StoreState;
  }

  private save() {
    if (!this.filePath) return;
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2));
  }
}
