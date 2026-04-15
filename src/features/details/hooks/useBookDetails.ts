import { useQuery } from '@tanstack/react-query';

import { getBookDetails } from '@/src/features/details/api/get-book-details';
import type { SavedBookSnapshot } from '@/src/features/shelves/models/local-shelf';

export function useBookDetails(olid: string, fallbackBook?: SavedBookSnapshot | null) {
  return useQuery({
    queryKey: ['book-details', olid],
    queryFn: ({ signal }) => getBookDetails(olid, fallbackBook, signal),
    enabled: /^OL\d+W$/.test(olid),
  });
}
