import { useQuery } from '@tanstack/react-query';

import { getAuthorProfile } from '@/src/features/authors/api/get-author-profile';

export function useAuthorProfile(id: string) {
  return useQuery({
    queryKey: ['author-profile', id],
    queryFn: ({ signal }) => getAuthorProfile(id, signal),
    enabled: /^OL\d+A$/.test(id),
  });
}
