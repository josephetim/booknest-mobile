import type { SavedBookSnapshot } from '@/src/features/shelves/models/local-shelf';
import {
  createEmptyLibraryState,
  saveBookToShelf,
  updateBookNotes,
  updateBookProgress,
} from '@/src/features/shelves/utils/library-state';

const baseBook: SavedBookSnapshot = {
  olid: 'OL123W',
  title: 'Test Book',
  authors: ['Ada Lovelace'],
  authorIds: ['OL1A'],
  languages: ['eng'],
  source: 'open-library',
};

describe('library-state', () => {
  it('keeps a single entry and preserves progress and notes on duplicate saves', () => {
    const initialState = createEmptyLibraryState();
    const firstSave = saveBookToShelf(initialState, baseBook, 'reading');
    const withProgress = updateBookProgress(firstSave, baseBook.olid, 48);
    const withNotes = updateBookNotes(withProgress, baseBook.olid, 'Chapter 6 is the pivot.');
    const duplicateSave = saveBookToShelf(withNotes, baseBook, 'reading');

    expect(Object.keys(duplicateSave.entries)).toHaveLength(1);
    expect(duplicateSave.entries[baseBook.olid].progress).toBe(48);
    expect(duplicateSave.entries[baseBook.olid].notes).toBe('Chapter 6 is the pivot.');
  });

  it('clamps progress between 0 and 100', () => {
    const initialState = saveBookToShelf(createEmptyLibraryState(), baseBook, 'reading');
    const overMax = updateBookProgress(initialState, baseBook.olid, 140);
    const underMin = updateBookProgress(initialState, baseBook.olid, -12);

    expect(overMax.entries[baseBook.olid].progress).toBe(100);
    expect(underMin.entries[baseBook.olid].progress).toBe(0);
  });
});
