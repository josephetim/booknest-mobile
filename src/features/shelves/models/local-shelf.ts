export type ShelfKey = 'wantToRead' | 'reading' | 'finished';

export const SHELF_KEYS: ShelfKey[] = ['wantToRead', 'reading', 'finished'];

export const SHELF_LABELS: Record<ShelfKey, string> = {
  wantToRead: 'Want to Read',
  reading: 'Reading',
  finished: 'Finished',
};

export type SavedBookSnapshot = {
  olid: string;
  title: string;
  subtitle?: string;
  authors: string[];
  authorIds: string[];
  firstPublishYear?: number;
  editionCount?: number;
  languages: string[];
  coverId?: number;
  coverEditionKey?: string;
  description?: string;
  subjects?: string[];
  source: 'open-library' | 'demo';
};

export type ShelfEntry = {
  book: SavedBookSnapshot;
  shelf: ShelfKey;
  progress: number;
  notes: string;
  addedAt: string;
  updatedAt: string;
};

export type RecentlyViewedBook = {
  book: SavedBookSnapshot;
  viewedAt: string;
};

export type LibraryPersistedState = {
  entries: Record<string, ShelfEntry>;
  recentlyViewed: RecentlyViewedBook[];
  hasDemoSeeded: boolean;
};
