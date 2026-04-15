import { fetchOpenLibraryJson, openLibraryEndpoints } from '@/src/shared/api/open-library';
import { mapAuthorProfile } from '@/src/features/authors/mappers/map-author-profile';
import type {
  AuthorProfile,
  OpenLibraryAuthorResponse,
  OpenLibraryAuthorWorksResponse,
} from '@/src/features/authors/models/author';

export async function getAuthorProfile(
  id: string,
  signal?: AbortSignal,
): Promise<AuthorProfile> {
  if (!/^OL\d+A$/.test(id)) {
    throw new Error('Only Open Library author IDs can be requested remotely.');
  }

  const [author, works] = await Promise.all([
    fetchOpenLibraryJson<OpenLibraryAuthorResponse>(openLibraryEndpoints.author(id), { signal }),
    fetchOpenLibraryJson<OpenLibraryAuthorWorksResponse>(openLibraryEndpoints.authorWorks(id, 18), {
      signal,
    }),
  ]);

  return mapAuthorProfile(author, works);
}
