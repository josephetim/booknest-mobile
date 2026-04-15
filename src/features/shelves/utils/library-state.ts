import { createDemoLibraryState } from '@/src/features/shelves/data/demo-books';
import type {
  LibraryPersistedState,
  RecentlyViewedBook,
  SavedBookSnapshot,
  ShelfEntry,
  ShelfKey,
} from '@/src/features/shelves/models/local-shelf';

export function createEmptyLibraryState(): LibraryPersistedState {
  return {
    entries: {},
    recentlyViewed: [],
    hasDemoSeeded: false,
  };
}

export function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getDefaultProgress(shelf: ShelfKey) {
  if (shelf === 'finished') {
    return 100;
  }

  if (shelf === 'reading') {
    return 12;
  }

  return 0;
}

function buildShelfEntry(
  existingEntry: ShelfEntry | undefined,
  book: SavedBookSnapshot,
  shelf: ShelfKey,
  now: string,
): ShelfEntry {
  const existingProgress = existingEntry?.progress ?? getDefaultProgress(shelf);
  const progress = shelf === 'finished' ? 100 : existingProgress;

  return {
    book,
    shelf,
    progress: clampProgress(progress),
    notes: existingEntry?.notes ?? '',
    addedAt: existingEntry?.addedAt ?? now,
    updatedAt: now,
  };
}

export function saveBookToShelf(
  state: LibraryPersistedState,
  book: SavedBookSnapshot,
  shelf: ShelfKey,
): LibraryPersistedState {
  const now = new Date().toISOString();

  return {
    ...state,
    hasDemoSeeded: state.hasDemoSeeded || book.source === 'demo',
    entries: {
      ...state.entries,
      [book.olid]: buildShelfEntry(state.entries[book.olid], book, shelf, now),
    },
  };
}

export function updateBookProgress(
  state: LibraryPersistedState,
  olid: string,
  progress: number,
): LibraryPersistedState {
  const entry = state.entries[olid];

  if (!entry) {
    return state;
  }

  return {
    ...state,
    entries: {
      ...state.entries,
      [olid]: {
        ...entry,
        progress: clampProgress(progress),
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

export function updateBookNotes(
  state: LibraryPersistedState,
  olid: string,
  notes: string,
): LibraryPersistedState {
  const entry = state.entries[olid];

  if (!entry) {
    return state;
  }

  return {
    ...state,
    entries: {
      ...state.entries,
      [olid]: {
        ...entry,
        notes,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

export function removeBookFromLibrary(
  state: LibraryPersistedState,
  olid: string,
): LibraryPersistedState {
  if (!state.entries[olid]) {
    return state;
  }

  const nextEntries = { ...state.entries };
  delete nextEntries[olid];

  return {
    ...state,
    entries: nextEntries,
  };
}

export function markBookViewed(
  state: LibraryPersistedState,
  book: SavedBookSnapshot,
): LibraryPersistedState {
  const now = new Date().toISOString();
  const nextViewed: RecentlyViewedBook[] = [
    {
      book,
      viewedAt: now,
    },
    ...state.recentlyViewed.filter((entry) => entry.book.olid !== book.olid),
  ].slice(0, 12);

  return {
    ...state,
    recentlyViewed: nextViewed,
  };
}

export function clearLibraryEntries(state: LibraryPersistedState): LibraryPersistedState {
  return {
    ...state,
    entries: {},
    hasDemoSeeded: true,
  };
}

export function clearRecentlyViewed(state: LibraryPersistedState): LibraryPersistedState {
  return {
    ...state,
    recentlyViewed: [],
  };
}

export function resetLibraryToDemo(): LibraryPersistedState {
  return createDemoLibraryState();
}
