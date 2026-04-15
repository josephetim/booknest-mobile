import { fetchOpenLibraryJson, openLibraryEndpoints } from '@/src/shared/api/open-library';
import { extractOpenLibraryId } from '@/src/shared/lib/format';
import type { SavedBookSnapshot } from '@/src/features/shelves/models/local-shelf';
import { mapBookDetails } from '@/src/features/details/mappers/map-book-details';
import type {
  OpenLibraryWorkEditionsResponse,
  OpenLibraryWorkResponse,
  RemoteBookAuthor,
  RemoteBookDetail,
} from '@/src/features/details/models/remote-book';
import type { OpenLibraryAuthorResponse } from '@/src/features/authors/models/author';

export async function getBookDetails(
  olid: string,
  fallbackBook?: SavedBookSnapshot | null,
  signal?: AbortSignal,
): Promise<RemoteBookDetail> {
  if (!/^OL\d+W$/.test(olid)) {
    throw new Error('Only Open Library work IDs can be requested remotely.');
  }

  const [work, editions] = await Promise.all([
    fetchOpenLibraryJson<OpenLibraryWorkResponse>(openLibraryEndpoints.work(olid), { signal }),
    fetchOpenLibraryJson<OpenLibraryWorkEditionsResponse>(openLibraryEndpoints.workEditions(olid, 5), {
      signal,
    }),
  ]);

  const authorIds = (work.authors ?? [])
    .map((item) => extractOpenLibraryId(item.author?.key))
    .filter((value): value is string => Boolean(value));

  const authorResults = await Promise.allSettled(
    authorIds.map((authorId) =>
      fetchOpenLibraryJson<OpenLibraryAuthorResponse>(openLibraryEndpoints.author(authorId), {
        signal,
      }),
    ),
  );

  const authors: RemoteBookAuthor[] = authorResults
    .map((result, index) => {
      if (result.status !== 'fulfilled' || !result.value.name) {
        return null;
      }

      return {
        id: authorIds[index],
        name: result.value.name,
      };
    })
    .filter((value): value is RemoteBookAuthor => Boolean(value));

  return mapBookDetails({
    work,
    editions,
    authors,
    fallbackBook,
  });
}
