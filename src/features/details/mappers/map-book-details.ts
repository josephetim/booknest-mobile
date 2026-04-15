import type { SavedBookSnapshot } from '@/src/features/shelves/models/local-shelf';
import type {
  OpenLibraryWorkEditionsResponse,
  OpenLibraryWorkResponse,
  RemoteBookAuthor,
  RemoteBookDetail,
} from '@/src/features/details/models/remote-book';
import {
  extractOpenLibraryId,
  parseOpenLibraryText,
  parseYear,
  uniqueStrings,
} from '@/src/shared/lib/format';

type MapBookDetailsArgs = {
  work: OpenLibraryWorkResponse;
  editions: OpenLibraryWorkEditionsResponse;
  authors: RemoteBookAuthor[];
  fallbackBook?: SavedBookSnapshot | null;
};

export function mapBookDetails({
  work,
  editions,
  authors,
  fallbackBook,
}: MapBookDetailsArgs): RemoteBookDetail {
  const olid = extractOpenLibraryId(work.key) ?? fallbackBook?.olid;

  if (!olid || !work.title) {
    throw new Error('Open Library returned an invalid work payload.');
  }

  const languageKeys = uniqueStrings([
    ...(work.languages ?? []).map((language) => extractOpenLibraryId(language.key)),
    ...(editions.entries ?? []).flatMap((entry) =>
      (entry.languages ?? []).map((language) => extractOpenLibraryId(language.key)),
    ),
    ...(fallbackBook?.languages ?? []),
  ]);

  return {
    olid,
    title: work.title,
    subtitle: work.subtitle ?? fallbackBook?.subtitle,
    authors:
      authors.length > 0
        ? authors
        : fallbackBook?.authors.map((name, index) => ({
            id: fallbackBook.authorIds[index] ?? `${olid}-author-${index}`,
            name,
          })) ?? [],
    firstPublishYear:
      parseYear(work.first_publish_date) ??
      parseYear(editions.entries?.[0]?.publish_date) ??
      fallbackBook?.firstPublishYear,
    subjects: uniqueStrings([...(work.subjects ?? []), ...(fallbackBook?.subjects ?? [])]).slice(0, 12),
    languages: languageKeys,
    editionCount: editions.size ?? fallbackBook?.editionCount,
    coverId: work.covers?.[0] ?? fallbackBook?.coverId,
    coverEditionKey: fallbackBook?.coverEditionKey,
    description: parseOpenLibraryText(work.description) ?? fallbackBook?.description,
  };
}
