import type {
  LibraryPersistedState,
  RecentlyViewedBook,
  SavedBookSnapshot,
  ShelfEntry,
  ShelfKey,
} from '@/src/features/shelves/models/local-shelf';

type LibraryEntriesSlice = Pick<LibraryPersistedState, 'entries'>;
type LibraryRecentlyViewedSlice = Pick<LibraryPersistedState, 'recentlyViewed'>;
type LibrarySlice = LibraryEntriesSlice & LibraryRecentlyViewedSlice;

function sortEntries(entries: ShelfEntry[]) {
  return [...entries].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

// These helpers allocate arrays/objects, so derive them after subscribing to raw slices.
export function getShelfEntries(state: LibraryEntriesSlice, shelf: ShelfKey) {
  return sortEntries(Object.values(state.entries).filter((entry) => entry.shelf === shelf));
}

export function getContinueReading(state: LibraryEntriesSlice) {
  return getShelfEntries(state, 'reading').filter((entry) => entry.progress > 0);
}

export function getRecentlyViewed(state: LibraryRecentlyViewedSlice): RecentlyViewedBook[] {
  return [...state.recentlyViewed].sort((left, right) => right.viewedAt.localeCompare(left.viewedAt));
}

export function getShelfCounts(state: LibraryEntriesSlice) {
  const entries = Object.values(state.entries);

  return {
    wantToRead: entries.filter((entry) => entry.shelf === 'wantToRead').length,
    reading: entries.filter((entry) => entry.shelf === 'reading').length,
    finished: entries.filter((entry) => entry.shelf === 'finished').length,
  };
}

export function getKnownBook(state: LibrarySlice, olid: string): SavedBookSnapshot | null {
  const entryBook = state.entries[olid]?.book;

  if (entryBook) {
    return entryBook;
  }

  return state.recentlyViewed.find((entry) => entry.book.olid === olid)?.book ?? null;
}
