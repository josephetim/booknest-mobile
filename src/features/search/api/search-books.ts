import { openLibraryEndpoints, fetchOpenLibraryJson } from '@/src/shared/api/open-library';
import { mapSearchResult } from '@/src/features/search/mappers/map-search-result';
import type {
  OpenLibrarySearchResponse,
  RemoteSearchBook,
  SearchMode,
} from '@/src/features/search/models/search-book';

export async function searchBooks(
  query: string,
  mode: SearchMode,
  signal?: AbortSignal,
): Promise<RemoteSearchBook[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const response = await fetchOpenLibraryJson<OpenLibrarySearchResponse>(
    openLibraryEndpoints.search(mode, trimmedQuery, 20),
    { signal },
  );

  return (response.docs ?? [])
    .map((doc) => mapSearchResult(doc))
    .filter((book): book is RemoteSearchBook => Boolean(book));
}
