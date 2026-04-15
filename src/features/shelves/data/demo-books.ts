import type { LibraryPersistedState, SavedBookSnapshot } from '@/src/features/shelves/models/local-shelf';

const demoBooks: SavedBookSnapshot[] = [
  {
    olid: 'OL15165350W',
    title: 'Pride and Prejudice',
    authors: ['Jane Austen'],
    authorIds: ['OL21594A'],
    firstPublishYear: 1813,
    editionCount: 133,
    languages: ['eng'],
    coverId: 13148521,
    description:
      'The Bennet sisters maneuver inheritance, pride, and disastrous first impressions in one of the sharpest courtship novels ever written.',
    subjects: ['Courtship', 'Families', 'Social classes', 'Romance'],
    source: 'demo',
  },
  {
    olid: 'DEMO-MIDNIGHT-LIBRARY',
    title: 'The Midnight Library',
    authors: ['Matt Haig'],
    authorIds: [],
    firstPublishYear: 2020,
    editionCount: 1,
    languages: ['eng'],
    description:
      'A warm speculative novel about alternate lives, regret, and the quiet courage required to keep turning the page.',
    subjects: ['Fantasy', 'Self-discovery', 'Parallel lives'],
    source: 'demo',
  },
  {
    olid: 'DEMO-BELOVED',
    title: 'Beloved',
    authors: ['Toni Morrison'],
    authorIds: [],
    firstPublishYear: 1987,
    editionCount: 1,
    languages: ['eng'],
    description:
      'A haunting, lyrical story about memory, grief, and the long afterlife of survival.',
    subjects: ['Historical fiction', 'Family', 'Memory'],
    source: 'demo',
  },
];

export function createDemoLibraryState(): LibraryPersistedState {
  const now = new Date().toISOString();

  return {
    entries: {
      [demoBooks[0].olid]: {
        book: demoBooks[0],
        shelf: 'wantToRead',
        progress: 0,
        notes: '',
        addedAt: now,
        updatedAt: now,
      },
      [demoBooks[1].olid]: {
        book: demoBooks[1],
        shelf: 'reading',
        progress: 42,
        notes: 'A good demo note: track the chapters that change your mind.',
        addedAt: now,
        updatedAt: now,
      },
      [demoBooks[2].olid]: {
        book: demoBooks[2],
        shelf: 'finished',
        progress: 100,
        notes: 'Finished. Worth revisiting for the voice alone.',
        addedAt: now,
        updatedAt: now,
      },
    },
    recentlyViewed: demoBooks.slice(0, 2).map((book) => ({
      book,
      viewedAt: now,
    })),
    hasDemoSeeded: true,
  };
}
