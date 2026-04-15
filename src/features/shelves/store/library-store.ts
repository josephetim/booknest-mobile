import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  LibraryPersistedState,
  SavedBookSnapshot,
  ShelfKey,
} from '@/src/features/shelves/models/local-shelf';
import {
  clearLibraryEntries,
  clearRecentlyViewed,
  createEmptyLibraryState,
  markBookViewed,
  removeBookFromLibrary,
  resetLibraryToDemo,
  saveBookToShelf,
  updateBookNotes,
  updateBookProgress,
} from '@/src/features/shelves/utils/library-state';

type LibraryStore = LibraryPersistedState & {
  hasHydrated: boolean;
  setHydrated: (value: boolean) => void;
  ensureDemoSeeded: () => void;
  saveBook: (book: SavedBookSnapshot, shelf: ShelfKey) => void;
  removeBook: (olid: string) => void;
  updateProgress: (olid: string, progress: number) => void;
  updateNotes: (olid: string, notes: string) => void;
  markViewed: (book: SavedBookSnapshot) => void;
  clearLibrary: () => void;
  resetDemo: () => void;
  clearViewed: () => void;
};

function selectPersistedState(state: LibraryStore): LibraryPersistedState {
  return {
    entries: state.entries,
    recentlyViewed: state.recentlyViewed,
    hasDemoSeeded: state.hasDemoSeeded,
  };
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      ...createEmptyLibraryState(),
      hasHydrated: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      ensureDemoSeeded: () => {
        const currentState = get();

        if (Object.keys(currentState.entries).length > 0 || currentState.hasDemoSeeded) {
          return;
        }

        set(resetLibraryToDemo());
      },
      saveBook: (book, shelf) =>
        set((state) => saveBookToShelf(selectPersistedState(state), book, shelf)),
      removeBook: (olid) =>
        set((state) => removeBookFromLibrary(selectPersistedState(state), olid)),
      updateProgress: (olid, progress) =>
        set((state) => updateBookProgress(selectPersistedState(state), olid, progress)),
      updateNotes: (olid, notes) =>
        set((state) => updateBookNotes(selectPersistedState(state), olid, notes)),
      markViewed: (book) => set((state) => markBookViewed(selectPersistedState(state), book)),
      clearLibrary: () => set((state) => clearLibraryEntries(selectPersistedState(state))),
      resetDemo: () => set(resetLibraryToDemo()),
      clearViewed: () => set((state) => clearRecentlyViewed(selectPersistedState(state))),
    }),
    {
      name: 'booknest-library',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: selectPersistedState,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.ensureDemoSeeded();
      },
    },
  ),
);
