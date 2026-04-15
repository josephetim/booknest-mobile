import type { AuthorWorkSummary } from '@/src/features/authors/models/author';
import type { RemoteBookDetail } from '@/src/features/details/models/remote-book';
import type { RemoteSearchBook } from '@/src/features/search/models/search-book';
import type { SavedBookSnapshot } from '@/src/features/shelves/models/local-shelf';
import { uniqueStrings } from '@/src/shared/lib/format';

export function snapshotFromSearchBook(book: RemoteSearchBook): SavedBookSnapshot {
  return {
    olid: book.olid,
    title: book.title,
    subtitle: book.subtitle,
    authors: book.authors,
    authorIds: book.authorIds,
    firstPublishYear: book.firstPublishYear,
    editionCount: book.editionCount,
    languages: book.languages,
    coverId: book.coverId,
    coverEditionKey: book.coverEditionKey,
    source: 'open-library',
  };
}

export function snapshotFromRemoteBook(book: RemoteBookDetail): SavedBookSnapshot {
  return {
    olid: book.olid,
    title: book.title,
    subtitle: book.subtitle,
    authors: book.authors.map((author) => author.name),
    authorIds: book.authors.map((author) => author.id),
    firstPublishYear: book.firstPublishYear,
    editionCount: book.editionCount,
    languages: book.languages,
    coverId: book.coverId,
    coverEditionKey: book.coverEditionKey,
    description: book.description,
    subjects: book.subjects,
    source: 'open-library',
  };
}

export function snapshotFromAuthorWork(
  work: AuthorWorkSummary,
  authorName: string,
  authorId: string,
): SavedBookSnapshot {
  return {
    olid: work.olid,
    title: work.title,
    authors: [authorName],
    authorIds: authorId ? [authorId] : [],
    firstPublishYear: work.firstPublishYear,
    languages: [],
    coverId: work.coverId,
    source: 'open-library',
  };
}

export function mergeBookSnapshot(
  remoteBook?: RemoteBookDetail | null,
  fallbackBook?: SavedBookSnapshot | null,
): SavedBookSnapshot | null {
  if (remoteBook) {
    const remoteSnapshot = snapshotFromRemoteBook(remoteBook);

    return {
      ...fallbackBook,
      ...remoteSnapshot,
      authors: uniqueStrings([...(remoteSnapshot.authors ?? []), ...(fallbackBook?.authors ?? [])]),
      authorIds: uniqueStrings([
        ...(remoteSnapshot.authorIds ?? []),
        ...(fallbackBook?.authorIds ?? []),
      ]),
      languages: uniqueStrings([
        ...(remoteSnapshot.languages ?? []),
        ...(fallbackBook?.languages ?? []),
      ]),
      subjects: uniqueStrings([...(remoteSnapshot.subjects ?? []), ...(fallbackBook?.subjects ?? [])]),
      source: remoteSnapshot.source,
    };
  }

  return fallbackBook ?? null;
}
