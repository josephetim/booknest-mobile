import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { SearchMode } from '@/src/features/search/models/search-book';
import { searchBooks } from '@/src/features/search/api/search-books';

export function useSearchBooks(query: string, mode: SearchMode) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ['search', mode, trimmedQuery.toLowerCase()],
    queryFn: ({ signal }) => searchBooks(trimmedQuery, mode, signal),
    enabled: trimmedQuery.length >= 2,
    placeholderData: keepPreviousData,
  });
}
